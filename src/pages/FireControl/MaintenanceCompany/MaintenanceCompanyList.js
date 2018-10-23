import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form,
  List,
  Card,
  Button,
  // Icon,
  Input,
  // Modal,
  message,
  Spin,
  Col,
  Row,
  Cascader,
  Select,
} from 'antd';
import { routerRedux } from 'dva/router';
import InfiniteScroll from 'react-infinite-scroller';

import Ellipsis from '@/components/Ellipsis';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';

import styles from './MaintenanceCompanyList.less';
import codesMap from '@/utils/codes';
import { AuthLink, AuthButton, hasAuthority } from '@/utils/customAuth';

const FormItem = Form.Item;
const Option = Select.Option;
//面包屑
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
    title: '维保单位管理',
    name: '维保单位管理',
  },
];

// 默认页面显示数量
const pageSize = 18;
// 默认表单值
const defaultFormData = {
  name: undefined,
  practicalAddress: undefined,
  industryCategory: undefined,
  companyType: undefined,
  companyStatus: undefined,
};

/* 获取无数据 */
const getEmptyData = () => {
  return <span style={{ color: 'rgba(0,0,0,0.45)' }}>暂无数据</span>;
};

// 获取根节点
const getRootChild = () => document.querySelector('#root>div');

@connect(
  ({ maintenanceCompany, company, user, loading }) => ({
    maintenanceCompany,
    company,
    user,
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
    // gsafe版获取字典
    gsafeFetchDict(action) {
      dispatch({
        type: 'company/gsafeFetchDict',
        ...action,
      });
    },
    // 获取行业类别
    fetchIndustryType(action) {
      dispatch({
        type: 'company/fetchIndustryType',
        ...action,
      });
    },
    fetchOptions(action) {
      dispatch({
        type: 'company/fetchOptions',
        ...action,
      });
    },
    // 保存查询栏数据
    saveSearchInfo(action) {
      dispatch({
        type: 'maintenanceCompany/saveSearchInfo',
        ...action,
      })
    },
    // 初始化页码
    initPageNum(action) {
      dispatch({
        type: 'maintenanceCompany/initPageNum',
        ...action,
      })
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
    const {
      fetch,
      fetchIndustryType,
      gsafeFetchDict,
      fetchOptions,
      goToException: error,
      maintenanceCompany: {
        searchInfo,
      },
      form: {
        setFieldsValue,
      },
    } = this.props;

    // 获取行业类别
    fetchIndustryType({
      error,
    });
    // 获取单位状态
    gsafeFetchDict({
      payload: {
        type: 'companyState',
        key: 'companyStatuses',
      },
      error,
    });
    // 获取单位类型
    fetchOptions({
      payload: {
        type: 'companyType',
        key: 'companyTypes',
      },
      error,
    });
    // 判断是存了查询信息，并获取维保单位列表
    if (searchInfo) {
      const { industryCategory } = searchInfo
      setFieldsValue(searchInfo)
      fetch({
        payload: {
          pageSize,
          pageNum: 1,
          ...searchInfo,
          industryCategory:
            industryCategory && industryCategory.length > 0 ? industryCategory.join(',') : undefined,
        },
      });
    } else {
      fetch({
        payload: {
          pageSize,
          pageNum: 1,
        },
      });
    }
  }

  componentWillUnmount() {
    const { initPageNum } = this.props
    initPageNum()
  }

  /* 显示删除确认提示框 */
  // handleShowDeleteConfirm = id => {
  //   const { remove } = this.props;
  //   Modal.confirm({
  //     title: '你确定要删除这个维保单位吗?',
  //     content: '如果你确定要删除这个维保单位，点击确定按钮',
  //     okText: '确定',
  //     cancelText: '取消',
  //     onOk: () => {
  //       remove({
  //         payload: {
  //           id,
  //         },
  //         callback: res => {
  //           if (res.code === 200) {
  //             message.success('删除成功！');
  //           } else {
  //             message.error('删除失败，该维保单位正为企业服务中！');
  //           }
  //         },
  //       });
  //     },
  //   });
  // };

  /* 查询按钮点击事件 */
  handleClickToQuery = () => {
    const {
      fetch,
      saveSearchInfo,
      form: { getFieldsValue },
    } = this.props;
    const data = getFieldsValue();
    const { industryCategory } = data;
    // 修改表单数据
    this.formData = data;
    // 重新请求数据
    fetch({
      payload: {
        pageSize,
        pageNum: 1,
        ...data,
        industryCategory:
          industryCategory && industryCategory.length > 0 ? industryCategory.join(',') : undefined,
      },
    });
    saveSearchInfo({
      payload: data,
    })
  };

  /* 重置按钮点击事件 */
  handleClickToReset = () => {
    const {
      fetch,
      saveSearchInfo,
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
    saveSearchInfo()
  };

  /* 滚动加载 */
  handleLoadMore = () => {
    const {
      maintenanceCompany: { isLast },
    } = this.props;
    if (isLast) {
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
      user: {
        currentUser: { permissionCodes: codes },
      },
      company: { companyTypes, industryCategories, companyStatuses },
    } = this.props;

    return (
      <Card>
        <Form className={styles.form}>
          <Row gutter={30}>
            <Col span={8}>
              <FormItem>
                {getFieldDecorator('name', {
                  initialValue: defaultFormData.name,
                  getValueFromEvent: e => e.target.value.trim(),
                })(<Input placeholder="请输入单位名称" />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem>
                {getFieldDecorator('practicalAddress', {
                  initialValue: defaultFormData.practicalAddress,
                  getValueFromEvent: e => e.target.value.trim(),
                })(<Input placeholder="请输入单位地址" />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem style={{ margin: '0', padding: '4px 0', marginTop: '-4px' }}>
                {getFieldDecorator('industryCategory', {
                  initialValue: defaultFormData.industryCategory,
                })(
                  <Cascader
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
            </Col>
            <Col span={8}>
              <FormItem style={{ margin: '0', padding: '4px 0' }}>
                {getFieldDecorator('companyType', {
                  initialValue: defaultFormData.companyType,
                })(
                  <Select allowClear placeholder="请选择单位类型" getPopupContainer={getRootChild}>
                    {companyTypes.map(item => (
                      <Option key={item.id + ''}>{item.label}</Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem style={{ margin: '0', padding: '4px 0' }}>
                {getFieldDecorator('companyStatus', {
                  initialValue: defaultFormData.companyStatus,
                })(
                  <Select allowClear placeholder="请选择单位状态" getPopupContainer={getRootChild}>
                    {companyStatuses.map(item => (
                      <Option value={item.key} key={item.key}>
                        {item.value}
                      </Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem style={{ margin: '0', padding: '4px 0' }}>
                <Button
                  type="primary"
                  onClick={this.handleClickToQuery}
                  style={{ marginRight: '16px' }}
                >
                  查询
                </Button>
                <Button onClick={this.handleClickToReset} style={{ marginRight: '16px' }}>
                  重置
                </Button>
                <AuthButton
                  code={codesMap.maintenanceCompany.add}
                  codes={codes}
                  type="primary"
                  href="#/fire-control/maintenance-company/add"
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
      maintenanceCompany: { list },
      goToDetail,
      goToService,
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
          renderItem={item => (
            <List.Item key={item.id}>
              <Card
                title={item.name}
                className={styles.card}
                actions={[
                  <AuthLink
                    code={codesMap.maintenanceCompany.detail}
                    codes={codes}
                    to={`/fire-control/maintenance-company/detail/${item.id}`}
                  >
                    查看
                  </AuthLink>,
                  <AuthLink
                    code={codesMap.maintenanceCompany.edit}
                    codes={codes}
                    to={`/fire-control/maintenance-company/edit/${item.id}`}
                  >
                    编辑
                  </AuthLink>,
                ]}
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
                  <Col
                    span={16}
                    onClick={() => {
                      if (hasAuthority(codesMap.maintenanceCompany.detail, codes))
                        goToDetail(`/fire-control/maintenance-company/detail/${item.id}`);
                      else message.warn('您没有权限访问对应页面');
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <Ellipsis tooltip lines={1} className={styles.ellipsisText}>
                      地址：
                      {item.practicalAddress || getEmptyData()}
                    </Ellipsis>
                    <Ellipsis tooltip lines={1} className={styles.ellipsisText}>
                      主要负责人：
                      {item.principalName || getEmptyData()}
                    </Ellipsis>
                    <p>
                      联系电话：
                      {item.principalPhone || getEmptyData()}
                    </p>
                    <Ellipsis tooltip lines={1} className={styles.ellipsisText}>
                      总公司：
                      {item.parentUnitName || getEmptyData()}
                    </Ellipsis>
                  </Col>
                  <Col
                    span={8}
                    onClick={() => {
                      if (hasAuthority(codesMap.maintenanceCompany.serviceDetail, codes))
                        goToService(`/fire-control/maintenance-company/serviceList/${item.id}`);
                      else message.warn('您没有权限访问对应页面');
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
      <PageHeaderLayout
        title="维保单位管理"
        breadcrumbList={breadcrumbList}
        content={
          <div>
            维保单位总数：
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
