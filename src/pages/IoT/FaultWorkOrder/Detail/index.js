import React, { useState, useEffect, Fragment } from 'react';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import DescriptionList from '@/components/DescriptionList';
import EmptyText from '@/jingan-components/View/EmptyText';
import { Card, Steps, Collapse, Row, Col, Avatar, Empty, Pagination, Skeleton } from 'antd';
import ImagePreview from '@/jingan-components/ImagePreview';
import NewVideoPlay from '@/pages/BigPlatform/NewFireControl/section/NewVideoPlay';
import { connect } from 'dva';
import moment from 'moment';
import classNames from 'classnames';
import { isNumber } from '@/utils/utils';
import {
  STATUSES,
  FORMAT,
  GET_TRANSFORMED_TIME,
  GET_MESSAGE_CONTENT,
} from '../../AlarmWorkOrder/config';
import styles from './index.less';
const { Step } = Steps;
const { Description } = DescriptionList;
const { Panel } = Collapse;

const NAMESPACE = 'workOrder';
const DETAIL_API = `${NAMESPACE}/getDetail`;
const MESSAGE_LIST_API = `${NAMESPACE}/getMessageList`;
const BREADCRUMB_LIST = [
  { title: '首页', name: '首页', href: '/' },
  { title: '物联网监测报警', name: '物联网监测报警' },
  { title: '故障工单管理', name: '故障工单管理', href: '/company-iot/fault-work-order/list' },
  { title: '工单详情', name: '工单详情' },
];

export default connect(
  state => state,
  null,
  (
    {
      user: { currentUser },
      [NAMESPACE]: { detail, messageList },
      loading: {
        effects: { [DETAIL_API]: loading, [MESSAGE_LIST_API]: loadingMessageList },
      },
    },
    { dispatch },
    {
      match: {
        params: { id },
      },
      match,
      ...ownProps
    }
  ) => {
    return {
      ...ownProps,
      match,
      currentUser,
      detail,
      loading,
      getDetail(payload, callback) {
        dispatch({
          type: DETAIL_API,
          payload: {
            id,
            ...payload,
          },
          callback,
        });
      },
      messageList,
      loadingMessageList,
      getMessageList(payload, callback) {
        dispatch({
          type: MESSAGE_LIST_API,
          payload: {
            pageNum: 1,
            pageSize: 10,
            processId: id,
            ...payload,
          },
          callback,
        });
      },
    };
  },
  {
    areStatesEqual: () => false,
    areOwnPropsEqual: () => false,
    areStatePropsEqual: () => false,
    areMergedPropsEqual: (props, nextProps) => {
      return (
        props.detail === nextProps.detail &&
        props.loading === nextProps.loading &&
        props.messageList === nextProps.messageList &&
        props.loadingMessageList === nextProps.loadingMessageList &&
        props.match.params.id === nextProps.match.params.id &&
        props.location.query.flag === nextProps.match.params.flag
      );
    },
  }
)(
  ({
    match: {
      params: { id },
    },
    location: { query },
    currentUser: { unitType },
    detail: {
      companyName,
      createDate,
      status,
      startUserName,
      startUserCompany,
      startDate,
      executorName,
      executorCompanyName,
      endDate,
      spendTime,
      reportType,
      reportTypeName,
      targetName,
      deviceName,
      loopNumber,
      partNumber,
      unitTypeName,
      areaLocation,
      sitePhotoList,
      disasterDesc,
      videoList,
    } = {},
    loading,
    getDetail,
    messageList: { list, pagination: { total, pageNum, pageSize } = {} } = {},
    loadingMessageList,
    getMessageList,
  }) => {
    const [video, setVideo] = useState({
      visible: false,
      keyId: undefined,
    });
    const [image, setImage] = useState({
      images: undefined,
      currentImage: undefined,
    });
    const [activeKey, setActiveKey] = useState(undefined);
    useEffect(
      () => {
        getDetail();
        getMessageList(undefined, (success, data) => {
          if (success) {
            setActiveKey((data.list[0] || {}).id);
            if ('flag' in query) {
              setTimeout(() => {
                window.scrollTo(
                  0,
                  document.querySelector('.work-order-message-card').offsetTop - 64
                );
              });
            }
          }
        });
      },
      [id]
    );
    const current = { 2: 0, 0: 1, 1: 2 }[status] || 0;
    const isFinished = current > 1;
    const steps = [
      {
        title: '工单创建',
        description: <div>{createDate ? moment(createDate).format(FORMAT) : <EmptyText />}</div>,
      },
      {
        title: '进行处理',
        description: current > 0 && (
          <Fragment>
            <div>{startUserName || <EmptyText />}</div>
            <div>{startUserCompany || <EmptyText />}</div>
            <div>{startDate ? moment(startDate).format(FORMAT) : <EmptyText />}</div>
          </Fragment>
        ),
      },
      {
        title: '完成工单',
        description: isFinished && (
          <Fragment>
            <div>{executorName || <EmptyText />}</div>
            <div>{executorCompanyName || <EmptyText />}</div>
            <div>{endDate ? moment(endDate).format(FORMAT) : <EmptyText />}</div>
          </Fragment>
        ),
      },
    ];
    const isHost = +reportType === 1;
    return (
      <PageHeaderLayout
        breadcrumbList={BREADCRUMB_LIST}
        title={BREADCRUMB_LIST[BREADCRUMB_LIST.length - 1].title}
        content={
          unitType !== 4 && (loading ? <Skeleton paragraph={{ rows: 0 }} active /> : companyName)
        }
      >
        <Card className={styles.card} title="工单流程">
          {loading ? (
            <Skeleton active />
          ) : (
            <Steps current={current}>
              {steps.map(({ title, description }) => (
                <Step key={title} title={title} description={description} />
              ))}
            </Steps>
          )}
        </Card>
        <Card className={styles.card} title="工单信息">
          {loading ? (
            <Skeleton active />
          ) : (
            <Fragment>
              <DescriptionList className={styles.descriptionList} gutter={24}>
                <Description term="处理状态">
                  {STATUSES.find(item => item.key === `${current}`).value}
                </Description>
                {isFinished && (
                  <Description term="耗时">
                    {isNumber(spendTime) ? GET_TRANSFORMED_TIME(spendTime) : <EmptyText />}
                  </Description>
                )}
                {!isHost && (
                  <Description term="监测对象">{targetName || <EmptyText />}</Description>
                )}
                {isHost &&
                  !isFinished && (
                    <Fragment>
                      <Description term="消防主机">{deviceName || <EmptyText />}</Description>
                      <Description term="部件类型">{unitTypeName || <EmptyText />}</Description>
                    </Fragment>
                  )}
              </DescriptionList>
              <DescriptionList className={styles.descriptionList} gutter={24}>
                {isHost &&
                  isFinished && (
                    <Description term="消防主机">{deviceName || <EmptyText />}</Description>
                  )}
                {!isHost ? (
                  <Description term="监测设备名称">
                    <div className={styles.nameWrapper}>
                      <div className={styles.name}>{deviceName || <EmptyText />}</div>
                      {videoList &&
                        videoList.length > 0 && (
                          <div className={styles.videoWrapper}>
                            <div
                              className={styles.video}
                              onClick={() =>
                                setVideo({
                                  visible: true,
                                  keyId: videoList[0].key_id,
                                })
                              }
                            />
                          </div>
                        )}
                    </div>
                  </Description>
                ) : (
                  <Description term="回路号">
                    <div className={styles.nameWrapper}>
                      <div className={styles.name}>
                        {`${loopNumber ? `${loopNumber}回路` : ''}${
                          partNumber ? `${partNumber}号` : ''
                        }` || <EmptyText />}
                      </div>
                      {videoList &&
                        videoList.length > 0 && (
                          <div className={styles.videoWrapper}>
                            <div
                              className={styles.video}
                              onClick={() =>
                                setVideo({
                                  visible: true,
                                  keyId: videoList[0].key_id,
                                })
                              }
                            />
                          </div>
                        )}
                    </div>
                  </Description>
                )}
                {isHost &&
                  isFinished && (
                    <Description term="部件类型">{unitTypeName || <EmptyText />}</Description>
                  )}
                <Description term="监测类型">{reportTypeName || <EmptyText />}</Description>
                <Description term="区域位置">{areaLocation || <EmptyText />}</Description>
              </DescriptionList>
              {isFinished && (
                <Fragment>
                  <DescriptionList className={styles.descriptionList} gutter={24} col={1}>
                    <Description term="现场照片">
                      {sitePhotoList && sitePhotoList.length ? (
                        <div className={styles.imageContainer}>
                          {sitePhotoList.map((webUrl, index) => (
                            <img
                              key={index}
                              className={styles.image}
                              src={webUrl}
                              alt=""
                              onClick={() =>
                                setImage({
                                  images: sitePhotoList.map(webUrl => webUrl),
                                  currentImage: index,
                                })
                              }
                            />
                          ))}
                        </div>
                      ) : (
                        <EmptyText />
                      )}
                    </Description>
                  </DescriptionList>
                  <DescriptionList gutter={24} col={1}>
                    <Description term="问题描述" className={styles.description}>
                      {disasterDesc || <EmptyText />}
                    </Description>
                  </DescriptionList>
                </Fragment>
              )}
            </Fragment>
          )}
        </Card>
        <Card
          className={classNames(styles.card, 'work-order-message-card')}
          title={
            <Fragment>
              消息通知
              <span className={styles.total}>
                （共
                {total || 0}
                条）
              </span>
            </Fragment>
          }
        >
          {loadingMessageList ? (
            <Skeleton active />
          ) : list && list.length ? (
            <Fragment>
              <Collapse
                className={styles.collapse}
                bordered={false}
                activeKey={activeKey}
                onChange={setActiveKey}
                accordion
                expandIconPosition="right"
              >
                {list.map(item => {
                  const { id, happenTime, mailAcceptUsers } = item;
                  const { content, readCount, unreadCount } =
                    mailAcceptUsers && mailAcceptUsers.length
                      ? mailAcceptUsers.reduce(
                          (
                            result,
                            { accept_user_id, accept_user_name, accept_user_phone, status }
                          ) => {
                            if (+status) {
                              result.unreadCount += 1;
                            } else {
                              result.readCount += 1;
                            }
                            result.content.push(
                              <Col span={6} key={accept_user_id}>
                                <div className={styles.receiverWrapper}>
                                  <Avatar className={styles.avatar}>{accept_user_name[0]}</Avatar>
                                  <div className={styles.receiverInfoWrapper}>
                                    <div className={styles.receiverInfo}>
                                      <div className={styles.receiverName}>{accept_user_name}</div>
                                      <div className={styles.receiverPhone}>
                                        {accept_user_phone}
                                      </div>
                                    </div>
                                    <div className={styles.receiverStatus}>{`站内信${
                                      +status ? '未读' : '已读'
                                    }`}</div>
                                  </div>
                                </div>
                              </Col>
                            );
                            return result;
                          },
                          {
                            content: [],
                            readCount: 0,
                            unreadCount: 0,
                          }
                        )
                      : {
                          content: <Empty />,
                          readCount: 0,
                          unreadCount: 0,
                        };
                  return (
                    <Panel
                      header={
                        <div className={styles.message}>
                          <div className={styles.messageLeft}>
                            {moment(happenTime).format(FORMAT)}
                            &nbsp;&nbsp;
                            {GET_MESSAGE_CONTENT(item)}
                          </div>
                          <div className={styles.messageRight}>
                            站内信：
                            {`${readCount}人已读，${unreadCount}人未读`}
                          </div>
                        </div>
                      }
                      key={id}
                    >
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
                showQuickJumper
                showSizeChanger
                onChange={(pageNum, pageSize) => {
                  getMessageList(
                    {
                      pageNum,
                      pageSize,
                    },
                    (success, messageList) => {
                      if (success) {
                        setActiveKey((messageList.list[0] || {}).id);
                        setTimeout(() => {
                          window.scrollTo(
                            0,
                            document.querySelector('.work-order-message-card').offsetTop - 64
                          );
                        });
                      }
                    }
                  );
                }}
                onShowSizeChange={(_, pageSize) => {
                  getMessageList(
                    {
                      pageNum: 1,
                      pageSize,
                    },
                    (success, messageList) => {
                      if (success) {
                        setActiveKey((messageList.list[0] || {}).id);
                        setTimeout(() => {
                          window.scrollTo(
                            0,
                            document.querySelector('.work-order-message-card').offsetTop - 64
                          );
                        });
                      }
                    }
                  );
                }}
              />
            </Fragment>
          ) : (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          )}
        </Card>
        <NewVideoPlay
          style={{ zIndex: 9999, position: 'fixed' }}
          videoList={videoList}
          showList={true}
          handleVideoClose={() => {
            setVideo({
              visible: false,
              keyId: undefined,
            });
          }}
          {...video}
        />
        <ImagePreview {...image} />
      </PageHeaderLayout>
    );
  }
);
