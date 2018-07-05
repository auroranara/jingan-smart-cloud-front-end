import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, List, Card, Input, Button, Select, message, Spin } from 'antd';
import { Link, routerRedux } from 'dva/router';
import VisibilitySensor from 'react-visibility-sensor';
import Ellipsis from 'components/Ellipsis';

import InlineForm from '../BaseInfo/Company/InlineForm';
import PageHeaderLayout from '../../layouts/PageHeaderLayout.js';

import styles from './Contract.less';

const { Option } = Select;

/* 标题 */
const title = '维保合同管理';
/* 合同档案页面地址 */
const archiveUrl = '/contract/archive';
/* 详情页面地址 */
const detailUrl = '/contract/detail/';
/* 编辑页面地址 */
const editUrl = '/contract/edit/';
/* 新增页面地址 */
const addUrl = '/contract/add';
/* 去除两边空格 */
const transform = value => value.trim();
/* 设置相对定位 */
const getRootChild = () => document.querySelector('#root>div');
/* 获取无数据 */
const getEmptyData = () => {
  return <span style={{ color: 'rgba(0,0,0,0.45)' }}>暂无数据</span>;
};
/* 标记 */
const markList = ['default-mark', 'processing-mark', 'warning-mark'];

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
  /* 跳转到合同档案页面 */
  goToArchive() {
    dispatch(routerRedux.push(archiveUrl));
  },
  /* 跳转到新增页面 */
  goToAdd() {
    dispatch(routerRedux.push(addUrl));
  },
  dispatch,
}))
@Form.create()
export default class ContractList extends PureComponent {
  state = {
    formData: {
      name: undefined,
      address: undefined,
      status: undefined,
    },
  }

  /* 挂载后 */
  componentDidMount() {
    const { fetchList, fetchStatusList, contract: { data: { pagination: { pageSize } } } } = this.props;
    /* 获取合同列表 */
    fetchList({
      payload: {
        pageSize,
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
    const { fetchList, contract: { data: { pagination: { pageSize, pageNum } } } } = this.props;
    const { formData } = this.state;
    // 请求数据
    fetchList({
      payload: {
        pageSize,
        pageNum: pageNum + 1,
        ...formData,
      },
    });
  };

  /* 查询点击事件 */
  handleSearch = (values) => {
    const { fetchList, contract: { data: { pagination: { pageSize } } } } = this.props;
    fetchList({
      payload: {
        ...values,
        pageSize,
        pageNum: 1,
      },
      success: () => {
        message.success('查询成功', 1);
        this.setState({
          formData: values,
        });
      },
      error: () => {
        message.success('查询失败', 1);
      },
    });
  }

  /* 重置点击事件 */
  handleReset = (values) => {
    const { fetchList, contract: { data: { pagination: { pageSize } } } } = this.props;
    fetchList({
      payload: {
        ...values,
        pageSize,
        pageNum: 1,
      },
      success: () => {
        message.success('重置成功', 1);
        this.setState({
          formData: values,
        });
      },
      error: () => {
        message.success('重置失败', 1);
      },
    });
  }

  /* 渲染表单 */
  renderForm() {
    const { contract: { statusList }, goToArchive, goToAdd } = this.props;
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
              style={{ width: '192px' }}
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
    ];

    return (
      <Card>
        <InlineForm
          fields={fields}
          action={<Button type="primary" onClick={() => { goToAdd() }}>新增</Button>}
          extra={<Button type="primary" onClick={() => { goToArchive() }}>合同档案</Button>}
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
              name,
              safetyName,
              safetyPhone,
              practicalProvinceLabel,
              practicalCityLabel,
              practicalDistrictLabel,
              practicalTownLabel,
              practicalAddress,
              startDate,
              endDate,
            } = item;
            const practicalAddressLabel = (practicalProvinceLabel || '') + (practicalCityLabel || '') + (practicalDistrictLabel || '') + (practicalTownLabel || '') + (practicalAddress || '');
            const period = startDate && `${startDate || '?'} 至 ${endDate || '?'}`;
            return (
              <List.Item key={id}>
                <Card
                  title={name}
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
                    地址：{practicalAddressLabel || getEmptyData()}
                    </Ellipsis>
                    <Ellipsis tooltip lines={1} className={styles.ellipsisText}>
                    安全负责人：{safetyName || getEmptyData()}
                    </Ellipsis>
                    <Ellipsis tooltip lines={1} className={styles.ellipsisText}>
                    联系电话：{safetyPhone || getEmptyData()}
                    </Ellipsis>
                    <Ellipsis tooltip lines={1} className={styles.ellipsisText}>
                    合同期限：{period || getEmptyData()}
                    </Ellipsis>
                  </div>
                  {this.getMark(1)}
                </Card>
              </List.Item>
          )}}
        />
      </div>
    );
  }

  render() {
    const { loading, isLast, contract: { data: { list, pagination: { total } } } } = this.props;

    return (
      <PageHeaderLayout
        title={title}
        content={<div>服务单位总数：{total} </div>}
      >
        {this.renderForm()}
        {this.renderList()}
        {list.length !== 0  && !isLast && <VisibilitySensor onChange={this.handleLoadMore} />}
        {loading && !isLast && (
          <div style={{ paddingTop: '50px', textAlign: 'center' }}>
            <Spin />
          </div>
        )}
      </PageHeaderLayout>
    );
  }
}
