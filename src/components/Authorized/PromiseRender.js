import React from 'react';
import { Spin } from 'antd';

export default class PromiseRender extends React.PureComponent {
  state = {
    component: null,
  };
<<<<<<< HEAD

  componentDidMount() {
    this.setRenderComponent(this.props);
  }

=======
  componentDidMount() {
    this.setRenderComponent(this.props);
  }
>>>>>>> init
  componentDidUpdate(nextProps) {
    // new Props enter
    this.setRenderComponent(nextProps);
  }
<<<<<<< HEAD

=======
>>>>>>> init
  // set render Component : ok or error
  setRenderComponent(props) {
    const ok = this.checkIsInstantiation(props.ok);
    const error = this.checkIsInstantiation(props.error);
    props.promise
      .then(() => {
        this.setState({
          component: ok,
        });
      })
      .catch(() => {
        this.setState({
          component: error,
        });
      });
  }
<<<<<<< HEAD

=======
>>>>>>> init
  // Determine whether the incoming component has been instantiated
  // AuthorizedRoute is already instantiated
  // Authorized  render is already instantiated, children is no instantiated
  // Secured is not instantiated
  checkIsInstantiation = target => {
    if (!React.isValidElement(target)) {
      return target;
    }
    return () => target;
  };
<<<<<<< HEAD

  render() {
    const { component: Component } = this.state;
    const { ok, error, promise, ...rest } = this.props;
    return Component ? (
      <Component {...rest} />
=======
  render() {
    const Component = this.state.component;
    return Component ? (
      <Component {...this.props} />
>>>>>>> init
    ) : (
      <div
        style={{
          width: '100%',
          height: '100%',
          margin: 'auto',
          paddingTop: 50,
          textAlign: 'center',
        }}
      >
        <Spin size="large" />
      </div>
    );
  }
}
