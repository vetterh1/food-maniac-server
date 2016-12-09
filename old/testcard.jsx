import React from 'react';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import IconStar from 'material-ui/svg-icons/action/stars';
import IconRestaurant from 'material-ui/svg-icons/maps/restaurant-menu';


const styles = {

  cardMedia: {
    // borderColor: 'red',
    // borderStyle: 'solid',
    // borderWidth: '5px',
    // borderLeft: '3px solid blue',
  },
  imageBlock: {
    borderColor: 'orange',
    borderStyle: 'solid',
    borderWidth: '5px',
  },
  restaurantBlock: {
    textAlign: 'center',

    borderColor: 'pink',
    borderStyle: 'solid',
    borderWidth: '5px',
  },
  restaurant: {
    width: 160,
    height: 160,
    opacity: 0.4,

    backgroundColor: '#00FF00',
  },
  starBlock: {
    position: 'absolute',
    left: 0,
//    top: 40,
    width: '100%',
    textAlign: 'center',
  },
  bottomRight: {
      position: 'absolute',
      bottom: '10px',
      right: '10px',
      fontSize: '18px',
      border: '5x solid red',
  },
  star: {
    width: 90,
    height: 90,
    opacity: 0.9,
    background: 'transparent',
  },
};


const CardTest = () => (
  <Card>
    <CardMedia
      overlay={<CardTitle title="Rate..." subtitle="Click here to rate a dish" />}
      style={styles.cardMedia}
    >
      <img src="images/star_pizza_600.jpg" alt="" />
    </CardMedia>
  </Card>
);

export default CardTest;


        // <span style={styles.restaurantBlock}><IconRestaurant style={styles.restaurant} /></span>
        // <span style={styles.bottomRight}><IconStar style={styles.star} /></span>

const CardTest = () => (
  <Card>
    <CardHeader
      title="URL Avatar"
      subtitle="Subtitle"
      avatar="images/pasta_600.jpg"
    />
    <CardMedia
      overlay={<CardTitle title="Overlay title" subtitle="Overlay subtitle" />}
    >
      <div style={styles.imageBlock}>
        <IconRestaurant style={styles.restaurant} />
        <IconStar style={styles.star} />
        {/* <img src="images/pizza_600.jpg" alt="" /> */}
      </div>
    </CardMedia>
    <CardTitle title="Card title" subtitle="Card subtitle" />
    <CardText>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
      Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.
      Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
    </CardText>
    <CardActions>
      <FlatButton label="Action1" />
      <FlatButton label="Action2" />
    </CardActions>
  </Card>
);
