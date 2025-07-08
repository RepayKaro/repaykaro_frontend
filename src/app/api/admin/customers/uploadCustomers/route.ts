import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { Readable } from 'stream';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

interface StreamRequestInit extends Omit<RequestInit, 'duplex'> {
  duplex: 'half';
}

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const adminToken = cookieStore.get('admin_token')?.value;

    if (!adminToken) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: Admin token missing.' },
        { status: 401 }
      );
    }

    const contentType = req.headers.get('content-type') || '';
    const isMultipart = contentType.includes('multipart/form-data');
    if (!isMultipart) {
      return NextResponse.json(
        { success: false, message: 'Expected multipart/form-data content type.' },
        { status: 400 }
      );
    }

    // ✅ Read and size-check stream
    const reader = req.body?.getReader();
    if (!reader) {
      return NextResponse.json({ success: false, message: 'Failed to read file stream.' }, { status: 400 });
    }

    let totalSize = 0;
    const chunks: Uint8Array[] = [];

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      totalSize += value?.length || 0;

      if (totalSize > MAX_SIZE_BYTES) {
        return NextResponse.json(
          { success: false, message: 'File exceeds maximum size limit of 5MB.' },
          { status: 413 } // 413 = Payload Too Large
        );
      }

      chunks.push(value);
    }

    // ✅ Reconstruct the stream for fetch
    const buffer = Buffer.concat(chunks);
    const stream = Readable.from(buffer);

    const fetchOptions: StreamRequestInit = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${adminToken}`,
        'Content-Type': contentType,
      },
      body: stream as unknown as ReadableStream<Uint8Array>,
      duplex: 'half',
    };

    const backendResponse = await fetch(`${API_BASE_URL}/customers/uploadCustomers`, fetchOptions);

    let backendData;
    try {
      backendData = await backendResponse.json();
    } catch (e) {
      console.log("error parsing backend response:", e);
      const text = await backendResponse.text();
      return NextResponse.json({ success: false, message: 'Backend returned invalid response', raw: text }, { status: 500 });
    }

    if (!backendResponse.ok || !backendData.success) {
      return NextResponse.json(
        {
          success: false,
          message: backendData.message || 'Upload failed at backend.',
          missingHeaders: backendData.missingHeaders || [],
          responseTime: backendData.responseTime,
        },
        { status: backendResponse.status || 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: backendData.message || 'Excel uploaded successfully.',
      data: backendData,
      responseTime: backendData.responseTime,
    });

  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error('❌ Excel Upload Proxy Error:', errorMessage);
    return NextResponse.json(
      { success: false, message: 'Server error during file proxy.' },
      { status: 500 }
    );
  }
}
