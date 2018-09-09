package com.example.cly.enums;

public class Constant {

    public enum DICT{
        //状态
        ZT("zt"),

        //状态启用
        ZT_QY("1"),

        //成功
        SUCCESS("成功"),

        //失败
        ERROR("路径请求有误");

        private String value;

        DICT( String value) {
            this.value = value;
        }

        public String getValue() {
            return value;
        }
    }

    public enum RETURN_CODE{

        //未知错误
        UNKNOW_ERROR("-1","未知错误"),

        //成功
        SUCCESS("0","成功"),

        //失败
        ERROR("1","路径请求有误");

        private String key;

        private String value;

        RETURN_CODE( String key,String value) {
            this.key = key;
            this.value = value;
        }

        public String getKey() {
            return key;
        }
        public String getValue() {
            return value;
        }
    }
}
