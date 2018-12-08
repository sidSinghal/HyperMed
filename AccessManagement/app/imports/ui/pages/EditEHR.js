import React from 'react';
import { Grid, Loader, Header, Segment } from 'semantic-ui-react';
import { EHRs, EHRSchema } from '/imports/api/stuff/ehr';
import { Bert } from 'meteor/themeteorchef:bert';
import AutoForm from 'uniforms-semantic/AutoForm';
import TextField from 'uniforms-semantic/TextField';
import NumField from 'uniforms-semantic/NumField';
import SelectField from 'uniforms-semantic/SelectField';
import SubmitField from 'uniforms-semantic/SubmitField';
import HiddenField from 'uniforms-semantic/HiddenField';
import ErrorsField from 'uniforms-semantic/ErrorsField';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';

/** Renders the Page for editing a single document. */
class EditEHR extends React.Component {

  /** On successful submit, insert the data. */
  submit(data) {
    const { ehrID, patient, healthProvider, status, _id } = data;
    EHRs.update(_id, { $set: { ehrID, patient, healthProvider, status } }, (error) => (error ?
        Bert.alert({ type: 'danger', message: `Update failed: ${error.message}` }) :
        Bert.alert({ type: 'success', message: 'Update succeeded' })));
  }

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  /** Render the form. Use Uniforms: https://github.com/vazco/uniforms */
  renderPage() {
    return (
        <Grid container centered>
          <Grid.Column>
            <Header as="h2" textAlign="center">Edit EHR</Header>
            <AutoForm schema={EHRSchema} onSubmit={this.submit} model={this.props.doc}>
              <Segment>
                <TextField name='ehrID'/>
                <TextField name='patient'/>
                <TextField name='healthProvider'/>
                <SelectField name='status'/>
                <SubmitField value='Submit'/>
                // <SubmitField value='Cancel'/>
                <ErrorsField/>
                <HiddenField name='owner' />
              </Segment>
            </AutoForm>
          </Grid.Column>
        </Grid>
    );
  }
}

/** Require the presence of a EHR document in the props object. Uniforms adds 'model' to the props, which we use. */
EditEHR.propTypes = {
  doc: PropTypes.object,
  model: PropTypes.object,
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(({ match }) => {
  // Get the documentID from the URL field. See imports/ui/layouts/App.jsx for the route containing :_id.
  const documentId = match.params._id;
  // Get access to EHR documents.
  const subscription = Meteor.subscribe('EHR');
  return {
    doc: EHRs.findOne(documentId),
    ready: subscription.ready(),
  };
})(EditEHR);
