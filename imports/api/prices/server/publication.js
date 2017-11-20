import { Meteor } from 'meteor/meteor';
import { Prices } from '/imports/api/prices/prices';

Meteor.publish('prices.all', function() {
  return Prices.find();
});

Meteor.publish('prices.one', function(paramId) {
  return Prices.find({
    _id: paramId 
  });
});

