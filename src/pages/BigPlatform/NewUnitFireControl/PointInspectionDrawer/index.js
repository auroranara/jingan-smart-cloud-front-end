import React, { PureComponent } from 'react';
import { Drawer, Select } from 'antd';
import moment from 'moment';

import styles from './index.less';

const { Option } = Select;

/**
 * description: 点位巡查抽屉
 * author: sunkai
 * date: 2018年12月05日
 */
export default class PointInspectionDrawer extends PureComponent {
  state = {
    type: 0,
  }

  componentDidMount() {
    const { loadData } = this.props;
    const { type } = this.state;
    loadData(type);
  }

  componentDidUpdate({ date: prevDate }, { type: prevType }) {
    const { date, loadData } = this.props;
    const { type } = this.state;
    if (date !== prevDate || type !== prevType) {
      loadData(type);
    }
  }

  /**
   * 获取日期
   */
  getDateList = () => {
    const dateList = [];
    for (let i = 0; i < 30; i++) {
      const date = moment()
        .subtract(i, 'days')
        .format('YYYY-MM-DD');
      dateList.push(date);
    }
    return dateList;
  }

  render() {
    const {
      // 抽屉是否可见
      visible,
      // 抽屉关闭事件
      onClose,
      // 模型
      model,
      // 选中日期
      date,
      handleChangeDate,
    } = this.props

    const dateList = this.getDateList();

    return (
      <Drawer width={536} visible={visible} onClose={onClose}>
        <div className={styles.toolbar}>
          <div className={styles.tab}>已巡查点位-{12}</div>
          <div className={styles.tab}>未巡查点位-{2}</div>
          <Select value={date}>
            {dateList.map(date => (
              <Option key={date}>{date}</Option>
            ))}
          </Select>
        </div>
      </Drawer>
    );
  }
}
