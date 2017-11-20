import { Meteor } from 'meteor/meteor';
import { Push } from 'meteor/raix:push';

Meteor.startup(function () {
	if (Meteor.isCordova) {
		navigator.splashscreen.hide();
	}

	Meteor.autorun(function () {
		if (Meteor.userId()) {
			var userId = Meteor.userId();

			Meteor.call('get_all_notifications_for_badges', userId, function(err,result){
				if (err) {
					//console.log(err.toString());
				} else {
					//if (result > 0) {
						document.addEventListener('deviceready', function () {
							cordova.plugins.notification.badge.set(result);
						}, false);
					//}
				}
			});
		}
	});

	/*document.addEventListener('deviceready', function () {
		cordova.plugins.notification.badge.set(10);
	}, false);*/

	Push.Configure({
		android: {
			senderID: 737486376254,
			alert: true,
			badge: true,
			sound: true,
			vibrate: true,
			clearNotifications: true,
			icon: 'stream_logo_white.png',
			iconColor: '#BE1E2D'
		},
		ios: {
			alert: true,
			badge: false,
			sound: true
		}
	});
});

// Called when message recieved on startup (cold+warm)
Push.addListener('startup', function(notification) {
	var ntfId = notification.payload.ntfId;
	if (notification.payload.streamId) {
		Meteor.call('check_stream_for_push', notification.payload.streamId , function(error, result){
			if (result) {
				FlowRouter.go(result);
				Meteor.call('close_push_ntf', ntfId);
			} else {
				sAlert.error(TAPi18n.__('text.notAvailableStream'));
			}
		});
	} else {
		Meteor.call('close_push_ntf', ntfId);
	}
	
	
	//console.log('startup event',notification);
});


Push.addListener('badge', function(notification) {
	document.addEventListener('deviceready', function () {
		cordova.plugins.notification.badge.set(notification.badge);
	}, false);
});

Push.addListener('message', function(notification) {
	// Called on every ntf that was sent while the app open on mobile(need to do some sound or smth)
	var ntfId = notification.payload.ntfId;
	Meteor.call('close_push_ntf', ntfId);
	sAlert.success(notification.text);	
});
