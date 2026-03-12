export interface ApiError {
  message: string;
  status: number;
}
export interface ApiOptions extends RequestInit {
  timeout?: number;
  retries?: number;
}
const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));
export async function apiClient<T>(url: string, options: ApiOptions = {}): Promise<T> {
  const { timeout = 5000, retries = 2, headers, ...rest } = options;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, {
      ...rest,
      headers: {
        'Content-Type': 'application/json',
        ...(headers || {}),
      },
      signal: controller.signal,
    });
    if (!response.ok) {
      throw {
        status: response.status,
        message: `HTTP ${response.status}`,
      } as ApiError;
    }
    return (await response.json()) as T;
  } catch (err) {
    let errorObj: ApiError;
    if (err instanceof Error) {
      errorObj = { message: err.message, status: 0 };
    } else if (typeof err === 'object' && err !== null && 'status' in err && 'message' in err) {
      errorObj = err as ApiError;
    } else {
      errorObj = { message: 'Unknown error', status: 0 };
    }
    if (retries > 0) {
      const attempt = 2 - retries;
      const backoff = 1000 * Math.pow(2, attempt);
      await delay(backoff);
      return apiClient<T>(url, {
        ...options,
        retries: retries - 1,
      });
    }
    throw errorObj;
  } finally {
    clearTimeout(id);
  }
}