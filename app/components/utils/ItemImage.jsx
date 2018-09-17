import React from 'react';
import PropTypes from 'prop-types';
import { MdRestaurantMenu } from 'react-icons/md';

const ItemImage = (props) => {
  if (!props.id) return null;
  return (<object data={`/static/thumbnails/${props.id}.jpg`} type="image/jpg"><MdRestaurantMenu size={96} /></object>);
};

ItemImage.propTypes = {
  id: PropTypes.string,
};


ItemImage.defaultProps = {
  id: null,
};

export default ItemImage;
