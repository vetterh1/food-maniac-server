import React from 'react';
import { loglevelStartServerTimer } from '../../utils/loglevel-serverSend';

const divStyle = {
  color: 'grey',
  fontSize: '0.5rem',
  padding: '1em 1em',
};

// const Version = () => <div style={divStyle}><br />Version: {process.env.NODE_ENV}  -  Git branch: {process.env.GIT_BRANCH} - Git version: {process.env.NPM_VERSION} - Last commit comment: {process.env.GIT_LAST_COMMIT_COMMENT}  -  Last commit date: {process.env.GIT_LAST_COMMIT_DATE} - <a href="/logs/show?limit=200&level=1&minutes=30" target="_blank" rel="noopener noreferrer">Error logs</a> - <a href="/logs/show?limit=1000&level=5&minutes=1" target="_blank" rel="noopener noreferrer">Full logs (1mn)</a> - <a onClick={loglevelStartServerTimer(30000)}>Send logs to server (30sec)</a></div>;

class Footer extends React.Component {

  startServerLogging = () => {
    loglevelStartServerTimer(30000);
  }

  render() {
    return (
      <div style={divStyle}>
        <br />
        Version: {process.env.NODE_ENV}
        <br />
        Git branch: {process.env.GIT_BRANCH}
        <br />
        Git version: {process.env.NPM_VERSION}
        <br />
        Last commit comment: {process.env.GIT_LAST_COMMIT_COMMENT}
        <br />
        Last commit date: {process.env.GIT_LAST_COMMIT_DATE}
        <br />
        <a href="/logs/show?limit=200&level=1&minutes=30" target="_blank" rel="noopener noreferrer">Error logs</a>
        <br />
        <a href="/logs/show?limit=1000&level=5&minutes=1" target="_blank" rel="noopener noreferrer">Full logs (1mn)</a>
        <br />
        <a onClick={this.startServerLogging.bind(this)} role="presentation">Start logging to server (30sec)</a>
      </div>
    );
  }
}

export default Footer;
