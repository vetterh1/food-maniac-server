
import React from 'react';
import renderer from 'react-test-renderer';
// import { shallow } from 'enzyme';
import ItemImage from '../ItemImage';

describe('ItemImage', () => {
  // Enzyme test... not finished :(
  // it('should render without throwing an error', () => {
  //   const itemImage = shallow(<ItemImage />);
  //   // expect(itemImage.find('object')).to.have.length(1);
  //   // expect(itemImage.find(MdLocalRestaurant)).to.have.length(1);
  //   // expect(shallow(<ItemImage />).contains(<div className="foo">Bar</div>)).toBe(true);
  // });

  it('should match its empty snapshot', () => {
    const tree = renderer.create(
      <ItemImage />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('should match its snapshot with unknown pic (renders MdLocalRestaurant)', () => {
    const tree = renderer.create(
      <ItemImage id="idPic" />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});

/*
it('changes the class when hovered', () => {
  const component = renderer.create(
    <Link page="http://www.facebook.com">Facebook</Link>
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();

  // manually trigger the callback
  tree.props.onMouseEnter();
  // re-rendering
  tree = component.toJSON();
  expect(tree).toMatchSnapshot();

  // manually trigger the callback
  tree.props.onMouseLeave();
  // re-rendering
  tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
*/