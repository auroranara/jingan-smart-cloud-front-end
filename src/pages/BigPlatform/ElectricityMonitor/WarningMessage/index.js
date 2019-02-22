import React, { PureComponent, Fragment } from 'react';
import { Icon } from 'antd';
import moment from 'moment';
import NewSection from '@/components/NewSection';
// 引入样式文件
import styles from './index.less';

// 告警信息Item
const Message = function({
  data: {
    companyName,
    addTime,
    type,
    area,
    location,
    paramName,
    realtimeVal,
    unit,
    condition,
    limitVal,
    oldWarningTime,
    companyId,
    messageFlag, // deviceId
  },
  genHandleClick,
}) {
  return (
    <div className={styles.message}>
      <div className={styles.messageTitle}>
        <div className={styles.messageTitleLeft}>{companyName}</div>
        <div className={styles.messageTitleRight}>{moment(addTime).format('HH:mm:ss')}</div>
      </div>
      <div className={styles.messageContent}>
        {type === 32 ? (
          <div className={styles.msgDetail}>{`${area}${location}${paramName}${realtimeVal}${unit}（${condition==='>='?'≥':'≤'}${limitVal}${unit}）`}</div>
        ) : (
          <Fragment>
            <div>{`${moment(oldWarningTime).format('HH:mm:ss')} ${area}${location}${paramName}告警`}</div>
            <div>现已恢复正常！</div>
          </Fragment>
        )}
        <div className={styles.detail} onClick={genHandleClick(companyId, messageFlag, paramName)}>
          详情
          <Icon type="double-right" />
        </div>
      </div>
    </div>
  );
};

/**
 * description: 告警信息
 * author: sunkai
 * date: 2019年01月09日
 */
export default class WarningMessage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      // 是否展开告警信息
      isExpanded: false,
    };
  }

  genHandleClick = (companyId, deviceId, paramName) => {
    const { units, showUnitDetail } = this.props;
    return e => {
      showUnitDetail(
        units.filter(({ companyId: id }) => id === companyId)[0],
        deviceId,
        undefined,
        paramName
      );
    };
  };

  /**
   * 1.修改state状态
   */
  handleClickExpandButton = () => {
    this.setState(({ isExpanded }) => ({ isExpanded: !isExpanded }));
  }

  /**
   * 渲染
   */
  render() {
    const {
      // 容器类名
      className,
      // 数据源
      data,
    } = this.props;

    // console.log(data);
    const { isExpanded } = this.state;
    // 收缩显示3个，展开最大显示100个
    const list = isExpanded ? data.slice(0, 100) : data.slice(0, 3);

    return (
      <NewSection
        title="告警信息"
        className={className}
        style={{ display: 'flex', flexDirection: 'column', height: 'auto' }}
        titleStyle={{ flex: 'none' }}
        contentStyle={{ flex: '1', display: 'flex', height: 'auto' /* padding: '16px 0' */ }}
        scroll={{
          className: styles.scroll,
        }}
        other={data.length > 3 && <Icon type={isExpanded?'double-left':'double-right'} className={styles.expandButton} onClick={this.handleClickExpandButton} />}
      >
        {list.length > 0 ? list.map(item => <Message key={item.messageId} data={item} genHandleClick={this.genHandleClick} />) : (
          <div className={styles.emptyData}>暂无消息</div>
        )}
      </NewSection>
    );
  }
}
