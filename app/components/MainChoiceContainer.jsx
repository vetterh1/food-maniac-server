/* eslint prefer-stateless-function: ["ignore"] */

import React from 'react';
// import Radium from 'radium';
import CardButton from './CardButton';

const styles = {
  mainChoiceContainer: {
    display: 'flex',
    flexFlow: 'row wrap',
    justifyContent: 'space-around',
    listStyle: 'none',
    // fontWeight: '700',
    // fontSize: '1.5em',
    // lineHeight: '1.2',
    // '@media only screen and (max-width: 680px)': {
      // backgroundColor: 'lightgreen',
    // },
  },
};


// @Radium
class MainChoiceContainer extends React.Component {
  render() {
    return (
      <div style={styles.mainChoiceContainer}>
        <CardButton title="Rate" subtitle="Click here to rate a dish" image="images/star_pizza_600.jpg" url="/where" />
        <CardButton title="Search" subtitle="Find your favorite dish around" image="images/star_pasta_600.jpg" url="/login" />
      </div>
    );
  }
}

export default MainChoiceContainer;