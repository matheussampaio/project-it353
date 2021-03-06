(function () {

  angular.module('fmsc')
    .run(fmscRun)
    .config(fmscConfig);

  function fmscRun($state, $rootScope, AuthService) {
    $rootScope.$on('$stateChangeStart', (event, toState) => {

      const isAuthenticated = AuthService.isAuthenticated();
      const isPrivateAction = angular.isObject(toState.data) && toState.data.private === true;
      const isPublicOnlyAction = angular.isObject(toState.data) && toState.data.publicOnly === true;

      if (isAuthenticated) {
        if (isPublicOnlyAction) {
          event.preventDefault();
          $state.go('app.home');
        }
      } else {
        if (isPrivateAction) {
          event.preventDefault();
          $state.go('app.login', { from: toState.name });
        }
      }
    });
  }

  function fmscConfig($stateProvider, $urlRouterProvider) {
    const appState = {
      url: '/',
      template: '<app></app>'
    };

    const homeState = {
      url: 'home',
      template: '<home></home>'
    };

    const donateState = {
      url: 'donate',
      template: '<donate user="user"></donate>',
      data: {
        private: true
      },
      resolve: {
        user: (AuthService) => AuthService.getUser()
      },
      /* @ngInject */
      controller: ($scope, user) => {
        $scope.user = user;
      }
    };

    const profileState = {
      url: 'profile',
      template: '<profile></profile>',
      data: {
        private: true
      }
    };

    const invoicesState = {
      url: 'invoices',
      template: '<invoices></invoices>',
      data: {
        private: true
      }
    };

    const invoiceDetailsState = {
      url: 'invoice/:invoiceId',
      template: '<invoice invoice="invoice"></invoice>',
      data: {
        private: true
      },
      resolve: {
        user: (AuthService) => AuthService.getUser(),
        invoice: (InvoicesService, $stateParams) => InvoicesService.get($stateParams.invoiceId)
      },
      /* @ngInject */
      controller: ($scope, $state, invoice, user) => {
        $scope.invoice = invoice;

        if (invoice.user !== user.uid) {
          $state.go('app.home');
        }
      }
    };

    const loginState = {
      url: 'login',
      template: '<login></login>',
      data: {
        publicOnly: true
      },
      params: {
        from: 'app.home'
      }
    };

    const registerState = {
      url: 'register',
      data: {
        publicOnly: true
      },
      template: '<register></register>'
    };

    const rankingState = {
      url: 'ranking',
      template: '<ranking></ranking>'
    };

    const aboutState = {
      url: 'about',
      template: '<about></about>'
    };

    const resetPasswordState = {
      url: 'reset',
      data: {
        publicOnly: true
      },
      template: '<reset-password></reset-password>'
    };

    const changePasswordState = {
      url: 'change',
      data: {
        private: true
      },
      template: '<change-password></change-password>'
    };

    $stateProvider
      .state('app', appState)
        .state('app.home', homeState)
        .state('app.donate', donateState)
        .state('app.profile', profileState)
        .state('app.invoices', invoicesState)
        .state('app.invoiceDetails', invoiceDetailsState)
        .state('app.login', loginState)
        .state('app.register', registerState)
        .state('app.about', aboutState)
        .state('app.reset', resetPasswordState)
        .state('app.change', changePasswordState)
        .state('app.ranking', rankingState);

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/home');
  }

})();
