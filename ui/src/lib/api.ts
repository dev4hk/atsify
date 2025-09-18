import axios from "axios";

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

export async function analyzeResume(
    file: File,
    job: JobDescriptionRequest
): Promise<ResumeAnalysisResponse> {
  const form = new FormData();
  form.append("file", file);
  form.append("job", new Blob([JSON.stringify(job)], { type: "application/json" }));

  const { data } = await api.post("/api/resume/analyze", form);
  return data;
}

export interface ContactMessageRequest {
  name: string;
  email: string;
  message: string;
}

export async function sendContactMessage(payload: ContactMessageRequest): Promise<void> {
  await api.post("/api/contact", payload);
}