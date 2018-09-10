(function ($) {
    $.learuniframe = { 
        openIframe: function (e) {
            e.preventDefault();
            var src = $(this).attr('iframe-id')
            $('iframe').remove(); // 清空iframe，避免ie内存泄漏
            var str = '<iframe class="primary_iframe" id="iframeBox"' + '" src="' + src
                    + '" frameborder="0"' + '" seamless></iframe>';
            $('#mainContent').html(str);
        },
        init: function () {
            $('.menuItem').on('click', $.learuniframe.openIframe);
        }
    };
    $.learunindex = {
        load: function () {
            $("body").removeClass("hold-transition");
            $("#mainContent").height(
                $(window).height() - 70);
                $(".primary_iframe").height($(window).height() - 70);
            $(window).resize(
                function (e) {
                    $("#mainContent").height(
                        $(window).height() - 70);
                    $(".primary_iframe").height($(window).height() - 70);
                    

                });
            $(".sidebar-toggle").click(function () {
                if (!$("body").hasClass("sidebar-collapse")) {
                    $("body").addClass("sidebar-collapse");
                } else {
                    $("body").removeClass("sidebar-collapse");
                }
            })
        },
        loadMenu: function () {
            $(".sidebar-menu li a")
                .click(
                    function () {
                        var d = $(this), e = d.next();
                        if (e.is(".treeview-menu") && e.is(":visible")) {
                            e.slideUp(0, function () {
                                e.removeClass("menu-open")
                            }), e.parent("li").removeClass("active")
                        } else if (e.is(".treeview-menu")
                            && !e.is(":visible")) {
                            var f = d.parents("ul").first(), g = f
                                .find("ul:visible").slideUp(0);
                            g.removeClass("menu-open");
                            var h = d.parent("li");
                            e
                                .slideDown(
                                    0,
                                    function () {
                                        e
                                            .addClass("menu-open"),
                                            f
                                                .find(
                                                    "li.active")
                                                .removeClass(
                                                    "active"),
                                            h
                                                .addClass("active");

                                        var _height1 = $(window)
                                                .height()
                                            - $(
                                                ".sidebar-menu >li.active")
                                                .position().top
                                            - 41;
                                        var _height2 = $(
                                                ".sidebar-menu li > ul.menu-open")
                                                .height() + 10
                                        if (_height2 > _height1) {
                                            $(
                                                ".sidebar-menu >li > ul.menu-open")
                                                .css(
                                                    {
                                                        overflow: "auto",
                                                        height: _height1
                                                    })
                                        }
                                    })
                        }
                        e.is(".treeview-menu");
                    });
        }
    };
    $(function () {
        $.learunindex.loadMenu();
        $.learunindex.load();
        $.learuniframe.init();
    });
})(jQuery);




