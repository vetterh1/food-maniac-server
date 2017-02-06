import React from 'react';

const divStyle = {
  color: 'grey',
  fontSize: '0.5rem',
  padding: '1em 1em',
};

const Version = props => <div style={divStyle}><br />Version: {process.env.NODE_ENV}  -  Git version: {process.env.NPM_VERSION} - Last commit comment: {process.env.GIT_LAST_COMMIT_COMMENT}  -  Last commit date: {process.env.GIT_LAST_COMMIT_DATE}</div>;

export default Version;
