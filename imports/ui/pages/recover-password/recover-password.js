import './recover-password.html';
import './recover-password.less';

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { TemplateVar } from 'meteor/frozeman:template-var';
import { moment } from 'meteor/momentjs:moment';
import { underscore } from 'meteor/underscore';
import { $ } from 'meteor/jquery';
import { Users } from '/imports/api/users/users.js';
import { TAPi18n } from 'meteor/tap:i18n';


Template.recover_password.events({
    'click #recover-btn': function(event, tmpl) {
        event.preventDefault();

        var email = tmpl.find('#recover-email').value;

        Accounts.forgotPassword({ email: email }, function(err) {
            if (err) {
                //FlashMessages.sendError(err.reason);
                sAlert.error(err.reason, { 
                    effect: 'genie',
                    timeout: 5000
                });
            } else {
                sAlert.success(TAPi18n.__('text.resetPassSent'), { 
                    effect: 'genie',
                    timeout: 5000
                });
                //FlashMessages.sendSuccess('We sent you an email, click the link inside to change your password.', { hideDelay: 3000 });
            }
        });
    }
});

Template.recover_password_page.events({
    'click #change-password-btn': function(event, tmpl) {
        event.preventDefault();
        /*FlashMessages.clear();

        var passwordRegex = new RegExp('^(?=.*?[A-Z])(?=.*?[0-9])(?=.*?[!@#$%^&*()_+]).{8,}$');

        var token = FlowRouter.getParam('token');
        var newPassword = tmpl.find('#new-password').value;
        var isValidPass = passwordRegex.test(newPassword);

        if (!isValidPass) {
            FlashMessages.sendError('Password should have at least: 1 UPPER case letter, one number (0-9) and one special character (!@#$%^&*()_+ which is 0-9 with shift) and a Minimum Length of 8 characters.', { autoHide: false });
            return;
        }*/

        const token = FlowRouter.getParam('token'),
            newPassword = tmpl.find('#new-password').value;

        if (password.length < 6) {
            // Password must be at least 6 chars long.
            return;
        }

        Accounts.resetPassword(token, newPassword, function(err) {
            if (err) {
                //FlashMessages.sendError(err.reason);
            } else {
                //FlowRouter.go('/board');
            }
        })
    },


    /*'keyup #new-password': function(ev, tmpl) {
        $('#pass-val').css( "display", "block" );

        var password = tmpl.find('#new-password').value;

        // Check if the password is at least 8 Characters
        var gotEight = new RegExp('.{8,}$').test(password);
        gotEight ? $('#eight-char').css( "color", "green" ) :  $('#eight-char').css( "color", "red" );

        // Check if the password contains at least one Uppercase letter
        var upperCase = new RegExp('^(?=.*?[A-Z]).{1,}$').test(password);
        upperCase ? $('#upper-char').css( "color", "green" ) : $('#upper-char').css( "color", "red" );

        // Check if the password contains at least one Number
        var num = new RegExp('^(?=.*?[0-9]).{1,}$').test(password);
        num ? $('#num-char').css( "color", "green" ) :  $('#num-char').css( "color", "red" );

        // Check if the password containts at least one Specail character (!, @, #, $, ...)
        var special = new RegExp('^(?=.*?[!@#$%^&*()_+]).{1,}$').test(password);
        special ? $('#special-char').css( "color", "green" ) :  $('#special-char').css( "color", "red" );

        // Check if the whole password is valid
        var isValid = new RegExp('^(?=.*?[A-Z])(?=.*?[0-9])(?=.*?[!@#$%^&*()_+]).{8,}$').test(password); 
        if (isValid){
            $('#pas-must').css("color", "green");
            $('#new-password').css("border-color", "green");
        } else {
            $('#pas-must').css("color", "red");
            $('#new-password').css("border-color", "red");
        }
    }*/
});
