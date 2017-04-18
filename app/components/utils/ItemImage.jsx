import React from 'react';
import MdLocalRestaurant from 'react-icons/lib/md/local-restaurant';

const ItemImage = props => {
  if (!props.id) return null;
  return (<object data={`/static/thumbnails/${props.id}.jpg`} type="image/jpg"><MdLocalRestaurant size={96} /></object>);
};


ItemImage.propTypes = {
  id: React.PropTypes.string,
};

export default ItemImage;
