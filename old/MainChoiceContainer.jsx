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

  constructor() {
    super();
    this._selectCard = this._selectCard.bind(this);

    this.state = { selectedCard: 'none' }; 
  }

  _selectCard(cardName) { 
    console.log('MainChoiceContainer._selectCard: ', cardName);
    this.setState({ selectedCard: cardName }); 
  }

  render() {
    const selectedCard = this.state.selectedCard;
    return (
      <div style={styles.mainChoiceContainer}>
        <CardButton title="Rate" subtitle="Click here to rate a dish" image="images/star_pizza_600.jpg" url="/rate" onClick={ () => this._selectCard('rate')}/>
        <CardButton title="Search" subtitle="Find your favorite dish around" image="images/star_pasta_600.jpg" url="/search"  onClick={ () => this._selectCard('search')}/>
      </div>
    );
  }
}

export default MainChoiceContainer;

/*
        { selectedCard != 'search' && <CardButton title="Rate" subtitle="Click here to rate a dish" image="images/star_pizza_600.jpg" url="/rate" onClick={ () => this._selectCard('rate')}/> }
        { selectedCard != 'rate' && <CardButton title="Search" subtitle="Find your favorite dish around" image="images/star_pasta_600.jpg" url="/search"  onClick={ () => this._selectCard('search')}/> }
*/