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
} from './StorageEdit';
import MapMarkerSelect from '@/components/MapMarkerSelect';
import codes from '@/utils/codes';
import { hasAuthority } from '@/utils/customAuth';
import styles from './Detail.less';

const {
  baseInfo: {
    storageManagement: { edit: editCode },
  },
} = codes;
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
const NO_DATA = '---';

@connect(({ baseInfo, loading, user, personnelPosition }) => ({
  baseInfo,
  user,
  personnelPosition,
  loading: loading.models.baseInfo,
}))
export default class StorageDetail extends Component {
  state = {};

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
      callback: detail => {
        const { companyId, buildingId } = detail;
        if (!companyId) return;
        this.fetchBuildings({ payload: { pageNum: 1, pageSize: 0, company_id: companyId } });
        this.fetchFloors({ payload: { pageNum: 1, pageSize: 0, building_id: buildingId } });
      },
    });
  };

  /**
   * 获取所属建筑列表
   */
  fetchBuildings = actions => {
    const { dispatch } = this.props;
    dispatch({
      type: 'personnelPosition/fetchBuildings',
      ...actions,
    });
  };

  /**
   * 获取楼层
   */
  fetchFloors = actions => {
    const { dispatch } = this.props;
    dispatch({
      type: 'personnelPosition/fetchFloors',
      ...actions,
    });
  };

  handleBackButtonClick = () => {
    // router.push(listUrl);
    window.close();
  };

  generateJudgeLabel = value => (+value === 1 ? '有' : '无');

  render() {
    const {
      user: {
        currentUser: { unitType, permissionCodes },
      },
      baseInfo: { storageTankDetail: detail },
      loading,
      personnelPosition: {
        map: {
          buildings = [], // 建筑物列表
          floors = [], // 楼层列表
        },
      },
    } = this.props;
    const { pressureVessel, highRiskTank, cofferdam, locationType } = detail;
    const dspItems = [
      ...(unitType === 4 ? [] : [{ id: 'companyName', label: '单位名称' }]),
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
      ...(pressureVessel === '1'
        ? [
            {
              id: 'pressureRate',
              label: '压力等级',
              render: ({ pressureRate }) => (pressureList[pressureRate - 1] || {}).value || NO_DATA,
            },
            { id: 'designPressure', label: '设计压力（KPa）' },
          ]
        : []),
      {
        id: 'tankLocationCate',
        label: '储罐位置分类',
        render: ({ tankLocationCate }) =>
          (storageAreaList[tankLocationCate - 1] || {}).value || NO_DATA,
      },
      {
        id: 'tankType',
        label: '储罐形式',
        render: ({ tankType }) => (storagTypeList[tankType - 1] || {}).value || NO_DATA,
      },
      {
        id: 'tankStructure',
        label: '储罐结构',
        render: ({ tankStructure }) => (constructList[tankStructure - 1] || {}).value || NO_DATA,
      },
      {
        id: 'tankMaterial',
        label: '储罐材质',
        render: ({ tankMaterial }) => (materialList[tankMaterial - 1] || {}).value || NO_DATA,
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
      ...(highRiskTank === '1' ? [{ id: 'highRiskTankSystem', label: '高危储罐自控系统' }] : []),
      { id: 'safeEquip', label: '安全设备' },
      {
        id: 'cofferdam',
        label: '有无围堰',
        render: ({ cofferdam }) => (+cofferdam === 1 ? '是' : '否'),
      },
      ...(cofferdam === '1' ? [{ id: 'cofferdamArea', label: '围堰所围面积（㎡）' }] : []),
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
      {
        id: 'scenePhotoList',
        label: '现场照片',
        render: ({ scenePhotoList }) => (
          <div>
            {!scenePhotoList || scenePhotoList.length === 0
              ? NO_DATA
              : scenePhotoList.map((img, i) => (
                  <div key={i}>
                    <a
                      className={styles.clickable}
                      href={img.webUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {img.fileName}
                    </a>
                  </div>
                ))}
          </div>
        ),
      },
      {
        id: 'otherFileList',
        label: '附件',
        render: ({ otherFileList }) => (
          <div>
            {!otherFileList || otherFileList.length === 0
              ? NO_DATA
              : otherFileList.map((img, i) => (
                  <div key={i}>
                    <a
                      className={styles.clickable}
                      href={img.webUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {img.fileName}
                    </a>
                  </div>
                ))}
          </div>
        ),
      },
      {
        id: 'locationType',
        label: '区域位置录入方式',
        render: ({ locationType }) => (+locationType === 1 ? '手填' : '选择建筑物-楼层'),
      },
      ...(+locationType === 1
        ? [{ id: 'area', label: '所在区域' }, { id: 'location', label: '位置详情' }]
        : [
            {
              id: 'buildingFloor',
              label: '所属建筑物楼层',
              render: ({ buildingId, floorId }) => (
                <div>
                  {(buildings.find(item => item.id === buildingId) || {}).buildingName || ''}
                  {` - `}
                  {(floors.find(item => item.id === floorId) || {}).floorName || ''}
                </div>
              ),
            },
            { id: 'location', label: '详细位置' },
          ]),
      {
        id: 'mapLocation',
        label: '地图定位',
        render: ({ pointFixInfoList, companyId }) => {
          if (pointFixInfoList && pointFixInfoList.length) {
            let { xnum, ynum, znum, groupId, areaId } = pointFixInfoList[0];
            const coord = { x: +xnum, y: +ynum, z: +znum };
            groupId = +groupId;
            return (
              <MapMarkerSelect companyId={companyId} readonly value={{ groupId, coord, areaId }} />
            );
          } else {
            return NO_DATA;
          }
        },
      },
    ];
    const fields = dspItems.map(item => {
      const { id, render } = item;
      return {
        ...item,
        span: SPAN,
        labelCol: LABELCOL,
        wrapperCol: WRAPPERCOL,
        render:
          render && typeof render === 'function'
            ? () => <span>{render(detail)}</span>
            : () => <span>{detail[id] || NO_DATA}</span>,
      };
    });
    const hasEditAuthority = hasAuthority(editCode, permissionCodes);

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
                  {/* <Button
                    onClick={e =>
                      router.push(`/major-hazard-info/storage-management/edit/${detail.id}`)
                    }
                    type="primary"
                    disabled={!hasEditAuthority}
                  >
                    编辑
                  </Button> */}
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
