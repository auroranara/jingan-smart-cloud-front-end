import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Form, List, Card, Input, Button, Select, message, Spin, DatePicker } from 'antd';
import { Link, routerRedux } from 'dva/router';
import VisibilitySensor from 'react-visibility-sensor';
import Ellipsis from 'components/Ellipsis';

import InlineForm from '../BaseInfo/Company/InlineForm';
import PageHeaderLayout from '../../layouts/PageHeaderLayout.js';

import styles from './Contract.less';

const { Option } = Select;
const { RangePicker } = DatePicker;

/* 标题 */
const title = '维保合同管理';
/* 详情页面地址 */
const detailUrl = '/fire-control/contract/detail/';
/* 编辑页面地址 */
const editUrl = '/fire-control/contract/edit/';
/* 新增页面地址 */
const addUrl = '/fire-control/contract/add';
/* 去除两边空格 */
const transform = value => value.trim();
/* 设置相对定位 */
const getRootChild = () => document.querySelector('#root>div');
/* 获取无数据 */
const getEmptyData = () => {
  return <span style={{ color: 'rgba(0,0,0,0.45)' }}>暂无数据</span>;
};
/* 标记 */
const markList = ['warning-mark', 'processing-mark', 'error-mark', 'default-mark'];

@connect(({ contract, loading }) => ({
  contract,
  loading: loading.models.contract,
}), (dispatch) => ({
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
    dispatch(routerRedux.push(detailUrl+id));
  },
  /* 跳转到新增页面 */
  goToAdd() {
    dispatch(routerRedux.push(addUrl));
  },
  /* 跳转到编辑页面 */
  goToEdit() {
    dispatch(routerRedux.push(editUrl));
  },
  dispatch,
}))
@Form.create()
export default class ContractList extends PureComponent {
  state = {
    formData: {},
    isInit: false,
  }

  /* 挂载后 */
  componentDidMount() {
    const { fetchList, fetchStatusList, contract: { data: { pagination: { pageSize } } } } = this.props;
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
    fetchStatusList({
      payload: {

      },
    });
  }


  /* 获取标签 */
  getMark = (index) => {
    const { contract: { statusList } } = this.props;
    return <div className={styles[markList[index]]}>{statusList[index].label}</div>
  };

  /* 滚动加载 */
  handleLoadMore = flag => {
    if (!flag) {
      return;
    }
    const { appendList, contract: { data: { pagination: { pageSize, pageNum } } } } = this.props;
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
  handleSearch = ({ signPeriod, ...restValues }) => {
    const { fetchList, contract: { data: { pagination: { pageSize } } } } = this.props;

    const formData = {
      start: signPeriod && signPeriod[0].format('YYYY-MM-DD'),
      end: signPeriod && signPeriod[1].format('YYYY-MM-DD'),
      ...restValues,
    };
    fetchList({
      payload: {
        ...formData,
        pageSize,
        pageNum: 1,
      },
      success: () => {
        message.success('查询成功', 1);
        this.setState({
          formData,
        });
      },
      error: () => {
        message.success('查询失败', 1);
      },
    });
  }

  /* 重置点击事件 */
  handleReset = () => {
    const { fetchList, contract: { data: { pagination: { pageSize } } } } = this.props;
    fetchList({
      payload: {
        pageSize,
        pageNum: 1,
      },
      success: () => {
        message.success('重置成功', 1);
        this.setState({
          formData: {},
        });
      },
      error: () => {
        message.success('重置失败', 1);
      },
    });
  }

  /* 渲染表单 */
  renderForm() {
    const { contract: { statusList }, goToAdd } = this.props;
    /* 表单字段 */
    const fields = [
      {
        id: 'name',
        render() {
          return <Input placeholder='请输入单位名称' />;
        },
        transform,
      },
      {
        id: 'address',
        render() {
          return <Input placeholder='请输入单位地址' />;
        },
        transform,
      },
      {
        id: 'status',
        render() {
          return (
            <Select
              allowClear
              placeholder="请选择单位状态"
              getPopupContainer={getRootChild}
              style={{ width: '212px' }}
            >
              {statusList.map(item => (
                <Option value={item.id} key={item.id}>
                  {item.label}
                </Option>
              ))}
            </Select>
          );
        },
      },
      {
        id: 'number',
        render() {
          return <Input placeholder='请输入合同编号' />;
        },
        transform,
      },
      {
        id: 'signPeriod',
        render() {
          return (
            <RangePicker
              style={{ width: '212px' }}
              getCalendarContainer={getRootChild}
            />
          );
        },
      },
    ];

    return (
      <Card>
        <InlineForm
          fields={fields}
          extra={<Button type="primary" onClick={() => { goToAdd() }}>新增</Button>}
          onSearch={this.handleSearch}
          onReset={this.handleReset}
        />
      </Card>
    );
  }

  /* 渲染列表 */
  renderList() {
    const {
      contract: { data: { list } },
      goToDetail,
    } = this.props;

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
              number,
              name,
              safetyName,
              safetyPhone,
              practicalProvinceLabel,
              practicalCityLabel,
              practicalDistrictLabel,
              practicalTownLabel,
              practicalAddress,
              start,
              end,
            } = item;
            const practicalAddressLabel = (practicalProvinceLabel || '') + (practicalCityLabel || '') + (practicalDistrictLabel || '') + (practicalTownLabel || '') + (practicalAddress || '');
            const period = start && `${start || '?'} 至 ${end || '?'}`;
            return (
              <List.Item key={id}>
                <Card
                  title={number}
                  className={styles.card}
                  actions={[
                    <Link to={detailUrl+id}>查看</Link>,
                    <Link to={editUrl+id}>编辑</Link>,
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
                    onClick={() => {
                      goToDetail(id);
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <Ellipsis tooltip lines={1} className={styles.ellipsisText}>
                    服务单位：{name || getEmptyData()}
                    </Ellipsis>
                    <Ellipsis tooltip lines={1} className={styles.ellipsisText}>
                    地址：{practicalAddressLabel || getEmptyData()}
                    </Ellipsis>
                    <Ellipsis tooltip lines={1} className={styles.ellipsisText}>
                    安全负责人：{safetyName ? (<Fragment><span style={{ marginRight: '24px' }}>{safetyName}</span><span>{safetyPhone}</span></Fragment>) : getEmptyData()}
                    </Ellipsis>
                    <Ellipsis tooltip lines={1} className={styles.ellipsisText}>
                    合同期限：{period || getEmptyData()}
                    </Ellipsis>
                  </div>
                  {this.getMark(3)}
                </Card>
              </List.Item>
          )}}
        />
      </div>
    );
  }

  render() {
    const { loading, contract: { data: { pagination: { total } }, isLast } } = this.props;
    const { isInit } = this.state;

    return (
      <PageHeaderLayout
        title={title}
        content={<div>服务单位总数：{total} </div>}
      >
        {this.renderForm()}
        {this.renderList()}
        {isInit && !isLast && <VisibilitySensor onChange={this.handleLoadMore} />}
        {loading && !isLast && (
          <div style={{ paddingTop: '50px', textAlign: 'center' }}>
            <Spin />
          </div>
        )}
      </PageHeaderLayout>
    );
  }
}
