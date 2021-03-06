import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import router from 'umi/router';
import { Form, Icon as LegacyIcon } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Input, Button, Card, Switch, Popover, message, Select, Radio } from 'antd';
import FooterToolbar from '@/components/FooterToolbar';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
// 地图定位
import MapMarkerSelect from '@/components/MapMarkerSelect';

// import { numReg } from '@/utils/validate';
// import Coordinate from '@/components/Coordinate';
import CompanyModal from '../../BaseInfo/Company/CompanyModal';
import codes from '@/utils/codes';
import { hasAuthority } from '@/utils/customAuth';
// 选择网关设备弹窗
import GateWayModal from '@/pages/DeviceManagement/Components/GateWayModal';
import styles from './VideoMonitorEdit.less';
import MarkerImg from '@/pages/BigPlatform/ChemicalV2/imgs/video.png';
import OtherMarkerImg from '@/pages/BigPlatform/ChemicalV2/imgs/marker-video-gray.png';
import MarkerGrayImg from '@/pages/BigPlatform/ChemicalV2/imgs/video-gray.png';
import MarkerActiveImg from '@/pages/BigPlatform/ChemicalV2/imgs/video-active.png';

const FormItem = Form.Item;

const chineseRe = new RegExp('[\\u4E00-\\u9FFF]+', 'g');
// 编辑页面标题
const editTitle = '编辑视频设备信息';
// 添加页面标题
const addTitle = '新增视频设备信息';

// 表单标签
const fieldLabels = {
  companyName: '单位名称',
  equipmentID: '设备ID',
  cameraID: '摄像头ID',
  videoArea: '视频名称',
  buildingFloor: '所属建筑楼层',
  // videoStatus: '视频状态',
  videoURL: '视频URL',
  picAddress: '图片地址',
  inspectSentries: '是否用于查岗',
  status: '监控摄像头状态',
  fourPictureX: '四色图坐标 -X：',
  fourPictureY: '四色图坐标 -Y：',
  firePictureX: '消防平面图坐标 -X',
  firePictureY: '消防平面图坐标 -Y',
  inheritNvr: '是否集成NVR',
  plugFlowEquipment: '推流主机编号',
  nvr: 'NVR编号',
  connectType: '连接方式',
  mapLocation: '地图定位',
};

//  默认分页参数
const defaultPagination = {
  pageNum: 1,
  pageSize: 10,
};

@connect(
  ({ videoMonitor, user, company, safety, personnelPosition, device, chemical, loading }) => ({
    videoMonitor,
    user,
    company,
    safety,
    personnelPosition,
    device,
    chemical,
    loading: loading.models.videoMonitor,
    gatewayLoading: loading.effects['device/fetchGatewayEquipmentForPage'],
  }),
  dispatch => ({
    // 获取企业
    fetchModelList(action) {
      dispatch({
        type: 'videoMonitor/fetchModelList',
        ...action,
      });
    },
    dispatch,
  })
)
@Form.create()
export default class VideoMonitorEdit extends PureComponent {
  state = {
    companyModal: {
      visible: false,
      loading: false,
    },
    companyId: undefined,
    isInspection: false,
    coordinate: {
      visible: false,
      fireVisible: false,
    },
    company: {},
    gatewayEquipment: {}, // 选择的网关设备
    gateWayModalVisible: false, // 选择网关设备弹窗可见
  };

  // 挂载后
  componentDidMount() {
    const {
      dispatch,
      match: {
        params: { id },
      },
      location: { query },
      form: { setFieldsValue },
      user: { isCompany, currentUser },
    } = this.props;
    const companyId = query.companyId || currentUser.companyId;
    if (id) {
      // 根据id获取详情
      dispatch({
        type: 'videoMonitor/fetchVideoDetail',
        payload: { id },
        callback: ({
          buildingId,
          floorId,
          companyId,
          companyName,
          plugFlowEquipmentCode,
          plugFlowEquipment,
          inheritNvr, // 是否集成NVR
          nvr, // NVR编号
          pointFixInfoList,
        } = {}) => {
          setFieldsValue({ buildingFloor: { buildingId, floorId }, inheritNvr });
          this.setState(
            {
              company: { id: companyId, name: companyName },
              gatewayEquipment: { id: plugFlowEquipment, code: plugFlowEquipmentCode },
            },
            () => {
              if (pointFixInfoList && pointFixInfoList.length) {
                let { xnum, ynum, znum, groupId, areaId, isShow } = pointFixInfoList[0];
                const coord = { x: +xnum, y: +ynum, z: +znum };
                groupId = +groupId;
                setFieldsValue({ isShow: isShow || '1', mapLocation: { groupId, coord, areaId } });
              }
            }
          );
          this.fetchBuildings({ payload: { pageNum: 1, pageSize: 0, company_id: companyId } });
          buildingId &&
            this.fetchFloors({ payload: { pageNum: 1, pageSize: 0, building_id: buildingId } });
          setTimeout(() => {
            +inheritNvr === 1 && setFieldsValue({ plugFlowEquipment });
            +inheritNvr === 0 && setFieldsValue({ nvr });
          }, 0);
        },
      });
    } else {
      // 清空详情
      dispatch({ type: 'videoMonitor/clearDetail' });
      this.fetchBuildings({ payload: { pageNum: 1, pageSize: 0, company_id: companyId } });
    }
    // 根据id获取四色图和消防平面图
    if (id || query.companyId || isCompany) {
      dispatch({
        type: 'safety/fetch',
        payload: { companyId },
      });
      dispatch({
        type: 'company/fetchCompany',
        payload: { id: companyId },
      });
      companyId &&
        this.setState({ company: { id: companyId, name: query.name } }, () => {
          setFieldsValue({ isShow: '1' });
        });
      companyId && this.fetchMarkers(companyId);
    }
    this.fetchConnectTypeDict();
    this.fetchEquipmentsForAll();
  }

  /**
   * 获取NVR设备列表
   */
  fetchEquipmentsForAll = () => {
    const {
      dispatch,
      location: { query },
    } = this.props;
    const { companyId } = this.state;
    // 企业内新增、编辑视频，企业都无法改变
    dispatch({
      type: 'device/fetchEquipmentsForAll',
      payload: { companyId: companyId || query.companyId, equipmentType: 110 },
    });
  };

  // 获取视频位置
  fetchMarkers = companyId => {
    const { dispatch } = this.props;
    dispatch({
      type: 'chemical/fetchVideoList',
      payload: { companyId, pageNum: 1, pageSize: 0 },
    });
  };

  /* 去除左右两边空白 */
  handleTrim = e => e.target.value.trim();

  // 返回到视频企业列表页面
  goBack = () => {
    const { dispatch, match: { params: { id } } } = this.props;
    if (id)
      window.close();
    else
      dispatch(routerRedux.push(`/device-management/video-monitor/list`));
  };

  // 返回到视频设备列表页面
  goequipment = (editCompanyId, name) => {
    const { dispatch, match: { params: { id } } } = this.props;
    if (id)
      window.close();
    else
      dispatch(
        routerRedux.push(
          `/device-management/video-monitor/video-equipment/${editCompanyId}?name=${name}`
        )
      );
  };

  /**
   * 获取--连接方式字典
   */
  fetchConnectTypeDict = actions => {
    const { dispatch } = this.props;
    dispatch({ type: 'device/fetchConnectTypeDict', ...actions });
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

  /* 点击提交按钮验证表单信息 */
  handleClickValidate = () => {
    const {
      form: { validateFieldsAndScroll },
      match: {
        params: { id },
      },
      location: {
        query: { companyId: companyIdParams, name: nameParams },
      },
      videoMonitor: {
        detail: {
          data: { companyId: detailCompanyId, companyName },
        },
      },
      user: {
        currentUser: { unitId },
      },
      dispatch,
    } = this.props;

    validateFieldsAndScroll((error, values) => {
      if (!error) {
        this.setState({
          submitting: true,
        });

        const {
          deviceId,
          keyId,
          name,
          status,
          rtspAddress,
          photoAddress,
          // xnum,
          // ynum,
          // xfire,
          // yfire,
          isInspection,
          buildingFloor: { buildingId, floorId } = {},
          inheritNvr,
          plugFlowEquipment,
          nvr,
          connectType,
          mapLocation,
          isShow,
        } = values;
        const { companyId } = this.state;

        let payload = {
          id,
          deviceId,
          videoId: id,
          keyId,
          name,
          status: +status,
          companyId: companyIdParams || companyId || unitId,
          rtspAddress,
          photoAddress,
          // xnum,
          // ynum,
          // xfire,
          // yfire,
          fixFireId: this.fixFireId,
          fixImgId: this.fixImgId,
          isInspection: +isInspection,
          buildingId,
          floorId,
          inheritNvr,
          plugFlowEquipment,
          nvr,
          connectType,
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

        const editCompanyId = companyIdParams || detailCompanyId;
        const editCompanyName = companyName || nameParams;

        const success = () => {
          const msg = id ? '编辑成功' : '新增成功';
          message.success(
            msg,
            1,
            () => setTimeout(id || companyIdParams ? () => this.goequipment(editCompanyId, editCompanyName) : this.goBack, 1000)
          );
        };

        const error = () => {
          const msg = id ? '编辑失败' : '新增失败';
          message.error(msg, 1);
          this.setState({
            submitting: false,
          });
        };
        // 如果id存在的话，为编辑
        if (id) {
          dispatch({
            type: 'videoMonitor/updateVideoDevice',
            payload: {
              ...payload,
              companyId: detailCompanyId,
            },
            success,
            error,
          });
        }
        // 不存在id,则为新增
        else {
          dispatch({
            type: 'videoMonitor/fetchVideoDevice',
            payload,
            success,
            error,
          });
        }
      }
    });
  };

  /* 显示选择企业模态框 */
  handleShowCompanyModal = () => {
    const { fetchModelList } = this.props;
    const { companyModal } = this.state;
    // 显示模态框
    this.setState({
      companyModal: {
        ...companyModal,
        visible: true,
      },
    });
    // 初始化表格数据
    fetchModelList({
      payload: {
        ...defaultPagination,
      },
    });
  };

  /* 隐藏企业模态框 */
  handleHideCompanyModal = () => {
    const { companyModal } = this.state;
    this.setState({
      companyModal: {
        ...companyModal,
        visible: false,
      },
    });
  };

  /* 企业选择按钮点击事件 */
  handleSelectCompany = value => {
    const {
      form: { setFieldsValue, getFieldValue },
      dispatch,
    } = this.props;
    // 是否集成NVR 0 否 则显示NVR编号选择
    const inheritNvr = getFieldValue('inheritNvr');
    setFieldsValue({
      companyId: value.name,
      plugFlowEquipment: undefined,
    });
    this.setState(
      {
        companyId: value.id,
        company: value,
        gatewayEquipment: {},
      },
      () => {
        this.fetchEquipmentsForAll();
        if (+inheritNvr === 0) setFieldsValue({ nvr: undefined });
      }
    );
    dispatch({
      type: 'safety/fetch',
      payload: {
        companyId: value.id,
      },
    });
    dispatch({
      type: 'company/fetchCompany',
      payload: {
        id: value.id,
      },
    });
    this.fetchBuildings({ payload: { pageNum: 1, pageSize: 0, company_id: value.id } });
    this.fetchMarkers(value.id);
    setFieldsValue({ xnum: undefined, ynum: undefined, buildingFloor: {}, isShow: '1' });
    this.handleHideCompanyModal();
  };

  // 渲染选择企业模态框
  renderCompanyModal() {
    const {
      companyModal: { loading, visible },
    } = this.state;
    const {
      videoMonitor: { modal },
      fetchModelList,
    } = this.props;
    const modalProps = {
      // 模态框是否显示
      visible,
      // 模态框点击关闭按钮回调
      onClose: this.handleHideCompanyModal,
      // 完全关闭后回调
      afterClose: () => {
        this.CompanyIdInput.blur();
      },
      modal,
      fetch: fetchModelList,
      // 选择回调
      onSelect: this.handleSelectCompany,
      // 表格是否正在加载
      loading,
    };

    return <CompanyModal {...modalProps} />;
  }

  // 显示定位模态框
  showModalCoordinate = () => {
    const {
      safety: {
        detail: { safetyFourPicture },
      },
    } = this.props;
    const fourColorImgs = safetyFourPicture ? JSON.parse(safetyFourPicture) : [];
    if (fourColorImgs.length === 0) {
      message.error('该单位暂无四色图！');
      return;
    }
    this.setState({
      coordinate: {
        visible: true,
      },
    });
  };
  // 定位模态框确定按钮点击事件
  handleOk = (value, fourColorImg) => {
    const {
      form: { setFieldsValue },
    } = this.props;
    setFieldsValue({
      xnum: value.x.toFixed(3),
      ynum: value.y.toFixed(3),
    });
    this.fixImgId = fourColorImg.id;
    this.setState({
      coordinate: {
        visible: false,
      },
    });
  };

  // 显示消防定位模态框
  showFireCoordinate = () => {
    const {
      company: {
        detail: {
          data: { fireIchnographyUrl },
        },
      },
    } = this.props;
    const fireImgs = fireIchnographyUrl ? JSON.parse(fireIchnographyUrl) : [];
    if (fireImgs.length === 0) {
      message.error('该单位暂无消防平面图！');
      return;
    }
    this.setState({
      coordinate: {
        fireVisible: true,
      },
    });
  };

  // 消防定位模态框确定按钮点击事件
  handleFireOk = (value, fireImgs) => {
    const {
      form: { setFieldsValue },
    } = this.props;
    setFieldsValue({
      xfire: value.x.toFixed(3),
      yfire: value.y.toFixed(3),
    });
    this.fixFireId = fireImgs.id;
    this.setState({
      coordinate: {
        visible: false,
      },
    });
  };

  // 验证设备Id和摄像头Id
  // validatorID = (rule, value, callback) => {
  //   if (value) {
  //     let charCode;
  //     let charMode = false;
  //     for (let i = 0; i < value.length; i++) {
  //       charCode = value.charCodeAt(i);
  //       if (charCode >= 65 && charCode <= 90) {
  //         callback('至少6位，必须含有小写字母与下划线，不能下划线开头和结尾，不能含有大写字母');
  //         return;
  //       }
  //       if (charCode >= 97 && charCode <= 122) {
  //         charMode = true;
  //         continue;
  //       }
  //     }
  //     if (
  //       value.length >= 6 &&
  //       value.indexOf('_') > 0 &&
  //       value.substr(value.length - 1, 1) !== '_' &&
  //       charMode
  //     )
  //       callback();
  //     else callback('至少6位，必须含有小写字母与下划线，不能下划线开头和结尾，不能含有大写字母');
  //   } else callback();
  // };

  // 验证Id 至少6位 不能含有空格 不能有中文
  validatorID = (rule, value, callback) => {
    if (value) {
      if (value.length >= 6 && !chineseRe.test(value) && value.indexOf(' ') < 0) {
        callback();
        return;
      }
    }
    callback('至少6位,不能含有空格和中文');
  };

  // 验证所属建筑楼层
  validateBuildingFloor = (rule, value, callback) => {
    if (value) {
      const { buildingId = null, floorId = null } = value;
      if ((buildingId && floorId) || (!buildingId && !floorId)) {
        callback();
      } else callback('请同时选择所属建筑和楼层');
    } else callback();
  };

  /**
   * 选择建筑物
   */
  handleSelectBuilding = value => {
    const {
      form: { setFieldsValue },
    } = this.props;
    this.fetchFloors({ payload: { pageNum: 1, pageSize: 0, building_id: value } });
    setFieldsValue({ buildingFloor: { buildingId: value } });
  };

  /**
   * 选择楼层
   */
  handleSelectFloor = floorId => {
    const {
      form: { setFieldsValue, getFieldValue },
    } = this.props;
    const buildingFloor = getFieldValue('buildingFloor');
    setFieldsValue({ buildingFloor: { ...buildingFloor, floorId } });
  };

  handleToAddBuilding = () => {
    const {
      location: {
        query: { companyId, name },
      },
    } = this.props;
    const { company } = this.state;
    const cId = company.id || companyId;
    const cName = company.name || name;
    router.push(
      cId
        ? `/base-info/buildings-info/add?companyId=${cId}&&name=${cName}`
        : '/base-info/buildings-info/add'
    );
  };

  /**
   * 选择网关设备
   */
  handleGateSelect = row => {
    const {
      form: { setFieldsValue },
    } = this.props;
    setFieldsValue({ plugFlowEquipment: row.id });
    this.setState({ gatewayEquipment: row, gateWayModalVisible: false });
  };

  /**
   * 打开选择网关设备编号弹窗
   */
  handleViewGateWayModal = () => {
    this.setState({ gateWayModalVisible: true });
    this.fetchGatewayForPage();
  };

  /**
   * 获取网关设备（分页）
   */
  fetchGatewayForPage = (payload = { pageNum: 1, pageSize: 10 }) => {
    const { dispatch } = this.props;
    const { company } = this.state;
    dispatch({
      type: 'device/fetchGatewayEquipmentForPage',
      payload: { companyId: company && company.id ? company.id : undefined, ...payload },
    });
  };

  // 渲染视频设备信息
  renderVideoInfo() {
    const {
      location: {
        query: { name: nameCompany },
      },
      videoMonitor: {
        detail: {
          data: detail,
          data: {
            companyName,
            deviceId,
            keyId,
            name,
            status,
            rtspAddress,
            photoAddress,
            isInspection,
            // xnum,
            // ynum,
            // xfire,
            // yfire,
            buildingId,
            floorId,
          },
        },
      },
      form: { getFieldDecorator, getFieldValue },
      match: {
        params: { id },
      },
      // safety: {
      //   detail: { safetyFourPicture },
      // },
      // company: {
      //   detail: {
      //     data: { fireIchnographyUrl },
      //   },
      // },
      user: {
        currentUser: { unitType, companyName: defaultName, permissionCodes },
      },
      personnelPosition: {
        map: { buildings = [], floors = [] },
      },
      device: {
        equipment: { list: equipmentList = [] },
        connectTypeDict,
      },
      chemical: { videoList },
    } = this.props;
    const {
      // coordinate: { visible, fireVisible },
      gatewayEquipment,
    } = this.state;
    const companyId = this.state.company ? this.state.company.id : undefined;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    const itemStyles = { style: { width: '70%', marginRight: '10px' } };
    // const fourColorImgs = safetyFourPicture ? JSON.parse(safetyFourPicture) : [];

    // const fireImgs = fireIchnographyUrl ? JSON.parse(fireIchnographyUrl) : [];
    const buildingFloor = getFieldValue('buildingFloor') || {};
    const addBuildingAuth = hasAuthority(codes.company.buildingsInfo.add, permissionCodes);
    const inheritNvr = getFieldValue('inheritNvr');
    return (
      <Card className={styles.card} bordered={false}>
        <Form hideRequiredMark style={{ marginTop: 8 }}>
          <FormItem {...formItemLayout} label={fieldLabels.companyName}>
            {id
              ? getFieldDecorator('companyId', {
                  initialValue: companyName,
                  rules: [
                    {
                      required: true,
                      message: '请选择单位',
                    },
                  ],
                })(
                  <Input
                    {...itemStyles}
                    disabled
                    ref={input => {
                      this.CompanyIdInput = input;
                    }}
                    placeholder="请选择单位"
                  />
                )
              : getFieldDecorator('companyId', {
                  initialValue:
                    unitType === 4 || unitType === 1
                      ? nameCompany || defaultName
                      : nameCompany
                        ? nameCompany
                        : undefined,
                  rules: [
                    {
                      required: true,
                      message: '请选择单位',
                    },
                  ],
                })(
                  <Input
                    {...itemStyles}
                    disabled
                    ref={input => {
                      this.CompanyIdInput = input;
                    }}
                    placeholder="请选择单位"
                  />
                )}
            {id || nameCompany || (defaultName && unitType !== 2) ? null : (
              <Button type="primary" onClick={this.handleShowCompanyModal}>
                {' '}
                选择单位
              </Button>
            )}
          </FormItem>

          <FormItem {...formItemLayout} label={fieldLabels.videoArea}>
            {getFieldDecorator('name', {
              initialValue: name,
              rules: [
                {
                  required: true,
                  message: '请输入视频名称',
                },
              ],
            })(<Input {...itemStyles} placeholder="请输入视频名称" />)}
          </FormItem>
          <FormItem {...formItemLayout} label={fieldLabels.buildingFloor}>
            {getFieldDecorator('buildingFloor', {
              initialValue: id ? { buildingId, floorId } : {},
              rules: [{ validator: this.validateBuildingFloor }],
            })(
              <Fragment>
                <div style={{ display: 'inline-block', ...itemStyles.style }}>
                  <Select
                    value={buildingFloor.buildingId || undefined}
                    style={{ width: 'calc(50% - 3px)', marginRight: '6px' }}
                    placeholder="请选择建筑物"
                    onSelect={this.handleSelectBuilding}
                  >
                    {buildings.map((item, i) => (
                      <Select.Option key={i} value={item.id}>
                        {item.buildingName}
                      </Select.Option>
                    ))}
                  </Select>
                  <Select
                    value={buildingFloor.floorId || undefined}
                    style={{ width: 'calc(50% - 3px)' }}
                    placeholder="请选择楼层"
                    onSelect={this.handleSelectFloor}
                  >
                    {floors.map((item, i) => (
                      <Select.Option key={i} value={item.id}>
                        {item.floorName}
                      </Select.Option>
                    ))}
                  </Select>
                </div>
                <Button
                  type="primary"
                  disabled={!addBuildingAuth}
                  onClick={this.handleToAddBuilding}
                >
                  新增建筑楼层
                </Button>
              </Fragment>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label={fieldLabels.equipmentID}>
            {getFieldDecorator('deviceId', {
              initialValue: deviceId,
              getValueFromEvent: this.handleTrim,
              rules: [
                {
                  required: true,
                  message: '请输入设备ID',
                },
                {
                  validator: this.validatorID,
                },
              ],
            })(<Input {...itemStyles} placeholder="请输入设备ID" />)}
          </FormItem>

          <FormItem {...formItemLayout} label={fieldLabels.cameraID}>
            {getFieldDecorator('keyId', {
              initialValue: keyId,
              getValueFromEvent: this.handleTrim,
              rules: [
                {
                  required: true,
                  message: '请输入摄像头ID',
                },
                {
                  validator: this.validatorID,
                },
              ],
            })(<Input {...itemStyles} placeholder="请输入摄像头ID" />)}
          </FormItem>

          {/*
                        <FormItem {...formItemLayout} label={fieldLabels.videoStatus}>
            {getFieldDecorator('status', {
              initialValue: status,
              rules: [
                {
                  message: '请输入视频状态',
                },
              ],
            })(<Input placeholder="请输入视频状态" />)}
          </FormItem>
            */}

          <FormItem {...formItemLayout} label={fieldLabels.videoURL}>
            {getFieldDecorator('rtspAddress', {
              initialValue: rtspAddress,
              rules: [
                // {
                //   required: true,
                //   message: '请输入视频URL',
                // },
              ],
            })(<Input {...itemStyles} placeholder="请输入视频URL" />)}
          </FormItem>

          <FormItem {...formItemLayout} label={fieldLabels.picAddress}>
            {getFieldDecorator('photoAddress', {
              initialValue: photoAddress,
              rules: [
                {
                  message: '请输入图片地址',
                },
              ],
            })(<Input {...itemStyles} placeholder="请输入图片地址" />)}
          </FormItem>

          <FormItem {...formItemLayout} label={fieldLabels.inspectSentries}>
            {getFieldDecorator('isInspection', {
              valuePropName: 'checked',
              initialValue: !!isInspection,
            })(<Switch checkedChildren="是" unCheckedChildren="否" />)}
          </FormItem>

          {/* 设备关系 */}
          <FormItem {...formItemLayout} label={fieldLabels.inheritNvr}>
            {getFieldDecorator('inheritNvr', {
              initialValue: id ? detail.inheritNvr : undefined,
              // rules: [{ required: true, message: '请选择是否集成NVR' }],
            })(
              <Radio.Group>
                <Radio value={1}>是</Radio>
                <Radio value={0}>否</Radio>
              </Radio.Group>
            )}
          </FormItem>

          {+inheritNvr === 1 && (
            <FormItem {...formItemLayout} label={fieldLabels.plugFlowEquipment}>
              {getFieldDecorator('plugFlowEquipment', {
                // initialValue: id ? detail.plugFlowEquipment : undefined,
                // rules: [{ required: true, message: '请选择推流主机编号' }],
              })(
                <Fragment>
                  <Input
                    disabled
                    value={gatewayEquipment.code}
                    placeholder="请选择"
                    {...itemStyles}
                  />
                  <Button type="primary" onClick={this.handleViewGateWayModal}>
                    选择
                  </Button>
                </Fragment>
              )}
            </FormItem>
          )}

          {+inheritNvr === 0 && (
            <FormItem {...formItemLayout} label={fieldLabels.nvr}>
              {getFieldDecorator('nvr', {
                // initialValue: id ? detail.nvr : undefined,
                // rules: [{ required: true, message: '请选择NVR编号' }],
              })(
                <Select placeholder="请选择" {...itemStyles}>
                  {equipmentList.map(({ id, code }) => (
                    <Select.Option key={id} value={id}>
                      {code}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </FormItem>
          )}

          <FormItem {...formItemLayout} label={fieldLabels.connectType}>
            {getFieldDecorator('connectType', {
              initialValue: id ? detail.connectType : undefined,
              // rules: [{ required: true, message: '请选择连接方式' }],
            })(
              <Select placeholder="请选择" {...itemStyles}>
                {connectTypeDict.map(({ value, desc }) => (
                  <Select.Option key={value} value={value}>
                    {desc}
                  </Select.Option>
                ))}
              </Select>
            )}
          </FormItem>

          <FormItem {...formItemLayout} label={fieldLabels.status}>
            {getFieldDecorator('status', {
              valuePropName: 'checked',
              initialValue: (!status && +status !== 0) || +status === 1,
            })(<Switch checkedChildren="启用" unCheckedChildren="禁用" />)}
          </FormItem>
          {companyId && (
            <FormItem {...formItemLayout} label={fieldLabels.mapLocation}>
              {getFieldDecorator('mapLocation')(
                <MapMarkerSelect
                  companyId={companyId}
                  markerList={videoList}
                  otherMarkersOption={{ url: OtherMarkerImg, size: 36 }}
                  markerOption={{ url: MarkerImg, size: 36 }}
                  markerId={id}
                  legend={{
                    label: '其他视频',
                    icon: MarkerGrayImg,
                    activeIcon: MarkerActiveImg,
                  }}
                />
              )}
            </FormItem>
          )}
          {companyId && (
            <FormItem label="该点位是否在化工安全生产驾驶舱显示" {...formItemLayout}>
              {getFieldDecorator('isShow')(
                <Radio.Group>
                  <Radio value="1">显示</Radio>
                  <Radio value="0">不显示</Radio>
                </Radio.Group>
              )}
            </FormItem>
          )}
        </Form>

        {/* <Form layout="vertical">
          <Row gutter={{ lg: 24, md: 12 }} style={{ position: 'relative', marginLeft: '19%' }}>
            <Col span={24}>
              <Row gutter={12}>
                <Col span={8}>
                  <Form.Item label={fieldLabels.fourPictureX}>
                    {getFieldDecorator('xnum', {
                      initialValue: xnum,
                      rules: [{ message: '请输入四色图坐标—X' }],
                    })(<Input placeholder="请输入四色图坐标—X" />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label={fieldLabels.fourPictureY}>
                    {getFieldDecorator('ynum', {
                      initialValue: ynum,
                      rules: [{ message: '请输入四色图坐标—Y' }],
                    })(<Input placeholder="请输入四色图坐标—Y" />)}
                  </Form.Item>
                </Col>
                <Col span={8} style={{ position: 'relative', marginTop: '3%' }}>
                  <Button onClick={this.showModalCoordinate}>定位</Button>
                  <Coordinate
                    width="760px"
                    visible={visible}
                    urls={fourColorImgs}
                    onOk={this.handleOk}
                    onCancel={() => {
                      this.setState({
                        coordinate: {
                          visible: false,
                        },
                      });
                    }}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        </Form> */}

        {/* <Form layout="vertical">
          <Row gutter={{ lg: 24, md: 12 }} style={{ position: 'relative', marginLeft: '19%' }}>
            <Col span={24}>
              <Row gutter={12}>
                <Col span={8}>
                  <Form.Item label={fieldLabels.firePictureX}>
                    {getFieldDecorator('xfire', {
                      initialValue: xfire,
                      rules: [{ message: '请输入消防平面图坐标—X' }],
                    })(<Input placeholder="请输入消防平面图坐标—X" />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label={fieldLabels.firePictureY}>
                    {getFieldDecorator('yfire', {
                      initialValue: yfire,
                      rules: [{ message: '请输入消防平面图坐标—Y' }],
                    })(<Input placeholder="请输入消防平面图坐标—Y" />)}
                  </Form.Item>
                </Col>
                <Col span={8} style={{ position: 'relative', marginTop: '3%' }}>
                  <Button onClick={this.showFireCoordinate}>定位</Button>
                  <Coordinate
                    title="消防平面图坐标定位"
                    width="760px"
                    visible={fireVisible}
                    urls={fireImgs}
                    onOk={this.handleFireOk}
                    onCancel={() => {
                      this.setState({
                        coordinate: {
                          fireVisible: false,
                        },
                      });
                    }}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        </Form> */}
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
          <LegacyIcon type="cross-circle-o" className={styles.errorIcon} />
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
          <LegacyIcon type="exclamation-circle" />
          {errorCount}
        </Popover>
      </span>
    );
  }

  /* 渲染底部工具栏 */
  renderFooterToolbar() {
    const {
      location: {
        query: { companyId: companyIdParams, name: nameParams },
      },
      match: {
        params: { id },
      },
      videoMonitor: {
        detail: {
          data: { companyId: detailCompanyId, companyName },
        },
      },
    } = this.props;

    const editCompanyId = companyIdParams || detailCompanyId;

    const editCompanyName = companyName || nameParams;

    return (
      <FooterToolbar>
        {this.renderErrorInfo()}
        <Button type="primary" size="large" onClick={this.handleClickValidate}>
          确定
        </Button>
        {id || companyIdParams ? (
          <Button
            size="large"
            onClick={() => this.goequipment(editCompanyId, editCompanyName)}
          >
            返回
          </Button>
        ) : (
          <Button size="large" onClick={this.goBack}>
            返回
          </Button>
        )}
      </FooterToolbar>
    );
  }

  // 渲染页面所有信息
  render() {
    const {
      gatewayLoading,
      match: {
        params: { id },
      },
    } = this.props;
    const { gateWayModalVisible } = this.state;
    const title = id ? editTitle : addTitle;

    // 面包屑
    const breadcrumbList = [
      {
        title: '首页',
        name: '首页',
        href: '/',
      },
      {
        title: '物联设备管理',
        name: '物联设备管理',
      },
      {
        title: '监控摄像头',
        name: '监控摄像头',
        href: '/device-management/video-monitor/list',
      },
      {
        title,
        name: title,
      },
    ];
    const gatewayModalProps = {
      visible: gateWayModalVisible,
      handleSelect: this.handleGateSelect,
      onCancel: () => {
        this.setState({ gateWayModalVisible: false });
      },
      fetch: this.fetchGatewayForPage, // 获取列表
      loading: gatewayLoading,
    };
    return (
      <PageHeaderLayout title={title} breadcrumbList={breadcrumbList}>
        {this.renderVideoInfo()}
        {this.renderFooterToolbar()}
        {this.renderCompanyModal()}
        <GateWayModal {...gatewayModalProps} />
      </PageHeaderLayout>
    );
  }
}
