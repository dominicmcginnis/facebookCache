//Create our FastFB object and public methods - using the module pattern
var FastFB = (function ($) {

    var global = window,
        applicationID,
        facebookPage,
        culture,
        apiCalled,
        apiReady;

    var fbCallback = function () {
        // Run the Facebook init() function to initialize the Facebook API
        global.FB.init({ appId: applicationID, status: true, cookie: true, xfbml: true });

        // Detect when FB.init has finished and trigger a persistent notification
        // Source: http://facebook.stackoverflow.com/questions/3548493/how-to-detect-when-facebooks-fb-init-is-complete
        global.FB.getLoginStatus(function (response) {
            $('#fb-like-box').trigger('facebook-api-ready');
            apiReady = true;
        });
    }

    var callAPI = function () {
        if (apiCalled) {		
			fbCallback();
			return;
		}
		apiCalled = true;

        var fbjs = (location.protocol=='https:' ? 'https:' : 'http:') + '//connect.facebook.net/' + culture + '/all.js';

        // Use a proper async script loader here for better stability
        $.getScript(fbjs, fbCallback);

    };

    var parseXFBML = function () {
        // Parse when the API is ready
        if (apiReady) {
            global.FB.XFBML.parse();
        } else {
            $('#fb-like-box').bind('facebook-api-ready', function () {
                global.FB.XFBML.parse();
            });
            callAPI();
        }
    };

    var launchFacebookUI = function () {
        global.FB.ui(options, function (response) {
            if (response && response.post_id) {
                // post was published
            } else {
                // post was not published
            }
        });
    };

	return {
		like: function () {
	        // Open a dialog containing the Facebook "Like Box"
	        var w = 570,
	            h = 488,
	            likeBox = '<div class="fb-like-box" data-href="' + facebookPage + '" data-width="' + w + '" data-height="' + h + '" data-show-faces="true" data-border-color="#fff" data-stream="true" data-header="false"></div>';

	        // Substitute for whatever lightbox script you like
	        //Dialog.open({
	        //    content: likeBox,
	        //    width: w,
	        //    height: h + 7 // avoid scroll bars
	        //});
			$( "#dialog" ).html(likeBox).dialog({
					dialogClass : {'fb-dialog fb-corner-all fb-widget-content'},
					position: {  my: "center", at: "left bottom", of: window },
					height: 594,
					width: 615,
					draggable: false,
					modal: false,
					resizable: false,
					closeOnEscape: true,
			        buttons: {
           				"close": function(){ $(this).dialog("close"); }
            		},
					open: function (event, ui) {
    					$('#dialog').css('overflow', 'hidden');
  					}					
				});
			$(".ui-dialog-titlebar").hide();
	        // Let Facebook find and populate the like box element
	        parseXFBML();
	    },

    	share: function (options) {
	        var defaults = {
	            app_id: applicationID,
	            method: 'feed',
	            message: null
	        };
	        options = $.extend(defaults, options);
	
	        if (apiReady) {
	            launchFacebookUI();
	        } else {
	            $('#fb-like-box').bind('facebook-api-ready', launchFacebookUI);
	            callAPI();
	        }
    	},

		init: function() {		
			// Initialization
	    	apiCalled = false;
	    	apiReady = false;

		    culture = 'en_US';
		    applicationID = '************';
		    facebookPage = '************';
    
		    // Add fb-root element if necessary
		    if ($('#fb-root').length === 0) $('<div id="fb-root" />').appendTo('body');

		    // Bind like function to like buttons
		    $('.fb_like_button').bind('click', function() { FastFB.like(); });
		}	   
	};

}(jQuery));

//Setup and Initialize the FastFB object
(function ($) {
	FastFB.init();
}(jQuery));
