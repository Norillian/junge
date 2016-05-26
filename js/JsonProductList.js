var imgDomains = new Array();
PageNo="Side";
PageOf="af";
NextPageText ="";
PrevPageText ="";
contId=11;
customerId=0;
rp=60;
so=7;
weightBeforeZipCode=200000;

(function (m, $) {

    this.JsonProductList = function (selector, serviceUrl, testMode) {
        selector = "#" + selector;
        var getUrl = '';
        var filters = {};
        this.loadCompleted = 'JsonProductListLoadCompleted';
        this.jsonData = null;
        var me = this;
        this.fetchEarly = false;

        goToPage(serviceUrl);

        function parseJSON(jsondata,append){

            if(jsondata.data.totalProducts >= 1) {
                $('#relatedProductsHeader').show();
                $('#relatedProducts').show();
                $('.product-filter').show();
            }

            if(!jsondata.data.items){
                return;
            }
            me.jsonData = jsondata.data;

            var divList
            if(!append){

                divList = $("<div class='products row uncollapse'></div>");
                if(location.href.indexOf("/basket/shoppingcart.aspx")!=-1) {

                }
                else {
                    $(selector).empty();
                    $(selector).append(divList);
                }

            }else{

                divList = $(selector + " > div.products");
            }
            var productCount=0;

            $.each(jsondata.data.items, function(key, val) {

                //Make sure to get the correct stock message
                var deliveryData = "nothing";
                var hasExpectedDelivery = 'false';

                if(val.inventoryCountFormatted >= 1) {
                    deliveryData = val.inStockMessage;
                    hasExpectedDelivery = 'false';

                }
                if(val.inventoryCountFormatted <= 0) {
                    if(val.hasExpectedDeliveryDate == true) {
                        deliveryData = val.expectedDeliveryDateFormatted;
                        hasExpectedDelivery = 'true';
                    }
                    else {
                        deliveryData = val.notInStockMessage ;
                        hasExpectedDelivery = 'false';
                    }
                }

                //Get the main image url from the product, and if no image is found load the no image replacement
                var imgsrc = "";
                if(val.images[0]){
                    imgsrc = val.images[0].url.replace(/sizeId=([0-9]+)/,"sizeId=4620");
                }
                else
                {
                    imgsrc = "/SL/SI/748/58a479e4-ee67-41c3-80ee-8ebbef2b19f5.jpg";
                }

                //Create the add to basket button
                var addToBasketData = "";
                var addToBasketTxt = "Add to Basket <i class='fa fa-angle-right'></i>";
                if(val.showAddToBasket = "true") {
                    basketDiv = $("<div></div>");
                    basketDiv.addClass("addToBasketLnk");
                    if(val.isBuyable === true) {
                        if(val.inventoryCount <= 2) {
                            basketDiv.addClass('not-on-stock');
                            basketDiv.html('not on stock');
                        } else {
                            if(val.hasVariants === false) {
                                basketDiv.click(function(){

                                    var qtyValue = $(this).prev(".qty-input").val();

                                    if(val.grossWeightFormatted >= weightBeforeZipCode) {
                                        ActivateBasketButtonPrompt(val.eSellerId, 0, '', qtyValue, 'GET', encodeURIComponent(window.location.pathname + window.location.search), false, true, val.expectedDeliveryDateFormatted);
                                    }
                                    else {
                                        atbNoQty(val.eSellerId, 0, qtyValue, '', '', '', '', encodeURIComponent(window.location.pathname + window.location.search));
                                    }
                                });
                                basketDiv.html(addToBasketTxt);
                            }
                        }
                    } else if(val.hasVariants === false) {
                        basketDiv.addClass('not-on-stock');
                        basketDiv.html('not on stock');
                    } else if(val.hasVariants === true) {
                        basketDiv.html('Select variants<i class="fa fa-angle-right show-for-medium-only"></i>');
                        basketDiv.addClass('variant-basket');
                        basketDiv.click(function(){
                            window.location.href = val.URLPathAndQuery;
                        });
                    }
                }


                productDiv = $("<div data-equalizer></div>");
                productDiv.addClass("productElement item clearfix");
                productImageDiv = $("<div></div>");
                productImageDiv.addClass("productImage");
                productLink = $("<a></a>");
                productLink.attr("href",val.URLPathAndQuery);
                productImg = $("<img></img>");
                productImg.attr("src", imgsrc);
                productImg.attr("alt", val.name);
                productLink.append(productImg);
                productImageDiv.append(productLink);

                productDiv.append(productImageDiv);
                productnameDiv = $("<div></div>");
                productnameDiv.addClass("productName");
                productNameLnk = $("<a></a>");
                productNameLnk.attr("href",val.URLPathAndQuery);
                productNameLnk.text(val.name);
                productnameDiv.append(productNameLnk);
                productDiv.append(productnameDiv);

                productDescriptionDiv = $('<div></div>');
                productDescriptionDiv.addClass('productDescriptionDiv');
                productDescriptionLnk = $('<a></a>');
                productDescriptionLnk.attr('href', val.URLPathAndQuery);
                productDescriptionLnk.append(val.customFields["Kort Beskrivelse"]);
                productDescriptionDiv.append(productDescriptionLnk);

                productDiv.append(productDescriptionDiv);


                productPriceDiv = $('<div></div>');
                //productPriceDiv.attr('href', val.URLPathAndQuery);
                productPriceDiv.addClass('productPriceDiv');
                productPriceDiv.prepend('Price: ')
                if(!val.hasSalesPrice == false) {
                    productPriceDiv.append(val.salesPrices[0].tagPriceFormatted);
                }

                productDiv.append(productPriceDiv);
                productDiscountPriceDiv = $('<a></a>');
                productDiscountPriceDiv.attr('href', val.URLPathAndQuery);
                productDiscountPriceDiv.addClass('productDiscount');
                if(val.hasSalesPrice == false) {
                    //console.log('no salesprice(s)');
                }
                else {
                    if(!val.salesPrices[0].tagPriceLineDiscountAmount == 0) {
                        productDiscountPriceDiv.append($('#itemDiscount').text());
                        productDiscountPriceDiv.append(val.salesPrices[0].tagPriceLineDiscountAmountFormatted);
                    }
                }

                //productDiv.append(productDiscountPriceDiv);

                productIdDiv = $("<div class='product-number'>" + val.id + "</div>");
                productIdDiv.prepend('Item no.: ');

                productDiv.append(productIdDiv);

                inputBox = $("<input />");
                inputBox.attr("name", val.eSellerId);
                inputBox.attr("type", "text");
                inputBox.attr('qty', val.inventoryCount);
                if(val.inventoryCount <= 2){
                    inputBox.attr("class", "qty-input red");
                } else if(val.inventoryCount >= 3 && val.inventoryCount <= 9) {
                    inputBox.attr("class", "qty-input yellow");
                } else if(val.inventoryCount >= 10) {
                    inputBox.attr("class", "qty-input green");
                }
                inputBox.attr("value", "1");
                if(val.hasVariants === true) {
                    inputBox.hide();
                }

                productDiv.append(inputBox);
                productDiv.append(basketDiv);

                if(val.hasSalesPrice == false) {

                }
                else {
                    if(val.salesPrices[0].lineDiscountPercentageFormatted != "0.00") {
                        productTilbudIconLnk = $('<a></a>');
                        productTilbudIconLnk.attr('href', val.URLPathAndQuery);
                        productTilbudIconLnk.addClass('iconTilbud');
                        productTilbudIcon = $('<img />');
                        productTilbudIcon.attr('src', '/media/211/img/Tilbud.png');
                        productTilbudIcon.attr('alt', '');
                        productTilbudIconLnk.append(productTilbudIcon);
                        //productDiv.append(productTilbudIconLnk);
                    }
                }

                if(location.href.indexOf("/basket/shoppingcart.aspx")!=-1){
                    $("#basketOffersCarousel").data('owlCarousel').addItem(productDiv);
                }
                else {
                    $(selector + " > div.products").append(productDiv);
                }
            });

            updateUrl();

            if(!$('ul#brandsList').length == 0){
                //Change the negative margin for brands json
                var getNativeHeightFromJson = Math.floor($('#ShopContent .jsonProducts').height());
                getNativeHeightFromJson = getNativeHeightFromJson + 44;
                $('ul#brandsList li.brandListItem.activeBrand').css('margin-bottom', getNativeHeightFromJson);
                getNativeHeightFromJson = -Math.abs(getNativeHeightFromJson);
                $('#ShopContent .jsonProducts').css('margin-top', getNativeHeightFromJson);
            }

            prefetch = $("<link></link>");
            prefetch.attr("rel","prefetch");
            if(jsondata.data.previousLink && jsondata.data.previousLink.length>0){
                prefetch.attr("href",document.location.protocol + "//" + document.location.hostname + jsondata.data.previousLink);
                prefetch.appendTo("head");
            }
            if(jsondata.data.nextLink && jsondata.data.nextLink.length>0){
                prefetch.attr("href",document.location.protocol + "//" + document.location.hostname + jsondata.data.nextLink);
                prefetch.appendTo("head");
            }

        }

        function goToPage(url) {

            getUrl = url;
            fetchEarly = false;
            if(getUrl.indexOf("p=1&")!=-1&&getUrl.indexOf("rp=72")==-1){
                fetchEarly = false;
            }
            if(getUrl.indexOf("RelatedProducts")!=-1){
                fetchEarly = true;
            }
            if(fetchEarly){

                getUrlEarly = getUrl.replace(/rp=([0-9](.?)\&)/,"rp=72&");
                if(getUrl.indexOf("RelatedProducts")!=-1){
                    getUrlEarly = getUrl + "&maxResults=72";
                }
                //console.log("Before replace" + getUrl);
                //console.log("After replace" + getUrlEarly);
                $.ajax({
                    url: getUrlEarly,
                    dataType: 'json',
                    async: true,
                    success: function(jsondata) {
                        parseJSON(jsondata,false);
                        //Update the pager with current results
                        setPager(jsondata.data.pageNumber, jsondata.data.previousLink, jsondata.data.nextLink, jsondata.data.totalPages);

                        $(document).trigger(me.loadCompleted, { data: jsondata.data, error: jsondata.error });

                    }
                });


            }

            if(location.pathname=="/"||location.pathname=="" || location.href.indexOf("/pi/")!=-1){

            }
            else {

                $.getJSON(url, function(jsondata) {
                    if($("div.plist").html() && $("div.plist").html().length>10){
                        //ensure that if the second call is faster than the first one, the productlist is overwritten
                        fetchEarly=false;
                    }
                    parseJSON(jsondata,fetchEarly);
                    //Update the pager with current results
                    setPager(jsondata.data.pageNumber, jsondata.data.previousLink, jsondata.data.nextLink, jsondata.data.totalPages);

                    $(document).trigger(me.loadCompleted, { data: jsondata.data, error: jsondata.error });
                })
                    .fail(function() {
                        //console.log("Parse or network error");
                        $("#loaderDiv").text("");
                    });}
        }


        function setPager(currentPage, previousPage, nextPage, totalPages) {
            if(!$("div.pager")||$("div.pager").length<1){
                plist = $("<div></div>");
                plist.addClass("pager");
                plist2 = plist.clone();

                $(".jsonProducts").append(plist2);
            }
            var target = $("div.pager");
            target.empty();
            if (previousPage && previousPage.length > 0) {
                var pageLink = $("<a href='javascript:void(0);' class='previousPageLnk' data-URLPathAndQuery='" + previousPage + "'><span class='fa fa-angle-double-left'></span>" + PrevPageText + "</a></div>");
                pageLink.click(function () {
                    $(window).scrollTop(0);
                    //jQuery.bbq.pushState("page="+getUrlVars(previousPage)["p"]);
                    goToPage(previousPage.replace("&imgSizeId=0",""));
                });
                target.append(pageLink);
            }


            if(currentPage && totalPages){
                pagecount = $("<span class='pagecountspan'></span>");
                pagecount.text(PageNo + " " + currentPage + " " + PageOf + " " + totalPages);
                multipage = $("<span></span>");
                multipage.addClass('multipageBdy');

                for(i=1;i<=totalPages;i++){
                    pagelink = $("<span></span>");
                    pagelink.attr("data-index",i)
                    pagelink.attr("data-currentPage",productList);
                    pagelink.text(i);
                    if(i==currentPage){
                        pagelink.addClass("currentpage");
                    }
                    pagelink.click(function(){
                        //alert($(this).attr("data-index"));
                        //jQuery.bbq.pushState("page="+$(this).attr("data-index"));
                        goToPage($(this).attr("data-currentPage").replace($(this).attr("data-currentPage").match(/&p=([0-9]{1,2})/)[0],"&p=" + $(this).attr("data-index")));
                    });
                    multipage.append(pagelink);
                }
                target.append(multipage);
                //target.append(pagecount);
            }


            if (nextPage && nextPage.length > 0) {
                var nextLink = $("<a href='javascript:void(0);' class='nextPageLnk' data-URLPathAndQuery='" + nextPage + "'>" + NextPageText + "<span class='fa fa-angle-double-right'><div style='clear:both;'></div></span></a>");
                nextLink.click(function () {
                    $(window).scrollTop(0);
                    //jQuery.bbq.pushState("page="+getUrlVars(nextPage)["p"]);
                    goToPage(nextPage.replace("&imgSizeId=0",""));
                });
                target.append(nextLink);
            }


            target.first().addClass("first");
            target.last().addClass("last");

            if(totalPages == "1") {
                $('.jsonProducts .pager').remove();
            }

        }
        function getUrlVars(url) {
            var vars = {};
            var parts = url.replace(/[?&]+([^=&]+)=([^&]*)/gi,
                function(m,key,value) {
                    vars[key] = value;
                });
            return vars;
        }
        /*
         Handles loading of next page
         */


        this.SetFilters = function (key, values) {
            filters[key] = values;
            updateUrl();
            goToPage(getUrl);
        };
        this.SetSorting = function (option) {
            sortingOption = option;
            updateUrl();
            goToPage(getUrl);
        };
        var sortingOption = "";

        this.SetResultsPerPage = function (option) {
            rpOption = option;
            updateUrl();
            goToPage(getUrl);
        };

        var rpOption = "";
        this.updateUrl = function() {
            var params = getUrlParts(getUrl);

            for (var key in filters) {
                var val = "";
                if (filters[key]) {
                    val = filters[key];
                }

                var filterKey = "";
                var i = 1;
                for (i; i < 100; i++) {
                    filterKey = "fn" + i;
                    if (params[filterKey] && params[filterKey] != key) {
                        continue;
                    } else {
                        break;
                    }
                }
                params[filterKey] = key;
                params["fv" + i] = val;

            }

            params["so"] = sortingOption;
            if(rpOption){
                params["rp"] = rpOption;
            }
            getUrl = getPathFromUrl(getUrl) + "?" + $.param(params);
        }

        function getPathFromUrl(url) {
            return url.split("?")[0];
        }
    };
})({}, jQuery);
var splashurl = '';
$j(document).ready(function() {
    var productsCount = 0;
    $(document).bind(window.jsonProductList.loadCompleted, function(e, data){
        if (data.data && data.data.totalProducts > 0){
            $('.sortingContainer').attr('style', '');
        }else{
            $('.sortingContainer').attr('style', 'display:none!important;')
            $('.listEmpty').attr('style', 'display:block!important;')
        }
    });
    if (productsCount == 0){
        $('.sortingContainer').attr('style', 'display:none!important;');
    }
    $('.sortingContainer').attr('style', '');

    $("div.pager").next("br").remove();
    $("div.plist").next("br").remove();

    $('#changeSortOrderBdy div').text($('#sortAZ').text());
});

page=1;

//Filters
var filterUrl = "";
if($j("input[name$='tbxMinPrice']").length>0 && $j("input[name$='tbxMaxPrice']").length>0){
    filterUrl += "&fn1=ProductPrice&fv1=" + $j("input[name$='tbxMinPrice']").val() + '^' + $j("input[name$='tbxMaxPrice']").val();
}

var productList = "";
var targetelement = $j(".jsonProducts").attr("id");

if(location.href.indexOf("/pl/")!=-1){
    productList = '/Services/ProductService.asmx/ProductList?v=1.0&lId=0&locId=' + locId + '&so=' + so + '&cId=' + cId + '&langId=' + langId + '&countryId=' + contId +  '&customerId=' + customerIDHash + '&mId=' + mId + '&p=' + page + '&rp=' + rp;
}

if($('.search-results').length > 0){
    productList = '/Services/ProductService.asmx/ProductList?v=1.0&lId=0&locId=' + locId + '&so=' + so + '&cId=' + cId + '&langId=' + langId + '&countryId=' + contId +  '&customerId=' + customerIDHash + '&p=' + page + '&rp=' + rp +'&maxSearchResults=200&search=' + jsonSearchQueryString;
}




productList += filterUrl;
productList += '&serial=' + serial;


jsonProductList = new JsonProductList(targetelement, productList, true);

function ChangeCurrentLanguage(oSelect){
    window.location.href=window.location.pathname + '?' + pageQuery.toString();
}


function updateUrl(){
    targetelement = $j('.jsonProducts').attr('id');
    $j('.sortingContainer .sortOptions').on('change', function (e) {
        newSortOption = "so=";
        newSortOption += $j("option:selected", this).attr('value');
        JsonProductList(targetelement, productList.replace(/so=([0-9]*)/,newSortOption), true);
    });
}
