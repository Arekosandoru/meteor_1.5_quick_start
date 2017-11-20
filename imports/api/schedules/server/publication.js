import { Meteor } from 'meteor/meteor';
import { Schedules } from '/imports/api/schedules/schedules';

Meteor.publish('schedules.all', function() {
  return Schedules.find();
});

Meteor.publish('schedules.one', function(paramId) {
  return Schedules.find({
    _id: paramId 
  });
});

