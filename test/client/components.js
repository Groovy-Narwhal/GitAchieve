import React from 'react';
import { expect } from 'chai';
import { shallow, mount, render } from 'enzyme';
import Login from '../../client/components/login.js';

describe('<Login />', () => {
  it('should render login page', () => {
    const wrapper = shallow(<Login />);
    expect(wrapper.contains(<h1 className="font-gray">Are you on top of your Git game?</h1>)).to.be.true;
  });
});
