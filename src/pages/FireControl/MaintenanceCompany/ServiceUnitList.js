import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, List, Card, Button, Input, BackTop, Spin } from 'antd';
import { routerRedux } from 'dva/router';
import VisibilitySensor from 'react-visibility-sensor';

import Ellipsis from 'components/Ellipsis';
import PageHeaderLayout from '../../layouts/PageHeaderLayout.js';

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
    title: '维保公司',
    name: '维保公司',
    href: '/fire-control/maintenance-company/list',
  },
  {
    title: '服务单位列表',
    name: '服务单位列表',
  },
];

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

@connect(({ maintenanceCompany, loading }) => ({
  maintenanceCompany,
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
  goToCompany = id => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push(`../../base-info/company/detail/${id}`));
  };

  /* 查询按钮点击事件 */
  handleClickToQuery = () => {
    const {
      dispatch,
      form: { getFieldsValue },
    } = this.props;
    const data = getFieldsValue();
    // 修改表单数据
    this.formData = data;
    // 重新请求数据
    dispatch({
      type: 'maintenanceCompany/fetchServiceUnit',
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
      dispatch,
      form: { resetFields },
    } = this.props;
    // 清除筛选条件
    resetFields();
    // 修改表单数据
    this.formData = defaultFormData;
    // 重新请求数据
    dispatch({
      type: 'maintenanceCompany/fetchServiceUnit',
      payload: {
        pageSize,
        pageNum: 1,
      },
    });
  };

  /* 滚动加载 */
  handleLoadMore = flag => {
    const {
      dispatch,
      maintenanceCompany: { pageNum, isLast },
    } = this.props;
    if (!flag || isLast) {
      return;
    }
    dispatch({
      type: 'maintenanceCompany/fetchServiceUnit',
      payload: {
        pageSize,
        pageNum,
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
      match: {
        params: { id },
      },
      maintenanceCompany: { list },
    } = this.props;

    return (
      <div className={styles.cardList} style={{ marginTop: '24px' }}>
        <List
          rowKey="id"
          grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
          dataSource={list}
          renderItem={item => {
            const { name, searchArea, industryCategoryLabel, safetyName, safetyPhone } = item;
            return (
              <List.Item key={id}>
                <Card title={name} className={styles.card}>
                  <div
                    onClick={() => {
                      this.goToCompany(id);
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <Ellipsis tooltip lines={1} className={styles.ellipsisText}>
                      地址：{searchArea || getEmptyData()}
                    </Ellipsis>
                    <Ellipsis tooltip lines={1} className={styles.ellipsisText}>
                      行业类别：{industryCategoryLabel || getEmptyData()}
                    </Ellipsis>
                    <Ellipsis tooltip lines={1} className={styles.ellipsisText}>
                      负责人：{safetyName || getEmptyData()}
                    </Ellipsis>
                    <Ellipsis tooltip lines={1} className={styles.ellipsisText}>
                      联系电话：{safetyPhone || getEmptyData()}
                    </Ellipsis>
                  </div>
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
      <PageHeaderLayout title="服务单位列表" breadcrumbList={breadcrumbList}>
        <BackTop />
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
