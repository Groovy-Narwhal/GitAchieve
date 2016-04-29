import React from 'react';

const Login = () => (
  <div>
    <div>GitAchieve</div>
    <p>Who's on top of their code game?</p>
    <p>GitAchieve adds a competitive and fun edge to your engineering teams workflow. Visualize your git statistics against your fellow coders!</p>
    <button>Sign in with GitHub</button>
    <div>
      <button onClick={() => browserHistory.push('/about')}>Learn about the team</button>
    </div>
  </div>
)
export default Login;