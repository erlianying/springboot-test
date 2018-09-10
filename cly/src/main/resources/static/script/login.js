
$(document).ready(function(){
    if(window.top != window){
        window.top.location.href = context;
    }
    $(document).on("click", "#login-button", function(){
        loginIn();
    });
    $(document).keyup(function(e){
        if(e.keyCode == 13){
            loginIn();
        }
    })
});

function loginIn(){
    var username = $("#usernameipt").val() ;
    var password = $("#passwordipt").val() ;
    if(username.indexOf("<") != -1
        || username.indexOf(">") != -1
        || username.indexOf("/") != -1
        || username.indexOf("\\") != -1
        || username.indexOf(":") != -1
        || username.indexOf(";") != -1
        || username.indexOf("&") != -1
        || username.indexOf("|") != -1
        || username.indexOf("'") != -1
        || username.indexOf("\"") != -1){
        $.layerAlert.alert({msg:"用户名不能包含特殊符号！",title:"提示"});
        return ;
    }
    if(username==null || username.length==0 || password==null || password.length==0){
        $.layerAlert.alert({msg:"用户名或密码不能为空！",title:"提示"});
        return ;
    }

    $.ajax({
        url:context +'/login',
        data:{
            "username":username,
            "password":password,
            "requireJsonResp":true
        },
        type:"post",
        dataType:"json",
        success:function(successData){
            if(successData.returnCode=="SUCCESS"){
                window.top.location.href = context + successData.providedUrl;
                return ;
            }

            if(successData.returnCode=="FAIL"){
                var failSign = successData.failSign ;
                if(failSign!=null && failSign.length>0){
                    $.layerAlert.alert({msg:"用户名或密码错误！",title:"提示"});
                    return ;
                }

                $.layerAlert.alert({msg:"系统错误，请联系管理员！",title:"提示"});
                console.log(successData) ;
                return ;
            }
        },
        error:function(XMLHttpRequest, textStatus, errorThrown){
            console.log(XMLHttpRequest) ;
            console.log(textStatus) ;
            console.log(errorThrown) ;
        }
    });
}