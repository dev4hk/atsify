package com.example.api.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class ResumeAnalysisResponse {
    private int overallScore;
    private Category ats;
    private Category toneAndStyle;
    private Category content;
    private Category structure;
    private Category skills;
}
