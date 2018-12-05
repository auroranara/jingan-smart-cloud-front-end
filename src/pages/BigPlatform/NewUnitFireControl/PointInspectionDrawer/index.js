import React, { PureComponent } from 'react';
import { Select } from 'antd';
import moment from 'moment';
import Ellipsis from '@/components/Ellipsis';
import DrawerContainer from '../components/DrawerContainer';

import styles from './index.less';

const { Option } = Select;

/**
 * description: 点位巡查抽屉
 * author: sunkai
 * date: 2018年12月05日
 */
export default class PointInspectionDrawer extends PureComponent {
  state = {
    showChecked: true,
  }

  componentDidUpdate({ date: prevDate }) {
    const { date } = this.props;
    if (date !== prevDate) {
      this.setState({ showChecked: true });
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

  /**
   * 根据状态获取文本
   */
  getLabelByStatus = (status) => {
    switch(status) {
      case 1:
      return '正常';
      case 2:
      return <span style={{ color: '#ff4848' }}>异常</span>;
      default:
      return '暂无状态';
    }
  }

  /**
   * 获取处理结果
   */
  getResult = ({
    rectifyNum=0,
    overTime=0,
    finish=0,
    reviewNum=0,
  }={}) => {
    return (
      <span>
        {overTime > 0 && <span style={{ color: '#ff4848' }}>已超期-{overTime}{(rectifyNum > 0 || reviewNum > 0 || finish > 0) && '/'}</span>}
        {rectifyNum > 0 && <span>待整改-{rectifyNum}{(reviewNum > 0 || finish > 0) && '/'}</span>}
        {reviewNum > 0 && <span>待复查-{reviewNum}{finish > 0 && '/'}</span>}
        {finish > 0 && <span>已关闭-{finish}</span>}
      </span>
    )
  }

  render() {
    const {
      // 抽屉是否可见
      visible,
      // 抽屉关闭事件
      onClose,
      // 模型
      model: {
        pointInspectionList: {
          checkPoint=[],
          unCheckPoint=[],
        },
      },
      // 选中日期
      date,
      // 修改选中日期
      handleChangeDate,
    } = this.props
    const { showChecked } = this.state;
    const dateList = this.getDateList();

    return (
      <DrawerContainer
        title="待完成工单"
        width={536}
        left={(
          <div className={styles.container}>
            <div className={styles.toolbar}>
              <div className={showChecked?`${styles.tab} ${styles.tabSelected}`:styles.tab} onClick={() => {this.setState({ showChecked: true })}}>已巡查点位-{checkPoint.length}</div>
              <div className={showChecked?styles.tab:`${styles.tab} ${styles.tabSelected}`} onClick={() => {this.setState({ showChecked: false })}}>未巡查点位-{unCheckPoint.length}</div>
              <div className={styles.select}>
                <Select value={date} onChange={handleChangeDate} dropdownClassName={styles.selectDropDown}>
                  {dateList.map(date => (
                    <Option key={date}>{date}</Option>
                  ))}
                </Select>
              </div>
            </div>
            <div className={styles.content}>
              {showChecked ? checkPoint.map(({ item_id, object_title, check_date, checkName, status, hiddenDangerCount }) => {
                const isAbnormal = status === 2;
                return (
                  <div className={styles.card} key={item_id}>
                    <div className={styles.cardItem}>
                      <div className={styles.cardItemLabel}>点位名称：</div>
                      <div className={styles.cardItemValue}><Ellipsis tooltip lines={1}>{object_title}</Ellipsis></div>
                    </div>
                    <div className={styles.cardItem}>
                      <div className={styles.cardItemLabel}>巡查时间：</div>
                      <div className={styles.cardItemValue}><Ellipsis tooltip lines={1}>{moment(check_date).format('YYYY-MM-DD')}</Ellipsis></div>
                    </div>
                    <div className={styles.cardItem}>
                      <div className={styles.cardItemLabel}>巡查人：</div>
                      <div className={styles.cardItemValue}><Ellipsis tooltip lines={1}>{checkName}</Ellipsis></div>
                    </div>
                    <div className={styles.cardItem}>
                      <div className={styles.cardItemLabel}>巡查状态：</div>
                      <div className={styles.cardItemValue}><Ellipsis tooltip lines={1}>{this.getLabelByStatus(status)}</Ellipsis></div>
                    </div>
                    {isAbnormal && (
                      <div className={styles.cardItem}>
                        <div className={styles.cardItemLabel}>处理结果：</div>
                        <div className={styles.cardItemValue}><Ellipsis tooltip lines={1}>{this.getResult(hiddenDangerCount)}</Ellipsis></div>
                      </div>
                    )}
                  </div>
                );
              }) : unCheckPoint.map(({ item_id, object_title, check_date, checkName, status, hiddenDangerCount }) => {
                const isAbnormal = status === 2;
                return (
                  <div className={styles.card} key={item_id}>
                    <div className={styles.cardItem}>
                      <div className={styles.unCheckedCardItemLabel}>点位名称：</div>
                      <div className={styles.cardItemValue}><Ellipsis tooltip lines={1}>{object_title}</Ellipsis></div>
                    </div>
                    <div className={styles.cardItem}>
                      <div className={styles.unCheckedCardItemLabel}>上次巡查时间：</div>
                      <div className={styles.cardItemValue}><Ellipsis tooltip lines={1}>{moment(check_date).format('YYYY-MM-DD')}</Ellipsis></div>
                    </div>
                    <div className={styles.cardItem}>
                      <div className={styles.unCheckedCardItemLabel}>上次巡查人：</div>
                      <div className={styles.cardItemValue}><Ellipsis tooltip lines={1}>{checkName}</Ellipsis></div>
                    </div>
                    <div className={styles.cardItem}>
                      <div className={styles.unCheckedCardItemLabel}>上次巡查状态：</div>
                      <div className={styles.cardItemValue}><Ellipsis tooltip lines={1}>{this.getLabelByStatus(status)}</Ellipsis></div>
                    </div>
                    {isAbnormal && (
                      <div className={styles.cardItem}>
                        <div className={styles.unCheckedCardItemLabel}>处理结果：</div>
                        <div className={styles.cardItemValue}><Ellipsis tooltip lines={1}>{this.getResult(hiddenDangerCount)}</Ellipsis></div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
        style={{ backgroundColor: 'rgb(3, 44, 91)', color: '#fff' }}
        visible={visible}
        onClose={onClose}
      />
    );
  }
}
