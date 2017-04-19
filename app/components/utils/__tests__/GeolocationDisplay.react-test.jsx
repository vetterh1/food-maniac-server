
import React from 'react';
// import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import { Button, Modal, ModalHeader, ModalBody } from 'reactstrap';
import { GeolocationDisplay } from '../GeolocationDisplay';

describe('GeolocationDisplay', () => {
  // Minimal props to render component
  const minProps = {
    coordinates: {
      real: false,
    },
  };

  const realProps = {
    coordinates: {
      latitude: 25.1234,
      longitude: -10.4321,
      real: true,
    },
  };

  it('should render without throwing an error and match its empty snapshot', () => {
    const wrapper = shallow(<GeolocationDisplay {...minProps} />);
    expect(wrapper.length).toEqual(1);
    expect(wrapper).toMatchSnapshot();
  });

  it('should have a closed modal by default', () => {
    const wrapper = shallow(<GeolocationDisplay {...minProps} />);
    expect(wrapper.find(Modal).prop('isOpen')).toEqual(false);
  });

  it('should have a red button when not real', () => {
    const wrapper = shallow(<GeolocationDisplay {...minProps} />);
    expect(wrapper.find({ style: { color: 'red' } })).toHaveLength(1);
  });

  it('should have a green button when real', () => {
    const wrapper = shallow(<GeolocationDisplay {...realProps} />);
    expect(wrapper.find({ style: { color: 'green' } })).toHaveLength(1);
  });

  it('should open a modal on button click', () => {
    const wrapper = shallow(<GeolocationDisplay {...minProps} />);
    wrapper.find(Button).simulate('click');
    expect(wrapper.find(Modal).prop('isOpen')).toEqual(true);
  });
});
