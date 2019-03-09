import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import App from '../src/app.js';

Enzyme.configure({ adapter: new Adapter() });

describe('<MyComponent />', () => {
  it('renders three <Foo /> components', () => {
    const wrapper = shallow(<App />);
    expect(wrapper.text()).to.equal("Well hey!")
  });
});
