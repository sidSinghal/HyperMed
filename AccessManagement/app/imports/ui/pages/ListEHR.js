import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Container, Table, Header, Loader } from 'semantic-ui-react';
import { EHRs } from '/imports/api/stuff/ehr';
import EHRItem from '/imports/ui/components/EHRItem';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';

/** Renders a table containing all of the EHR documents. Use <EHRItem> to render each row. */
class ListEHR extends React.Component {

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  /** Render the page once subscriptions have been received. */
  renderPage() {
    return (
        <Container>
          <Header as="h2" textAlign="center">List EHR</Header>
          <Table celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>EHR_ID</Table.HeaderCell>
                <Table.HeaderCell>Patient</Table.HeaderCell>
                <Table.HeaderCell>Health Provider</Table.HeaderCell>
                <Table.HeaderCell>Status</Table.HeaderCell>
                <Table.HeaderCell>Edit</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {this.props.ehrs.map((ehr) => <EHRItem key={ehr._id} ehr={ehr} />)}
            </Table.Body>
          </Table>
        </Container>
    );
  }
}

/** Require an array of EHR documents in the props. */
ListEHR.propTypes = {
  ehrs: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(() => {
  // Get access to EHR documents.
  const subscription = Meteor.subscribe('EHR');
  return {
    ehrs: EHRs.find({}).fetch(),
    ready: subscription.ready(),
  };
})(ListEHR);
