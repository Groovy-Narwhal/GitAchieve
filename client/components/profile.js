import React from 'react';

// note: centering with flexbox with classes is NOT ideal practice
// for React components because it makes them less reusable

var imgStyle = {
  width: '200px',
  height: '200px'
}

var flexStyle = {
  flexContainer: {
    width: '200px',
    //  May need vendor prefixing
    display: 'flex'
  },

  row: {
    display: 'inline-block',
    margin: '0 auto'
  },

  flexItem: {
    fontFamily: 'monospace',
  }
}

class Profile extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      imgSrc: 'https://avatars.githubusercontent.com/u/4149515',
    };
  }

  render() {
    return (
      <span>
        <img src={this.state.imgSrc} style={imgStyle} />

        <span style={flexStyle.flexContainer}>
          <span style={flexStyle.row}>
            <span style={flexStyle.flexItem}> {this.props.name} </span>
          </span>
          <span style={flexStyle.row}>
            <span style={flexStyle.flexItem}> {this.props.score} </span>
          </span>
        </span>

      </span>
    );
  }
}

Profile.defaultProps = {
  name: 'Inje Yeo'
};

module.exports = Profile;

// Stateless functional component, perfect if it won't be mutating anything - I'd just have to pass props right
// const Profile = () =>
// (
//   <div>
//     <img src={'https://avatars.githubusercontent.com/u/4149515'} style={imgStyle} />

//     <div style={flexStyle.flexContainer}>
//       <div style={flexStyle.row}>
//         <span style={flexStyle.flexItem}> Inje Yeo </span>
//       </div>
//       <div style={flexStyle.row}>
//         <span style={flexStyle.flexItem}> 230-Score </span>
//       </div>
//     </div>

//   </div>
// );
