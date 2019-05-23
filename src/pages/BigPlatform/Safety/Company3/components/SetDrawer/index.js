import React, { PureComponent } from 'react';
import { Switch } from 'antd';
import { connect } from 'dva';
import SectionDrawer from '../SectionDrawer';
// 引入样式文件
import styles from './index.less';

/**
 * 设置抽屉
 */
@connect(({ unitSafety }) => ({
  unitSafety,
}))
export default class SetDrawer extends PureComponent {
  componentDidUpdate({ visible: prevVisible }) {
    const { visible } = this.props;
    if (!prevVisible && visible) {
      this.scroll.dom.scrollTop();
    }
  }

  refScroll = scroll => {
    this.scroll = scroll;
  };

  handlePhoneSwitchChange = (phoneVisible) => {
    this.props.dispatch({ type: 'unitSafety/savePhoneVisible', payload: { phoneVisible } });
  }

  render() {
    const {
      // 抽屉是否可见
      visible,
      // 关闭事件
      onClose,
      unitSafety: {
        phoneVisible,
      },
    } = this.props;

    return (
      <SectionDrawer
        drawerProps={{
          title: '设置',
          visible,
          onClose,
        }}
        sectionProps={{
          refScroll: this.refScroll,
          // scrollProps: { className: styles.scrollContainer },
        }}
      >
        <div className={styles.container}>
          <div className={styles.row}>
            <div className={styles.left}>驾驶舱手机号</div>
            <div className={styles.right}><Switch checked={phoneVisible} onChange={this.handlePhoneSwitchChange} /><span style={{ color: phoneVisible ? 'inherit': 'rgb(174, 174, 174)' }}>{phoneVisible ? '显示' : '隐藏'}</span></div>
          </div>
        </div>
      </SectionDrawer>
    );
  }
}
