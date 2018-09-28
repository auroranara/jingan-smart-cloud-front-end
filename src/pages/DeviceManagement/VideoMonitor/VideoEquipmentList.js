import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, List, Card, Button, Input, BackTop, Spin, Col, Row, Switch } from 'antd';
import InfiniteScroll from 'react-infinite-scroller';
import Ellipsis from '@/components/Ellipsis';
import codesMap from '@/utils/codes';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import {
  // hasAuthority,
  AuthButton,
  AuthLink,
} from '@/utils/customAuth';

import styles from './VideoEquipmentList.less';
import VideoPlay from '../../BigPlatform/FireControl/section/VideoPlay';

import videoIcon from './videoIcon.png';

const FormItem = Form.Item;

//面包屑
const breadcrumbList = [
  {
    title: '首页',
    name: '首页',
    href: '/',
  },
  {
    title: '设备管理',
    name: '设备管理',
  },
  {
    title: '视频监控',
    name: '视频监控',
    href: '/device-management/video-monitor/list',
  },
  {
    title: '视频监控列表',
    name: '视频监控列表',
  },
];

// 默认页面显示数量
const pageSize = 18;
// 默认表单值
const defaultFormData = {
  name: undefined,
};

/* 获取无数据 */
const getEmptyData = () => {
  return <span style={{ color: 'rgba(0,0,0,0.45)' }}>暂无数据</span>;
};

@connect(({ videoMonitor, user, loading }) => ({
  videoMonitor,
  user,
  loading: loading.models.videoMonitor,
}))
@Form.create()
export default class VideoEquipmentList extends PureComponent {
  constructor(props) {
    super(props);
    this.formData = defaultFormData;
  }

  state = {
    total: 0,
    videoVisible: false,
    keyId: undefined,
  };

  // 生命周期函数
  componentDidMount() {
    const {
      dispatch,
      match: {
        params: { companyId },
      },
    } = this.props;
    // 获取视频设备列表
    dispatch({
      type: 'videoMonitor/fetchEquipmentList',
      payload: {
        companyId,
        pageSize,
        pageNum: 1,
      },
      callback: list => {
        if (list.length === 0) return;
        let total = 0;
        const generateTotal = arr => {
          for (const list of arr) {
            total++;
            if (Array.isArray(list)) generateTotal(list);
          }
        };
        generateTotal(list);
        this.setState({ total });
      },
    });
  }

  //
  switchOnChange = checked => {
    this.setState({});
  };
  /* 查询按钮点击事件 */
  handleClickToQuery = () => {
    const {
      form: { getFieldsValue },
    } = this.props;
    const data = getFieldsValue();
    // 修改表单数据
    this.formData = data;
    // 重新请求数据
    this.props.dispatch({
      type: 'videoMonitor/fetchEquipmentList',
      payload: {
        pageSize,
        pageNum: 1,
        ...data,
      },
    });
  };

  /* 重置按钮点击事件 */
  handleClickToReset = () => {
    const {
      form: { resetFields },
    } = this.props;
    // 清除筛选条件
    resetFields();
    // 修改表单数据
    this.formData = defaultFormData;
    // 重新请求数据
    this.props.dispatch({
      type: 'videoMonitor/fetchEquipmentList',
      payload: {
        pageSize,
        pageNum: 1,
      },
    });
  };

  /* 滚动加载 */
  handleLoadMore = () => {
    // const {
    //   videoMonitor: { isLast },
    // } = this.props;
    // if (isLast) {
    //   return;
    // }
    // const {
    //   videoMonitor: { pageNum },
    // } = this.props;
    // // 请求数据
    // this.props.dispatch({
    //   type: 'videoMonitor/fetchEquipmentList',
    //   payload: {
    //     pageSize,
    //     pageNum: pageNum + 1,
    //     ...this.formData,
    //   },
    // });
  };

  // 显示视频模态框
  videoOnClick = keyId => {
    this.setState({ videoVisible: true, keyId: keyId });
  };

  // 关闭视频模态框
  handleVideoClose = () => {
    this.setState({ videoVisible: false, keyId: undefined });
  };

  /* 渲染form表单 */
  renderForm() {
    const {
      form: { getFieldDecorator },
      user: {
        currentUser: { permissionCodes: codes },
      },
    } = this.props;

    return (
      <Card>
        <Form layout="inline">
          <FormItem>
            {getFieldDecorator('name', {
              initialValue: defaultFormData.name,
              getValueFromEvent: e => e.target.value.trim(),
            })(<Input placeholder="请输入视频所属区域" />)}
          </FormItem>
          <FormItem>
            <Button type="primary" onClick={this.handleClickToQuery}>
              查询
            </Button>
          </FormItem>
          <FormItem>
            <Button onClick={this.handleClickToReset}>重置</Button>
          </FormItem>
          <FormItem style={{ float: 'right' }}>
            <AuthButton
              code={codesMap.deviceManagement.videoMonitor.add}
              codes={codes}
              type="primary"
              href="#/device-management/video-monitor/add"
            >
              新增视频
            </AuthButton>
          </FormItem>
        </Form>
      </Card>
    );
  }

  /* 渲染列表 */
  renderList() {
    // const {popconfirmVisible}
    const {
      videoMonitor: {
        videoData: { list },
      },
      user: {
        currentUser: { permissionCodes: codes },
      },
    } = this.props;

    return (
      <div className={styles.cardList} style={{ marginTop: '24px' }}>
        <List
          rowKey="id"
          grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
          dataSource={list}
          renderItem={item => {
            const { id, deviceId, keyId, isInspection } = item;
            return (
              <List.Item key={id}>
                <Card
                  title={item.name}
                  className={styles.card}
                  actions={[
                    <AuthLink
                      code={codesMap.deviceManagement.videoMonitor.view}
                      codes={codes}
                      to={`/device-management/video-monitor/detail/${item.id}`}
                    >
                      查看
                    </AuthLink>,
                    <AuthLink
                      code={codesMap.deviceManagement.videoMonitor.edit}
                      codes={codes}
                      to={`/device-management/video-monitor/edit/${item.id}`}
                    >
                      编辑
                    </AuthLink>,
                  ]}
                >
                  <Row>
                    <Col span={16}>
                      <Ellipsis tooltip lines={1} className={styles.ellipsisText}>
                        设备ID:
                        {deviceId || getEmptyData()}
                      </Ellipsis>
                      <Ellipsis tooltip lines={1} className={styles.ellipsisText}>
                        摄像头ID：
                        {keyId || getEmptyData()}
                      </Ellipsis>
                      <p>
                        是否用于查岗：
                        <Switch
                          checked={isInspection === 1}
                          checkedChildren="是"
                          unCheckedChildren="否"
                          onChange={this.switchOnChange}
                        />
                      </p>
                    </Col>
                    <Col span={8} style={{ cursor: 'pointer' }}>
                      <span
                        onClick={() => {
                          this.videoOnClick(keyId);
                        }}
                        className={styles.quantity}
                        style={{ backgroundImage: `url(${videoIcon})` }}
                      />
                    </Col>
                  </Row>
                </Card>
              </List.Item>
            );
          }}
        />
      </div>
    );
  }

  render() {
    const {
      loading,
      videoMonitor: {
        videoData: { list },
        isLast,
      },
    } = this.props;
    const { total, videoVisible, keyId } = this.state;

    const content =
      list && list.length ? (
        <span>
          视频总数：
          {total}
        </span>
      ) : (
        <span>视频总数：0</span>
      );

    return (
      <PageHeaderLayout title={list.companyName} breadcrumbList={breadcrumbList} content={content}>
        <BackTop />
        {this.renderForm()}
        <InfiniteScroll
          initialLoad={false}
          pageStart={0}
          loadMore={() => {
            // 防止多次加载
            !loading && this.handleLoadMore();
          }}
          hasMore={!isLast}
          loader={
            <div className="loader" key={0}>
              {loading && (
                <div style={{ paddingTop: '50px', textAlign: 'center' }}>
                  <Spin />
                </div>
              )}
            </div>
          }
        >
          {this.renderList()}
        </InfiniteScroll>
        <VideoPlay
          visible={videoVisible}
          showList={false}
          videoList={[]}
          keyId={keyId}
          handleVideoClose={this.handleVideoClose}
        />
      </PageHeaderLayout>
    );
  }
}
