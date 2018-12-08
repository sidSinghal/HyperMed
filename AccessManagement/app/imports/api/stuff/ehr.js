import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Tracker } from 'meteor/tracker';

/** Create a Meteor collection. */
const EHRs = new Mongo.Collection('EHR');

/** Create a schema to constrain the structure of documents associated with this collection. */
const EHRSchema = new SimpleSchema({
  ehrID: String,
  patient: String,
  healthProvider: String,
  owner: String,
  status: {
    type: String,
    allowedValues: ['complete', 'under-review', 'pending'],
    defaultValue: 'pending',
  },
}, { tracker: Tracker });

/** Attach this schema to the collection. */
EHRs.attachSchema(EHRSchema);

/** Make the collection and schema available to other code. */
export { EHRs, EHRSchema };
