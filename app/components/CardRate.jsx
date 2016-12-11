import React from 'react';
import { browserHistory } from 'react-router';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import Radium from 'radium';


const styles = {
  card: {
    margin: '20px 20px',
    padding: '0px',
  },
  img: {
    maxWidth: '450px',
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
          onClick={this.gotoRatingPage}
        >
          <img src="images/star_pizza_600.jpg" alt="" style={styles.img} />
        </CardMedia>
      </Card>
    );
  }

  gotoRatingPage() {
    browserHistory.push('/where');
  }
}

export default CardRate;
