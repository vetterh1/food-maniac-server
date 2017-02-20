import React from 'react';
import { browserHistory } from 'react-router';
// import { Card, CardMedia, CardTitle } from 'material-ui/Card';
// import Radium from 'radium';


const styles = {
  card: {
    margin: '20px 20px',
    padding: '0px',
    cursor: 'pointer',
  },
  clickedCard: {
    margin: '0px',
    padding: '0px',
    cursor: 'pointer',
    transition: 'margin 1s ease-in',
  },
  cardMedia: {
  },
  img: {
    maxWidth: '450px',
  },
};


// @Radium
class CardButton extends React.Component {
  static propTypes = {
    title: React.PropTypes.string.isRequired,
    subtitle: React.PropTypes.string.isRequired,
    image: React.PropTypes.string.isRequired,
    url: React.PropTypes.string.isRequired,
    onClick: React.PropTypes.func,
  }

  constructor() {
    super();
    this._handleClick = this._handleClick.bind(this);

    this.state = {
      clicked: false,
    };
  }

  _handleClick() {
    this.setState({ clicked: true });
    this.props.onClick();
    browserHistory.push(this.props.url);
  }

  // render() {
  //   return (
  //     <Card
  //       style={this.state.clicked ? styles.clickedCard : styles.card}
  //     >
  //       <CardMedia
  //         overlay={<CardTitle title={this.props.title} subtitle={this.props.subtitle} />}
  //         style={styles.cardMedia}
  //         onClick={this._handleClick}
  //       >
  //         <img src={this.props.image} alt="" style={styles.img} />
  //       </CardMedia>
  //     </Card>
  //   );
  // }

  render() {
    return (
      <div>
        <img src={this.props.image} alt="" style={styles.img} />
      </div>
    );
  }

}

export default CardButton;
