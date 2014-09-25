<script>
			Social.loadFacebook = function() {
				if (typeof (FB) != 'undefined') {
					if(typeof (Social.loadFBReporting) != 'undefined') {
						Social.loadFBReporting();
					} 
						if(typeof (StubHub) != 'undefined' &amp;&amp; typeof (StubHub.SocialContent) != 'undefined' &amp;&amp; typeof (StubHub.SocialContent.fbConnectCalls) != 'undefined') {
						StubHub.SocialContent.fbConnectCalls();
					}
					if(typeof(Social.initFBEvents) != 'undefined') {
						Social.initFBEvents();
					}
			    } else {
				    var src = document.location.protocol + "//connect.facebook.net/en_US/all.js#xfbml=1";
					Social.fbPromise = new Promise(function (resolve, reject) {
						$.ajax({
							type: "GET",
							url: src,
							dataType: "script",
							success: function() { 
								resolve(); 
							},
							error: function(jqXHR) { 
							//console.log(jqXHR); 
							}
						});
					});
					Social.fbPromise.then(function() {
						if(typeof (Social.loadFBReporting) != 'undefined') {
							Social.loadFBReporting();
						} 
						if(typeof (StubHub) != 'undefined' &amp;&amp; typeof (StubHub.SocialContent) != 'undefined' &amp;&amp; typeof (StubHub.SocialContent.fbConnectCalls) != 'undefined') {
								StubHub.SocialContent.fbConnectCalls();
						}						
						if(typeof(Social.initFBEvents) != 'undefined') {
							Social.initFBEvents();
						}
					});
			    }
			    Social.fBLoaded = true;
			};

			Social.loadGooglePlus = function() {
				if (typeof (gapi) != 'undefined') {
			        $(".g-plusone").each(function () {
			            gapi.plusone.render($(this).get(0));
			        });
			    } else {
			        $.getScript('https://apis.google.com/js/plusone.js');
			    }
			    Social.gPlusLoaded = true;
			};

			$(document).ready(function(){
    			$(window).scroll(function(){
    				if(typeof (Social.twitterLoaded) != 'undefined' &amp;&amp; Social.twitterLoaded == false) {
        				Social.loadTwitter();
        			}
        			if(typeof (Social.fBLoaded) != 'undefined' &amp;&amp; Social.fBLoaded == false) {
        				Social.loadFacebook();
        			}
    				if(typeof (Social.gPlusLoaded) != 'undefined' &amp;&amp; Social.gPlusLoaded == false) {
        				Social.loadGooglePlus();
        			}
    			});
			});

</script>
