import React from 'react';
import { expect } from 'chai';
import { shallow, mount, render } from 'enzyme';
import Login from '../../client/components/login.js';

describe('<Login />', () => {
  it('should render login page', () => {
    const wrapper = shallow(<Login />);
    expect(wrapper.contains(<p>Who's on top of their code game?</p>)).to.be.true;
  });
});
