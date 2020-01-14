import React, { Component, Fragment } from 'react';
import { message, Card, Steps, Collapse, Row, Col, Avatar, Spin, Empty, Pagination } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import DescriptionList from '@/components/DescriptionList';
import SelectOrSpan from '@/jingan-components/SelectOrSpan';
import ImagePreview from '@/jingan-components/ImagePreview';
import NewVideoPlay from '@/pages/BigPlatform/NewFireControl/section/NewVideoPlay';
import { connect } from 'dva';
import moment from 'moment';
import { isNumber, getPageSize, setPageSize, toFixed } from '@/utils/utils';
import locales from '@/locales/zh-CN';
import {
  DEFAULT_FORMAT,
  STATUSES,
} from '../List';
import styles from './index.less';

const { Step } = Steps;
const { Description } = DescriptionList;
const { Panel } = Collapse;
const EmptyData = () => <span className={styles.empty}>暂无数据</span>;
export const getTransformedTime = (time) => {
  if (time < 60 * 1000) {
    return '小于1min';
  } else {
    const day = Math.floor(time / (24 * 60 * 60 * 1000));
    time %= 24 * 60 * 60 * 1000;
    const hour = Math.floor(time / (60 * 60 * 1000));
    time %= 60 * 60 * 1000;
    const minute = Math.floor(time / (60 * 1000));
    // time %= 60 * 1000;
    // const second = Math.floor(time / 1000);
    return [day && `${day}d`, hour && `${hour}h`, minute && `${minute}min`/* , second && `${second}s` */].filter(v => v).join('');
  }
};
const getMessageContent = ({ statusType, fixType, warnLevel, paramDesc, monitorValue, paramUnit, limitValue, monitorEquipmentTypeName, faultTypeName }) => {
  if (+statusType === -1) {
    if (+fixType === 5) {
      return `${monitorEquipmentTypeName}发生火警`;
    } else if (+warnLevel === 1) {
      return `${monitorEquipmentTypeName}发生预警，${paramDesc}为${monitorValue}${paramUnit || ''}，超过预警值${toFixed(Math.abs(limitValue - monitorValue))}${paramUnit || ''}`;
    } else if (+warnLevel === 2) {
      return `${monitorEquipmentTypeName}发生告警，${paramDesc}为${monitorValue}${paramUnit || ''}，超过告警值${toFixed(Math.abs(limitValue - monitorValue))}${paramUnit || ''}`;
    }
  } else if (+statusType === -2) {
    return `${monitorEquipmentTypeName}发生失联`;
  } else if (+statusType === -3) {
    return `${monitorEquipmentTypeName}发生故障（${faultTypeName}）`;
  } else if (+statusType === 1) {
    if (+fixType === 5) {
      return `${monitorEquipmentTypeName}火警解除`;
    } else {
      return `${monitorEquipmentTypeName}报警解除（${paramDesc}）`;
    }
  } else if (+statusType === 2) {
    return `${monitorEquipmentTypeName}恢复在线`;
  } else if (+statusType === 3) {
    return `${monitorEquipmentTypeName}故障消除（${faultTypeName}）`;
  }
}

@connect((state, { route: { name, code, path } }) => {
  const { breadcrumbList } = code.split('.').reduce((result, item, index, list) => {
    const key = `${result.key}.${item}`;
    const title = locales[key];
    result.key = key;
    result.breadcrumbList.push({
      title,
      name: title,
      href: index === list.length - 2 ? path.replace(new RegExp(`${name}.*`), 'list') : undefined,
    });
    return result;
  }, {
    breadcrumbList: [
      { title: '首页', name: '首页', href: '/' },
    ],
    key: 'menu',
  });
  const namespace = code.replace(/.*\.(.*)\..*/, '$1');
  const {
    [namespace]: {
      detail,
      messageList,
    },
    loading: {
      effects: {
        [`${namespace}/getDetail`]: loading,
        [`${namespace}/getMessageList`]: loadingMessageList,
      },
    },
  } = state;
  return {
    detail,
    messageList,
    loading,
    loadingMessageList,
    breadcrumbList,
  };
}, (dispatch, { match: { params: { id } }, route: { code } }) => {
  const namespace = code.replace(/.*\.(.*)\..*/, '$1');
  return {
    getDetail(payload, callback) {
      dispatch({
        type: `${namespace}/getDetail`,
        payload: {
          id,
          ...payload,
        },
        callback: (success, data) => {
          if (!success) {
            message.error('获取详情失败，请稍后重试或联系管理人员！');
          }
          callback && callback(success, data);
        },
      });
    },
    getMessageList(payload, callback) {
      dispatch({
        type: `${namespace}/getMessageList`,
        payload: {
          processId: id,
          pageNum: 1,
          pageSize: getPageSize(),
          ...payload,
        },
        callback: (success, data) => {
          if (!success) {
            message.error('获取消息列表失败，请稍后重试或联系管理人员！');
          }
          callback && callback(success, data);
        },
      });
    },
  };
})
export default class AlarmWorkOrderDetail extends Component {
  state = {
    images: null,
    currentImage: 0,
    videoVisible: false,
    videoKeyId: undefined,
    collapseActiveKey: undefined,
  }

  componentDidMount() {
    const { getDetail, getMessageList } = this.props;
    getDetail();
    getMessageList({}, (success, messageList) => {
      if (success) {
        this.setState({
          collapseActiveKey: (messageList.list[0] || {}).id,
        });
      }
    });
  }

  showVideo = () => {
    const {
      detail: {
        videoList=[],
      }={},
    } = this.props;

    this.setState({
      videoVisible: true,
      videoKeyId: videoList[0].key_id,
    });
  }

  hideVideo = () => {
    this.setState({
      videoVisible: false,
    });
  }

  handleCollapseChange = (collapseActiveKey) => {
    this.setState({
      collapseActiveKey,
    });
  }

  handlePaginationChange = (pageNum, pageSize) => {
    const { getMessageList } = this.props;
    getMessageList({
      pageNum,
      pageSize,
    }, (success, messageList) => {
      if (success) {
        this.setState({
          collapseActiveKey: (messageList.list[0] || {}).id,
        });
      }
    });
  }

  handlePageSizeChange = (pageNum, pageSize) => {
    const { getMessageList } = this.props;
    getMessageList({
      pageNum: 1,
      pageSize,
    }, (success, messageList) => {
      if (success) {
        this.setState({
          collapseActiveKey: (messageList.list[0] || {}).id,
        });
      }
    });
    setPageSize(pageSize);
  }

  renderWorkOrderFlow() {
    const {
      detail: {
        type,
        createUserName,
        createDate,
        executorName,
        endDate,
        executeType,
        startDate,
        startUserName,
        status,
      }={},
    } = this.props;
    let current = 0;
    const steps = [
      {
        id: '工单创建',
        title: '工单创建',
        description: (
          <Fragment>
            {/* <div>{createUserName}</div> */}
            <div>{createDate && moment(createDate).format(DEFAULT_FORMAT)}</div>
          </Fragment>
        ),
      },
    ];
    if (+executeType !== 2) { // 不是自动处理的情况下再显示
      if (+status === 0 || +status === 1) {
        current += 1;
        steps.push({
          id: '确认警情',
          title: '确认警情',
          description: (
            <Fragment>
              <div>{({ 1: '误报警情', 2: '真实警情' })[type]}</div>
              <div>{startUserName}</div>
              <div>{moment(startDate).format(DEFAULT_FORMAT)}</div>
            </Fragment>
          ),
        });
      } else {
        steps.push({
          id: '确认警情',
          title: '确认警情',
        });
      }
    }
    if (+status === 1) {
      current += 1;
      steps.push({
        id: '完成工单',
        title: `完成工单${+executeType === 2 ? '（自动处理）' : ''}`,
        description: (
          <Fragment>
            {+executeType !== 2 && <div>{executorName}</div>}
            <div>{moment(endDate).format(DEFAULT_FORMAT)}</div>
          </Fragment>
        ),
      });
    } else {
      steps.push({
        id: '完成工单',
        title: '完成工单',
      });
    }

    return (
      <Card className={styles.card} title="工单流程">
        <Steps current={current}>
          {steps.map(({ id, title, description }) => (
            <Step title={title} description={description} key={id} />
          ))}
        </Steps>
      </Card>
    );
  }

  renderWorkOrderInfo() {
    const {
      detail: {
        videoList,
        status,
        type,
        spendTime,
        targetName,
        deviceName,
        unitTypeName,
        reportType,
        reportTypeName,
        areaLocation,
        sitePhotoList,
        disasterDesc,
        loopNumber,
        partNumber,
        executeType,
      }={},
    } = this.props;
    const isHost = +reportType === 1;
    const isFinished = +status === 1;

    return (
      <Card className={styles.card} title="工单信息">
        <DescriptionList className={styles.descriptionList} gutter={24}>
          <Description term="处理状态">
            {isNumber(status) ? (
              <div className={styles.statusContainer}>
                <div className={styles.status}>
                  <SelectOrSpan list={STATUSES} value={`${status}`} type="span" />
                </div>
                {/* {+type === 2 && <div className={styles.realAlarm}>真实警情</div>} */}
                {<div className={styles.realAlarm}>{+executeType === 2 ? <span style={{ color: '#b823dd' }}>未知警情</span> : ({ 1: '误报警情', 2: '真实警情' })[type]}</div>}
              </div>
            ) : <EmptyData />}
          </Description>
          {isFinished && (
            <Description term="耗时">
              {isNumber(spendTime) ? getTransformedTime(spendTime) : <EmptyData />}
            </Description>
          )}
          {!isHost && (
            <Description term="监测对象">
              {targetName || <EmptyData />}
            </Description>
          )}
          {isHost && !isFinished && (
            <Description term="消防主机">
              {deviceName || <EmptyData />}
            </Description>
          )}
          {isHost && !isFinished && (
            <Description term="部件类型">
              {unitTypeName || <EmptyData />}
            </Description>
          )}
        </DescriptionList>
        <DescriptionList className={styles.descriptionList} gutter={24}>
          {isHost && isFinished && (
            <Description term="消防主机">
              {deviceName || <EmptyData />}
            </Description>
          )}
          {!isHost ? (
            <Description term="监测设备名称">
              <div className={styles.nameWrapper}>
                <div className={styles.name}>{deviceName || <EmptyData />}</div>
                {videoList && videoList.length > 0 && <div className={styles.videoWrapper}><div className={styles.video} onClick={this.showVideo} /></div>}
              </div>
            </Description>
          ) : (
            <Description term="回路号">
              <div className={styles.nameWrapper}>
                <div className={styles.name}>{loopNumber || partNumber ? `${loopNumber ? `${loopNumber}回路` : ''}${partNumber ? `${partNumber}号` : ''}` : <EmptyData />}</div>
                {videoList && videoList.length > 0 && <div className={styles.videoWrapper}><div className={styles.video} onClick={this.showVideo} /></div>}
              </div>
            </Description>
          )}
          {isHost && isFinished && (
            <Description term="部件类型">
              {unitTypeName || <EmptyData />}
            </Description>
          )}
          <Description term="监测类型">
            {reportTypeName || <EmptyData />}
          </Description>
          <Description term="区域位置">
            {areaLocation || <EmptyData />}
          </Description>
        </DescriptionList>
        {isFinished && (
          <Fragment>
            <DescriptionList className={styles.descriptionList} gutter={24} col={1}>
              <Description term="现场照片">
                {sitePhotoList && sitePhotoList.length ? (
                  <div className={styles.imageContainer}>
                    {sitePhotoList.map((webUrl, index) => (
                      <div className={styles.imageWrapper} key={index}>
                        <div
                          className={styles.image}
                          style={{
                            backgroundImage: `url(${webUrl})`,
                          }}
                          onClick={() => this.setState({ images: sitePhotoList.map((webUrl) => webUrl), currentImage: index })}
                        />
                      </div>
                    ))}
                  </div>
                ) : <EmptyData />}
              </Description>
            </DescriptionList>
            <DescriptionList gutter={24} col={1}>
              <Description term="问题描述" className={styles.description}>
                {disasterDesc || <EmptyData />}
              </Description>
            </DescriptionList>
          </Fragment>
        )}
      </Card>
    );
  }

  renderMessageNotification() {
    const {
      messageList: {
        list,
        pagination: {
          total,
          pageNum,
          pageSize,
        }={},
      }={},
      loading=false,
      loadingMessageList=false,
    } = this.props;
    const { collapseActiveKey } = this.state;

    return (
      <Card className={styles.card} title={<Fragment>消息通知<span className={styles.total}>（共{total || 0}条）</span></Fragment>}>
        <Spin spinning={!loading && loadingMessageList}>
          {list && list.length ? (
            <Fragment>
              <Collapse className={styles.collapse} bordered={false} activeKey={collapseActiveKey} onChange={this.handleCollapseChange} accordion>
                {list.map((item) => {
                  const { id, happenTime, mailAcceptUsers } = item;
                  const { content, readCount, unreadCount } = mailAcceptUsers && mailAcceptUsers.length ? mailAcceptUsers.reduce((result, { accept_user_id, accept_user_name, accept_user_phone, status }) => {
                    if (+status) {
                      result.unreadCount += 1;
                    } else {
                      result.readCount += 1;
                    }
                    result.content.push((
                      <Col span={6} key={accept_user_id}>
                        <div className={styles.receiverWrapper}>
                          <Avatar className={styles.avatar}>
                            {accept_user_name[0]}
                          </Avatar>
                          <div className={styles.receiverInfoWrapper}>
                            <div className={styles.receiverInfo}>
                              <div className={styles.receiverName}>{accept_user_name}</div>
                              <div className={styles.receiverPhone}>{accept_user_phone}</div>
                            </div>
                            <div className={styles.receiverStatus}>{`站内信${+status ? '未读' : '已读'}`}</div>
                          </div>
                        </div>
                      </Col>
                    ));
                    return result;
                  }, {
                    content: [],
                    readCount: 0,
                    unreadCount: 0,
                  }) : {
                    content: <Empty />,
                    readCount: 0,
                    unreadCount: 0,
                  };
                  return (
                    <Panel header={
                      <div className={styles.message}>
                        <div className={styles.messageLeft}>{moment(happenTime).format(DEFAULT_FORMAT)}&nbsp;&nbsp;{getMessageContent(item)}</div>
                        <div className={styles.messageRight}>站内信：{`${readCount}人已读，${unreadCount}人未读`}</div>
                      </div>
                    } key={id}>
                      <Row gutter={24} className={styles.row}>
                        {content}
                      </Row>
                    </Panel>
                  );
                })}
              </Collapse>
            <Pagination
              className={styles.pagination}
              total={total}
              current={pageNum}
              pageSize={pageSize}
              pageSizeOptions={['5', '10', '15', '20']}
              showQuickJumper
              showSizeChanger
              onChange={this.handlePaginationChange}
              onShowSizeChange={this.handlePageSizeChange}
            />
            </Fragment>
          ) : (
            <Empty />
          )}
        </Spin>
      </Card>
    );
  }

  renderImagePreview() {
    const { images, currentImage } = this.state;

    return (
      <ImagePreview
        images={images}
        currentImage={currentImage}
      />
    );
  }

  renderVideo() {
    const {
      detail: {
        videoList=[],
      }={},
    } = this.props;
    const { videoVisible, videoKeyId } = this.state;

    return (
      <NewVideoPlay
        style={{ zIndex: 9999, position: 'fixed' }}
        videoList={videoList}
        visible={videoVisible}
        showList={true}
        keyId={videoKeyId}
        handleVideoClose={this.hideVideo}
      />
    );
  }

  render() {
    const {
      breadcrumbList,
      loading=false,
    } = this.props;

    return (
      <PageHeaderLayout
        title={breadcrumbList[breadcrumbList.length - 1].title}
        breadcrumbList={breadcrumbList}
      >
        <Spin spinning={loading}>
          {this.renderWorkOrderFlow()}
          {this.renderWorkOrderInfo()}
          {this.renderMessageNotification()}
          {this.renderImagePreview()}
          {this.renderVideo()}
        </Spin>
      </PageHeaderLayout>
    );
  }
}
