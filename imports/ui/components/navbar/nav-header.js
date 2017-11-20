
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Users } from '/imports/api/users/users.js';
import { TAPi18n } from 'meteor/tap:i18n';

import './nav-header.html';

Template.App_navHeader.onRendered(function() {
	if (Meteor.user() && Meteor.user().profile.lang) {
		TAPi18n.setLanguage(Meteor.user().profile.lang);
	} else {
		const lan = getLang();
		TAPi18n.setLanguage(lan);
	}
});

Template.App_navHeader.helpers({
    
});

Template.App_navHeader.events({
    
});

function getLang() {
	const allowedLan = ['en-US', 'ru-RU'];
	const language = navigator.languages && navigator.languages[0] ||
		navigator.language ||
		navigator.browserLanguage ||
		navigator.userLanguage ||
		'en-US';

	let allowed = _.find(allowedLan, function(lan){
		return lan === language;
	});

	if (allowed) {
		return language;
	} else {
		return 'en-US';
	}
}

function setDropdown(element) {
    const intervalID = setInterval(setDropdown, 100);
    
    function setDropdown() {
        const elem = $(element);
        if (elem.length > 0) {
            $(element).dropdown();
            clearInterval(intervalID);
        }
    };  
}