// Custom Scripts

$( document ).ready(function() {
	
	//Video on productdetail page
	if($('.productVideoBtn').length > 0) {
		$( ".productVideoBtn" ).on( "click", function() {
			$('.productVideoBdy').toggleClass('active');
		});
		$( ".productImagesBtn" ).on( "click", function() {
			$('.productVideoBdy').toggleClass('active');
		});
		
		videoFrame = $("<iframe></iframe>");
		videoFrame.attr('width', '560');
		videoFrame.attr('height', '349');
		videoFrame.attr('frameborder', '0');
		videoFrame.attr('allowfullscreen', '');
		videoFrame.attr('src', 'http://www.youtube.com/embed/' + videoId);
		$('.videoWrapper').prepend(videoFrame);
		//<iframe width="560" height="349" src="http://www.youtube.com/embed/n_dZNLr2cME?rel=0&hd=1" frameborder="0" allowfullscreen></iframe>
	}

    //Close messagebox after 5 seconds
    if($('#ucInfoMessagebdy > div').length > 0) {
		if($('#ucInfoMessagebdy > div:contains("indkÃ¸bskurv")').length > 0) {

			//Add extra class to ucInfoMessagebdy
			$('#ucInfoMessagebdy').addClass('addedToBasketMsg');
			$( "#ucInfoMessagebdy.addedToBasketMsg > div" ).wrapAll( "<div class='addedToBasketMsgOuterDiv' />");

			//Create container div
			ucInfoMessageContent = $('<div></div>');
			ucInfoMessageContent.addClass('ucInfoMessageContent clearfix');

			//Create container div header
			ucInfoMessageContentHeader = $('<h3></h3>');
			ucInfoMessageContentHeader.append(prdAddToBasketPopUpContentHeader );

			//Create good offers product list container
			ucInfoMessageContentProducts = $('<div></div>');
			ucInfoMessageContentProducts.addClass('ucInfoMessageContentProducts');
			ucInfoMessageContentProductsContainer = $('<div></div>');
			ucInfoMessageContentProductsContainer.attr('id', 'ucInfoMessageContentProducts');
			ucInfoMessageContentProductsContainer.addClass('jsonProducts messageProducts');
			ucInfoMessageContentProducts.append(ucInfoMessageContentProductsContainer);

			//Create goToBasketBtn
			goToBasketBtn = $('<a></a>');
			goToBasketBtn.addClass('goToBasketBtn');
			goToBasketBtn.attr('href', '/basket/shoppingcart.aspx');
			goToBasketBtn.append(prdAddToBasketPopUpBtnGoTo);

			//Create ShopMoreBtn
			shopMoreBtn = $('<a></a>');
			shopMoreBtn.addClass('shopMoreBtn');
			shopMoreBtn.attr('href', '#');
			shopMoreBtn.append(prdAddToBasketPopUpBtnShopMore);

			//Append elements in the order you want
			ucInfoMessageContent.append(ucInfoMessageContentHeader);
			ucInfoMessageContent.append(ucInfoMessageContentProducts);
			ucInfoMessageContent.append(shopMoreBtn);
			ucInfoMessageContent.append(goToBasketBtn);
			$('#ucInfoMessagebdy > div').append(ucInfoMessageContent);

			createAddedToBasketProducts();

			$( ".shopMoreBtn" ).click(function() {
				$('#ucInfoMessagebdy').remove();
			});

		}
		else {
			$('#ucInfoMessagebdy > div').addClass('notAddedToBasket');
			closeMsgBoxElement = $('<i></i>');
			closeMsgBoxElement.addClass('fa fa-close');
			$('#ucInfoMessagebdy').prepend(closeMsgBoxElement);

			$( "#ucInfoMessagebdy .fa-close" ).click(function() {
				$('#ucInfoMessagebdy').fadeOut();
			});

			$(function() {
				setTimeout(function() {
					$('#ucInfoMessagebdy').fadeOut()
				}, 5000);
			});
		}

    }

    if(location.pathname=="/"||location.pathname==""){
        $('#topMenuQuickLinks .frontpageLnk li').addClass('active');
    }

    //Left side menu scripts

    $( ".productMenuAllMobile li a" ).each(function( index ) {
        if($(this).parent().children("ul").length >= 1) {
            $(this).removeAttr('href').addClass('hasSubMenu');
        }
    });

    $( ".productMenuAllMobile li a.hasSubMenu" ).click(function() {
        $(this).toggleClass('active');
        $(this).parent().children('ul').toggleClass('active');
    });

    //Change product detail page: add to basket btn

    var getOnclickEventFromImg = "";

    $( "#main #ShopContent .pInfoBasket .etBasket .ecBB img" ).each(function( index ) {

		if($( "#main #ShopContent .pInfoBasket .etBasket").hasClass('normalBasket')) {
			getOnclickEventFromImg = $(this).attr("onclick");
			newAddToBasketBtn = $("<a></a>");
			newAddToBasketBtn.addClass("addToBasketBtn");
			newAddToBasketBtn.attr("onclick", getOnclickEventFromImg);
			newAddToBasketBtn.append($("#newPInfoAddToBasket").text());
			$(this).parent().append(newAddToBasketBtn);
		}
		else if($( "#main #ShopContent .pInfoBasket .etBasket").hasClass('variantBasket')) {
			getOnclickEventFromImg = $(this).parent().attr("href");
			newAddToBasketBtn = $("<a></a>");
			newAddToBasketBtn.addClass("addToBasketBtn");
			newAddToBasketBtn.attr("onclick", getOnclickEventFromImg);
			newAddToBasketBtn.append($("#newPInfoAddToBasketVariant").text());
			$(this).parent().append(newAddToBasketBtn);
		}

    });

    // Open/close basket terms readmor

    $( ".openTermsText" ).click(function() {
        $('.TermsTextDiv').toggleClass('active');
		getHeightOfTermsDiv = $('.TermsTextDiv').height();
		getHeightOfTermsDiv = parseInt(getHeightOfTermsDiv, 10) - 500;
		$('#ShopContent').css('padding-bottom', getHeightOfTermsDiv);
    });

    $( "#closeTermsTop" ).click(function() {
        $('.TermsTextDiv').toggleClass('active');
		$('#ShopContent').css('padding-bottom', '0');
    });

    $( "#closeTermsBottom" ).click(function() {
        $('.TermsTextDiv').toggleClass('active');
		$('#ShopContent').css('padding-bottom', '0');
    });

	//Open/close of filtering dropdown
	if($("#productFilteringDrop").length > 0) {
		$(document).mouseup(function (e)
		{
			var container = $("#productFilteringDrop");

			if (!container.is(e.target)	&& container.has(e.target).length === 0 && !$('.productFilteringHeaderBdy ').is(e.target) ) {
				container.removeClass('active');
				$('.productFilteringHeaderBdy ').removeClass('active');
			}
		});
	}

	//Handles product filtering dropdown click on header
	$( "#productFilteringDrop h2.filterHeader" ).on( "click", function() {
		$(this).toggleClass('active');
		$(this).parent().children('.filterControlBdy').toggleClass('active');
	});

	$( "#productFilteringDrop .closeBnt" ).on( "click", function() {
		$('.productFilteringHeaderBdy ').removeClass('active');
		$("#productFilteringDrop").removeClass('active');
	});

  // Sticky Navigation
  var stickyNavTop = $('#topMenu').offset().top;
  $('.inner-wrap').append('<div class="top-sticky-navigation"></div>');

  var stickyNav = function(){
    var scrollTop = $(window).scrollTop();

    if (scrollTop > stickyNavTop) {
        $('.top-sticky-navigation').addClass('sticky-navigation');
        $('.top-sticky-navigation').append($('#topMenu'));
        $('#ShopContent').css('margin-top', '50px');
    } else {
        $('.top-sticky-navigation').removeClass('sticky-navigation');
        $('.topMenuOuterBdy').append($('#topMenu'));
        $('#ShopContent').css('margin-top', '0px');
    }
  };

  var mq = window.matchMedia( "(min-width: 769px)" ); // Media Query

  if(mq.matches){ // If above mq-query apply the stickyNav
    stickyNav();

    $(window).scroll(function() { // Apply on scroll
        stickyNav();
    });
  }

  // Enabling Fast Click for latest iOS 8.4.1 complications
  FastClick.attach(document.body);

  // Payment Check = Change text on checkout button
  var paymentCheck = $('#ctl00_plhContent_ctl08_cbxPaymentMethod1320').attr('checked'); // Specifies the field
  if(paymentCheck == 'checked'){
    $('.basketNxtStep2 input').attr('value', 'Afslut ordre');
  }

  // Validation of Postal Code on checkout
  var formZip = $('input.zipCode');
  var regZip = /^\d{4}$/;

  formZip.on('change', function(){
    if(formZip.val() == '' || !regZip.test(formZip.val())){
      formZip.addClass('inputError');
      $('input.buttonNavNext').attr('disabled', true);
    }else{
      formZip.removeClass('inputError');
      $('input.buttonNavNext').attr('disabled', false);
    }
  });



});
