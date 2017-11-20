import './app-body.html';

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { TAPi18n } from 'meteor/tap:i18n';

import '/imports/ui/components/loading/loading.js';
import '/imports/ui/components/navbar/nav-header.js';
import '/imports/ui/components/footer/footer.js';

if (!Meteor.isCordova) {
  	import '../lib/semantic.css';
  	import '../lib/semantic.js';
  	import '../stylesheets/util/semantic-fix.less'
}

Template.App_body.onCreated(function() {
});

Template.App_body.helpers({
	
});

Template.App_body.events({

});