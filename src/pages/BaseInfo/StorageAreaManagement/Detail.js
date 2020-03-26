import React, { Component, Fragment } from 'react';
import { Spin, Card, Button, Table } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import CustomForm from '@/jingan-components/CustomForm';
import { connect } from 'dva';
import router from 'umi/router';
// import moment from 'moment';

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

const EnvironmentAreas = ['一类区', '二类区', '三类区'];

@connect(({ storageAreaManagement, loading, user }) => ({
  storageAreaManagement,
  user,
  loading: loading.models.storageAreaManagement,
}))
export default class StorehouseDetail extends Component {

  state = {
    storageList: [],
  };

  componentDidMount () {
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
    // 获取存储物质及常规存储量
    this.fetchChemicalList({
      payload: { pageNum: 1, pageSize: 0 },
      callback: ({ list }) => {
        this.setState({ storageList: list });
      },
    })
  };

  // 获取装卸危险化学品种类列表
  fetchChemicalList = (actions) => {
    const {
      dispatch,
      match: { params: { id } },
      storageAreaManagement: { list = [{}] },
    } = this.props;
    const detail = list[0] || {};
    const newTankId = Array.isArray(detail.tankIds) ? detail.tankIds.join(',') : undefined;
    dispatch({
      type: 'storehouse/fetchChemicalList',
      ...actions,
      payload: {
        ...actions.payload,
        newTankId,
        id,
      },
    })
  };

  handleBackButtonClick = () => {
    router.push(listUrl);
  };

  generateJudgeLabel = value => +value === 1 ? '有' : '无'

  render () {
    const {
      user: {
        currentUser: { unitType },
      },
      storageAreaManagement: { list = [{}] },
      loading,
    } = this.props;
    const { storageList } = this.state;
    const dspItems = [
      { id: 'companyName', label: '单位名称' },
      { id: 'code', label: '统一编码' },
      { id: 'areaName', label: '储罐区名称' },
      { id: 'location', label: '区域位置' },
      { id: 'spaceArea', label: '储罐区面积（㎡）' },
      { id: 'areaVolume', label: '储罐区总容积（m³）' },
      { id: 'environmentArea', label: '所处环境功能区', render: ({ environmentArea }) => EnvironmentAreas[environmentArea - 1] || NO_DATA },
      { id: 'newTankId', label: '选择包含的储罐', render: ({ tankNames }) => tankNames && tankNames.length ? tankNames.join('、') : NO_DATA },
      { id: 'minSpace', label: '两罐间最小间距（m）' },
      { id: 'hasCoffer', label: '有无围堰', render: ({ hasCoffer }) => this.generateJudgeLabel(hasCoffer) },
      { id: 'cofferArea', label: '围堰所围面积' },
      { id: 'safeSpace', label: '周边安全防护间距（m）' },
      { id: 'hasPassage', label: '有无消防通道', render: ({ hasPassage }) => this.generateJudgeLabel(hasPassage) },
      { id: 'dangerType', label: '装卸危险化学品种类', render: ({ dangerTypeList }) => dangerTypeList && dangerTypeList.length ? dangerTypeList.join('、') : NO_DATA },
      { id: 'loadType', label: '装卸方式' },
      {
        id: 'storageList', label: '存储物质及常规存储量', render: () => storageList && storageList.length ? (
          <Table
            rowKey="storageId"
            dataSource={storageList}
            bordered
            columns={[
              {
                title: '统一编码',
                dataIndex: 'code',
                align: 'center',
                width: 200,
              },
              {
                title: '品名',
                dataIndex: 'chineName',
                align: 'center',
                width: 200,
              },
              {
                title: 'CAS号',
                dataIndex: 'casNo',
                align: 'center',
                width: 200,
              },
              {
                title: '常规存储量（t）',
                dataIndex: 'nomalStorage',
                align: 'center',
                width: 200,
              },
            ]}
            pagination={false}
          />
        ) : NO_DATA,
      },
    ];
    const detail = list[0] || {};
    const items =
      detail.hasCoffer === '1' ? dspItems : dspItems.filter(item => item.id !== 'cofferArea');
    const fields = items.map(item => {
      const { id, render } = item;
      return {
        ...item,
        span: SPAN,
        labelCol: LABELCOL,
        wrapperCol: WRAPPERCOL,
        render: render && typeof (render) === 'function' ? () => (<span>{render(detail)}</span>) : () => <span>{detail[id]}</span>,
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
