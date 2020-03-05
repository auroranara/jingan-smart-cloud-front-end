import React, { Component, Fragment } from 'react';
import { Icon as LegacyIcon } from '@ant-design/compatible';
import { Spin, message, List, Card } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import { connect } from 'dva';
import router from 'umi/router';
import moment from 'moment';
import {
  MAJOR_HAZARD_URL,
  STORAGE_AREA_DETAIL_URL,
} from '../../URLS';
import iconStorageArea from '../../imgs/icon-storage-area.png';
import iconAddress from '../../imgs/icon-address.png';
import iconIsMajorHazard from '../../imgs/icon-is-major-hazard.png';
import styles from './index.less';

const TITLE = '库区实时监测';
const DELAY = 1 * 60 * 1000;
const BREADCRUMB_LIST = [
  {
    title: '首页',
    name: '首页',
    href: '/',
  },
  {
    title: '物联网监测',
    name: '物联网监测',
  },
  {
    title: '重大危险源监测',
    name: '重大危险源监测',
    href: MAJOR_HAZARD_URL,
  },
  {
    title: TITLE,
    name: TITLE,
  },
];
const TABS = [
  {
    key: '0',
    tab: '全部库区',
  },
  {
    key: '1',
    tab: '报警库区',
  },
  {
    key: '2',
    tab: '正常库区',
  },
];
const STATUS_MAPPER = [undefined, 1, 0];
const DEFAULT_FORMAT = 'YYYY-MM-DD HH:mm:ss';
const GET_STORAGE_AREA_LIST = 'majorHazardMonitor/getStorageAreaList';

@connect(({
  user,
  majorHazardMonitor,
}) => ({
  user,
  majorHazardMonitor,
}), dispatch => ({
  getStorageAreaList(payload, callback) {
    dispatch({
      type: GET_STORAGE_AREA_LIST,
      payload,
      callback(success, data) {
        if (!success) {
          message.error('获取库区实时监测数据失败，请稍后重试或联系管理人员！');
        }
        callback && callback(success, data);
      },
    });
  },
}))
export default class StorageAreaRealTime extends Component {
  state = {
    tabActiveKey: TABS[0].key,
    loading: false,
  }

  realTimer = null;

  componentDidMount() {
    this.handleTabChange(TABS[0].key);
  }

  componentWillUnmount() {
    this.clearRealTimer();
  }

  getStorageAreaList = () => {
    const { getStorageAreaList } = this.props;
    const { tabActiveKey } = this.state;
    getStorageAreaList({
      status: STATUS_MAPPER[tabActiveKey],
    }, () => {
      this.setState({
        loading: false,
      });
    });
  }

  setRealTimer = () => {
    setTimeout(() => {
      this.getStorageAreaList();
      this.setRealTimer();
    }, DELAY);
  }

  clearRealTimer = () => {
    clearTimeout(this.realTimer);
  }

  handleTabChange = (tabActiveKey) => {
    this.setState({
      tabActiveKey,
      loading: true,
    }, this.getStorageAreaList);
    this.clearRealTimer();
    this.setRealTimer();
  }

  renderParamValue = ({ value, normalUpper, largeUpper }) => {
    const over = value >= normalUpper || value >= largeUpper;
    return (
      <Fragment>
        <div className={styles.paramValue} style={{ color: over && '#f5222d' }}>{typeof value === 'number' ? value : '--'}</div>
        {over && (
          <div className={styles.paramTrendWrapper}>
            <LegacyIcon className={styles.paramTrendIcon} type="caret-up" style={{ color: '#f5222d' }} />
            <div className={styles.paramTrendValue} style={{ color: '#f5222d' }}>{value >= largeUpper ? value - largeUpper : value - normalUpper}</div>
            <div className={styles.paramTrendDescription}>{value >= largeUpper ? '超过报警阈值' : '超过预警阈值'}</div>
          </div>
        )}
      </Fragment>
    );
  }

  render() {
    const {
      majorHazardMonitor: {
        storageAreaList=[],
      },
    } = this.props;
    const { tabActiveKey, loading } = this.state;

    return (
      <PageHeaderLayout
        className={styles.container}
        title={TITLE}
        breadcrumbList={BREADCRUMB_LIST}
        tabList={TABS}
        tabActiveKey={tabActiveKey}
        onTabChange={this.handleTabChange}
      >
        <List
          grid={{ gutter: 24, column: 1 }}
          dataSource={storageAreaList}
          loading={loading && {
            wrapperClassName: styles.spinContainer,
          }}
          footer={loading && (
            <div className={styles.spinWrapper}>
              <Spin tip="加载中..." />
            </div>
          )}
          renderItem={({
            id,
            name,
            address,
            storage,
            status,
            isMajorHazard,
            params=[],
          }) => (
            <List.Item>
              <Card hoverable onClick={() => router.push(`${STORAGE_AREA_DETAIL_URL}/${id}`)}>
                <div className={styles.top} style={{ backgroundImage: `url(${iconStorageArea})` }}>
                  <div className={styles.nameWrapper}>
                    <div className={styles.name}>{name}</div>
                    {status > 0 && <div className={styles.alarmMarker}>报警</div>}
                    {isMajorHazard > 0 && <div className={styles.majorHazard} style={{ backgroundImage: `url(${iconIsMajorHazard})` }}>构成重大危险源</div>}
                  </div>
                  <div className={styles.address} style={{ backgroundImage: `url(${iconAddress})` }}>{address}</div>
                </div>
                <div className={styles.bottom}>
                  <div className={styles.params}>
                    {params && params.map(({ id, name, unit, value, address, normalUpper, largeUpper, updateTime }) => (
                      <div className={styles.param} key={id}>
                        <div className={styles.paramName}>{`${name}（${unit}）`}</div>
                        <div className={styles.paramValueWrapper}>{this.renderParamValue({ value, normalUpper, largeUpper })}</div>
                        <div className={styles.paramUpdateTime}>
                          <div className={styles.label}>最近更新时间：</div>
                          <div>{updateTime && moment(updateTime).format(DEFAULT_FORMAT)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </List.Item>
          )}
        />
      </PageHeaderLayout>
    );
  }
}
