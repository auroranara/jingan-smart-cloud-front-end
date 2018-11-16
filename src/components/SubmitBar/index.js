import React, { PureComponent } from 'react';
import { Button, Icon, Popover } from 'antd';
import FooterToolbar from '@/components/FooterToolbar';

import styles from './index.less';

/**
 * 底部提交工具栏
 */
export default class App extends PureComponent {
  /**
   * 提交按钮点击事件
   */
  handleSubmit = () => {
    const { form: { validateFieldsAndScroll }, onSubmit } = this.props;
    // 如果验证通过则提交，没有通过则滚动到错误处
    validateFieldsAndScroll((err, values) => {
        if (!err) {
          onSubmit(values);
        }
      }
    );
  }

  /**
   * 渲染错误信息
   */
  renderErrorInfo() {
    const {
      form: { getFieldsError },
      fieldLabels,
    } = this.props;
    const errors = getFieldsError();
    const errorCount = Object.keys(errors).filter(key => errors[key]).length;
    if (!errors || errorCount === 0) {
      return null;
    }
    const scrollToField = fieldKey => {
      const labelNode = document.querySelector(`label[for="${fieldKey}"]`);
      if (labelNode) {
        labelNode.scrollIntoView(true);
      }
    };
    const errorList = Object.keys(errors).map(key => {
      if (!errors[key]) {
        return null;
      }
      return (
        <li key={key} className={styles.errorListItem} onClick={() => scrollToField(key)}>
          <Icon type="cross-circle-o" className={styles.errorIcon} />
          <div className={styles.errorMessage}>{errors[key][0]}</div>
          <div className={styles.errorField}>{fieldLabels[key]}</div>
        </li>
      );
    });
    return (
      <span className={styles.errorIcon}>
        <Popover
          title="表单校验信息"
          content={errorList}
          overlayClassName={styles.errorPopover}
          trigger="click"
          getPopupContainer={trigger => trigger.parentNode}
        >
          <Icon type="exclamation-circle" />
          {errorCount}
        </Popover>
      </span>
    );
  }

  render() {
    const {
      loading,
      submitButtonProps,
    } = this.props;

    return (
      <FooterToolbar>
        {this.renderErrorInfo()}
        <Button
          type="primary"
          size="large"
          onClick={this.handleSubmit}
          loading={loading}
          {...submitButtonProps}
        >
          提交
        </Button>
      </FooterToolbar>
    );
  }
}
