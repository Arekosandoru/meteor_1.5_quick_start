import { Meteor } from 'meteor/meteor';
import { Photos } from '/imports/api/photos/photos';

Meteor.publish('photos.all', function() {
  return Photos.find();
});

Meteor.publish('photos.one', function(photoId) {
  return Photos.find({
    _id: photoId 
  });
});

