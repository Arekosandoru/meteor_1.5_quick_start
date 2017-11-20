import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { SSR } from 'meteor/meteorhacks:ssr';
import { TAPi18n } from 'meteor/tap:i18n';

export const Users = Meteor.users;

Users.allow({
  insert: function(userId, doc) {
      return true;
  },
  update: function(userId, doc, fieldNames, modifier) {
      return true;
  },
  remove: function(userId, doc) {
      return false;
  }
});

Users.methods({
	update_user_field: function(userId, fieldName, fieldValue) {
		let data = {};
		data[fieldName] = fieldValue;
		Users.update({ _id: userId }, { $set: data });
	},
	add_element_to_field_array: function(userId, fieldName, value) {
		let data = {};
		data[fieldName] = value;

		Users.update({ _id: userId }, { $push: data });
  },
  remove_element_from_field_array: function(userId, fieldName, value) {
		let data = {};
		data[fieldName] = value;

		Users.update({ _id: userId }, { $pull: data });
  },
  deleteRestoreUser: function(userId, state) {
    Users.update({ 
      _id: userId 
    }, { 
      $set: { isDeleted: state } 
    });
  },
});

if (Meteor.isServer) {
	Meteor.methods({
    
  });
}

//EMAIL VALIDATOR
function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

function generatePassword() {
  var randomstring = Math.random().toString(36).slice(-8);
  return randomstring;
}