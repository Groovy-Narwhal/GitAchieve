var React = require('react')
var {DefaultRoute, NotFoundRoute, Route} = require('react-router')
import * as component from '../client/components/index';
module.exports = [
  <Route path="/" handler={componnent.App)}>
    <IndexRoute component={component.DashBoard)} />
    <Route path="/signin" component={component.Login} />
    <Route path="/about" component={component.About} />
    <Route path="/search-results" component={component.SearchResults} />
    <Route path="/:username/profile" component={component.UserProfile} />
    <Route path="/:username/achievements" component={component.UserAchievements} />
    <Route path="/:username/repos" component={component.Repos} />
    <Route path="/compete/choose-repo/:username" component={component.ChooseWeapon} />
    <Route path="/compete/choose-second-repo/:userid" component={component.ChooseSecondWeapon} />
  </Route>
];
