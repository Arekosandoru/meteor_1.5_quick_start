if(Meteor.isClient){
	if(Meteor.settings.public.logEnv && Meteor.settings.public.logEnv === 'production'){
		var console = {
			log: function(){},
			warn: function(){},
			error: function(){},//window.console.error,
			info: function(){},
			debug: function(){}
		};
		window.console = console;
	}	
}
