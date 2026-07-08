"use client";

import { useEffect, useState, useCallback } from "react";
import * as signalR from "@microsoft/signalr";

export interface ActivityLog {
    id: number;
    organizationId: number;
    userId: string;
    action: string;
    entityName: string;
    entityId: string;
    oldValue: string;
    newValue: string;
    timestamp: string;
}

export interface UserLoginLog {
    id: number;
    userEmail: string;
    ipAddress: string;
    isSuccess: boolean;
    failureReason: string | null;
    timestamp: string;
    userAgent: string;
}

export interface TelemetryData {
    kpIs: {
        failedLoginsToday: number;
        activeSecurityAlerts: number;
        activeUsersCount: number;
    };
    charts: {
        activityTrend: Array<{ date: string; count: number }>;
        categoryDistribution: Array<{ category: string; count: number }>;
    };
}

export function useAuditHub() {
    const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
    const [activities, setActivities] = useState<ActivityLog[]>([]);
    const [logins, setLogins] = useState<UserLoginLog[]>([]);
    const [telemetry, setTelemetry] = useState<TelemetryData | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("lms_bearer_token");
        if (!token) return;

        // 🛠️ Dynamically translate HTTP/S endpoints into WS/S protocol schemes
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7286";
        const wsUrl = baseUrl.replace(/^http/, "ws"); // Turns https:// into wss://, http:// into ws://

        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl(`${wsUrl}/hubs/audit`, {
                accessTokenFactory: () => token,
                skipNegotiation: true, // Requires ws:// or wss:// protocol schema explicitly
                transport: signalR.HttpTransportType.WebSockets,
            })
            .withAutomaticReconnect()
            .configureLogging(signalR.LogLevel.Information)
            .build();

        setConnection(newConnection);
    }, []);

    useEffect(() => {
        if (!connection) return;

        connection
            .start()
            .then(() => {
                setIsConnected(true);

                // Map initial structural data streams arriving from Hub OnConnectedAsync loop
                connection.on("LoadInitialActivities", (data: ActivityLog[]) => setActivities(data));
                connection.on("LoadInitialLogins", (data: UserLoginLog[]) => setLogins(data));
                connection.on("ReceiveSecurityTelemetry", (data: TelemetryData) => setTelemetry(data));

                // Real-time delta block additions arriving from global middleware pipeline intercepts
                connection.on("ReceiveActivitiesUpdate", (newActivities: ActivityLog[]) => {
                    setActivities((prev) => [...newActivities, ...prev].slice(0, 30));
                });
                connection.on("ReceiveLoginsUpdate", (newLogins: UserLoginLog[]) => {
                    setLogins((prev) => [...newLogins, ...prev].slice(0, 30));
                });
            })
            .catch((err) => console.error("SignalR Connection Failure Stack:", err));

        return () => {
            connection.stop();
        };
    }, [connection]);

    // Expose manual push operations back down down to the active instance hub
    const refreshMetrics = useCallback(async () => {
        if (connection && isConnected) {
            await connection.invoke("GetSecurityTelemetryMetrics");
        }
    }, [connection, isConnected]);

    return { activities, logins, telemetry, isConnected, refreshMetrics };
}