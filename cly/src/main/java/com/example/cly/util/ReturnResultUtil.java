package com.example.cly.util;

import com.example.cly.enums.Constant;
import com.example.cly.result.Result;

public class ReturnResultUtil {

    public static Result returnError(Object data){
        Result result = new Result();
        result.setCode(Constant.RETURN_CODE.ERROR.getKey());
        result.setMsg(Constant.RETURN_CODE.ERROR.getValue());
        result.setData(data);
        return result;
    }

    public static Result error(String code,String msg,Object data){
        Result result = new Result();
        result.setCode(code);
        result.setMsg(msg);
        result.setData(data);
        return result;
    }

    public static Result error(String code,String msg){
        Result result = new Result();
        result.setCode(code);
        result.setMsg(msg);
        result.setData(null);
        return result;
    }


    public static Result returnSuccess(Object data){
        Result result = new Result();
        result.setCode(Constant.RETURN_CODE.SUCCESS.getKey());
        result.setMsg(Constant.RETURN_CODE.SUCCESS.getValue());
        result.setData(data);
        return result;
    }

}
