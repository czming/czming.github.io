//timeout trackers
var currScroll=0,indexIntro=0,guideDownHidden=0, pegUp, pegDown;
//justNav to track if nav bar was just clicked (ensure that scrolling up does not cause nav-bar-scroll to disappear
justNav = false;
//nav-bar-slide was activated due to hovers
navBarHover = false;
//tracks direction that nav-bar-scroll is going and filter out opposing direction
navScrollDirection = null;

skillBarShown = false;

//store typed objects for content headers
var contentHeaderTyped = {};
//store options for content headers
var contentHeaderTypedOptions = {};

var $fadeIn, $scrollUpButton, $laptopVideo, $guideDownArrow, $navBarSlide, $fadeUp, $contentHeader;



$wd = $(window);

/* for typewriter interface, without strings*/
introHeaderTypedOptions = {
	typeSpeed: 50,
	loop:false,
	backSpeed: 45,
	smartBackspace:true,
	cursorChar: "__",
	startDelay:200,
	backDelay:700
};

/*not sure why but strings only starts reading from second element for longer array(doesn't happen in about.js with only one array element*/
introHeaderTypedOptions["strings"] = ["","Hi, I'm a builder.", "Hi, I'm a creator.", "Hi, I'm a software engineer.", "Hi, I'm Ming."];
	
$(document).ready(function(){
	//can activate these scripts that rely on the DOM first

	/*stores previous scroll point for comparison to see if user scrolled up or down*/
	previousScroll = $wd.scrollTop();
	
	windowHeight = $wd.height();
	documentHeight = $(document).height();

	//typed library from Github by Matt Boldt at www.mattboldt.com under MIT License, attached at scripts/MIT-License.txt
	var jsFiles = ["scripts/eventHandlers.js"];
	//execute as they are called and inserted since DOM is already loaded
	for (var i=0; i<jsFiles.length; i++){
		var element = document.createElement("script");
		element.src = jsFiles[i];
		document.body.appendChild(element);
	}

});
	
/*used window load instead because wanted ensure that the video was loaded as well, window.load removed in jQuery from 3.0*/
$wd.on('load', function(){
	$('#loading-screen').fadeOut(500, "swing");
	/*set some delay so user only sees hi before cursor is shown and start typing*/
	setTimeout(function(){indexIntro = new Typed("#index-intro", introHeaderTypedOptions);},900);
	
}).on('beforeunload', function() {
/*to get browser to scroll to top when refreehing, normal $(window).scrollTop(0) in $(document).ready seems to interfere with Typed.js librar

	/*loading screen to cover the transition, if user is leaving page will also see loading page*/
	$('#loading-screen').fadeIn(100);
	$wd.scrollTop(0); 
}).on('resize', function(){
	/*when user changes orientation or resizes screen*/
	windowHeight = $wd.height();
	documentHeight = $(document).height();
});