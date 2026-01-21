'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vireabjnzjubdqpwfyrq.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZpcmVhYmpuemp1YmRxcHdmeXJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5NjA3OTEsImV4cCI6MjA3OTUzNjc5MX0.QMSm4wgr8jelgOYEt9mZn8q-Q-wGfHmfU78cv0vMA60';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface Friend {
    username: string;
    avatar_data?: string;
}

export default function InvitePage() {
    const params = useParams();
    const userId = params.userId as string;

    const [friend, setFriend] = useState<Friend | null>(null);
    const [loading, setLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const [appOpened, setAppOpened] = useState(false);

    useEffect(() => {
        // Detect mobile
        const userAgent = navigator.userAgent || navigator.vendor;
        const mobile = /android|iphone|ipad|ipod/i.test(userAgent.toLowerCase());
        setIsMobile(mobile);

        // Fetch friend info
        const fetchFriend = async () => {
            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('username, avatar_data')
                    .eq('id', userId)
                    .single();

                if (!error && data) {
                    setFriend(data);
                }
            } catch (err) {
                console.error('Failed to fetch friend:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchFriend();

        // Auto-redirect on mobile if app installed
        if (mobile) {
            // Try to open app with deep link
            const deepLink = `cira://invite/${userId}`;
            window.location.href = deepLink;

            // Fallback to App Store after 2 seconds if app didn't open
            setTimeout(() => {
                if (!appOpened) {
                    // Show download button instead of auto-redirect
                    setAppOpened(true);
                }
            }, 2000);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId]);



    const handleOpenApp = () => {
        const deepLink = `cira://invite/${userId}`;
        window.location.href = deepLink;
        setAppOpened(true);
    };

    const handleDownload = () => {
        // Replace with actual App Store link when available
        const appStoreUrl = 'https://apps.apple.com/app/cira/id123456789';
        const playStoreUrl = 'https://play.google.com/store/apps/details?id=com.cira.app';

        const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent.toLowerCase());
        window.location.href = isIOS ? appStoreUrl : playStoreUrl;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
                <div className="text-white text-xl">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Card */}
                <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
                    {/* Logo */}
                    <div className="flex justify-center mb-8">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                            <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-white mb-3">
                            {friend ? `${friend.username} invited you!` : 'Join Cira'}
                        </h1>
                        <p className="text-gray-300 text-lg">
                            Connect with friends and share memories
                        </p>
                    </div>

                    {/* Friend Preview */}
                    {friend && (
                        <div className="mb-8 flex items-center justify-center space-x-4 p-6 bg-white/5 rounded-2xl backdrop-blur border border-white/10">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                                {friend.username.charAt(0).toUpperCase()}
                            </div>
                            <div className="text-left">
                                <p className="text-white font-semibold text-xl">{friend.username}</p>
                                <p className="text-gray-400 text-sm">wants to connect with you</p>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="space-y-3">
                        {isMobile ? (
                            <>
                                <button
                                    onClick={handleOpenApp}
                                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                                >
                                    Open in Cira App
                                </button>

                                {appOpened && (
                                    <button
                                        onClick={handleDownload}
                                        className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 border border-white/20 backdrop-blur"
                                    >
                                        Download Cira
                                    </button>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-4">
                                <p className="text-gray-300 mb-4">
                                    Download Cira on your mobile device to connect
                                </p>
                                <button
                                    onClick={handleDownload}
                                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                                >
                                    Get the App
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="mt-8 text-center">
                        <p className="text-gray-400 text-sm">
                            Cira - Share memories with friends & family
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
