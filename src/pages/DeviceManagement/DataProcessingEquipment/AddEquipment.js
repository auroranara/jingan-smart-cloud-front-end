import { Component, Fragment } from 'react';
import {
  Card,
  Form,
  Input,
  Select,
  Button,
  Row,
  Col,
  message,
  Radio,
  DatePicker,
  Icon,
  Tooltip,
  InputNumber,
  Checkbox,
} from 'antd';
import { connect } from 'dva';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import router from 'umi/router';
import { AuthButton } from '@/utils/customAuth';
import codesMap from '@/utils/codes';
import moment from 'moment';
import { phoneReg } from '@/utils/validate';
// 片面图标注
import FlatPic from '@/pages/DeviceManagement/Components/FlatPic';
// 选择网关设备弹窗
import GateWayModal from '@/pages/DeviceManagement/Components/GateWayModal';
import { dataProcessingType } from '@/utils/dict'; // 数据处理设备类型枚举
import styles from '../NewSensor/AddSensor.less';

const FormItem = Form.Item;
const { Option } = Select

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};
const itemStyles = { style: { width: 'calc(70%)', marginRight: '10px' } }

@Form.create()
@connect(({ sensor, device, riskPointManage, buildingsInfo, personnelPosition, user, loading }) => ({
  sensor,
  device,
  personnelPosition,
  riskPointManage,
  buildingsInfo,
  user,
  gatewayLoading: loading.effects['device/fetchGatewayEquipmentForPage'],
}))
export default class AddEquipment extends Component {

  constructor(props) {
    super(props)
    this.state = {
      pointFixInfoList: [],  // 平面图标志
      editingIndex: undefined, // 当前编辑的平面图标志下标
      monitorType: undefined,
      uploading: false,
      picModalVisible: false, // 定位弹窗可见
      imgIdCurrent: '',
      isImgSelect: true,
      gateWayModalVisible: false, // 选择网关设备弹窗
      gatewayEquipment: {}, // 选择的网关设备
    }
  }

  componentDidMount() {
    const {
      dispatch,
      match: { params: { id, type } },
      location: { query: { companyId, gatewayCode, gatewayId } },
      form: { setFieldsValue },
    } = this.props
    if (!companyId) {
      message.warning('请传入参数companyId')
      return
    }
    // 获取字典 建筑物 品牌
    this.fetchAgreementNameDict()
    this.fetchNetworkTypeDict()
    this.fetchOperatorDict()
    this.fetchConnectTypeDict()
    this.fetchBuildings({ payload: { pageNum: 1, pageSize: 0, company_id: companyId } });
    this.fetchBrands({ payload: { equipmentType: type } })
    // 如果编辑
    if (id) {
      dispatch({
        type: 'device/fetchEquipmentDetail',
        payload: { id },
        callback: ({
          pointFixInfoList,
          buildingId,
          floorId,
          brand,
          gatewayEquipment,
          gatewayEquipmentCode,
          reset,
        }) => {
          this.setState({
            pointFixInfoList,
            gatewayEquipment: { id: gatewayEquipment, code: gatewayEquipmentCode },
          }, () => {
            setFieldsValue({ buildingId, floorId });
          })
          buildingId && this.fetchFloors({ payload: { pageNum: 1, pageSize: 0, building_id: buildingId } });
          this.fetchModels({ payload: { equipmentType: type, brand } })
        },
      })
    } else {
      // 如果新增 且从用户传输装置页面跳转过来
      gatewayCode && this.setState({ gatewayEquipment: { id: gatewayId, code: gatewayCode } });
    }
  }


  /**
   * 获取--协议名称字典
   */
  fetchAgreementNameDict = actions => {
    const { dispatch } = this.props
    dispatch({ type: 'device/fetchAgreementNameDict', ...actions })
  }

  /**
  * 获取--联网方式字典
  */
  fetchNetworkTypeDict = actions => {
    const { dispatch } = this.props
    dispatch({ type: 'device/fetchNetworkTypeDict', ...actions })
  }

  /**
  * 获取--运营商字典
  */
  fetchOperatorDict = actions => {
    const { dispatch } = this.props
    dispatch({ type: 'device/fetchOperatorDict', ...actions })
  }

  /**
  * 获取--连接方式字典
  */
  fetchConnectTypeDict = actions => {
    const { dispatch } = this.props
    dispatch({ type: 'device/fetchConnectTypeDict', ...actions })
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
   * 获取品牌列表（全部）
   */
  fetchBrands = actions => {
    const { dispatch } = this.props
    dispatch({
      type: 'device/fetchBrands',
      ...actions,
    })
  }

  /**
  * 获取型号列表（全部）
  */
  fetchModels = actions => {
    const { dispatch } = this.props
    dispatch({
      type: 'device/fetchModels',
      ...actions,
    })
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
   * 添加平面图标志
   */
  handleAddFlatGraphic = () => {
    this.setState(({ pointFixInfoList }) => ({
      editingIndex: pointFixInfoList.length,
      pointFixInfoList: [...pointFixInfoList, { imgType: undefined, ynum: undefined, xnum: undefined, fixImgId: undefined }],
    }))
  }

  /**
  * 刷新建筑物楼层图下拉
  * @param {Boolean} weatherFetch 是否重新获取建筑物选项下拉
  */
  handleRefreshBuilding = (weatherFetch = false) => {
    const {
      location: { query: { companyId } },
      form: { setFieldsValue },
    } = this.props
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

  /**
   * 打开选择网关设备编号弹窗
   */
  handleViewGateWayModal = () => {
    this.setState({ gateWayModalVisible: true })
    this.fetchGatewayForPage()
  }

  /**
   * 获取网关设备（分页）
   */
  fetchGatewayForPage = (payload = { pageNum: 1, pageSize: 10 }) => {
    const {
      dispatch,
      location: { query: { companyId } },
    } = this.props
    dispatch({
      type: 'device/fetchGatewayEquipmentForPage',
      payload: { companyId, ...payload },
    })
  }


  /**
   * 选择网关设备
   */
  handleGateSelect = row => {
    const { form: { setFieldsValue } } = this.props
    setFieldsValue({ gatewayEquipment: row.id })
    this.setState({ gatewayEquipment: row, gateWayModalVisible: false })
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

  /**
   * 品牌改变
   */
  handleBrandChange = (brand) => {
    const { match: { params: { type } } } = this.props
    this.fetchModels({ payload: { equipmentType: type, brand } })
  }

  handleSubmit = () => {
    const {
      dispatch,
      match: { params: { id, type } },
      location: { query: { companyId, companyName, gatewayId } },
      form: { validateFields },
    } = this.props
    const {
      editingIndex,
      pointFixInfoList, // 平面图标志
    } = this.state
    // 设备类型是否是消防主机
    const isFireHost = +type === 101
    if (!isNaN(editingIndex)) {
      message.warning('请先保存平面图信息')
      return
    }
    validateFields((err, values) => {
      if (err) return
      const payload = {
        ...values,
        pointFixInfoList, // 平面图标注列表
        companyId,
        reset: isFireHost ? +values.reset : undefined,
      }
      const tag = id ? '编辑' : '新增';
      const success = () => {
        message.success(`${tag}成功`);
        if (window.history.length > 1) {
          router.goBack();
        } else router.push(`/device-management/data-processing/list/${type}?companyId=${companyId}${gatewayId ? '' : `&companyName=${companyName}`}`)
      }
      const error = (res) => { message.error(res ? res.msg : `${tag}失败`) }
      if (id) {
        // 如果新增
        dispatch({
          type: 'device/editEquipment',
          payload: { ...payload, id },
          success,
          error,
        })
      } else {
        // 如果新增
        dispatch({
          type: 'device/addEquipment',
          payload,
          success,
          error,
        })
      }
    })
  }

  /**
   * 渲染表单
   */
  renderForm = () => {
    const {
      dispatch,
      form,
      form: { getFieldDecorator, getFieldsValue },
      match: { params: { id, type } },
      location: { query: {
        companyId,
        gatewayCode, // 网关设备编号（用户传输装置页面过来）
        gatewayId,
      } },
      device: {
        equipmentDetail: detail = {},
        flatGraphic,
        agreementNameDict, // 协议名称字典
        networkTypeDict, // 联网方式字典
        operatorDict, // 运营商字典
        connectTypeDict,// 连接方式字典
        brandList,
        modelList,
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
    } = this.props

    const {
      editingIndex,
      pointFixInfoList,
      picModalVisible,
      isImgSelect,
      imgIdCurrent,
      gatewayEquipment,
    } = this.state

    const { connectGateway, networkingType, locationType, inheritGather } = getFieldsValue()
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
    // 设备是否是NRV
    const isNVR = +type === 110
    // 设备类型是否是消防主机
    const isFireHost = +type === 101
    return (
      <Card>
        <Form>
          <FormItem label="品牌" {...formItemLayout}>
            {getFieldDecorator('brand', {
              initialValue: id ? detail.brand : undefined,
              rules: [{ required: true, message: '请选择' }],
            })(
              <Select className={styles.item} placeholder="请选择品牌" onChange={this.handleBrandChange} {...itemStyles}>
                {brandList.map(({ id, name }) => <Option key={id}>{name}</Option>)}
              </Select>
            )}
          </FormItem>
          <FormItem label="型号" {...formItemLayout}>
            {getFieldDecorator('model', {
              initialValue: id ? detail.model : undefined,
              rules: [{ required: true, message: '请选择' }],
            })(
              <Select className={styles.item} placeholder="请选择型号" {...itemStyles}>
                {modelList.map((data) => <Option key={data.id} data={data}>{data.name}</Option>)}
              </Select>
            )}
          </FormItem>
          <FormItem label="设备编号" {...formItemLayout}>
            {getFieldDecorator('code', {
              initialValue: id ? detail.code : undefined,
              rules: [
                { required: true, message: '请输入设备编号' },
                isFireHost ? { pattern: /^\d*$/, message: '请输入数字' } : {},
              ],
            })(
              <Input placeholder="请输入" {...itemStyles} />
            )}
          </FormItem>
          {/* 生产信息 */}
          <FormItem label="生产厂家" {...formItemLayout}>
            {getFieldDecorator('productCompany', {
              initialValue: id ? detail.productCompany : undefined,
            })(
              <Input placeholder="请输入" {...itemStyles} />
            )}
          </FormItem>
          <FormItem label="生产厂家电话" {...formItemLayout}>
            {getFieldDecorator('productCompanyPhone', {
              initialValue: id ? detail.productCompanyPhone : undefined,
              rules: [{ pattern: phoneReg, message: '电话格式不正确' }],
            })(
              <Input placeholder="请输入" {...itemStyles} />
            )}
          </FormItem>
          <FormItem label="生产日期" {...formItemLayout}>
            {getFieldDecorator('productDate', {
              initialValue: id && detail.productDate ? moment(detail.productDate) : undefined,
            })(
              <DatePicker />
            )}
          </FormItem>
          <FormItem label="使用期限（月）" {...formItemLayout}>
            {getFieldDecorator('serviceLife', {
              initialValue: id ? detail.serviceLife : undefined,
            })(
              <InputNumber min={1} placeholder="请输入" {...itemStyles} />
            )}
          </FormItem>
          {/* 设备关系 */}
          <FormItem label="集成数据采集" {...formItemLayout}>
            {getFieldDecorator('inheritGather', {
              initialValue: id ? detail.inheritGather : 0,
            })(
              <Radio.Group disabled={isNVR || isFireHost}>
                <Radio value={1}>是，独立式传感器</Radio>
                <Radio value={0}>否，非独立式，可接入多个传感器</Radio>
              </Radio.Group>
            )}
          </FormItem>
          {inheritGather === 1 && (
            <FormItem label="监测点名称" {...formItemLayout}>
              {getFieldDecorator('name', {
                initialValue: id ? detail.name : undefined,
                rules: [{ required: true, message: '请输入监测点名称' }],
              })(
                <Input placeholder="请输入" {...itemStyles} />
              )}
            </FormItem>
          )}
          <FormItem label="是否接入网关设备" {...formItemLayout}>
            {getFieldDecorator('connectGateway', {
              initialValue: id ? detail.connectGateway : 1,
            })(
              <Radio.Group disabled={isNVR || isFireHost}>
                <Radio value={1}>是</Radio>
                <Radio value={0}>否</Radio>
              </Radio.Group>
            )}
          </FormItem>
          {connectGateway ? (
            <Fragment>
              <FormItem label="网关设备编号" {...formItemLayout}>
                {getFieldDecorator('gatewayEquipment', {
                  rules: [{ required: true, message: '请选择网关设备编号' }],
                  initialValue: id ? detail.gatewayEquipment : (gatewayId || undefined),
                })(
                  <Fragment>
                    <Input disabled value={gatewayCode || gatewayEquipment.code} placeholder="请选择" {...itemStyles} />
                    <Button disabled={!!gatewayId} type="primary" onClick={this.handleViewGateWayModal}>选择</Button>
                  </Fragment>
                )}
              </FormItem>
              <FormItem label="连接方式" {...formItemLayout}>
                {getFieldDecorator('connectType', {
                  rules: [{ required: true, message: '请选择连接方式' }],
                  initialValue: id ? detail.connectType : undefined,
                })(
                  <Select placeholder="请选择" {...itemStyles}>
                    {connectTypeDict.map(({ value, desc }) => (
                      <Option key={value} value={value}>{desc}</Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Fragment>
          ) : (
              <Fragment>
                <FormItem label="协议名称" {...formItemLayout}>
                  {getFieldDecorator('agreementType', {
                    initialValue: id ? detail.agreementType : undefined,
                  })(
                    <Select placeholder="请选择" {...itemStyles}>
                      {agreementNameDict.map(({ value, desc }) => (
                        <Option key={value} value={value}>{desc}</Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
                {/*
                1、如果选择2G / 3G / 4G / 5G、GPRS或NB-IoT，则联动出现以下字段：运营商、上网卡卡号、卡失效日期、卡是否可插拔
                2、如果选择的是非以上几个选项，则无其他字段
              */}
                <FormItem label="联网方式" {...formItemLayout}>
                  {getFieldDecorator('networkingType', {
                    initialValue: id ? detail.networkingType : undefined,
                    rules: [{ required: true, message: '请选择联网方式' }],
                  })(
                    <Select placeholder="请选择" {...itemStyles}>
                      {networkTypeDict.map(({ value, desc }) => (
                        <Option key={value} value={value}>{desc}</Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
                {[1, 2, 3].includes(+networkingType) && (
                  <Fragment>
                    <FormItem label="运营商" {...formItemLayout}>
                      {getFieldDecorator('operator', {
                        initialValue: id ? detail.operator : undefined,
                      })(
                        <Select placeholder="请选择" {...itemStyles}>
                          {operatorDict.map(({ value, desc }) => (
                            <Option key={value} value={value}>{desc}</Option>
                          ))}
                        </Select>
                      )}
                    </FormItem>
                    <FormItem label="上网卡卡号" {...formItemLayout}>
                      {getFieldDecorator('cardNum', {
                        initialValue: id ? detail.cardNum : undefined,
                      })(
                        <Input placeholder="请输入" {...itemStyles} />
                      )}
                    </FormItem>
                    <FormItem label="卡失效日期" {...formItemLayout}>
                      {getFieldDecorator('cardExpireDate', {
                        initialValue: id && detail.cardExpireDate ? moment(detail.cardExpireDate) : undefined,
                      })(
                        <DatePicker />
                      )}
                    </FormItem>
                    <FormItem label="卡是否可被插拔" {...formItemLayout}>
                      {getFieldDecorator('cardSfp', {
                        initialValue: id ? detail.cardSfp : undefined,
                      })(
                        <Radio.Group>
                          <Radio value={'1'}>是</Radio>
                          <Radio value={'0'}>否</Radio>
                        </Radio.Group>
                      )}
                    </FormItem>
                  </Fragment>
                )}

              </Fragment>
            )}
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
          {isFireHost && (
            <FormItem wrapperCol={{ span: 18, offset: 6 }}>
              {getFieldDecorator('reset', {
                valuePropName: 'checked',
                initialValue: id ? !!detail.reset : false,
              })(
                <Checkbox>接收不到复位信息</Checkbox>
              )}
            </FormItem>
          )}
        </Form>
        <Row style={{ textAlign: 'center', marginTop: '24px' }}>
          <Button onClick={() => { router.goBack() }}>取消</Button>
          <Button type="primary" className={styles.ml10} onClick={this.handleSubmit}>确定</Button>
        </Row>
      </Card>
    )
  }

  render() {
    const {
      gatewayLoading,
      match: { params: { id, type } },
      location: { query: { companyId, companyName, gatewayId } },
    } = this.props
    const { gateWayModalVisible } = this.state
    const title = `${id ? '编辑' : '新增'}${dataProcessingType[type]}`
    const breadcrumbList = [
      { title: '首页', name: '首页', href: '/' },
      { title: '设备管理', name: '设备管理' },
      { title: '单位数据处理设备', name: '单位数据处理设备', href: '/device-management/data-processing/list' },
      { title: '设备列表', name: '设备列表', href: `/device-management/data-processing/list/${type}?companyId=${companyId}${gatewayId ? '' : `&companyName=${companyName}`}` },
      { title, name: title },
    ]
    const gatewayModalProps = {
      visible: gateWayModalVisible,
      handleSelect: this.handleGateSelect,
      onCancel: () => { this.setState({ gateWayModalVisible: false }) },
      fetch: this.fetchGatewayForPage, // 获取列表
      loading: gatewayLoading,
    }
    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
      >
        {this.renderForm()}
        <GateWayModal {...gatewayModalProps} />
      </PageHeaderLayout>
    )
  }
}
