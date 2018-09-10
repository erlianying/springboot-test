$.editPetitionLeaveLayer = $.editPetitionLeaveLayer || {};
(function($){
    "use strict";
    var frameData = window.top.$.layerAlert.getFrameInitData(window) ;
    var pageIndex = frameData.index ;//当前弹窗index
    var initData = frameData.initData ;
    var data = initData.data;

    $(document).ready(function(){
        init();
    });
    function init(){
        initDepartureRegisterData(data)
    }
    function initDepartureRegisterData(){
        $("#allPeopleBatch").val(data.allPeopleBatch);
        $("#allPeopleGroupNumber").val(data.allPeopleGroupNumber);
        $("#allPeopleNumber").val(data.allPeopleNumber);
        $("#extremeBatch").val(data.extremeBatch);
        $("#extremePeopleNumber").val(data.extremePeopleNumber);
        $("#thisCityPeopleBatch").val(data.thisCityPeopleBatch);
        $("#thisCityPeopleGroupNumber").val(data.thisCityPeopleGroupNumber);
        $("#thisCityPeopleNumber").val(data.thisCityPeopleNumber);
        $("#date").val(data.petitionDateStr);
        $("#week").val(data.weekStr);
    }

})(jQuery);