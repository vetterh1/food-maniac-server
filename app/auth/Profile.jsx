import React from 'react';
import PropTypes from 'prop-types';
import Auth from './Auth';

class Profile extends React.Component {
  static propTypes = {
    auth: PropTypes.instanceOf(Auth).isRequired,
  }

  componentWillMount() {
    this.setState({ profile: {} });
    const { userProfile, getProfile } = this.props.auth;
    if (!userProfile) {
      getProfile((err, profile) => {
        this.setState({ profile });
      });
    } else {
      this.setState({ profile: userProfile });
    }
  }

  render() {
    // <pre>{JSON.stringify(profile, null, 2)}</pre>
    const { profile } = this.state;
    const name = profile.given_name || profile.nickname || profile.name;
    return (
      <div>
        <h3>{name}</h3>
        <div>
          <img src={profile.picture} alt="profile" style={{ maxWidth: '65px' }} />
        </div>
      </div>
    );
  }
}

export default Profile;