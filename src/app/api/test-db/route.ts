import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
    try {
        console.log('Testing Supabase connection...');
        console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
        console.log('Service Role Key exists:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);

        // Test simple SELECT
        const { data: selectData, error: selectError } = await supabaseAdmin
            .from('waitlist')
            .select('count')
            .limit(1);

        if (selectError) {
            console.error('SELECT error:', selectError);
            return NextResponse.json({
                success: false,
                error: 'SELECT failed',
                details: selectError
            });
        }

        console.log('SELECT success:', selectData);

        // Test INSERT
        const testEmail = `test-${Date.now()}@example.com`;
        const { data: insertData, error: insertError } = await supabaseAdmin
            .from('waitlist')
            .insert([{
                email: testEmail,
                language: 'vi',
                metadata: {}
            }])
            .select()
            .single();

        if (insertError) {
            console.error('INSERT error:', insertError);
            return NextResponse.json({
                success: false,
                error: 'INSERT failed',
                details: insertError,
                selectWorked: true
            });
        }

        console.log('INSERT success:', insertData);

        return NextResponse.json({
            success: true,
            message: 'Database connection works!',
            testEmail,
            data: insertData
        });

    } catch (error: any) {
        console.error('Test error:', error);
        return NextResponse.json({
            success: false,
            error: error.message,
            stack: error.stack
        });
    }
}
