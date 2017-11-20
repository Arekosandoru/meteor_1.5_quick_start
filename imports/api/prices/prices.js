import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

class PricesCollection extends Mongo.Collection {
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

const Prices = new PricesCollection('Prices');

Prices.allow({
  insert: () => true,
  update: () => true,
  remove: () => false,
});

Prices.schema = new SimpleSchema({
  _id: { 
		type: String
  },
  placeId: { 
		type: String
  },
  quantity: { 
		type: String,
    optional: true
  },
  price: { 
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

Prices.attachSchema(Prices.schema);


Prices.methods({
  create_price: function(param) {
    const user = Meteor.user();
		if (user) {
      if (param) {
        const price = {
          createdBy: user._id,
          createdAt: new Date(),
        };
        return Prices.insert(price);  
      }
		} else {
			throw new Meteor.Error(500, 'You are not authorized to add Prices.');
		}       
	},
	update_price_field: function(priceId, fieldName, fieldValue) {
		let data = {};
		data[fieldName] = fieldValue;

		Prices.update({ _id: priceId }, { $set: data });
	},
	add_element_to_field_array: function(priceId, fieldName, value) {
		let data = {};
		data[fieldName] = value;

		Prices.update({ _id: priceId }, { $push: data });
  },
  deleteRestorePrice: function(priceId, state) {
    Prices.update({ 
      _id: priceId 
    }, { 
      $set: { isDeleted: state } 
    });
  }
});

if (Meteor.isServer) {
	Meteor.methods({
		
	});
}

export { Prices };
