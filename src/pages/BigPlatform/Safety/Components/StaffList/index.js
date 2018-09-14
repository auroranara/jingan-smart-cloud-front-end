import React, { PureComponent } from 'react';
import { Table } from 'antd'
import Section from '../../../UnitFireControl/components/Section/Section';

import styles from './index.less';

/**
 * 单位巡查人员列表
 */
export default class App extends PureComponent {
  render() {
    const {
      onClick,
    } = this.props;

    return (
      <Section
        title="巡查记录"
        onClick={onClick}
      >
        123
      </Section>
    );
  }
}
