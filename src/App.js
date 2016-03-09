import React from 'react'
import Address from './Address'

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      model: props.model
    };

    var self = this;
    this.address = new Address(function(message) {
      var model = self.props.update(message, self.state.model);

      self.setState({model: model});
    });
  }

  render() {
    var props = {};
    props.address = this.address;
    props.model = this.state.model;

    return React.createElement(this.props.view, props);
  }
}

App.propTypes = {
  model: React.PropTypes.any.isRequired,
  update: React.PropTypes.func.isRequired,
  view: React.PropTypes.any.isRequired
}
