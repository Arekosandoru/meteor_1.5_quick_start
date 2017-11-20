import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { TemplateVar } from 'meteor/frozeman:template-var';
import { moment } from 'meteor/momentjs:moment';
import { underscore } from 'meteor/underscore';
import { $ } from 'meteor/jquery';
import { TAPi18n } from 'meteor/tap:i18n';

import { RedisOplog } from 'meteor/cultofcoders:redis-oplog';
import { MailTime } from 'meteor/devatgidrio:meteor-emailer';


if (Meteor.isServer) {
  // Change the template of Recover Password Emails
  if (typeof Accounts !== "undefined" && Accounts !== null) {
    if ((resetPW = Accounts.emailTemplates) != null) {
      resetPW.resetPassword.html = function(user, resetPasswordUrl) {
        var options;

        options = _.extend({}, Templates.recoverPassword, {
          subject: Accounts.emailTemplates.resetPassword.subject(user)
        });
        SSR.compileTemplate('recover_password_email', Assets.getText('recover_password_email.html'));
        var emailData = {
            resetPasswordUrl:resetPasswordUrl
        }; 

        options.user = user;
        options.resetPasswordUrl = resetPasswordUrl;

        return SSR.render('recover_password_email', emailData); //Mailer.render('recoverPassword', options);
      };
    }
  }

  Meteor.startup(function () {
    
    var emailAdd = "noreply@sitename.tv";

    // SETUP EMAIL ENVIORMENT
    process.env.MAIL_URL = 'smtps://noreply%sitesettings';
    Accounts.emailTemplates.from = 'noreply@sitename.tv';
    Accounts.emailTemplates.siteName = 'www.sitename.tv';

    MailerNew = new MailTime({
        login: emailAdd,
        host: 'mail.gosportz.tv',
        connectionUrl: 'smtps://' + emailAdd + ':nGCcABUCO1871@mail.gosportz.tv:465',
        accountName: emailAdd,
        saveHistory: true,
        verbose: false
    });
  });
}

Meteor.call('get_emails');