import './stripe-page.html';
import './stripe-page.less';

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

import { Users } from '../../../api/users/users.js';

Template.stripe_page.onRendered(function() {
	Session.set('customer_invoices', null);
	Session.set('subscription_status', null);

	TemplateVar.set('invite_member', false);
	TemplateVar.set('selectedItem', null);

	this.autorun(() => {
		const user = Meteor.user();

		if (user && user.profile && user.profile.isSubscribed) {
			Meteor.call('get_customer_invoices', function(err, response) {
				if (err) {
					sAlert.error(err.toString());
				} else {
					Session.set('customer_invoices', response);
				}
			});
		}
 
		if (user) {
			Meteor.call('get_user_subscription_status', function(err, response) {
				if (err) {
					sAlert.error(err.toString());
				} else {
					Session.set('subscription_status', response);
				}
			});
		}
	});

	//Language
	if (Meteor.user() && Meteor.user().profile.lang) {
		TAPi18n.setLanguage(Meteor.user().profile.lang);
	} else {
		const lan = getLang();
		TAPi18n.setLanguage(lan);
	}
});

Template.stripe_page.helpers({
	plans() {
		const plans = Meteor.settings.public.plans;

		if (plans) {
			return plans;
		}
	},
	get_subscription_status() {
		const status = Session.get('subscription_status');

		if (status) {
			return status;
		}
	},
    get_customer_invoices() {
    	const invoices = Session.get('customer_invoices');

    	if (invoices && invoices.data && invoices.data.length > 0) {
    		let dataArr = [];

    		invoices.data.forEach((invoice) => {
    			const data = {
    				total: invoice.total / 100,
    				payDate: moment(new Date(invoice.date * 1000)).format('DD MMMM, YYYY HH:mm')
    			};

    			dataArr.push(data);
    		});

    		return dataArr;
    	}
    },
    get_years: function() {
    	const years = [];
    	const currentYear = new Date().getFullYear();
    	const maxYear = currentYear + 50;

    	for (var i = currentYear; i <= maxYear; i++) {
    		const data = {
    			year: i,
    			// Need the year in two digits format for Stripe
    			value: i - 2000
    		};

    		years.push(data);
    	}

    	return years;
    },
    get_months: function() {
    	const months = [{
    		month: '01',
    		value: 1
    	}, {
    		month: '02',
    		value: 2
    	}, {
    		month: '03',
    		value: 3
    	}, {
    		month: '04',
    		value: 4
    	}, {
    		month: '05',
    		value: 5
    	}, {
    		month: '06',
    		value: 6
    	}, {
    		month: '07',
    		value: 7
    	}, {
    		month: '08',
    		value: 8
    	}, {
    		month: '09',
    		value: 9
    	}, {
    		month: '10',
    		value: 10
    	}, {
    		month: '11',
    		value: 11
    	}, {
    		month: '12',
    		value: 12
    	}];

    	return months;
    },
    get_items() {
    	const items = Meteor.settings.public.items;

    	if (items) {
    		return items;
    	}
    },
    inviteMember() {
		return TemplateVar.get('invite_member');
	},
	get_users_points() {
		const user = Meteor.user();

		if (user && user.invitedUsers && user.invitedUsers.length > 0) {
			let usedPoints = 0;

			if (user.itemsClaimed && user.itemsClaimed.length > 0) {
				user.itemsClaimed.forEach(function(claimedItem) {
					usedPoints += claimedItem.value;
				});
			}

			const invitedUsers = _.filter(user.invitedUsers, function(invitedUser) {
        		return invitedUser.isAccountActivated;
        	});

			if (invitedUsers && invitedUsers.length > 0) {
				const points = invitedUsers.length - usedPoints;
				return points;
			}
		}

		return 0;
	},
	user_have_enough_points() {
		const user = Meteor.user();
		const selectedItem = TemplateVar.get('selectedItem');
		const items = Meteor.settings.public.items;

		if (!selectedItem) {
			return false;
		}

		if (user && user.invitedUsers && user.invitedUsers.length > 0) {
			let item;

			for (let i = 0; i < items.length; i++) {
				if (items[i].name === selectedItem) {
					item = items[i];
					break;
				}
			}

			if (item) {
				let usedPoints = 0;

				if (user.itemsClaimed && user.itemsClaimed.length > 0) {
					user.itemsClaimed.forEach(function(claimedItem) {
						usedPoints += claimedItem.value;
					});
				}

				const invitedUsers = _.filter(user.invitedUsers, function(invitedUser) {
	        		return invitedUser.isAccountActivated;
	        	});
				
				if (invitedUsers && invitedUsers.length > 0) {
					const points = invitedUsers.length - usedPoints;

					if (points >= item.value) {
						return true;
					}
				}
			}
		}

		return false;
	}
});

Template.stripe_page.events({
    'click #get-for-free-modal-open': function () {
        $('#get-for-free-modal').show();
    },
    'click #get-for-free-modal i.close':function () {
        $('#get-for-free-modal').hide();
    },
	'click #subscribe_customer_btn': function(ev, tmpl) {
		const user = Meteor.user(),
			cardNumber = tmpl.find('#credit_card_number').value,
			cardCSV = tmpl.find('#credit_card_csv').value,
			cardYear = tmpl.find('#credit_card_year').value,
			cardMonth = tmpl.find('#credit_card_month').value,
			plan = tmpl.find('#select_subscription_plan').value,
			coupon = tmpl.find('#coupon_code').value;

		if (!user) {
			sAlert.error(TAPi18n.__('text.mustBeLoggedInToSubscribe'));
			return;
		}

		if (!plan) {
			sAlert.error(TAPi18n.__('text.invalidSubscriptionPlan'));
			return;
		}

		if (!cardNumber) {
			sAlert.error(TAPi18n.__('text.invalidCardNumber'));
			return;
		}

		if (!cardCSV) {
			sAlert.error(TAPi18n.__('text.invalidCSV'));
			return;
		}

		if (!cardYear) {
			sAlert.error(TAPi18n.__('text.invalidCardYear'));
			return;
		}

		if (!cardMonth) {
			sAlert.error(TAPi18n.__('text.invalidCardMonth'));
			return;
		}

		$('.subscription-btn').attr('disabled', true);

		Meteor.call('create_subscription', cardNumber, cardCSV, cardYear, cardMonth, function(err, tokenId) {
			if (err) {
				sAlert.error(err);
				$('.subscription-btn').attr('disabled', false);
			} else {
				$('#credit_card_number').val('');
				$('#credit_card_csv').val('');
				$('#credit_card_year').val('');
				$('#credit_card_month').val('');
				$('#coupon_code').val('');

				if (user.profile && user.profile.customerId) {
		            Meteor.call('add_update_payment_source', tokenId, coupon, function(error) {
		                if (error) {
		                   	sAlert.error(error);
		                } else {
		                	sAlert.success(TAPi18n.__('text.cardAcepted'));
		                }

		                $('.subscription-btn').attr('disabled', false);
		            });
		            
		            Meteor.call('create_update_subscription', plan, function(error) {
		                if (error) {
		                    sAlert.error(error);
		                } else {
		                	sAlert.success(TAPi18n.__('text.subscriptionCreated'));
		                }

		                $('.subscription-btn').attr('disabled', false);
		            });    
		        } else {
		        	Meteor.call('add_payment_and_subscribe', tokenId, plan, coupon, function(error) {
		                if (error) {
		                    sAlert.error(error);
		                } else {
	                	 	sAlert.success(TAPi18n.__('text.subscribeSuccess'));
		                }

		                $('.subscription-btn').attr('disabled', false);
		            }); 
		        }
			}
		});
	},
	'click #update_card_btn': function(ev, tmpl) {
		const cardNumber = tmpl.find('#update_credit_card_number').value,
			cardCSV = tmpl.find('#update_credit_card_csv').value,
			cardYear = tmpl.find('#update_credit_card_year').value,
			cardMonth = tmpl.find('#update_credit_card_month').value;

		if (!cardNumber) {
			sAlert.error(TAPi18n.__('text.invalidCardNumber'));
			return;
		}

		if (!cardCSV) {
			sAlert.error(TAPi18n.__('text.invalidCSV'));
			return;
		}

		if (!cardYear) {
			sAlert.error(TAPi18n.__('text.invalidCardYear'));
			return;
		}

		if (!cardMonth) {
			sAlert.error(TAPi18n.__('text.invalidCardMonth'));
			return;
		}

		$('.subscription-btn').attr('disabled', true);

		Meteor.call('update_customer_card', cardNumber, cardCSV, cardYear, cardMonth, function(err, tokenId) {
			if (err) {
				sAlert.error(err);
				$('.subscription-btn').attr('disabled', false);
			} else {
				$('#update_credit_card_number').val('');
				$('#update_credit_card_csv').val('');
				$('#update_credit_card_year').val('');
				$('#update_credit_card_month').val('');

				Meteor.call('add_update_payment_source', tokenId, function(error) {
	                if (error) {
	                    sAlert.error(error);
	                } else {
	                	sAlert.success(TAPi18n.__('text.cardUpdated'));
	                }

	                $('.subscription-btn').attr('disabled', false);
	            });
			}
		});
	},
	'click #active_update_plan_btn': function(ev, tmpl) {
		const plan = tmpl.find('#update_subscription_plan').value;

		if (!plan) {
			sAlert.error(TAPi18n.__('text.invalidSubscriptionPlan'));
			return;
		}

		$('.subscription-btn').attr('disabled', true);

		Meteor.call('create_update_subscription', plan, function(err) {
			if (err) {
				sAlert.error(err);
			} else {
				sAlert.success(TAPi18n.__('text.planUpdated'));
			}

			$('.subscription-btn').attr('disabled', false);
		});
	},
	'click #use_coupon_btn': function(ev, tmpl) {
		const coupon = tmpl.find('#use_coupon_code').value;

		if (!coupon) {
			sAlert.error(TAPi18n.__('text.invalidVoucher'));
			return;
		}

		$('.subscription-btn').attr('disabled', true);

		Meteor.call('use_coupon', coupon, function(err) {
			if (err) {
				sAlert.error(err);
			} else {
				$('#use_coupon_code').val('');
				sAlert.success(TAPi18n.__('text.vouchedAdded'));
			}

			$('.subscription-btn').attr('disabled', false);
		});
	},
	'click #cancel_subscription_btn': function(ev) {
		event.preventDefault();

	    const parentNode = $('body')[0];
		const onConfirm = () => {
			$('.subscription-btn').attr('disabled', true);

			Meteor.call('cancel_subscription', function(err, response) {
				if (err) {
					sAlert.error(err);
				} else {
					sAlert.success(TAPi18n.__('text.subscriptionCanceled'));
				}

				$('.subscription-btn').attr('disabled', false);
			});
		}

		const message = TAPi18n.__('text.areYouSureYouWantToCancelSubscription');

		onConfirm();

		/*// Sometimes the modal doesn't show - this makes sure that the modal is visible
	    $('#modal').show();

	    Blaze.renderWithData(Template.confirmModal, {
	    	onConfirm,
	    	message
	    }, parentNode);*/
	},
	'click #delete_card_data_btn': function(ev) {
		event.preventDefault();

	    const parentNode = $('body')[0];
		const onConfirm = () => {
			$('.subscription-btn').attr('disabled', true);

			Meteor.call('delete_customer_data', function(err, response) {
				if (err) {
					sAlert.error(err);
				} else {
					sAlert.success(TAPi18n.__('text.cardRemovedAndSubscriptionCanceled'));
				}

				$('.subscription-btn').attr('disabled', false);
			});
		}

		const message = TAPi18n.__('text.areYouSureYouWantToDeleteCardData');

		onConfirm();

		/*// Sometimes the modal doesn't show - this makes sure that the modal is visible
	    $('#modal').show();

	    Blaze.renderWithData(Template.confirmModal, {
	    	onConfirm,
	    	message
	    }, parentNode);*/
	},
	'click #invite_member': function(ev) {
		TemplateVar.set('invite_member', true);
	},
	'click #close_member_btn': function(ev) {
		TemplateVar.set('invite_member', false);
	},
	'click #invite_member_btn': function(ev, tmpl) {
        ev.preventDefault();

        const email = tmpl.find('#user_email').value;

		Meteor.call('userInviteAndFollowUser', email, function(err) {
			if (err) {
				sAlert.error(err);
			} else {
				sAlert.success(TAPi18n.__('text.memberInviteSuccess'));
			}
		});

        TemplateVar.set('invite_member', false);
	},
	'change #selected_item': function(ev) {
		const itemName = $(ev.target).val();

		if (itemName) {
			TemplateVar.set('selectedItem', itemName);
		}
	},
	'click #claim_item': function(ev, tmpl) {
		const itemName = tmpl.find('#selected_item').value;
		const user = Meteor.user();

		if (itemName) {
			const items = Meteor.settings.public.items;


			if (user && user.invitedUsers && user.invitedUsers.length > 0) {
				let item;

				for (let i = 0; i < items.length; i++) {
					if (items[i].name === itemName) {
						item = items[i];
						break;
					}
				}

				if (item) {
					const invitedUsers = _.filter(user.invitedUsers, function(invitedUser) {
		        		return invitedUser.isAccountActivated;
		        	});
					
					if (invitedUsers && invitedUsers.length > 0) {
						const points = invitedUsers.length;

						if (points >= item.value) {
							Meteor.call('send_email_to_admins', itemName);
						}
					}
				}
			} else {
				sAlert.error(TAPi18n.__('text.userNotFound'));
			}	
		} else {
			sAlert.error(TAPi18n.__('text.itemNotSelected'));
		}
	}
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