import { requestWithStatus, type Result } from "./apiClient";

export interface HealthResponse {
  message: string;
}

export function getHealth(): Promise<Result<HealthResponse>> {
  return requestWithStatus<undefined, HealthResponse>("/Health", "GET");
}
