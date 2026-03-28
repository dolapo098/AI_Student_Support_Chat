import type { AxiosError, AxiosInstance, AxiosResponse } from "axios";

/**
 * Global response interceptor for the Kent API client (logging + pass-through reject).
 * Extend this class later for auth, toasts, etc., without bloating {@link AxiosClientService}.
 */
export class KentAxiosInterceptor {
  public apply(instance: AxiosInstance): void {
    instance.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError) => {
        console.error(
          `API Error [${error.config?.url}]:`,
          error.response?.data ?? error.message,
        );
        return Promise.reject(error);
      },
    );
  }
}
