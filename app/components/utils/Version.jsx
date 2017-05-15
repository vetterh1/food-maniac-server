import React from 'react';

const divStyle = {
  color: 'grey',
  fontSize: '0.5rem',
  padding: '1em 1em',
};

const Version = () => <div style={divStyle}><br />Version: {process.env.NODE_ENV}  -  Git branch: {process.env.GIT_BRANCH} - Git version: {process.env.NPM_VERSION} - Last commit comment: {process.env.GIT_LAST_COMMIT_COMMENT}  -  Last commit date: {process.env.GIT_LAST_COMMIT_DATE} - <a href="/logs?limit=200&level=1&minutes=30" target="_blank" rel="noopener noreferrer">Error logs</a> - <a href="/logs?limit=1000&level=5&minutes=6" target="_blank" rel="noopener noreferrer">Full logs (1mn)</a></div>;

export default Version;
