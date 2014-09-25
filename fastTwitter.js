var FastTwitter = (function ($) {

    var twitterCallback = function () { }''

    var callAPI = function () {
        if (apiCalled) {		
			twitterCallback();
			return;
		}
		apiCalled = true;

        var twitterjs = (location.protocol=='https:' ? 'https:' : 'http:') + '//platform.twitter.com/widgets.js';

        // Use a proper async script loader here for better stability
        $.getScript(twitterjs, twitterCallback);

    };

    var parseXFBML = function () {
        // Parse when the API is ready
        if (apiReady) {
		    console.log("API is ready!");
            global.FB.XFBML.parse();
        } else {
            $('#fb-like-box').bind('facebook-api-ready',function () {
		        console.log("triggered facebook-api-ready callback!");
		        global.FB.XFBML.parse();
    		});
            callAPI();
        }
    };

    var launchTwitterUI = function () {
        global.FB.ui(options, function (response) {
            if (response && response.post_id) {
                // post was published
            } else {
                // post was not published
            }
        });
    };

	return {
		follow: function () {
	        // Open a dialog containing the Facebook "Like Box"
	        var w = 570,
	            h = 488,
	            likeBox = '<div class="fb-like-box" data-href="' + facebookPage + '" data-width="' + w + '" data-height="' + h + '" data-show-faces="true" data-border-color="#fff" data-stream="true" data-header="false"></div>';

			$( "#dialog" ).html(likeBox).dialog({
					dialogClass: 'fb-dialog fb-corner-all fb-widget-content',
					position: {  my: "center", at: "left bottom", of: window },
					height: 520,
					width: 570,
					draggable: false,
					modal: false,
					resizable: false,
					closeOnEscape: true,
			        buttons: {
           				"close": function(){ 
           						$(this).dialog("close"); 
       						}
            		}					
				});
			$(".ui-dialog-titlebar").hide();
	        parseXFBML();
	    },
		init: function() {		
			// Initialization
	    	apiCalled = false;
	    	apiReady = false;

		    applicationID = '****************';
		    twitterPage = 'https://twitter.com/stubhub';
    
		    // Bind follow function to follow buttons
		    $('.twitter_follow_button').bind('click', function() { FastTwitter.follow(); });
		}	   
	};

}(jQuery));

//Setup and Initialize the FastTwitter object
(function ($) {
	FastTwitter.init();
}(jQuery));
