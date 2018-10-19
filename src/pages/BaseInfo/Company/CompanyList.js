import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, List, Card, Button, Icon, Input, Modal, message, Spin, Popconfirm } from 'antd';
import { Link, routerRedux } from 'dva/router';
import InfiniteScroll from 'react-infinite-scroller';
import Ellipsis from '@/components/Ellipsis';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import { hasAuthority } from '@/utils/customAuth';
import urls from '@/utils/urls';
import codes from '@/utils/codes';
import titles from '@/utils/titles';
import safe from '../../../assets/safe.png';
import safeGray from '../../../assets/safe-gray.png';
import fire from '../../../assets/fire.png';
import fireGray from '../../../assets/fire-gray.png';

import styles from './CompanyList.less';

const FormItem = Form.Item;

// 获取title
const {
  home: homeTitle,
  company: { list: title, menu: menuTitle },
} = titles;
// 获取链接地址
const {
  home: homeUrl,
  company: {
    detail: detailUrl,
    edit: editUrl,
    add: addUrl,
    department: { list: departmentUrl },
  },
} = urls;
// 获取code
const {
  company: {
    detail: detailCode,
    edit: editCode,
    add: addCode,
    delete: deleteCode,
    department: { list: viewDepCode },
  },
} = codes;
// 默认页面显示数量
const pageSize = 18;
// 默认表单值
const defaultFormData = {
  name: undefined,
  practicalAddress: undefined,
  industryCategory: undefined,
};
// 获取无数据
const getEmptyData = () => {
  return <span style={{ color: 'rgba(0,0,0,0.45)' }}>暂无数据</span>;
};
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

@connect(
  ({ company, user, loading }) => ({
    company,
    user,
    loading: loading.models.company,
  }),
  dispatch => ({
    // 获取初始数据列表
    fetch(action) {
      dispatch({
        type: 'company/fetch',
        ...action,
      });
    },
    // 追加数据列表
    appendFetch(action) {
      dispatch({
        type: 'company/appendFetch',
        ...action,
      });
    },
    // 获取行业类别
    fetchDict(action) {
      dispatch({
        type: 'company/fetchDict',
        ...action,
      });
    },
    // 删除企业
    // remove(action) {
    //   dispatch({
    //     type: 'company/remove',
    //     ...action,
    //   });
    // },
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
    saveSearchInfo(action) {
      dispatch({
        type: 'company/saveSearchInfo',
        ...action,
      })
    },
    initPageNum(action) {
      dispatch({
        type: 'company/initPageNum',
        ...action,
      })
    },
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
      company: {
        searchInfo,
      },
      form: {
        setFieldsValue,
      },
    } = this.props;
    // 获取企业列表
    setFieldsValue(searchInfo)
    if (searchInfo) {
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
    const { initPageNum } = this.props
    initPageNum()
  }
  // /* 显示删除确认提示框 */
  // handleShowDeleteConfirm = id => {
  //   const { remove } = this.props;
  //   Modal.confirm({
  //     title: '你确定要删除这个企业单位吗?',
  //     content: '如果你确定要删除这个企业单位，点击确定按钮',
  //     okText: '确定',
  //     cancelText: '取消',
  //     onOk: () => {
  //       remove({
  //         payload: {
  //           id,
  //         },
  //         success: () => {
  //           message.success('删除成功！');
  //         },
  //         error: () => {
  //           message.error('删除失败，请联系管理人员！');
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
    saveSearchInfo({ payload: data })
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
      company: { isLast },
    } = this.props;
    if (isLast) {
      return;
    }
    const {
      appendFetch,
      company: { pageNum },
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

  /* 更改大屏权限 */
  handleScreenPermission = (id, safetyProduction, fireService, list) => {
    const { editScreenPermission, saveNewList } = this.props;
    const success = () => {
      list.map(
        item => (item.id === id ? Object.assign(item, { safetyProduction, fireService }) : item)
      );
      saveNewList({
        payload: {
          list,
        },
      });
      message.success('更新成功！');
    };
    const error = msg => {
      message.error(msg);
    };
    editScreenPermission({
      payload: {
        id,
        safetyProduction,
        fireService,
      },
      success,
      error,
    });
  };

  /* 渲染form表单 */
  renderForm() {
    const {
      // company: { industryCategories },
      user: {
        currentUser: { permissionCodes },
      },
      form: { getFieldDecorator },
      goToAdd,
    } = this.props;
    // 是否有新增权限
    const hasAddAuthority = hasAuthority(addCode, permissionCodes);

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
          {/* <FormItem>
            {getFieldDecorator('industryCategory', {
              initialValue: defaultFormData.industryCategory,
            })(
              <Select allowClear placeholder="行业类别" style={{ width: '164px' }} getPopupContainer={getRootChild}>
                {industryCategories.map(item => (
                  <Option value={item.id} key={item.id}>
                    {item.label}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem> */}
          <FormItem>
            <Button type="primary" onClick={this.handleClickToQuery}>
              查询
            </Button>
          </FormItem>
          <FormItem>
            <Button onClick={this.handleClickToReset}>重置</Button>
          </FormItem>
          <FormItem style={{ float: 'right' }}>
            <Button type="primary" onClick={goToAdd} disabled={!hasAddAuthority}>
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
      company: { list },
      user: {
        currentUser: { permissionCodes, unitType },
      },
    } = this.props;
    // 是否有查看权限
    const hasDetailAuthority = hasAuthority(detailCode, permissionCodes);
    // 是否有编辑权限
    const hasEditAuthority = hasAuthority(editCode, permissionCodes);
    // 是否有查看部门权限
    const hasViewDepAuthority = hasAuthority(viewDepCode, permissionCodes);

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
              industryCategoryLabel,
              safetyName,
              safetyPhone,
              practicalProvinceLabel,
              practicalCityLabel,
              practicalDistrictLabel,
              practicalTownLabel,
              safetyProduction,
              fireService,
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
                    >
                      查看
                    </Link>,
                    <Link
                      to={editUrl + id}
                      onClick={hasEditAuthority ? null : preventDefault}
                      disabled={!hasEditAuthority}
                    >
                      编辑
                    </Link>,
                    <Link
                      to={departmentUrl + id}
                      onClick={hasViewDepAuthority ? null : preventDefault}
                      disabled={!hasViewDepAuthority}
                    >
                      部门
                    </Link>,
                  ]}
                // extra={hasDeleteAuthority ? (
                //   <Button
                //     onClick={() => {
                //       this.handleShowDeleteConfirm(id);
                //     }}
                //     shape="circle"
                //     style={{ border: 'none', fontSize: '20px' }}
                //   >
                //     <Icon type="close" />
                //   </Button>
                // ) : null}
                >
                  <div
                  // onClick={hasDetailAuthority ? () => {
                  //   goToDetail(id);
                  // } : null}
                  // style={hasDetailAuthority ? { cursor: 'pointer' } : null}
                  >
                    <Ellipsis tooltip lines={1} className={styles.ellipsisText}>
                      地址：
                      {practicalAddressLabel || getEmptyData()}
                    </Ellipsis>
                    <Ellipsis tooltip lines={1} className={styles.ellipsisText}>
                      行业类别：
                      {industryCategoryLabel || getEmptyData()}
                    </Ellipsis>
                    <Ellipsis tooltip lines={1} className={styles.ellipsisText}>
                      负责人：
                      {safetyName || getEmptyData()}
                    </Ellipsis>
                    <Ellipsis tooltip lines={1} className={styles.ellipsisText}>
                      联系电话：
                      {safetyPhone || getEmptyData()}
                    </Ellipsis>
                    {unitType === 3 ? (
                      <Popconfirm
                        title={`确定要${safetyProduction ? '关闭' : '开启'}安全驾驶舱权限吗？`}
                        onConfirm={() =>
                          this.handleScreenPermission(
                            id,
                            Number(!safetyProduction),
                            fireService,
                            list
                          )
                        }
                      >
                        <img
                          className={styles.screenControlIcon}
                          src={safetyProduction ? safe : safeGray}
                          alt="safe"
                        />
                      </Popconfirm>
                    ) : (
                        <img
                          className={styles.defaultIcon}
                          src={safetyProduction ? safe : safeGray}
                          alt="safe"
                        />
                      )}
                    {unitType === 3 ? (
                      <Popconfirm
                        className={styles.ml30}
                        title={`确定要${fireService ? '关闭' : '开启'}消防驾驶舱权限吗？`}
                        onConfirm={() =>
                          this.handleScreenPermission(
                            id,
                            safetyProduction,
                            Number(!fireService),
                            list
                          )
                        }
                      >
                        <img
                          className={styles.screenControlIcon}
                          src={fireService ? fire : fireGray}
                          alt="fire"
                        />
                      </Popconfirm>
                    ) : (
                        <img
                          className={`${styles.defaultIcon} ${styles.ml30}`}
                          src={fireService ? fire : fireGray}
                          alt="fire"
                        />
                      )}
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
            单位总数：
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
