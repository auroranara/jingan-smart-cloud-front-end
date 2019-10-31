import { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
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
import codesMap from '@/utils/codes';

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
const selectTypeList = [{ key: '1', value: '是' }, { key: '2', value: '否' }];

// 表单标签
const fieldLabels = {};

// 上传文件地址
const uploadAction = '/acloud_new/v2/uploadFile';

@connect(({ loading, baseInfo, personnelPosition, riskPointManage, device, sensor, materials }) => ({
  baseInfo,
  personnelPosition,
  riskPointManage,
  device,
  sensor,
  materials,
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
    selectedAreaKeys: [], // 勾选的储罐区key
    storageTankAreaModalVisible: false, // 选择储罐区弹窗是否可见
    selectedMediumKeys: [], // 勾选的存储介质key
    storageMediumModalVisible: false, // 选择存储介质弹窗是否可见
  };

  // 挂载后
  componentDidMount() { }

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
  fetchStorageTankAreaForPage = (actions) => {
    const { dispatch } = this.props
    dispatch({
      type: 'baseInfo/fetchStorageTankAreaForPage',
      ...actions,
    })
  }

  fetchStorageMedium = (actions) => {
    const { dispatch } = this.props
    dispatch({
      type: 'materials/fetchMaterialsList',
      ...actions,
    })
  }

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
    const { dispatch } = this.props;
    dispatch(routerRedux.push(`/base-info/storage-management/list`));
  };

  /**
   * 选择储罐区时监听勾选
   */
  onAreaChange = (keys, row) => {
    this.setState({ selectedAreaKeys: [row.id] })
  }

  /**
   * 选择储罐区
   */
  handleSelectArea = () => {
    const { form: { setFieldsValue } } = this.props
    const { selectedAreaKeys } = this.state
    if (selectedAreaKeys && selectedAreaKeys.length) {
      setFieldsValue({ tankArea: selectedAreaKeys[0].id })
      this.setState({ storageTankAreaModalVisible: false })
    } else message.warning('请选择储罐区')
  }

  /**
   * 选择存储介质
   */
  handleSelectMedium = () => {
    const { form: { setFieldsValue } } = this.props
    const { selectedMediumKeys } = this.state
    if (selectedMediumKeys && selectedMediumKeys.length) {
      setFieldsValue({ tankArea: selectedMediumKeys[0].id })
      this.setState({ storageMediumModalVisible: false })
    } else message.warning('请选择存储介质')
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
    const { editingIndex, pointFixInfoList } = this.state;
    if (!isNaN(editingIndex)) {
      message.warning('请先保存平面图信息')
      return
    }
    validateFields((err, values) => {
      if (err) return
      const payload = {
        ...values,
        pointFixInfoList, // 平面图标注列表
      }
      console.log('submit', payload)
    })
  };

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
      form: { setFieldsValue, getFieldValue },
    } = this.props
    const companyId = getFieldValue('companyId');
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

  renderInfo() {
    const {
      dispatch,
      form,
      form: { getFieldDecorator, getFieldsValue },
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
    } = this.props;

    const {
      selectedCompany, // 选择的单位 { id,name }
      editingIndex, // 平面图标注--当前编辑的下标
      pointFixInfoList,
      picModalVisible,
      isImgSelect,
      imgIdCurrent,
    } = this.state

    const { locationType, companyId } = getFieldsValue();
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
          <FormItem {...formItemLayout} label="统一编码">
            {getFieldDecorator('unifiedCode', {
              getValueFromEvent: this.handleTrim,
              rules: [{ required: true, message: '请输入统一编码' }],
            })(<Input {...itemStyles} placeholder="请输入" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="所属罐组编号">
            {getFieldDecorator('tankGroupNumber', {
              getValueFromEvent: this.handleTrim,
              rules: [{ required: true, message: '请输入所属罐组编号' }],
            })(<Input {...itemStyles} placeholder="请输入" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="储罐编号">
            {getFieldDecorator('tankNumber', {
              getValueFromEvent: this.handleTrim,
              rules: [
                { required: true, message: '请输入储罐编号' },
              ],
            })(<Input {...itemStyles} placeholder="请输入" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="储罐名称">
            {getFieldDecorator('tankName', {
              getValueFromEvent: this.handleTrim,
              rules: [
                { required: true, message: '请输入储罐名称' },
              ],
            })(<Input {...itemStyles} placeholder="请输入" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="储罐位置分类">
            {getFieldDecorator('tankLocationCate', {
              rules: [
                { required: true, message: '请选择储罐位置分类' },
              ],
            })(
              <Select {...itemStyles} allowClear placeholder="请选择">
                {storageAreaList.map(({ key, value }) => (
                  <Option key={key} value={value}>
                    {value}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="所属储罐区">
            {getFieldDecorator('tankArea', {
              getValueFromEvent: this.handleTrim,
            })(<Input {...itemStyles} placeholder="请输入" />)}
            <Button type="primary"> 选择</Button>
          </FormItem>
          <FormItem {...formItemLayout} label="位号">
            {getFieldDecorator('number', {
              getValueFromEvent: this.handleTrim,
              rules: [
                { required: true, message: '请输入位号' },
              ],
            })(<Input {...itemStyles} placeholder="请输入" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="储罐容积（m³）">
            {getFieldDecorator('tankVolume', {
              getValueFromEvent: this.handleTrim,
              rules: [
                { required: true, message: '请输入储罐容积（m³）' },
              ],
            })(<Input {...itemStyles} placeholder="请输入" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="储罐形式">
            {getFieldDecorator('tankType', {
              rules: [
                { required: true, message: '请选择储罐形式' },
              ],
            })(
              <Select {...itemStyles} allowClear placeholder="请选择">
                {storagTypeList.map(({ key, value }) => (
                  <Option key={key} value={value}>
                    {value}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="储罐结构">
            {getFieldDecorator('tankStructure', {
              rules: [
                { required: true, message: '请选择储罐结构' },
              ],
            })(
              <Select {...itemStyles} allowClear placeholder="请选择">
                {constructList.map(({ key, value }) => (
                  <Option key={key} value={value}>
                    {value}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="储罐材质">
            {getFieldDecorator('tankMaterial', {
              rules: [
                { required: true, message: '请选择储罐材质' },
              ],
            })(
              <Select {...itemStyles} allowClear placeholder="请选择">
                {materialList.map(({ key, value }) => (
                  <Option key={key} value={value}>
                    {value}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="是否压力容器">
            {getFieldDecorator('pressureVessel', {
              rules: [
                {
                  required: true,
                  message: '请选择是否压力容器',
                },
              ],
            })(
              <Select {...itemStyles} allowClear placeholder="请选择">
                {selectTypeList.map(({ key, value }) => (
                  <Option key={key} value={value}>
                    {value}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="压力等级">
            {getFieldDecorator('pressureRate', {
              rules: [
                {
                  required: true,
                  message: '请选择压力等级',
                },
              ],
            })(
              <Select {...itemStyles} allowClear placeholder="请选择">
                {pressureList.map(({ key, value }) => (
                  <Option key={key} value={value}>
                    {value}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="设计压力（KPa）">
            {getFieldDecorator('designPressure', {
              getValueFromEvent: this.handleTrim,
              rules: [
                {
                  required: true,
                  message: '请输入设计压力（KPa）',
                },
              ],
            })(<Input {...itemStyles} placeholder="请输入" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="设计储量">
            {getFieldDecorator('designReserves', {
              getValueFromEvent: this.handleTrim,
              rules: [
                {
                  required: true,
                  message: '请输入设计压力（KPa）',
                },
              ],
            })(<Input {...itemStyles} placeholder="请输入" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="进出料方式">
            {getFieldDecorator('feedDischargMode', {
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
              getValueFromEvent: this.handleTrim,
              rules: [
                {
                  required: true,
                  message: '请输入存储介质',
                },
              ],
            })(<Input {...itemStyles} placeholder="请输入" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="是否构成重大危险源">
            {getFieldDecorator('majorHazard', {
              rules: [
                {
                  required: true,
                  message: '请选择是否构成重大危险源',
                },
              ],
            })(
              <Select {...itemStyles} allowClear placeholder="请选择">
                {selectTypeList.map(({ key, value }) => (
                  <Option key={key} value={value}>
                    {value}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="所属危险化学品重大危险源单元">
            {getFieldDecorator('chemicalsMajorHazard', {
              getValueFromEvent: this.handleTrim,
            })(<Input {...itemStyles} placeholder="请输入" />)}
            <Button type="primary"> 选择</Button>
          </FormItem>
          <FormItem {...formItemLayout} label="是否高危储罐">
            {getFieldDecorator('highRiskTank', {
              rules: [
                {
                  required: true,
                  message: '请选择是否高危储罐',
                },
              ],
            })(
              <Select {...itemStyles} allowClear placeholder="请选择">
                {selectTypeList.map(({ key, value }) => (
                  <Option key={key} value={value}>
                    {value}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="高危储罐自控系">
            {getFieldDecorator('highRiskTankSystem', {
              getValueFromEvent: this.handleTrim,
            })(<Input {...itemStyles} placeholder="请输入" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="安全设备">
            {getFieldDecorator('safeEquip', {
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
          <FormItem {...formItemLayout} label="围堰所围面积">
            {getFieldDecorator('cofferdamArea', {
              getValueFromEvent: this.handleTrim,
              rules: [
                {
                  required: true,
                  message: '请输入围堰所围面积',
                },
              ],
            })(<Input {...itemStyles} placeholder="请输入" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="火灾危险性等级">
            {getFieldDecorator('fireHazardRate', {
              rules: [
                {
                  required: true,
                  message: '请选择火灾危险性等级',
                },
              ],
            })(
              <Select {...itemStyles} allowClear placeholder="请选择">
                {dangerLevelList.map(({ key, value }) => (
                  <Option key={key} value={value}>
                    {value}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="是否配套火柜">
            {getFieldDecorator('setFire', {
              rules: [
                {
                  required: true,
                  message: '请选择是否配套火柜',
                },
              ],
            })(
              <Select {...itemStyles} allowClear placeholder="请选择">
                {selectTypeList.map(({ key, value }) => (
                  <Option key={key} value={value}>
                    {value}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="是否设置保温/保冷">
            {getFieldDecorator('warmCool', {
              rules: [
                {
                  required: true,
                  message: '请选择是否设置保温/保冷',
                },
              ],
            })(
              <Select {...itemStyles} allowClear placeholder="请选择">
                {selectTypeList.map(({ key, value }) => (
                  <Option key={key} value={value}>
                    {value}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="是否设置自动喷淋">
            {getFieldDecorator('autoSpray', {
              rules: [
                {
                  required: true,
                  message: '请选择是否设置自动喷淋',
                },
              ],
            })(
              <Select {...itemStyles} allowClear placeholder="请选择">
                {selectTypeList.map(({ key, value }) => (
                  <Option key={key} value={value}>
                    {value}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="是否设置消防水炮/泡沫炮">
            {getFieldDecorator('fireWaterFoam', {
              rules: [
                {
                  required: true,
                  message: '请选择是否设置消防水炮/泡沫炮',
                },
              ],
            })(
              <Select {...itemStyles} allowClear placeholder="请选择">
                {selectTypeList.map(({ key, value }) => (
                  <Option key={key} value={value}>
                    {value}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="备注">
            {getFieldDecorator('remarks', {
              getValueFromEvent: this.handleTrim,
            })(<TextArea {...itemStyles} placeholder="请输入" rows={4} maxLength="2000" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="现场照片">
            {getFieldDecorator('scenePhoto', {})(
              <Upload
                name="files"
                headers={{ 'JA-Token': getToken() }}
                accept=".jpg" // 接收的文件格式
                data={{ folder: 'securityManageInfo' }} // 附带的参数
                showUploadList={false}
                action={uploadAction} // 上传地址
              >
                <Button>
                  <Icon type="upload" />
                  点击上传
                </Button>
              </Upload>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="附件">
            {getFieldDecorator('otherFile', {})(
              <Upload
                name="files"
                headers={{ 'JA-Token': getToken() }}
                accept=".jpg" // 接收的文件格式
                data={{ folder: 'securityManageInfo' }} // 附带的参数
                showUploadList={false}
                action={uploadAction} // 上传地址
              >
                <Button>
                  <Icon type="upload" />
                  点击上传
                </Button>
              </Upload>
            )}
          </FormItem>
          <FormItem label="区域位置录入方式" {...formItemLayout}>
            {getFieldDecorator('locationType', {
              initialValue: id ? detail.locationType : 0,
            })(
              <Radio.Group onChange={(e) => this.handleRefreshBuilding()}>
                <Radio value={0}>选择建筑物-楼层</Radio>
                <Radio value={1}>手填</Radio>
              </Radio.Group>
            )}
          </FormItem>
          {(!locationType || locationType === 0) && (
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
          {locationType === 1 && (
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
          <FormItem label="平面图标注" {...formItemLayout}>
            <Button
              type="primary"
              style={{ padding: '0 12px' }}
              onClick={this.handleAddFlatGraphic}
              disabled={!isNaN(editingIndex) || pointFixInfoList.length >= 4}
            >
              新增
              </Button>
            <FlatPic {...FlatPicProps} />
          </FormItem>
        </Form>
      </Card>
    );
  }

  /* 渲染错误信息 */
  renderErrorInfo() {
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
          <Icon type="exclamation-circle" />
          {errorCount}
        </Popover>
      </span>
    );
  }

  /**
  * 渲染底部工具栏
  **/
  renderFooterToolbar() {
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
  render() {
    const {
      companyLoading,
      match: { params: { id } },
      sensor: { companyModal }, // companyModal { list , pagination:{} }
      baseInfo: {
        storageTankArea, // 储罐区
      },
      materials: {
        list: materialsList,
        pagination: materialsPagination,
      },
    } = this.props;
    const {
      companyModalVisible,
      storageTankAreaModalVisible,
      selectedAreaKeys,
      selectedMediumKeys,
      storageMediumModalVisible,
    } = this.state

    const title = id ? editTitle : addTitle;
    // 面包屑
    const breadcrumbList = [
      { title: '首页', name: '首页', href: '/' },
      { title: '一企一档', name: '一企一档' },
      { title: '储罐管理', name: '储罐管理', href: '/base-info/storage-management/list' },
      { title, name: title },
    ];
    const areaProps = {
      visible: storageTankAreaModalVisible,
      fetch: this.fetchStorageTankAreaForPage,
      model: storageTankArea,
      onCancel: () => { this.setState({ storageTankAreaModalVisible: false }) },
      rowSelection: {
        selectedRowKeys: selectedAreaKeys,
        onChange: this.onAreaChange,
      },
      handleSelect: this.handleSelectArea,
    };
    const mediumProps = {
      visible: storageMediumModalVisible,
      fetch: this.fetchStorageMedium,
      model: { list: materialList, pagination: materialsPagination },
      onCancel: () => { this.setState({ storageMediumModalVisible: false }) },
      rowSelection: {
        selectedRowKeys: selectedMediumKeys,
        onChange: (selectedMediumKeys) => { this.setState({ selectedMediumKeys }) },
      },
      handleSelect: this.handleSelectMedium,
    };
    return (
      <PageHeaderLayout title={title} breadcrumbList={breadcrumbList}>
        {this.renderInfo()}
        {this.renderFooterToolbar()}
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
      </PageHeaderLayout>
    );
  }
}
