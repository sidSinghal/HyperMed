import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { EHRs } from '../../api/stuff/ehr.js';

/** Initialize the database with a default data document. */
function addData(data) {
  console.log(`  Adding: ${data.name} (${data.owner})`);
  EHRs.insert(data);
}

/** Initialize the collection if empty. */
if (EHRs.find().count() === 0) {
  if (Meteor.settings.defaultEHR) {
    console.log('Creating default data.');
    Meteor.settings.defaultEHR.map(data => addData(data));
  }
}

/** This subscription publishes only the documents associated with the logged in user */
Meteor.publish('EHR', function publish() {
  if (this.userId) {
    const username = Meteor.users.findOne(this.userId).username;
    return EHRs.find({ owner: username });
  }
  return this.ready();
});

/** This subscription publishes all documents regardless of user, but only if the logged in user is the Admin. */
Meteor.publish('EHRAdmin', function publish() {
  if (this.userId && Roles.userIsInRole(this.userId, 'admin')) {
    return EHRs.find();
  }
  return this.ready();
});
