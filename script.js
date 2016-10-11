angular.module('App', ['facebook'])

  .config([
    'FacebookProvider',
    function(FacebookProvider) {
     var myAppId = '1367223633302978';
     
     FacebookProvider.init(myAppId);
     
    }
  ])
  
  .controller('faceCtrl', [
    '$scope',
    '$timeout',
    'Facebook',
    function($scope, $timeout, Facebook) {

      $scope.user = {};
      $scope.logged = false;
      $scope.signout = false;
      $scope.signin = false;
      
      $scope.$watch(
        function() {
          return Facebook.isReady();
        },
        function(newVal) {
          if (newVal)
            $scope.facebookReady = true;
        }
      );
      
      $scope.IntentLogin = function() {
        Facebook.getLoginStatus(function(response) {
          if (response.status == 'connected') {
            $scope.logged = true;
            $scope.me(); 
          }
          else
            $scope.login();
        });
      };
      
       $scope.login = function() {
         Facebook.login(function(response) {
          if (response.status == 'connected') {
            $scope.logged = true;
            $scope.me();
          }
        
        });
       };
       
        $scope.me = function() {
          Facebook.api('/me', function(response) {
            $scope.$apply(function() {
              $scope.user = response;
            });
            
          });
        };
      
      $scope.logout = function() {
        Facebook.logout(function() {
          $scope.$apply(function() {
            $scope.user   = {};
            $scope.logged = false;  
          });
        });
      }
      
      $scope.$on('Facebook:statusChange', function(ev, data) {
        console.log('Status: ', data);
        if (data.status == 'connected') {
          $scope.$apply(function() {
            $scope.signin = true;
            $scope.signout     = false;    
          });
        } else {
          $scope.$apply(function() {
            $scope.signin = false;
            $scope.signout     = true;

            $timeout(function() {
              $scope.signout = false;
            }, 2000)
          });
        }
        
        
      });
      
      
    }
  ])
  
  .directive('debug', function() {
		return {
			restrict:	'E',
			scope: {
				expression: '=val'
			},
			template:	'<pre>{{debug(expression)}}</pre>',
			link:	function(scope) {
				// pretty-prints
				scope.debug = function(exp) {
					return angular.toJson(exp, true);
				};
			}
		}
	})
  
  ;
