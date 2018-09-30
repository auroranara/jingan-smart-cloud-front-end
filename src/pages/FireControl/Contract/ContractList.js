import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Form, List, Card, Input, Button, Select, Spin, DatePicker } from 'antd';
import { Link, routerRedux } from 'dva/router';
import InfiniteScroll from 'react-infinite-scroller';
import Ellipsis from '@/components/Ellipsis';
import moment from 'moment';

import InlineForm from '../../BaseInfo/Company/InlineForm';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import { hasAuthority } from '@/utils/customAuth';
import urls from '@/utils/urls';
import codes from '@/utils/codes';

import styles from './Contract.less';

const { Option } = Select;
const { RangePicker } = DatePicker;

/* 标题 */
const title = '维保合同管理';
// 获取链接地址
const {
  contract: { detail: detailUrl, edit: editUrl, add: addUrl },
} = urls;
// 获取code
const {
  contract: { detail: detailCode, edit: editCode, add: addCode },
} = codes;
/* 去除两边空格 */
const transform = value => value.trim();
/* 设置相对定位 */
const getRootChild = () => document.querySelector('#root>div');
/* 获取无数据 */
const getEmptyData = () => {
  return <span style={{ color: 'rgba(0,0,0,0.45)' }}>暂无数据</span>;
};
// 阻止默认行为
const preventDefault = e => {
  e.preventDefault();
};
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

@connect(
  ({ contract, user, loading }) => ({
    contract,
    user,
    loading: loading.models.contract,
  }),
  dispatch => ({
    /* 获取合同列表 */
    fetchList(action) {
      dispatch({
        type: 'contract/fetchList',
        ...action,
      });
    },
    /* 追加维保合同列表 */
    appendList(action) {
      dispatch({
        type: 'contract/appendList',
        ...action,
      });
    },
    /* 获取单位状态 */
    fetchStatusList(action) {
      dispatch({
        type: 'contract/fetchStatusList',
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
    // 异常
    goToException() {
      dispatch(routerRedux.push('/exception/500'));
    },
    dispatch,
  })
)
@Form.create()
export default class ContractList extends PureComponent {
  state = {
    formData: {},
    isInit: false,
  };

  /* 挂载后 */
  componentDidMount() {
    const {
      fetchList,
      fetchStatusList,
      contract: {
        data: {
          pagination: { pageSize },
        },
      },
    } = this.props;
    /* 获取合同列表 */
    fetchList({
      payload: {
        pageSize,
        pageNum: 1,
      },
      success: () => {
        this.setState({
          isInit: true,
        });
      },
    });
    /* 获取单位状态列表 */
    fetchStatusList();
  }

  /* 滚动加载 */
  handleLoadMore = () => {
    const {
      contract: { isLast },
    } = this.props;
    if (isLast) {
      return;
    }
    const {
      appendList,
      contract: {
        data: {
          pagination: { pageSize, pageNum },
        },
      },
    } = this.props;
    const { formData } = this.state;
    // 请求数据
    appendList({
      payload: {
        pageSize,
        pageNum: pageNum + 1,
        ...formData,
      },
    });
  };

  /* 查询点击事件 */
  handleSearch = ({ period: [startTime, endTime], ...restValues }) => {
    const {
      fetchList,
      goToException,
      contract: {
        data: {
          pagination: { pageSize },
        },
      },
    } = this.props;

    const formData = {
      startTime: startTime && startTime.format('YYYY-MM-DD'),
      endTime: endTime && endTime.format('YYYY-MM-DD'),
      ...restValues,
    };
    fetchList({
      payload: {
        ...formData,
        pageSize,
        pageNum: 1,
      },
      success: () => {
        // message.success('查询成功', 1);
        this.setState({
          formData,
        });
      },
      error: () => {
        // message.success('查询失败', 1);
        goToException();
      },
    });
  };

  /* 重置点击事件 */
  handleReset = () => {
    const {
      fetchList,
      goToException,
      contract: {
        data: {
          pagination: { pageSize },
        },
      },
    } = this.props;
    fetchList({
      payload: {
        pageSize,
        pageNum: 1,
      },
      success: () => {
        // message.success('重置成功', 1);
        this.setState({
          formData: {},
        });
      },
      error: () => {
        // message.success('重置失败', 1);
        goToException();
      },
    });
  };

  /* 渲染表单 */
  renderForm() {
    const {
      contract: { statusList },
      goToAdd,
      user: {
        currentUser: { permissionCodes },
      },
    } = this.props;
    /* 表单字段 */
    const fields = [
      {
        id: 'name',
        render() {
          return <Input placeholder="请输入单位名称" />;
        },
        transform,
      },
      {
        id: 'searchArea',
        render() {
          return <Input placeholder="请输入单位地址" />;
        },
        transform,
      },
      {
        id: 'contractStatus',
        render() {
          return (
            <Select
              allowClear
              placeholder="请选择合同状态"
              getPopupContainer={getRootChild}
              style={{ width: '100%' }}
            >
              {statusList.map(item => (
                <Option value={item.id} key={item.id}>
                  {item.value}
                </Option>
              ))}
            </Select>
          );
        },
      },
      {
        id: 'contractCode',
        render() {
          return <Input placeholder="请输入合同编号" />;
        },
        transform,
      },
      {
        id: 'period',
        options: {
          initialValue: [],
        },
        render() {
          return <RangePicker style={{ width: '100%' }} getCalendarContainer={getRootChild} />;
        },
      },
    ];

    // 是否有新增权限
    const hasAddAuthority = hasAuthority(addCode, permissionCodes);

    return (
      <Card>
        <InlineForm
          fields={fields}
          gutter={{ lg: 48, md: 24 }}
          action={
            <Button type="primary" onClick={goToAdd} disabled={!hasAddAuthority}>
              新增
            </Button>
          }
          onSearch={this.handleSearch}
          onReset={this.handleReset}
        />
      </Card>
    );
  }

  /* 渲染列表 */
  renderList() {
    const {
      contract: {
        data: { list },
      },
      user: {
        currentUser: { permissionCodes },
      },
      goToDetail,
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
              contractCode,
              startTime,
              endTime,
              contractStatus,
              companyBasicInfo: { name, safetyName, safetyPhone, searchArea },
            } = item;
            const period = `${(startTime && moment(+startTime).format('YYYY-MM-DD')) ||
              '?'} 至 ${(endTime && moment(+endTime).format('YYYY-MM-DD')) || '?'}`;
            return (
              <List.Item key={id}>
                <Card
                  title={
                    <Ellipsis tooltip lines={1} className={styles['card-title-ellipsis']}>
                      {contractCode}
                    </Ellipsis>
                  }
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
                  ]}
                  // extra={
                  //   <Button
                  //     onClick={() => {
                  //       this.handleShowDeleteConfirm(id);
                  //     }}
                  //     shape="circle"
                  //     style={{ border: 'none', fontSize: '20px' }}
                  //   >
                  //     <Icon type="close" />
                  //   </Button>
                  // }
                >
                  <div
                    onClick={
                      hasDetailAuthority
                        ? () => {
                            goToDetail(id);
                          }
                        : null
                    }
                    style={hasDetailAuthority ? { cursor: 'pointer' } : null}
                  >
                    <Ellipsis tooltip lines={1} className={styles.ellipsisText}>
                      服务单位：
                      {name || getEmptyData()}
                    </Ellipsis>
                    <Ellipsis tooltip lines={1} className={styles.ellipsisText}>
                      地址：
                      {searchArea || getEmptyData()}
                    </Ellipsis>
                    <Ellipsis tooltip lines={1} className={styles.ellipsisText}>
                      安全负责人：
                      {safetyName ? (
                        <Fragment>
                          <span style={{ marginRight: '24px' }}>{safetyName}</span>
                          <span>{safetyPhone}</span>
                        </Fragment>
                      ) : (
                        getEmptyData()
                      )}
                    </Ellipsis>
                    <Ellipsis tooltip lines={1} className={styles.ellipsisText}>
                      合同期限：
                      {period || getEmptyData()}
                    </Ellipsis>
                  </div>
                  {contractStatus && (
                    <div className={styles[markList[contractStatus]]}>
                      {markLabelList[contractStatus]}
                    </div>
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
      loading,
      contract: {
        data: {
          pagination: { total },
        },
        isLast,
      },
    } = this.props;
    const { isInit } = this.state;
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
        title,
        name: title,
      },
    ];

    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
        content={
          <div>
            维保合同总数：
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
