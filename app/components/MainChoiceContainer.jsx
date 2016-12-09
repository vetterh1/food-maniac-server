import React from 'react';
import Paper from 'material-ui/Paper';
import Radium from 'radium';
import IconStar from 'material-ui/svg-icons/action/stars';
import { Link } from 'react-router';
//import NavLink from './NavLink';
import CardRate from './CardRate';

const style = {
  height: 100,
  width: 100,
  margin: 20,
  textAlign: 'center',
  display: 'inline-block',
};


const styles = {
  pageContainer: {
//    fontSize: '2em',
  },

  mainChoiceContainer: {
    display: 'flex',
    flexFlow: 'row wrap',
    justifyContent: 'space-around',
    listStyle: 'none',
    // fontWeight: '700',
    // fontSize: '1.5em',
    // lineHeight: '1.2',
    // backgroundColor: 'lightblue',

    '@media only screen and (max-width: 680px)': {
      backgroundColor: 'lightgreen',
      //fontSize: '2.6em',
    },
  },

  'a:link': {
    'textDecoration': 'none',
  },
  'a:visited': {
    'textDecoration': 'none',
  },

  mainChoiceItem: {
    'flexGrow': 1,
    background: 'tomato',
  },

  mainChoiceItemRate: {
  },

  mainChoiceItemSearch: {
  },

  bigIconStyles: {
    width: 120,
    height: 120,
    background: 'rgba(0, 0, 0, 0.541176)',
  },
};


@Radium
class MainChoiceContainer extends React.Component {
  render() {
    return (
      <div style={styles.mainChoiceContainer}>
        <CardRate />
        <CardRate />
      </div>
    );
  }
}

export default MainChoiceContainer;

// <IconStar style={styles.bigIconStyles} />Rate

//        <Paper style={[styles.mainChoiceItem, styles.mainChoiceItemSearch]} zDepth={2}><Link to="/"><img src="images/star_pizza_600.jpg" /><IconStar style={styles.bigIconStyles} />Rate</Link></Paper>
//        <Paper style={[styles.mainChoiceItem, styles.mainChoiceItemSearch]} zDepth={2}><Link to="/"><img src="images/pizza_600.jpg" /><IconStar style={styles.bigIconStyles} />Rate</Link></Paper>


        // <CardRate />
        // <CardRate />
