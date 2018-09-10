
(function($){
    "use strict";

    $(document).ready(function() {

        $.jcade.initWidget() ;
        $.util.initWidget() ;
        initDisableControl() ;
        initBtUrl() ;
        initIcheck();
        // initTooltip() ;
    });

    function initIcheck(){
        //icheck初始化
        $('input.icheckbox').iCheck({
            checkboxClass: 'icheckbox_square-green',
            radioClass: 'iradio_square-blue',
            increaseArea: '20%' // optional
        });
        $('input.icheckradio').iCheck({
            checkboxClass: 'icheckbox_square-green',
            radioClass: 'iradio_square-blue',
            increaseArea: '20%' // optional
        });
    }

    function initSelect2(){
        $(".select2").select2({
            width:"100%",
            placeholder:"请选择"
        }) ;
        $(".select2-noSearch").select2({
            minimumResultsForSearch: Infinity,
            width:"100%",
            placeholder:"请选择"
        }) ;
        $(".select2-multiple").select2({
            width:"100%",
            placeholder:"请选择"
        }) ;
    }

    function initInputLength(){
        var setting = $.globalSettings.inputDefaultLength ;
        $("input[type=text].default").each(function(i, val){
            var st = $(val).attr("maxlength") ;
            if(!(st!=null&&st!=undefined&&st.length>0)){
                $(val).attr("maxlength", setting) ;
            }
        });
    }

    function initDateRange(){
        $("div.dateRange").each(function(i, val){
            var div = $(this) ;
            var fmt = $.laydate.getFmt(div) ;

            var start = div.find(".laydate-start") ;
            var end = div.find(".laydate-end") ;

            var startId = start.attr("id") ;
            var endId = end.attr("id") ;

            $.laydate.setDateObj(startId, {
                format: fmt, //日期格式
                istime: true, //是否开启时间选择
                isclear: true, //是否显示清空
                istoday: true, //是否显示今天
                issure: true, //是否显示确认
                festival: true, //是否显示节日
                fixed: true, //是否固定在可视区域
                zIndex: 99999999, //css z-index
                choose: function(dates){ //选择好日期的回调
                    var endObj = $.laydate.getDateObj(endId) ;
                    endObj.min = dates ;
                    endObj.start = dates ;
                }
            }) ;

            $.laydate.setDateObj(endId, {
                format: fmt, //日期格式
                istime: true, //是否开启时间选择
                isclear: true, //是否显示清空
                istoday: true, //是否显示今天
                issure: true, //是否显示确认
                festival: true, //是否显示节日
                fixed: true, //是否固定在可视区域
                zIndex: 99999999, //css z-index
                choose: function(dates){ //选择好日期的回调
                    var endObj = $.laydate.getDateObj(startId) ;
                    endObj.max = dates ;
                }
            }) ;



            $(document).on('click', "#"+startId, function () {
                var div = $(this).parents(".dateRange") ;
                var fmt = $.laydate.getFmt(div) ;
                var dateObj = $.laydate.getDateObj(startId) ;
                dateObj.format = fmt ;

                laydate(dateObj);
            });

            $(document).on('click', "#"+endId, function () {
                var div = $(this).parents(".dateRange") ;
                var fmt = $.laydate.getFmt(div) ;
                var dateObj = $.laydate.getDateObj(endId) ;
                dateObj.format = fmt ;

                laydate(dateObj);
            });

        });


        $(document).on('change', ".laydate-range", function () {
            var div = $(this).parents(".dateRange") ;
            div.find(".laydate-start").val("") ;
            div.find(".laydate-end").val("") ;
        });

    }

    function initLaydate(){
        $("div.laydate").each(function(i, val){
            var div = $(this) ;
            var fmt = $.laydate.getFmt(div) ;

            var ldv = div.find(".laydate-value") ;

            var ldvId = ldv.attr("id") ;

            $.laydate.setDateObj(ldvId, {
                format: fmt, //日期格式
                istime: true, //是否开启时间选择
                isclear: true, //是否显示清空
                istoday: true, //是否显示今天
                issure: true, //是否显示确认
                festival: true, //是否显示节日
                fixed: true, //是否固定在可视区域
                zIndex: 99999999, //css z-index
                choose: function(dates){ //选择好日期的回调

                }


            }) ;

            $(document).on('click', "#"+ldvId, function () {
                var div = $(this).parents(".laydate") ;
                var fmt = $.laydate.getFmt(div) ;

                var dateObj = $.laydate.getDateObj(ldvId) ;
                dateObj.format = fmt ;

                laydate(dateObj);
            });

        });


        $(document).on('change', ".laydate-fmt", function () {
            var div = $(this).parents(".laydate") ;
            div.find(".laydate-value").val("") ;
        });

    }

    function initTabs(){
        $(".uiTabs").tabs() ;
    }

    function initDisableControl(){
        $(document).on('click', '.disableControl', function () {
            $(this).attr("disabled",true);
        });
    }

    function initBtUrl(){
        $(document).on('click', '.btUrl', function () {
            var href = $(this).attr("myHref") ;
            href = $.util.fmtUrl(href) ;
            location.href = href ;
        });
    }

    function initTooltip(){
        $.tooltips.initTooltips(document) ;
        $.tooltips.initSelectableToolTips() ;
    }


})(jQuery);





/**************** 让el容器中的的所有元素都能兼容IE6*********
 $.bootstrapIE6(el)*****/



function dtTable (ele, boolean){
    if( boolean ) {
        // var tbSt = $.uiSettings.getOTableSettings ;
        // $.util.log(tbSt) ;
        // tbSt.serverSide = false ;
        // tbSt.lengthChange = false;
        // tbSt.searching = false;
        // ele.DataTable(tbSt) ; 

        ele.dataTable({
            //lengthChange: false,
            //searching: false
        })
    }else {
        // var tbSt = $.uiSettings.getOTableSettings ;
        // $.util.log(tbSt) ;
        // tbSt.serverSide = false ;
        // tbSt.searching = true;
        // tbSt.lengthChange = true;
        // ele.DataTable(tbSt) ; 

        ele.dataTable({
            //lengthChange: true,
            //searching: true
        })
    }
} // datatable 方法




$(document).ready(function() {
    $(".nav-ceng-out").hover(function(){
        $(this).find(".nav-ceng").slideDown();
        $(this).children("a").addClass("current");
    },function(){
        $(this).find(".nav-ceng").hide();
        $(this).children("a").removeClass("current");
    });

});//顶部下拉导航 	    


$(document).ready(function() {

    $('.advanced-btn').click(function(){
        var index = $(this).attr('index')
        var con = $('.advanced-content').children()
        for(var i = 0; i < con.length; i++){
            if(i != index) {
                $(con[i]).hide()
            }
        }
        $(con[index]).slideToggle(200);
    })

}) //右侧高级查询

$(document).ready(function() {
    $('.m-move').draggable();
});
//可拖拽



$(document).ready(function(){
    $('#btn-toggle').click(function(){
        $('#btn-toggle-area').show()
    });
    // 点击按钮显示指定区域


    $(document).on("mouseover",".fi-ceng-out", function(){
        $(this).find(".fi-ceng").show();
    })
    $(document).on("mouseout",".fi-ceng-out", function(){
        $(this).find(".fi-ceng").hide();
    })
    // 隐藏层显示 js
});


$(document).ready(function(){
    $('.od-expand-btn').click(function(){
        $(this).next('.od-expand-content').css('display', 'block');
        $(this).css('display', 'none');
    })
    $('.od-fold-btn').click(function(){
        $(this).parent('.od-expand-content').css('display', 'none');
        $(this).parent('.od-expand-content').prev('.od-expand-btn').css('display', 'block');
    });// 展开收起


})  // 收起的内容操作
$(document).ready(function(){
    $(".eq-expand-content").eq(0).show();
    $(".eq-expand-btn").click(function(){
        var num =$(".eq-expand-btn").index(this);
        $(".eq-expand-content").hide();
        $(".eq-expand-content").eq(num).show()//.slblings().hide();
    })
})  // 每次只展开一个，其它收起


$(document).ready(function(){
    var p = $('.history-content .con-box p');

    // 1. 该元素只展示2行文字，当字数过多，截取显示，截取以后添加 详情 按钮。
    p.each(function(i, ele){
        var ele = $(ele);
        var val = ele.html().trim();
        if(val.length > 45) {
            ele.html(val.slice(0, 45) + '...');
            ele.after('<a href="javascript://" class="expand">详情</a>') ;
        }
        // 2. 点击详情显示全部内容。详情变收起，点收起再次截取字数。
        var expand = ele.next('.expand');
        expand.click(function(event){
            event.preventDefault()
            if(!$(this).hasClass('true')){
                ele.html(val);
                $(this).html('收起').addClass("true");
            } else {
                ele.html(val.slice(0, 45) + '...');
                $(this).html('详情').removeClass("true");
            }
        })
    })
}) // 线索流转记录控制显示字数



$(document).ready(function(){
    var showExtra = $('.show-extra');
    var con = showExtra.children('.extra-con')
    var showMore = showExtra.children('.show-more')
    var conPre = con.children()

    if(conPre.length > 3){
        showMore.show();
        conPre.hide().slice(0, 2).show();

        showMore.click(function(){
            if( !$(this).hasClass('true') ){
                conPre.show();
                $(this).html('收起').addClass('true');
            } else {
                conPre.hide().slice(0, 2).show();
                $(this).html('显示更多').removeClass('true');
            }
        })
    }else {
        showMore.hide();
    }
}) // 超过两条数据时隐藏

//全文搜索页滚动数据
function autoScroll(obj, ul_bz){
// 上移的距离应该是一个li的高度
    var scrollTop = $(ul_bz).children('li').outerHeight();
    $(obj).find(ul_bz).animate({
        marginTop : -scrollTop
    },1000,function(){
        $(this).css({marginTop : "0px"}).find("li:first").appendTo(this);
    });
};
setInterval('autoScroll(".scroll_list", ".scroll_ul")',3000)

//全文搜索页滚动数据
$(document).ready(function(){
    $(document).on("click","table.table-select tbody tr",function(){
        if( !$(this).hasClass('trSelected') ){
            $(this).siblings('tr').removeClass('trSelected');
            $(this).addClass('trSelected');
        }else {
            $(this).removeClass('trSelected')
        }
    });
}) //列表行选中

$(window).scroll(function () {
    if ($(window).scrollTop() > 400) {
        $('.scrollspy-area').css({
            'position': 'fixed',
            'top': '110px'
        })
    } else {
        $('.scrollspy-area').css({
            'position': 'static'
        })
    }
})  // 滚动监听菜单fixed

$(document).ready(function(){
    var defaultQuery = $('.defaultQuery');
    var defaultSkin = localStorage.getItem('defaultLink');
    var inputColor = '#fff';
    if(defaultSkin == 'lightSkin') inputColor = '#000';
    defaultQuery.each(function(i, s){
        var inputItem = s;
        if(inputItem.value == inputItem.defaultValue) {
            inputItem.style.color = '#bbccd6';  // 默认颜色
        }
        inputItem.onblur = function(){
            if(!inputItem.value) {  // 输入框失去光标后判断value,若为空显示defaultvalue
                inputItem.value = inputItem.defaultValue;
                inputItem.style.color = '#bbccd6';
                if($(inputItem).is("#involveCrowdQuery") || $(inputItem).is("#startTimeInput")) {
                    inputItem.style.color = inputColor; // 线索综合查询中“群体”和“指向时间”输入框失去光标事件是更换文字，这个if是处理冲突的js
                }
            }
        }
        inputItem.onfocus = function(){
            if(inputItem.value == inputItem.defaultValue) {  // 输入框获取光标后判断value,若为默认清空
                inputItem.value = '';
                inputItem.style.color = inputColor;
            }
        }
    })
})  // 默认搜索框事件


$(document).ready(function(){
    $(document).on("focus",".check-wrapper>input",function(){
        $(this).next("ul").show();
    })

    $(document).on("click",".check-wrapper>ul>li",function(){
        $(this).parent().prev("input").val($(this).text());
        $(this).parent().hide();
    })

    $(document).on("blur",".check-wrapper>input",function(){
        var obj = this;
        setTimeout(function(){
            $(obj).next("ul").hide();
        }, 200);
    })
})

$(document).ready(function(){
    // 参数一：需要截取字符的父元素(祖父元素)
    // 参数二：想要截取的长度
    //   注意：要截取字符的元素必须有类名 .textSlice
    function textSlice(element, num) {
        var item = element;
        item.each(function(i, s){
            var ele = $(s)
            var defaultVal = ele.html().trim()
            if(defaultVal.length > 45) {
                ele.html(defaultVal.slice(0, 45) + '...');
            }
        })
    }
    // 方法调用
    textSlice($('.textSlice'), 45)
}) // 文字长度截取


$(document).ready(function(){
    $(".search-tool-btn").click(function(){
        $(this).parents(".search-tool").find(".search-tool-con").toggle();
        $(".search-tool-con").is(":visible") ? $(this).html('<span class="fa fa-chevron-up"></span>') : $(this).html('<span class="fa fa-chevron-down"></span>')
    })
}) //  人员关联分析右侧条件搜索区域 - 可折叠功能

$(document).ready(function(){
    $('.fold-toggle-btn > span').click(function(){
        if(!$(this).hasClass('current')) {
            var index = $(this).attr('btn-index');
            var con = $('.fold-toggle-content').children();
            con.hide();
            $(con[index]).show();
            $(this).siblings().removeClass('current').end().addClass('current');
        }
    });
}) // 首页tabs切换


// 获取本地记录设置皮肤
$(document).ready(function(){
    var cssHref = localStorage.getItem("defaultLink");
    console.log(cssHref)
    if(cssHref != '' && cssHref != '#'){ // 本地缓存有皮肤记录时
        $('.skin-img-item#' + cssHref).addClass('choose-skin');
    };
    if(cssHref == null) { // 本地缓存无皮肤记录时，默认为蓝色
        $('.skin-img-item#defaultSkin').addClass('choose-skin');
    };

    switch(cssHref){
        case "blackSkin":
            $("#huanfu").attr("href", "../../../../custom/default/style/skin-black.css");
            $("#mainSkin").attr("href", "../../../../custom/default/style/index-black.css");
            break;
        case "lightSkin":
            $("#huanfu").attr("href", "../../../../custom/default/style/skin-light.css");
            $("#mainSkin").attr("href", "../../../../custom/default/style/index-light.css");
            break;
        case "defaultSkin":
            $("#huanfu").attr("href", "../../../../custom/default/style/skin-dark.css");
            $("#mainSkin").attr("href", "../../../../custom/default/style/index.css");
            break;
        default:
            $("#huanfu").attr("href", "../../../../custom/default/style/skin-dark.css")
            $("#mainSkin").attr("href", "../../../../custom/default/style/index.css");
    };
});