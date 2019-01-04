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
const Option = Select.Option;

// 默认页面显示数量
const pageSize = 18;

// 默认表单值
const defaultFormData = {
  buildingName: undefined,
  buildingType: undefined,
  fireDangerType: undefined,
  fireRating: undefined,
  floorNumber: undefined,
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
    // 获取建筑物类型字典
    dispatch({
      type: 'buildingsInfo/fetchDict',
      payload: {
        type: 'buildingType',
      },
    });
    // 获取火灾危险等级字典
    dispatch({
      type: 'buildingsInfo/fetchDict',
      payload: {
        type: 'fireDangerType',
      },
    });
    // 获取耐火等级字典
    dispatch({
      type: 'buildingsInfo/fetchDict',
      payload: {
        type: 'fireRating',
      },
    });
    // 获取建筑结构字典
    dispatch({
      type: 'buildingsInfo/fetchDict',
      payload: {
        type: 'floorNumber',
      },
    });
  }

  /* 查询 */
  handleClickToQuery = () => {
    const {
      form: { getFieldsValue },
      match: {
        params: { id },
      },
    } = this.props;
    const data = getFieldsValue();
    // 修改表单数据
    this.formData = data;
    // 重新请求数据
    this.props.dispatch({
      type: 'buildingsInfo/fetchBuildingList',
      payload: {
        company_id: id,
        pageSize,
        pageNum: 1,
        ...data,
      },
    });
  };

  /* 重置 */
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
      type: 'buildingsInfo/fetchBuildingList',
      payload: {
        company_id: id,
        pageSize,
        pageNum: 1,
      },
    });
  };

  /* 滚动加载 */
  handleLoadMore = () => {
    const {
      buildingsInfo: { isLast },
      match: {
        params: { id },
      },
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
      type: 'buildingsInfo/appendBuildingList',
      payload: {
        company_id: id,
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
      location: {
        query: { name },
      },
      buildingsInfo: { buildingType = [], fireDangerType = [], fireRating = [], floorNumber = [] },
    } = this.props;

    return (
      <Card>
        <Form layout="inline">
          <Row>
            <Col span={8}>
              <FormItem>
                {getFieldDecorator('buildingName', {
                  initialValue: defaultFormData.buildingName,
                  getValueFromEvent: e => e.target.value.trim(),
                })(<Input style={{ width: '330px' }} placeholder="请输入建筑物名称" />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem>
                {getFieldDecorator('buildingType', {
                  initialValue: defaultFormData.buildingType,
                })(
                  <Select style={{ width: '330px' }} placeholder="请选择建筑物类型">
                    {buildingType.map(item => (
                      <Option value={item.id} key={item.id}>
                        {item.label}
                      </Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem>
                {getFieldDecorator('fireDangerType', {
                  initialValue: defaultFormData.fireDangerType,
                })(
                  <Select style={{ width: '330px' }} placeholder="请选择火灾危险性分类">
                    {fireDangerType.map(item => (
                      <Option value={item.id} key={item.id}>
                        {item.label}
                      </Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem>
                {getFieldDecorator('fireRating', {
                  initialValue: defaultFormData.fireRating,
                })(
                  <Select style={{ width: '330px' }} placeholder="请选择耐火等级">
                    {fireRating.map(item => (
                      <Option value={item.id} key={item.id}>
                        {item.label}
                      </Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem>
                {getFieldDecorator('floorNumber', {
                  initialValue: defaultFormData.floorNumber,
                })(
                  <Select style={{ width: '330px' }} placeholder="请选择建筑结构">
                    {floorNumber.map(item => (
                      <Option value={item.id} key={item.id}>
                        {item.label}
                      </Option>
                    ))}
                  </Select>
                )}
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
                <Button
                  type="primary"
                  href={`#/personnel-position/buildings-info/add?name=${name}`}
                >
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
            const {
              id,
              buildingName,
              buildingTypeName,
              fireDangerTypeName,
              fireRatingName,
              floorNumberName,
              floorLevel,
              photoWebUrl,
            } = item;
            return (
              <List.Item key={id}>
                <Card title={buildingName} className={styles.card}>
                  <Row>
                    <Col span={10} style={{ cursor: 'pointer' }}>
                      <div
                        className={styles.detailpic}
                        style={{
                          backgroundImage: `url(${photoWebUrl[0].webUrl.split(',')[0]})`,
                          backgroundSize: 'cover',
                        }}
                      />
                    </Col>
                    <Col span={14} style={{ cursor: 'pointer' }}>
                      <p>
                        建筑物类型：
                        {buildingTypeName || getEmptyData()}
                      </p>
                      <p>
                        火灾危险性分类：
                        {fireDangerTypeName || getEmptyData()}
                      </p>
                      <p>
                        耐火等级：
                        {fireRatingName || getEmptyData()}
                      </p>
                      <p>
                        建筑结构：
                        {floorNumberName || getEmptyData()}
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
      buildingsInfo: {
        buildingData: {
          pagination: { total },
        },
        isLast,
      },
      location: {
        query: { name },
      },
    } = this.props;

    return (
      <PageHeaderLayout
        title={name}
        breadcrumbList={breadcrumbList}
        content={
          <div>
            建筑物总数：
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
