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
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import router from 'umi/router';
import { AuthButton } from '@/utils/customAuth';
import codesMap from '@/utils/codes';
import moment from 'moment';
import { phoneReg } from '@/utils/validate';
import { getToken } from '@/utils/authority';
// 片面图标注
import FlatPic from '@/pages/DeviceManagement/Components/FlatPic';
// 选择企业弹窗
import CompanyModal from '@/pages/BaseInfo/Company/CompanyModal';
// 地图定位
import MapMarkerSelect from '@/components/MapMarkerSelect';
import styles from '@/pages/DeviceManagement/NewSensor/AddSensor.less';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};
const itemStyles = { style: { width: 'calc(70%)', marginRight: '10px' } };
const UPLOAD_ACTION = '/acloud_new/v2/uploadFile';
const FOLDER = 'monitor';

@Form.create()
@connect(
  ({ sensor, device, riskPointManage, buildingsInfo, personnelPosition, user, loading }) => ({
    sensor,
    device,
    personnelPosition,
    riskPointManage,
    buildingsInfo,
    user,
    companyLoading: loading.effects['sensor/fetchModelList'],
  })
)
export default class AddMonitoringDevice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pointFixInfoList: [], // 平面图标志
      editingIndex: undefined, // 当前编辑的平面图标志下标
      imgIdCurrent: '',
      isImgSelect: true,
      selectedCompany: {}, // 当前选择的企业
      companyModalVisible: false, // 企业弹窗是否可见
      picModalVisible: false, // 平面图标注定位弹窗可见
      uploading: false, // 安装图片上传状态
      fileList: [], // 安装图片
    };
  }

  componentDidMount () {
    const {
      dispatch,
      match: {
        params: { id },
      },
      form: { setFieldsValue },
    } = this.props;
    // 获取监测设备类型
    this.fetchMonitoringDeviceTypes();
    if (id) {
      // 如果编辑
      dispatch({
        type: 'device/fetchMonitoringDeviceDetail',
        payload: { id },
        callback: ({
          companyId,
          companyName,
          pointFixInfoList,
          brand,
          brandName,
          model,
          modelName,
          buildingId,
          floorId,
          installPhotoList: fileList,
          locationType,
          area,
          location,
        }) => {
          setFieldsValue({ companyId });
          setFieldsValue({ locationType });
          this.setState(
            {
              selectedCompany: { id: companyId, name: companyName },
              pointFixInfoList: pointFixInfoList || [],
              fileList:
                fileList && fileList.length
                  ? fileList.map(item => ({
                    ...item,
                    uid: item.id,
                    url: item.webUrl,
                    name: item.fileName,
                  }))
                  : [],
            },
            () => {
              setFieldsValue({ location, buildingId });
              if (locationType === 1) {
                setFieldsValue({ area, location });
              } else setFieldsValue({ floorId });
              if (pointFixInfoList && pointFixInfoList.length) {
                let { xnum, ynum, znum, groupId, areaId } = pointFixInfoList[0];
                const coord = { x: +xnum, y: +ynum, z: +znum };
                groupId = +groupId;
                setFieldsValue({ mapLocation: { groupId, coord, areaId } });
              }
            }
          );
          companyId &&
            this.fetchBuildings({ payload: { pageNum: 1, pageSize: 0, company_id: companyId } });
          buildingId &&
            this.fetchFloors({ payload: { pageNum: 1, pageSize: 0, building_id: buildingId } });
        },
      });
    }
  }

  /**
   * 获取企业列表（弹窗）
   */
  fetchCompany = ({ payload }) => {
    const { dispatch } = this.props;
    dispatch({ type: 'sensor/fetchModelList', payload });
  };

  // 获取设备类型--监测设备类型列表
  fetchMonitoringDeviceTypes = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'device/fetchMonitoringDeviceTypes' });
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

  /**
   * 清空楼层列表
   */
  resetFloors = actions => {
    const { dispatch } = this.props;
    dispatch({
      type: 'personnelPosition/saveFloors',
      ...actions,
    });
  };

  /**
   * 选择企业
   */
  handleSelectCompany = selectedCompany => {
    const {
      form: { setFieldsValue },
    } = this.props;
    const companyId = selectedCompany.id;
    this.setState({ selectedCompany, companyModalVisible: false });
    setFieldsValue({ companyId });
    this.fetchBuildings({ payload: { pageNum: 1, pageSize: 0, company_id: companyId } });
    setTimeout(() => {
      setFieldsValue({ locationType: 0 });
    }, 0);
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

  // 所属建筑物改变
  handleBuildingChange = value => {
    const {
      form: { setFieldsValue },
    } = this.props;
    setFieldsValue({ floorId: undefined });
    // 改变 平面图标注--楼层平面定位信息
    this.changeFlatPicBuildingNum();
    if (!value) {
      // 清空楼层下拉
      this.resetFloors({ payload: [] });
      return;
    }
    // 获取楼层
    this.fetchFloors({ payload: { pageNum: 1, pageSize: 0, building_id: value } });
  };

  // 所属楼层改变
  handleFloorIdChange = floorId => {
    // 改变 平面图标注--楼层平面定位信息
    this.changeFlatPicBuildingNum();
  };

  /**
   * 改变 平面图标注--楼层平面定位信息
   */
  changeFlatPicBuildingNum = (xnum = undefined, ynum = undefined) => {
    const { pointFixInfoList, editingIndex } = this.state;
    // 从保存的平面图标注列表中找类型为 楼层平面图的，如果找到 清空定位信息,并且该条平面图标注需要重新编辑
    const i = pointFixInfoList.findIndex(item => +item.imgType === 2);
    // 如果未找到
    if (i < 0) return;
    // 当前正在编辑平面图标注不是楼层平面图类型
    if (+editingIndex !== i) {
      message.warning('请重新编辑平面图标注中楼层平面图');
      this.setState({ editingIndex: i });
    }
    const item = pointFixInfoList[i];
    this.handleChangeCoordinate(item, xnum, i, 'xnum');
    this.handleChangeCoordinate(item, ynum, i, 'ynum');
  };

  /**
   * 新平面图标志--坐标轴改变
   */
  handleChangeCoordinate = (item, value, i, key) => {
    if (value && isNaN(value)) {
      message.warning('坐标轴为数字');
      return;
    }
    item[key] = value;
    this.setState(({ pointFixInfoList }) => {
      let temp = [...pointFixInfoList];
      temp.splice(i, 1, item);
      return { pointFixInfoList: temp };
    });
  };

  /**
   * 添加平面图标志
   */
  handleAddFlatGraphic = () => {
    this.setState(({ pointFixInfoList }) => ({
      editingIndex: pointFixInfoList.length,
      pointFixInfoList: [
        ...pointFixInfoList,
        { imgType: undefined, ynum: undefined, xnum: undefined, fixImgId: undefined },
      ],
    }));
  };

  /**
   * 刷新建筑物楼层图下拉
   * @param {Boolean} 是否刷新建筑物下拉
   */
  handleRefreshBuilding = (weatherFetch = false) => {
    const {
      form: { setFieldsValue, getFieldValue },
    } = this.props;
    const companyId = getFieldValue('companyId');
    // 清空选择建筑物和楼层
    setFieldsValue({ buildingId: undefined, floorId: undefined });
    // 获取建筑物下拉 清空楼层下拉
    weatherFetch &&
      companyId &&
      this.fetchBuildings({ payload: { pageNum: 1, pageSize: 0, company_id: companyId } });
    this.resetFloors({ payload: [] });
    // 改变 平面图标注--楼层平面定位信息
    this.changeFlatPicBuildingNum();
  };

  /**
   * 跳转到建筑物管理页面
   */
  jumpToBuildingManagement = () => {
    const win = window.open(
      `${window.publicPath}#/base-info/buildings-info/list`,
      '_blank'
    );
    win.focus();
  };

  handleUploadChange = ({ file, fileList }) => {
    if (file.status === 'uploading') {
      this.setState({ uploading: true, fileList });
    } else if (file.status === 'done') {
      if (file.response && file.response.code === 200) {
        const result = file.response.data.list[0];
        const list = fileList.map((item, index) => {
          if (index === fileList.length - 1) {
            return {
              ...result,
              uid: item.uid,
              url: result.webUrl,
              name: result.fileName,
            };
          } else return item;
        });
        this.setState({
          uploading: false,
          fileList: list,
        });
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
      message.error('上传失败');
      this.setState({ uploading: false });
    }
  };

  /**
   * 提交
   */
  handleSubmit = () => {
    const {
      dispatch,
      match: {
        params: { id },
      },
      form: { validateFields },
    } = this.props;
    const {
      editingIndex,
      fileList, // 安装图片
      // pointFixInfoList, // 平面图标志
    } = this.state;
    if (!isNaN(editingIndex)) {
      message.warning('请先保存平面图信息');
      return;
    }
    validateFields((err, { mapLocation, ...resValues }) => {
      if (err) return;
      let payload = {
        ...resValues,
        installPhotoList: fileList, // 安装图片列表
        pointFixInfoList: [], // 平面图标注列表
      };
      if (mapLocation && mapLocation.groupId && mapLocation.coord) {
        const { coord, ...resMap } = mapLocation;
        payload.pointFixInfoList = [{ imgType: 5, xnum: coord.x, ynum: coord.y, znum: coord.z, ...resMap }];
      }
      // console.log('payload', payload);
      const tag = id ? '编辑' : '新增';
      const success = () => {
        message.success(`${tag}成功`);
        router.push('/device-management/monitoring-device/list');
      };
      const error = res => {
        message.error(res ? res.msg : `${tag}失败`);
      };
      // 如果编辑
      if (id) {
        // 如果新增
        dispatch({
          type: 'device/editMonitoringDevice',
          payload: { ...payload, id },
          success,
          error,
        });
      } else {
        // 如果新增
        dispatch({
          type: 'device/addMonitoringDevice',
          payload: { ...payload },
          success,
          error,
        });
      }
    });
  };

  /**
   * 渲染表单
   */
  renderForm = () => {
    const {
      dispatch,
      form,
      form: { getFieldDecorator, getFieldsValue },
      match: {
        params: { id },
      },
      device: {
        monitoringDeviceTypes, // 监测设备类型
        monitoringDeviceDetail: detail, // 监测设备详情
        flatGraphic,
      },
      personnelPosition: {
        map: {
          buildings = [], // 建筑物列表
          floors = [], // 楼层列表
        },
      },
      riskPointManage: {
        imgData: { list: imgList = [] },
      },
    } = this.props;
    const {
      editingIndex,
      // pointFixInfoList,
      isImgSelect,
      imgIdCurrent,
      selectedCompany,
      picModalVisible,
      uploading,
      fileList,
    } = this.state;
    const { locationType, companyId } = getFieldsValue();
    // const FlatPicProps = {
    //   visible: picModalVisible,
    //   onCancel: () => {
    //     this.setState({ picModalVisible: false });
    //   },
    //   form,
    //   buildings, // 建筑物列表
    //   floors, // 楼层列表
    //   imgList, // 定位图列表
    //   pointFixInfoList, // 平面图标注列表
    //   editingIndex,
    //   isImgSelect,
    //   imgIdCurrent,
    //   flatGraphic,
    //   fetchFloors: this.fetchFloors,
    //   setState: newState => {
    //     this.setState(newState);
    //   },
    //   dispatch,
    //   companyId,
    //   handleBuildingChange: this.handleBuildingChange,
    //   handleFloorIdChange: this.handleFloorIdChange,
    // };
    let { xnum, ynum, znum, groupId } = detail.pointFixInfoList && detail.pointFixInfoList.length ? detail.pointFixInfoList[0] : {};
    const coord = { x: +xnum, y: +ynum, z: +znum };
    groupId = +groupId;
    const fengMapProps = {
      id: 'mapLocation',
      form,
      companyId: selectedCompany.id,
      initialData: {
        groupId,
        coord,
      },
    };

    return (
      <Fragment>
        <Card title="基本信息">
          <Form>
            <FormItem label="所属单位" {...formItemLayout}>
              {getFieldDecorator('companyId', {
                rules: [{ required: true, message: '请选择单位' }],
              })(
                <Fragment>
                  <Input
                    {...itemStyles}
                    disabled
                    value={selectedCompany.name}
                    placeholder="请选择"
                  />
                  {!id && (
                    <Button type="primary" onClick={this.handleViewCompanyModal}>
                      选择单位
                    </Button>
                  )}
                </Fragment>
              )}
            </FormItem>
            <FormItem label="设备类型" {...formItemLayout}>
              {getFieldDecorator('equipmentType', {
                initialValue: id ? detail.equipmentType : undefined,
                rules: [{ required: true, message: '请选择设备类型' }],
              })(
                <Select placeholder="请选择" {...itemStyles} disabled={!!id}>
                  {monitoringDeviceTypes.map(({ id, name }) => (
                    <Select.Option key={id} value={id}>
                      {name}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </FormItem>
            <FormItem label="设备名称" {...formItemLayout}>
              {getFieldDecorator('name', {
                initialValue: id ? detail.name : undefined,
                rules: [{ required: true, message: '请输入设备名称' }],
              })(<Input placeholder="请输入" {...itemStyles} />)}
            </FormItem>
            <FormItem label="设备编号" {...formItemLayout}>
              {getFieldDecorator('code', {
                initialValue: id ? detail.code : undefined,
                rules: [{ required: true, message: '请输入设备编号' }],
              })(<Input placeholder="请输入" {...itemStyles} />)}
            </FormItem>
          </Form>
        </Card>
        <Card title="施工信息" className={styles.mt24}>
          <Form>
            <FormItem label="安装人" {...formItemLayout}>
              {getFieldDecorator('installer', {
                initialValue: id ? detail.installer : undefined,
              })(<Input placeholder="请输入" {...itemStyles} />)}
            </FormItem>
            <FormItem label="安装电话" {...formItemLayout}>
              {getFieldDecorator('installerPhone', {
                initialValue: id ? detail.installerPhone : undefined,
                rules: [{ pattern: phoneReg, message: '电话格式不正确' }],
              })(<Input placeholder="请输入" {...itemStyles} />)}
            </FormItem>
            <FormItem label="安装日期" {...formItemLayout}>
              {getFieldDecorator('installDate', {
                initialValue: id && detail.installDate ? moment(detail.installDate) : undefined,
              })(<DatePicker />)}
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
                  <Icon type={uploading ? 'loading' : 'upload'} /> 上传
                </Button>
              </Upload>
            </FormItem>
          </Form>
        </Card>
        {companyId && (
          <Fragment>
            <Card title="区域-位置" className={styles.mt24}>
              <Form>
                <FormItem label="区域位置录入方式" {...formItemLayout}>
                  {getFieldDecorator('locationType')(
                    <Radio.Group onChange={e => this.handleRefreshBuilding()}>
                      <Radio value={0}>选择建筑物-楼层</Radio>
                      <Radio value={1}>手填</Radio>
                    </Radio.Group>
                  )}
                </FormItem>
                {(!locationType || locationType === 0) && (
                  <Fragment>
                    <FormItem label="所属建筑物楼层" {...formItemLayout}>
                      {getFieldDecorator('buildingFloor')(
                        <Fragment>
                          <Col span={5} className={styles.mr10}>
                            {getFieldDecorator('buildingId', {})(
                              <Select
                                placeholder="建筑物"
                                style={{ width: '100%' }}
                                onChange={this.handleBuildingChange}
                                allowClear
                              >
                                {buildings.map((item, i) => (
                                  <Select.Option key={i} value={item.id}>
                                    {item.buildingName}
                                  </Select.Option>
                                ))}
                              </Select>
                            )}
                          </Col>
                          <Col span={5} className={styles.mr10}>
                            {getFieldDecorator('floorId', {})(
                              <Select
                                placeholder="楼层"
                                style={{ width: '100%' }}
                                onChange={this.handleFloorIdChange}
                                allowClear
                              >
                                {floors.map((item, i) => (
                                  <Select.Option key={i} value={item.id}>
                                    {item.floorName}
                                  </Select.Option>
                                ))}
                              </Select>
                            )}
                          </Col>
                          <Tooltip title="刷新建筑物楼层">
                            <Button
                              onClick={() => this.handleRefreshBuilding(true)}
                              className={styles.mr10}
                            >
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
                      {getFieldDecorator('location')(
                        <Input placeholder="请输入" {...itemStyles} />
                      )}
                    </FormItem>
                  </Fragment>
                )}
                {locationType === 1 && (
                  <Fragment>
                    <FormItem label="所在区域" {...formItemLayout}>
                      {getFieldDecorator('area', {})(
                        <Input placeholder="请输入" {...itemStyles} />
                      )}
                    </FormItem>
                    <FormItem label="位置详情" {...formItemLayout}>
                      {getFieldDecorator('location', {})(
                        <Input placeholder="请输入" {...itemStyles} />
                      )}
                    </FormItem>
                  </Fragment>
                )}
              </Form>
            </Card>

            <Card className={styles.mt24}>
              <Form>
                <FormItem label="平面图标注" {...formItemLayout}>
                  {/* <Button
                    type="primary"
                    style={{ padding: '0 12px' }}
                    onClick={this.handleAddFlatGraphic}
                    disabled={!isNaN(editingIndex) || pointFixInfoList.length >= 4}
                  >
                    新增
                  </Button>
                  <FlatPic {...FlatPicProps} /> */}
                  <MapMarkerSelect {...fengMapProps} />
                </FormItem>
              </Form>
            </Card>
          </Fragment>
        )}
        <Row style={{ textAlign: 'center', marginTop: '24px' }}>
          <Button
            className={styles.mr10}
            onClick={() => {
              router.goBack();
            }}
          >
            取消
          </Button>
          <Button type="primary" onClick={this.handleSubmit}>
            确定
          </Button>
        </Row>
      </Fragment>
    );
  };

  render () {
    const {
      companyLoading,
      sensor: { companyModal },
      match: {
        params: { id },
      },
    } = this.props;
    const { companyModalVisible } = this.state;
    const title = id ? '编辑监测设备' : '新增监测设备';
    const breadcrumbList = [
      { title: '首页', name: '首页', href: '/' },
      { title: '物联设备管理', name: '物联设备管理' },
      {
        title: '监测设备管理',
        name: '监测设备管理',
        href: '/device-management/monitoring-device/list',
      },
      { title, name: title },
    ];
    return (
      <PageHeaderLayout title={title} breadcrumbList={breadcrumbList}>
        {this.renderForm()}
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
      </PageHeaderLayout>
    );
  }
}
