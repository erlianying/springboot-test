$.addPetitionLeaveLayer = $.addPetitionLeaveLayer || {};
(function($){
    "use strict";
    var frameData = window.top.$.layerAlert.getFrameInitData(window) ;
    var pageIndex = frameData.index ;//当前弹窗indexvar
    var initData = frameData.initData ;
    var hrskpersonPramaterPojo = initData.hrskpersonPramaterPojo;

    if(hrskpersonPramaterPojo.query==""){
        hrskpersonPramaterPojo.query==null;
    }
    var redayCount = '0';
    var flag = true;

    var hour,minute,second;//时 分 秒
    hour=minute=second=0;//初始化
    var millisecond=0;//毫秒
    var int;

    var i;
    var tableTotalNum;
    var oneLoadNum = 200000;
    var count = 0;
    $(document).ready(function(){
        getPersonnTontel();
        $(document).on("click" , ".load", function(e){
            var num = $(this).attr("id");
            if(num == count){
                hrskpersonPramaterPojo.length = oneLoadNum*50;
            }
            hrskpersonPramaterPojo.start = (num) * oneLoadNum;
            exportPerson();
        });
    });

    function getPersonnTontel(){
        $('#state').text("正在查询总数");
        start();
        var crowdTypes = [];
        if(hrskpersonPramaterPojo.crowdTypes){
            for(var i in hrskpersonPramaterPojo.crowdTypes){
                crowdTypes.push(hrskpersonPramaterPojo.crowdTypes[i]);
            }
        }
        var crowdNames = [];
        if(hrskpersonPramaterPojo.crowdNames){
            for(var i in hrskpersonPramaterPojo.crowdNames){
                crowdNames.push(hrskpersonPramaterPojo.crowdNames[i]);
            }
        }

        var personnelSubclassOne = [];
        if(hrskpersonPramaterPojo.personnelSubclassOne){
            for(var i in hrskpersonPramaterPojo.personnelSubclassOne){
                personnelSubclassOne.push(hrskpersonPramaterPojo.personnelSubclassOne[i]);
            }
        }

        var personnelSubclassTwo = [];
        if(hrskpersonPramaterPojo.personnelSubclassTwo){
            for(var i in hrskpersonPramaterPojo.personnelSubclassTwo){
                personnelSubclassTwo.push(hrskpersonPramaterPojo.personnelSubclassTwo[i]);
            }
        }


        var data = {
            "query":hrskpersonPramaterPojo.query,
            "startTime" : hrskpersonPramaterPojo.startTime,
            "endTime" : hrskpersonPramaterPojo.endTime,
            "crowdTypes" : crowdTypes,
            "crowdNames" : crowdNames,
            "personnelSubclassOne" : personnelSubclassOne,
            "personnelSubclassTwo" : personnelSubclassTwo,
            "personnelSubclassThree" : hrskpersonPramaterPojo.personnelSubclassThree,
            "personnelSubclassFour" : hrskpersonPramaterPojo.personnelSubclassFour,
            "populationStatus": hrskpersonPramaterPojo.populationStatus,
            "zazdsfr": hrskpersonPramaterPojo.zazdsfr,
            "gjxfjsfr": hrskpersonPramaterPojo.gjxfjsfr,
            "ywPhoneNumber": hrskpersonPramaterPojo.ywPhoneNumber,
            "otherCrowd":hrskpersonPramaterPojo.otherCrowd,
        };
        var obj = new Object();
        $.util.objToStrutsFormData(data, "hrskpersonPramaterPojo", obj);
        $.ajax({
            url:context +'/personManage/findTableTotalNum',
            data:obj,
            type:'post',
            success:function(successData){
                tableTotalNum = successData.totelNum;
                count = parseInt(tableTotalNum/oneLoadNum) + 1;
                var str = "";
                if (count == 1) {
                    str = '<a id="0" class="load btn-primary btn-sm">下载文件</a>'
                } else {
                    $("#count").text("由于查询结果太多,不能一次下载,我们将分为"+count+ "个文件进行下载")
                    for (var i = 0; i < count; i++) {
                        str += '<a id="'+i+'" class="load" href="#">第'+(i+1)+'个文件</a> &nbsp;&nbsp;&nbsp;';
                    }
                }
                $('#state').text("总数查询完成，共计"+ tableTotalNum + "条");
                $("#btn").html(str);
                stop();
                Reset();
            }
        })
    }


    function exportPerson() {
        i = setInterval(function () {
            $.ajax({ //不断请求后台获取数据
                url: context + '/crowd/findPersonExportStateNum',
                type: "post",
                dataType: "json",
                success: function (data) {
                    redayCount = data;
                    initDate();
                }
            })
        }, 1000);
    }
    /**
     * 初始化下载页面的id
     */
    function initDate() {
        if(flag){
            if(redayCount != '0'){
                $('#state').text("此时有人正在下载人员,服务只允许一人下载.");
                window.clearInterval(i);//清除定时
                $("#timeText").hide();
            }else{
                var form = $.util.getHiddenForm(context +'/crowd/personBatchExport',hrskpersonPramaterPojo);//测试
                $.util.subForm(form);
                start();
            }
            flag = false;
        }else {
            if(redayCount == '1'){
                $('#state').text("正在查询");
            }else  if(redayCount == '2'){
                $('#state').text("正在拼装");
            }else if(redayCount == '3'){
                $('#state').text("正在拼装excel");
            }else  if(redayCount == '0'){
                window.clearInterval(i);//清除定时
                $('#state').text("下载完成");
                stop();
                Reset();
                flag = true;
            }
        }
    }

    function Reset()//重置
    {       window.clearInterval(int);
        millisecond=hour=minute=second=0;
        $("#timetext").val('00时00分00秒000毫秒');
       // document.getElementById('timetext').value='00时00分00秒000毫秒';
    }
    function start()//开始
    {
        int=setInterval(timer,50);
    }
    function timer()//计时
    {       millisecond=millisecond+50;
        if(millisecond>=1000)
        {         millisecond=0;
            second=second+1;
        }
        if(second>=60)
        {
            second=0;
            minute=minute+1;
        }
        if(minute>=60)
        {         minute=0;
            hour=hour+1;
        }
        $("#timeText").text(hour+'时'+minute+'分'+second+'秒');
    }
    function stop()//暂停
    {
        window.clearInterval(int);
    }



})(jQuery);