import { apiClient } from "../api-client";
import {ApiResponse, DatabaseSchemaData} from "@/lib/type";


export const fetchDatabaseSchema = async (): Promise<DatabaseSchemaData> => {
    const response = await apiClient.post<ApiResponse<DatabaseSchemaData>>('/copilot/schema');
    return response.data.data;
};

