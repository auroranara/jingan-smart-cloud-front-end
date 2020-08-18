import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import {
  Input,
  Button,
  Card,
  Col,
  Row,
  Select,
  Divider,
  Table,
  Popconfirm,
  message,
  Radio,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import PagingSelect from '@/jingan-components/PagingSelect';
import Coordinate from './Coordinate/index';
import CompanyModal from '../../BaseInfo/Company/CompanyModal';
import CheckModal from '../../LawEnforcement/Illegal/checkModal';
import Upload from '@/jingan-components/Form/Upload';
// 地图定位
import MapMarkerSelect from '@/components/MapMarkerSelect';
import styles from './RiskPointEdit.less';
import MarkerImg from '@/pages/BigPlatform/ChemicalV2/imgs/risk-point.png';
import OtherMarkerImg from '@/pages/BigPlatform/ChemicalV2/imgs/marker-risk-point-gray.png';
import MarkerGrayImg from '@/pages/BigPlatform/ChemicalV2/imgs/risk-point-gray.png';
import MarkerActiveImg from '@/pages/BigPlatform/ChemicalV2/imgs/risk-point-active.png';
// import { OPE } from '@/pages/RoleAuthorization/Role/utils';
import { EquipColumns } from './utils';

const { Group: RadioGroup } = Radio;
const { TextArea } = Input;

const fengMap = fengmap; // eslint-disable-line
const { Option } = Select;
let flow_id = [];
const PageSize = 10;

//  默认分页参数
const defaultPagination = {
  pageNum: 1,
  pageSize: 10,
};

/* 标题---编辑 */
const editTitle = '编辑风险点';
/* 标题---新增 */
const addTitle = '新增风险点';

/* 表单标签 */
const fieldLabels = {
  riskPointName: '风险点名称：',
  number: '编号：',
  bindRFID: '绑定RFID：',
  ewm: '二维码：',
  nfc: 'NFC：',
  checkContent: '检查内容',
  picLocation: '平面图定位',
  checkCycle: '检查周期方案：',
  cycleType: '自定义周期：',
  RecommendCycle: '推荐检查周期:',
  mapLocation: '地图定位',
  isShow: '该点位是否在化工安全生产驾驶舱显示',
};

const EquipTypes = {
  1: 'getProductEquipList',
  2: 'getFacilityList',
  3: 'getSpecialEquipList',
  4: 'getKeyPartList',
  5: 'getSafeFacilitiesList',
};

// const COLUMNS = [
//   {
//     title: '标签编号',
//     dataIndex: 'location_code',
//     key: 'location_code',
//     align: 'center',
//     width: 120,
//   },
//   {
//     title: '二维码',
//     dataIndex: 'qr_code',
//     key: 'qr_code',
//     align: 'center',
//     width: 90,
//   },
//   {
//     title: 'NFC',
//     dataIndex: 'nfc_code',
//     key: 'nfc_code',
//     align: 'center',
//     width: 150,
//   },
//   {
//     title: '绑定的点位',
//     dataIndex: 'objectTitles',
//     key: 'objectTitles',
//     align: 'center',
//     width: 200,
//     render: val => {
//       return val && val.length > 0 ? val.join('、') : '————';
//     },
//   },
// ];

const COLUMNS = [
  {
    title: '标签编号',
    dataIndex: 'locationCode',
    key: 'locationCode',
    align: 'center',
    width: 120,
  },
  {
    title: '二维码',
    dataIndex: 'qrCode',
    key: 'qrCode',
    align: 'center',
    width: 90,
  },
  {
    title: 'NFC',
    dataIndex: 'nfcCode',
    key: 'nfcCode',
    align: 'center',
    width: 150,
  },
  {
    title: '绑定点位数量',
    dataIndex: 'bindPointCount',
    key: 'bindPointCount',
    align: 'center',
    width: 100,
  },
];


const getCycleType = i => {
  switch (i) {
    case 'every_day':
      return '每日一次';
    case 'every_week':
      return '每周一次';
    case 'every_month':
      return '每月一次';
    case 'every_quarter':
      return '每季度一次';
    case 'every_half_year':
      return '每半年一次';
    case 'every_year':
      return '每年一次';
    default:
      break;
  }
};

// let imgTypes = [];
@connect(
  ({
    illegalDatabase,
    buildingsInfo,
    riskPointManage,
    company,
    user,
    map,
    chemical,
    riskArea,
    productionEquipments,
    productionFacility,
    specialEquipment,
    keyPart,
    safeFacilities,
    loading,
  }) => ({
    illegalDatabase,
    riskPointManage,
    buildingsInfo,
    company,
    user,
    chemical,
    map,
    riskArea,
    productionEquipments,
    productionFacility,
    specialEquipment,
    keyPart,
    safeFacilities,
    loading: loading.models.riskPointManage,
    areaLoading: loading.models.riskArea,
    equipLoading:
      loading.effects['riskPointManage/getProductEquipList'] ||
      loading.effects['riskPointManage/getFacilityList'] ||
      loading.effects['riskPointManage/getSpecialEquipList'] ||
      loading.effects['riskPointManage/getKeyPartList'] ||
      loading.effects['riskPointManage/getSafeFacilitiesList'] ||
      false,
  })
)
@Form.create()
export default class RiskPointEdit extends PureComponent {
  state = {
    rfidVisible: false, // RFID模态框是否可见
    checkVisible: false, // 检查内容模态框是否可见
    picModalVisible: false, // 定位模态框是否可见
    flowList: [], // 当前检查内容list
    picList: [], // 当前平面图信息list
    isDisabled: false, // 平面图新增按钮是否启用
    isEdit: true,
    pointFixInfoList: [],
    selectedRowKeys: [],
    typeIndex: '',
    xNumCurrent: '',
    yNumCurrent: '',
    imgIdCurrent: '',
    isImgSelect: true,
    imgTypes: [],
    imgIndex: '',
    areaModalVisible: false,
    selectedArea: {},
    selectedEquip: {},
    equipModalVisible: false,
    selectedCompany: {},
    companyModalVisible: false,
  };

  // 返回到列表页面
  goBack = () => {
    const {
      dispatch,
      match: {
        params: { id },
      },
      location: {
        query: { type = 'all' },
      },
    } = this.props;
    // if (id) window.close();
    // else 
    dispatch(routerRedux.push(`/risk-control/risk-point-manage/list/${type}`));
  };

  /* 去除左右两边空白 */
  handleTrim = e => e.target.value.trim();

  // 挂载后
  componentDidMount() {
    const {
      dispatch,
      match: {
        params: { id },
      },
      form: { setFieldsValue },
      user: {
        currentUser: { unitType, unitId, unitName },
      },
    } = this.props;
    const payload = { pageSize: PageSize, pageNum: 1 };
    // 获取业务分类
    dispatch({
      type: 'illegalDatabase/fetchOptions',
    });
    // 获取行业类别
    dispatch({
      type: 'riskPointManage/fetchIndustryDict',
    });
    // this.fetchPointLabel({ payload });
    this.fetchCheckContent({ payload });
    // 清空
    flow_id = [];

    if (+unitType === 4) this.setState({ selectedCompany: { id: unitId, name: unitName } });

    if (id) {
      // 根据id获取详情
      dispatch({
        type: 'riskPointManage/fetchRiskPointDetail',
        payload: {
          id,
        },
        callback: response => {
          const {
            itemFlowList,
            pointFixInfoList,
            companyId,
            companyName,
            areaName,
            areaId,
            equipmentId,
            equipmentName,
            equipmentType,
          } = response;

          // const buildingList = pointFixInfoList.filter(item => item.imgType === 2);
          // const buildingId = buildingList.map(item => item.buildingId).join('');
          // const floorId = buildingList.map(item => item.floorId).join('');
          this.fetchMarkers(companyId);

          this.setState({ flowList: itemFlowList });
          if (pointFixInfoList && pointFixInfoList.length) {
            let { xnum, ynum, znum, groupId, areaId, isShow } = pointFixInfoList[0];
            const coord = { x: +xnum, y: +ynum, z: +znum };
            groupId = +groupId;
            setFieldsValue({ isShow: isShow || '1', mapLocation: { groupId, coord, areaId } });
          }
          flow_id = itemFlowList.map(d => {
            return { flow_id_data: d.flow_id_data, flow_id: d.flow_id };
          });

          // 获取推荐检查周期
          dispatch({
            type: 'riskPointManage/fetchCheckCycle',
            payload: {
              riskLevel: response.riskLevel,
              companyId,
              type: 2,
            },
          });

          dispatch({
            type: `riskPointManage/${EquipTypes[equipmentType]}`,
            payload: { companyId, pageSize: 1, pageNum: 1, id: equipmentId },
            callback: res => {
              const list = res.list || [];
              const equip = list[0] || {};
              this.setState({ selectedEquip: equip });
            },
          });

          this.setState({
            selectedCompany: { id: companyId, name: companyName },
            selectedArea: { id: areaId, areaName },
            // selectedEquip: { id: equipmentId, name: equipmentName },
            // picList: pointFixInfoList.map(item => {
            //   return {
            //     ...item,
            //     isEdit: false,
            //     isDisabled: true,
            //   };
            // }),
          });
        },
      });
    } else {
      // 清空详情
      dispatch({
        type: 'riskPointManage/clearDetail',
      });
      setFieldsValue({ isShow: '1' });
    }
  }

  // 获取其他设备位置
  fetchMarkers = companyId => {
    const { dispatch } = this.props;
    dispatch({
      type: 'chemical/fetchRiskPoint',
      payload: { companyId, pageNum: 1, pageSize: 0 },
    });
  };

  // 点击提交按钮验证表单信息
  handleClickValidate = () => {
    const {
      form: { validateFieldsAndScroll },
      match: {
        params: { id },
      },
      dispatch,
      riskPointManage: { checkCycleData },
      user: {
        currentUser: { unitType, companyId },
      },
    } = this.props;

    const { picList, isDisabled, selectedArea, selectedEquip, selectedCompany } = this.state;

    if (isDisabled === true) {
      return message.error('请先保存平面图定位信息！');
    }

    validateFieldsAndScroll((error, values) => {
      if (!error) {
        this.setState({
          submitting: true,
        });
        const {
          objectTitle,
          locationCode,
          qrCode,
          nfcCode,
          checkCycle,
          recommendCycle,
          cycleType,
          itemCode,
          mapLocation,
          isShow,
        } = values;
        if (+cycleType === 1 && checkCycleData === null) {
          return (
            recommendCycle !== null, message.error('推荐检查周期为空，可以选择自定义检查周期！')
          );
        }

        if (+cycleType === 2 && checkCycle === undefined) {
          return message.error('自定义检查周期不能为空！');
        }
        if (+cycleType === 2 && checkCycle === null) {
          return message.error('自定义检查周期不能为空！');
        }
        let payload = {
          ...values,
          id,
          companyId: selectedCompany.id,
          objectTitle,
          locationCode,
          checkCycle,
          cycleType,
          qrCode,
          nfcCode,
          itemCode,
          itemFlowList: flow_id,
          pointFixInfoList: [],
        };
        if (
          mapLocation &&
          (mapLocation.groupId || mapLocation.groupId === 0) &&
          mapLocation.coord
        ) {
          const { coord, ...resMap } = mapLocation;
          payload.pointFixInfoList = [
            { isShow, imgType: 5, xnum: coord.x, ynum: coord.y, znum: coord.z, ...resMap },
          ];
        }
        const success = () => {
          const msg = id ? '编辑成功' : '新增成功';
          message.success(msg, 1, () => setTimeout(this.goBack, 1000));
          // message.success(msg, 1);
        };
        const error = () => {
          const msg = id ? '修改失败' : '新增失败';
          message.error(msg, 1);
          this.setState({
            submitting: false,
          });
        };
        console.log('payload', payload);
        // return;
        // 如果id存在的话，为编辑
        if (id) {
          dispatch({
            type: 'riskPointManage/fetchRiskPointEdit',
            payload: {
              itemId: id,
              ...payload,
            },
            success,
            error,
          });
        }
        // 不存在id,则为新增
        else {
          dispatch({
            type: 'riskPointManage/fetchRiskPointAdd',
            payload,
            success,
            error,
          });
        }
      }
    });
  };

  // 获取内容(RFID)
  fetchPointLabel = ({ payload }) => {
    const { dispatch } = this.props;
    const { checked, selectedCompany } = this.state;
    const pyd = {
      // noBind: checked === true ? 1 : '',
      companyId: selectedCompany.id,
      ...payload,
    };
    if (checked) pyd.bindStatus = 0;
    dispatch({
      type: 'riskPointManage/fetchNewLabelDict',
      payload: pyd,
    });
  };

  // 显示模态框(RFID)
  handleFocus = e => {
    const payload = { pageSize: PageSize, pageNum: 1 };
    e.target.blur();
    this.setState({ rfidVisible: true });
    this.fetchPointLabel({ payload });
  };

  // 选择按钮点击事件(RFID)
  handleSelect = value => {
    const {
      form: { setFieldsValue },
    } = this.props;
    setFieldsValue({
      // locationCode: value.location_code,
      // qrCode: value.qr_code,
      // nfcCode: value.nfc_code,
      locationCode: value.locationCode,
      qrCode: value.qrCode,
      nfcCode: value.nfcCode,
    });
    this.handleClose();
  };

  // 关闭模态框(RFID)
  handleClose = () => {
    this.setState({
      rfidVisible: false,
    });
  };

  onChangeCheckBox = e => {
    const { dispatch } = this.props;
    const { selectedCompany } = this.state;
    const isChecked = e.target.checked;
    const payload = {
      companyId: selectedCompany.id,
      // noBind: isChecked === true ? 1 : '',
      pageNum: 1,
      pageSize: 10,
    };
    if (isChecked) payload.bindStatus = 0;
    dispatch({
      type: 'riskPointManage/fetchNewLabelDict',
      payload,
    });
    this.setState({
      checked: isChecked,
    });
  };

  // 渲染模态框(RFID)
  renderRfidModal() {
    const {
      loading,
      riskPointManage: { newLabelModal: labelModal },
    } = this.props;
    const { rfidVisible, checked } = this.state;

    const setField = [
      {
        id: 'locationCode',
        render() {
          return <Input placeholder="请输入标签编号" />;
        },
      },
    ];

    return (
      <CompanyModal
        title="选择点位标签"
        loading={loading}
        visible={rfidVisible}
        columns={COLUMNS}
        modal={labelModal}
        fetch={this.fetchPointLabel}
        onSelect={this.handleSelect}
        onClose={this.handleClose}
        field={setField}
        onChangeCheckBox={this.onChangeCheckBox}
        checked={checked}
        bindPoint
      />
    );
  }

  // 显示模态框(检查内容)
  handleContentModal = e => {
    const { dispatch, location: { query: { companyId } } } = this.props;
    e.target.blur();
    this.setState({ checkVisible: true });
    // 初始化表格
    dispatch({
      type: 'illegalDatabase/fetchDtoList',
      payload: { ...defaultPagination, companyId },
    });
  };

  // 获取内容（检查内容）
  fetchCheckContent = ({ payload }) => {
    const { dispatch, location: { query: { companyId } } } = this.props;
    dispatch({
      type: 'illegalDatabase/fetchDtoList',
      payload: { ...payload, companyId },
    });
  };

  // 关闭模态框(检查内容)
  handleCloseCheck = () => {
    this.setState({ checkVisible: false });
  };

  // 删除检查内容添加项
  handleDeleteCheck = (id, index) => {
    const flowList = [...this.state.flowList];
    this.setState({
      flowList: flowList.filter((item, i) => i !== index),
    });
    flow_id = flow_id.filter(d => d.flow_id_data !== id);
  };

  // 渲染模态框(检查内容)
  renderCheckModal() {
    const {
      illegalDatabase: { checkModal, businessTypes },
      loading,
      riskPointManage: {
        industryData: { list = [] },
      },
    } = this.props;
    const { checkVisible, flowList } = this.state;

    const checkCOLUMNS = [
      {
        title: '检查项名称',
        dataIndex: 'object_title',
        key: 'object_id',
        align: 'center',
        width: 140,
      },
      {
        title: '所属行业',
        dataIndex: 'industry',
        key: 'industry',
        align: 'center',
        width: 90,
      },
      {
        title: '业务分类',
        dataIndex: 'business_type',
        key: 'business_type',
        align: 'center',
        width: 100,
      },
    ];

    const contentCOLUMNS = [
      {
        title: '检查内容',
        dataIndex: 'flow_name',
        key: 'flow_name',
        align: 'center',
        width: 300,
      },
      {
        title: '隐患等级',
        dataIndex: 'danger_level',
        key: 'danger_level',
        align: 'center',
        width: 110,
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        align: 'center',
        width: 90,
        render: (text, record) => (
          <span>
            <a
              onClick={() => {
                if (
                  flow_id
                    .map(item => item.flow_id_data)
                    .join(',')
                    .indexOf(record.flow_id) >= 0
                ) {
                  return;
                }
                this.setState({ flowList: [...flowList, record] });
                flow_id.push({ flow_id_data: record.flow_id });
              }}
            >
              {flow_id.map(item => item.flow_id_data).indexOf(record.flow_id) >= 0 ? (
                <span style={{ color: '#ccc' }}> 已添加</span>
              ) : (
                '添加'
              )}
            </a>
          </span>
        ),
      },
    ];

    const checkField = [
      {
        id: 'industry',
        render() {
          return (
            <Select placeholder="请选择所属行业">
              {list.map(item => (
                <Option value={item.value} key={item.value}>
                  {item.desc}
                </Option>
              ))}
            </Select>
          );
        },
      },
      {
        id: 'business_type',
        render() {
          return (
            <Select placeholder="请选择业务分类">
              {businessTypes.map(item => (
                <Option value={item.id} key={item.id}>
                  {item.label}
                </Option>
              ))}
            </Select>
          );
        },
      },
      {
        id: 'object_title',
        render() {
          return <Input placeholder="请输入检查项名称" />;
        },
        transform(value) {
          return value.trim();
        },
      },
    ];

    return (
      <CheckModal
        title="选择检查内容"
        loading={loading}
        visible={checkVisible}
        columns={checkCOLUMNS}
        column={contentCOLUMNS}
        checkModal={checkModal}
        fetch={this.fetchCheckContent}
        onClose={this.handleCloseCheck}
        field={checkField}
        actSelect={false}
      />
    );
  }

  // 显示定位模态框
  showModalCoordinate = (index, item) => {
    const { xnum, ynum, fixImgId, imgType } = item;
    const { buildingId, floorId } = this.state;
    const {
      riskPointManage: {
        imgData: { list },
      },
      match: {
        params: { id },
      },
      location: {
        query: { companyId },
      },
      dispatch,
    } = this.props;

    const { typeIndex } = this.state;

    const callback = () => {
      this.setState({
        picModalVisible: true,
        xNumCurrent: xnum,
        yNumCurrent: ynum,
        imgIdCurrent: fixImgId,
        imgIndex: imgType,
      });
    };

    const isImgType = id ? imgType || typeIndex : typeIndex;
    if (!id && list.length === 0) return message.error('该单位暂无图片！');
    // 如果没有选择平面图类型
    if (!isImgType) return message.error('请先选择平面图类型!');
    // 如果是楼层平面图，需要选择建筑物和楼层后才能定位
    if (+isImgType === 2) {
      if (!buildingId) return message.error('请选择所属建筑物!');
      if (!floorId) return message.error('请选择所属楼层!');
      dispatch({
        type: 'riskPointManage/fetchFixImgInfo',
        payload: {
          companyId,
          type: imgType || typeIndex,
          buildingId: buildingId,
          floorId: floorId,
        },
        callback,
      });
    } else {
      // 如果平面图是其他类型
      dispatch({
        type: 'riskPointManage/fetchFixImgInfo',
        payload: {
          companyId,
          type: imgType || typeIndex,
        },
        callback,
      });
    }
    this.coordIndex = index;
  };

  // 定位模态框确定按钮点击事件
  handleCoordinateOk = (value, fourColorImg) => {
    const {
      form: { setFieldsValue },
    } = this.props;
    setFieldsValue({
      [`xnum${this.coordIndex}`]: value.x.toFixed(3),
      [`ynum${this.coordIndex}`]: value.y.toFixed(3),
    });
    this.fixImgId = fourColorImg.id;

    this.setState({
      picModalVisible: false,
      // typeIndex: '',
      isImgSelect: true,
    });
  };

  // 平面图信息新增
  handlePicInfoAdd = () => {
    const { picList } = this.state;
    let nextPicList = picList.concat({ isEdit: true, isDisabled: false });
    this.setState({ picList: nextPicList, isDisabled: true });
  };

  // 获取平面图内容
  getImgInfo = key => {
    const {
      dispatch,
      location: {
        query: { companyId },
      },
    } = this.props;
    if (key === 1 || key === 3 || key === 4) {
      dispatch({
        type: 'riskPointManage/fetchFixImgInfo',
        payload: {
          companyId,
          type: key,
        },
      });
    }
    if (key === 2) {
      dispatch({
        type: 'buildingsInfo/fetchBuildingList',
        payload: {
          company_id: companyId,
          pageSize: 0,
          pageNum: 1,
        },
      });
    }
    this.setState({ picModalVisible: false });
  };

  // 清空当前平面图信息
  handleImgIndex = (e, index) => {
    const {
      form: { setFieldsValue },
    } = this.props;
    const { picList } = this.state;
    const newList = [
      ...picList.slice(0, index),
      {
        isDisabled: false,
        isEdit: true,
      },
      ...picList.slice(index + 1),
    ];
    this.setState({
      isImgSelect: false,
      typeIndex: e,
      picList: newList,
      isEdit: true,
    });
    setFieldsValue({
      [`xnum${index}`]: undefined,
      [`ynum${index}`]: undefined,
    });
  };

  // 获取楼层
  getFloorInfo = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'buildingsInfo/fetchFloorList',
      payload: {
        building_id: id,
        pageSize: 0,
        pageNum: 1,
      },
    });
    this.setState({ buildingId: id });
  };

  // 切换建筑物
  handleBuildingSelect = index => {
    const {
      form: { setFieldsValue },
    } = this.props;
    setFieldsValue({
      [`floorName${index}`]: undefined,
      [`xnum${index}`]: undefined,
      [`ynum${index}`]: undefined,
    });
    this.setState({ picModalVisible: false });
  };

  // 切换楼层
  handleFloorSelect = index => {
    const {
      form: { setFieldsValue },
    } = this.props;
    setFieldsValue({
      [`xnum${index}`]: undefined,
      [`ynum${index}`]: undefined,
    });
    this.setState({ picModalVisible: false });
  };

  // 根据建筑物和楼层获取图片
  getFloorPic = id => {
    const {
      dispatch,
      location: {
        query: { companyId },
      },
    } = this.props;
    const { buildingId, typeIndex } = this.state;
    dispatch({
      type: 'riskPointManage/fetchFixImgInfo',
      payload: {
        companyId,
        type: typeIndex,
        buildingId: buildingId,
        floorId: id,
      },
    });
    this.setState({ floorId: id });
  };

  // 平面图保存
  handlePicSave = index => {
    const {
      form: { getFieldValue },
    } = this.props;
    const { picList, buildingId, floorId } = this.state;
    const newList = [
      ...picList.slice(0, index),
      {
        ...picList[index],
        isDisabled: true,
        isEdit: false,
        ...{
          fixImgId: this.fixImgId,
          buildingId: buildingId,
          floorId: floorId,
          imgType: getFieldValue(`type${index}`),
          xnum: getFieldValue(`xnum${index}`),
          ynum: getFieldValue(`ynum${index}`),
        },
      },
      ...picList.slice(index + 1),
    ];
    if (
      getFieldValue(`type${index}`) === undefined ||
      getFieldValue(`xnum${index}`) === undefined
    ) {
      message.error('请先选择平面图类型定位！');
      this.setState({
        isDisabled: true,
        isEdit: true,
      });
    } else {
      this.setState({
        picList: newList,
        isEdit: false,
        isDisabled: false,
      });
    }
    const imgTypes = newList.map(item => item.imgType);
    this.setState({ imgTypes: imgTypes });
  };

  handlePicEdit = index => {
    const { picList } = this.state;
    const newList = [
      ...picList.slice(0, index),
      { ...picList[index], isDisabled: false, isEdit: true },
      ...picList.slice(index + 1),
    ];
    this.setState({ picList: newList, isEdit: true, isDisabled: true });
  };

  handlePicInfoDelete = index => {
    const { picList, imgTypes } = this.state;
    this.setState({
      picList: picList.filter((item, i) => {
        return i !== index;
      }),
      imgTypes: imgTypes.filter(item => item !== picList[index].imgType),
      isDisabled: false,
      isEdit: false,
    });
  };

  // 渲染平面图信息
  renderPicInfo() {
    const {
      form: { getFieldDecorator, getFieldValue },
      riskPointManage: {
        picType,
        imgData: { list: imgList = [] },
      },
      buildingsInfo: {
        buildingData: { list: buildingList = [] },
        floorData: { list: floorList = [] },
      },
    } = this.props;
    const {
      picModalVisible,
      picList,
      xNumCurrent,
      yNumCurrent,
      imgIdCurrent,
      isImgSelect,
      imgTypes,
    } = this.state;

    const imgTypeList = picType.filter(item => imgTypes.indexOf(item.key) < 0);
    // const urlList = [];
    // imgList.forEach(element => {
    //   const list = element.webUrl.split(',').map(item => {
    //     return { ...element, webUrl: item };
    //   });
    //   urlList.push(...list);
    // });

    return (
      <Row gutter={{ lg: 24, md: 12 }} style={{ position: 'relative' }}>
        {picList.map((item, index) => {
          return (
            <Col span={24} key={index} style={{ marginTop: 8 }}>
              <Row gutter={12}>
                <Col span={4}>
                  {getFieldDecorator(`type${index}`, {
                    initialValue: item.imgType,
                  })(
                    <Select
                      allowClear
                      placeholder="请选择平面图类型"
                      onChange={this.getImgInfo}
                      onSelect={e => this.handleImgIndex(e, index)}
                      disabled={item.isDisabled}
                    >
                      {imgTypeList.map(({ key, value }) => (
                        <Option value={key} key={key}>
                          {value}
                        </Option>
                      ))}
                    </Select>
                  )}
                </Col>
                {getFieldValue(`type${index}`) === 2 && (
                  <Col span={4}>
                    {getFieldDecorator(`buildingName${index}`, {
                      initialValue: item.buildingId,
                    })(
                      <Select
                        allowClear
                        placeholder="请选择建筑物名称"
                        disabled={item.isDisabled}
                        onSelect={() => this.handleBuildingSelect(index)}
                        onChange={this.getFloorInfo}
                      >
                        {buildingList.map(({ buildingName, id }) => (
                          <Option value={id} key={id}>
                            {buildingName}
                          </Option>
                        ))}
                      </Select>
                    )}
                  </Col>
                )}
                {getFieldValue(`type${index}`) === 2 && (
                  <Col span={4}>
                    {getFieldDecorator(`floorName${index}`, {
                      initialValue: item.floorId,
                    })(
                      <Select
                        allowClear
                        placeholder="请选择楼层名称"
                        disabled={item.isDisabled}
                        onChange={this.getFloorPic}
                        onSelect={() => this.handleFloorSelect(index)}
                      >
                        {floorList.map(({ floorName, id }) => (
                          <Option value={id} key={id}>
                            {floorName}
                          </Option>
                        ))}
                      </Select>
                    )}
                  </Col>
                )}

                <Col span={4}>
                  {getFieldDecorator(`xnum${index}`, { initialValue: item.xnum })(
                    <Input placeholder="x轴" disabled={item.isDisabled} />
                  )}
                </Col>
                <Col span={4}>
                  {getFieldDecorator(`ynum${index}`, { initialValue: item.ynum })(
                    <Input placeholder="y轴" disabled={item.isDisabled} />
                  )}
                </Col>
                <Col span={4}>
                  <Button
                    onClick={() => this.showModalCoordinate(index, item)}
                    disabled={item.isDisabled}
                  >
                    定位
                  </Button>
                  {item.isEdit ? (
                    <span>
                      <span
                        className={styles.picIconSpan}
                        onClick={e => {
                          this.handlePicSave(index);
                        }}
                      >
                        保存
                      </span>
                      <span className={styles.picIconSpan}>
                        <Popconfirm
                          title="确认要删除该内容吗？"
                          onConfirm={() => this.handlePicInfoDelete(index)}
                        >
                          删除
                        </Popconfirm>
                      </span>
                    </span>
                  ) : (
                    <span
                      className={styles.picIconSpan}
                      onClick={() => {
                        this.handlePicEdit(index);
                      }}
                    >
                      编辑
                    </span>
                  )}
                </Col>
              </Row>
            </Col>
          );
        })}
        <Coordinate
          width="920px"
          visible={picModalVisible}
          urls={imgList}
          onOk={this.handleCoordinateOk}
          onCancel={() => {
            this.setState({
              picModalVisible: false,
              // typeIndex: '',
            });
          }}
          xNum={xNumCurrent}
          yNum={yNumCurrent}
          imgIdCurrent={imgIdCurrent}
          isImgSelect={isImgSelect}
        />
      </Row>
    );
  }

  // 选择更换
  handleSelectChange = selectedRowKeys => {
    this.setState({
      selectedRowKeys,
    });
  };

  // 批量删除检查内容
  handleDeleteContent = () => {
    const { selectedRowKeys } = this.state;
    const flowList = [...this.state.flowList];
    this.setState({
      flowList: flowList.filter(item => selectedRowKeys.indexOf(item.flow_id) < 0),
    });
    const filterList = flowList.filter(item => selectedRowKeys.includes(item.flow_id));
    const filterFlowId = filterList.map(item => item.flow_id_data);
    if (filterFlowId) {
      flow_id = flow_id.filter(d => filterFlowId.indexOf(d.flow_id_data) < 0);
      flow_id = flow_id.filter(d => selectedRowKeys.indexOf(d.flow_id_data) < 0);
    } else {
      flow_id = flow_id.filter(d => selectedRowKeys.indexOf(d.flow_id_data) < 0);
    }
  };

  /* 渲染table(检查内容) */
  renderCheckTable() {
    const {
      tableLoading,
      match: {
        params: { id },
      },
    } = this.props;
    const { flowList: list, selectedRowKeys } = this.state;
    const BusinessType = ['安全生产', '消防', '环保', '卫生'];

    /* 配置描述 */
    const COLUMNS = [
      {
        title: '检查项名称',
        dataIndex: 'object_title',
        key: 'object_title',
        align: 'center',
        width: 80,
      },
      {
        title: '所属行业',
        dataIndex: 'industry',
        key: 'industry',
        align: 'center',
        width: 70,
      },
      {
        title: '业务分类',
        dataIndex: 'business_type',
        key: 'business_type',
        align: 'center',
        width: 65,
        render: val => {
          return id ? BusinessType[val - 1] || val : val;
        },
      },
      {
        title: '检查内容',
        dataIndex: 'flow_name',
        key: 'flow_name',
        align: 'center',
        width: 120,
      },
      {
        title: '隐患等级',
        dataIndex: 'danger_level',
        key: 'danger_level',
        align: 'center',
        width: 65,
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        align: 'center',
        width: 50,
        render: (text, record, index) => {
          return (
            <span>
              <Popconfirm
                title="确认要删除该检查内容吗？"
                onConfirm={() =>
                  this.handleDeleteCheck(
                    id ? record.flow_id_data || record.flow_id : record.flow_id,
                    index
                  )
                }
              >
                <a>删除</a>
              </Popconfirm>
            </span>
          );
        },
      },
    ];

    return (
      <Card style={{ marginTop: '-25px' }} bordered={false}>
        {list &&
          list.length > 0 && (
            <Table
              loading={tableLoading}
              rowKey={'flow_id'}
              columns={COLUMNS}
              dataSource={list}
              pagination={false}
              rowSelection={{
                selectedRowKeys,
                onChange: this.handleSelectChange,
                hideDefaultSelections: true,
                type: 'checkbox',
              }}
              bordered
              width={500}
            />
            // ) : (
            //   <div style={{ textAlign: 'center' }}>暂无数据</div>
          )}
      </Card>
    );
  }

  // 渲染信息
  renderInfo() {
    const {
      form: { getFieldDecorator, getFieldsValue },
      riskPointManage: {
        checkCycleList,
        cycleTypeList,
        checkCycleData,
        detail: { data = {} },
        equipmentTypeList = [],
        companyList,
      },
      chemical: { riskPoint },
      user: {
        currentUser: { unitType },
      },
      match: {
        params: { id },
      },
    } = this.props;
    const { selectedArea, selectedEquip, selectedCompany } = this.state;
    // const { picList } = this.state;

    // const isAdmin = unitType === OPE;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
        xxl: { span: 3 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
        xxl: { span: 21 },
      },
    };

    const formItemLayout1 = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
        md: { span: 18 },
      },
    };

    const grid = { xs: { span: 20 }, sm: { span: 20 }, xxl: { span: 10 } };
    const gridOffset = { xs: { span: 20 }, sm: { span: 20 }, xxl: { span: 10, offset: 2 } };

    const { riskPointType, equipmentType } = getFieldsValue();
    const companyId = selectedCompany.id;
    const isAnalyzed = !!data.safeCheck;

    return (
      <Card className={styles.card} bordered={false}>
        <Form layout={'horizontal'}>
          {unitType !== 4 && (
            <Row gutter={12}>
              <Col {...grid}>
                <Form.Item label="单位名称" {...formItemLayout1}>
                  {getFieldDecorator('companyId', {
                    initialValue: data.companyId,
                    rules: [{ required: true, message: '请选择单位名称' }],
                  })(
                    <Fragment>
                      <Input disabled value={selectedCompany.name} placeholder="请选择单位名称" />
                    </Fragment>
                  )}
                </Form.Item>
              </Col>
              {!id && (
                <Col span={2} style={{ position: 'relative', marginTop: '4px' }}>
                  <Button onClick={this.handleViewCompanyModal}>选择</Button>
                </Col>
              )}
            </Row>
          )}
          <Row gutter={12} style={{ position: 'relative' }}>
            <Col {...grid}>
              <Form.Item label={fieldLabels.riskPointName} {...formItemLayout1}>
                {getFieldDecorator('objectTitle', {
                  initialValue: data.objectTitle,
                  getValueFromEvent: this.handleTrim,
                  rules: [{ required: true, message: '请输入风险点' }],
                })(<Input placeholder="请输入风险点" maxLength={50} />)}
              </Form.Item>
            </Col>

            <Col {...gridOffset}>
              <Form.Item label={fieldLabels.number} {...formItemLayout1}>
                {getFieldDecorator('itemCode', {
                  initialValue: data.itemCode,
                  getValueFromEvent: this.handleTrim,
                  rules: [{ message: '请输入编号', required: true }],
                })(<Input placeholder="请输入编号" maxLength={50} />)}
              </Form.Item>
            </Col>

            <Col {...grid}>
              <Form.Item label={fieldLabels.checkCycle} {...formItemLayout1}>
                {getFieldDecorator('cycleType', {
                  initialValue: data.cycleType,
                  rules: [{ required: true, message: '请选择检查周期方案' }],
                })(
                  <Select allowClear placeholder="请选择检查周期方案">
                    {checkCycleList.map(({ key, value }) => (
                      <Option value={key} key={key}>
                        {value}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>

            <Col {...gridOffset}>
              <Form.Item label={fieldLabels.RecommendCycle} {...formItemLayout1}>
                {getFieldDecorator('recommendCycle', {
                  getValueFromEvent: this.handleTrim,
                  initialValue: getCycleType(checkCycleData),
                  rules: [
                    {
                      // required: getFieldDecorator('cycleType') === '1' ? true : false,
                      message: '推荐检查周期',
                    },
                  ],
                })(<Input placeholder="推荐检查周期" disabled />)}
              </Form.Item>
            </Col>

            <Col {...grid}>
              <Form.Item label={fieldLabels.cycleType} {...formItemLayout1}>
                {getFieldDecorator('checkCycle', {
                  initialValue: data.checkCycle,
                  rules: [{ message: '请选择自定义检查周期' }],
                })(
                  <Select allowClear placeholder="请选择自定义检查周期">
                    {cycleTypeList.map(({ key, value }) => (
                      <Option value={key} key={key}>
                        {value}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>

            <Col {...gridOffset}>
              <Form.Item label={'复评周期(月)'} {...formItemLayout1}>
                {getFieldDecorator('reviewCycle', {
                  initialValue: data.reviewCycle,
                  getValueFromEvent: this.handleTrim,
                  rules: [
                    { message: '请输入复评周期(月)', required: true },
                    {
                      message: '只能输入正整数',
                      pattern: /^[1-9]\d*$/,
                    },
                  ],
                })(<Input placeholder="请输入复评周期(月)" maxLength={20} />)}
              </Form.Item>
            </Col>

            {/* <Col span={24}>
              <Row gutter={12} style={{ display: isAdmin ? 'flex' : 'none' }}> */}

            <Col {...grid}>
              <Form.Item label={fieldLabels.bindRFID} {...formItemLayout1}>
                {getFieldDecorator('locationCode', {
                  initialValue: data.locationCode,
                  getValueFromEvent: this.handleTrim,
                  // rules: [{ required: true, message: '请选择RFID' }],
                })(<Input placeholder="请选择RFID" disabled />)}
              </Form.Item>
            </Col>

            <Col span={2} style={{ position: 'relative', marginTop: '4px' }}>
              {companyId && <Button onClick={this.handleFocus}>选择</Button>}
            </Col>

            <Col {...grid}>
              <Form.Item label={fieldLabels.ewm} {...formItemLayout1}>
                {getFieldDecorator('qrCode', {
                  initialValue: data.qrCode,
                  getValueFromEvent: this.handleTrim,
                  // rules: [{ required: true, message: '请选择二维码' }],
                })(<Input placeholder="请选择二维码" disabled />)}
              </Form.Item>
            </Col>
            <Col {...grid}>
              <Form.Item label={fieldLabels.nfc} {...formItemLayout1}>
                {getFieldDecorator('nfcCode', {
                  initialValue: data.nfcCode,
                  getValueFromEvent: this.handleTrim,
                  // rules: [{ required: true, message: '请选择NFC' }],
                })(<Input placeholder="请选择NFC" disabled />)}
              </Form.Item>
            </Col>

            <Col span={24}>
              <Row gutter={12}>
                <Col {...grid}>
                  <Form.Item label={'所属区域'} {...formItemLayout1}>
                    {getFieldDecorator('areaId', {
                      initialValue: data.areaId,
                      getValueFromEvent: this.handleTrim,
                    })(
                      <Fragment>
                        <Input
                          value={selectedArea.areaName}
                          placeholder="请选择所属区域"
                          disabled
                        />
                      </Fragment>
                    )}
                  </Form.Item>
                </Col>
                {companyId && (
                  <Col span={2} style={{ position: 'relative', marginTop: '4px' }}>
                    <Button onClick={this.handleShowAreaModal}>选择</Button>
                  </Col>
                )}
              </Row>

              <Row gutter={12}>
                <Col {...grid}>
                  <Form.Item label={'风险点类型'} {...formItemLayout1}>
                    {getFieldDecorator('riskPointType', {
                      initialValue: data.riskPointType || 1,
                      rules: [{ required: true, message: '请选择风险点类型' }],
                    })(
                      <RadioGroup disabled={isAnalyzed}>
                        <Radio value={1}>设备设施</Radio>
                        <Radio value={2}>作业活动</Radio>
                      </RadioGroup>
                    )}
                  </Form.Item>
                </Col>
              </Row>

              {riskPointType === 1 ? (
                <Fragment>
                  <Row gutter={12}>
                    <Col {...grid}>
                      <Form.Item label={'设备类型'} {...formItemLayout1}>
                        {getFieldDecorator('equipmentType', {
                          initialValue: data.equipmentType || undefined,
                          rules: [{ required: true, message: '请选择设备类型' }],
                        })(
                          <Select
                            allowClear
                            placeholder="请选择设备类型"
                            onChange={this.handleEquipmentTypeChange}
                            disabled={isAnalyzed}
                          >
                            {equipmentTypeList.map(({ key, value }) => (
                              <Option value={key} key={key}>
                                {value}
                              </Option>
                            ))}
                          </Select>
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={12}>
                    <Col {...grid}>
                      <Form.Item label={'设备名称'} {...formItemLayout1}>
                        {getFieldDecorator('equipmentId', {
                          initialValue: data.equipmentId,
                          rules: [{ required: true, message: '请选择设备名称' }],
                        })(
                          <Fragment>
                            <Input
                              value={selectedEquip.name}
                              placeholder="请选择设备名称"
                              disabled
                            />
                          </Fragment>
                        )}
                      </Form.Item>
                    </Col>
                    {companyId &&
                      !isAnalyzed && (
                        <Col span={2} style={{ position: 'relative', marginTop: '4px' }}>
                          <Button onClick={this.handleShowEquipModal} disabled={!equipmentType}>
                            选择
                          </Button>
                        </Col>
                      )}
                  </Row>
                </Fragment>
              ) : (
                <Fragment>
                  <Row gutter={12}>
                    <Col {...grid}>
                      <Form.Item label={'活动名称'} {...formItemLayout1}>
                        {getFieldDecorator('workName', {
                          initialValue: data.workName,
                          getValueFromEvent: this.handleTrim,
                          rules: [{ required: true, message: '请输入活动名称' }],
                        })(
                          <Input
                            placeholder="请输入活动名称"
                            maxLength={50}
                            disabled={isAnalyzed}
                          />
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={12}>
                    <Col {...grid}>
                      <Form.Item label={'作业内容'} {...formItemLayout1}>
                        {getFieldDecorator('workContent', {
                          initialValue: data.workContent,
                          getValueFromEvent: this.handleTrim,
                        })(<TextArea placeholder="请输入作业内容" rows={3} maxLength="500" />)}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={12}>
                    <Col {...grid}>
                      <Form.Item label={'作业频率'} {...formItemLayout1}>
                        {getFieldDecorator('workFrequency', {
                          initialValue: data.workFrequency,
                          getValueFromEvent: this.handleTrim,
                        })(<Input placeholder="请输入作业频率" maxLength={50} />)}
                      </Form.Item>
                    </Col>
                  </Row>
                </Fragment>
              )}
            </Col>
          </Row>
        </Form>

        <Form style={{ marginTop: 8 }}>
          {/* <Form.Item {...formItemLayout} label={fieldLabels.picLocation}>
            <Button
              type="primary"
              style={{ padding: '0 12px' }}
              onClick={this.handlePicInfoAdd}
              disabled={isDisabled}
            >
              新增
            </Button>
          </Form.Item>
          {this.renderPicInfo()} */}
          <Row gutter={12}>
            <Col span={20}>
              <Form.Item {...formItemLayout} label={fieldLabels.mapLocation}>
                {/* <div style={{ display: 'flex' }}>
              <div className={styles.mapLocation} id="fengMap"></div>
              <Button type="primary" onClick={this.handleResetMapLocation}>重置</Button>
            </div> */}
                {getFieldDecorator('mapLocation')(
                  <MapMarkerSelect
                    companyId={companyId}
                    markerList={riskPoint.map(item => ({ ...item, id: item.itemId }))}
                    otherMarkersOption={{ url: OtherMarkerImg, size: 36 }}
                    markerOption={{ url: MarkerImg, size: 36 }}
                    markerId={data.itemId}
                    legend={{
                      label: '其他风险点',
                      icon: MarkerGrayImg,
                      activeIcon: MarkerActiveImg,
                    }}
                  />
                )}
              </Form.Item>
              <Form.Item label={fieldLabels.isShow}>
                {getFieldDecorator('isShow')(
                  <RadioGroup>
                    <Radio value="1">显示</Radio>
                    <Radio value="0">不显示</Radio>
                  </RadioGroup>
                )}
              </Form.Item>
            </Col>
          </Row>
        </Form>

        <Form style={{ marginTop: 30 }}>
          <Row gutter={12}>
            <Col span={20}>
              <Form.Item {...formItemLayout} label={fieldLabels.checkContent}>
                <Button
                  type="primary"
                  style={{ marginBottom: 10, padding: '0 12px' }}
                  onClick={this.handleContentModal}
                >
                  新增
                </Button>
                <Button
                  type="primary"
                  style={{ marginLeft: 10, marginBottom: 10, padding: '0 12px' }}
                  onClick={this.handleDeleteContent}
                >
                  删除
                </Button>
              </Form.Item>
              <Divider style={{ marginTop: '-20px' }} />
              {this.renderCheckTable()}
            </Col>

            <Col {...grid}>
              <Form.Item label={'相关资料'} {...formItemLayout1}>
                {getFieldDecorator('fileList', {
                  initialValue: (data.fileList || []).map((item, index) => ({
                    ...item,
                    url: item.webUrl,
                    status: 'done',
                    uid: -index - 1,
                    name: item.fileName,
                  })),
                })(
                  <Upload mode={'edit'}>
                    <Button type="dashed" style={{ width: '96px', height: '96px' }}>
                      <PlusOutlined style={{ fontSize: '32px' }} />
                      <div style={{ marginTop: '8px' }}>点击上传</div>
                    </Button>
                  </Upload>
                )}
              </Form.Item>

              <Form.Item label={'备注'} {...formItemLayout1}>
                {getFieldDecorator('remark', {
                  initialValue: data.remark,
                  getValueFromEvent: this.handleTrim,
                })(<TextArea placeholder="请输入备注" rows={3} maxLength="500" />)}
              </Form.Item>
            </Col>
          </Row>
        </Form>

        <div style={{ textAlign: 'center' }}>
          <Button type="primary" onClick={this.handleClickValidate}>
            提交
          </Button>
          <Button style={{ marginLeft: '20px' }} onClick={this.goBack}>
            返回
          </Button>
        </div>
      </Card>
    );
  }

  handleViewCompanyModal = () => {
    this.setState({ companyModalVisible: true });
    this.fetchCompany({
      payload: {
        pageSize: 10,
        pageNum: 1,
      },
    });
  };

  fetchCompany = ({ payload }) => {
    const { dispatch } = this.props;
    dispatch({ type: 'company/fetchModelList', payload });
  };

  handleSelectCompany = selectedCompany => {
    const {
      form: { setFieldsValue },
      dispatch,
    } = this.props;
    const companyId = selectedCompany.id;
    this.setState(
      {
        selectedCompany,
        companyModalVisible: false,
      },
      () => {
        // 获取推荐检查周期
        dispatch({
          type: 'riskPointManage/fetchCheckCycle',
          payload: {
            companyId,
            type: 2,
          },
        });
      }
    );
    setFieldsValue({ companyId });
  };

  renderCompanyModal = () => {
    const {
      companyLoading,
      company: { companyModal },
    } = this.props;
    const { companyModalVisible } = this.state;
    return (
      <CompanyModal
        title="选择单位"
        buttonSpan={{ xl: 8, md: 12, sm: 24 }}
        loading={companyLoading}
        visible={companyModalVisible}
        modal={companyModal}
        fetch={this.fetchCompany}
        onSelect={this.handleSelectCompany}
        onClose={() => {
          this.setState({ companyModalVisible: false });
        }}
      />
    );
  };

  // 显示模态框(所属区域)
  handleShowAreaModal = e => {
    const payload = { pageSize: PageSize, pageNum: 1 };
    e.target.blur();
    this.setState({ areaModalVisible: true });
    this.fetchRiskArea({ payload });
  };

  fetchRiskArea = ({ payload }) => {
    const { dispatch } = this.props;
    const { selectedCompany } = this.state;
    dispatch({ type: 'riskArea/getList', payload: { companyId: selectedCompany.id, ...payload } });
  };

  handleSelectArea = selected => {
    const {
      form: { setFieldsValue },
    } = this.props;
    this.setState({ selectedArea: selected, areaModalVisible: false });
    setFieldsValue({ areaId: selected.id });
  };

  renderAreaModal = () => {
    const {
      areaLoading,
      riskArea: { list },
    } = this.props;
    const { areaModalVisible } = this.state;
    const columns = [
      {
        title: '区域名称',
        dataIndex: 'areaName',
        key: 'areaName',
      },
      {
        title: '区域编号',
        dataIndex: 'areaCode',
        key: 'areaCode',
      },
      {
        title: '所属部门',
        dataIndex: 'partName',
        key: 'partName',
      },
      {
        title: '区域负责人',
        dataIndex: 'areaHeaderName',
        key: 'areaHeaderName',
      },
      {
        title: '联系电话',
        dataIndex: 'tel',
        key: 'tel',
      },
    ];
    const field = [
      {
        id: 'areaName',
        render() {
          return <Input placeholder="区域名称" />;
        },
        transform(value) {
          return value.trim();
        },
      },
      {
        id: 'areaCode',
        render() {
          return <Input placeholder="区域编号" />;
        },
        transform(value) {
          return value.trim();
        },
      },
    ];
    return (
      <CompanyModal
        title="选择所属区域"
        columns={columns}
        field={field}
        buttonSpan={{ xl: 8, md: 12, sm: 24 }}
        loading={areaLoading}
        visible={areaModalVisible}
        modal={list}
        fetch={this.fetchRiskArea}
        onSelect={this.handleSelectArea}
        onClose={() => {
          this.setState({ areaModalVisible: false });
        }}
      />
    );
  };

  handleEquipmentTypeChange = () => {
    const {
      form: { setFieldsValue },
    } = this.props;
    setFieldsValue({ equipmentId: undefined });
    this.setState({ selectedEquip: {} });
  };

  handleShowEquipModal = e => {
    const payload = { pageSize: PageSize, pageNum: 1 };
    e.target.blur();
    this.setState({ equipModalVisible: true });
    this.fetchEquipList({ payload });
  };

  fetchEquipList = ({ payload }) => {
    const {
      dispatch,
      form: { getFieldsValue },
    } = this.props;
    const { selectedCompany } = this.state;
    const { equipmentType } = getFieldsValue();

    dispatch({
      type: `riskPointManage/${EquipTypes[equipmentType]}`,
      payload: { companyId: selectedCompany.id, ...payload },
    });
  };

  handleSelectEquip = selected => {
    const {
      form: { setFieldsValue },
    } = this.props;
    this.setState({ selectedEquip: selected, equipModalVisible: false });
    setFieldsValue({ equipmentId: selected.id });
  };

  renderEquipModal = () => {
    const {
      equipLoading,
      form: { getFieldsValue },
      riskPointManage: {
        productEquipList,
        facilityList,
        specialEquipList,
        keyPartList,
        safeFacilitiesList,
      },
    } = this.props;
    const { equipModalVisible } = this.state;
    const { equipmentType } = getFieldsValue();
    const columns = EquipColumns[equipmentType] || [];
    const field = [
      {
        id: (columns[2] || {}).key || 'name',
        render() {
          return <Input placeholder="设备名称" />;
        },
        transform(value) {
          return value.trim();
        },
      },
    ];
    const datas = {
      1: productEquipList,
      2: facilityList,
      3: specialEquipList,
      4: keyPartList,
      5: safeFacilitiesList,
    };
    return (
      <CompanyModal
        title="选择设备设施"
        columns={columns}
        field={field}
        buttonSpan={{ xl: 8, md: 12, sm: 24 }}
        loading={equipLoading}
        visible={equipModalVisible}
        modal={
          (datas[equipmentType] || {}).list ? datas[equipmentType] : { list: [], pagination: {} }
        }
        fetch={this.fetchEquipList}
        onSelect={this.handleSelectEquip}
        onClose={() => {
          this.setState({ equipModalVisible: false });
        }}
      />
    );
  };

  // 渲染页面所有信息
  render() {
    const {
      match: {
        params: { id },
      },
      location: {
        query: { type = 'all' },
      },
    } = this.props;
    const title = id ? editTitle : addTitle;

    // 面包屑
    const breadcrumbList = [
      { title: '首页', name: '首页', href: '/' },
      { title: '风险管控', name: '风险管控' },
      {
        title: '风险点管理',
        name: '风险点管理',
        href: `/risk-control/risk-point-manage/list/${type}`,
      },
      // {
      //   title: '单位风险点',
      //   name: '单位风险点',
      //   href: `/risk-control/risk-point-manage/list`,
      // },
      {
        title,
        name: title,
      },
    ];

    return (
      <PageHeaderLayout title={title} breadcrumbList={breadcrumbList}>
        {this.renderInfo()}
        {this.renderCompanyModal()}
        {this.renderRfidModal()}
        {this.renderCheckModal()}
        {this.renderAreaModal()}
        {this.renderEquipModal()}
      </PageHeaderLayout>
    );
  }
}
