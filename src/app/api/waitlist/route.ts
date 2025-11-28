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
        const { email, first_name, last_name, age, language = 'vi' } = body;

        // Validate email
        if (!email || !email.includes('@')) {
            return NextResponse.json(
                { error: 'Invalid email address' },
                { status: 400 }
            );
        }

        // Validate required fields
        if (!first_name || !last_name || !age) {
            return NextResponse.json(
                { error: 'First name, last name, and age are required' },
                { status: 400 }
            );
        }

        // Validate age
        if (typeof age !== 'number' || age < 1 || age > 150) {
            return NextResponse.json(
                { error: 'Invalid age' },
                { status: 400 }
            );
        }

        // Check if email already exists in waitlist
        const normalizedEmail = email.toLowerCase().trim();
        const { data: existingEntry, error: checkError } = await supabaseAdmin
            .from('waitlist')
            .select('id, email')
            .eq('email', normalizedEmail)
            .maybeSingle();

        if (checkError) {
            console.error('❌ Error checking existing email:', checkError);
            // Continue anyway, the insert will catch duplicates via constraint
        }

        if (existingEntry) {
            return NextResponse.json(
                {
                    error: 'Email này đã có trong danh sách chờ / This email is already on the waitlist',
                    code: 'DUPLICATE_EMAIL'
                },
                { status: 409 }
            );
        }

        // Insert into waitlist using admin client to bypass RLS
        const { data, error } = await supabaseAdmin
            .from('waitlist')
            .insert([
                {
                    email: email.toLowerCase().trim(),
                    first_name: first_name.trim(),
                    last_name: last_name.trim(),
                    age,
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

    // Check if SMTP is configured
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.log('⚠️  SMTP not configured - email will not be sent');
        console.log('📧 Would send email to:', email);
        console.log('📝 Subject:', subject);
        console.log('🌐 Language:', language);
        return;
    }

    try {
        // Use Nodemailer with SMTP
        const nodemailer = require('nodemailer');

        // Create transporter
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        // Send email
        const info = await transporter.sendMail({
            from: process.env.EMAIL_FROM || `"CIRA" <${process.env.SMTP_USER}>`,
            to: email,
            subject: subject,
            html: body,
        });

        console.log('✅ Email sent successfully:', info.messageId);
        return info;

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
