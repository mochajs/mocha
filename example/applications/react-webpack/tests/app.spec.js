import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import App from '../src/app.js';

Enzyme.configure({ adapter: new Adapter() });

describe('<App />', () => {
  it('renders our app with welcome text', () => {
    const wrapper = shallow(<App />);
    expect(wrapper.text()).to.equal("Welcome to the React application.")
  });
});
