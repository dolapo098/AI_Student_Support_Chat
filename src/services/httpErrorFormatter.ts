import axios from "axios";

type ErrorBody = {
  detail?: unknown;
  message?: string;
  error?: { message?: string };
};

function pickMessageFromBody(data: unknown): string | null {
  if (data == null || typeof data !== "object") return null;
  const d = data as ErrorBody;

  if (typeof d.error?.message === "string") return d.error.message;
  if (typeof d.detail === "string") return d.detail;
  if (Array.isArray(d.detail)) {
    const parts = d.detail.map((item: { msg?: string; type?: string }) =>
      typeof item?.msg === "string" ? item.msg : JSON.stringify(item),
    );
    if (parts.length) return parts.join(" ");
  }
  if (typeof d.message === "string") return d.message;
  return null;
}

function networkHint(apiBaseUrl: string): string {
  return (
    `Cannot reach the API (${apiBaseUrl}). Either the server is stopped, or CORS blocked the browser ` +
    `(open the app as http://localhost:5173 or http://127.0.0.1:5173 and ensure the backend ` +
    `ALLOWED_ORIGINS includes that exact URL).`
  );
}

/**
 * Maps an Axios failure (or unknown throw) to a single user-visible string for inline UI (e.g. chat).
 */
export function mapAxiosErrorToUserMessage(error: unknown, apiBaseUrl: string): string {
  if (!axios.isAxiosError(error)) {
    return "Unexpected error - try again.";
  }

  const fromBody = error.response?.data != null ? pickMessageFromBody(error.response.data) : null;
  if (fromBody) return fromBody;

  if (error.code === "ERR_NETWORK" || error.message === "Network Error") {
    return networkHint(apiBaseUrl);
  }

  if (error.response) {
    return `Request failed (${error.response.status}). Check API logs.`;
  }

  return error.message || "Request failed.";
}
