import './admin_panel.html';
import './admin_panel.less';

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { TemplateVar } from 'meteor/frozeman:template-var';
import { moment } from 'meteor/momentjs:moment';
import { underscore } from 'meteor/underscore';
import { $ } from 'meteor/jquery';
import { TAPi18n } from 'meteor/tap:i18n';

import { Users } from '/imports/api/users/users.js';

Template.admin_panel.onRendered(function() {
    
});

Template.admin_panel.onDestroyed(function () {
});


Template.admin_panel.helpers({
    
});

Template.admin_panel.events({

});