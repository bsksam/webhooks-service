import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { db, initDb } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
    try {
        const rawBody = await req.text();
        const signature = req.headers.get('x-razorpay-signature');
        const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

        if (!secret) {
            console.error('RAZORPAY_WEBHOOK_SECRET is not defined');
            return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
        }

        if (!signature) {
            console.error('x-razorpay-signature header is missing');
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Verify signature
        const expectedSignature = crypto
            .createHmac('sha256', secret)
            .update(rawBody)
            .digest('hex');

        if (expectedSignature !== signature) {
            console.error('Invalid signature');
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload = JSON.parse(rawBody);
        const event = payload.event;

        console.log('Razorpay Webhook Event Received:', event);

        // Initialize DB (ensure table exists)
        await initDb();

        // Store in DB
        const id = uuidv4();
        await db.execute({
            sql: 'INSERT INTO webhooks (id, event, payload) VALUES (?, ?, ?)',
            args: [id, event, JSON.stringify(payload)],
        });

        // Handle specific events
        switch (event) {
            case 'payment.captured': {
                const payment = payload.payload.payment.entity;
                const amount = payment.amount / 100; // Razorpay uses paise
                const email = payment.email;
                const contact = payment.contact;

                console.log(`✅ Payment Captured! ID: ${payment.id}, Amount: ₹${amount}, User: ${email || contact}`);

                // TODO: Implement your specific business logic here
                // Example: await updateUserBalance(email, amount);
                // Example: await markOrderAsPaid(payment.notes.order_id);
                break;
            }
            case 'payment.failed': {
                const payment = payload.payload.payment.entity;
                console.log(`❌ Payment Failed! ID: ${payment.id}, Reason: ${payment.error_description}`);
                break;
            }
            case 'payment.authorized':
                console.log(`⌛ Payment Authorized: ${payload.payload.payment.entity.id}`);
                break;
            default:
                console.log('Event stored in DB:', event);
        }

        return NextResponse.json({ status: 'ok', id });
    } catch (error) {
        console.error('Webhook processing error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
