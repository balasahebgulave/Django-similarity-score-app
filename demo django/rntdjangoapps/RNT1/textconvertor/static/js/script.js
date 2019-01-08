; (function () {

    "use strict"; // use strict to start

   

    $(document).ready(function () {

        /* === Alternate menu appear === */
        $("#matrox-menu-alt").html('<ul class="menuzord-menu">' + $("#menu-list").html() + "</ul>");


        /* === Matrox Mega Menu === */
        jQuery("#matrox-menu, #matrox-menu-alt").menuzord({
            indicatorFirstLevel: "<i class='fa fa-angle-down'></i>",
            indicatorSecondLevel: "<i class='fa fa-angle-right'></i>"
        });


        /* === nav sticky header === */
        var navBottom = $(".nav-bottom").offset();

        $(window).on('scroll', function () {
            var w = $(window).width();
            if ($(".nav-bottom").length == 0) {
                if (w > 768) {
                    if ($(this).scrollTop() > 1) {
                        /*$('header').addClass("sticky");*/
                        
                    }
                    else {
                        /*$('header').removeClass("sticky");*/
                        
                    }
                }
            } else {
                if (w > 768) {
                    if ($(this).scrollTop() > navBottom.top + 100) {
                        $('header').addClass("sticky");
                    }
                    else {
                        $('header').removeClass("sticky");
                    }
                }
            }
        });

        


        $(window).scroll(function () {
            var distanceFromTop = $(this).scrollTop();
            //alert(distanceFromTop);
            if (distanceFromTop >= 250) {
                //alert("Fixed");
                $('#stickys').addClass('fixed');
                $('#OV').css('padding-top', '100px');

                
            } else {
                //alert("Regular");
                $('#stickys').removeClass('fixed');
                $('#OV').css('padding-top', '30px');
            }
        });





        /* === sticky header alt === */
        $(window).on('scroll', function () {
            var w = $(window).width();
            if (w > 768) {
                if ($(this).scrollTop() > 1) {
                    $('.mainmenu').slideUp(function () {
                        $('.menu-appear-alt').css({ position: "fixed", top: 0, left: 0, width: w, zIndex: 99999 });
                        $('.menu-appear-alt').slideDown();
                    });

                    

                }
                else {
                    $('.menu-appear-alt').slideUp(function () {
                        $('.menu-appear-alt').css({ position: "relative", top: 0, left: 0, width: w, zIndex: 99999 });
                        $('.mainmenu').slideDown();

                    });


                }
            }

            $(".nav-bottom").css("z-Index", 100000);

            if (navBottom) {
                if ($(window).scrollTop() > (navBottom.top)) {
                    $(".nav-bottom").css({ "position": "fixed", "top": "0px", "left": "0px" });
                } else {
                    $(".nav-bottom").css({ "position": "fixed", top: navBottom.top - $(window).scrollTop() + "px" });
                }
            }

        });


        /* ---------------------------------------------
         Back To Top
         --------------------------------------------- */

        $('body').append('<a id="tb-scroll-to-top" data-scroll class="tb-scroll-to-top-hide" href="#"><i class="fa fa-angle-up"></i></a>');


        var $tbScrollBack = $('#tb-scroll-to-top'),
            scroll_top_duration = 700;
        $(window).on('scroll', function () {
            if ($(this).scrollTop() > $(this).height()) {
                $tbScrollBack
                .addClass('tb-scroll-to-top-show')
                .removeClass('tb-scroll-to-top-hide');
            } else {
                $tbScrollBack
                .addClass('tb-scroll-to-top-hide')
                .removeClass('tb-scroll-to-top-show');
            }
        });

        


        $tbScrollBack.on('click', function (event) {
            event.preventDefault();
            $('body,html').animate({
                scrollTop: 0,
            }, scroll_top_duration
            );
        });


    });

})(jQuery);