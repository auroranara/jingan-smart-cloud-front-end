import React from 'react';
import { Modal, Button } from 'antd';
import Map from './Map';

export default class List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isDrawing: false,
    };
  }

  componentDidMount() {}

  renderDrawButton = () => {
    const { isDrawing } = this.state;
    return (
      <Button
        onClick={() => {
          this.setState({ isDrawing: !isDrawing });
        }}
      >
        {!isDrawing ? '开始画' : '结束画'}
      </Button>
    );
  };

  render() {
    const { isDrawing } = this.state;
    return (
      <div>
        {this.renderDrawButton()}
        <Map isDrawing={isDrawing} />
      </div>
    );
  }
}
