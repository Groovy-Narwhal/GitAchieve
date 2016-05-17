import React from 'react';
import { browserHistory } from 'react-router';

// FEEL FREE TO EDIT
export default () => {
  return (
    <div>
      <div className="text-centered data-results-container">
        <div className="spacer-10px"/>
        <h1 className="font-gray">What is GitAchive?</h1>
        <div className="spacer-10px"/>
        <p className="instructions">GitAchieve is a web application for GitHub users to visualize their workflow performance against other users. We were inspired to create this tool through our combined experiences of working on engineering teams. Our curiosity led us to create a fun way to visualize how you compare against others in terms of GitHub performance. GitAchieve currently measures GitHub performance by the number of commits a user makes on a certain repository. We plan on expanding this metric of performance in the future to include other interesting statistics such as number of lines changed per commit, pull request successes, and more.</p>
        <div className="spacer-20px"/>
        <h1 className="font-gray">How do I get started with GitAchieve?</h1>
        <div className="spacer-10px"/>
        <div className="instructions">
          <ul>
            <li><span>Step One:</span> Login with GitHub</li>
            <li><span>Step Two:</span> Type in the github user you would like to compete with and press submit</li>
            <li><span>Step Three:</span> Choose the repo you would like to use as your weapon and choose a start day for the competition and press compete</li>
            <li><span>Step Four:</span> Choose the repo you would like to use as your weapon and choose a start day for the competition</li>
            <li><span>Step Five:</span> A request to the users will be sent and once they accept you may press compete to see the results!</li>
          </ul>
        </div>
        <div className="spacer-20px"/>
        <h1 className="font-gray">Who built GitAchieve?</h1>
        <div className="spacer-10px"/>
        <p className="instructions">We are four engineers from San Francisco!</p>
        <div className="spacer-20px"/>
        <table className="team-table">
          <tbody>
            <tr>
              <td><img className="user-avatar-med" src="https://avatars.githubusercontent.com/u/4149515?v=3" /></td>
              <td><img className="user-avatar-med" src="https://avatars.githubusercontent.com/u/15864056?v=3" /></td>
              <td><img className="user-avatar-med" src="https://avatars.githubusercontent.com/u/10492144?v=3" /></td>
              <td><img className="user-avatar-med" src="https://avatars.githubusercontent.com/u/15220759?v=3" /></td>
            </tr>
            <tr>
              <td><a target="_blank" href="https://github.com/byeo630">Inje Yeo</a></td>
              <td><a target="_blank" href="https://github.com/alexnitta">Alex Nitta</a></td>
              <td><a target="_blank" href="https://github.com/adamrgisom">Adam Isom</a></td>
              <td><a target="_blank" href="https://github.com/msmith9393">Megan Smith</a></td>
            </tr>
          </tbody>
        </table>
        <div className="spacer-20px"/>
        <button onClick={() => browserHistory.push('/')} className="button">BACK</button>
      </div>
    </div>
  )
}
