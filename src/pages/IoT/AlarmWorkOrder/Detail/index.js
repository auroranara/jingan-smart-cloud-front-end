import React, { Component, Fragment } from 'react';
import { message, Card, Steps, Collapse, Row, Col, Avatar, Spin } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import DescriptionList from '@/components/DescriptionList';
import SelectOrSpan from '@/jingan-components/SelectOrSpan';
import ImagePreview from '@/jingan-components/ImagePreview';
import NewVideoPlay from '@/pages/BigPlatform/NewFireControl/section/NewVideoPlay';
import { connect } from 'dva';
import moment from 'moment';
import { isNumber } from '@/utils/utils';
import locales from '@/locales/zh-CN';
import {
  DEFAULT_FORMAT,
  STATUSES,
} from '../List';
import styles from './index.less';

const { Step } = Steps;
const { Description } = DescriptionList;
const { Panel } = Collapse;
const Empty = () => <span className={styles.empty}>暂无数据</span>;

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
    },
    loading: {
      effects: {
        [`${namespace}/getDetail`]: loading,
      },
    },
  } = state;
  return {
    detail,
    loading,
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
  };
})
export default class AlarmWorkOrderDetail extends Component {
  state = {
    images: null,
    currentImage: 0,
    videoVisible: false,
    videoKeyId: undefined,
    collapseActiveKey: '1',
  }

  componentDidMount() {
    const { getDetail } = this.props;
    getDetail();
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
    this.setState(({ collapseActiveKey: prevCollapseActiveKey }) => ({
      collapseActiveKey: collapseActiveKey.filter(v => v !== prevCollapseActiveKey)[0],
    }));
  }

  renderWorkOrderFlow() {
    // const {
    //   detail: {

    //   }={},
    // } = this.props;
    const steps = [
      {
        id: 1,
        title: '工单创建',
        description: moment('2019-12-13 08:55:49').format(DEFAULT_FORMAT),
      },
      {
        id: 2,
        title: '确认警情',
        description: (
          <Fragment>
            <div>真实警情</div>
            <div>李磊</div>
            <div>{moment('2019-12-13 09:05:49').format(DEFAULT_FORMAT)}</div>
          </Fragment>
        ),
      },
      {
        id: 3,
        title: '完成工单',
      },
    ];

    return (
      <Card className={styles.card} title="工单流程">
        <Steps current={1}>
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
        videoList=[],
        status,
        isReal,
        elapsedTime,
        elapsedTimeUnit,
        monitorObject,
        monitorEquipmentName,
        monitorTypeName,
        areaLocation,
        fileList,
        description,
      }={},
    } = this.props;
    const isFinished = +status === 2;

    return (
      <Card className={styles.card} title="工单信息">
        <DescriptionList className={styles.descriptionList} gutter={24}>
          <Description term="处理状态">
            {isNumber(status) ? (
              <div className={styles.statusContainer}>
                <div className={styles.status}>
                  <SelectOrSpan list={STATUSES} value={`${status}`} type="span" />
                </div>
                {isReal > 0 && <div className={styles.realAlarm}>真实警情</div>}
              </div>
            ) : <Empty />}
          </Description>
          {isFinished && (
            <Description term="耗时">
              {isNumber(elapsedTime) ? `${elapsedTime}${elapsedTimeUnit || 'min'}` : <Empty />}
            </Description>
          )}
          <Description term="监测对象">
            {monitorObject || <Empty />}
          </Description>
        </DescriptionList>
        <DescriptionList className={styles.descriptionList} gutter={24}>
          <Description term="监测设备名称">
            <div className={styles.nameWrapper}>
              <div className={styles.name}>{monitorEquipmentName || <Empty />}</div>
              {videoList && videoList.length > 0 && <div className={styles.videoWrapper}><div className={styles.video} onClick={this.showVideo} /></div>}
            </div>
          </Description>
          <Description term="监测类型">
            {monitorTypeName || <Empty />}
          </Description>
          <Description term="区域位置">
            {areaLocation || <Empty />}
          </Description>
        </DescriptionList>
        {isFinished && (
          <Fragment>
            <DescriptionList className={styles.descriptionList} gutter={24} col={1}>
              <Description term="现场照片">
                {fileList && fileList.length ? (
                  <div className={styles.imageContainer}>
                    {fileList.map(({ webUrl }, index) => (
                      <div className={styles.imageWrapper} key={index}>
                        <div
                          className={styles.image}
                          style={{
                            backgroundImage: `url(${webUrl})`,
                          }}
                          onClick={() => this.setState({ images: fileList.map(({ webUrl }) => webUrl), currentImage: index })}
                        />
                      </div>
                    ))}
                  </div>
                ) : <Empty />}
              </Description>
            </DescriptionList>
            <DescriptionList gutter={24} col={1}>
              <Description term="问题描述">
                {description || <Empty />}
              </Description>
            </DescriptionList>
          </Fragment>
        )}
      </Card>
    );
  }

  renderMessageNotification() {
    // const {
    //   detail: {

    //   }={},
    // } = this.props;
    const { collapseActiveKey } = this.state;

    return (
      <Card className={styles.card} title={<Fragment>消息通知<span className={styles.total}>（共3条）</span></Fragment>}>
        <Collapse className={styles.collapse} bordered={false} activeKey={collapseActiveKey} onChange={this.handleCollapseChange}>
          <Panel header={
            <div className={styles.message}>
              <div className={styles.messageLeft}>2019-12-13 08:11:11&nbsp;&nbsp;燃气浓度为 24%LEL，超过预警值 9%LEL</div>
              <div className={styles.messageRight}>站内信：2人已读，1人未读；短信共发送 2人</div>
            </div>
          } key="1">
            <Row gutter={24}>
              <Col span={6}>
                <div className={styles.receiverWrapper}>
                  <Avatar className={styles.avatar}>
                    李
                  </Avatar>
                  <div className={styles.receiverInfoWrapper}>
                    <div className={styles.receiverInfo}>
                      <div className={styles.receiverName}>李磊</div>
                      <div className={styles.receiverPhone}>131 1243 0900</div>
                    </div>
                    <div className={styles.receiverStatus}>站内信已读，短信已发</div>
                  </div>
                </div>
              </Col>
              <Col span={6}>
                <div className={styles.receiverWrapper}>
                  <Avatar className={styles.avatar}>
                    王
                  </Avatar>
                  <div className={styles.receiverInfoWrapper}>
                    <div className={styles.receiverInfo}>
                      <div className={styles.receiverName}>王林</div>
                      <div className={styles.receiverPhone}>131 9800 1276</div>
                    </div>
                    <div className={styles.receiverStatus}>站内信未读</div>
                  </div>
                </div>
              </Col>
              <Col span={6}>
                <div className={styles.receiverWrapper}>
                  <Avatar className={styles.avatar}>
                  朱
                  </Avatar>
                  <div className={styles.receiverInfoWrapper}>
                    <div className={styles.receiverInfo}>
                      <div className={styles.receiverName}>朱鹏</div>
                      <div className={styles.receiverPhone}>131 9789 2120</div>
                    </div>
                    <div className={styles.receiverStatus}>短信已发</div>
                  </div>
                </div>
              </Col>
              <Col span={6}>
                <div className={styles.receiverWrapper}>
                  <Avatar className={styles.avatar}>
                    李
                  </Avatar>
                  <div className={styles.receiverInfoWrapper}>
                    <div className={styles.receiverInfo}>
                      <div className={styles.receiverName}>李梅</div>
                      <div className={styles.receiverPhone}>131 2243 1980</div>
                    </div>
                    <div className={styles.receiverStatus}>站内信已读</div>
                  </div>
                </div>
              </Col>
            </Row>
          </Panel>
          <Panel header={
            <div className={styles.message}>
            <div className={styles.messageLeft}>2019-12-12 11:13:12&nbsp;&nbsp;报警解除（燃气浓度）</div>
            <div className={styles.messageRight}>站内信：3人已读；短信共发送 2人</div>
          </div>
          } key="2">
            <Row gutter={24}>
            <Col span={6}>
                <div className={styles.receiverWrapper}>
                  <Avatar className={styles.avatar}>
                    李
                  </Avatar>
                  <div className={styles.receiverInfoWrapper}>
                    <div className={styles.receiverInfo}>
                      <div className={styles.receiverName}>李磊</div>
                      <div className={styles.receiverPhone}>131 1243 0900</div>
                    </div>
                    <div className={styles.receiverStatus}>站内信已读，短信已发</div>
                  </div>
                </div>
              </Col>
              <Col span={6}>
                <div className={styles.receiverWrapper}>
                  <Avatar className={styles.avatar}>
                    王
                  </Avatar>
                  <div className={styles.receiverInfoWrapper}>
                    <div className={styles.receiverInfo}>
                      <div className={styles.receiverName}>王林</div>
                      <div className={styles.receiverPhone}>131 9800 1276</div>
                    </div>
                    <div className={styles.receiverStatus}>站内信已读</div>
                  </div>
                </div>
              </Col>
              <Col span={6}>
                <div className={styles.receiverWrapper}>
                  <Avatar className={styles.avatar}>
                  朱
                  </Avatar>
                  <div className={styles.receiverInfoWrapper}>
                    <div className={styles.receiverInfo}>
                      <div className={styles.receiverName}>朱鹏</div>
                      <div className={styles.receiverPhone}>131 9789 2120</div>
                    </div>
                    <div className={styles.receiverStatus}>短信已发</div>
                  </div>
                </div>
              </Col>
              <Col span={6}>
                <div className={styles.receiverWrapper}>
                  <Avatar className={styles.avatar}>
                    李
                  </Avatar>
                  <div className={styles.receiverInfoWrapper}>
                    <div className={styles.receiverInfo}>
                      <div className={styles.receiverName}>李梅</div>
                      <div className={styles.receiverPhone}>131 2243 1980</div>
                    </div>
                    <div className={styles.receiverStatus}>站内信已读</div>
                  </div>
                </div>
              </Col>
            </Row>
          </Panel>
          <Panel header={
            <div className={styles.message}>
            <div className={styles.messageLeft}>2019-12-12 08:55:49&nbsp;&nbsp;燃气浓度为 35%LEL，超过报警值 10%LEL</div>
            <div className={styles.messageRight}>站内信：1人已读，2人未读；短信共发送 2人</div>
          </div>
          } key="3">
            <Row gutter={24}>
            <Col span={6}>
                <div className={styles.receiverWrapper}>
                  <Avatar className={styles.avatar}>
                    李
                  </Avatar>
                  <div className={styles.receiverInfoWrapper}>
                    <div className={styles.receiverInfo}>
                      <div className={styles.receiverName}>李磊</div>
                      <div className={styles.receiverPhone}>131 1243 0900</div>
                    </div>
                    <div className={styles.receiverStatus}>站内信已读，短信已发</div>
                  </div>
                </div>
              </Col>
              <Col span={6}>
                <div className={styles.receiverWrapper}>
                  <Avatar className={styles.avatar}>
                    王
                  </Avatar>
                  <div className={styles.receiverInfoWrapper}>
                    <div className={styles.receiverInfo}>
                      <div className={styles.receiverName}>王林</div>
                      <div className={styles.receiverPhone}>131 9800 1276</div>
                    </div>
                    <div className={styles.receiverStatus}>站内信未读</div>
                  </div>
                </div>
              </Col>
              <Col span={6}>
                <div className={styles.receiverWrapper}>
                  <Avatar className={styles.avatar}>
                  朱
                  </Avatar>
                  <div className={styles.receiverInfoWrapper}>
                    <div className={styles.receiverInfo}>
                      <div className={styles.receiverName}>朱鹏</div>
                      <div className={styles.receiverPhone}>131 9789 2120</div>
                    </div>
                    <div className={styles.receiverStatus}>短信已发</div>
                  </div>
                </div>
              </Col>
              <Col span={6}>
                <div className={styles.receiverWrapper}>
                  <Avatar className={styles.avatar}>
                    李
                  </Avatar>
                  <div className={styles.receiverInfoWrapper}>
                    <div className={styles.receiverInfo}>
                      <div className={styles.receiverName}>李梅</div>
                      <div className={styles.receiverPhone}>131 2243 1980</div>
                    </div>
                    <div className={styles.receiverStatus}>站内信未读</div>
                  </div>
                </div>
              </Col>
            </Row>
          </Panel>
        </Collapse>
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
        style={{ zIndex: 9999 }}
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
