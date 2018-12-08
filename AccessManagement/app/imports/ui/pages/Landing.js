import React from 'react';
import { Grid, Image } from 'semantic-ui-react';

/** A simple static component to render some text for the landing page. */
class Landing extends React.Component {
  render() {
    return (
        <Grid verticalAlign='middle' textAlign='center' container>

          <Grid.Column width={4}>
            <Image size='small' circular src="/images/logo.jpg"/>
          </Grid.Column>

          <Grid.Column width={8}>
            <h1>Welcome to HyperMed</h1>
            <p>Please Sign-in to proceed!</p>
          </Grid.Column>

        </Grid>
    );
  }
}

export default Landing;
