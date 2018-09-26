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
import { AuthButton, hasAuthority } from '@/utils/customAuth';

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
    // const { fetch } = this.props;
    // // 获取视频单位列表
    // fetch({
    //   payload: {
    //     pageSize,
    //     pageNum: 1,
    //   },
    // });
  }

  /* 查询按钮点击事件 */
  handleClickToQuery = () => {
    const {
      // fetch,
      form: { getFieldsValue },
    } = this.props;
    const data = getFieldsValue();
    // 修改表单数据
    this.formData = data;
    // 重新请求数据
    // fetch({
    //   payload: {
    //     pageSize,
    //     pageNum: 1,
    //     ...data,
    //   },
    // });
  };

  /* 重置按钮点击事件 */
  handleClickToReset = () => {
    const {
      // fetch,
      form: { resetFields },
    } = this.props;
    // 清除筛选条件
    resetFields();
    // 修改表单数据
    this.formData = defaultFormData;
    // 重新请求数据
    // fetch({
    //   payload: {
    //     pageSize,
    //     pageNum: 1,
    //   },
    // });
  };

  /* 滚动加载 */
  handleLoadMore = flag => {
    const {
      videoMonitor: { isLast },
    } = this.props;
    if (!flag || isLast) {
      return;
    }
    // const {
    //   appendFetch,
    //   videoMonitor: { pageNum },
    // } = this.props;
    // // 请求数据
    // appendFetch({
    //   payload: {
    //     pageSize,
    //     pageNum: pageNum + 1,
    //     ...this.formData,
    //   },
    // });
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
      goToService,
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
          renderItem={item => (
            <List.Item key={item.id}>
              <Card title={item.name} className={styles.card}>
                <Row>
                  <Col span={16} style={{ cursor: 'pointer' }}>
                    <Ellipsis tooltip lines={1} className={styles.ellipsisText}>
                      地址：
                      {item.practicalAddress || getEmptyData()}
                    </Ellipsis>
                    <Ellipsis tooltip lines={1} className={styles.ellipsisText}>
                      主要负责人：
                      {item.principalName || getEmptyData()}
                    </Ellipsis>
                    <p>
                      联系电话：
                      {item.principalPhone || getEmptyData()}
                    </p>
                  </Col>
                  <Col
                    span={8}
                    onClick={() => {
                      if (hasAuthority(codesMap.videoMonitor.serviceDetail, codes))
                        goToService(`/fire-control/maintenance-company/serviceList/${item.id}`);
                      else message.warn('您没有权限访问对应页面');
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <span className={styles.quantity}>{item.serviceCompanyCount}</span>
                  </Col>
                </Row>
              </Card>
            </List.Item>
          )}
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
        },
        list,
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
              {total}
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
