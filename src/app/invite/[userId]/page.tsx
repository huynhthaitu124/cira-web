'use client';

import { useParams } from 'next/navigation';
import { useEffect } from 'react';

export default function InvitePage() {
    const params = useParams();
    const userId = params.userId as string;

    useEffect(() => {
        // Detect mobile
        const userAgent = navigator.userAgent || navigator.vendor;
        const mobile = /android|iphone|ipad|ipod/i.test(userAgent.toLowerCase());

        if (mobile && userId) {
            // Try to open app with deep link immediately
            const deepLink = `cira://invite/${userId}`;
            window.location.href = deepLink;

            // Fallback to App Store if app didn't open after a delay
            const timer = setTimeout(() => {
                const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent.toLowerCase());
                const appStoreUrl = 'https://apps.apple.com/app/cira/id123456789';
                const playStoreUrl = 'https://play.google.com/store/apps/details?id=com.cira.app';
                window.location.href = isIOS ? appStoreUrl : playStoreUrl;
            }, 2500);

            return () => clearTimeout(timer);
        }
    }, [userId]);

    return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            {/* Trang trắng hoàn toàn, chỉ hiển thị trạng thái đang chuyển tiếp cực kỳ tối giản */}
            <div className="text-gray-400 font-light animate-pulse">
                Đang chuyển hướng đến Cira...
            </div>
        </div>
    );
}
