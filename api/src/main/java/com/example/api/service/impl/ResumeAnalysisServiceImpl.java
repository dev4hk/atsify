package com.example.api.service.impl;

import com.example.api.dto.JobDescriptionRequest;
import com.example.api.dto.ResumeAnalysisResponse;
import com.example.api.service.IResumeAnalysisService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ResumeAnalysisServiceImpl implements IResumeAnalysisService {

    private final ChatClient chatClient;

    @Override
    public ResumeAnalysisResponse analyze(String resumeText, JobDescriptionRequest jobRequest) {
        String prompt = buildPrompt(resumeText, jobRequest);

        String aiResponse = chatClient.prompt()
                .user(prompt)
                .call()
                .content();

        String jsonString = extractJson(aiResponse);

        ObjectMapper objectMapper = new ObjectMapper();
        try {
            return objectMapper.readValue(jsonString, ResumeAnalysisResponse.class);
        } catch (Exception e) {
            throw new RuntimeException("Failed to analyze resume", e);
        }
    }

    private String buildPrompt(String resumeText, JobDescriptionRequest jobRequest) {
        String AIResponseFormat = """
                {
                  "overallScore": number, // max 100
                  "ats": {
                    "score": number, // rate based on ATS suitability (0–100)
                    "tips": [
                      {
                        "type": "good" | "improve",
                        "tip": "string", // short title
                        "explanation": "string" //explain in detail here
                      }
                    ] // give 3–4 tips
                  },
                  "toneAndStyle": {
                    "score": number, // max 100
                    "tips": [
                      {
                        "type": "good" | "improve",
                        "tip": "string", //make it a short "title" for the actual explanation
                        "explanation": "string" //explain in detail here
                      }
                    ] // give 3–4 tips
                  },
                  "content": {
                    "score": number, // max 100
                    "tips": [
                      {
                        "type": "good" | "improve",
                        "tip": "string", //make it a short "title" for the actual explanation
                        "explanation": "string" //explain in detail here
                      }
                    ] // give 3–4 tips
                  },
                  "structure": {
                    "score": number, // max 100
                    "tips": [
                      {
                        "type": "good" | "improve",
                        "tip": "string", //make it a short "title" for the actual explanation
                        "explanation": "string" //explain in detail here
                      }
                    ] // give 3–4 tips
                  },
                  "skills": {
                    "score": number, // max 100
                    "tips": [
                      {
                        "type": "good" | "improve",
                        "tip": "string", //make it a short "title" for the actual explanation
                        "explanation": "string" //explain in detail here
                      }
                    ] // give 3–4 tips
                  }
                }""";

        return String.format("""
                        You are an expert in ATS (Applicant Tracking System) and resume analysis.
                        Please analyze and rate this resume and suggest how to improve it.
                        The rating can be low if the resume is bad. Be thorough and detailed.
                        Don't be afraid to point out any mistakes or areas for improvement.
                        If there is a lot to improve, don't hesitate to give low scores.
                        If available, use the job description for the job user is applying to to give more detailed feedback.
                        The job title is: %s
                        The job description is: %s
                        Provide the feedback using the following format: %s
                        The resume is: %s
                        Return the analysis as a JSON object, without any other text and without the backticks.
                        Do not include any other text or comments.
                        """,
                jobRequest.getRole() != null ? jobRequest.getRole() : "",
                jobRequest.getJobDescription(),
                AIResponseFormat,
                resumeText
        );
    }

    private String extractJson(String aiResponse) {
        int start = aiResponse.indexOf("{");
        int end = aiResponse.lastIndexOf("}");
        if (start >= 0 && end >= 0 && end > start) {
            return aiResponse.substring(start, end + 1);
        }
        return aiResponse;
    }
}
