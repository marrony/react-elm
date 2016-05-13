import React from 'react'
import Address from './Address'

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      model: props.model
    };

    let self = this;
    this.address = new Address(function(message) {
      let newModel = self.props.update(message, self.state.model);

      self.update(message, newModel, self.state.model);
    });
  }

  update(action, newModel, oldModel) {
    this.setState({model: newModel});
  }

  render() {
    let props = {
      address: this.address,
      model: this.state.model
    };

    return React.createElement(this.props.view, props);
  }
}

App.propTypes = {
  model: React.PropTypes.any.isRequired,
  update: React.PropTypes.func.isRequired,
  view: React.PropTypes.any.isRequired
}
