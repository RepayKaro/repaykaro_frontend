// /app/api/inquiry/route.ts or /pages/api/inquiry.ts (depending on routing style)

import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function POST(req: NextRequest) {
    try {
        const { firstName, lastName, phone, email, message } = await req.json();

        if (!firstName || !lastName || !phone || !email || !message) {
            return NextResponse.json({
                success: false,
                message: 'All fields are required.',
            }, { status: 400 });
        }

        const res = await fetch(`${API_BASE_URL}/auth/inquiry`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ firstName, lastName, phone, email, message }),
        });

        const data = await res.json();
        console.log("Inquiry API response:", data);

        if (!res.ok || !data.success) {
            return NextResponse.json({
                success: false,
                message: data.message || 'Submission failed.',
            }, { status: 400 });
        }

        return NextResponse.json({
            success: true,
            message: 'Inquiry submitted successfully!',
        });
    } catch (error) {
        console.error('Inquiry API error:', error);
        return NextResponse.json({
            success: false,
            message: 'Server error. Please try again later.',
        }, { status: 500 });
    }
}
