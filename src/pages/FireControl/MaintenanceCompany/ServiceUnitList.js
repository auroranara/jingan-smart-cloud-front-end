import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { List, Card, Button, Input, Spin, message } from 'antd';
import router from 'umi/router';
import VisibilitySensor from 'react-visibility-sensor';
import { hasAuthority } from '@/utils/customAuth';

import Ellipsis from '@/components/Ellipsis';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';

import styles from './MaintenanceCompanyList.less';

const FormItem = Form.Item;

// 面包屑
const breadcrumbList = [
  {
    title: '首页',
    name: '首页',
    href: '/',
  },
  {
    title: '消防维保',
    name: '消防维保',
  },
  {
    title: '维保单位',
    name: '维保单位',
    href: '/fire-control/maintenance-company/list',
  },
  {
    title: '服务单位列表',
    name: '服务单位列表',
  },
];

/* 标记 */
const markList = {
  1: 'processing-mark',
  2: 'error-mark',
  3: 'warning-mark',
  4: 'default-mark',
};
const markLabelList = {
  1: '服务中',
  2: '即将到期',
  3: '已到期',
  4: '未开始',
};

// 默认页面显示数量
const pageSize = 18;

// 默认表单值
const defaultFormData = {
  name: undefined,
  searchArea: undefined,
};

/* 获取无数据 */
const getEmptyData = () => {
  return <span style={{ color: 'rgba(0,0,0,0.45)' }}>暂无数据</span>;
};

@connect(({ maintenanceCompany, loading, user }) => ({
  maintenanceCompany,
  user,
  loading: loading.models.maintenanceCompany,
}))
@Form.create()
export default class ServiceUnitList extends PureComponent {
  constructor(props) {
    super(props);
    this.formData = defaultFormData;
  }

  componentDidMount() {
    const {
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;

    // 获取服务单位列表
    dispatch({
      type: 'maintenanceCompany/fetchServiceUnit',
      payload: {
        id,
        pageSize,
        pageNum: 1,
      },
    });
  }

  // 跳转到企业详情页
  goToCompany = companyId => {
    const {
      user: {
        currentUser: { permissionCodes },
      },
      match: {
        params: { id },
      },
    } = this.props;
    if (hasAuthority('fireControl.maintenanceCompany.serviceUnitView', permissionCodes)) {
      router.push(`/fire-control/maintenance-company/serviceList/${id}/detail/${companyId}`);
    } else {
      message.warning('您没有权限访问对应页面');
    }
  };

  goToCompanyScreen = companyId => {
    const url = `${window.publicPath}#/big-platform/fire-control/new-company/${companyId}`;
    const win = window.open(url, '_blank');
    win.focus();
  };

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
    // 修改表单数据
    this.formData = data;

    // 重新请求数据
    dispatch({
      type: 'maintenanceCompany/fetchServiceUnit',
      payload: {
        id,
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
    // 修改表单数据
    this.formData = defaultFormData;
    // 重新请求数据
    dispatch({
      type: 'maintenanceCompany/fetchServiceUnit',
      payload: {
        id,
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
      dispatch,
      maintenanceCompany: { pageNum },
    } = this.props;
    dispatch({
      type: 'maintenanceCompany/fetchServiceUnit',
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
              getValueFromEvent: e => e.target.value.trim(),
            })(<Input placeholder="请输入单位名称" />)}
          </FormItem>
          <FormItem>
            {getFieldDecorator('searchArea', {
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
        </Form>
      </Card>
    );
  }

  /* 渲染列表 */
  renderList() {
    const {
      maintenanceCompany: { list },
    } = this.props;

    return (
      <div className={styles.cardList} style={{ marginTop: '24px' }}>
        <List
          rowKey="id"
          grid={{ gutter: 24, column: 3, lg: 3, md: 2, sm: 1, xs: 1 }}
          dataSource={list}
          renderItem={item => {
            const {
              companyId,
              name,
              searchArea,
              industryCategoryLabel,
              safetyName,
              safetyPhone,
              status,
            } = item;
            return (
              <List.Item key={companyId}>
                <Card
                  title={name}
                  className={styles.card}
                  style={{ dispaly: 'block' }}
                  hoverable={![3, 4].includes(status)}
                >
                  <div onClick={[3, 4].includes(status) ? null : () => this.goToCompany(companyId)}>
                    <Ellipsis tooltip lines={1} className={styles.ellipsisText}>
                      地址：
                      {searchArea || getEmptyData()}
                    </Ellipsis>
                    <Ellipsis tooltip lines={1} className={styles.ellipsisText}>
                      行业类别：
                      {industryCategoryLabel || getEmptyData()}
                    </Ellipsis>
                    <p>
                      安全管理员：
                      {safetyName || getEmptyData()}
                    </p>
                    <p>
                      联系电话：
                      {safetyPhone || getEmptyData()}
                    </p>
                    <div style={{ marginBottom: '12px' }}>
                      <Button
                        disabled={[3, 4].includes(status)}
                        onClick={
                          [3, 4].includes(status)
                            ? null
                            : e => {
                                e.stopPropagation();
                                this.goToCompanyScreen(companyId);
                              }
                        }
                        type="primary"
                        ghost
                      >
                        驾驶舱
                      </Button>
                    </div>
                  </div>
                  {status && (
                    <div className={styles[markList[status]]}>{markLabelList[status]}</div>
                  )}
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
      maintenanceCompany: { list, isLast },
    } = this.props;

    return (
      <PageHeaderLayout
        title="服务单位列表"
        breadcrumbList={breadcrumbList}
        content={
          <div>
            单位总数：
            {list.length}
          </div>
        }
      >
        {this.renderForm()}
        {this.renderList()}
        {list.length !== 0 && <VisibilitySensor onChange={this.handleLoadMore} style={{}} />}
        {!isLast && (
          <div style={{ paddingTop: '50px', textAlign: 'center' }}>
            <Spin />
          </div>
        )}
      </PageHeaderLayout>
    );
  }
}
