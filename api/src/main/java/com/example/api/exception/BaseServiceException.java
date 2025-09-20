package com.example.api.exception;

public class BaseServiceException extends RuntimeException {
    public BaseServiceException(String message) { super(message); }
    public BaseServiceException(String message, Throwable cause) { super(message, cause); }
}
