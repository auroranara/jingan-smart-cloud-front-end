import React, { Component, Fragment } from 'react';
import { Spin, Card, Button } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import CustomForm from '@/jingan-components/CustomForm';
import { connect } from 'dva';
import router from 'umi/router';
import moment from 'moment';

const listUrl = '/major-hazard-info/storage-area-management/list';
const HEADER = '储罐区管理';
const TITLE = '详情';
const BREADCRUMB = [
  {
    title: '首页',
    name: '首页',
    href: '/',
  },
  {
    title: '重大危险源基本信息',
    name: '重大危险源基本信息',
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
  { id: 'code', label: '统一编码' },
  { id: 'areaName', label: '储罐区名称' },
  { id: 'location', label: '在厂区的位置' },
  { id: 'environmentArea', label: '所处环境功能区' },
  { id: 'safeSpace', label: '周边安全防护间距（m）' },
  { id: 'spaceArea', label: '储罐区面积（㎡）' },
  { id: 'hasCoffer', label: '有无围堰' },
  { id: 'cofferArea', label: '围堰所围面积' },
  { id: 'areaVolume', label: '储罐区总容积（m³）' },
  { id: 'commonStore', label: '常规存储量' },
  { id: 'minSpace', label: '两罐间最小间距（m）' },
  { id: 'hasPassage', label: '有无消防通道' },
  { id: 'loadType', label: '装卸方式' },
  { id: 'dangerType', label: '装卸危险化学品种类' },
];

const EnvironmentAreas = ['一类区', '二类区', '三类区'];

@connect(({ storageAreaManagement, loading, user }) => ({
  storageAreaManagement,
  user,
  loading: loading.models.storageAreaManagement,
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
      type: 'storageAreaManagement/fetchTankAreaList',
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
      user: {
        currentUser: { unitType },
      },
      storageAreaManagement: { list = [{}] },
      loading,
    } = this.props;
    const detail = list[0] || {};
    const items =
      detail.hasCoffer === '1' ? dspItems : dspItems.filter(item => item.id !== 'cofferArea');
    const fields = items.map(item => {
      const { id } = item;
      const data = detail[id];
      let renderItem = <span>{data || NO_DATA}</span>;
      if (id === 'hasCoffer' || id === 'hasPassage') {
        renderItem = <span>{data === '0' ? '无' : '有'}</span>;
      } else if (id === 'environmentArea') {
        renderItem = <span>{EnvironmentAreas[data - 1] || NO_DATA}</span>;
      }
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
              fields={unitType === 4 ? fields.slice(1, fields.length) : fields}
              searchable={false}
              resetable={false}
              action={
                <Fragment>
                  <Button onClick={e => router.push(`/major-hazard-info/storage-area-management/edit/${detail.id}`)}>编辑</Button>
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
