import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function GET(
    request: Request,
    context: { params: { phoneNumber: string } }
) {
    try {
        // ✅ Await cookies() before using
        const cookieStore = await cookies();
        const adminToken = (await cookieStore).get('admin_token')?.value;

        if (!adminToken) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized: Admin token missing.' },
                { status: 401 }
            );
        }

        // ✅ Await context.params
        const { phoneNumber: rawPhoneNumber } = await context.params;
        console.log("phoneNumber",rawPhoneNumber)
        // ✅ Decode
       

        if (!rawPhoneNumber) {
            return NextResponse.json(
                { success: false, message: 'Missing required fields: phone number.' },
                { status: 400 }
            );
        }

        const response = await fetch(`${API_BASE_URL}/customers/customer-details/${rawPhoneNumber}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${adminToken}`,
                'Content-Type': 'application/json',
            },
            cache: 'no-store',
        });

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json(
                {
                    success: false,
                    message: errorData?.message || 'Failed to fetch customer.',
                },
                { status: response.status }
            );
        }

        const result = await response.json();
        return NextResponse.json(result, { status: 200 });

    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        console.error('Fetch customer error:', errorMessage);
        return NextResponse.json(
            {
                success: false,
                message: 'Internal server error while fetching customer data.',
            },
            { status: 500 }
        );
    }
}
