/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';
/**
 * Write your transction processor functions here
 */

/**
 * A patient authorizes view access of their records to the doctor
 * @param {org.futurists.medchain.AuthorizeAccess} authorize
 * @transaction
 */
async function authorizeAccess(authorize) {

    const me = getCurrentParticipant();
    console.log('me: '+me.getIdentifier());
    const record = authorize.medicalRecord;
    console.log('record: '+record);
    //const record = getAssetRegistry.get(authorize.medicalRecord);
    console.log('**** AUTHORIZE: ' + me.getIdentifier() + ' authorize access of asset '+record +'to ' + authorize.doctor);

    if(!me) {
        throw new Error('A participant/certificate mapping does not exist');
    }

    let index = -1;

    if (me.getIdentifier() !== record.owner.getIdentifier()) {
        throw new Error('You are not the owner of this record '+me.getIdentifier());
    }
    else if(record.authorized.includes(authorize.doctor.doctorId)) {
        console.log('Doctor: '+authorize.doctor.doctorId+' already has access to the record');
    }
    else {
        record.authorized.indexOf(authorize.doctor.doctorId);
        record.authorized.push(authorize.doctor.doctorId);

        // emit an event
        const event = getFactory().newEvent('org.futurists.medchain', 'AccessEvent');
        event.accessTransaction = authorize;
        emit(event);

        //persist the state of the medical record
        const recordRegistry = await getAssetRegistry('org.futurists.medchain.MedicalRecord');
        await recordRegistry.update(record);
    }
}

/**
 * A patient revokes view access of their records from the doctor
 * @param {org.futurists.medchain.RevokeAccess} revoke
 * @transaction
 */
async function revokeAccess(revoke) {

    const me = getCurrentParticipant();
    const record = revoke.medicalRecord;
    console.log('**** REVOKE: ' + me.getIdentifier() + ' revoking access of asset '+record +'to ' + revoke.doctor);

    if(!me) {
        throw new Error('A participant/certificate mapping does not exist');
    }

    if (me.getIdentifier() !== record.owner.getIdentifier()) {
        throw new Error('You are not the owner of this record');
    }

    //removing doctor if they are authorized
    const index = record.authorized ? record.authorized.indexOf(revoke.doctor.getIdentifier()) : -1;

    if(index > -1){
        record.authorized.splice(index, 1);

        //emit an event to revoke access
        const event = getFactory().newEvent('org.futurists.medchain', 'AccessEvent');
        event.accessTransaction = revoke;
        emit(event);

        //persist the state of the medical record
        const recordRegistry = await getAssetRegistry('org.futurists.medchain.MedicalRecord');
        await recordRegistry.update(record);
    }
}