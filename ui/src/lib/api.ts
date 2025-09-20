import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";

export interface JobDescriptionRequest {
  role: string;
  jobDescription: string;
}

export type ResumeAnalysisResponse = any;

export const api = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    Accept: "application/json",
  },
  withCredentials: false,
  timeout: 180000,
});

export function getErrorMessage(error: unknown): string {
  const err = error as AxiosError<any> & { message?: string };
  const data = err?.response?.data;

  if (data && typeof data === "object" && !Array.isArray(data)) {
    const keys = Object.keys(data);
    const looksLikeFieldMap = keys.length > 0 && typeof (data as any)[keys[0]] === "string";
    if (looksLikeFieldMap && !("errorMessage" in (data as any))) {
      const messages = Object.values(data).filter(Boolean) as string[];
      if (messages.length) return messages.slice(0, 3).join("\n");
    }
  }

  if ((data as any)?.errorMessage) return String((data as any).errorMessage);

  if ((data as any)?.message) return String((data as any).message);
  if (err?.message) return String(err.message);

  return "Unexpected error. Please try again.";
}

export function getValidationErrors(error: unknown): Record<string, string> {
  const err = error as AxiosError<any>;
  const data = err?.response?.data;
  if (data && typeof data === "object" && !Array.isArray(data)) {
    const keys = Object.keys(data);
    const looksLikeFieldMap = keys.length > 0 && typeof (data as any)[keys[0]] === "string";
    if (looksLikeFieldMap && !("errorMessage" in (data as any))) {
      return data as Record<string, string>;
    }
  }
  return {};
}

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    const axiosErr = error as AxiosError;
    const suppress = (axiosErr.config?.headers as any)?.["X-Suppress-Error-Toast"];
    const message = getErrorMessage(error);
    (axiosErr as any).normalizedMessage = message;
    if (!suppress) {
      toast.error(message);
    }
    return Promise.reject(axiosErr);
  }
);

export async function analyzeResume(
  file: File,
  job: JobDescriptionRequest,
  opts?: { suppressToast?: boolean }
): Promise<ResumeAnalysisResponse> {
  const form = new FormData();
  form.append("file", file);
  form.append("job", new Blob([JSON.stringify(job)], { type: "application/json" }));

  const { data } = await api.post("/api/resume/analyze", form, {
    headers: opts?.suppressToast ? { "X-Suppress-Error-Toast": true } : undefined,
  });
  return data;
}

export interface ContactMessageRequest {
  name: string;
  email: string;
  message: string;
}

export async function sendContactMessage(payload: ContactMessageRequest, opts?: { suppressToast?: boolean }): Promise<void> {
  await api.post("/api/contact", payload, {
    headers: opts?.suppressToast ? { "X-Suppress-Error-Toast": true } : undefined,
  });
}