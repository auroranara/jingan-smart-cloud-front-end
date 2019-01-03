import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, List, Card, Button, Input, Spin, Col, Row, Cascader } from 'antd';
// import { routerRedux } from 'dva/router';
// import { AuthLink } from '@/utils/customAuth';
import InfiniteScroll from 'react-infinite-scroller';

import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';

import styles from './BuildingsInfo.less';

const FormItem = Form.Item;

// 默认页面显示数量
const pageSize = 18;

// 默认表单值
const defaultFormData = {
  company_name: undefined,
  industryTypeId: undefined,
};

/* 获取无数据 */
const getEmptyData = () => {
  return <span style={{ color: 'rgba(0,0,0,0.45)' }}>暂无数据</span>;
};

//面包屑
const breadcrumbList = [
  {
    title: '首页',
    name: '首页',
    href: '/',
  },
  {
    title: '人员定位',
    name: '人员定位',
  },
  {
    title: '建筑物信息',
    name: '建筑物信息',
  },
];

// 获取根节点
const getRootChild = () => document.querySelector('#root>div');

@connect(({ buildingsInfo, company, user, loading }) => ({
  buildingsInfo,
  company,
  user,
  loading: loading.models.buildingsInfo,
}))
@Form.create()
export default class CompanyList extends PureComponent {
  constructor(props) {
    super(props);
    this.formData = defaultFormData;
  }

  /* 挂载后 */
  componentDidMount() {
    const { dispatch } = this.props;
    //获取单位列表
    dispatch({
      type: 'buildingsInfo/fetchCompanyList',
      payload: {
        pageSize,
        pageNum: 1,
      },
    });
    // 获取行业类别
    dispatch({
      type: 'company/fetchIndustryType',
    });
  }

  /* 查询 */
  handleClickToQuery = () => {
    const {
      form: { getFieldsValue },
    } = this.props;
    const data = getFieldsValue();
    const { industryTypeId } = data;
    // 修改表单数据
    this.formData = data;
    // 重新请求数据
    this.props.dispatch({
      type: 'buildingsInfo/fetchCompanyList',
      payload: {
        pageSize,
        pageNum: 1,
        industryTypeId:
          industryTypeId && industryTypeId.length > 0 ? industryTypeId.join(',') : undefined,
        ...data,
      },
    });
  };

  /* 重置 */
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
      type: 'buildingsInfo/fetchCompanyList',
      payload: {
        pageSize,
        pageNum: 1,
      },
    });
  };

  /* 渲染form表单 */
  renderForm() {
    const {
      company: { industryCategories },
      form: { getFieldDecorator },
      // user: {
      //   currentUser: { permissionCodes: codes },
      // },
    } = this.props;

    return (
      <Card>
        <Form layout="inline">
          <FormItem>
            {getFieldDecorator('company_name', {
              initialValue: defaultFormData.company_name,
              getValueFromEvent: e => e.target.value.trim(),
            })(<Input placeholder="请输入企业名称" />)}
          </FormItem>
          <FormItem>
            {getFieldDecorator('industryTypeId', {
              initialValue: defaultFormData.industryTypeId,
            })(
              <Cascader
                style={{ width: '300px' }}
                options={industryCategories}
                fieldNames={{
                  value: 'type_id',
                  label: 'gs_type_name',
                  children: 'children',
                }}
                allowClear
                changeOnSelect
                notFoundContent
                placeholder="请选择行业类别"
                getPopupContainer={getRootChild}
              />
            )}
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
            <Button type="primary" href="#/device-management/video-monitor/add">
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
      buildingsInfo: { list },
    } = this.props;
    return (
      <div className={styles.cardList} style={{ marginTop: '24px' }}>
        <List
          rowKey="id"
          grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
          dataSource={list || []}
          renderItem={item => (
            <List.Item key={item.id}>
              <Card
                title={item.company_name}
                className={styles.card}
                // extra={
                //   <Button
                //     onClick={() => {
                //       this.handleShowDeleteConfirm(item.id);
                //     }}
                //     shape="circle"
                //     style={{ border: 'none', fontSize: '20px' }}
                //   >
                //     <Icon type="close" />
                //   </Button>
                // }
              >
                <Row>
                  <Col span={16} style={{ cursor: 'pointer' }}>
                    <p>
                      行业类别：
                      {item.industry_type_id || getEmptyData()}
                    </p>
                    <p>
                      安全负责人：
                      {item.principal_name || getEmptyData()}
                    </p>
                    <p>
                      联系电话：
                      {item.principal_phone || getEmptyData()}
                    </p>
                  </Col>
                  <Col
                    span={8}
                    onClick={() => {
                      this.handleGoToDetail(item.id);
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
    const { loading } = this.props;

    return (
      <PageHeaderLayout
        title="建筑物信息"
        breadcrumbList={breadcrumbList}
        content={<div>单位总数： </div>}
      >
        {this.renderForm()}
        <InfiniteScroll
          initialLoad={false}
          pageStart={0}
          loadMore={() => {
            // 防止多次加载
            !loading && this.handleLoadMore();
          }}
          // hasMore={!isLast}
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
