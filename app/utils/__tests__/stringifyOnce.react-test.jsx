import stringifyOnce from '../stringifyOnce';

describe('stringifyOnce', () => {
  // Minimal props to render component
  const minParams = {
    obj: {},
    replacer: null,
    indent: 2,
  };

  const regParams = {
    obj: { one: 1, two: 2 },
    replacer: null,
    indent: 2,
  };

  it('should match its empty snapshot', () => {
    const result = stringifyOnce(minParams);
    expect(result).toMatchSnapshot();
  });

  it('should match its regular snapshot', () => {
    const result = stringifyOnce(regParams);
    expect(result).toMatchSnapshot();
  });
});
