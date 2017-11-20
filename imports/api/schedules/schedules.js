import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

class SchedulesCollection extends Mongo.Collection {
  insert(doc, callback) {
    const ourDoc = doc;
    const result = super.insert(ourDoc, callback);
    return result;
  }
  update(selector, modifier) {
    const result = super.update(selector, modifier);
    return result;
  }
  remove(selector) {
    const result = super.remove(selector);
    //We don't like remove data.
    return false;
  }
}

const Schedules = new SchedulesCollection('Schedules');

Schedules.allow({
  insert: () => true,
  update: () => true,
  remove: () => false,
});

Schedules.schema = new SimpleSchema({
  _id: { 
		type: String
  },
  placeId: { 
		type: String
  },
  days: { 
		type: String,
    optional: true
  },
  time: { 
		type: String,
    optional: true
	},
  createdBy: {
    type: String,
    optional: true
  },
  createdAt: {
    type: Date,
    defaultValue: new Date()
  },
  isDeleted: {
		type: Boolean,
		defaultValue: false
	}
});

Schedules.attachSchema(Schedules.schema);

Schedules.methods({
  create_schedule: function(param) {
    const user = Meteor.user();
		if (user) {
      if (param) {
        const schedule = {
          createdBy: user._id,
          createdAt: new Date(),
        };
        return Schedules.insert(schedule);  
      }
		} else {
			throw new Meteor.Error(500, 'You are not authorized to add Schedules.');
		}       
	},
	update_schedule_field: function(scheduleId, fieldName, fieldValue) {
		let data = {};
		data[fieldName] = fieldValue;

		Schedules.update({ _id: scheduleId }, { $set: data });
	},
	add_element_to_field_array: function(scheduleId, fieldName, value) {
		let data = {};
		data[fieldName] = value;

		Schedules.update({ _id: scheduleId }, { $push: data });
  },
  deleteRestoreSchedule: function(scheduleId, state) {
    Schedules.update({ 
      _id: scheduleId 
    }, { 
      $set: { isDeleted: state } 
    });
  }
});

if (Meteor.isServer) {
	Meteor.methods({
		
	});
}

export { Schedules };
