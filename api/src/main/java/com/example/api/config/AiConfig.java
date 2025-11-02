package com.example.api.config;

import com.example.api.advisors.TokenUsageAuditAdvisor;
import com.example.api.rag.PIIMaskingDocumentPostProcessor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.SimpleLoggerAdvisor;
import org.springframework.ai.rag.advisor.RetrievalAugmentationAdvisor;
import org.springframework.ai.rag.preretrieval.query.transformation.TranslationQueryTransformer;
import org.springframework.ai.rag.retrieval.search.VectorStoreDocumentRetriever;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class AiConfig {

    @Bean
    public ChatClient chatClient(
            ChatClient.Builder chatClientBuilder,
            RetrievalAugmentationAdvisor retrievalAugmentationAdvisor
    ) {
        return chatClientBuilder
                .defaultSystem(
                        """
                                You are an expert in ATS (Applicant Tracking System) and resume analysis.
                                The response must be data in JSON format only, without any leading or trailing text before and after the JSON data.
                                
                                Provide the feedback using the following format:
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
                                }
                                """
                )
                .defaultAdvisors(List.of(new SimpleLoggerAdvisor(), new TokenUsageAuditAdvisor(), retrievalAugmentationAdvisor))
                .build();
    }

    @Bean
    RetrievalAugmentationAdvisor retrievalAugmentationAdvisor(VectorStore vectorStore, ChatClient.Builder chatClientBuilder) {
        return RetrievalAugmentationAdvisor.builder()
                .queryTransformers(
                        TranslationQueryTransformer.builder()
                                .chatClientBuilder(chatClientBuilder.clone())
                                .targetLanguage("english")
                                .build()
                )
                .documentRetriever(
                        VectorStoreDocumentRetriever.builder()
                                .vectorStore(vectorStore)
                                .topK(3)
                                .similarityThreshold(0.5)
                                .build()
                )
                .documentPostProcessors(PIIMaskingDocumentPostProcessor.builder())
                .build();
    }
}