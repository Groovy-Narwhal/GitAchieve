import React from 'react';
import { expect } from 'chai';
import { shallow, mount, render } from 'enzyme';
// TODO: import React and create tests for the front end
  // import Index from '../../client/index.js';
// TODO: load in the database and test
  // Connect to Postgres

/********************************************************
For testing resources check these: 
  Expect library: https://github.com/Automattic/expect.js
  Front-End
    - React testing using Enzyme: http://airbnb.io/enzyme/docs/guides/mocha.html
    - Example of React testing using Enzyme + Mocha: https://github.com/lelandrichardson/enzyme-example-mocha/blob/master/test/Foo-test.js
    - React docs for testing: https://facebook.github.io/react/docs/test-utils.html
  Back-End
    - Testing Postgres: http://dyashkir.com/2014/03/27/Postgres-and-Nodejs-Setup-setup-for-testing-with-Mocha.html
********************************************************/

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
  it('should load react front-end', () => {
    expect(Index).to.exist;
  })
  // TODO: write tests here.
});

// Tests the database
describe('load Postgres', () => {
  it('should load the database', () => {
    expect(database).to.exist;
  })
  // TODO: write tests here. Ex. 'it should post data to the database', 'it should grab data from the database'
});
