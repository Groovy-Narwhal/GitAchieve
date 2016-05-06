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
// describe('test setup', function() {
//   it('should work', function() {
//     expect(true).to.be.true;
//   });
//   it('should do math', function() {
//     expect(2 + 2).to.eql(4);
//   });
// });

// if logging in works
// components exist
// make sure actions dont directly mutate store
// actions that are updating state work
// we can access the state from a certain component

/* Front-end Tests */
// describe('load app component', function() {
//   it('should load react app', () => {
//     const wrapper = mount(<App />);
//     expect(App).to.exist;
//   })
//   // TODO: write tests here.
// });

/********************************************************
// Test if it loads React
// Tests the database
describe('load Postgres', () => {
  it('should load the database', () => {
    expect(database).to.exist;
  })
  // TODO: write tests here. Ex. 'it should post data to the database', 'it should grab data from the database'
});
********************************************************/