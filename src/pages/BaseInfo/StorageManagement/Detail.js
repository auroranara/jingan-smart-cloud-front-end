import React, { Component, Fragment } from 'react';
import { Spin, Card, Button, Table } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import CustomForm from '@/jingan-components/CustomForm';
import { connect } from 'dva';
import router from 'umi/router';
import moment from 'moment';
import {
  storageAreaList,
  storagTypeList,
  constructList,
  materialList,
  pressureList,
  selectTypeList,
} from './StorageEdit';

const listUrl = '/major-hazard-info/storage-management/list';
const HEADER = '储罐管理';
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

@connect(({ baseInfo, loading, user }) => ({
  baseInfo,
  user,
  loading: loading.models.baseInfo,
}))
export default class StorehouseDetail extends Component {
  state = {
    storageList: [],
  };

  componentDidMount() {
    this.getDetail();
  }

  getDetail = () => {
    const {
      dispatch,
      match: { params: { id = null } = {} },
    } = this.props;
    dispatch({
      type: 'baseInfo/fetchStorageTankDetail',
      payload: {
        pageNum: 1,
        pageSize: 10,
        id,
      },
    });
    // 获取存储物质及常规存储量
    // this.fetchChemicalList({
    //   payload: { pageNum: 1, pageSize: 0 },
    //   callback: ({ list }) => {
    //     this.setState({ storageList: list });
    //   },
    // });
  };

  // 获取装卸危险化学品种类列表
  fetchChemicalList = actions => {
    const {
      dispatch,
      match: {
        params: { id },
      },
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
    });
  };

  handleBackButtonClick = () => {
    router.push(listUrl);
  };

  generateJudgeLabel = value => (+value === 1 ? '有' : '无');

  render() {
    const {
      user: {
        currentUser: { unitType },
      },
      baseInfo: { storageTankDetail: detail },
      loading,
    } = this.props;
    const { storageList } = this.state;
    const dspItems = [
      { id: 'companyName', label: '单位名称' },
      { id: 'unifiedCode', label: '统一编码' },
      { id: 'tankName', label: '储罐名称' },
      { id: 'number', label: '储罐编号' },
      { id: 'tankGroupNumber', label: '所属罐组编号' },
      { id: 'areaName', label: '所属储罐区' },
      { id: 'tankVolume', label: '储罐容积（m³）' },
      { id: 'tankRadius', label: '储罐半径（m）' },
      { id: 'tankHeight', label: '储罐高度（m）' },
      {
        id: 'designReserves',
        label: '设计储量',
        render: ({ designReserves, designReservesUnit }) =>
          designReserves ? designReserves + 't' : NO_DATA,
      },
      {
        id: 'pressureVessel',
        label: '是否压力容器',
        render: ({ pressureVessel }) => (+pressureVessel === 1 ? '是' : '否'),
      },
      {
        id: 'pressureRate',
        label: '压力等级',
        render: ({ pressureRate }) => pressureList[pressureRate - 1] || NO_DATA,
      },
      { id: 'designPressure', label: '设计压力（KPa）' },
      {
        id: 'tankLocationCate',
        label: '储罐位置分类',
        render: ({ tankLocationCate }) => storageAreaList[tankLocationCate - 1] || NO_DATA,
      },
      {
        id: 'tankType',
        label: '储罐形式',
        render: ({ tankType }) => storagTypeList[tankType - 1] || NO_DATA,
      },
      {
        id: 'tankStructure',
        label: '储罐结构',
        render: ({ tankStructure }) => constructList[tankStructure - 1] || NO_DATA,
      },
      {
        id: 'tankMaterial',
        label: '储罐材质',
        render: ({ tankMaterial }) => materialList[tankMaterial - 1] || NO_DATA,
      },
      { id: 'feedDischargMode', label: '进出料方式' },
      {
        id: 'productDate',
        label: '投产日期',
        render: ({ productDate }) =>
          productDate ? moment(productDate).format('YYYY-MM-DD') : NO_DATA,
      },
      { id: 'chineName', label: '存储介质' },
      {
        id: 'highRiskTank',
        label: '是否高危储罐',
        render: ({ highRiskTank }) => (+highRiskTank === 1 ? '是' : '否'),
      },
      { id: 'highRiskTankSystem', label: '高危储罐自控系统' },
      { id: 'safeEquip', label: '安全设备' },
      {
        id: 'cofferdam',
        label: '有无围堰',
        render: ({ cofferdam }) => (+cofferdam === 1 ? '是' : '否'),
      },
      { id: 'cofferdamArea', label: '围堰所围面积（㎡）' },
      {
        id: 'setFire',
        label: '是否配套火柜',
        render: ({ setFire }) => (+setFire === 1 ? '是' : '否'),
      },
      {
        id: 'warmCool',
        label: '是否设置保温/保冷',
        render: ({ warmCool }) => (+warmCool === 1 ? '是' : '否'),
      },
      {
        id: 'autoSpray',
        label: '是否设置自动喷淋',
        render: ({ autoSpray }) => (+autoSpray === 1 ? '是' : '否'),
      },
      {
        id: 'fireWaterFoam',
        label: '是否设置消防水炮/泡沫炮',
        render: ({ fireWaterFoam }) => (+fireWaterFoam === 1 ? '是' : '否'),
      },
      { id: 'remarks', label: '备注' },
      // { id: 'scenePhotoList', label: '现场照片' },
      // { id: 'otherFileList', label: '附件' },

      // { id: 'environmentArea', label: '所处环境功能区', render: ({ environmentArea }) => EnvironmentAreas[environmentArea - 1] || NO_DATA },
      // { id: 'newTankId', label: '选择包含的储罐', render: ({ tankNames }) => tankNames && tankNames.length ? tankNames.join('、') : NO_DATA },
      // { id: 'minSpace', label: '两罐间最小间距（m）' },
      // { id: 'hasCoffer', label: '有无围堰', render: ({ hasCoffer }) => this.generateJudgeLabel(hasCoffer) },
      // { id: 'cofferArea', label: '围堰所围面积（㎡）' },
      // { id: 'safeSpace', label: '周边安全防护间距（m）' },
      // { id: 'hasPassage', label: '有无消防通道', render: ({ hasPassage }) => this.generateJudgeLabel(hasPassage) },
      // { id: 'dangerType', label: '装卸危险化学品种类', render: ({ dangerTypeList }) => dangerTypeList && dangerTypeList.length ? dangerTypeList.join('、') : NO_DATA },
      // { id: 'loadType', label: '装卸方式' },
    ];
    const items =
      detail.hasCoffer === '1' ? dspItems : dspItems.filter(item => item.id !== 'cofferArea');
    const fields = items.map(item => {
      const { id, render } = item;
      return {
        ...item,
        span: SPAN,
        labelCol: LABELCOL,
        wrapperCol: WRAPPERCOL,
        render:
          render && typeof render === 'function'
            ? () => <span>{render(detail)}</span>
            : () => <span>{detail[id]}</span>,
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
                  <Button
                    onClick={e =>
                      router.push(`/major-hazard-info/storage-area-management/edit/${detail.id}`)
                    }
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
