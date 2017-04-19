
import React from 'react';
// import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import { Button } from 'reactstrap';
import { TestDisplayPositionFromStore } from '../TestDisplayPositionFromStore';

describe('TestDisplayPositionFromStore', () => {
  // Minimal props to render component
  const minProps = {
    dispatch: () => {},
    onClick: () => {},
  };

  it('should render without throwing an error and match its empty snapshot', () => {
    const wrapper = shallow(<TestDisplayPositionFromStore {...minProps} />);
    expect(wrapper).toHaveLength(1);
    expect(wrapper).toMatchSnapshot();
  });

  it('should have 3 buttons', () => {
    const wrapper = shallow(<TestDisplayPositionFromStore {...minProps} />);
    const buttons = wrapper.find(Button);
    expect(buttons).toHaveLength(3);
    buttons.first().simulate('click', { preventDefault: () => {} });
  });
});
