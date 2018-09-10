package com.example.cly.handle;

import com.example.cly.exception.PersonException;
import com.example.cly.result.Result;
import com.example.cly.util.ReturnResultUtil;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;

@ControllerAdvice
public class ExceptionHandle {

    @ExceptionHandler(value = Exception.class)
    @ResponseBody
    public Result handle(Exception e){
        if(e instanceof PersonException){
            PersonException personException = (PersonException) e;
            return ReturnResultUtil.error(((PersonException) e).getCode(),e.getMessage());
        }else{
            return ReturnResultUtil.error("-1","未知异常");
        }
    }
}
