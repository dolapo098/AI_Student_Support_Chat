import axios, { type AxiosInstance } from "axios";
import { KentAxiosInterceptor } from "./axiosInterceptor";

/**
 * DSH-style HTTP client factory: Axios instance + shared config (interceptors applied after build).
 */
export class AxiosClientService {
  public readonly axiosInstance: AxiosInstance;

  constructor(baseURL: string) {
    this.axiosInstance = axios.create({
      baseURL,
      headers: { "Content-Type": "application/json" },
      withCredentials: false,
      timeout: 120_000,
    });
  }
}

const KENT_API_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api/v1";

if (import.meta.env.DEV) {
  console.info("[Kay UI] Kent AI Service (FastAPI):", KENT_API_URL);
}

const kentClientService = new AxiosClientService(KENT_API_URL);
new KentAxiosInterceptor().apply(kentClientService.axiosInstance);

/** Axios instance for Kent AI Service (base URL includes `/api/v1`). */
export const kentApiClient = kentClientService.axiosInstance;
