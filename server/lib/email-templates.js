this.Templates = {};

Templates.recoverPassword = {
    path: 'email-template/recover_password_email.html',
    css: 'email-template/recover_password_email.css'
}
Templates.inviteEmail = {
    path: 'email-template/invite_email.html',
    css: 'email-template/invite_email.css',
    route: {
    	path: '/inviteEmail/',
    	data: {
    		
    	}
    }
}
Templates.notificationEmail = {
    path: 'email-template/notification_email.html',
    css: 'email-template/notification_email.css'
}