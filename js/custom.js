// Responsive Fixes
$(function() {
    var timer;
    $(window).resize(function() {
        clearTimeout(timer);
        timer = setTimeout(function() {
            $('.inner-wrap').css("min-height", $(window).height() - $('footer').height() + "px" );
            $('#main').css("margin-bottom", $('footer').height() + 20 + "px" );
            $('footer').css("margin-top", '-' + $('footer').height() + "px" );
            $('a.fixed-side-basket').css("top", $('header').height() + 65 + "px" );
            $('#drop2 .inputfield').css('width', $('#drop2').width() - $('#drop2 .submitfield').width() + 'px');
        }, 40);
    }).resize();
});

$(document).ready(function(){

    //Language selector on login
    if($('.frontpageLoginDiv').length > 0) {

        changeLang = $('<div></div>');
        changeLang.addClass('change-lang-container');

        $( "#LanguageSelectbdy .select select option" ).each(function( index ) {
            changeLangOption = $('<a></a>');
            changeLangOption.addClass('change-lang-selector');
            changeLangOption.text(getShortenedCountryName($(this).attr('value')));
            changeLangOption.attr('href', window.location.pathname + '?languageID=' + $(this).attr('value'));
            changeLang.append(changeLangOption);
        });

    }

    function getShortenedCountryName(value){
        switch(value){
            case '1':
                return "DK";

            case '2':
                return "ENG";

        }
    }

    $('.frontpageLoginDiv').after(changeLang);

    // SmartSearch
    $('#drop2 .textbox').appendTo('.inputfield');
    $('#drop2 .submit').appendTo('.submitfield');
    $('#drop2 .submit').addClass('button postfix search-btn');
    $('#drop2 .submit').attr("value", "");

    // SelectCustomer
    $('#customerSelector tr.rowActive td:last-child').html('<i class="fa fa-check fa-2x"></i>');
    $('#customerSelector tr.rowEven td:last-child a').empty('').html('<i class="fa fa-check fa-2x"></i>');
    $('#customerSelector tr.rowOdd td:last-child a').empty('').html('<i class="fa fa-check fa-2x"></i>');

    // Responsive Table for Product Details

    if($('.ecVariantTbl tbody').length != 0) {
        var headertext = [],
        headers = document.querySelectorAll(".ecVariantTbl thead td"),
        tablerows = document.querySelectorAll(".ecVariantTbl thead td"),
        tablebody = document.querySelector(".ecVariantTbl tbody");

        for(var i = 0; i < headers.length; i++) {
            var current = headers[i];
            headertext.push(current.textContent.replace(/\r?\n|\r/,""));
        }
        for (var i = 0, row; row = tablebody.rows[i]; i++) {
            for (var j = 0, col; col = row.cells[j]; j++) {
                col.setAttribute("data-th", headertext[j]);
            }
        }
    }

    //Left side menu scripts



    $( "ul.off-canvas-list label" ).click(function() {
        $(this).toggleClass('active');
        $(this).parent().children('ul').toggleClass('active');
    });

    $( ".productMenuLeftSide .shopMenu li a" ).each(function( index ) {
        if($(this).parent().children("ul").length >= 1) {
            $(this).removeAttr('href').addClass('hasSubMenu');
        }
    });

    $( ".productMenuLeftSide .shopMenu li a.hasSubMenu" ).click(function() {
        $(this).toggleClass('active');
        $(this).parent().children('ul').toggleClass('active');
    });


    $('.HeaderBarTables').find("td.c3").wrapInner("<i></i>");
    $('.HeaderBarTables').find("td.c4").wrapInner("<i></i>");

    $('.HeaderBarTables').find("td.c3").each(function(index){
        var itemNumber = $(this).html();
        $(this).next("td.c4").append("<span>" + itemNumber + "</span>");
    });

    $('.HeaderBarTables').find("td.c4").each(function(index){
        var itemDescription = $(this).html();
        $(this).prev("td.c3").append("<span>" + itemDescription + "</span>");
    });

    var strimStockValue = $('.stockAmountValue').text();
    strimStockValue = strimStockValue.replace('.', '');
    strimStockValue = strimStockValue.replace(',', '');
    var stockValue = parseFloat(strimStockValue);

    if(stockValue <= 2){
        $(".stockAmountValue").parent(".stockAmountArea").addClass("not-in-stock");
    } else if(stockValue >= 3 && stockValue <= 9) {
        $(".stockAmountValue").parent(".stockAmountArea").addClass("low-in-stock");
    }

    if($('.search-results').length > 0){
        $(".product-json-list").addClass("list-view");
    }
    else {
        var categoryLevel = $("#main ul.shopMenu").find("li.active");

        if(categoryLevel.children("ul").length > 0){
            $(".product-json-list").addClass("list-view");
        }else{
            $(".product-json-list").addClass("gallery-view");
        };
    }

    if($('.ecVariantTbl tr').length < 3){
      $('.ecVariantTbl').addClass('one-row');
    }

});
