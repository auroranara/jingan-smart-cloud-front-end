import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form,
  List,
  Spin,
  Card,
  Button,
  Popconfirm,
  Input,
  message,
  BackTop,
  // modal,
  Col,
  Row,
} from 'antd';
import { Link } from 'dva/router';
import Ellipsis from '@/components/Ellipsis';
import InfiniteScroll from 'react-infinite-scroller';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';

import styles from './MonitorPointsList.less';

// const { confirm } = modal;
const FormItem = Form.Item;

const title = '监测点';

//面包屑
const breadcrumbList = [
  {
    title: '首页',
    name: '首页',
    href: '/',
  },
  {
    title: '安防管理',
    name: '安防管理',
  },
  {
    title: '出入口监测',
    name: '出入口监测',
    href: '/security-manage/entrance-and-exit-monitor/company-list',
  },
  {
    title,
    name: '监测点',
  },
];

// 默认页面显示数量
const pageSize = 18;

// 默认表单值
const defaultFormData = {
  monitorDotName: undefined,
  number: undefined,
};

/* 获取无数据 */
const getEmptyData = () => {
  return <span style={{ color: 'rgba(0,0,0,0.45)' }}>暂无数据</span>;
};

@connect(({ securityManage, user, loading }) => ({
  securityManage,
  user,
  loading: loading.models.securityManage,
}))
@Form.create()
export default class MonitorPointsList extends PureComponent {
  constructor(props) {
    super(props);
    this.formData = defaultFormData;
    this.state = {};
  }

  // 生命周期函数
  componentDidMount() {
    const {
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;
    // 获取设备列表
    dispatch({
      type: 'securityManage/fetchMonitorDotList',
      payload: {
        monitorSceneId: id,
        pageSize,
        pageNum: 1,
      },
    });
  }

  /* 查询按钮点击事件 */
  handleClickToQuery = () => {
    const {
      dispatch,
      form: { getFieldsValue },
      match: {
        params: { id },
      },
    } = this.props;
    const data = getFieldsValue();
    // 重新请求数据
    dispatch({
      type: 'securityManage/fetchMonitorDotList',
      payload: {
        monitorSceneId: id,
        pageSize,
        pageNum: 1,
        ...data,
      },
    });
  };

  /* 重置按钮点击事件 */
  handleClickToReset = () => {
    const {
      dispatch,
      form: { resetFields },
      match: {
        params: { id },
      },
    } = this.props;
    // 清除筛选条件
    resetFields();
    // 重新请求数据
    dispatch({
      type: 'securityManage/fetchMonitorDotList',
      payload: {
        monitorSceneId: id,
        pageSize,
        pageNum: 1,
      },
    });
  };

  // 加载
  handleLoadMore = () => {
    const {
      dispatch,
      securityManage: { isLast },
      location: {
        query: { faceDataBaseId },
      },
    } = this.props;
    if (isLast) {
      return;
    }
    const {
      securityManage: { pageNum },
    } = this.props;
    // 请求数据
    dispatch({
      type: 'securityManage/fetchMonitorDotListMore',
      payload: {
        monitorSceneId: faceDataBaseId,
        pageSize,
        pageNum: pageNum + 1,
        ...this.formData,
      },
    });
  };

  // 删除
  handleDelete = id => {
    const {
      dispatch,
      match: {
        params: { id: monitorSceneId },
      },
    } = this.props;
    dispatch({
      type: 'securityManage/fetchMonitorDotDelete',
      payload: { id: id },
      success: () => {
        // 获取列表
        dispatch({
          type: 'securityManage/fetchMonitorDotList',
          payload: {
            monitorSceneId,
            pageSize,
            pageNum: 1,
          },
        });
        message.success('删除成功！');
      },
      error: () => {
        message.error('删除失败!');
      },
    });
  };

  /* 渲染form表单 */
  renderForm() {
    const {
      form: { getFieldDecorator },
      match: {
        params: { id },
      },
      location: {
        query: { companyName, faceDataBaseId },
      },
    } = this.props;

    return (
      <Card>
        <Form layout="inline">
          <FormItem>
            {getFieldDecorator('monitorDotName', {
              getValueFromEvent: e => e.target.value.trim(),
            })(<Input placeholder="请输入名称" />)}
          </FormItem>
          <FormItem>
            {getFieldDecorator('monitorDotPlace', {
              getValueFromEvent: e => e.target.value.trim(),
            })(<Input placeholder="请输入位置" />)}
          </FormItem>
          <FormItem>
            {getFieldDecorator('number', {
              getValueFromEvent: e => e.target.value.trim(),
            })(<Input placeholder="请输入摄像机编号" />)}
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
            <Button
              type="primary"
              href={`#/security-manage/entrance-and-exit-monitor/monitoring-points-add?id=${id}&&faceDataBaseId=${faceDataBaseId}&&companyName=${companyName}`}
            >
              新增监测点
            </Button>
          </FormItem>
        </Form>
      </Card>
    );
  }

  /* 渲染列表 */
  renderList() {
    const {
      securityManage: {
        monitorDotData: { list },
      },
      match: {
        params: { id: monitorSceneId },
      },
      location: {
        query: { companyName, faceDataBaseId },
      },
    } = this.props;

    return (
      <div className={styles.cardList} style={{ marginTop: '24px' }}>
        <List
          rowKey="id"
          grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
          dataSource={list}
          renderItem={item => {
            const { id, monitorDotName, monitorDotPlace, videoCameras } = item;
            const number = videoCameras.map(item => item.number).join(',');
            return (
              <List.Item key={id}>
                <Card
                  title={monitorDotName}
                  className={styles.card}
                  actions={[
                    <Link
                      to={`/security-manage/entrance-and-exit-monitor/monitoring-points-detail/${id}?monitorSceneId=${monitorSceneId}&&faceDataBaseId=${faceDataBaseId}&&companyName=${companyName}`}
                      target="_blank"
                    >
                      查看
                    </Link>,
                    <Link
                      to={`/security-manage/entrance-and-exit-monitor/monitoring-points-edit/${id}?id=${monitorSceneId}&&faceDataBaseId=${faceDataBaseId}&&companyName=${companyName}`}
                      target="_blank"
                    >
                      编辑
                    </Link>,
                    <Popconfirm
                      title="确认要删除该监测点吗？"
                      onConfirm={() => this.handleDelete(id)}
                    >
                      <span>删除</span>
                    </Popconfirm>,
                  ]}
                >
                  <Row>
                    <Col span={16}>
                      <Ellipsis tooltip lines={1} className={styles.ellipsisText}>
                        位置:
                        {monitorDotPlace || getEmptyData()}
                      </Ellipsis>
                      <Ellipsis tooltip lines={1} className={styles.ellipsisText}>
                        摄像机编号：
                        {number || getEmptyData()}
                      </Ellipsis>
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
      location: {
        query: { companyName },
      },
      securityManage: {
        isLast,
        monitorDotData: { list },
      },
    } = this.props;

    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
        content={
          <div>
            <p>{companyName}</p>
            <p>
              监测点总数：
              {list.length}
            </p>
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
