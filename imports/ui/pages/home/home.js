import './home.html';
import '../home-web/home-web.js';

import { Template } from 'meteor/templating';

Template.home.onRendered(function() {

});

Template.home.helpers({
	/*is_cordova() {
		return (Meteor.isCordova || Meteor.settings.public.mobileDev);
  	}*/
});
