import React from 'react';

const divStyle = {
  color: 'grey',
  fontSize: '0.5rem',
  padding: '1em 1em',
};

const Version = props => <div style={divStyle}><br />Version: {__VERSION__}<br />Git version: {__GIT_VERSION__}</div>;

Version.propTypes = { version: React.PropTypes.string };
export default Version;
