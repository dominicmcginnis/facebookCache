//Create our FastFB object and public methods - using the module pattern
var FastFB = (function ($) {

    var global = window,
        applicationID,
        facebookPage,
        culture,
        apiCalled,
        apiReady,
        fbUid,
        fbAccessToken;

    var fbCallback = function () {
        // Run the Facebook init() function to initialize the Facebook API
        global.FB.init({ appId: applicationID, status: true, cookie: true, xfbml: true });

        // Detect when FB.init has finished and trigger a persistent notification
        // Source: http://facebook.stackoverflow.com/questions/3548493/how-to-detect-when-facebooks-fb-init-is-complete
        global.FB.getLoginStatus(function (response) {
        	console.log("login status response: " + response.status)
  			if (response.status === 'connected') {
			    // the user is logged in and has authenticated your
			    // app, and response.authResponse supplies
			    // the user's ID, a valid access token, a signed
			    // request, and the time the access token 
			    // and signed request each expire
			    fbUid = response.authResponse.userID;
			    fbAccessToken = response.authResponse.accessToken;
			    console.log("fb access token: " + fbAccessToken);
			 } else if (response.status === 'not_authorized') {
			    // the user is logged in to Facebook, 
			    // but has not authenticated your app
			 }        	
        	$('#fb-like-box').trigger('facebook-api-ready');
        	apiReady = true;
        });

    };

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
		    console.log("API is ready!");
            triggerLike();
            global.FB.XFBML.parse();
        } else {
            $('#fb-like-box').bind('facebook-api-ready',function () {
		        console.log("triggered facebook-api-ready callback!");
	        	triggerLike();
		        global.FB.XFBML.parse();
    		});
            callAPI();
        }
    };

    var triggerLike = function() {
        //$("#u_0_0").trigger( "submit" );
		// Doing a XD submit trigger… Obviously fails due to XD issues
			//$('.fb-like-box').find('iframe').contents().trigger('submit')

		//Utilizing the FB.Event.fire and FB.EventProvider.fire to send an "edge.create" message – this too failed.  And I did notice the warning that this method will be removed.
//        FB.Event.subscribe("edge.create", function () { console.log("edge.create fired")});
//        FB.Event.fire("edge.create");

		//Calling the Open Graph API, but again fails since getLoginStatus returns 'not_authorized' so I can't access the user or access tokens.
//		$.post('https://graph.facebook.com/'+facebookPage+'/likes', {access_token: fbAccessToken}, function() {
//			console.log("called facebook grpah for: " + facebookPage);
//		});

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
		    applicationID = '****************';
		    facebookPage = 'http://www.facebook.com/stubhub';
    
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
