import React from 'react';

const styles = {
  divStyle: {
    // background: 'url("images/pasta_alpha30_qty50.jpg") no-repeat center center fixed',
    // backgroundSize: 'cover',
  },
};

class MainPageContent extends React.Component {
  static propTypes = {
    children: React.PropTypes.node,
  }

  render() {
    return (
      <div style={styles.divStyle}>
      </div>
    );
  }
}



export default MainPageContent;
