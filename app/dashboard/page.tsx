'use client';
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
    const pathname = usePathname();
    useEffect(() => {
        console.log("Current route:", pathname);
    }, [pathname]);
    return (
        <div className="min-h-screen flex items-center justify-center">
            <h1 className="text-3xl font-bold">Dashboard</h1>
        </div>
    );
} 