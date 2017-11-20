import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

class PhotosCollection extends Mongo.Collection {
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

const Photos = new PhotosCollection('Photos');

Photos.allow({
  insert: () => true,
  update: () => true,
  remove: () => false,
});

Photos.schema = new SimpleSchema({
  _id: { 
		type: String
  },
  link: {
    type: String,
    optional: true
  },
  extension: { 
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

Photos.attachSchema(Photos.schema);


Photos.methods({
  create_photo: function(param) {
    const user = Meteor.user();
		if (user) {
      if (param) {
        const photo = {
          createdBy: user._id,
          createdAt: new Date(),
        };
        return Photos.insert(photo);  
      }
		} else {
			throw new Meteor.Error(500, 'You are not authorized to add Photos.');
		}       
	},
	update_photo_field: function(photoId, fieldName, fieldValue) {
		let data = {};
		data[fieldName] = fieldValue;

		Photos.update({ _id: photoId }, { $set: data });
	},
	add_element_to_field_array: function(photoId, fieldName, value) {
		let data = {};
		data[fieldName] = value;

		Photos.update({ _id: photoId }, { $push: data });
  },
  deleteRestorePhoto: function(photoId, state) {
    Photos.update({ 
      _id: photoId 
    }, { 
      $set: { isDeleted: state } 
    });
  }
});

if (Meteor.isServer) {
	Meteor.methods({
		
	});
}

export { Photos };
