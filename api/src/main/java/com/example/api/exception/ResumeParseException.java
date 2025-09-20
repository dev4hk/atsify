package com.example.api.exception;

public class ResumeParseException extends BaseServiceException {
    public ResumeParseException(String message) { super(message); }
    public ResumeParseException(String message, Throwable cause) { super(message, cause); }
}
