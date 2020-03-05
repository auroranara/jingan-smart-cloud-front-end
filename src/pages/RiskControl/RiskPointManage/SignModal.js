import React, { PureComponent } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Modal, Button } from 'antd';

import InlineForm from '../../BaseInfo/Company/InlineForm';
import styles from './index.less';

@Form.create()
export default class SignModal extends PureComponent {
  state = {
    selectedImgs: [],
    searchValue: { fileName: '' }, // 当前标志字典查询的值
  };

  getSnapshotBeforeUpdate(prevProps, prevState) {
    return JSON.stringify(this.props.selectedList) !== JSON.stringify(prevProps.selectedList);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (snapshot) {
      this.setState({ selectedImgs: [...this.props.selectedList] });
    }
  }

  /* 关闭按钮点击事件 */
  handleClose = () => {
    const { onClose } = this.props;
    if (onClose) {
      onClose();
    }
  };

  /* 完全关闭后 */
  handleAfterClose = () => {
    const { afterClose } = this.props;
    if (afterClose) {
      afterClose();
    }
  };

  // 查询
  handleSearch = value => {
    this.setState({
      searchValue: value,
    });
  };

  // 重置
  handleReset = () => {
    this.setState({
      searchValue: { fileName: '' },
    });
  };

  /* 渲染选择按钮 */
  renderSelectButton() {
    const { selectedImgs } = this.state;
    const { handleSelect } = this.props;
    return (
      <Button type="primary" onClick={() => handleSelect(selectedImgs)}>
        确定
      </Button>
    );
  }

  handleCardClick = (i, webUrl, dbUrl) => {
    const { selectedImgs } = this.state;
    const selectedUrls = selectedImgs.map(item => item.webUrl);
    const index = selectedUrls.indexOf(webUrl);
    if (index < 0) {
      this.setState({ selectedImgs: [...selectedImgs, { webUrl: webUrl, dbUrl: dbUrl }] });
    } else {
      this.setState({
        selectedImgs: [...selectedImgs.slice(0, index), ...selectedImgs.slice(index + 1)],
      });
    }
  };

  render() {
    const { visible, width, title, field, list } = this.props;
    const { selectedImgs, searchValue } = this.state;
    const filterList = list.filter(({ fileName }) => fileName.includes(searchValue.fileName));

    const selectedUrls = selectedImgs.map(item => item.webUrl);

    return (
      <Modal
        title={title}
        width={width || 920}
        visible={visible}
        onCancel={this.handleClose}
        afterClose={this.handleAfterClose}
        footer={null}
        destroyOnClose
        bodyStyle={{ height: '600px' }}
      >
        <InlineForm
          fields={field}
          action={this.renderSelectButton()}
          onSearch={this.handleSearch}
          onReset={this.handleReset}
        />
        <div style={{ height: '500px', overflow: 'auto' }}>
          {filterList.map((item, i) => {
            const { fileName, webUrl, dbUrl } = item;
            return (
              <div
                key={i}
                className={selectedUrls.indexOf(webUrl) < 0 ? styles.signCard : styles.isSignCard}
                onClick={() => {
                  this.handleCardClick(i, webUrl, dbUrl);
                }}
              >
                <img title={fileName} src={webUrl} width="100%" height="100%" alt={fileName} />
              </div>
            );
          })}
        </div>
      </Modal>
    );
  }
}
