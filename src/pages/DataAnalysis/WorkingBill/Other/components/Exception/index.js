import React, { Component, Fragment } from 'react';
import { Button, Modal, Transfer, Popconfirm } from 'antd';

import styles from './index.less';

export default class Exception extends Component {
  state = { visible: false, targetKeys: [] };

  componentDidMount() {
    const { value } = this.props;
    this.setState({ targetKeys: value });
  }

  componentDidUpdate({ value: prevValue }) {
    const { value } = this.props;
    if (JSON.stringify(value) !== JSON.stringify(prevValue)) this.setState({ targetKeys: value });
  }

  handleClick = () => {
    this.setState({ visible: true });
  };

  handleTransferChange = (nextTargetKeys, direction, moveKeys) => {
    this.setState({ targetKeys: nextTargetKeys });
  };

  handleConfirm = () => {
    const { onChange } = this.props;
    const { targetKeys } = this.state;
    this.setState({ visible: false });
    onChange && onChange(targetKeys);
  };

  filterOption = (inputValue, option) => option.name.indexOf(inputValue) > -1;

  renderModal = () => {
    const { list = [], value = [] } = this.props;
    const { visible, targetKeys } = this.state;

    return (
      <Modal
        title="选择例外人员"
        visible={visible}
        width={550}
        onCancel={() => {
          this.setState({ visible: false });
        }}
        onOk={this.handleConfirm}
      >
        <Transfer
          dataSource={list} // 数据源（左侧）
          titles={['报警人员', '例外人员']}
          targetKeys={targetKeys} // 右侧数据的key集合
          // selectedKeys={selectedKeys}
          onChange={this.handleTransferChange}
          showSearch
          filterOption={this.filterOption}
          locale={{ searchPlaceholder: '请输入姓名搜索' }}
          render={item => item.name}
          rowKey={record => record.id}
          listStyle={{ textAlign: 'left', minHeight: 350 }}
          style={{ textAlign: 'center' }}
        />
      </Modal>
    );
  };

  render() {
    const { value = [], list = [], mode, disabled } = this.props;
    const isNotDetail = mode !== 'detail';

    return (
      <Fragment>
        <span className={disabled ? styles.disabled : undefined}>
          例外人员：
          {isNotDetail && (
            <Button type="primary" onClick={this.handleClick} size="small" disabled={disabled}>
              选择
            </Button>
          )}
        </span>
        {this.renderModal()}
      </Fragment>
    );
  }
}
