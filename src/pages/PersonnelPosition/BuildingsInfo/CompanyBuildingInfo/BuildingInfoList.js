import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, List, Card, Button, Input, Spin, Col, Row, Select } from 'antd';
// import { routerRedux } from 'dva/router';
// import { AuthLink } from '@/utils/customAuth';
import InfiniteScroll from 'react-infinite-scroller';
// import Ellipsis from '@/components/Ellipsis';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';

import styles from './CompanyInfo.less';

const FormItem = Form.Item;
// const Option = Select.Option;

// 默认页面显示数量
const pageSize = 18;

// 默认表单值
const defaultFormData = {
  companyName: undefined,
  industryCategory: undefined,
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
    href: '/personnel-position/buildings-info/list',
  },
  {
    title: '建筑物信息列表',
    name: '建筑物信息列表',
  },
];

@connect(({ buildingsInfo, user, loading }) => ({
  buildingsInfo,
  user,
  loading: loading.models.buildingsInfo,
}))
@Form.create()
export default class BuildingInfoList extends PureComponent {
  constructor(props) {
    super(props);
    this.formData = defaultFormData;
  }

  /* 挂载后 */
  componentDidMount() {
    const {
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;
    //获取建筑物信息列表
    dispatch({
      type: 'buildingsInfo/fetchBuildingList',
      payload: {
        company_id: id,
        pageSize,
        pageNum: 1,
      },
    });
    // 获取字典
    dispatch({
      type: 'buildingsInfo/fetchDict',
    });
  }

  /* 渲染form表单 */
  renderForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;

    return (
      <Card>
        <Form layout="inline">
          <Row>
            <Col span={8}>
              <FormItem>
                {getFieldDecorator('companyName', {
                  initialValue: defaultFormData.companyName,
                  getValueFromEvent: e => e.target.value.trim(),
                })(<Input style={{ width: '330px' }} placeholder="请输入建筑物名称" />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem>
                {getFieldDecorator('companyName', {
                  initialValue: defaultFormData.companyName,
                  getValueFromEvent: e => e.target.value.trim(),
                })(<Select style={{ width: '330px' }} placeholder="请选择建筑物类型" />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem>
                {getFieldDecorator('companyName', {
                  initialValue: defaultFormData.companyName,
                  getValueFromEvent: e => e.target.value.trim(),
                })(<Select style={{ width: '330px' }} placeholder="请选择火灾危险性分类" />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem>
                {getFieldDecorator('companyName', {
                  initialValue: defaultFormData.companyName,
                  getValueFromEvent: e => e.target.value.trim(),
                })(<Select style={{ width: '330px' }} placeholder="请选择耐火等级" />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem>
                {getFieldDecorator('companyName', {
                  initialValue: defaultFormData.companyName,
                  getValueFromEvent: e => e.target.value.trim(),
                })(<Select style={{ width: '330px' }} placeholder="请选择建筑结构" />)}
              </FormItem>
            </Col>
            <Col span={8} style={{ width: '350px' }}>
              <FormItem>
                <Button type="primary" onClick={this.handleClickToQuery}>
                  查询
                </Button>
              </FormItem>
              <FormItem>
                <Button onClick={this.handleClickToReset}>重置</Button>
              </FormItem>
              <FormItem style={{ float: 'right' }}>
                <Button type="primary" href="#/personnel-position/buildings-info/add">
                  新增
                </Button>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Card>
    );
  }

  /* 渲染列表 */
  renderList() {
    const {
      buildingsInfo: {
        buildingData: { list },
      },
    } = this.props;

    return (
      <div className={styles.cardList} style={{ marginTop: '24px' }}>
        <List
          rowKey="id"
          grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
          dataSource={list || []}
          renderItem={item => {
            const { id, buildingName, buildingType, fireDangerType, fireRating, floorLevel } = item;
            return (
              <List.Item key={id}>
                <Card title={buildingName} className={styles.card}>
                  <Row>
                    <Col span={8} style={{ cursor: 'pointer' }}>
                      <span className={styles.detailpic}>{item.serviceCompanyCount}</span>
                    </Col>
                    <Col span={16} style={{ cursor: 'pointer' }}>
                      <p>
                        建筑物类型：
                        {buildingType || getEmptyData()}
                      </p>
                      <p>
                        火灾危险性分类：
                        {fireDangerType || getEmptyData()}
                      </p>
                      <p>
                        耐火等级：
                        {fireRating || getEmptyData()}
                      </p>
                      <p>
                        建筑结构：
                        {item.parentUnitPj || getEmptyData()}
                      </p>
                      <p>
                        层数：
                        {floorLevel || getEmptyData()}
                      </p>
                      <Button>楼层管理</Button>
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
        query: { name },
      },
    } = this.props;
    console.log('this.props', this.props);
    return (
      <PageHeaderLayout
        title={name}
        breadcrumbList={breadcrumbList}
        content={<div>建筑物总数： </div>}
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
