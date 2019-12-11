import { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import {
  Form,
  Input,
  Button,
  Card,
  Icon,
  Popover,
  DatePicker,
  Select,
  Upload,
  Radio,
  message,
  Col,
  Tooltip,
} from 'antd';
import FooterToolbar from '@/components/FooterToolbar';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import { getToken } from '@/utils/authority';
import { AuthButton } from '@/utils/customAuth';
import CompanyModal from '@/pages/BaseInfo/Company/CompanyModal';
// 平面图标注
import FlatPic from '@/pages/DeviceManagement/Components/FlatPic';
// 选择储罐区弹窗
import StorageTankAreaModal from './Components/StorageTankAreaModal';
// 选择存储介质弹窗
import StorageMediumModal from './Components/StorageMediumModal';
// 选择重大危险源弹窗
import MajorHazardListModal from './Components/MajorHazardListModal';
import codesMap from '@/utils/codes';
import moment from 'moment';

import styles from './StorageEdit.less';

const { Option } = Select;
const FormItem = Form.Item;
const { TextArea } = Input;

// 编辑页面标题
const editTitle = '编辑储罐';
// 添加页面标题
const addTitle = '新增储罐';
const itemStyles = { style: { width: '70%', marginRight: '10px' } };
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};
const storageAreaList = [
  { key: '1', value: '地上' },
  { key: '2', value: '地下' },
  { key: '3', value: '海上' },
  { key: '4', value: '海底' },
];

const storagTypeList = [
  { key: '1', value: '立式' },
  { key: '2', value: '卧式' },
  { key: '3', value: '球式' },
];

const constructList = [
  { key: '1', value: '拱顶式' },
  { key: '2', value: '浮顶式' },
  { key: '3', value: '内浮顶' },
  { key: '4', value: '卧式' },
];

const materialList = [
  { key: '1', value: '碳钢' },
  { key: '2', value: '不锈钢' },
  { key: '3', value: '聚乙烯' },
  { key: '4', value: '玻璃钢' },
];

const dangerLevelList = [
  { key: '1', value: '甲' },
  { key: '2', value: '乙' },
  { key: '3', value: '丙' },
  { key: '4', value: '丁' },
];

const pressureList = [
  { key: '1', value: '低压' },
  { key: '2', value: '中压' },
  { key: '3', value: '高压' },
  { key: '4', value: '超高压' },
];
const selectTypeList = [{ key: '1', value: '是' }, { key: '0', value: '否' }];

// 表单标签
const fieldLabels = {};

// 上传文件地址
const uploadAction = '/acloud_new/v2/uploadFile';

@connect(({ loading, baseInfo, personnelPosition, riskPointManage, device, sensor, materials, reservoirRegion, user }) => ({
  baseInfo,
  personnelPosition,
  riskPointManage,
  device,
  sensor,
  materials,
  reservoirRegion,
  user,
  companyLoading: loading.effects['sensor/fetchModelList'], // 单位列表加载状态
}))
@Form.create()
export default class StorageEdit extends PureComponent {
  state = {
    selectedCompany: {}, // 选中的单位 { id, name }
    companyModalVisible: false, // 选择单位弹窗是否可见
    pointFixInfoList: [],  // 平面图标志
    editingIndex: undefined, // 当前编辑的平面图标志下标
    picModalVisible: false, // 定位弹窗可见
    imgIdCurrent: '',
    isImgSelect: true,
    selectedArea: [],    // 勾选的储罐区对象数组
    storageTankAreaModalVisible: false, // 选择储罐区弹窗是否可见
    selectedMedium: [], // 存储介质
    storageMediumModalVisible: false, // 选择存储介质弹窗是否可见
    // selectedMajorHazard: [], // 所属危险化学品重大危险源单元
    // majorHazardModalVisible: false, // 选择重大危险源弹窗可见
    selectedTemp: [], // 弹窗选择对象暂存,取消后清空
    selectedTempKeys: [],
    uploadPics: [], // 上传照片列表
    uploadFiles: [], // 上传文件列表
    picUploading: false,
    fileUploading: false,
  };

  // 挂载后
  componentDidMount () {
    const {
      dispatch,
      match: { params: { id } },
      form: { setFieldsValue },
      user: { currentUser },
    } = this.props
    if (id) {
      // 如果编辑
      dispatch({
        type: 'baseInfo/fetchStorageTankDetail',
        payload: { id, pageNum: 1, pageSize: 10 },
        callback: ({
          companyId,
          companyName,
          buildingId,
          floorId,
          pointFixInfoList,
          tankArea,
          chineName,
          storageMedium,
          // chemicalsMajorHazard,
          areaName,
          // chemicalName,
          locationType,
          scenePhotoList,
          otherFileList,
          pressureVessel, // 是否压力容器
          pressureRate,   // 压力等级
          designPressure, // 设计压力
          cofferdam,      // 有无围堰
          cofferdamArea,  // 围堰所围面积
        }) => {
          setFieldsValue({ companyId, locationType, pressureVessel, cofferdam })
          this.setState({
            selectedCompany: { id: companyId, name: companyName }, // 所属单位
            selectedArea: [{ id: tankArea, areaName }], // 所属储罐区
            selectedMedium: [{ id: storageMedium, chineName }], // 存储介质
            // selectedMajorHazard: [{ id: chemicalsMajorHazard, name: chemicalName }],
            pointFixInfoList: pointFixInfoList || [],
            uploadPics: scenePhotoList ? scenePhotoList.map(item => ({
              ...item,
              uid: item.id,
              url: item.webUrl,
              name: item.fileName,
            })) : [],
            uploadFiles: otherFileList ? otherFileList.map(item => ({
              ...item,
              uid: item.id,
              url: item.webUrl,
              name: item.fileName,
            })) : [],
          })
          setFieldsValue({ buildingId, floorId, pressureRate, designPressure, cofferdamArea })
          companyId && this.fetchBuildings({ payload: { pageNum: 1, pageSize: 0, company_id: companyId } });
          buildingId && this.fetchFloors({ payload: { pageNum: 1, pageSize: 0, building_id: buildingId } })
        },
      })
    } else if (currentUser && currentUser.unitType === 4) {
      // 如果是企业用户
      const { companyId, companyName } = currentUser;
      setFieldsValue({ companyId, locationType: 0 });
      this.setState({ selectedCompany: { id: companyId, name: companyName } });
      companyId && this.fetchBuildings({ payload: { pageNum: 1, pageSize: 0, company_id: companyId } });
    } else {
      setFieldsValue({ locationType: 0 })
    }
  }

  /**
  * 获取楼层
  */
  fetchFloors = (actions) => {
    const { dispatch } = this.props
    dispatch({
      type: 'personnelPosition/fetchFloors',
      ...actions,
    })
  }

  /**
  * 获取所属建筑列表
  */
  fetchBuildings = (actions) => {
    const { dispatch } = this.props
    dispatch({
      type: 'personnelPosition/fetchBuildings',
      ...actions,
    })
  }

  /**
  * 获取储罐区列表
  */
  fetchStorageTankAreaForPage = ({ payload, ...resProps }) => {
    const { dispatch } = this.props
    const { selectedCompany } = this.state;
    const companyId = selectedCompany.id;
    dispatch({
      type: 'baseInfo/fetchStorageTankAreaForPage',
      payload: { companyId, ...payload },
      ...resProps,
    })
  }

  /**
  * 获取存储介质列表
  */
  fetchStorageMedium = ({ payload, ...resProps }) => {
    const { dispatch } = this.props;
    const { selectedCompany } = this.state;
    const companyId = selectedCompany.id;
    dispatch({
      type: 'materials/fetchMaterialsList',
      payload: { companyId, ...payload },
      ...resProps,
    })
  }

  /**
  * 获取重大危险源列表
  */
  // fetchMajorHazard = ({ payload, ...resProps }) => {
  //   const {
  //     form: { getFieldValue },
  //     dispatch,
  //   } = this.props;
  //   const companyId = getFieldValue('companyId')
  //   dispatch({
  //     type: 'reservoirRegion/fetchSourceList',
  //     payload: { companyId, ...payload },
  //     ...resProps,
  //   })
  // }

  /**
   * 清空楼层列表
   */
  resetFloors = actions => {
    const { dispatch } = this.props
    dispatch({
      type: 'personnelPosition/saveFloors',
      ...actions,
    })
  }

  /**
   * 获取企业列表（弹窗）
   */
  fetchCompany = ({ payload }) => {
    const { dispatch } = this.props;
    dispatch({ type: 'sensor/fetchModelList', payload });
  };

  // 去除左右两边空白
  handleTrim = e => e.target.value.trim();

  goBack = () => {
    router.goBack();
  };

  /**
   * 选择储罐区
   */
  handleSelectArea = () => {
    const { form: { setFieldsValue } } = this.props
    const { selectedTempKeys, selectedTemp } = this.state
    if (selectedTempKeys && selectedTempKeys.length) {
      setFieldsValue({ tankArea: selectedTempKeys.join(',') })
      this.setState({
        storageTankAreaModalVisible: false,
        selectedArea: selectedTemp,
      })
    } else message.warning('请选择储罐区')
  }

  /**
   * 选择存储介质
   */
  handleSelectMedium = () => {
    const { form: { setFieldsValue } } = this.props
    const { selectedTempKeys, selectedTemp } = this.state
    if (selectedTempKeys && selectedTempKeys.length) {
      setFieldsValue({ storageMedium: selectedTempKeys.join(',') })
      this.setState({
        storageMediumModalVisible: false,
        selectedMedium: selectedTemp,
      })
    } else message.warning('请选择存储介质')
  }

  /**
  * 选择重大危险源
  */
  // handleSelectMajorHazard = () => {
  //   const { form: { setFieldsValue } } = this.props
  //   const { selectedTempKeys, selectedTemp } = this.state
  //   if (selectedTempKeys && selectedTempKeys.length) {
  //     setFieldsValue({ chemicalsMajorHazard: selectedTempKeys.join(',') })
  //     this.setState({
  //       majorHazardModalVisible: false,
  //       selectedMajorHazard: selectedTemp,
  //     })
  //   } else message.warning('请选择重大危险源')
  // }

  /**
   * 打开选择单位弹窗
   */
  handleViewCompanyModal = () => {
    this.setState({ companyModalVisible: true });
    this.fetchCompany({
      payload: {
        pageSize: 10,
        pageNum: 1,
      },
    });
  };

  /**
   * 选择企业
   */
  handleSelectCompany = selectedCompany => {
    const {
      form: { setFieldsValue },
    } = this.props;
    const companyId = selectedCompany.id
    this.setState({ selectedCompany, companyModalVisible: false });
    setFieldsValue({ companyId });
    companyId && this.fetchBuildings({ payload: { pageNum: 1, pageSize: 0, company_id: companyId } });
  };

  /**
  * 刷新建筑物楼层图下拉
  * @param {Boolean} weatherFetch 是否重新获取建筑物选项下拉
  */
  handleRefreshBuilding = (weatherFetch = false) => {
    const {
      form: { setFieldsValue },
    } = this.props
    const { selectedCompany } = this.state;
    const companyId = selectedCompany.id;
    // 清空选择建筑物和楼层
    setFieldsValue({ buildingId: undefined, floorId: undefined });
    // 获取建筑物下拉 清空楼层下拉
    weatherFetch && companyId && this.fetchBuildings({ payload: { pageNum: 1, pageSize: 0, company_id: companyId } });
    this.resetFloors({ payload: [] });
    // 改变 平面图标注--楼层平面定位信息
    this.changeFlatPicBuildingNum();
  }

  /**
   * 改变 平面图标注--楼层平面定位信息
   */
  changeFlatPicBuildingNum = (xnum = undefined, ynum = undefined) => {
    const { pointFixInfoList, editingIndex } = this.state
    // 从保存的平面图标注列表中找类型为 楼层平面图的，如果找到 清空定位信息,并且该条平面图标注需要重新编辑
    const i = pointFixInfoList.findIndex(item => +item.imgType === 2)
    // 如果未找到，或者当前正在编辑平面图标注为楼层平面图类型
    if (i < 0 || +editingIndex === i) return
    message.warning('请重新编辑平面图标注中楼层平面图')
    const item = pointFixInfoList[i]
    this.handleChangeCoordinate(item, xnum, i, 'xnum')
    this.handleChangeCoordinate(item, ynum, i, 'ynum')
    this.setState({ editingIndex: i })
  }

  /**
  * 新平面图标志--坐标轴改变
  */
  handleChangeCoordinate = (item, value, i, key) => {
    if (value && isNaN(value)) {
      message.warning('坐标轴为数字')
      return
    }
    item[key] = value
    this.setState(({ pointFixInfoList }) => {
      let temp = [...pointFixInfoList]
      temp.splice(i, 1, item)
      return { pointFixInfoList: temp }
    })
  }

  /**
   * 验证建筑物或者楼层是否已选择
   */
  validateBuildingFloor = (rule, value, callback) => {
    const { form: { getFieldsValue } } = this.props
    const { buildingId, floorId } = getFieldsValue()
    if (buildingId && floorId) {
      callback()
    } else callback('请选择所属建筑物楼层')
  }


  // 选择所属建筑物
  handleSelectBuilding = (value) => {
    const {
      form: { setFieldsValue },
    } = this.props
    // 获取楼层
    this.fetchFloors({ payload: { pageNum: 1, pageSize: 0, building_id: value } })
    setFieldsValue({ floorId: undefined })
  }

  /**
  * 跳转到建筑物管理页面
  */
  jumpToBuildingManagement = () => {
    const win = window.open(`${window.publicPath}#/base-info/buildings-info/list`, '_blank');
    win.focus();
  }

  // 所属建筑物改变
  handleBuildingChange = (value) => {
    const {
      form: { setFieldsValue },
    } = this.props
    setFieldsValue({ floorId: undefined })
    this.handleRefreshBuilding()
    if (!value) {
      // 清空楼层下拉
      this.resetFloors({ payload: [] })
      return
    }
    // 获取楼层
    this.fetchFloors({ payload: { pageNum: 1, pageSize: 0, building_id: value } })
  }

  /**
   * 添加平面图标志
   */
  handleAddFlatGraphic = () => {
    this.setState(({ pointFixInfoList }) => ({
      editingIndex: pointFixInfoList.length,
      pointFixInfoList: [...pointFixInfoList, { imgType: undefined, ynum: undefined, xnum: undefined, fixImgId: undefined }],
    }))
  }

  // 点击打开选择储罐区弹窗
  handleToSelectStorageArea = () => {
    const { form: { getFieldValue } } = this.props
    const tankArea = getFieldValue('tankArea')
    this.fetchStorageTankAreaForPage({ payload: { pageNum: 1, pageSize: 10 } })
    this.setState({
      storageTankAreaModalVisible: true,
      selectedTempKeys: tankArea ? tankArea.split(',') : [],
    })
  }

  // 点击打开选择存储介质弹窗
  handleToSelectStorageMedium = () => {
    const { form: { getFieldValue } } = this.props
    const { selectedCompany } = this.state;
    const companyId = selectedCompany.id;
    const storageMedium = getFieldValue('storageMedium')
    if (!companyId) {
      message.warning('请先选择单位')
      return;
    }
    this.fetchStorageMedium({ payload: { pageNum: 1, pageSize: 10 } })
    this.setState({
      storageMediumModalVisible: true,
      selectedTempKeys: storageMedium ? storageMedium.split(',') : [],
    })
  }

  // 点击打开选择重大危险源弹窗
  // handleToSelectMajorHazard = () => {
  //   const { form: { getFieldsValue } } = this.props
  //   const { chemicalsMajorHazard, companyId } = getFieldsValue()
  //   if (!companyId) {
  //     message.warning('请先选择单位')
  //     return;
  //   }
  //   this.fetchMajorHazard({ payload: { pageNum: 1, pageSize: 10 } })
  //   this.setState({
  //     majorHazardModalVisible: true,
  //     selectedTempKeys: chemicalsMajorHazard ? chemicalsMajorHazard.split(',') : [],
  //   })
  // }

  // 监听上传照片改变
  handleUploadPicChange = ({ file, fileList }) => {
    if (file.status === 'uploading') {
      this.setState({ picUploading: true, uploadPics: fileList })
    } else if (file.status === 'done') {
      if (file.response && file.response.code === 200) {
        const result = file.response.data.list[0]
        const list = fileList.map((item, index) => {
          if (index === fileList.length - 1) {
            return {
              ...result,
              uid: item.uid,
              url: result.webUrl,
              name: result.fileName,
            }
          } else return item
        })
        this.setState({
          picUploading: false,
          uploadPics: list,
        })
      } else {
        message.error('上传失败！');
        this.setState({
          uploadPics: fileList.filter(item => {
            return !item.response || item.response.code !== 200;
          }),
        });
      }
      this.setState({
        picUploading: false,
      });
    } else if (file.status === 'removed') {
      // 删除
      this.setState({
        uploadPics: fileList.filter(item => {
          return item.status !== 'removed';
        }),
        picUploading: false,
      });
    } else {
      message.error('上传失败')
      this.setState({ picUploading: false })
    }
  }

  // 监听上传文件改变
  handleUploadFileChange = ({ file, fileList }) => {
    if (file.status === 'uploading') {
      this.setState({ fileUploading: true, uploadFiles: fileList })
    } else if (file.status === 'done') {
      if (file.response && file.response.code === 200) {
        const result = file.response.data.list[0]
        const list = fileList.map((item, index) => {
          if (index === fileList.length - 1) {
            return {
              ...result,
              uid: item.uid,
              url: result.webUrl,
              name: result.fileName,
            }
          } else return item
        })
        this.setState({
          fileUploading: false,
          uploadFiles: list,
        })
      } else {
        message.error('上传失败！');
        this.setState({
          uploadFiles: fileList.filter(item => {
            return !item.response || item.response.code !== 200;
          }),
        });
      }
      this.setState({
        fileUploading: false,
      });
    } else if (file.status === 'removed') {
      // 删除
      this.setState({
        uploadFiles: fileList.filter(item => {
          return item.status !== 'removed';
        }),
        fileUploading: false,
      });
    } else {
      message.error('上传失败')
      this.setState({ fileUploading: false })
    }
  }

  validateDesignReservesAndUnit = (rule, value, callback) => {
    if (value && value.length === 2) {
      const [designReserves, unit] = value
      if (isNaN(designReserves)) {
        callback('请输入设计储量，且为数字')
        return;
      }
      if (!unit) {
        callback('请输入单位')
        return;
      }
      callback()
    } else callback('请输入设计储量与单位')
  }

  /**
   * 点击提交
   */
  handleSubmit = () => {
    const {
      dispatch,
      match: { params: { id } },
      form: { validateFields },
    } = this.props;
    const {
      editingIndex,
      pointFixInfoList,
      uploadPics,
      uploadFiles,
      selectedCompany,
    } = this.state;
    if (!isNaN(editingIndex)) {
      message.warning('请先保存平面图信息')
      return
    }
    validateFields((err, values) => {
      if (err) return
      const { designReservesAndUnit, area, pressureRate, designPressure, cofferdamArea, ...resValues } = values;
      const [designReserves, designReservesUnit] = designReservesAndUnit;
      const payload = {
        ...resValues,
        companyId: selectedCompany.id,
        designReserves,
        designReservesUnit,
        pointFixInfoList, // 平面图标注列表
        scenePhoto: uploadPics && uploadPics.length ? JSON.stringify(uploadPics) : '',
        otherFile: uploadFiles && uploadFiles.length ? JSON.stringify(uploadFiles) : '',
        area: +values.locationType === 1 ? area : '',
        pressureRate: values.pressureVessel === '1' ? pressureRate : '',
        designPressure: values.pressureVessel === '1' ? designPressure : '',
        cofferdamArea: values.cofferdam === '2' ? cofferdamArea : '',
      }
      const tag = id ? '编辑' : '新增';
      const success = () => {
        message.success(`${tag}成功`)
        router.push('/major-hazard-info/storage-management/list')
      }
      const error = (res) => { message.error(res ? res.msg : `${tag}失败`) }
      if (id) {
        // 如果编辑
        dispatch({
          type: 'baseInfo/editStorageTank',
          payload: { ...payload, id },
          success,
          error,
        })
      } else {
        // 如果新增
        dispatch({
          type: 'baseInfo/addStorageTank',
          payload,
          success,
          error,
        })
      }
    })
  };

  renderInfo () {
    const {
      dispatch,
      form,
      form: { getFieldDecorator, getFieldsValue, setFieldsValue },
      match: { params: { id } },
      baseInfo: {
        // 储罐详情
        storageTankDetail: detail = {},
      },
      personnelPosition: {
        map: {
          buildings = [], // 建筑物列表
          floors = [],      // 楼层列表
        },
      },
      riskPointManage: {
        imgData: { list: imgList = [] },
      },
      device: {
        flatGraphic, // 平面图类型选项
      },
      user: { currentUser: { unitType } },
    } = this.props;

    const {
      selectedCompany, // 选择的单位 { id,name }
      editingIndex, // 平面图标注--当前编辑的下标
      pointFixInfoList,
      picModalVisible,
      isImgSelect,
      imgIdCurrent,
      selectedArea,
      selectedMedium,
      // selectedMajorHazard,
      uploadPics,
      uploadFiles,
      picUploading,
      fileUploading,
    } = this.state

    const { locationType, designReservesAndUnit, pressureVessel, cofferdam } = getFieldsValue();
    const companyId = selectedCompany.id;
    const FlatPicProps = {
      visible: picModalVisible,
      onCancel: () => { this.setState({ picModalVisible: false }) },
      form,
      buildings, // 建筑物列表
      floors,      // 楼层列表
      imgList,  // 定位图列表
      pointFixInfoList, // 平面图标注列表
      editingIndex,
      isImgSelect,
      imgIdCurrent,
      flatGraphic,
      setState: (newState) => { this.setState(newState) },
      dispatch,
      companyId,
      handleBuildingChange: this.handleBuildingChange,
      changeFlatPicBuildingNum: this.changeFlatPicBuildingNum,
    }
    return (
      <Card bordered={false}>
        <Form style={{ marginTop: 8 }}>
          {unitType !== 4 && (
            <FormItem {...formItemLayout} label="单位名称">
              {getFieldDecorator('companyId', {
                rules: [{ required: true, message: '请输入单位' }],
              })(
                <Fragment>
                  <Input
                    {...itemStyles}
                    disabled
                    value={selectedCompany.name}
                    placeholder="请选择"
                  />
                  <Button type="primary" onClick={this.handleViewCompanyModal}>
                    选择单位
              </Button>
                </Fragment>
              )}
            </FormItem>
          )}
          <FormItem {...formItemLayout} label="统一编码">
            {getFieldDecorator('unifiedCode', {
              initialValue: id ? detail.unifiedCode : undefined,
              getValueFromEvent: this.handleTrim,
              rules: [{ required: true, message: '请输入统一编码' }],
            })(<Input {...itemStyles} placeholder="请输入" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="所属罐组编号">
            {getFieldDecorator('tankGroupNumber', {
              initialValue: id ? detail.tankGroupNumber : undefined,
              getValueFromEvent: this.handleTrim,
              rules: [{ required: true, message: '请输入所属罐组编号' }],
            })(<Input {...itemStyles} placeholder="请输入" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="储罐编号">
            {getFieldDecorator('tankNumber', {
              initialValue: id ? detail.tankNumber : undefined,
              getValueFromEvent: this.handleTrim,
              rules: [
                { required: true, message: '请输入储罐编号' },
              ],
            })(<Input {...itemStyles} placeholder="请输入" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="储罐名称">
            {getFieldDecorator('tankName', {
              initialValue: id ? detail.tankName : undefined,
              getValueFromEvent: this.handleTrim,
              rules: [
                { required: true, message: '请输入储罐名称' },
              ],
            })(<Input {...itemStyles} placeholder="请输入" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="储罐位置分类">
            {getFieldDecorator('tankLocationCate', {
              initialValue: id ? detail.tankLocationCate : undefined,
              rules: [{ required: true, message: '请选择储罐位置分类' }],
            })(
              <Select {...itemStyles} allowClear placeholder="请选择">
                {storageAreaList.map(({ key, value }) => (
                  <Option key={key} value={key}>
                    {value}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="所属储罐区">
            {getFieldDecorator('tankArea', {
              initialValue: id ? detail.tankArea : undefined,
              getValueFromEvent: this.handleTrim,
            })(
              <Fragment>
                <Input value={selectedArea.length ? selectedArea[0].areaName : ''} disabled {...itemStyles} placeholder="请输入" />
              </Fragment>
            )}
            <Button type="primary" onClick={this.handleToSelectStorageArea}> 选择</Button>
          </FormItem>
          <FormItem {...formItemLayout} label="位号">
            {getFieldDecorator('number', {
              initialValue: id ? detail.number : undefined,
              getValueFromEvent: this.handleTrim,
              rules: [
                { required: true, message: '请输入位号' },
              ],
            })(<Input {...itemStyles} placeholder="请输入" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="储罐容积（m³）">
            {getFieldDecorator('tankVolume', {
              initialValue: id ? detail.tankVolume : undefined,
              getValueFromEvent: this.handleTrim,
              rules: [
                { required: true, message: '请输入储罐容积（m³）' },
              ],
            })(<Input {...itemStyles} placeholder="请输入" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="储罐半径（m）">
            {getFieldDecorator('tankRadius', {
              initialValue: id ? detail.tankRadius : undefined,
              getValueFromEvent: this.handleTrim,
              rules: [{ required: true, message: '请输入储罐半径' }],
            })(
              <Input {...itemStyles} placeholder="请输入" />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="储罐高度（m）">
            {getFieldDecorator('tankHeight', {
              initialValue: id ? detail.tankHeight : undefined,
              getValueFromEvent: this.handleTrim,
              rules: [{ required: true, message: '请输入储罐高度' }],
            })(
              <Input {...itemStyles} placeholder="请输入" />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="储罐形式">
            {getFieldDecorator('tankType', {
              initialValue: id ? detail.tankType : undefined,
              rules: [
                { required: true, message: '请选择储罐形式' },
              ],
            })(
              <Select {...itemStyles} allowClear placeholder="请选择">
                {storagTypeList.map(({ key, value }) => (
                  <Option key={key} value={key}>
                    {value}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="储罐结构">
            {getFieldDecorator('tankStructure', {
              initialValue: id ? detail.tankStructure : undefined,
              rules: [
                { required: true, message: '请选择储罐结构' },
              ],
            })(
              <Select {...itemStyles} allowClear placeholder="请选择">
                {constructList.map(({ key, value }) => (
                  <Option key={key} value={key}>
                    {value}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="储罐材质">
            {getFieldDecorator('tankMaterial', {
              initialValue: id ? detail.tankMaterial : undefined,
              rules: [
                { required: true, message: '请选择储罐材质' },
              ],
            })(
              <Select {...itemStyles} allowClear placeholder="请选择">
                {materialList.map(({ key, value }) => (
                  <Option key={key} value={key}>
                    {value}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="是否压力容器">
            {getFieldDecorator('pressureVessel', {
              initialValue: id ? detail.pressureVessel : undefined,
              rules: [{ required: true, message: '请选择是否压力容器' }],
            })(
              <Select {...itemStyles} allowClear placeholder="请选择">
                {selectTypeList.map(({ key, value }) => (
                  <Option key={key} value={key}>
                    {value}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
          {pressureVessel === '1' && (
            <Fragment>
              <FormItem {...formItemLayout} label="压力等级">
                {getFieldDecorator('pressureRate', {
                  // initialValue: id ? detail.pressureRate : undefined,
                  rules: [{ required: true, message: '请选择压力等级' }],
                })(
                  <Select {...itemStyles} allowClear placeholder="请选择">
                    {pressureList.map(({ key, value }) => (
                      <Option key={key} value={key}>
                        {value}
                      </Option>
                    ))}
                  </Select>
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="设计压力（KPa）">
                {getFieldDecorator('designPressure', {
                  // initialValue: id ? detail.designPressure : undefined,
                  getValueFromEvent: this.handleTrim,
                  rules: [{ required: true, message: '请输入设计压力（KPa）' }],
                })(<Input {...itemStyles} placeholder="请输入" />)}
              </FormItem>
            </Fragment>
          )}
          <FormItem {...formItemLayout} label="设计储量">
            {getFieldDecorator('designReservesAndUnit', {
              initialValue: id ? [detail.designReserves, detail.designReservesUnit || null] : [],
              // getValueFromEvent: this.handleTrim,
              rules: [{ required: true, validator: this.validateDesignReservesAndUnit }],
            })(
              <Fragment>
                <Input
                  value={designReservesAndUnit ? designReservesAndUnit[0] : undefined}
                  onChange={e => { setFieldsValue({ designReservesAndUnit: [e.target.value.trim(), designReservesAndUnit[1]] }) }}
                  {...itemStyles}
                  placeholder="请输入" />
                <Input
                  value={designReservesAndUnit ? designReservesAndUnit[1] : undefined}
                  onChange={e => { setFieldsValue({ designReservesAndUnit: [designReservesAndUnit[0], e.target.value.trim()] }) }}
                  style={{ width: '100px' }}
                  placeholder="单位" />
              </Fragment>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="进出料方式">
            {getFieldDecorator('feedDischargMode', {
              initialValue: id ? detail.feedDischargMode : undefined,
              getValueFromEvent: this.handleTrim,
              rules: [
                {
                  required: true,
                  message: '请输入进出料方式',
                },
              ],
            })(<Input {...itemStyles} placeholder="请输入" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="投产日期">
            {getFieldDecorator('productDate', {
              initialValue: id && detail.productDate ? moment(detail.productDate) : undefined,
              rules: [
                {
                  required: true,
                  message: '请输入投产日期',
                },
              ],
            })(
              <DatePicker
                {...itemStyles}
                showToday={false}
                format="YYYY-MM-DD"
                placeholder="请选择"
              />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="存储介质">
            {getFieldDecorator('storageMedium', {
              initialValue: id ? detail.storageMedium : undefined,
              getValueFromEvent: this.handleTrim,
              rules: [
                {
                  required: true,
                  message: '请输入存储介质',
                },
              ],
            })(
              <Fragment>
                <Input disabled value={selectedMedium.length ? selectedMedium[0].chineName : ''} {...itemStyles} placeholder="请输入" />
              </Fragment>
            )}
            <Button type="primary" onClick={this.handleToSelectStorageMedium}> 选择</Button>
          </FormItem>
          {/* <FormItem {...formItemLayout} label="是否构成重大危险源">
            {getFieldDecorator('majorHazard', {
              initialValue: id ? detail.majorHazard : undefined,
              rules: [
                {
                  required: true,
                  message: '请选择是否构成重大危险源',
                },
              ],
            })(
              <Select {...itemStyles} allowClear placeholder="请选择">
                {selectTypeList.map(({ key, value }) => (
                  <Option key={key} value={key}>
                    {value}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="所属危险化学品重大危险源单元">
            {getFieldDecorator('chemicalsMajorHazard', {
              initialValue: id ? detail.chemicalsMajorHazard : undefined,
              getValueFromEvent: this.handleTrim,
            })(
              <Fragment>
                <Input disabled value={selectedMajorHazard.length ? selectedMajorHazard[0].name : ''} {...itemStyles} placeholder="请输入" />
              </Fragment>
            )}
            <Button onClick={this.handleToSelectMajorHazard} type="primary"> 选择</Button>
          </FormItem> */}
          <FormItem {...formItemLayout} label="是否高危储罐">
            {getFieldDecorator('highRiskTank', {
              initialValue: id ? detail.highRiskTank : undefined,
              rules: [
                {
                  required: true,
                  message: '请选择是否高危储罐',
                },
              ],
            })(
              <Select {...itemStyles} allowClear placeholder="请选择">
                {selectTypeList.map(({ key, value }) => (
                  <Option key={key} value={key}>
                    {value}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="高危储罐自控系统">
            {getFieldDecorator('highRiskTankSystem', {
              initialValue: id ? detail.highRiskTankSystem : undefined,
              getValueFromEvent: this.handleTrim,
            })(<Input {...itemStyles} placeholder="请输入" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="安全设备">
            {getFieldDecorator('safeEquip', {
              initialValue: id ? detail.safeEquip : undefined,
              getValueFromEvent: this.handleTrim,
              rules: [
                {
                  required: true,
                  message: '请输入安全设备',
                },
              ],
            })(<Input {...itemStyles} placeholder="请输入" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="有无围堰">
            {getFieldDecorator('cofferdam', {
              initialValue: id ? detail.cofferdam : undefined,
              rules: [
                {
                  required: true,
                  message: '请选择有无围堰',
                },
              ],
            })(
              <Select {...itemStyles} allowClear placeholder="请选择">
                <Option value="1">无</Option>
                <Option value="2">有</Option>
              </Select>
            )}
          </FormItem>
          {cofferdam === '2' && (
            <FormItem {...formItemLayout} label="围堰所围面积">
              {getFieldDecorator('cofferdamArea', {
                // initialValue: id ? detail.cofferdamArea : undefined,
                getValueFromEvent: this.handleTrim,
                rules: [{ required: true, message: '请输入围堰所围面积' }],
              })(<Input {...itemStyles} placeholder="请输入" />)}
            </FormItem>
          )}
          <FormItem {...formItemLayout} label="火灾危险性等级">
            {getFieldDecorator('fireHazardRate', {
              initialValue: id ? detail.fireHazardRate : undefined,
              rules: [
                {
                  required: true,
                  message: '请选择火灾危险性等级',
                },
              ],
            })(
              <Select {...itemStyles} allowClear placeholder="请选择">
                {dangerLevelList.map(({ key, value }) => (
                  <Option key={key} value={key}>
                    {value}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="是否配套火柜">
            {getFieldDecorator('setFire', {
              initialValue: id ? detail.setFire : undefined,
              rules: [
                {
                  required: true,
                  message: '请选择是否配套火柜',
                },
              ],
            })(
              <Select {...itemStyles} allowClear placeholder="请选择">
                {selectTypeList.map(({ key, value }) => (
                  <Option key={key} value={key}>
                    {value}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="是否设置保温/保冷">
            {getFieldDecorator('warmCool', {
              initialValue: id ? detail.warmCool : undefined,
              rules: [
                {
                  required: true,
                  message: '请选择是否设置保温/保冷',
                },
              ],
            })(
              <Select {...itemStyles} allowClear placeholder="请选择">
                {selectTypeList.map(({ key, value }) => (
                  <Option key={key} value={key}>
                    {value}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="是否设置自动喷淋">
            {getFieldDecorator('autoSpray', {
              initialValue: id ? detail.autoSpray : undefined,
              rules: [
                {
                  required: true,
                  message: '请选择是否设置自动喷淋',
                },
              ],
            })(
              <Select {...itemStyles} allowClear placeholder="请选择">
                {selectTypeList.map(({ key, value }) => (
                  <Option key={key} value={key}>
                    {value}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="是否设置消防水炮/泡沫炮">
            {getFieldDecorator('fireWaterFoam', {
              initialValue: id ? detail.fireWaterFoam : undefined,
              rules: [
                {
                  required: true,
                  message: '请选择是否设置消防水炮/泡沫炮',
                },
              ],
            })(
              <Select {...itemStyles} allowClear placeholder="请选择">
                {selectTypeList.map(({ key, value }) => (
                  <Option key={key} value={key}>
                    {value}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="备注">
            {getFieldDecorator('remarks', {
              initialValue: id ? detail.remarks : undefined,
              getValueFromEvent: this.handleTrim,
            })(<TextArea {...itemStyles} placeholder="请输入" rows={4} maxLength="2000" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="现场照片">
            {getFieldDecorator('scenePhoto')(
              <Upload
                name="files"
                headers={{ 'JA-Token': getToken() }}
                accept="image/*" // 接收的文件格式
                data={{ folder: 'securityManageInfo' }} // 附带的参数
                action={uploadAction} // 上传地址
                onChange={this.handleUploadPicChange}
                fileList={uploadPics}
              >
                <Button>
                  <Icon type={picUploading ? 'loading' : "upload"} />
                  点击上传
                </Button>
              </Upload>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="附件">
            {getFieldDecorator('otherFile')(
              <Upload
                name="files"
                headers={{ 'JA-Token': getToken() }}
                data={{ folder: 'securityManageInfo' }} // 附带的参数
                action={uploadAction} // 上传地址
                fileList={uploadFiles}
                onChange={this.handleUploadFileChange}
              >
                <Button>
                  <Icon type={fileUploading ? 'loading' : "upload"} />
                  点击上传
                </Button>
              </Upload>
            )}
          </FormItem>
          <FormItem label="区域位置录入方式" {...formItemLayout}>
            {getFieldDecorator('locationType', {
              rules: [{ required: true, message: '请选择区域位置录入方式' }],
            })(
              <Radio.Group onChange={(e) => this.handleRefreshBuilding()}>
                <Radio value={0}>选择建筑物-楼层</Radio>
                <Radio value={1}>手填</Radio>
              </Radio.Group>
            )}
          </FormItem>
          {(!locationType || locationType === 0) && companyId && (
            <Fragment>
              <FormItem label="所属建筑物楼层" {...formItemLayout}>
                {getFieldDecorator('buildingFloor', {
                  rules: [{ required: true, validator: this.validateBuildingFloor }],
                })(
                  <Fragment>
                    <Col span={5} style={{ marginRight: '10px' }}>
                      {getFieldDecorator('buildingId')(
                        <Select placeholder="建筑物" style={{ width: '100%' }} onChange={this.handleSelectBuilding} allowClear>
                          {buildings.map((item, i) => (
                            <Select.Option key={i} value={item.id}>{item.buildingName}</Select.Option>
                          ))}
                        </Select>
                      )}
                    </Col>
                    <Col span={5} style={{ marginRight: '10px' }}>
                      {getFieldDecorator('floorId')(
                        <Select placeholder="楼层" style={{ width: '100%' }} onChange={() => this.changeFlatPicBuildingNum()} allowClear>
                          {floors.map((item, i) => (
                            <Select.Option key={i} value={item.id}>{item.floorName}</Select.Option>
                          ))}
                        </Select>
                      )}
                    </Col>
                    <Tooltip title="刷新建筑物楼层" className={styles.mr10}>
                      <Button onClick={() => this.handleRefreshBuilding(true)}>
                        <Icon type="reload" />
                      </Button>
                    </Tooltip>
                    <AuthButton
                      onClick={this.jumpToBuildingManagement}
                      code={codesMap.company.buildingsInfo.add}
                      type="primary"
                    >
                      新增建筑物楼层
                </AuthButton>
                  </Fragment>
                )}
              </FormItem>
              <FormItem label="详细位置" {...formItemLayout}>
                {getFieldDecorator('location', {
                  initialValue: id ? detail.location : undefined,
                })(
                  <Input placeholder="请输入" {...itemStyles} />
                )}
              </FormItem>
            </Fragment>
          )}
          {locationType === 1 && companyId && (
            <Fragment>
              <FormItem label="所在区域" {...formItemLayout}>
                {getFieldDecorator('area', {
                  initialValue: id ? detail.area : undefined,
                })(
                  <Input placeholder="请输入" {...itemStyles} />
                )}
              </FormItem>
              <FormItem label="位置详情" {...formItemLayout}>
                {getFieldDecorator('location', {
                  initialValue: id ? detail.location : undefined,
                })(
                  <Input placeholder="请输入" {...itemStyles} />
                )}
              </FormItem>
            </Fragment>
          )}
          {companyId && (
            <FormItem label="平面图标注" {...formItemLayout}>
              <Button
                type="primary"
                style={{ padding: '0 12px' }}
                onClick={this.handleAddFlatGraphic}
                disabled={!isNaN(editingIndex) || pointFixInfoList && pointFixInfoList.length >= 4}
              >
                新增
              </Button>
              <FlatPic {...FlatPicProps} />
            </FormItem>
          )}
        </Form>
      </Card>
    );
  }

  /* 渲染错误信息 */
  renderErrorInfo () {
    const {
      form: { getFieldsError },
    } = this.props;
    const errors = getFieldsError();
    const errorCount = Object.keys(errors).filter(key => errors[key]).length;
    if (!errors || errorCount === 0) {
      return null;
    }
    const scrollToField = fieldKey => {
      const labelNode = document.querySelector(`label[for="${fieldKey}"]`);
      if (labelNode) {
        labelNode.scrollIntoView(true);
      }
    };
    const errorList = Object.keys(errors).map(key => {
      if (!errors[key]) {
        return null;
      }
      return (
        <li key={key} className={styles.errorListItem} onClick={() => scrollToField(key)}>
          <Icon type="cross-circle-o" className={styles.errorIcon} />
          <div className={styles.errorMessage}>{errors[key][0]}</div>
          <div className={styles.errorField}>{fieldLabels[key]}</div>
        </li>
      );
    });
    return (
      <span className={styles.errorIcon}>
        <Popover
          title="表单校验信息"
          content={errorList}
          overlayClassName={styles.errorPopover}
          trigger="click"
          getPopupContainer={trigger => trigger.parentNode}
        >
          <Icon type="exclamation-circle" style={{ marginRight: '5px' }} />
          {errorCount}
        </Popover>
      </span>
    );
  }

  /**
  * 渲染底部工具栏
  **/
  renderFooterToolbar () {
    return (
      <FooterToolbar>
        {this.renderErrorInfo()}
        <Button type="primary" size="large" onClick={this.handleSubmit}>
          提交
        </Button>
        <Button type="primary" size="large" onClick={this.goBack}>
          返回
        </Button>
      </FooterToolbar>
    );
  }

  // 渲染页面所有信息
  render () {
    const {
      companyLoading,
      match: { params: { id } },
      route: { name },
      sensor: { companyModal }, // companyModal { list , pagination:{} }
      baseInfo: {
        storageTankArea, // 储罐区
      },
      materials,
      // reservoirRegion: {
      //   sourceData, // 重大危险源
      // },
    } = this.props;
    const {
      companyModalVisible,
      storageTankAreaModalVisible,
      storageMediumModalVisible,
      // majorHazardModalVisible,
      selectedTempKeys,
    } = this.state

    const isDetail = name === 'view';
    const title = id ? isDetail ? '详情' : editTitle : addTitle;
    // 面包屑
    const breadcrumbList = [
      { title: '首页', name: '首页', href: '/' },
      { title: '重大危险源基本信息', name: '重大危险源基本信息' },
      { title: '储罐管理', name: '储罐管理', href: '/major-hazard-info/storage-management/list' },
      { title, name: title },
    ];
    const areaProps = {
      visible: storageTankAreaModalVisible,
      fetch: this.fetchStorageTankAreaForPage,
      model: storageTankArea,
      onCancel: () => { this.setState({ storageTankAreaModalVisible: false }) },
      rowSelection: {
        selectedRowKeys: selectedTempKeys,
        onChange: (keys, rows) => { this.setState({ selectedTempKeys: keys, selectedTemp: rows }) },
        type: 'radio',
      },
      handleSelect: this.handleSelectArea,
    };
    const mediumProps = {
      visible: storageMediumModalVisible,
      fetch: this.fetchStorageMedium,
      model: materials,
      onCancel: () => { this.setState({ storageMediumModalVisible: false }) },
      rowSelection: {
        selectedRowKeys: selectedTempKeys,
        onChange: (keys, rows) => { this.setState({ selectedTempKeys: keys, selectedTemp: rows }) },
        type: 'radio',
      },
      handleSelect: this.handleSelectMedium,
    };
    // const majorHazardProps = {
    //   visible: majorHazardModalVisible,
    //   fetch: this.fetchMajorHazard,
    //   model: sourceData,
    //   onCancel: () => { this.setState({ majorHazardModalVisible: false }) },
    //   rowSelection: {
    //     selectedRowKeys: selectedTempKeys,
    //     onChange: (keys, rows) => { this.setState({ selectedTempKeys: keys, selectedTemp: rows }) },
    //     type: 'radio',
    //   },
    //   handleSelect: this.handleSelectMajorHazard,
    // }
    return (
      <PageHeaderLayout title={title} breadcrumbList={breadcrumbList}>
        {this.renderInfo()}
        {isDetail ? null : this.renderFooterToolbar()}
        {/* 选择企业弹窗 */}
        <CompanyModal
          title="选择单位"
          loading={companyLoading}
          visible={companyModalVisible}
          modal={companyModal}
          fetch={this.fetchCompany}
          onSelect={this.handleSelectCompany}
          onClose={() => {
            this.setState({ companyModalVisible: false });
          }}
        />
        {/* 选择储罐区弹窗--单选 */}
        <StorageTankAreaModal {...areaProps} />
        {/* 选择存储介质弹窗--单选 */}
        <StorageMediumModal {...mediumProps} />
        {/* 选择重大危险源弹窗 */}
        {/* <MajorHazardListModal {...majorHazardProps} /> */}
      </PageHeaderLayout>
    );
  }
}
