import React from 'react';
import { expect } from 'chai';
import { shallow, mount, render } from 'enzyme';
import Index from '../../client/index.js';

// Test if Mocha Chai works
describe('test setup', function() {
  it('should work', function() {
    expect(true).to.be.true;
  });
  it('should do math', function() {
    expect(2 + 2).to.eql(4);
  });
});

// Test if it loads React
describe('load react', function() {
  it('should load react index.js', function() {
    expect(Index).to.exist;
  })
});