import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form,
  List,
  Card,
  Button,
  Input,
  Spin,
  Col,
  Row,
  Select,
  Icon,
  message,
  Modal,
} from 'antd';
// import { routerRedux } from 'dva/router';
// import { AuthLink } from '@/utils/customAuth';
import InfiniteScroll from 'react-infinite-scroller';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';

import codesMap from '@/utils/codes';
import { AuthButton, AuthLink } from '@/utils/customAuth';
import styles from './CompanyInfo.less';

const { confirm } = Modal;
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

  /* 删除 */
  handleShowDeleteConfirm = buildingId => {
    const {
      dispatch,
      match: {
        params: { id: companyId },
      },
    } = this.props;
    confirm({
      title: '提示信息',
      content: '是否删除该建筑物信息',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        dispatch({
          type: 'buildingsInfo/removeBuilding',
          payload: {
            buildingId,
          },
          callback: response => {
            if (response && response.code === 200) {
              dispatch({
                type: 'buildingsInfo/fetchBuildingList',
                payload: {
                  company_id: companyId,
                  pageSize,
                  pageNum: 1,
                },
              });
              message.success('删除成功！');
            } else message.warning('删除失败！');
          },
        });
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
      match: {
        params: { id: companyId },
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
                      <Option value={item.value} key={item.value}>
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
                      <Option value={item.value} key={item.value}>
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
                      <Option value={item.value} key={item.value}>
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
                      <Option value={item.value} key={item.value}>
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
                <AuthButton
                  type="primary"
                  code={codesMap.personnelPosition.buildingsInfo.add}
                  href={`#/personnel-position/buildings-info/add?companyId=${companyId}&&name=${name}`}
                >
                  新增
                </AuthButton>
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
      user: {
        currentUser: { permissionCodes: codes },
      },
      location: {
        query: { name },
      },
      match: {
        params: { id: companyId },
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
              photoWebUrl = [],
            } = item;
            return (
              <List.Item key={id}>
                <Card
                  title={buildingName}
                  className={styles.card}
                  actions={[
                    <AuthLink
                      code={codesMap.personnelPosition.buildingsInfo.edit}
                      codes={codes}
                      to={`/personnel-position/buildings-info/edit/${id}?companyId=${companyId}&&name=${name}`}
                    >
                      编辑
                    </AuthLink>,
                  ]}
                  extra={
                    <AuthButton
                      code={codesMap.personnelPosition.buildingsInfo.delete}
                      codes={codes}
                      onClick={() => {
                        this.handleShowDeleteConfirm(id);
                      }}
                      shape="circle"
                      style={{
                        border: 'none',
                        fontSize: '16px',
                        position: 'absolute',
                        right: '8px',
                        top: '12px',
                      }}
                    >
                      <Icon type="close" />
                    </AuthButton>
                  }
                >
                  <Row>
                    <Col span={10} style={{ cursor: 'pointer' }}>
                      {photoWebUrl.length > 0 ? (
                        <div
                          className={styles.detailpic}
                          style={{
                            backgroundImage: `url(${photoWebUrl[0].webUrl})`,
                            backgroundSize: 'cover',
                          }}
                        />
                      ) : (
                        <div className={styles.detailpic} />
                      )}
                    </Col>
                    <Col span={14}>
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
                      <AuthButton
                        code={codesMap.personnelPosition.buildingsInfo.floorAdd}
                        style={{ cursor: 'pointer' }}
                        href={`#/personnel-position/buildings-info/floor/list/${id}?companyId=${companyId}&&name=${name}`}
                      >
                        楼层管理
                      </AuthButton>
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
