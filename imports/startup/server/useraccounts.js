Meteor.startup(() => {
	if (Meteor.settings && Meteor.settings.private) {
		ServiceConfiguration.configurations.remove({
		    service: 'facebook'
		});

		ServiceConfiguration.configurations.insert({
		    service: 'facebook',
		    appId: Meteor.settings.private.oAuth.facebook.appId,
		    secret: Meteor.settings.private.oAuth.facebook.secret
		});

        if (Meteor.settings.private.oAuth.vk && Meteor.settings.private.oAuth.vk.appId && Meteor.settings.private.oAuth.vk.secret) {
        	ServiceConfiguration.configurations.remove({
	            service: 'vk'
	        });

	        ServiceConfiguration.configurations.insert({
	            service: 'vk',
	            appId:   Meteor.settings.private.oAuth.vk.appId,
	            secret:  Meteor.settings.private.oAuth.vk.secret,
	            scope:   'email'
	        });
        }
	}

	AccountsMerge.onMerge = function (winner, loser) {
		
	}
});