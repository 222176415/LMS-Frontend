"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface RoleGuardProps {
    children: React.ReactNode;
    allowedRoles: string[];
}

export function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        const role = localStorage.getItem("lms_user_role");

        if (!role || !allowedRoles.includes(role)) {
            router.replace("/dashboard");
        } else {
            setIsAuthorized(true);
        }
    }, [allowedRoles, router]);

    if (!isAuthorized) {
        return null; 
    }

    return <>{children}</>;
}