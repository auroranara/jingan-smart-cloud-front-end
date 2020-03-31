import React, { Component, Fragment } from 'react';
import { Spin, Card, Button } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import CustomForm from '@/jingan-components/CustomForm';
import { connect } from 'dva';
import router from 'umi/router';
import moment from 'moment';

import styles from './index.less';

const listUrl = '/major-hazard-info/storehouse/list';
const HEADER = '库房管理';
const TITLE = '详情';
const BREADCRUMB = [
  {
    title: '首页',
    name: '首页',
    href: '/',
  },
  {
    title: '基本信息',
    name: '基本信息',
  },
  {
    title: HEADER,
    name: HEADER,
    href: listUrl,
  },
  {
    title: TITLE,
    name: TITLE,
  },
];
const BUTTON_WRAPPER_SPAN = {
  sm: 24,
  xs: 24,
};
const SPAN = { sm: 24, xs: 24 };
const LABELCOL = { span: 6 };
const WRAPPERCOL = { span: 13 };
const NO_DATA = '暂无数据';

const dspItems = [
  { id: 'companyName', label: '单位名称' },
  { id: 'code', label: '库房编码' },
  { id: 'number', label: '库房序号' },
  { id: 'name', label: '库房名称' },
  { id: 'aname', label: '所属库区' },
  { id: 'anumber', label: '库区编号' },
  { id: 'position', label: '区域位置' },
  { id: 'area', label: '库房面积（㎡）' },
  { id: 'style', label: '库房形式' },
  { id: 'produceDate', label: '投产日期' },
  { id: 'firewall', label: '有无防火墙' },
  { id: 'materialsName', label: '贮存物质名称' },
  { id: 'dangerWarehouse', label: '是否危化品仓库' },
  { id: 'toxicWarehouse', label: '是否剧毒化学品仓库' },
  { id: 'dangerLevel', label: '火灾危险性等级' },
  { id: 'spary', label: '是否设置自动喷淋' },
  { id: 'lowTemperature', label: '是否低温仓储仓库' },
  // { id: 'dangerSource', label: '是否构成重大危险源' },
];

// const dangerSourceItems = [
//   { id: 'dangerSourceUnit', label: '所属危险化学品重大危险源单元' },
//   { id: 'unitCode', label: '所属重大危险源单元编号' },
// ];

const StorehouseStyles = ['封闭式', '半封闭式', '露天'];
const DangerLevels = ['甲', '乙', '丙', '丁', '戊'];

@connect(({ storehouse, loading, user }) => ({
  storehouse,
  user,
  loading: loading.models.storehouse,
}))
export default class StorehouseDetail extends Component {
  componentDidMount() {
    this.getDetail();
  }

  getDetail = () => {
    const {
      dispatch,
      match: { params: { id = null } = {} },
    } = this.props;
    dispatch({
      type: 'storehouse/fetchStorehouseList',
      payload: {
        pageNum: 1,
        pageSize: 10,
        id,
      },
    });
  };

  handleBackButtonClick = () => {
    router.push(listUrl);
  };

  render() {
    const {
      storehouse: { list = [{}] },
      loading,
      user: {
        currentUser: { unitType },
      },
    } = this.props;
    const detail = list[0] || {};
    const items = unitType === 4 ? dspItems.filter(item => item.id !== 'companyName') : dspItems;
    const fields = items.map(item => {
      const { id } = item;
      const data = detail[id];
      let renderItem = <span>{data || NO_DATA}</span>;
      if (id === 'firewall') {
        renderItem = <span>{data === '0' ? '无' : '有'}</span>;
      } else if (id === 'style') {
        renderItem = <span>{StorehouseStyles[data - 1] || NO_DATA}</span>;
      } else if (id === 'dangerLevel') {
        renderItem = <span>{DangerLevels[data - 1] || NO_DATA}</span>;
      } else if (id === 'produceDate') {
        renderItem = <span>{moment(data).format('YYYY-MM-DD') || NO_DATA}</span>;
      } else if (
        [
          'dangerWarehouse',
          'toxicWarehouse',
          'toxicWarehouse',
          'spary',
          'lowTemperature',
          'dangerSource',
        ].includes(id)
      ) {
        renderItem = <span>{data === '0' ? '否' : '是'}</span>;
      } else if (id === 'materialsName')
        renderItem = <span>{data ? JSON.parse(data)[0].chineName : ''}</span>;
      return {
        ...item,
        span: SPAN,
        labelCol: LABELCOL,
        wrapperCol: WRAPPERCOL,
        render: () => {
          return renderItem;
        },
      };
    });

    return (
      <PageHeaderLayout title={TITLE} breadcrumbList={BREADCRUMB}>
        <Spin spinning={loading}>
          <Card bordered={false}>
            <CustomForm
              buttonWrapperSpan={BUTTON_WRAPPER_SPAN}
              buttonWrapperStyle={{ textAlign: 'center' }}
              fields={fields}
              searchable={false}
              resetable={false}
              action={
                <Fragment>
                  <Button
                    onClick={e => router.push(`/major-hazard-info/storehouse/edit/${detail.id}`)}
                  >
                    编辑
                  </Button>
                  <Button onClick={this.handleBackButtonClick}>返回</Button>
                </Fragment>
              }
            />
          </Card>
        </Spin>
      </PageHeaderLayout>
    );
  }
}
