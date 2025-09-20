package com.example.api.exception;

public class AnalysisException extends BaseServiceException {
    public AnalysisException(String message) { super(message); }
    public AnalysisException(String message, Throwable cause) { super(message, cause); }
}
