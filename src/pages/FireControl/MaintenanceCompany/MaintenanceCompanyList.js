import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form,
  List,
  Card,
  Button,
  Icon,
  Input,
  Modal,
  message,
  BackTop,
  Spin,
  Col,
  Row,
} from 'antd';
import { Link, routerRedux } from 'dva/router';
import VisibilitySensor from 'react-visibility-sensor';

import Ellipsis from 'components/Ellipsis';
import PageHeaderLayout from '../../layouts/PageHeaderLayout.js';

import styles from './MaintenanceCompanyList.less';

const FormItem = Form.Item;

// 默认页面显示数量
const pageSize = 18;
// 默认表单值
const defaultFormData = {
  name: undefined,
  practicalAddress: undefined,
};

@connect(
  ({ maintenanceCompany, loading }) => ({
    maintenanceCompany,
    loading: loading.models.maintenanceCompany,
  }),
  dispatch => ({
    // 维保单位列表
    fetch(action) {
      dispatch({
        type: 'maintenanceCompany/fetch',
        ...action,
      });
    },
    // 查询维保单位
    appendFetch(action) {
      dispatch({
        type: 'maintenanceCompany/appendFetch',
        ...action,
      });
    },
    // 删除维保单位
    remove(action) {
      dispatch({
        type: 'maintenanceCompany/remove',
        ...action,
      });
    },
    // 跳转到维保单位详情页
    goToDetail(url) {
      dispatch(routerRedux.push(url));
    },
    // 跳转到服务单位列表页
    goToService(url) {
      dispatch(routerRedux.push(url));
    },
  })
)
@Form.create()
export default class MaintenanceCompanyList extends PureComponent {
  constructor(props) {
    super(props);
    this.formData = defaultFormData;
  }
  // 生命周期函数
  componentDidMount() {
    const { fetch } = this.props;
    // 获取维保单位列表
    fetch({
      payload: {
        pageSize,
        pageNum: 1,
      },
    });
  }

  /* 显示删除确认提示框 */
  handleShowDeleteConfirm = id => {
    const { remove } = this.props;
    Modal.confirm({
      title: '你确定要删除这个维保单位吗?',
      content: '如果你确定要删除这个维保单位，点击确定按钮',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        remove({
          payload: {
            id,
          },
          callback: res => {
            if (res.code === 200) {
              message.success('删除成功！');
            } else {
              message.error('删除失败，该维保单位正为企业服务中！');
            }
          },
        });
      },
    });
  };

  /* 查询按钮点击事件 */
  handleClickToQuery = () => {
    const {
      fetch,
      form: { getFieldsValue },
    } = this.props;
    const data = getFieldsValue();
    // 修改表单数据
    this.formData = data;
    // 重新请求数据
    fetch({
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
      fetch,
      form: { resetFields },
    } = this.props;
    // 清除筛选条件
    resetFields();
    // 修改表单数据
    this.formData = defaultFormData;
    // 重新请求数据
    fetch({
      payload: {
        pageSize,
        pageNum: 1,
      },
    });
  };

  /* 滚动加载 */
  handleLoadMore = flag => {
    const {
      maintenanceCompany: { isLast },
    } = this.props;
    if (!flag || isLast) {
      return;
    }
    const {
      appendFetch,
      maintenanceCompany: { pageNum },
    } = this.props;
    // 请求数据
    appendFetch({
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
            {getFieldDecorator('practicalAddress', {
              initialValue: defaultFormData.practicalAddress,
              getValueFromEvent: e => e.target.value.trim(),
            })(<Input placeholder="请输入单位地址" />)}
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
            <Button type="primary" href="#/fire-control/maintenance-company/add">
              新增
            </Button>
          </FormItem>
        </Form>
      </Card>
    );
  }

  /* 渲染列表 */
  renderList() {
    const {
      maintenanceCompany: { list },
      goToDetail,
      goToService,
    } = this.props;

    return (
      <div className={styles.cardList} style={{ marginTop: '24px' }}>
        <List
          rowKey="id"
          grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
          dataSource={list}
          renderItem={item => (
            <List.Item key={item.id}>
              <Card
                title={item.name}
                className={styles.card}
                actions={[
                  <Link to={`/fire-control/maintenance-company/detail/${item.id}`}>查看</Link>,
                  <Link to={`/fire-control/maintenance-company/edit/${item.id}`}>编辑</Link>,
                ]}
                extra={
                  <Button
                    onClick={() => {
                      this.handleShowDeleteConfirm(item.id);
                    }}
                    shape="circle"
                    style={{ border: 'none', fontSize: '20px' }}
                  >
                    <Icon type="close" />
                  </Button>
                }
              >
                <Row>
                  <Col
                    span={16}
                    onClick={() => {
                      goToDetail(`/fire-control/maintenance-company/detail/${item.id}`);
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <Ellipsis tooltip lines={1} className={styles.ellipsisText}>
                      {`地址：${item.practicalAddress}`}
                    </Ellipsis>
                    <p>{`主要负责人：${item.principalName}`}</p>
                    <p>{`联系电话：${item.principalPhone}`}</p>
                    <Ellipsis tooltip lines={1} className={styles.ellipsisText}>
                      {`总公司：${item.parentUnitName}`}
                    </Ellipsis>
                  </Col>
                  <Col
                    span={8}
                    onClick={() => {
                      goToService(`/fire-control/maintenance-company/serviceList/${item.id}`);
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <span className={styles.quantity}>{item.serviceCompanyCount}</span>
                    <span className={styles.servicenum}>服务单位数</span>
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
      maintenanceCompany: {
        data: {
          pagination: { total },
        },
        list,
        isLast,
      },
    } = this.props;

    return (
      <PageHeaderLayout title="维保单位" content={<div>维保单位总数：{total} </div>}>
        <BackTop />
        {this.renderForm()}
        {this.renderList()}
        {list.length !== 0 && <VisibilitySensor onChange={this.handleLoadMore} style={{}} />}
        {loading &&
          !isLast && (
            <div style={{ paddingTop: '50px', textAlign: 'center' }}>
              <Spin />
            </div>
          )}
      </PageHeaderLayout>
    );
  }
}