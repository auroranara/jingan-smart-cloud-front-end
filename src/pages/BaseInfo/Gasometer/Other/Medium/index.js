import React, { Component } from 'react';
import { Modal, Button } from 'antd';
import InputOrSpan from '@/jingan-components/InputOrSpan';
import styles from './index.less';

// 存储介质
export default class Medium extends Component {
  state = {
    visible: false,
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  }

  hideModal = () => {
    this.setState({
      visible: false,
    });
  }

  handleOk = () => {
    console.log(1);
  }

  renderModal() {
    const {
      visible,
    } = this.state;

    return (
      <Modal
        title="选择存储介质"
        visible={visible}
        onCancel={this.hideModal}
        onOk={this.handleOk}
        zIndex={1009}
      >
        123
      </Modal>
    );
  }

  render() {
    const {
      value,
      onChange,
      ...restProps
    } = this.props;

    return (
      <div className={styles.container}>
        <InputOrSpan
          value={value}
          enterButton="选择"
          disabled
          addonAfter={(
            <Button
              type="primary"
              // onClick={this.showModal}
            >
              选择
            </Button>
          )}
          {...restProps}
        />
        {this.renderModal()}
      </div>
    );
  }
}
