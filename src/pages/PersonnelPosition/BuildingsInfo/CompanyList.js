import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, List, Card, Button, Input, Spin, Col, Row, Cascader, message } from 'antd';
import { routerRedux } from 'dva/router';
import Ellipsis from 'components/Ellipsis';
import InfiniteScroll from 'react-infinite-scroller';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';

import styles from './BuildingsInfo.less';
import codesMap from '@/utils/codes';
import { hasAuthority, AuthButton } from '@/utils/customAuth';

const FormItem = Form.Item;

// 默认页面显示数量
const pageSize = 18;

// 默认表单值
const defaultFormData = {
  company_name: undefined,
  regulatory_classify: undefined,
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

  // 跳转到建筑物信息列表
  handleBuildingList = (id, name) => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push(`/personnel-position/buildings-info/detail/${id}?name=${name}`));
  };

  /* 查询 */
  handleClickToQuery = () => {
    const {
      form: { getFieldsValue },
    } = this.props;
    const data = getFieldsValue();
    const { regulatory_classify } = data;
    // 修改表单数据
    this.formData = data;
    // 重新请求数据
    this.props.dispatch({
      type: 'buildingsInfo/fetchCompanyList',
      payload: {
        pageSize,
        pageNum: 1,
        ...data,
        regulatory_classify:
          regulatory_classify && regulatory_classify.length > 0
            ? regulatory_classify[regulatory_classify.length - 1]
            : undefined,
      },
    });
  };

  /* 重置 */
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
      type: 'buildingsInfo/fetchCompanyList',
      payload: {
        pageSize,
        pageNum: 1,
      },
    });
  };

  /* 滚动加载 */
  handleLoadMore = () => {
    const {
      buildingsInfo: { isLast },
    } = this.props;
    if (isLast) {
      return;
    }
    const {
      dispatch,
      buildingsInfo: { pageNum },
    } = this.props;
    // 请求数据
    dispatch({
      type: 'buildingsInfo/appendfetch',
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
      company: { industryCategories },
      form: { getFieldDecorator },
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
            {getFieldDecorator('regulatory_classify', {
              initialValue: defaultFormData.regulatory_classify,
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
            <AuthButton
              code={codesMap.personnelPosition.buildingsInfo.add}
              type="primary"
              href="#/personnel-position/buildings-info/add"
            >
              新增
            </AuthButton>
          </FormItem>
        </Form>
      </Card>
    );
  }

  /* 渲染列表 */
  renderList() {
    const {
      buildingsInfo: {
        data: { list },
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
          dataSource={list || []}
          renderItem={item => {
            const {
              grid_id,
              company_id,
              company_name,
              industryName,
              principal_name,
              principal_phone,
              buildingNum,
            } = item;
            return (
              <List.Item key={grid_id}>
                <Card title={company_name} className={styles.card}>
                  <Row>
                    <Col span={16} style={{ cursor: 'pointer' }}>
                      <Ellipsis tooltip lines={1} className={styles.ellipsisText}>
                        行业类别：
                        {industryName || getEmptyData()}
                      </Ellipsis>
                      <p>
                        安全负责人：
                        {principal_name || getEmptyData()}
                      </p>
                      <p>
                        联系电话：
                        {principal_phone || getEmptyData()}
                      </p>
                    </Col>
                    <Col
                      span={8}
                      onClick={() => {
                        if (hasAuthority(codesMap.personnelPosition.buildingsInfo.view, codes))
                          this.handleBuildingList(company_id, company_name);
                        else message.warn('您没有权限访问对应页面');
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      <span className={styles.quantity}>{buildingNum}</span>
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
      buildingsInfo: {
        data: {
          pagination: { total },
        },
        isLast,
      },
    } = this.props;

    return (
      <PageHeaderLayout
        title="建筑物信息"
        breadcrumbList={breadcrumbList}
        content={
          <div>
            单位总数：
            {total}{' '}
          </div>
        }
      >
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
