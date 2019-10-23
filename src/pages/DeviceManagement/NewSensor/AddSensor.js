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
  TreeSelect,
  Upload,
  Icon,
  Tooltip,
} from 'antd';
import { connect } from 'dva';
import { getToken } from '@/utils/authority';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import router from 'umi/router';
// 选择品牌型号弹窗
import BrandModelModal from '@/pages/DeviceManagement/Components/BrandModelModal';
// 监测参数表格
import MonitoringParameterTable from '@/pages/DeviceManagement/Components/MonitoringParameterTable';
import { AuthButton } from '@/utils/customAuth';
import codesMap from '@/utils/codes';
import moment from 'moment';
import { phoneReg } from '@/utils/validate';
// 片面图标注
import FlatPic from '@/pages/DeviceManagement/Components/FlatPic';
import styles from './AddSensor.less';

const FormItem = Form.Item;
const { TreeNode } = TreeSelect;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};
const itemStyles = { style: { width: 'calc(70%)', marginRight: '10px' } }
const UPLOAD_ACTION = '/acloud_new/v2/uploadFile';
const FOLDER = 'monitor';
/* 渲染树节点 */
const renderTreeNodes = data => {
  return data.map(item => {
    const { id, name, child } = item;
    if (child) {
      return (
        <TreeNode title={name} key={id} value={id}>
          {renderTreeNodes(child)}
        </TreeNode>
      );
    }
    return <TreeNode title={name} key={id} value={id} />;
  });
};


@Form.create()
@connect(({ sensor, device, riskPointManage, buildingsInfo, personnelPosition, user, loading }) => ({
  sensor,
  device,
  personnelPosition,
  riskPointManage,
  buildingsInfo,
  user,
  companyLoading: loading.effects['sensor/fetchModelList'],
}))
export default class AddNewSensor extends Component {
  constructor(props) {
    super(props)
    this.state = {
      pointFixInfoList: [],  // 平面图标志
      editingIndex: undefined, // 当前编辑的平面图标志下标
      brandModelModalVisible: false, // 选择品牌型号弹窗可见
      brand: {},
      model: {},
      monitorType: undefined,
      paramWarnStrategyDtos: [], // 参数报警策略（自定义）
      fileList: [], // 安装图片
      uploading: false,
      picModalVisible: false, // 定位弹窗可见
      imgIdCurrent: '',
      isImgSelect: true,
    }
  }

  componentDidMount() {
    const {
      dispatch,
      match: { params: { id } },
      location: { query: { deviceId } },
      form: { setFieldsValue },
    } = this.props
    this.fetchMonitoringTypeDict()
    if (id) {
      // 获取传感器详情
      // paramWarnStrategyDtos这个参数只有修改或者添加报警策略后 {paramId}对象才会进入paramWarnStrategyDtos数组
      dispatch({
        type: 'device/fetchSensorDetail',
        payload: { id },
        callback: ({
          companyId,
          pointFixInfoList,
          brand,
          brandName,
          model,
          modelName,
          monitorType,
          buildingId,
          floorId,
          installPhotoList = [],
          dataExecuteEquipmentId, // 绑定的设备id
        }) => {
          setFieldsValue({ companyId })
          // 获取设备信息
          dataExecuteEquipmentId ? dispatch({
            type: 'device/fetchEquipmentDetail',
            payload: { id: dataExecuteEquipmentId },
            callback: () => {
              setFieldsValue({ buildingId, floorId })
            },
          }) : dispatch({
            type: 'device/save',
            payload: { equipmentDetail: {} },
          })
          this.setState({
            pointFixInfoList,
            brand: { id: brand, name: brandName },
            model: { id: model, name: modelName },
            monitorType,
            fileList: installPhotoList.map(item => ({
              ...item,
              uid: item.id,
              url: item.webUrl,
              name: item.fileName,
            })),
          })
          model && this.fetchParameterList(model, id)
          this.fetchMonitoringTypeTree()
          companyId && this.fetchBuildings({ payload: { pageNum: 1, pageSize: 0, company_id: companyId } });
          buildingId && this.fetchFloors({ payload: { pageNum: 1, pageSize: 0, building_id: buildingId } })
        },
      })
    } else {
      // 新增时根据设备id获取设备信息
      deviceId && dispatch({
        type: 'device/fetchEquipmentDetail',
        payload: { id: deviceId },
        callback: ({
          companyId,
        }) => {
          setFieldsValue({ companyId })
          companyId && this.fetchBuildings({ payload: { pageNum: 1, pageSize: 0, company_id: companyId } });
        },
      })
    }
  }

  /**
  * 获取企业列表（弹窗）
  */
  fetchCompany = ({ payload }) => {
    const { dispatch } = this.props;
    dispatch({ type: 'sensor/fetchModelList', payload });
  };

  /**
 * 获取监测类型列表（字典）
 */
  fetchMonitoringTypeDict = actions => {
    const { dispatch } = this.props
    dispatch({
      type: 'sensor/fetchMonitoringTypeDict',
      ...actions,
    })
  }

  /**
    * 获取传感器类型列表（字典）
    */
  fetchAllUnsetModelList = actions => {
    const { dispatch } = this.props
    dispatch({
      type: 'sensor/fetchAllUnsetModelList',
      ...actions,
    })
  }

  /**
   * 获取监测参数列表（全部）
   */
  fetchParameterList = (modelId, strategySensorId = '-1') => {
    const { dispatch } = this.props
    const { model } = this.state
    const sensorModel = modelId || model.id
    dispatch({
      type: 'device/fetchAllParameters',
      payload: { sensorModel, strategyDefaultFlag: '0', strategySensorId },
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
   * 保存参数列表
   */
  saveParameters = actions => {
    const { dispatch } = this.props
    dispatch({
      type: 'device/saveParameters',
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
* 获取监测类型列表树
*/
  fetchMonitoringTypeTree = () => {
    const { dispatch } = this.props
    dispatch({ type: 'device/fetchMonitoringTypeTree' })
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
   * 提交
   */
  handleSubmit = () => {
    const {
      dispatch,
      match: { params: { id } },
      location: { query: { deviceId } },
      form: { validateFields },
    } = this.props
    const {
      editingIndex,
      paramWarnStrategyDtos, // 报警策略
      fileList, // 安装图片
      pointFixInfoList, // 平面图标志
    } = this.state
    if (!isNaN(editingIndex)) {
      message.warning('请先保存平面图信息')
      return
    }
    validateFields((err, values) => {
      if (err) return
      const payload = {
        ...values,
        paramWarnStrategyDtos, // 参数报警策略列表（自定义）
        installPhotoList: fileList, // 安装图片列表
        pointFixInfoList, // 平面图标注列表
      }
      // console.log('payload', payload);
      const tag = id ? '编辑' : '新增'
      const success = () => {
        message.success(`${tag}成功`)
        router.goBack()
      }
      const error = (res) => { message.error(res ? res.msg : `${tag}失败`) }
      // 如果编辑
      if (id) {
        // 如果新增
        dispatch({
          type: 'device/editSensor',
          payload: { ...payload, id },
          success,
          error,
        })
      } else {
        // 如果新增
        dispatch({
          type: 'device/addSensor',
          payload: { ...payload, dataExecuteEquipmentId: deviceId },
          success,
          error,
        })
      }
    })
  }

  /**
   * 数据类型改变
   */
  handleDataTypeChange = (type) => {
    const { form: { resetFields } } = this.props
    this.fetchAllUnsetModelList({ payload: { type } })
    resetFields(['dataCode'])
  }

  /**
   * 打开选择品牌型号弹窗
   */
  handleViewBrandModal = () => {
    this.setState({ brandModelModalVisible: true })
  }

  /**
   * 选择型号
   */
  onSelectModel = values => {
    const {
      form: { setFieldsValue },
    } = this.props
    setFieldsValue({ model: values.model.id })
    // 关闭弹窗 获取监测参数列表
    this.setState({ ...values, brandModelModalVisible: false }, () => {
      this.fetchParameterList()
    })
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
   * 保存配置的报警策略
   */
  handleConfirmParameter = (paramId, list) => {
    const {
      device: {
        parameters: { list: parameterList },
      },
    } = this.props
    this.setState(({ paramWarnStrategyDtos }) => {
      let newList = [...paramWarnStrategyDtos]
      // 寻找保存在state中的paramWarnStrategyDtos [ {paramId,paramWarnStrategyList[]} ]
      const index = paramWarnStrategyDtos.findIndex(item => item.paramId === paramId)
      const item = { paramId, paramWarnStrategyList: list }
      // 如果该参数下的报警策略刚添加或者修改过
      if (index < 0) {
        newList.push(item)
      } else if (list && list.length) {
        // 如果修改
        newList.splice(index, 1, item)
      } else {
        // 删除
        newList.splice(index, 1)
      }
      // 参数列表更新 参数--报警策略数量
      const customStrategyCount = list.length
      const paramIndex = parameterList.findIndex(item => item.id === paramId)
      parameterList.splice(paramIndex, 1, { ...parameterList[paramIndex], customStrategyCount })
      this.saveParameters({ payload: { list: parameterList } })
      return { paramWarnStrategyDtos: newList }
    })
  }

  handleUploadChange = ({ file, fileList }) => {
    if (file.status === 'uploading') {
      this.setState({ uploading: true, fileList })
    } else if (file.status === 'done') {
      if (file.response && file.response.code === 200) {
        const result = file.response.data.list[0]
        const list = fileList.map((item) => ({ ...item, url: result.webUrl, ...result }))
        this.setState({
          uploading: false,
          fileList: list,
        })
      } else {
        message.error('上传失败！');
        this.setState({
          fileList: fileList.filter(item => {
            return !item.response || item.response.code !== 200;
          }),
        });
      }
      this.setState({
        uploading: false,
      });
    } else if (file.status === 'removed') {
      // 删除
      this.setState({
        fileList: fileList.filter(item => {
          return item.status !== 'removed';
        }),
        uploading: false,
      });
    } else {
      message.error('上传失败')
      this.setState({ uploading: false })
    }
  }


  /**
   * 跳转到建筑物管理页面
   */
  jumpToBuildingManagement = () => {
    const win = window.open(`${window.publicPath}#/base-info/buildings-info/list`, '_blank');
    win.focus();
  }

  /**
   * 刷新建筑物楼层图下拉
   * @param {Boolean} 是否刷新建筑物下拉
   */
  handleRefreshBuilding = (weatherFetch = false) => {
    const {
      form: { setFieldsValue, getFieldValue },
    } = this.props
    const companyId = getFieldValue('companyId')
    // 清空选择建筑物和楼层
    setFieldsValue({ buildingId: undefined, floorId: undefined })
    // 获取建筑物下拉 清空楼层下拉
    weatherFetch && companyId && this.fetchBuildings({ payload: { pageNum: 1, pageSize: 0, company_id: companyId } });
    this.resetFloors({ payload: [] })
    // 改变 平面图标注--楼层平面定位信息
    this.changeFlatPicBuildingNum()
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
     * 渲染表单
     */
  renderForm = () => {
    const {
      dispatch,
      form,
      form: { getFieldDecorator, getFieldsValue },
      match: { params: { id } },
      device: {
        monitoringType, // 监测参数列表树
        sensorDetail: detail = {},
        flatGraphic,
        equipmentDetail = {}, // 设备详情
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
      model,
      brand,
      monitorType,
      fileList,
      uploading,
      paramWarnStrategyDtos,
      picModalVisible,
      isImgSelect,
      imgIdCurrent,
    } = this.state
    // 地址录入方式
    const { locationType, companyId } = getFieldsValue()
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
      fetchFloors: this.fetchFloors,
      setState: (newState) => { this.setState(newState) },
      dispatch,
      companyId,
      handleBuildingChange: this.handleBuildingChange,
      changeFlatPicBuildingNum: this.changeFlatPicBuildingNum,
    }
    return (
      <Card>
        <Form>
          <FormItem label="所属单位" {...formItemLayout}>
            {getFieldDecorator('companyId')(
              <Fragment>
                {(id ? detail.companyName : equipmentDetail.companyName) || '暂无绑定单位'}
              </Fragment>
            )}
          </FormItem>
          <FormItem label="传感器编号" {...formItemLayout}>
            {getFieldDecorator('code', {
              initialValue: id ? detail.code : undefined,
              rules: [{ required: true, message: '请输入传感器编号' }],
            })(
              <Input placeholder="请输入" {...itemStyles} />
            )}
          </FormItem>
          <FormItem label="型号" {...formItemLayout}>
            {getFieldDecorator('model', {
              initialValue: id ? detail.model : undefined,
              rules: [{ required: true, message: '请选择型号' }],
            })(
              <Fragment>
                <Input disabled value={model.name} placeholder="请选择" {...itemStyles} />
                <Button type="primary" onClick={this.handleViewBrandModal}>选择品牌型号</Button>
              </Fragment>
            )}
          </FormItem>
          <FormItem label="品牌" {...formItemLayout}>
            <Input value={brand.name} disabled placeholder="请先选择型号" {...itemStyles} />
          </FormItem>
          <FormItem label="监测类型" {...formItemLayout}>
            <TreeSelect
              disabled
              value={monitorType}
              placeholder="请先选择型号"
              dropdownStyle={{ maxHeight: 600, overflow: 'auto' }}
              allowClear
              {...itemStyles}
            >
              {renderTreeNodes(monitoringType)}
            </TreeSelect>
          </FormItem>
          {model && model.id && (
            <FormItem label="监测参数" {...formItemLayout}>
              <Fragment>
                <MonitoringParameterTable
                  modelId={model.id}
                  onConfirm={this.handleConfirmParameter}
                  sensorId={id}
                  paramWarnStrategyDtos={paramWarnStrategyDtos}
                />
              </Fragment>
            </FormItem>
          )}
          <FormItem label="传感器Token" {...formItemLayout}>
            {getFieldDecorator('token', {
              initialValue: id ? detail.token : undefined,
              rules: [{ required: true, message: '请输入传感器Token' }],
            })(
              <Input placeholder="请输入" {...itemStyles} />
            )}
          </FormItem>
          <FormItem label="可用性" {...formItemLayout}>
            {getFieldDecorator('useStatus', {
              initialValue: id ? detail.useStatus : 1,
            })(
              <Radio.Group>
                <Radio value={1}>启用</Radio>
                <Radio value={2}>禁用</Radio>
              </Radio.Group>
            )}
          </FormItem>
          {/*  connectGateway 1-是 0 否 集成数据采集--是，则传感器中 入库日期开始不显示 */}
          {companyId && +equipmentDetail.connectGateway === 0 && (
            <Fragment>
              <FormItem label="入库时间" {...formItemLayout}>
                {getFieldDecorator('storageDate', {
                  initialValue: id && detail.storageDate ? moment(detail.storageDate) : undefined,
                })(
                  <DatePicker />
                )}
              </FormItem>
              <FormItem label="安装人" {...formItemLayout}>
                {getFieldDecorator('installer', {
                  initialValue: id ? detail.installer : undefined,
                })(
                  <Input placeholder="请输入" {...itemStyles} />
                )}
              </FormItem>
              <FormItem label="安装电话" {...formItemLayout}>
                {getFieldDecorator('installerPhone', {
                  initialValue: id ? detail.installerPhone : undefined,
                  rules: [{ pattern: phoneReg, message: '电话格式不正确' }],
                })(
                  <Input placeholder="请输入" {...itemStyles} />
                )}
              </FormItem>
              <FormItem label="安装日期" {...formItemLayout}>
                {getFieldDecorator('installDate', {
                  initialValue: id && detail.installDate ? moment(detail.installDate) : undefined,
                })(
                  <DatePicker />
                )}
              </FormItem>
              <FormItem label="施工照片" {...formItemLayout}>
                <Upload
                  name="files"
                  action={UPLOAD_ACTION}
                  data={{ folder: FOLDER }}
                  listType="picture"
                  headers={{ 'JA-Token': getToken() }}
                  onChange={this.handleUploadChange}
                  fileList={fileList}
                  className={styles.uploadList}
                >
                  <Button>
                    <Icon type={uploading ? 'loading' : "upload"} /> 上传
                  </Button>
                </Upload>
              </FormItem>
              {+equipmentDetail.connectGateway === 0 && (
                <FormItem label="监测点名称" {...formItemLayout}>
                  {getFieldDecorator('name', {
                    initialValue: id ? detail.name : undefined,
                    rules: [{ required: true, message: '请输入监测点名称' }],
                  })(
                    <Input placeholder="请输入" {...itemStyles} />
                  )}
                </FormItem>
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
                    <Col span={5} style={{ marginRight: '10px' }}>
                      {getFieldDecorator('buildingId', {
                      })(
                        <Select placeholder="建筑物" style={{ width: '100%' }} onChange={this.handleBuildingChange} allowClear>
                          {buildings.map((item, i) => (
                            <Select.Option key={i} value={item.id}>{item.buildingName}</Select.Option>
                          ))}
                        </Select>
                      )}
                    </Col>
                    <Col span={5} style={{ marginRight: '10px' }}>
                      {getFieldDecorator('floorId', {
                      })(
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
            </Fragment>
          )}
        </Form>
        <Row style={{ textAlign: 'center', marginTop: '24px' }}>
          <Button onClick={() => { router.push('/device-management/new-sensor/list') }}>取消</Button>
          <Button type="primary" className={styles.ml10} onClick={this.handleSubmit}>确定</Button>
        </Row>
      </Card>
    )
  }

  render() {
    const {
      match: { params: { id = null } = {} },
      location: { query: { deviceId } }, // 新增绑定传感器时传递的设备id
      device: {
        equipmentDetail = {}, // 设备详情
      },
    } = this.props
    const { brandModelModalVisible } = this.state
    const title = id ? '编辑传感器' : '新增传感器'
    const breadcrumbList = [
      { title: '首页', name: '首页', href: '/' },
      { title: '设备管理', name: '设备管理' },
      { title: '传感器管理', name: '传感器管理', href: '/device-management/new-sensor/list' },
      { title, name: title },
    ]
    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
      >
        {this.renderForm()}
        {/* 选择品牌型号弹窗 */}
        <BrandModelModal
          visible={brandModelModalVisible}
          onSelectModel={this.onSelectModel}
          onCancel={() => { this.setState({ brandModelModalVisible: false }) }}
          equipmentType={deviceId ? equipmentDetail.equipmentType : undefined}
        />
      </PageHeaderLayout>
    )
  }
}
