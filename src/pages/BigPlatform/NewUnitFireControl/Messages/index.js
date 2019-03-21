import React, { PureComponent } from 'react';
import { Icon } from 'antd';
import NewSection from '@/components/NewSection';
import moment from 'moment';
// import DescriptionList from 'components/DescriptionList';
import styles from './index.less';

const formatTime = time => {
  const diff = moment().diff(moment(time));
  if (diff > 2 * 24 * 60 * 60 * 1000) {
    return moment(time).format('YYYY-MM-DD HH:mm');
  } else if (diff > 24 * 60 * 60 * 1000) {
    return `昨日 ${moment(time).format('HH:mm')}`;
  } else if (diff > 60 * 60 * 1000) {
    return `今日 ${moment(time).format('HH:mm')}`;
  } else if (diff > 60 * 1000) {
    return `${moment.duration(diff).minutes() + 1}分钟前`;
  } else {
    return `刚刚`;
  }
};

const getEmptyData = () => {
  return '暂无数据';
};
/**
 * description: 大屏消息
 * author: zkg
 * date: 2018年12月04日
 */
// const { Description } = DescriptionList;
export default class Messages extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      thisMin: '',
      // 是否展开告警信息
      isExpanded: false,
    };
  }

  componentDidMount() {
    setInterval(() => {
      this.setState({ thisMin: moment().format('YYYY-MM-DD HH:mm') });
    }, 120000);
  }

  handleClickExpandButton = () => {
    this.setState(({ isExpanded }) => ({ isExpanded: !isExpanded }));
  };

  renderMsg = (msg, index) => {
    const {
      handleParentChange,
      fetchData,
      handleViewDangerDetail,
      handleClickMessage,
      handleFaultClick,
      handleFireMessage,
      handleWorkOrderCardClickMsg,
      handleViewWater,
    } = this.props;
    const {
      type,
      title,
      messageFlag,
      proceCompany,
      addTime,
      address,
      reportUser,
      pointName,
      dangerDesc,
      installAddress,
      reviewUser,
      remark,
      reviewResult,
      loopNumber,
      partNumber,
      componentType,
      rectifyMeasures,
      rectifyUser,
      resultFeedBack,
      proceUser,
      proceContent,
      checkResult,
      checkUser,
      score,
      maintenanceCompany,
      maintenanceUser,
      // addTimeStr,
      deviceType,
      area,
      location,
      paramName,
      condition,
    } = msg;
    let msgItem = null;
    if (type === 1 || type === 2 || type === 3 || type === 4) {
      // 发生监管\联动\反馈\屏蔽
      msgItem = (
        <div className={styles.msgItem} key={index}>
          <div className={styles.msgTime}>{formatTime(addTime)}</div>
          <div className={styles.msgType}>{title}</div>
          <div className={styles.msgBody}>
            位置：
            {installAddress || getEmptyData()}
          </div>
          <div className={styles.msgBody}>
            回路故障号：
            {loopNumber || loopNumber === 0 ? `${loopNumber}回路${partNumber}号` : '暂无数据'}
          </div>
          <div className={styles.msgBody}>
            部件类型：
            {componentType || getEmptyData()}
          </div>
        </div>
      );
    } else if (type === 5 || type === 6) {
      // 发生火警, 发生故障
      msgItem = (
        <div className={styles.msgItem} key={index}>
          <a
            className={styles.detailBtn}
            onClick={() => {
              if (type === 5) handleClickMessage(messageFlag, { ...msg });
              else handleFaultClick({ ...msg });
            }}
          >
            详情
            <Icon type="double-right" />
          </a>
          <div className={styles.msgTime}>{formatTime(addTime)}</div>
          <div className={styles.msgType}>{title}</div>
          <div className={styles.msgBody}>
            位置：
            {installAddress || getEmptyData()}
          </div>
          <div className={styles.msgBody}>
            回路故障号：
            {loopNumber || loopNumber === 0 ? `${loopNumber}回路${partNumber}号` : '暂无数据'}
          </div>
          <div className={styles.msgBody}>
            部件类型：
            {componentType || getEmptyData()}
          </div>
        </div>
      );
    } else if (type === 7) {
      // 火警确认
      msgItem = (
        <div className={styles.msgItem} key={index}>
          <a
            className={styles.detailBtn}
            onClick={() => {
              handleFireMessage(JSON.parse(messageFlag));
            }}
          >
            详情
            <Icon type="double-right" />
          </a>
          <div className={styles.msgTime}>{formatTime(addTime)}</div>
          <div className={styles.msgType}>{title}</div>
          <div className={styles.msgBody}>
            位置：
            {address || getEmptyData()}
          </div>
          <div className={styles.msgBody}>
            处理人：
            {proceUser || getEmptyData()}
          </div>
          <div className={styles.msgBody}>
            确认结果：
            {resultFeedBack || getEmptyData()}
          </div>
        </div>
      );
    } else if (type === 8 || type === 19) {
      // 真实火警处理，误报火警处理
      msgItem = (
        <div className={styles.msgItem} key={index}>
          <a
            className={styles.detailBtn}
            onClick={() => {
              handleFireMessage(JSON.parse(messageFlag));
            }}
          >
            详情
            <Icon type="double-right" />
          </a>
          <div className={styles.msgTime}>{formatTime(addTime)}</div>
          <div className={styles.msgType}>{title}</div>
          <div className={styles.msgBody}>
            位置：
            {address || getEmptyData()}
          </div>
          <div className={styles.msgBody}>
            处理人：
            {proceUser || getEmptyData()}
          </div>
          <div className={styles.msgBody}>
            处理内容：
            {proceContent || getEmptyData()}
          </div>
        </div>
      );
    } else if (type === 9) {
      // 开始故障维修
      msgItem = (
        <div className={styles.msgItem} key={index}>
          <a
            className={styles.detailBtn}
            onClick={() => {
              handleParentChange({ maintenanceTitle: '故障处理动态' });
              handleWorkOrderCardClickMsg(JSON.parse(messageFlag));
            }}
          >
            详情
            <Icon type="double-right" />
          </a>
          <div className={styles.msgTime}>{formatTime(addTime)}</div>
          <div className={styles.msgType}>{title}</div>
          <div className={styles.msgBody}>
            位置：
            {address || getEmptyData()}
          </div>
          <div className={styles.msgBody}>
            维修人：
            {proceUser || getEmptyData()}
          </div>
        </div>
      );
    } else if (type === 10 || type === 11) {
      // 故障指派维修, 维保开始维修
      msgItem = (
        <div className={styles.msgItem} key={index}>
          <a
            className={styles.detailBtn}
            onClick={() => {
              if (type === 10) handleParentChange({ maintenanceTitle: '故障处理动态' });
              handleWorkOrderCardClickMsg(JSON.parse(messageFlag));
            }}
          >
            详情
            <Icon type="double-right" />
          </a>
          <div className={styles.msgTime}>{formatTime(addTime)}</div>
          <div className={styles.msgType}>{title}</div>
          <div className={styles.msgBody}>
            位置：
            {address || getEmptyData()}
          </div>
          <div className={styles.msgBody}>
            维修单位：
            {proceCompany}
          </div>
        </div>
      );
    } else if (type === 12) {
      // 完成故障维修
      msgItem = (
        <div className={styles.msgItem} key={index}>
          <a
            className={styles.detailBtn}
            onClick={() => {
              handleParentChange({ maintenanceTitle: '故障处理动态' });
              handleWorkOrderCardClickMsg(JSON.parse(messageFlag));
            }}
          >
            详情
            <Icon type="double-right" />
          </a>
          <div className={styles.msgTime}>{formatTime(addTime)}</div>
          <div className={styles.msgType}>{title}</div>
          <div className={styles.msgBody}>
            位置：
            {address || getEmptyData()}
          </div>
          <div className={styles.msgBody}>
            维修单位：
            {proceCompany || getEmptyData()}
          </div>
          <div className={styles.msgBody}>
            维修人：
            {proceUser}
          </div>
          <div className={styles.msgBody}>
            结果反馈：
            {resultFeedBack}
          </div>
        </div>
      );
    } else if (type === 13) {
      // 安全巡查
      msgItem = (
        <div className={styles.msgItem} key={index}>
          <div className={styles.msgTime}>{formatTime(addTime)}</div>
          <div className={styles.msgType}>{title}</div>
          <div className={styles.msgBody}>
            检查点：
            {pointName}
          </div>
          <div className={styles.msgBody}>
            巡查人：
            {checkUser || getEmptyData()}
          </div>
          <div className={styles.msgBody}>
            巡查结果：
            {checkResult}
          </div>
        </div>
      );
    } else if (type === 14) {
      // 上报隐患
      msgItem = (
        <div className={styles.msgItem} key={index}>
          <a
            className={styles.detailBtn}
            onClick={() => {
              handleViewDangerDetail({ id: messageFlag });
            }}
          >
            详情
            <Icon type="double-right" />
          </a>
          <div className={styles.msgTime}>{formatTime(addTime)}</div>
          <div className={styles.msgType}>{title}</div>
          <div className={styles.msgBody}>
            检查点：
            {pointName}
          </div>
          <div className={styles.msgBody}>
            隐患描述：
            {dangerDesc || getEmptyData()}
          </div>
          <div className={styles.msgBody}>
            上报人：
            {reportUser}
          </div>
        </div>
      );
    } else if (type === 15 || type === 16) {
      // 整改隐患, 重新整改隐患
      msgItem = (
        <div className={styles.msgItem} key={index}>
          <a
            className={styles.detailBtn}
            onClick={() => {
              handleViewDangerDetail({ id: messageFlag });
            }}
          >
            详情
            <Icon type="double-right" />
          </a>
          <div className={styles.msgTime}>{formatTime(addTime)}</div>
          <div className={styles.msgType}>{title}</div>
          <div className={styles.msgBody}>
            检查点：
            {pointName}
          </div>
          <div className={styles.msgBody}>
            隐患描述：
            {dangerDesc || getEmptyData()}
          </div>
          <div className={styles.msgBody}>
            整改人：
            {rectifyUser}
          </div>
          <div className={styles.msgBody}>
            整改措施：
            {rectifyMeasures}
          </div>
        </div>
      );
    } else if (type === 17) {
      // 复查隐患
      msgItem = (
        <div className={styles.msgItem} key={index}>
          <a
            className={styles.detailBtn}
            onClick={() => {
              handleViewDangerDetail({ id: messageFlag });
            }}
          >
            详情
            <Icon type="double-right" />
          </a>
          <div className={styles.msgTime}>{formatTime(addTime)}</div>
          <div className={styles.msgType}>{title}</div>
          <div className={styles.msgBody}>
            检查点：
            {pointName}
          </div>
          <div className={styles.msgBody}>
            隐患描述：
            {dangerDesc || getEmptyData()}
          </div>
          <div className={styles.msgBody}>
            复查人：
            {reviewUser}
          </div>
          <div className={styles.msgBody}>
            复查结果：
            {reviewResult}
          </div>
          <div className={styles.msgBody}>
            备注：
            {remark}
          </div>
        </div>
      );
    } else if (type === 18) {
      // 维保巡检
      msgItem = (
        <div className={styles.msgItem} key={index}>
          <a
            className={styles.detailBtn}
            onClick={() => {
              handleParentChange({ maintenanceCheckDrawerVisible: true });
              fetchData(messageFlag);
            }}
          >
            详情
            <Icon type="double-right" />
          </a>
          <div className={styles.msgTime}>{formatTime(addTime)}</div>
          <div className={styles.msgType}>{title}</div>
          <div className={styles.msgBody}>
            维保单位：
            {maintenanceCompany}
          </div>
          <div className={styles.msgBody}>
            维保人：
            {(Array.isArray(maintenanceUser) && maintenanceUser.join('，')) || maintenanceUser}
          </div>
          <div className={styles.msgBody}>
            消防设施评分：
            {score}
          </div>
        </div>
      );
    } else if (type === 36) {
      // 动态监测报警
      msgItem = (
        <div className={styles.msgItem} key={index}>
          <a
            className={styles.detailBtn}
            onClick={() => {
              handleViewWater([101, 102, 103].indexOf(+deviceType), deviceType);
            }}
          >
            详情
            <Icon type="double-right" />
          </a>
          <div className={styles.msgTime}>{formatTime(addTime)}</div>
          <div className={styles.msgType}>{title}</div>
          <div className={styles.msgBody}>
            {+deviceType === 101
              ? '消火栓系统'
              : +deviceType === 102
                ? '自动喷淋系统'
                : '水池/水箱'}
          </div>
          <div className={styles.msgBody}>
            {area +
              location +
              '-' +
              paramName +
              (condition === '>=' ? '大于等于' : '小于等于') +
              '报警值'}
          </div>
        </div>
      );
    } else if (type === 37) {
      // 动态监测恢复
      msgItem = (
        <div className={styles.msgItem} key={index}>
          <a
            className={styles.detailBtn}
            onClick={() => {
              handleViewWater([101, 102, 103].indexOf(+deviceType), deviceType);
            }}
          >
            详情
            <Icon type="double-right" />
          </a>
          <div className={styles.msgTime}>{formatTime(addTime)}</div>
          <div className={styles.msgType}>{title}</div>
          <div className={styles.msgBody}>
            {+deviceType === 101
              ? '消火栓系统'
              : +deviceType === 102
                ? '自动喷淋系统'
                : '水池/水箱'}
          </div>
          <div className={styles.msgBody}>{area + location}</div>
        </div>
      );
    } else {
      msgItem = (
        <div className={styles.msgItem} key={index}>
          <div className={styles.msgTime}>{formatTime(addTime)}</div>
          <div className={styles.msgType}>{title}</div>
        </div>
      );
    }
    return msgItem;
  };

  render() {
    const {
      model: { screenMessage },
      className,
    } = this.props;
    const { isExpanded } = this.state;
    // 收缩显示3个，展开最大显示100个
    const list = isExpanded ? screenMessage.slice(0, 100) : screenMessage.slice(0, 3);

    return (
      <NewSection
        title="实时消息"
        className={className}
        style={{ display: 'flex', flexDirection: 'column', height: 'auto' }}
        titleStyle={{ flex: 'none' }}
        contentStyle={{
          flex: '1',
          display: 'flex',
          height: 'auto',
          backgroundColor: 'rgba(17, 58, 112, 0.9)' /* padding: '16px 0' */,
        }}
        scroll={{
          className: styles.scroll,
        }}
        other={
          screenMessage.length > 3 && (
            <Icon
              type={isExpanded ? 'double-left' : 'double-right'}
              className={styles.expandButton}
              onClick={this.handleClickExpandButton}
            />
          )
        }
        planB
      >
        {list.length > 0 ? (
          list.map((item, index) => {
            return this.renderMsg(item, index);
          })
        ) : (
          <div className={styles.emptyData}>暂无消息</div>
        )}
      </NewSection>
    );
  }
}
