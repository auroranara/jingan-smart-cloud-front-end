import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form,
  List,
  Card,
  Button,
  // Icon,
  Input,
  // Modal,
  message,
  BackTop,
  Spin,
  Col,
  Row,
} from 'antd';
import { routerRedux } from 'dva/router';
import InfiniteScroll from 'react-infinite-scroller';

import Ellipsis from '@/components/Ellipsis';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';

import styles from './VideoMonitorList.less';
import codesMap from '@/utils/codes';
import { hasAuthority, AuthButton } from '@/utils/customAuth';
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
  },
];

// 默认页面显示数量
const pageSize = 18;
// 默认表单值
const defaultFormData = {
  name: undefined,
  practicalAddress: undefined,
};

/* 获取无数据 */
const getEmptyData = () => {
  return <span style={{ color: 'rgba(0,0,0,0.45)' }}>暂无数据</span>;
};
let videoTotal = 0;
@connect(({ videoMonitor, user, loading }) => ({
  videoMonitor,
  user,
  loading: loading.models.videoMonitor,
}))
@Form.create()
export default class VideoMonitorList extends PureComponent {
  constructor(props) {
    super(props);
    this.formData = defaultFormData;
  }
  // 生命周期函数
  componentDidMount() {
    const { dispatch } = this.props;
    // 获取视频单位列表
    dispatch({
      type: 'videoMonitor/fetchCompanyList',
      payload: {
        pageSize,
        pageNum: 1,
      },
      callback: response => {
        // console.log('res', res);
        videoTotal = response.videoCount;
      },
    });
  }

  // 跳转到视频设备列表
  goToEquipmentList = id => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push(`/device-management/video-monitor/video-equipment/${id}`));
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
      type: 'videoMonitor/fetchCompanyList',
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
      type: 'videoMonitor/fetchCompanyList',
      payload: {
        pageSize,
        pageNum: 1,
      },
    });
  };

  /* 滚动加载 */
  handleLoadMore = () => {
    const {
      videoMonitor: { isLast },
    } = this.props;
    if (isLast) {
      return;
    }
    const {
      videoMonitor: { pageNum },
    } = this.props;
    // 请求数据
    this.props.dispatch({
      type: 'videoMonitor/appendCompanyList',
      payload: {
        pageSize,
        pageNum: pageNum + 1,
        ...this.formData,
      },
    });
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
            })(<Input placeholder="请输入单位名称" />)}
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
    const {
      videoMonitor: { list },
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
            const { id, practicalAddress, safetyName, safetyPhone, videoCount } = item;
            return (
              <List.Item key={id}>
                <Card title={item.name} className={styles.card}>
                  <Row>
                    <Col span={16}>
                      <Ellipsis tooltip lines={1} className={styles.ellipsisText}>
                        地址：
                        {practicalAddress || getEmptyData()}
                      </Ellipsis>
                      <Ellipsis tooltip lines={1} className={styles.ellipsisText}>
                        安全负责人：
                        {safetyName || getEmptyData()}
                      </Ellipsis>
                      <p>
                        联系电话：
                        {safetyPhone || getEmptyData()}
                      </p>
                    </Col>
                    <Col
                      span={8}
                      onClick={() => {
                        if (hasAuthority(codesMap.deviceManagement.videoMonitor.view, codes))
                          this.goToEquipmentList(id);
                        else message.warn('您没有权限访问对应页面');
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      <span className={styles.quantity}>{videoCount}</span>
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
        data: {
          pagination: { total },
          videoCount,
        },
        isLast,
      },
    } = this.props;

    return (
      <PageHeaderLayout
        title="视频监控"
        breadcrumbList={breadcrumbList}
        content={
          <div>
            <span>
              单位总数：
              {total}
              {''}
            </span>
            <span style={{ paddingLeft: 20 }}>
              视频总数：
              {videoCount}
              {''}
            </span>
          </div>
        }
      >
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
      </PageHeaderLayout>
    );
  }
}
