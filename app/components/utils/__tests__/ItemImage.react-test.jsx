
import React from 'react';
import renderer from 'react-test-renderer';
import {shallow} from 'enzyme';
import ItemImage from '../ItemImage';
import MdLocalRestaurant from 'react-icons/lib/md/local-restaurant';


test('ItemImage renders correctly', () => {
  const itemImage = shallow(
    <ItemImage />
  );

  // expect(checkbox.text()).toEqual('Off');

  // checkbox.find('input').simulate('change');

  // expect(checkbox.text()).toEqual('On');
});


describe('ItemImage', function() {

  it('should render without throwing an error', () => {
    const itemImage = shallow( <ItemImage /> );
    // expect(itemImage.find('object')).to.have.length(1);
    // expect(itemImage.find(MdLocalRestaurant)).to.have.length(1);
    //expect(shallow(<ItemImage />).contains(<div className="foo">Bar</div>)).toBe(true);
  });
});


/*
it('renders correctly', () => {
  const tree = renderer.create(
    <RecentItems />
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
*/


/*
it('renders as an anchor when no page is set', () => {
  const tree = renderer.create(
    <Link>Facebook</Link>
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it('properly escapes quotes', () => {
  const tree = renderer.create(
    <Link>{'"Facebook" \\\'is \\ \'awesome\''}</Link>
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

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