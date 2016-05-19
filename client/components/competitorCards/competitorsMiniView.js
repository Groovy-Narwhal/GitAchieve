import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { bindActionCreators } from 'redux';
import actions from './../../actions/ActionCreators';
import ReceivedCompetitorCard from './receivedCompetitorCard';
import SentCompetitorCard from './sentCompetitorCard';
import AcceptedCompetitorCard from './acceptedCompetitorCard';
import AcceptedCompetitorCard2 from './acceptedCompetitorCard2';

class CompetitorsMiniView extends Component {
  checkIfCompetitors() {
    if (this.props.yesCompetitions) {
      return <div></div>
    } else {
      return (
        <div className="centered">
          <h3 className="font-white">Find an opponent!</h3>
        </div>
      );
    }
  }

  receivedRequests() {

    return <div>
      { !!this.props.receivedRequests[0] ? 
        this.props.receivedRequests[0].map((c, ind) => <ReceivedCompetitorCard key={ind} c={c} />) : <div></div> }
    </div>
  }

  sentRequests() {
    return <div>
    { !!this.props.sentRequests[0] ? 
      this.props.sentRequests[0].map((c, ind) => <SentCompetitorCard key={ind} c={c} />) : <div></div> }
    </div>
  }

  confirmedRequests() {
    return <div>
    { !!this.props.confirmedRequests[0] ? 
      this.props.confirmedRequests[0].map((c, ind) => <AcceptedCompetitorCard key={ind} c={c} />) : <div></div> }
    </div>
  }

  confirmedRequests2() {
    return <div>
    { !!this.props.confirmedRequests2[0] ? 
      this.props.confirmedRequests2[0].map((c, ind) => <AcceptedCompetitorCard2 key={ind} c={c} />) : <div></div> }
    </div>
  }

  render() {
    return (
      <div className="data-results-container-clear">
        <h2 className="font-white">My Challenges</h2>
        <div className="data-results-container-flex full-width">
          {this.checkIfCompetitors()}
          {this.sentRequests()}
          {this.receivedRequests()}
          {this.confirmedRequests()}
          {this.confirmedRequests2()}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return state;
}

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CompetitorsMiniView);
