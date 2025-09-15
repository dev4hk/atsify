package com.example.api.dto;

import lombok.Data;

@Data
public class ResumeAnalysisResponse {
    private int overallScore;
    private Category ats;
    private Category toneAndStyle;
    private Category content;
    private Category structure;
    private Category skills;
}
