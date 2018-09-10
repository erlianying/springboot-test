var alertTimer = null;
var myReportLst = [];

$(document).ready(function() {
    findMyReportToAlert();
    $(document).on("click","#stopAudio",function(){
        $("#alertAudio")[0].pause();
    });
});

function findMyReportToAlert(){
    $.ajax({
        url: context + '/organizeReport/findMyReport',
        type: 'post',
        data: {},
        dataType: 'json',
        success: function (successData) {
            if(successData.show == false){
                return;
            }
            if(alertTimer == null){
                alertTimer = setInterval(findMyReportToAlert, 10000);
            }
            var source = successData.data;
            if(source.length > 0){
                for(var i = 0; i < source.length; i++){
                    if(-1 == $.inArray(source[i].id, myReportLst)){
                        myReportLst.push(source[i].id);
                        $("#alertAudio")[0].play();
                    }
                }
            }
        }
    });
}

// function startAlert(){
//     findMyReport();
// }
//
// function endAlert(){
//     clearInterval(alertTimer);
//     alertTimer = null;
// }