package com.example.api.exception;

public class EmailSendException extends BaseServiceException {
    public EmailSendException(String message) { super(message); }
    public EmailSendException(String message, Throwable cause) { super(message, cause); }
}
