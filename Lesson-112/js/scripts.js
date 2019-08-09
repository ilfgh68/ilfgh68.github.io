$(document).ready(function() {

    $("#get_check span").click(function() {
        $("#get_check input").toggle();
    });


    $('input#phone').focus(function() {

        $(this).mask("(*99) 999-99-99");

    });


    $(".popup .close").click(function() {
        $(".popup").hide();
    });


    var date = new Date();
    var hourNow = date.getHours();
    if ((hourNow < 11) || (hourNow > 14)) {
        $(".popup").css("display", "none");
    }


    var start_pos = $('div.togo').offset().top;

    $(window).scroll(function() {
        if ($(window).scrollTop() >= start_pos) {
            if ($('div.togo').hasClass() == false) {
                $('div.togo').addClass('to_top');

                $('div.togo #logo_min').show(200);
            }
        } else {
            $('div.togo').removeClass('to_top');
            $('div.togo #logo_min').hide(200);
        }

    });

    jQuery("a.scrollto").click(function() {
        elementClick = jQuery(this).attr("href")
        destination = jQuery(elementClick).offset().top;
        jQuery("html:not(:animated),body:not(:animated)").animate({
            scrollTop: (destination - 100)
        }, 500);

        return false;
    });


    function PriceWithDiscount(price, index) { // Считаем стоимость с самовывозом

        var new_summa = price - Math.ceil(price * 0.2);

        $(".discp:eq(" + index + ") .discp_price span").text(new_summa);
    }



    $(".good_main ul.sizing li").click(function() {

        var index = $(this).parent().index("ul.sizing");

        if (!$(this).hasClass("now")) {
            $(".good_main ul.sizing:eq(" + index + ") li").removeClass("now");

            var set_id = $(this).attr("id").split("_");

            var good_id = $(".good_main:eq(" + index + ") .add").attr("id").split("_");

            $.ajax({
                type: "POST",
                url: "../ajax/change_set_price.php",
                data: ({
                    set_id: set_id[1],
                    good_id: good_id[1]
                }),
                success: function(data) {
                    $(".good_main:eq(" + index + ") .add_wrapper b span").text(data);
                    $(".good_main:eq(" + index + ") .hide_set_id").val(set_id[1]);

                    PriceWithDiscount(data, index);
                }
            });

            $(this).addClass("now");
        }

    });




    $(".position ul.sizing li").click(function() {

        var index = $(this).parent().index("ul.sizing");

        if (!$(this).hasClass("now")) {
            $(".position ul.sizing:eq(" + index + ") li").removeClass("now");
            var set_id = $(this).attr("id").split("_");
            var good_id = $(".position:eq(" + index + ") .add").attr("id").split("_");

            $.ajax({
                type: "POST",
                url: "/ajax/change_set_price.php",
                data: ({
                    set_id: set_id[1],
                    good_id: good_id[1]
                }),
                success: function(data) {
                    $(".position:eq(" + index + ") .add_wrapper b span").text(data);
                    $(".position:eq(" + index + ") .hide_set_id").val(set_id[1]);
                }
            });

            $(this).addClass("now");
        }

    });




    function GetBucketGoodsList() {
        $.post("../ajax/get_bucket_goods.php", {},
            function(data) {
                $(".bucket_wrapper").empty();
                $(".bucket_wrapper").html(data);
            }
        );
    }


    function EditPresentInfo() {

        $.ajax({
            url: "../ajax/present_info.php",
            type: "post",
            success: function(data) {

                if (data[0] > 0) {

                    $("#h_message span").text(data[0]);

                    $("#present_goods .good_main .add_wrapper b").text("Бесплатно");
                    $("#h_message").show();
                } else {
                    $("#h_message").hide();
                    $("#present_goods .good_main .add_wrapper b").html("<span>" + data[1] + "</span> Р.");
                }


            },
            dataType: "json"
        });
    }



    $(".good_main .add").on('click', function() {

        var index = $(".good_main .add").index(this);
        var id = $(this).attr("id").split("_");

        var set_id = 0;

        if ($(".hide_set_id:eq(" + index + ")")) {

            set_id = $(".hide_set_id:eq(" + index + ")").val();
        }


        $.post("../ajax/add.php", {
                id: id[1],
                count: 1,
                type: 0,
                set_id: set_id
            },
            function(data) {

                var res = data.split("_");
                if ($(".good_main .add:eq(" + index + ")").hasClass("from_bucket")) {
                    GetBucketGoodsList();
                }
                $(".basket_up_wrapper").html('<ul class="count"><li id="summa">' + res[0] + ' P.</li><li id="count">' + res[1] + ' ед. товара</li></ul><a href="/cart.html" class="go_in_basket">Корзина</a>');
                $(".bucket_mobile span").text(res[1]);

                $(".good_main .add:eq(" + index + ")").text("Добавить");

                EditPresentInfo();
            }
        );

    });



    $(".good_main .discp .discp_switch").on('click', function() {

        var index = $(".good_main .discp .discp_switch").index(this);

        $(".good_main .discp .discp_info:eq(" + index + ")").toggle(100);
    });


    $(".good_main .discp .close_block").on('click', function() {

        var index = $(".good_main .discp .close_block").index(this);

        $(".good_main .discp .discp_info:eq(" + index + ")").toggle(100);
    });


    $(".good_main .hide_info .hide_info_switch").on('click', function() {

        var index = $(".good_main .hide_info .hide_info_switch").index(this);
        $(".good_main .hide_info .hide_info_info:eq(" + index + ")").toggle(50);
    });


    $(".good_main .hide_info .close_block").on('click', function() {

        var index = $(".good_main .hide_info .close_block").index(this);
        $(".good_main .hide_info .hide_info_info:eq(" + index + ")").toggle(100);
    });






    $(document).on('click', '.line .count .plus', function() {

        var index = $(this).parent().parent().parent().index(".line");

        var id = $(".line:eq(" + index + ")").attr("id").split("_");

        var count = $(".line:eq(" + index + ") .count input").val();

        var set_id = $(".line:eq(" + index + ") .hide_set_id").val();

        if (count < 99) {
            count++;
            $(".line:eq(" + index + ") .count input").val(count);

            $.post("../ajax/add.php", {
                    id: id[1],
                    count: count,
                    type: 1,
                    set_id: set_id
                },

                function(data) {
                    var res = data.split("_");
                    $(".basket_up_wrapper #summa").html(res[0] + ' Р.');
                    $(".basket_up_wrapper #count").html(res[1] + ' ед. товара');
                    $(".itog span").text(res[0]);

                    EditPresentInfo();
                }
            );
        }

    });


    $(document).on('click', '.line .count .minus', function() {

        var index = $(this).parent().parent().parent().index(".line");
        var id = $(".line:eq(" + index + ")").attr("id").split("_");

        var count = $(".line:eq(" + index + ") .count input").val();

        var set_id = $(".line:eq(" + index + ") .hide_set_id").val();

        if (count > 1) {
            count--;
            $(".line:eq(" + index + ") .count input").val(count);

            $.post("../ajax/add.php", {
                    id: id[1],
                    count: count,
                    type: 1,
                    set_id: set_id
                },

                function(data) {
                    var res = data.split("_");
                    $(".basket_up_wrapper #summa").html(res[0] + ' Р.');
                    $(".basket_up_wrapper #count").html(res[1] + ' ед. товара');
                    $(".itog span").text(res[0]);

                    EditPresentInfo();
                }
            );
        }
    });




    function WriteNewInfo(data) {

        if ($(".line").length == 0) {
            $(".itog").remove();
            $(".bucket_wrapper").html("<p style='text-align:center'>Корзина не содержит товара</p>");
            $(".basket_up_wrapper #summa").html('Пусто');
            $(".basket_up_wrapper #count").html('0 ед. товара');
        } else {
            var res = data.split("_");
            $(".basket_up_wrapper #summa").html(res[0] + ' Р.');
            $(".basket_up_wrapper #count").html(res[1] + ' ед. товара');
            $(".itog span").text(res[0]);
        }

    }



    function DelEventGoods() {

        $.post("../ajax/del_event_goods.php", {},
            function(data) {
                WriteNewInfo(data);
                EditPresentInfo();
            });
    }


    $(document).on('click', '.line .del', function() {

        var id = $(this).parent().attr("id").split("_");
        var index = $(".line .del").index(this);
        var set_id = $(".line:eq(" + index + ") .hide_set_id").val();

        $(this).parent().fadeOut(300, function() {
            $(".line:eq(" + index + ")").remove();
        });

        if ($(this).parent().hasClass("action")) {
            DelEventGoods();
        } // Если удаляем акцию
        else {
            $.post("../ajax/del_good_cart.php", {
                    id: id[1],
                    set_id: set_id
                },

                function(data) {
                    WriteNewInfo(data);
                    EditPresentInfo();
                }
            );

        }
    });



    $("#box-1").click(function() {

        var event = $("#event_status").val();

        if ($("#box-1").val() == "one") {
            $("#adress_order").css({
                "display": "none"
            });
            $("#get_adress").css({
                "display": "block"
            });

            $("#adress_order").css({
                "background-color": "#e6e6e6",
                "color": "#999999"
            });
        }

        var summa = $("#summa_hide").val();
        $(".itog_wrapper #delivery span").text("бесплатно");

        if (event == 0) {

            var new_summa = summa - Math.ceil(summa * 0.2);

            $(".itog_wrapper #sum span").addClass("old_price");
            $(".itog_wrapper #sum b").text(new_summa + " Р.");

            $(".itog_wrapper .itog span").text(new_summa);
        } else {
            $(".itog_wrapper .itog span").text(summa);
        }
    });



    $("#box-2").click(function() {

        var event = $("#event_status").val();

        if ($("#box-2").val() == "two") {
            //  $("#adress_order").removeAttr("readonly");

            $("#adress_order").css({
                "display": "block"
            });
            $("#get_adress").css({
                "display": "none"
            });

            $("#adress_order").css({
                "background-color": "#FFF",
                "color": "#000"
            });
        }

        var summa = $("#summa_hide").val();

        $(".itog_wrapper #sum span").removeClass("old_price");
        $(".itog_wrapper #sum b").text("");

        //	if (event == 0){ 

        if ((summa < 595) || (event == 1)) {
            $(".itog_wrapper #delivery span").text("200 Р.");

            summa = parseInt(summa) + 200;

            $(".itog_wrapper .itog span").text(summa);
        } else {
            $(".itog_wrapper .itog span").text(summa);
        }
        /*   	}
            	else{
            		
            		
            		
            		
            	}*/

    });


    $("#cons").change(function() {
        $("#send_order").toggleClass("noactive");
    });


    $("#send_order").click(function() {

        if (!$(this).hasClass("noactive")) {

            var phone = $(".fblock #phone").val();

            if (phone == "") {
                $(".fblock #phone").addClass("error");
            } else {

                if ($(".dmet:checked").val() == "one") {
                    if ($("#get_adress").val() !== null) {
                        $("#form_order").submit();
                    } else {
                        $("#get_adress").css({
                            "background-color": "rgba(253,0,4,.5)"
                        });
                    }
                } else {
                    $("#form_order").submit();
                }
            }
        }
    });


    $("#get_adress").click(function() {
        $("#get_adress").css({
            "background-color": "white"
        });
    });


    /*event*/


    $(".cont span.show").on("click", function() {

        var index = $(".cont span.show").index(this);

        $(".goods_wrapper:eq(" + index + ")").toggle(0);

        $(document).on("mouseup", function(e) {

            var div = $(".cont:eq(" + index + ")");

            if (!div.is(e.target) && div.has(e.target).length === 0) {
                $(".goods_wrapper:eq(" + index + ")").hide();
            }

        });

    });



    $(document).on('click', '.cont .position .add', function() {

        var step_id = $(this).parent().parent().parent().index(".goods_wrapper");
        var count_steps = $(".goods_wrapper").length - 1;

        $("#step" + step_id + " .goods_wrapper").toggle(0);

        var index = $("#step" + step_id + " .position .add").index(this);
        var id = $(this).attr("id").split("_");

        var title = $("#step" + step_id + " .position .info_wrapper strong:eq(" + index + ")").text();

        var set_id = $("#step" + step_id + " .hide_set_id:eq(" + index + ")").val(); //Id сета

        var step_type = 0;

        if (step_id != count_steps) { // Если шаг не последний

            if (count_steps == (step_id + 1)) {
                step_type = 1;
            }

            var selected = $(".select_event_goods").val();

            $(".select_event_goods").val(selected + id[1] + ";" + set_id + "/");

            $.ajax({
                url: '/ajax/load_event_goods.php',
                data: ({
                    id: id[1],
                    set_id: set_id,
                    step_type: step_type
                }),
                cache: false,
                dataType: 'html',
                type: 'POST',
                success: function(data) {

                    $("#step" + step_id + " span.show").text(title);
                    $("#step" + (step_id + 1) + " span.show").text("Выбрать пиццу...");
                    $(".get_action_wrapper .ordbut").addClass("noactive");
                    $(".select_bonus_goods").val(0);

                    /*	$.post("/ajax/change_set_price.php", {set_id : set_id, good_id : id[1]},
					    				  function(data){					    			  
					    			  $(".itog .s1 span").text(data);
					    		  });*/

                    $("#step" + (step_id + 1) + " .goods_wrapper").toggle(0);
                    $("#step" + (step_id + 1) + " .goods_wrapper").html(data);
                },
                beforeSend: function() {

                }

            });
        } else {

            $("#step" + step_id + " span.show").text(title);
            $("#step" + (step_id + 1) + " .goods_wrapper").toggle(0);
            $(".select_bonus_goods").val(id[1] + ";" + set_id);
            $(".get_action_wrapper .ordbut").removeClass("noactive");
        }

    });




    function SendEvent(select_goods, bonus_goods, event_id, coupon_number) {

        $.post("/ajax/set_bonus_goods.php", {
                select_goods: select_goods,
                id: bonus_goods,
                event_id: event_id,
                coupon_number: coupon_number
            },
            function(data) {

                window.location.replace('https://velopizza.ru');

            }
        );

    }


    $(".get_action_wrapper .ordbut").click(function() {

        if ($(this).hasClass("noactive") == false) {

            var select_goods = $(".select_event_goods").val();
            var bonus_goods = $(".select_bonus_goods").val();
            var event_id = $(".event_id").val();

            var coupon_number = 0;
            var wait_coupon = 0;

            if ($("#coupon_number").length) {
                wait_coupon = 1;
                coupon_number = $("#coupon_number").val().trim();
                $("#coupon_step span").text();

                if (coupon_number == "") {
                    $("#coupon_number").addClass("error");
                } else {

                    $.post("/ajax/get_coupon_status.php", {
                            coupon_number: coupon_number
                        },
                        function(data) {
                            if (data == 1) {
                                coupon_number = 0;
                                $("#coupon_step span").text("Номер купона недействителен!");
                                $("#coupon_number").addClass("error");
                            } else {
                                SendEvent(select_goods, bonus_goods, event_id, coupon_number);
                            }
                        }
                    );
                }
            } else {
                SendEvent(select_goods, bonus_goods, event_id, coupon_number);
            }
        }

    });



    $(".promocode_wrapper .remove").on('click', function() {

        $.post("/ajax/promocode_remove.php", {},
            function(data) {
                location.reload();
            }
        );

    });

    $(".promocode_wrapper .add_promocode").click(function() {

        if ($(this).hasClass("remove") == false) {

            var promocode = $("#promo_val").val();

            if (promocode.trim() != "") {

                $.post("/ajax/promocode_add.php", {
                        promocode: promocode
                    },
                    function(data) {

                        if (data == 0) {
                            location.reload();
                        } else if (data == 2) {
                            window.location.replace('https://velopizza.ru/cart.html');
                        } else if (data == 7) {
                            window.location.replace('https://velopizza.ru/coupon.html');
                        } else {
                            alert("Промокод не найден. Попробуйте другой.");
                        }

                        // alert(data);

                    }
                );
            }

        }
    });



    $(".coupon_wrapper .plus").click(function() {

        var count = $(".coupon_wrapper .count input").val();

        if (count < 99) {
            count++;
            $(".coupon_wrapper .count input").val(count);
        }

    });


    function ValidMail(mail) {
        var re = /^[\w-\.]+@[\w-]+\.[a-z]{2,4}$/i;
        var valid = re.test(mail);
        return valid;
    }


    $(".coupon_wrapper .minus").click(function() {

        var count = $(".coupon_wrapper .count input").val();

        if (count > 1) {
            count--;
            $(".coupon_wrapper .count input").val(count);
        }

    });


    $(".coupon_wrapper a.ordbut").click(function() {

        var flag = true;

        var phone = $(".coupon_wrapper #phone").val();
        if (phone == "") {
            $(".coupon_wrapper #phone").addClass("error");
            flag = false;
        }

        var mail = $("input#mail_coupon").val();
        if (ValidMail(mail)) {
            if (flag == true) {
                $("#coupon_form").submit()
            };
        } else {
            $("input#mail_coupon").addClass("error");
        }

    });


    $("div.feedback_wrapper a.ordbut").click(function() {

        $("div.feedback_wrapper input").removeClass("error");
        var flag = true;

        var mail = $("div.feedback_wrapper #mail").val();

        if ($("div.feedback_wrapper #name").val() == "") {
            $("div.feedback_wrapper #name").addClass("error");
            flag = false;
        }

        if (!ValidMail(mail)) {
            $("div.feedback_wrapper #mail").addClass("error");
            flag = false;
        }

        if ($("div.feedback_wrapper #text").val() == "") {
            $("div.feedback_wrapper #text").addClass("error");
            flag = false;
        }

        if (flag == true) {
            $("#feed_form").submit();
        }

    });




    $(".menu_mob").click(function() {
        $(".menu_mobile_wrapper").show(50);
    });


    $(".close_block").click(function() {
        $(this).parent().hide(50);
    });




});