//function declaration

/* fade in is based on scrolling instead of vanilla fade in
had to change name to fadeInScroll because fadeIn is jQuery method*/
$.fn.fadeInScroll = function(currScroll){
		/*sets distance before the div starts appearing, in px*/
		var distanceBeforeStart = windowHeight/20;
		// get top of object 
		var objectTop = $(this).offset().top;
		var objectHeight = $(this).height();
		/*tracks bottom of the screen*/
		var windowBottom = currScroll + windowHeight;
		// used to control how fast window scrolls (1 means normal rate, element is at full length
		var heightFactor = 1;
		
		//if object is small, make it appear bigger for smoother fadein
		if (objectHeight < 150){
			objectHeight = 150;
		}
		
		// if object is more than 40% of the screen size, let everything show at half screen
		if (objectHeight>windowHeight * 0.4 / heightFactor){
			objectHeight = windowHeight * 0.4 / heightFactor;
		}
		
		
		/*if adding distanceBeforeStart causes the fadein to end only after length of document then ignore it*/
		if (documentHeight < objectTop + heightFactor * objectHeight + distanceBeforeStart){
			/*reset object height, meant for footer*/
			objectHeight = objectHeight / heightFactor;
		}
		/*if still unable to then remove distanceBeforeStart*/
		if (documentHeight < objectTop + heightFactor * objectHeight + distanceBeforeStart){
			distanceBeforeStart = 0;
		}
		/*not sure why fadeIn doesn't work here, causes all of the content-block to fade in at once instead of 1 by 1 even though using $(this)
		can just multiply a factor by objectHeight to end the fadeIn at that that factor of the objectHeight
		e.g. 3/4 would mean end fadein at 3/4 of the object*/
		//used plain vanilla js because this is constantly used when the page is scrolled, so performance affects smoothness of scroll
		//[0] because this is an array (maybe because of class selector which would return array instead of single element like Id
		this[0].style.opacity = (windowBottom - distanceBeforeStart - objectTop)/ (objectHeight * heightFactor);
		//css('opacity', (windowBottom - distanceBeforeStart - objectTop)/ (objectHeight * heightFactor));
};

$.fn.arrowBounce = function(speed, movement){
	/*smaller bounce for second time, like bouncing ball*/
	$(this).animate({"padding-right":movement}, speed).animate({"padding-right":"0px"}, speed).animate({"padding-right":movement * 3/4}, speed).animate({"padding-right":"0px"}, speed);
};
 

function upToTop(){
	$("html,body").animate({scrollTop:0}, 500);
}

function navBarScrollUp(){
	if(navScrollDirection == "down"){
		//stop current slide and clear future ones
		$navBarSlide.stop().clearQueue();
	}
	navScrollDirection = "up";
	//if fail then reset the height so it doesn't stick at the smaller size that it was left at, auto to size of the nav-bar-buttons
	$navBarSlide.slideUp({duration:300,fail:function(){$navBarSlide.css("height", "auto");}});
}	

function navBarScrollDown(){
	if(navScrollDirection == "up"){
		//stop current slide and clear future ones
		$navBarSlide.clearQueue().stop();
	}
	navScrollDirection = "down";
	$navBarSlide.slideDown({duration:300,fail:function(){$navBarSlide.css("height", "auto");}});	
}

//main script

$(".modal-button").on("click", function(){
	var modalBoxID = $(this).attr("value");
	$(modalBoxID).fadeIn(500);
});
$(".modal-box").on("click", function(){
	$(this).fadeOut(500);
});
/*gets down arrow to blink at 1 second and every subsequent 8 seconds*/
/*need to wrap in a function for setInterval, assigned to variable so can be cancelled later*/
setTimeout(function(){$guideDownArrow.arrowBounce(200, 20);}, 1000);
/*time with the end of Zhe Ming on the index-intro*/
downArrowBlink = setInterval(function(){$guideDownArrow.arrowBounce(200, 20);}, 15000);

/*gives the guide-down-arrow bounce when mouse hovers it*/
$guideDownArrow.mouseenter(function(){
	$(this).arrowBounce(150,20);
});

$guideDownArrow.on("click", function(){
	/*scroll to the first element (top of screen aligned with top of element*/
	$("html,body").animate({scrollTop:$(".content").position().top}, 1000);;
});

checkNavBarHover = function(moveEvent){
	//get position on screen
	mouseY = moveEvent.pageY-currScroll;
	if (mouseY<0.2*windowHeight && currScroll > 0.8 * windowHeight){
		navBarScrollDown();
		navBarHover = true;
	}
	/*navBarHover to ensure that there is transition upper screen to lower screen instead of just being in the lower screen
	which can block nav-bar-scroll from scrolling down when user scrolls down*/
	else if ((navBarHover||justNav) && mouseY>0.3*windowHeight){
		navBarHover = false;
		navBarScrollUp();
	}		
};
	
	
/*when user mouse is at top of page, scroll nav-bar-slide down for them to click, made as a function as it needs to be recalled 
after mouse is clicked to scroll since that function off mousemove when mouseup*/
navBarScrollCall = function(){
	$wd.on("mousemove", function(event){
		checkNavBarHover(event);
	});
};
navBarScrollCall();

//to handle touch event when scrolling on mobile devices
$wd.on("touchmove", function(event){
	//get position on the screen of first touch
	var touch = event.touches[0];
	checkNavBarHover(touch);
});

/*tracks mouse movements only when window is clicked, for click to scroll on desktop*/
$wd.on('mousedown',function(event){
	/*get initial y coords, deduct currScroll so we get the position of the mouse relative to the screen*/
	/*the factor that event.pageY-currScroll is multiplied by is the sensitivity, so one scroll of the screen will bring user down 2 screen heights in page*/
	var previousCoordsY = 2*(event.pageY-currScroll);
	$(this).on("mousemove", function(event){
		/*get the Y coords based on the webpage*/
		var pageCoordsY = 2*(event.pageY-currScroll);			
		/*when user click and moves the mouse, want the mouse pointer to stay at the same place relative to document*/
		/*tracks change in mouse location on the screen and matches that with change in scrollTop*/
		var changeCoordsY = previousCoordsY-pageCoordsY;
		$wd.scrollTop(currScroll+changeCoordsY);
		/*update previousCoordsY*/
		previousCoordsY = pageCoordsY;
	});
	$wd.on("mouseup", function(){
		$(this).off('mousemove');
		navBarScrollCall();
	});
});

$(".nav-bar-button, #scroll-up-button").on("click", function(){
	var findElement = $(this).attr("location");
	var findLocation = $(findElement).position().top;
	var scrollTime = parseInt($(this).attr("scroll-time"));
	if (findElement != "html"){
		//html is at the top, so the scroll bar should be up
		justNav = true;
		navBarScrollDown();
	}
	else{
		justNav = true;
		navBarScrollUp();
	}
	//give a bit of space between the target and the top
	$("html,body").animate({scrollTop:findLocation-0.15 * windowHeight}, scrollTime);
	//after slightly more than the time to scroll to target, then scrolling down will cause nav-bar-scroll to scroll up
	setTimeout(function(){justNav=false;}, scrollTime+50);
});

//when window loads, scroll a bit to check the elements
$wd.scrollTop(1);


$(".project").hover(function(){
	//removes this so it can't be run, save fadeout to target the correct one for that element
	clearTimeout($(this).children(".project-description").attr("fadeout"));
	//prevents user from clicking the link when first clicking the image for touch devices
	setTimeout(function(){$(this).children(".project-description").css("visibility", "visible");}.bind($(this)), 10);
	$(this).children(".project-description").animate({'opacity':'0.95'},300);
}, function(){
	//assume user won't click back and forth and hit the link again (which will cause it to appear without seeing on touch devices)
	projectFadeOut = setTimeout(function(){$(this).children(".project-description").css("visibility", "hidden");}.bind($(this)), 400);
	$(this).children(".project-description").animate({'opacity':'0'},300).attr("fadeout", projectFadeOut);
});


rotateTime = 500;
//flip plugin doesn't seem to work
$(".box-placeholder").hover(function(){
	//used same method as .project, assigned the timeout id to the element itself then cancel the timeout from there
	clearTimeout($(this).children(".education-subject-box").attr("rotate"));
	var rotateForward = setTimeout(function(that){
		$(that).find(".front").addClass("hidden");
		$(that).find(".back").removeClass("hidden");
	}, rotateTime/2, this);
	
	//set rotation time
	$(this).children(".education-subject-box").removeClass("rotate-back").addClass("rotate-forward").attr("rotate", rotateForward);
	

}, function(){
	clearTimeout($(this).children(".education-subject-box").attr("rotate"));
	var rotateBackward = setTimeout(function(that){
		$(that).find(".front").removeClass("hidden");
		$(that).find(".back").addClass("hidden");
	}, rotateTime/2, this);	
	$(this).children(".education-subject-box").removeClass("rotate-forward").addClass("rotate-back").attr("rotate", rotateBackward);

	
});


//set the elements to have the transition property (element property, not class
$fadeUp.css({"transition": "opacity 0.5s ease-in-out, transform 0.5s",
"-webkit-transition": "opacity 0.5s ease-in-out, transform 0.5s",
"-moz-transition": "opacity 0.5s ease-in-out, transform 0.5s",
"-o-transition": "opacity 0.5s ease-in-out, transform 0.5s"});

$wd.scroll(function(){
	//t0 = performance.now();
	currScroll = $wd.scrollTop();
	/*shows scroll up button when scroll more than the screen height*/
	if (currScroll >= windowHeight){
		/*keeps snapping back to hidden*/
		$scrollUpButton.fadeIn(500);
	}
	else if (currScroll <= 0.7 * windowHeight){
		$scrollUpButton.fadeOut(500);
	}
	
	/* pauses moving elements in the background while the user scrolls through the bottom part of the page*/
	if (currScroll > 0.3 * windowHeight){
		/* need the get(0) because pause() is a native DOM function, so need to get the DOM element from the jQuery object with get(0)*/
		$laptopVideo.get(0).pause();
		//for guideDownArrow to disappear
		//still want element there as a placeholder, hence cannot use fadeIn
		$guideDownArrow.animate({opacity:0},{duration:300,queue:false});
		//extra time to ensure completely faded out before removing
		if (guideDownHidden==0){
		//only invoke the setTimeout function once so it can be cancelled later
			guideDownHidden = setTimeout(function(){$guideDownArrow.addClass("hidden");},700);
		}
		clearInterval(downArrowBlink);
	}
	else{
		$laptopVideo.get(0).play();
		//for guideDownArrow to reappear
		clearTimeout(guideDownHidden);
		guideDownHidden = 0;
		/*seems to have a problem if default queue:true, other elements queuing*/
		$guideDownArrow.removeClass("hidden").animate({opacity:1},{duration:300,queue:false});
	}

	
	/* for fadein effect when user scroll through webpage */
	$fadeIn.each(function(){
		$(this).fadeInScroll(currScroll);
	});
	
	
	//start fading in the whole element (it starts at 0.2*window height) then slide in
	if(!skillBarShown && currScroll + windowHeight >= $(".skills-div").position().top + 0.4 * windowHeight){
		// reached the skills-div, unroll the graphs
		//max years, everything else should be divided by this to get their length, bar length arrange in descending order of experience
		var maxExperience = $(".expanding-bar:first-child").attr("value");
		$(".expanding-bar").each(function(){
			var percentExperience = $(this).attr("value")/ maxExperience * 100;
			percentExperience = percentExperience.toString()
			$(this).fadeIn(500).animate({"width":percentExperience + "%"},1000);
		});
	}
	
	//slide items up
	$fadeUp.each(function(){
		//offset top gets the top relative to document, position().top gets relative to parent in DOM tree
		if(currScroll + windowHeight >= $(this).offset().top + 0.2* windowHeight){
			$(this).removeClass("fade-up");
		}

	});
		
	if (currScroll < 0.6 * windowHeight && !justNav){
		navBarScrollUp();
	}
	
	/*check if user scrolled down*/
	if (currScroll > previousScroll){
		/*user scrolled down*/
		
		//justNav is to let changes due to clicking navigation button take priority over scrolling changes
		//navBarHover is to track whether the scrollbar is down due to hover, if it is then don't let scrolling interfere with it
		if(!justNav && !navBarHover && currScroll > pegDown + 30){
			navBarScrollUp();
		}	
		//stores the point where user scrolled up (so only after scrolling certain number of pixel then will show navBar)
		pegUp = currScroll;
	}
	/*check if user scrolled up, 0.5 to ensure that user is scrolling up at reasonable speed*/
	if (currScroll < previousScroll){
		//user scrolled up
		if (!justNav && currScroll >= 0.8 * windowHeight && currScroll < pegUp - 30){
			navBarScrollDown();
		}
		//stores the point where user scrolled down (so only after scrolling certain number of pixel then will hide navBar)
		pegDown = currScroll;
	}
	
	/*pauses typing when user is not looking at it, scrolled more than 0.3 of the page down*/
	/*check for indexIntro so less errors on js console*/
	if (currScroll > 0.3 * windowHeight && indexIntro != 0){
		indexIntro.stop();
	}
	else if (indexIntro != 0){
		indexIntro.start();
	}
	
	/*update previousScroll*/
	//console.log(performance.now()-t0);
	previousScroll=currScroll;
	
});




	