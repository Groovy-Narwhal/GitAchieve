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
  fetchLastYearGHContribs: function(user) {
    var options = {
      username: user
    };
    return fetch(configSettings.CALLBACKHOST + `/gh-fetch?username=${user}`)
      .then((res) => res.text())
      .then((data) => data.slice(data.indexOf('<span class="contrib-number">') + 29, data.indexOf('total</span>')));
  }
};