'use strict'; 

var RateStarApp = angular.module("RateStarApp", ['ngRoute', 'ngCookies', 'angulartics', 'angulartics.google.analytics','ngSanitize'])
.config(
	['$routeProvider', 
	function ($routeProvider)
	{ 
	    $routeProvider
		.when('/Login', {
			templateUrl: 'views/Login.html',
			controller: 'LoginController'
		})
		.when('/RequestAccess', {
			templateUrl: 'views/RequestAccess.html',
			controller: 'ReqAccessController'
		})
		.when('/Dashboard', {
			templateUrl: 'views/Dashboard.html',
			controller: 'DashboardController'
		})
		.when('/RequestRateQuote', {
			templateUrl: 'views/RequestRateQuote.html',
			controller: 'RequestRateQuoteController'
		})
		.when('/FinalRates', {
			templateUrl: 'views/FinalRates.html',
			controller: 'FinalRatesController'
		})
		.when('/PremiumPlan', {
			templateUrl: 'views/PremiumPlan.html',
			controller: 'PremiumPlanController'
		})
		.otherwise({
			redirectTo: '/Login'
		});
	}]
);

/**
 * 
 * @deprecated Cookie expiry is handled by api itself
 */ 
RateStarApp.constant("PERSIST_COOKIES", {
    "NMLS_ID_CU": "nmls_idCU_nativeCookie",
    "USER_NAME_CU": "userNameCU_nativeCookie",
    "NMLS_ID_MI": "nmls_idmi_nativeCookie",
    "USER_NAME_MI": "userNameMI_nativeCookie",
    "EXPIRY": "500"
});
/**
 * COOKIE_NAME: Used for all Cookie attribute grouped by functionality 
 */
RateStarApp.constant("COOKIE_NAME", {
    "IS_LOGGED_IN": "isLoggedIn",
    "IS_DASHBOARD_FINAL": "dashboardFinal",
    //nmls, username for cu & mi
    "NMLSID":"nmls_id",
    "NMLSID_CU": "nmls_idCU",
    "NMLSID_MI": "nmls_idMI",
    "USER_NAME":"userName",
    "USER_NAME_CU": "userNameCU",
    "USER_NAME_MI": "userNameMI",
    
    "PAGE_FLOW": "pageFlow",
    
    //mpNum for cu & mi
    "MPN_NUM": "mpNum",
    "MPN_NUM_CU": "mpnNumCU",
    "MPN_NUM_MI": "mpnNumMI",
    "MPN_TRD_CU": "mpnTRDCU",
    "MPN_TRD_MI": "mpnTRDMI",
    "MPN_LIST": "mpnList",
    
    //groupReferenceNumber ,indvReferenceNum1,indvReferenceNum2
    "GROUP_REFERENCE_NUMBER": "groupReferenceNumber",
    "INDV_REFERENCE_NUMBER1": "indvReferenceNum1",
    "INDV_REFERENCE_NUMBER2": "indvReferenceNum2",
   
    //special constant to maintain no of days for cookie expiry
    "EXPIRY_DAYS": "500",
    	
    //Remove Premium Plan for current session
    "REMOVE_PREMIUM_PLAN_PERMANENT":	"removePremiumPlanPermanently",
    "PREMIUM_PLAN_REMOVED":	"premiumPlanRemoved"    	
});

//FEAT 9 - 2.0
RateStarApp.constant("FINALRATES_LABELS", 
{
    "INITIAL_RATE" : "Initial Rate",
    "TOTAL_RATE" : "Total Rate*",
    "TOTAL_INITIAL_PREMIUM" : "Total Initial Premium",
    "INITIAL_PREMIUM" : "Initial Premium",
    "RENEWAL_RATE1" : "1st Renewal Rate",
    "RENEWAL_RATE2" : "2nd Renewal Rate",
    "STATE_TAX" : "Tax",
    "COUNTY_TAXRATE" : "County Tax Rate",
    "MUNI_TAXRATE" : "Muni Tax Rate",
    "YEAR_MITOTAL" : " 5 Year MI Total",
    "YEAR_HOUSINGTOTAL" : "5 Year Housing Total",
    "FHA_COMPARISON" : "FHA Comparison"
});

//US 29 - Hide Single Premium Plan based on elective
RateStarApp.constant("PREMIUM_PLAN_DISPLAY", 
{
    "ELECTIVE_ID" : "16010"  
});

RateStarApp.factory(
	'PersistCookieUtil',
	function()
	{
		return{
			/**
			 * 
			 * @deprecated Cookie expiry is handled by api itself
			 */ 
			setCookie : function(cname, cvalue, exdays) {
			            var d = new Date();
			            d.setTime(d.getTime() + (exdays*24*60*60*1000));
			            var expires = "expires="+d.toUTCString();
			            document.cookie = cname + "=" + cvalue + "; " + expires;
			        },
	        /**
	         * 
	         * @deprecated Cookie expiry is handled by api itself
	         */        
	        getCookie : function(cname) {
	            var name = cname + "=";
	            var ca = document.cookie.split(';');
	            for(var i=0; i<ca.length; i++) {
	                var c = ca[i];
	                while (c.charAt(0)==' ') c = c.substring(1);
	                if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
	            }
	            return "";
	        },
	        /**
	         * @return This will return the Object with expires option as var
	         * @generateExpiryOption to perform the expire option to achieve  Option for  $cookie put(key, value, [options]) 
	         */ 
	        generateExpiryOption:function(exdays){
	        	 var d = new Date();
		            d.setTime(d.getTime() + (exdays*24*60*60*1000));
		            var expires= {expires: d.toUTCString()};
		            return expires;
	        }
	        
		};
	}
);
//cookies fix : END
RateStarApp.factory(
	'GlobalService', 
	function()
	{
	var flow = "";
	var finalResponse="";
	return {
			setFlow: function(data)
			{
				flow = data;
			},
			getFlow: function()
			{
				return flow;
			},
			 setfinalResponse: function(data) 
			 {
				finalResponse = data;
			},
			getfinalResponse: function() 
			{
				return finalResponse;
			}
		};
	}
);
RateStarApp.run(function($rootScope, $cookies, $location,COOKIE_NAME) {
    $rootScope.$on('$locationChangeSuccess', function() {
		var jsonUrl = $location.search();
		var channel = false;
		if(jsonUrl.channel && (jsonUrl.channel === "orig" || jsonUrl.channel === "mail") ) {
			channel = true;
			$rootScope.zipcodeCursor = true;
		}
		if(channel == false && (($cookies.get(COOKIE_NAME.IS_LOGGED_IN) == undefined && $cookies.get(COOKIE_NAME.PAGE_FLOW) == undefined)
		|| ($cookies.get(COOKIE_NAME.IS_LOGGED_IN) == undefined && $cookies.get(COOKIE_NAME.PAGE_FLOW) != "TRD")
		|| ($cookies.get(COOKIE_NAME.IS_LOGGED_IN) == "false" && $cookies.get(COOKIE_NAME.PAGE_FLOW) == undefined)
		|| ($cookies.get(COOKIE_NAME.IS_LOGGED_IN) == "false" && $cookies.get(COOKIE_NAME.PAGE_FLOW) != "TRD"))) {
			if($location.path() == '/RequestAccess') {
				$rootScope.actualLocation = $location.path('/RequestAccess');
			}
			else {
				$rootScope.actualLocation = $location.path('/Login');
				$rootScope.userNamePresClass = "hide";
				$rootScope.mpNumPresClass = "hide";
			}
		} else {
			$rootScope.notScroll = "";
        	if($rootScope.previousLocation == $location.path()) {
				if($rootScope.previousLocation == '/Login') {
					$rootScope.userNamePresClass = "hide";
					$rootScope.mpNumPresClass = "hide";
				}
       	 	}
        	$rootScope.previousLocation = $rootScope.actualLocation;
        	$rootScope.actualLocation = $location.path();
		}
		//QC: 12783
		if($location.path() == '/Login') {
			$rootScope.userNamePresClass = "hide";
			$rootScope.mpNumPresClass = "hide";
		}

    });
});

RateStarApp.directive(
	"moveNextOnMaxlength", 
	function() 
	{
	    return {
	        restrict: "A",
	        link: function($scope, element)
	        {
            element.on("input", function(e)
            {
                if(element.val().length == element.attr("maxlength")) 
                {
					if((element.attr("id")) == "mp1") 
					{
						if(element.val().length == 5)
						{						
							var obj = document.getElementById("mp2");
							obj.focus();
						}
					}
					else if((element.attr("id")) == "mp2")
					{
						if(element.val().length == 4) {						
							var obj = document.getElementById("mp3");
							obj.focus();
						}
					}
					
                }
            });
	        }
	    };
	}
);

RateStarApp.directive(
		"paddZeros", 
		function() 
		{
		    return {
		        restrict: "A",
		        link: function($scope, element, attrs)
		        {
		            element.on("blur", function(e)
		            {
		                if(element.val().length > 0 && element.val().length < element.attr("maxlength")) 
		                {
		                	
		                	var zeros = "";
		                	var index = 0;
		                	while(index < (element.attr("maxlength") - element.val().length))
		                	{
		                		zeros = zeros + "0";
		                		index = index + 1;
		                	}
		                	
		                	if("right" === attrs.paddZeros)
		                	{
		                		element.val(element.val() + zeros);
		                	}
		                	else
	                		{
		                		element.val(zeros + element.val());
	                		}
		                }
		                
		            });
		        }
		    };
		}
	);
RateStarApp.directive('focusMe', function($timeout, $parse) {
  return {
    link: function(scope, element, attrs) {
      var model = $parse(attrs.focusMe);
      scope.$watch(model, function(value) {
        
        if(value === true) { 
          $timeout(function() {
            element[0].focus(); 
          });
        }
      });
      element.bind('blur', function() {
        
      })
    }
  };
});
	

