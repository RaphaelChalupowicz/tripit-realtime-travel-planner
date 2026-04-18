type RequestMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface Result<T> {
  success: boolean;
  data?: T;
  error?: string;
}

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5122"
).replace(/\/$/, "");

function getErrorMessage(
  status: number,
  fallback = "An error occurred",
): string {
  return `${fallback}. Http code ${status}`;
}

async function manageResultWithStatus<TResponse>(
  response: Response,
): Promise<Result<TResponse>> {
  if (response.ok) {
    if (response.status === 204) {
      return { success: true, data: undefined as TResponse };
    }

    try {
      const jsonResult = (await response.json()) as TResponse;
      return { success: true, data: jsonResult };
    } catch {
      return { success: false, error: "Response body is not valid JSON" };
    }
  }

  try {
    const jsonResult = (await response.json()) as {
      error?: string;
      message?: string;
    };
    const errorMessage =
      jsonResult?.error ??
      jsonResult?.message ??
      getErrorMessage(response.status);
    return { success: false, error: errorMessage };
  } catch {
    return { success: false, error: getErrorMessage(response.status) };
  }
}

async function tryFetchDataWithResult<TResponse>(
  action: string,
  options: RequestInit,
): Promise<Result<TResponse>> {
  const normalizedAction = action.startsWith("/") ? action : `/${action}`;

  try {
    const response = await fetch(`${API_BASE_URL}${normalizedAction}`, options);
    return await manageResultWithStatus<TResponse>(response);
  } catch {
    return {
      success: false,
      error: `Action ${normalizedAction.split("/").pop() ?? normalizedAction} failed`,
    };
  }
}

export function requestWithStatus<TRequest = undefined, TResponse = undefined>(
  api: string,
  method: RequestMethod,
  body?: TRequest,
): Promise<Result<TResponse>> {
  const headers = new Headers();
  headers.append("accept", "application/json");

  const options: RequestInit = {
    method,
    headers,
    redirect: "follow",
  };

  if (body !== undefined) {
    headers.append("Content-Type", "application/json");
    options.body = JSON.stringify(body);
  }

  return tryFetchDataWithResult<TResponse>(api, options);
}

export function request<TRequest = undefined, TResponse = undefined>(
  api: string,
  method: RequestMethod,
  body?: TRequest,
  handleError?: (error: string) => void,
): Promise<TResponse | undefined> {
  return requestWithStatus<TRequest, TResponse>(api, method, body).then(
    (res) => {
      if (res.success && res.data !== undefined) {
        return res.data;
      }

      if (res.error && handleError) {
        handleError(res.error);
      }

      return undefined;
    },
  );
}

export function handleError(error: unknown): void {
  console.error(error);
}
