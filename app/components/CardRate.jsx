import React from 'react';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import Radium from 'radium';


const styles = {
  card: {
    margin: '20px 20px',
    padding: '0px',
    '@media only screen and (max-width: 680px)': {
      margin: '80px 80px !important',
    },
  },
  img: {
    maxWidth: '450px',
    '@media only screen and (max-width: 680px)': {
      maxWidth: '300px',
    },
  },
  cardMedia: {
  },
};


@Radium
class CardRate extends React.Component {
  render() {
    return (
      <Card
        style={styles.card}
      >
        <CardMedia
          overlay={<CardTitle title="Rate..." subtitle="Click here to rate a dish" />}
          style={styles.cardMedia}
        >
          <img src="images/star_pizza_600.jpg" alt="" style= {styles.img} />
        </CardMedia>
      </Card>
    );
  }
}

export default CardRate;
