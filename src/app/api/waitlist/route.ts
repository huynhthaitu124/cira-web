import { NextRequest, NextResponse } from 'next/server';
import { supabase, supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';

export async function POST(request: NextRequest) {
    try {
        // Check if Supabase is configured
        if (!isSupabaseConfigured()) {
            return NextResponse.json(
                { error: 'Database is not configured. Please contact support.' },
                { status: 503 }
            );
        }

        const body = await request.json();
        const { email, language = 'vi' } = body;

        // Validate email
        if (!email || !email.includes('@')) {
            return NextResponse.json(
                { error: 'Invalid email address' },
                { status: 400 }
            );
        }

        // Insert into waitlist using admin client to bypass RLS
        const { data, error } = await supabaseAdmin
            .from('waitlist')
            .insert([
                {
                    email: email.toLowerCase().trim(),
                    language,
                    metadata: {
                        user_agent: request.headers.get('user-agent'),
                        referrer: request.headers.get('referer'),
                        ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
                    }
                }
            ])
            .select()
            .single();

        if (error) {
            // Check if it's a duplicate email error
            if (error.code === '23505') {
                return NextResponse.json(
                    { error: 'This email is already on the waitlist', code: 'DUPLICATE_EMAIL' },
                    { status: 409 }
                );
            }

            console.error('❌ Supabase error details:');
            console.error('Error code:', error.code);
            console.error('Error message:', error.message);
            console.error('Error hint:', error.hint);
            console.error('Error details:', error.details);
            console.error('Full error:', JSON.stringify(error, null, 2));

            return NextResponse.json(
                { error: 'Failed to join waitlist', details: error.message },
                { status: 500 }
            );
        }

        // Send welcome email
        try {
            await sendWelcomeEmail(email, language);

            // Update email_sent status
            await supabaseAdmin
                .from('waitlist')
                .update({
                    email_sent: true,
                    email_sent_at: new Date().toISOString()
                })
                .eq('id', data.id);
        } catch (emailError) {
            console.error('Failed to send email:', emailError);
            // Don't fail the request if email fails
        }

        return NextResponse.json(
            {
                success: true,
                message: 'Successfully joined the waitlist',
                data: {
                    email: data.email,
                    language: data.language
                }
            },
            { status: 201 }
        );

    } catch (error) {
        console.error('Waitlist API error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

async function sendWelcomeEmail(email: string, language: 'vi' | 'en') {
    // Get email template
    const { data: template } = await supabaseAdmin
        .from('email_templates')
        .select('*')
        .eq('name', 'waitlist_welcome')
        .single();

    if (!template) {
        throw new Error('Email template not found');
    }

    const subject = language === 'vi' ? template.subject_vi : template.subject_en;
    const body = language === 'vi' ? template.body_vi : template.body_en;

    // Check if Resend is configured
    if (!process.env.RESEND_API_KEY) {
        console.log('⚠️  RESEND_API_KEY not configured - email will not be sent');
        console.log('📧 Would send email to:', email);
        console.log('📝 Subject:', subject);
        console.log('🌐 Language:', language);
        return;
    }

    try {
        // Use Resend SDK
        const { Resend } = require('resend');
        const resend = new Resend(process.env.RESEND_API_KEY);

        const { data, error } = await resend.emails.send({
            from: process.env.EMAIL_FROM || 'CIRA <onboarding@resend.dev>',
            to: [email],
            subject,
            html: body,
        });

        if (error) {
            console.error('❌ Resend error:', error);
            throw error;
        }

        console.log('✅ Email sent successfully via Resend:', data);
        return data;

    } catch (error) {
        console.error('❌ Failed to send email:', error);
        throw error;
    }
}

// GET endpoint to retrieve waitlist stats (optional, for admin)
export async function GET(request: NextRequest) {
    try {
        // Check if Supabase is configured
        if (!isSupabaseConfigured()) {
            return NextResponse.json(
                { error: 'Database is not configured. Please contact support.' },
                { status: 503 }
            );
        }

        const { data, error } = await supabaseAdmin
            .from('waitlist_stats')
            .select('*')
            .limit(30);

        if (error) {
            throw error;
        }

        return NextResponse.json({ data });
    } catch (error) {
        console.error('Failed to fetch stats:', error);
        return NextResponse.json(
            { error: 'Failed to fetch waitlist stats' },
            { status: 500 }
        );
    }
}
