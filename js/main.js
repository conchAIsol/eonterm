$(function(){
	
/*==============================================================================
General Collections and Variables
==============================================================================*/
var $win = $(window),
	$doc = $(document),
	$loader = $('.loader'),
	$container = $('.container'),
	$contentWrap = $('.content-wrap'),
	$header = $('header'),
	$footer = $('.footer'),
	belowIE9 = $('.lt-ie9').length;

/*==============================================================================
Retina Detection
==============================================================================*/
Modernizr.addTest('retina', function(){ 
	if (window.matchMedia) { 
		var mq = window.matchMedia("only screen and (-moz-min-device-pixel-ratio: 1.3), only screen and (-o-min-device-pixel-ratio: 2.6/2), only screen and (-webkit-min-device-pixel-ratio: 1.3), only screen  and (min-device-pixel-ratio: 1.3), only screen and (min-resolution: 1.3dppx)");
		if(mq && mq.matches) {
			return true;
		}
	}
});

/*==============================================================================
Scrollbar Width
==============================================================================*/
var scrollDiv = document.createElement("div");
scrollDiv.className = "scrollbar-measure";
document.body.appendChild(scrollDiv);
var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
document.body.removeChild(scrollDiv);

/*==============================================================================
Content Wrap Positioning
==============================================================================*/
function positionContentWrap(){	
	var	contentWrapWidth = $contentWrap.innerWidth(),
		contentWrapHeight = $contentWrap.innerHeight(),
		headerHeight = $header.innerHeight(),
		footerHeight = $footer.innerHeight(),
		winHeight = $win.height(),
		compareHeight = winHeight - headerHeight - footerHeight;
		
	if(contentWrapHeight > compareHeight){
		$contentWrap.css({
			'top': '0'
		});
	} else {
		$contentWrap.css({
			'top': (compareHeight / 2) + (-contentWrapHeight / 2) + 'px'
		});
	}
}

$win.load(function(){
	setTimeout(positionContentWrap, 50);
});

$contentWrap.resize(positionContentWrap);
$win.on('resize', positionContentWrap);

/*==============================================================================
Fade Out Loader / Fade In Content
==============================================================================*/
$win.load(function(){
	$loader.fadeOut(1500);
	$container.animate({'opacity': 1}, 1500, function(){
		ticker();
	});
});

/*==============================================================================
Tipsy Tooltips
==============================================================================*/
$('.scott-echols-logo').tipsy({
	fade: !belowIE9,
	gravity: $.fn.tipsy.autoNS,
	offset: 4,
	opacity: 0.8,
	hideOnClick: true
});

$('.eon-logo').tipsy({
	fade: !belowIE9,
	gravity: $.fn.tipsy.autoNS,
	offset: 0,
	opacity: 0.8,
	hideOnClick: true
});

$('.audio-toggle').tipsy({
	fade: !belowIE9,
	gravity: 's',
	offset: 18,
	opacity: 0.8,
	hideOnClick: true,
	html: true
});

/*==============================================================================
Ticker
==============================================================================*/
function ticker(){	
	var $ticker = $('.ticker'),
		$text = $ticker.find('.text'),
		$inner = $ticker.find('.inner'),
		tickerWidth = $ticker.outerWidth(),
		textWidth = $text.outerWidth(),	
		transEndEventNames = {
			'WebkitTransition' : 'webkitTransitionEnd',
			'MozTransition'    : 'transitionend',
			'OTransition'      : 'oTransitionEnd',
			'msTransition'     : 'MSTransitionEnd',
			'transition'       : 'transitionend'
		},
		transEndEventName = transEndEventNames[ Modernizr.prefixed('transition') ];
		
	$inner.css({
		'width': textWidth * 2 + 'px',
		'opacity': 1
	});
	
	if(Modernizr.csstransitions && Modernizr.csstransforms3d){
		$inner.addClass('no-transition');
		$inner.css('transform', 'translate3d(' + (tickerWidth) + 'px, 0px, 0px)');
		$inner.css('transform');
		$inner.removeClass('no-transition');
	} else {
		$inner.css('left', tickerWidth + 'px');
	}
		
	function animateTicker(){
		if(Modernizr.csstransitions && Modernizr.csstransforms3d){
			$inner.css('transform', 'translate3d(' + (-textWidth) + 'px, 0px, 0px)');
			$inner.on(transEndEventName, function(){
				$inner.off(transEndEventName);
				$inner.addClass('no-transition');
				$inner.css('transform', 'translate3d(' + (tickerWidth) + 'px, 0px, 0px)');
				$inner.css('transform');
				$inner.removeClass('no-transition');
				animateTicker();
			}); 
		} else {
			$inner.stop().animate({
				left: -textWidth + 'px'
			}, {
				duration: 315000,
				easing: 'linear',
				complete: function(){
					$inner.css('left', tickerWidth + 'px');
					animateTicker();
				}
			});
		}
	}	
	
	animateTicker();
}

/*==============================================================================
Audio
==============================================================================*/
if($('.page-interact').length >= 1 || $('.page-about').length >= 1){
	
	function setupSound(){
		var sound = soundManager.createSound({
			id: 'moby',
			url: [
				eon.url + '/audio/mody-scream-pilots-ambient-mix.mp3',
				eon.url + '/audio/mody-scream-pilots-ambient-mix.ogg'
			],
			volume: 50,
			autoLoad: true,
			autoPlay: true,
			loops: 99
		});
		
		$('.audio-toggle').on('click', function(e){
			e.preventDefault();
			var $this = $(this);
			if($this.hasClass('off')){
				$this.removeClass('off');
				sound.setVolume(50);
			} else {
				$this.addClass('off');
				sound.setVolume(0);
			}		
		});
	}
	
	soundManager.setup({		
		url: 'swf/',
		flashVersion: 9,
		useHighPerformance: true,
		debugMode: false,
		loops: 99,
		onready: setupSound
	});
} else if($('.page-media').length >= 1){
	
	var iframe = $('#player1')[0],
		player = $f(iframe);
	
	player.addEvent('ready', function() {
		//console.log(player.api);	
		player.addEvent('playProgress', onPlayProgress);
	});	
	
	var test = 0;
	function onPlayProgress(data, id) {
		
	}
	
	$('.audio-toggle').on('click', function(e){
		e.preventDefault();
		var $this = $(this);
		if($this.hasClass('off')){
			$this.removeClass('off');
			player.api('setVolume', 1);
		} else {
			$this.addClass('off');
			player.api('setVolume', 0);
		}		
	});

}

/*==============================================================================
FitVids
==============================================================================*/
$('.fitvids').fitVids();

/*==============================================================================
About Flip Container
==============================================================================*/
var flipTimeout = null;

function nextEvent() {
	var $this = $(this);
	$this.on('touchend', function(e){
		e.preventDefault();		
		clearTimeout(flipTimeout);
		if($this.hasClass('touched')){		
			location.href = $this.attr('href');
		} else {
			$this.addClass('touched');q
			flipTimeout = setTimeout(function(){
				$this.removeClass('touched');
			}, 5000);
		}
		$this.off('touchend');
	});
	$this.on('touchmove', function(e){
		$this.off('touchend');
	});
}

$('.flip-container').on('touchstart', nextEvent);

/*==============================================================================
About Slideshow
==============================================================================*/
/*$win.load(function() {
	var $slider = $('.nivoSlider');
	
	$slider.nivoSlider({
		effect: 'slideInLeft',          // Specify sets like: 'fold,fade,sliceDown'
		slices: 1,                     // For slice animations
		boxCols: 1,                     // For box animations
		boxRows: 1,                     // For box animations
		animSpeed: 1000,                 // Slide transition speed
		pauseTime: 6000,                // How long each slide will show
		startSlide: 0,                  // Set starting Slide (0 index)
		directionNav: false,             // Next & Prev navigation
		controlNav: true,               // 1,2,3... navigation
		controlNavThumbs: false,        // Use thumbnails for Control Nav
		pauseOnHover: false,            // Stop animation while hovering
		manualAdvance: false,           // Force manual transitions
		prevText: 'Prev',               // Prev directionNav text
		nextText: 'Next',               // Next directionNav text
		randomStart: false,             // Start on a random slide
		beforeChange: beforeChange,   // Triggers before a slide transition
		afterChange: afterChange,    // Triggers after a slide transition
		slideshowEnd: function(){},     // Triggers after all slides have been shown
		lastSlide: function(){},        // Triggers when last slide is shown
		afterLoad: function(){}         // Triggers when slider has loaded
	});
	
	$('.nivo-controlNav').wrap('<div class="nivo-controlNav-wrap" />');
	$('.nivo-controlNav-wrap').prepend('<a class="slider-play">Play</a><a class="slider-pause active">Pause</a>');
	
	var $play = $('.slider-play'),
		$pause = $('.slider-pause');
	
	$pause.on('click', function() {
		$pause.removeClass('active');
		$play.addClass('active');
		$slider.data('nivoslider').stop();
	});
	
	$play.on('click', function() {
		$pause.addClass('active');
		$play.removeClass('active');
		$slider.data('nivoslider').start();
	});
		
	function beforeChange() {
		setTimeout (function(){
			$('.nivoSlider .nivo-main-image').stop().animate({opacity:0, left: '-100%' },1000);
		},20);
	}
	
	function afterChange() {
		setTimeout (function(){
			$('.nivoSlider .nivo-main-image').css({opacity:1, left: 0});
		},20);
	}
	
});*/

function fadeSlider() {

	var $sliderWrap = $('.fade-slider-wrap'),
		$slides = $('.fade-slide'),
		$sliderControls = $('.fade-slider-controls'),
		currentSlide = 0,
		totalSlides = $slides.length,
		timePause = 4000,
		timeTransition = 1000,
		timeGap = 500,
		slideTimeout = null,
		isAnimating = false;

	$slides.each(function( i ){
		if( i === 0 ){
			$sliderControls.append('<a href="#" class="fade-slider-control current"></a>');
		} else {
			$sliderControls.append('<a href="#" class="fade-slider-control"></a>');
		}
	});
	var $sliderControl = $sliderControls.find('.fade-slider-control');

	function gotoSlide(i) {
		currentSlide = i;
		isAnimating = true;
		$slides.filter('.current').removeClass('current').stop().fadeOut(timeTransition, function(){
			setTimeout(function(){
				$sliderControl.removeClass('current');
				$sliderControl.eq(i).addClass('current');
				$slides.eq(currentSlide).addClass('current').stop().fadeIn(timeTransition, function(){
					isAnimating = false;
					setTimer(); 
				});
			}, timeGap);
		});
	}
	
	function setTimer() {    
		clearTimeout(slideTimeout);
		slideTimeout = setTimeout(function(){
			if(currentSlide <= totalSlides - 2){
				currentSlide++;
			} else {
				currentSlide = 0;
			}
			gotoSlide(currentSlide);
		}, timePause);
	}
	
	$slides.eq(currentSlide).addClass('current').fadeIn(timeTransition, function(){
		setTimer();
	})
	
	$sliderControl.on('click', function(e){
		e.preventDefault();
		if(!isAnimating && currentSlide != $(this).index()){
			clearTimeout(slideTimeout);
			$sliderControl.removeClass('current');
			$(this).addClass('current');
			gotoSlide($(this).index());
		}
	});
	
}

$(window).load(fadeSlider);

/*==============================================================================
About Match Height
==============================================================================*/
var $aboutInfo = $('.about-info'),
	$aboutSlideshow = $('.about-slideshow');

function matchAboutHeight(){
	$aboutInfo.css({'min-height': 0});
	$aboutSlideshow.css({'min-height': 0});
		
	if($win.width() + scrollbarWidth > 800){
		var aboutInfoHeight = $aboutInfo.innerHeight(),
			aboutSlideshowHeight = $aboutSlideshow.innerHeight(),
			maxHeight = Math.max(aboutInfoHeight, aboutSlideshowHeight);
			
		$aboutInfo.css({'min-height': maxHeight + 'px'});
		$aboutSlideshow.css({'min-height': maxHeight + 'px'});
	} 
}

$win.on('load resize', matchAboutHeight);

/*==============================================================================
Interact Menu
==============================================================================*/
var interactInit = 0;
function interactMenu(){
	var $interactControls = $('.interact-control'),
		$interactSections = $('.interact-section');
		
	$interactSections.filter('.current').fadeIn(0);
	
	$interactControls.on('click', function(e){
		e.preventDefault();	
	});
	
	function setControls(){
		if(Modernizr.touch){
			function showHideInteract() {
				var $this = $(this);
				$this.on('touchend', function(e){
					e.preventDefault();	
					var section = $this.attr('href').substr(1);			
					$interactControls.filter('.current').removeClass('current');
					$this.addClass('current');			
					$interactSections.filter('.current').removeClass('current').stop(true, true).fadeOut(300)
					$interactSections.filter('.' + section).addClass('current').stop(true, true).fadeIn(0);
					$this.off('touchend');
				});
				$this.on('touchmove', function(e){
					$this.off('touchend');
				});
			}		
			$interactControls.on('touchstart', showHideInteract);
		} else {
			
			$interactControls.on('mouseenter', function(e){
				e.preventDefault();	
				var $this = $(this),
					section = $this.attr('href').substr(1);
				$interactControls.filter('.current').removeClass('current');
				$this.addClass('current');
				$interactSections.filter('.current').removeClass('current').stop(true, true).fadeOut(300)
				$interactSections.filter('.' + section).addClass('current').stop(true, true).fadeIn(0);
			});
			
		}
	}
	
	var currTick = 0,
		totalTick = $interactControls.length;
		
	function setCurrent(){
		if(!interactInit){
			interactInit = 1;
			
			var done = 0,
				cycled = 0;
			
			function cycleCurrent(){
				$currControl = $interactControls.eq(currTick);
				$currSection = $interactSections.eq(currTick);
				
				$interactControls.filter('.current').removeClass('current');
				$currControl.addClass('current');
				$interactSections.filter('.current').removeClass('current').stop(true, true).fadeOut(300)
				$currSection.addClass('current').stop(true, true).fadeIn(0);
								
				if(cycled){
					currTick--;
					if(currTick == -1){
						done = 1;
						setControls();
					}
				} else {
					currTick++;
				}
				
				if(currTick == totalTick - 1){
					cycled = 1;
				}
				
				if(!done){
					setTimeout(cycleCurrent, 500);
				}
			}
			cycleCurrent();
		}
	}
	
	setTimeout(setCurrent, 1500);

}

if($('.page-interact').length >= 1){
	$win.on('load', interactMenu);
};

/*==============================================================================
Interact Match Height
==============================================================================*/
var $interactMenu = $('.interact-menu'),
	$interactFeature = $('.interact-feature');

function matchInteractHeight(){
	$interactMenu.css({'min-height': 0});
	$interactFeature.css({'min-height': 0});
		
	if($win.width() + scrollbarWidth > 800){
		var interactMenuHeight = $interactMenu.innerHeight(),
			interactFeatureHeight = $interactFeature.innerHeight(),
			maxHeight = Math.max(interactMenuHeight, interactFeatureHeight);
			
		$interactMenu.css({'min-height': maxHeight + 'px'});
		$interactFeature.css({'min-height': maxHeight + 'px'});
	} 
}

$win.on('load resize', matchInteractHeight);

/*==============================================================================*/
/* Fancybox */
/*==============================================================================*/
$('.email-trigger').fancybox({
	fitToView: false,
	autoSize: true,
	closeClick: false,
	helpers: {
		overlay: {
			locked: false,
			speedOut: 300
		}
	}
});

/*==============================================================================*/
/* Send Email */
/*==============================================================================*/
var $emailWrap = $('#email-wrap'),
	$emailForm = $emailWrap.find('form');
	$response = $emailWrap.find('.response');
	$submit = $emailWrap.find('input[type="submit"]');
	
$emailForm.parsley({
	listeners: {
		onFormSubmit: function(isFormValid, event, ParsleyForm) {
			event.preventDefault();
			if(isFormValid){
				$emailForm.find('.inner').slideUp(300, function(){
					$.ajax({  
						type: 'post',  
						url: $emailForm.attr('action'),  
						data: $emailForm.serialize() + '&c_url=' + location.href,
						timeout: 30000,  
						success: function(data) {
							$response.append(data).slideDown(300);					
						},
						error: function(jqXHR, textStatus, errorThrown){
							var errorAlert = '<p><span class="error-response">Your form could not be submitted.</span><br />Please try again later or email your message directly to <a href="mailto:eonsymbol@gmail.com">eonsymbol@gmail.com</a>.</p>';
							$response.append(errorAlert).slideDown(300, function(){
								loader.hide();
							});	
						}
					});  
				});	
			}
		}
	}
});

});
