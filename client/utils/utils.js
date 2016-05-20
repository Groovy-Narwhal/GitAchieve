import configSettings from './../../server/config/config-settings';

module.exports = {
  debounce: function(func, wait, immediate) {
  var timeout;
  return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  },
  fetchLastYearGHContribs: function(user, id) {
    var options = {
      username: user
    };
    return fetch(configSettings.CALLBACKHOST + `/gh-fetch?username=${user}&id=${id}`)
      .then((res) => res.text())
      .then((data) => {
        console.log('DATA', data)
        console.log('TYPEOF DATA', typeof data)
      })
      .catch(err => {console.error('ERROR', err)})
  }
};
