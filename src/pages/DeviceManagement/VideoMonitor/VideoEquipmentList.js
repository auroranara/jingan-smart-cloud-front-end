import React, { PureComponent } from 'react';
import { connect, Link } from 'dva';
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
  Switch,
} from 'antd';
import { routerRedux } from 'dva/router';
import InfiniteScroll from 'react-infinite-scroller';

import Ellipsis from '@/components/Ellipsis';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';

import styles from './VideoEquipmentList.less';
import codesMap from '@/utils/codes';
import { hasAuthority, AuthButton, AuthLink } from '@/utils/customAuth';
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
    });
  }

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
      type: 'videoMonitor/fetchEquipmentList',
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
            const { id, deviceId, keyId, isInfiniteScroll } = item;
            return (
              <List.Item key={id}>
                <Card
                  title={item.name}
                  className={styles.card}
                  // actions={[
                  //   <Link to={`/device-management/video-monitor/detail/${item.id}`}>查看</Link>,
                  //   <AuthLink
                  //     code={codesMap.deviceManagement.videoMonitor.edit}
                  //     codes={codes}
                  //     to={`/device-management/video-monitor/edit/${item.id}`}
                  //   >
                  //     编辑
                  //   </AuthLink>,
                  // ]}
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
                        <Switch checkedChildren="是" unCheckedChildren="否" />
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
                      <span className={styles.quantity} />
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
        videoData: {
          list: { companyName },
        },
        isLast,
      },
    } = this.props;

    return (
      <PageHeaderLayout
        title={companyName}
        breadcrumbList={breadcrumbList}
        content={
          <div>
            <span>
              视频总数：
              {/* {vedioCount} */}
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
