import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form,
  List,
  Card,
  Button,
  Icon,
  Input,
  Row,
  Col,
  message,
  Spin,
  Popconfirm,
  Select,
  Cascader,
  TreeSelect,
} from 'antd';
import { Link, routerRedux } from 'dva/router';
import router from 'umi/router';
import InfiniteScroll from 'react-infinite-scroller';
import Ellipsis from '@/components/Ellipsis';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import { hasAuthority } from '@/utils/customAuth';
import urls from '@/utils/urls';
import codes from '@/utils/codes';
import titles from '@/utils/titles';

import styles from '../Company/CompanyList.less';

const FormItem = Form.Item;
const Option = Select.Option;

// 获取title
const {
  home: homeTitle,
  company: { menu: menuTitle },
} = titles;
const title = '家庭档案'
// 获取链接地址
const {
  home: homeUrl,
  familyFile: {
    detail: detailUrl,
    edit: editUrl,
    add: addUrl,
  },
} = urls;
// 获取code
const {
  familyFile: {
    add: addCode,
    edit: editCode,
    // delete: deleteCode,
    detail: detailCode,
  },
} = codes;
// 默认页面显示数量
const pageSize = 18;
// 默认表单值
const defaultFormData = {
  name: undefined,
  practicalAddress: undefined,
  companyStatus: undefined,
  gridId: undefined,
  isSafetyImp: undefined,
  isFireImp: undefined,
};
// 获取无数据
const getEmptyData = () => {
  return <span style={{ color: 'rgba(0,0,0,0.45)' }}>暂无数据</span>;
};
// 获取根节点
const getRootChild = () => document.querySelector('#root>div');
// 阻止默认行为
const preventDefault = e => {
  e.preventDefault();
};
// 面包屑
const breadcrumbList = [
  {
    title: homeTitle,
    name: homeTitle,
    href: homeUrl,
  },
  {
    title: menuTitle,
    name: menuTitle,
  },
  {
    title,
    name: title,
  },
];
const companyStatuses = [
  { value: '正常', key: '1' },
  { value: '关停', key: '2' },
]

@connect(
  ({ company, unitDivision, hiddenDangerReport, user, loading }) => ({
    company,
    unitDivision,
    user,
    hiddenDangerReport,
    loading: loading.models.company,
  }),
  dispatch => ({
    // 获取初始数据列表（参数传family 1 获取家庭档案列表 0 获取企业列表）
    fetch({ payload = {}, ...res }) {
      dispatch({
        type: 'company/fetch',
        payload: { ...payload, family: 1 },
        ...res,
      });
    },
    // 追加数据列表
    appendFetch(action) {
      dispatch({
        type: 'company/appendFetch',
        ...action,
      });
    },
    /* 跳转到详情页面 */
    goToDetail(id) {
      dispatch(routerRedux.push(detailUrl + id));
    },
    /* 跳转到新增页面 */
    goToAdd() {
      dispatch(routerRedux.push(addUrl));
    },
    /* 跳转到编辑页面 */
    goToEdit() {
      dispatch(routerRedux.push(editUrl));
    },
    editScreenPermission(action) {
      dispatch({
        type: 'company/editScreenPermission',
        ...action,
      });
    },
    saveNewList(action) {
      dispatch({
        type: 'company/updateScreenPermission',
        ...action,
      });
    },
    fetchOptions(action) {
      dispatch({
        type: 'company/fetchOptions',
        ...action,
      });
    },
    saveSearchInfo(action) {
      dispatch({
        type: 'company/saveFamilySearchInfo',
        ...action,
      });
    },
    initPageNum(action) {
      dispatch({
        type: 'company/initPageNum',
        ...action,
      });
    },
    dispatch,
  })
)
@Form.create()
export default class CompanyList extends PureComponent {
  constructor(props) {
    super(props);
    this.formData = defaultFormData;
  }

  componentDidMount() {
    const {
      fetch,
      dispatch,
      company: { familyearchInfo: searchInfo },
      form: { setFieldsValue },
    } = this.props;
    // 获取单位列表
    dispatch({
      type: 'unitDivision/fetchDivisionList',
      payload: {
        pageSize,
        pageNum: 1,
      },
    });
    // 获取网格列表
    dispatch({
      type: 'hiddenDangerReport/fetchGridList',
    });
    // 获取企业列表
    if (searchInfo) {
      setFieldsValue(searchInfo);
      fetch({
        payload: {
          pageSize,
          pageNum: 1,
          ...searchInfo,
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
    const { initPageNum } = this.props;
    initPageNum();
  }

  /* 查询按钮点击事件 */
  handleClickToQuery = () => {
    const {
      fetch,
      saveSearchInfo,
      form: { getFieldsValue },
    } = this.props;
    const data = getFieldsValue();
    // 修改表单数据
    // this.formData = data;
    // 重新请求数据
    fetch({
      payload: {
        pageSize,
        pageNum: 1,
        ...data,
      },
    });
    saveSearchInfo({ payload: data });
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
    // this.formData = defaultFormData;
    // 重新请求数据
    fetch({
      payload: {
        pageSize,
        pageNum: 1,
      },
    });
    saveSearchInfo();
  };

  /* 滚动加载 */
  handleLoadMore = () => {
    const {
      company: { isLast, pageNum },
      appendFetch,
      form: { getFieldsValue },
    } = this.props;
    if (isLast) {
      return;
    }

    // 请求数据
    appendFetch({
      payload: {
        pageSize,
        pageNum: pageNum + 1,
        ...getFieldsValue(),
      },
    });
  };

  handleGotoDivision = id => {
    router.push(`/base-info/company/division/list/${id}`);
  };

  /* 渲染form表单 */
  renderForm() {
    const {
      user: {
        currentUser: { permissionCodes, unitType },
      },
      hiddenDangerReport: { gridList },
      form: { getFieldDecorator },
      goToAdd,
    } = this.props;
    // 是否有新增权限
    const hasAddAuthority = hasAuthority(addCode, permissionCodes);

    return (
      <Card>
        <Form>
          <Row gutter={30}>
            {unitType !== 1 &&
              unitType !== 4 && (
                <Col span={8}>
                  <FormItem style={{ margin: '0', padding: '4px 0' }}>
                    {getFieldDecorator('gridId', {
                      initialValue: defaultFormData.gridId,
                    })(
                      <TreeSelect
                        treeData={gridList}
                        placeholder="请选择所属网格"
                        getPopupContainer={getRootChild}
                        allowClear
                        dropdownStyle={{
                          maxHeight: '50vh',
                          zIndex: 50,
                        }}
                      />
                    )}
                  </FormItem>
                </Col>
              )}
            <Col span={8}>
              <FormItem style={{ margin: '0', padding: '4px 0' }}>
                {getFieldDecorator('name', {
                  initialValue: defaultFormData.name,
                  getValueFromEvent: e => e.target.value.trim(),
                })(<Input placeholder="请输入名称" style={{ width: '100%' }} />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem style={{ margin: '0', padding: '4px 0' }}>
                {getFieldDecorator('practicalAddress', {
                  initialValue: defaultFormData.practicalAddress,
                  getValueFromEvent: e => e.target.value.trim(),
                })(<Input placeholder="请输入地址" />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem style={{ margin: '0', padding: '4px 0' }}>
                {getFieldDecorator('companyStatus', {
                  initialValue: defaultFormData.companyStatus,
                })(
                  <Select allowClear placeholder="请选择状态" getPopupContainer={getRootChild}>
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
                <Button type="primary" onClick={goToAdd} disabled={!hasAddAuthority}>
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
      company: { list },
      user: {
        currentUser: { permissionCodes },
      },
    } = this.props;
    // 是否有查看权限
    const hasDetailAuthority = hasAuthority(detailCode, permissionCodes);
    // 是否有编辑权限
    const hasEditAuthority = hasAuthority(editCode, permissionCodes);
    return (
      <div className={styles.cardList} style={{ marginTop: '24px' }}>
        <List
          rowKey="id"
          // loading={loading}
          grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
          dataSource={list}
          renderItem={item => {
            const {
              id,
              name,
              practicalAddress,
              safetyName,
              safetyPhone,
              practicalProvinceLabel,
              practicalCityLabel,
              practicalDistrictLabel,
              practicalTownLabel,
            } = item;
            const practicalAddressLabel =
              (practicalProvinceLabel || '') +
              (practicalCityLabel || '') +
              (practicalDistrictLabel || '') +
              (practicalTownLabel || '') +
              (practicalAddress || '');
            return (
              <List.Item key={id}>
                <Card
                  title={name}
                  className={styles.card}
                  actions={[
                    <Link
                      to={detailUrl + id}
                      onClick={hasDetailAuthority ? null : preventDefault}
                      disabled={!hasDetailAuthority}
                      target="_blank"
                    >
                      查看
                    </Link>,
                    <Link
                      to={editUrl + id}
                      onClick={hasEditAuthority ? null : preventDefault}
                      disabled={!hasEditAuthority}
                      target="_blank"
                    >
                      编辑
                    </Link>,
                  ]}
                >
                  <Row>
                    <Col span={16}>
                      <div>
                        <Ellipsis tooltip lines={1} className={styles.ellipsisText}>
                          地址：
                          {practicalAddressLabel || getEmptyData()}
                        </Ellipsis>
                        <Ellipsis tooltip lines={1} className={styles.ellipsisText}>
                          负责人：
                          {safetyName || getEmptyData()}
                        </Ellipsis>
                        <Ellipsis tooltip lines={1} className={styles.ellipsisText}>
                          联系电话：
                          {safetyPhone || getEmptyData()}
                        </Ellipsis>
                      </div>
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
      company: {
        data: {
          pagination: { total },
        },
        isLast,
      },
      loading,
    } = this.props;

    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
        content={
          <div>
            家庭总数：
            {total}
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
