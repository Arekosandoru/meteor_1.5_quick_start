import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';
import { AccountsTemplates } from 'meteor/useraccounts:core';
import { TAPi18n } from 'meteor/tap:i18n';

import { Users } from '/imports/api/users/users.js';

import '/imports/ui/layouts/app-body.js';
import '/imports/ui/pages/app-not-found.js';
import '/imports/ui/pages/home/home.js';
import '/imports/ui/pages/stripe-page/stripe-page.js';
import '/imports/ui/pages/recover-password/recover-password.js';
import '/imports/ui/pages/login-register/login/login.js';
import '/imports/ui/pages/login-register/register/register.js';

import '/imports/ui/pages/admin-panel/admin_panel.js';

FlowRouter.route('/', {
  name: 'Home',
  action() {
    const userId = Meteor.userId();

    if (Meteor.isCordova) {
      if (userId) {
        BlazeLayout.render('App_body', { main: 'home' });
      } else {
        FlowRouter.go('/signin');
      }
    } else {
        BlazeLayout.render('App_body', { main: 'home' });
    }
  },
  subscriptions: function(params, queryParams) {
    const userId = Meteor.userId();
    this.register('users.one', Meteor.subscribe('users.one', userId));
  }
});

// ADMIN PANEL
FlowRouter.route('/admin-panel', {
  name: 'Manage page',
  action() {
      const isAdmin = true;
      if (isAdmin) {
        BlazeLayout.render('App_body', { main: 'admin_panel' });      
      } else {
        FlowRouter.go('/');
      }
  },
  subscriptions: function(params, queryParams) {
    
  }
});

FlowRouter.route('/recover-password', {
  name: 'recover password',
  action: function() {
      if (!Meteor.userId()) {
          BlazeLayout.render('App_body', {
            main:'recover_password'
          });
      } else {
          FlowRouter.go('/');
      }
  }
});

FlowRouter.route('/change-password/:token', {
  name: 'change password',
  action: function() {
      if (!Meteor.userId()) {
          BlazeLayout.render('App_body', {
            main:'recover_password_page'
          });
      } else {
          FlowRouter.go('/');
      }
  }
});

FlowRouter.route('/signin', {
  name: 'Sign In',
  action: function() {
    if (!Meteor.userId()) {
      if (Meteor.isCordova) {
        BlazeLayout.render('App_body', {
          main: 'login_mobile'
        });
      } else {
        BlazeLayout.render('App_body', {
          main: 'login'
        });
      }
    } else {
      FlowRouter.go('/');
    }
  }
});

FlowRouter.route('/register', {
  name: 'Register',
  action: function() {
    if (!Meteor.userId()) {
      if (Meteor.isCordova) {
        BlazeLayout.render('App_body', {
          main: 'register_mobile'
        });
      } else {
        BlazeLayout.render('App_body', {
          main: 'register'
        });
      }
    } else {
      FlowRouter.go('/');
    }
  }
});

FlowRouter.route('/stripe', {
  name: 'Stripe',
  action() {
    const userId = Meteor.userId();

    if (userId) {
      BlazeLayout.render('App_body', { main: 'stripe_page' });
    } else {
      FlowRouter.go('/');
    }
  },
  subscriptions: function(params, queryParams) {
    this.register('users.me', Meteor.subscribe('users.me'));
  }
});

FlowRouter.notFound = {
  action() {
    BlazeLayout.render('App_body', { main: 'App_notFound' });
  },
};
