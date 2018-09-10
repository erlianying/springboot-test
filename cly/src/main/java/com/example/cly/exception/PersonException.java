package com.example.cly.exception;

public class PersonException extends  RuntimeException{

    private String code;

    public PersonException(String code, String message) {
        super(message);
        this.code = code;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }
}
