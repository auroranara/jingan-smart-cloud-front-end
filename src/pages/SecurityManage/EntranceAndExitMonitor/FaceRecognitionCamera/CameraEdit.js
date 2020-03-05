import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import router from 'umi/router';
import { Form, Icon as LegacyIcon } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import {
  Input,
  Button,
  Card,
  Radio,
  Row,
  Switch,
  Popover,
  message,
  Select,
  Col,
  Popconfirm,
} from 'antd';
import FooterToolbar from '@/components/FooterToolbar';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';

import Coordinate from '../../../RiskControl/RiskPointManage/Coordinate/index';
import codes from '@/utils/codes';
import { hasAuthority } from '@/utils/customAuth';
import styles from './CameraEdit.less';

const FormItem = Form.Item;
const { Option } = Select;

// 编辑页面标题
const editTitle = '编辑摄像机信息';
// 添加页面标题
const addTitle = '新增摄像机信息';

// 表单标签
const fieldLabels = {
  companyName: '单位名称',
  name: '名称',
  number: '编号',
  faceDatabase: '人脸库',
  buildingFloor: '所属建筑楼层',
  picAddress: '图片地址',
  status: '视频监控状态',
  cameraArea: '摄像机区域-位置',
  hasArea: '所在区域',
  areaDetail: '位置详情',
  equipmentNo: '设备ID',
  videoCameraNo: '摄像机ID',
  videoCameraUrl: '视频Url',
  picLocation: '平面图定位',
};

// //  默认分页参数
// const defaultPagination = {
//   pageNum: 1,
//   pageSize: 10,
// };

@connect(
  ({
    securityManage,
    user,
    company,
    riskPointManage,
    buildingsInfo,
    personnelPosition,
    loading,
  }) => ({
    securityManage,
    user,
    company,
    riskPointManage,
    personnelPosition,
    buildingsInfo,
    loading: loading.models.securityManage,
  })
)
@Form.create()
export default class CameraEdit extends PureComponent {
  state = {
    company: {},
    statusRadio: '', // radio初始状态
    picModalVisible: false, // 定位模态框是否可见
    picList: [], // 当前平面图信息list
    isDisabled: false, // 平面图新增按钮是否启用
    isEdit: true,
    typeIndex: '',
    isImgSelect: true,
    xNumCurrent: '',
    yNumCurrent: '',
    imgIdCurrent: '',
    imgTypes: [],
    imgIndex: '',
  };

  // 挂载后
  componentDidMount() {
    const {
      dispatch,
      match: {
        params: { id },
      },
      location: {
        query: { faceDataBaseId, companyId },
      },
      form: { setFieldsValue },
    } = this.props;
    this.fetchBuildings({ payload: { pageNum: 1, pageSize: 0, company_id: companyId } });
    if (id) {
      // 根据id获取详情
      dispatch({
        type: 'securityManage/fetchFaceCameraList',
        payload: {
          monitorSceneId: faceDataBaseId,
          pageSize: 18,
          pageNum: 1,
        },
        callback: response => {
          const { list } = response;
          const currentList = list.find(item => item.id === id) || {};
          const { buildingId, floorId, locationType, pointFixInfoList } = currentList;

          const buildingList = pointFixInfoList.filter(item => item.imgType === 2);

          setFieldsValue({ buildingFloor: { buildingId, floorId } });
          this.fetchFloors({ payload: { pageNum: 1, pageSize: 0, building_id: buildingId } });

          this.setState(
            {
              picList: pointFixInfoList.map(item => {
                return {
                  ...item,
                  isEdit: false,
                  isDisabled: true,
                };
              }),
            },
            () => {
              if (buildingList.length > 0) {
                dispatch({
                  type: 'personnelPosition/fetchBuildings',
                  payload: {
                    company_id: companyId,
                    pageSize: 0,
                    pageNum: 1,
                  },
                });
                dispatch({
                  type: 'personnelPosition/fetchFloors',
                  payload: {
                    building_id: buildingId,
                    pageSize: 0,
                    pageNum: 1,
                  },
                });
              }
            }
          );
          this.setState({
            statusRadio: locationType,
            buildingIdAuto: buildingId,
            floorIdAuto: floorId,
            imgTypes: pointFixInfoList.map(item => item.imgType),
          });
        },
      });
    } else {
      // 清空详情
      dispatch({ type: 'securityManage/clearDetail' });
    }
  }

  /* 去除左右两边空白 */
  handleTrim = e => e.target.value.trim();

  // 返回到摄像机列表页面
  goBack = () => {
    const {
      dispatch,
      location: {
        query: { id: pagesId, faceDataBaseId, companyId, companyName },
      },
    } = this.props;
    dispatch(
      routerRedux.push(
        `/security-manage/entrance-and-exit-monitor/face-recognition-camera/${pagesId}?faceDataBaseId=${faceDataBaseId}&&companyId=${companyId}&&companyName=${companyName}`
      )
    );
  };

  // 获取所属建筑列表
  fetchBuildings = actions => {
    const { dispatch } = this.props;
    dispatch({
      type: 'personnelPosition/fetchBuildings',
      ...actions,
    });
  };

  // 获取楼层
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
        query: { faceDataBaseId },
      },
      dispatch,
    } = this.props;

    const { picList, isDisabled } = this.state;

    if (isDisabled === true) {
      return message.error('请先保存平面图定位信息！');
    }

    validateFieldsAndScroll((error, values) => {
      if (!error) {
        this.setState({
          submitting: true,
        });

        const {
          name,
          number,
          locationType,
          buildingFloor: { buildingId, floorId } = {},
          videoCameraArea,
          location,
          state,
          equipmentNo,
          videoCameraNo,
          videoCameraUrl,
        } = values;

        const payload = {
          monitorSceneId: faceDataBaseId,
          number,
          name,
          locationType,
          videoCameraArea,
          location,
          buildingId: picList.map(item => item.buildingId).join('') || buildingId,
          floorId: picList.map(item => item.floorId).join('') || floorId,
          pointFixInfoList: picList.filter(item => item.imgType),
          state: +state,
          equipmentNo,
          videoCameraNo,
          videoCameraUrl,
        };

        const success = () => {
          const msg = id ? '编辑成功' : '新增成功';
          message.success(msg, 1, this.goBack());
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
            type: 'securityManage/fetchFaceCameraEdit',
            payload: {
              id,
              ...payload,
            },
            success,
            error,
          });
        }
        // 不存在id,则为新增
        else {
          dispatch({
            type: 'securityManage/fetcFaceCameraAdd',
            payload,
            success,
            error,
          });
        }
      }
    });
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

  // 选择建筑物
  handleSelectBuilding = value => {
    const {
      form: { setFieldsValue },
    } = this.props;
    this.fetchFloors({ payload: { pageNum: 1, pageSize: 0, building_id: value } });
    setFieldsValue({ buildingFloor: { buildingId: value } });
    this.setState({ buildingIdAuto: value });
  };

  // 选择楼层
  handleSelectFloor = floorId => {
    const {
      form: { setFieldsValue, getFieldValue },
    } = this.props;
    const buildingFloor = getFieldValue('buildingFloor');
    setFieldsValue({ buildingFloor: { ...buildingFloor, floorId } });
    this.setState({ floorIdAuto: floorId });
  };

  // 新增建筑物
  handleToAddBuilding = () => {
    const {
      location: {
        query: { companyId, companyName },
      },
    } = this.props;
    const { company } = this.state;
    const cId = company.id || companyId;
    const cName = company.name || companyName;
    router.push(
      cId
        ? `/base-info/buildings-info/add?companyId=${cId}&&name=${cName}`
        : '/base-info/buildings-info/add'
    );
  };

  // 切换
  handleRadioChange = e => {
    this.setState({ statusRadio: e.target.value });
  };

  // 显示定位模态框
  showModalCoordinate = index => {
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

    const { picList, typeIndex, floorId: addFloorId, buildingIdAuto, floorIdAuto } = this.state;
    const imgType = picList.map(i => i.imgType);
    const imgIndex = imgType[index];

    const xNumCurrent = picList.map(item => item.xnum)[index] || '';
    const yNumCurrent = picList.map(item => item.ynum)[index] || '';
    const imgIdCurrent = picList.map(item => item.fixImgId)[index] || '';

    const callback = () => {
      this.setState({
        picModalVisible: true,
        xNumCurrent: xNumCurrent,
        yNumCurrent: yNumCurrent,
        imgIdCurrent: imgIdCurrent,
        imgIndex: imgIndex,
      });
    };

    if (!id && list.length === 0) {
      message.error('该单位暂无图片！');
    } else {
      if (!typeIndex && !imgIndex) {
        return message.error('请先选择平面图类型!');
      } else {
        if (!typeIndex) {
          if ((id && imgIndex !== 2) || imgIndex === 1 || imgIndex === 3 || imgIndex === 4) {
            dispatch({
              type: 'riskPointManage/fetchFixImgInfo',
              payload: {
                companyId,
                type: imgIndex,
              },
              callback,
            });
          } else {
            if (id || imgIndex === 2) {
              dispatch({
                type: 'personnelPosition/fetchBuildings',
                payload: {
                  company_id: companyId,
                  pageSize: 0,
                  pageNum: 1,
                },
                callback: () => {
                  callback();
                  this.getFloorInfo(buildingIdAuto);
                  dispatch({
                    type: 'riskPointManage/fetchFixImgInfo',
                    payload: {
                      companyId,
                      type: imgIndex,
                      buildingId: buildingIdAuto,
                      floorId: addFloorId ? addFloorId : floorIdAuto,
                    },
                  });
                },
              });
            }
          }
        } else {
          callback();
          if (id && list.length === 0) {
            message.error('该单位暂无图片！');
          }
        }
      }
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
    const { buildingIdAuto, floorIdAuto } = this.state;
    if (key === 1 || key === 3 || key === 4) {
      dispatch({
        type: 'riskPointManage/fetchFixImgInfo',
        payload: {
          companyId,
          type: key,
        },
      });
    }
    if (key === 2 && buildingIdAuto) {
      dispatch({
        type: 'riskPointManage/fetchFixImgInfo',
        payload: {
          companyId,
          type: key,
          buildingId: buildingIdAuto,
          floorId: floorIdAuto,
        },
      });
    }
    if (key === 2) {
      this.fetchBuildings({ payload: { pageNum: 1, pageSize: 0, company_id: companyId } });
    }
    this.setState({ typeIndex: key, picModalVisible: false });
  };

  // 清空当前平面图信息
  handleImgIndex = index => {
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
      typeIndex: '',
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
    this.fetchFloors({ payload: { pageNum: 1, pageSize: 0, building_id: id } });
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

  // 平面图编辑
  handlePicEdit = index => {
    const { picList } = this.state;
    const newList = [
      ...picList.slice(0, index),
      { ...picList[index], isDisabled: false, isEdit: true },
      ...picList.slice(index + 1),
    ];
    this.setState({ picList: newList, isEdit: true, isDisabled: true });
  };

  // 平面图删除
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
      personnelPosition: {
        map: { buildings = [], floors = [] },
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
      buildingIdAuto,
      floorIdAuto,
    } = this.state;

    const imgTypeList = picType.filter(item => imgTypes.indexOf(item.key) < 0);

    return (
      <Row gutter={{ lg: 24, md: 12 }} style={{ position: 'relative', left: '5%' }}>
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
                      onSelect={() => this.handleImgIndex(index)}
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
                      initialValue: buildingIdAuto,
                    })(
                      <Select
                        allowClear
                        placeholder="请选择建筑物名称"
                        disabled={item.isDisabled}
                        onSelect={() => this.handleBuildingSelect(index)}
                        onChange={this.getFloorInfo}
                      >
                        {buildings.map(({ buildingName, id }) => (
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
                      initialValue: floorIdAuto,
                    })(
                      <Select
                        allowClear
                        placeholder="请选择楼层名称"
                        disabled={item.isDisabled}
                        onChange={this.getFloorPic}
                        onSelect={() => this.handleFloorSelect(index)}
                      >
                        {floors.map(({ floorName, id }) => (
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
                    onClick={() => this.showModalCoordinate(index)}
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

  // 渲染摄像机设备信息
  renderCameraInfo() {
    const {
      location: {
        query: { companyName },
      },
      securityManage: {
        faceCameraData: { list },
      },
      form: { getFieldDecorator, getFieldValue },
      match: {
        params: { id },
      },
      user: {
        currentUser: { permissionCodes },
      },
      personnelPosition: {
        map: { buildings = [], floors = [] },
      },
    } = this.props;

    const { statusRadio, isDisabled } = this.state;

    const formItemLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 15 },
    };

    const itemStyles = { style: { width: '70%', marginRight: '10px' } };

    const buildingFloor = getFieldValue('buildingFloor') || {};
    const addBuildingAuth = hasAuthority(codes.company.buildingsInfo.add, permissionCodes);

    const currentList = list.find(item => item.id === id) || {};
    const {
      name,
      number,
      locationType,
      buildingId,
      floorId,
      videoCameraArea,
      location,
      state,
      equipmentNo,
      videoCameraNo,
      videoCameraUrl,
    } = currentList;

    return (
      <Card className={styles.card} bordered={false}>
        <Form style={{ marginTop: 8 }}>
          <FormItem {...formItemLayout} label={fieldLabels.companyName}>
            {getFieldDecorator('companyId', {
              initialValue: companyName,
            })(<Input {...itemStyles} disabled placeholder="请选择单位" />)}
          </FormItem>

          <FormItem {...formItemLayout} label={fieldLabels.name}>
            {getFieldDecorator('name', {
              initialValue: name,
              getValueFromEvent: this.handleTrim,
              rules: [
                {
                  required: true,
                  message: '请输入名称',
                },
              ],
            })(<Input {...itemStyles} placeholder="请输入名称" />)}
          </FormItem>

          <FormItem {...formItemLayout} label={fieldLabels.number}>
            {getFieldDecorator('number', {
              initialValue: number,
              getValueFromEvent: this.handleTrim,
              rules: [
                {
                  required: true,
                  message: '请输入编号',
                },
              ],
            })(<Input {...itemStyles} placeholder="请输入编号" />)}
          </FormItem>

          <FormItem {...formItemLayout} label={fieldLabels.faceDatabase}>
            {getFieldDecorator('monitorSceneId', {
              initialValue: '抓拍报警库',
            })(<Input {...itemStyles} disabled />)}
          </FormItem>

          <FormItem {...formItemLayout} label={fieldLabels.cameraArea}>
            {getFieldDecorator('locationType', {
              initialValue: locationType,
              rules: [{ required: true, message: '请选择摄像机区域-位置' }],
            })(
              <Radio.Group
                onChange={e => {
                  this.handleRadioChange(e);
                }}
              >
                <Radio value="1">选择建筑物-楼层</Radio>
                <Radio value="2">手填</Radio>
              </Radio.Group>
            )}
            <span style={{ color: 'red' }}>
              （单位摄像机较多的，如果摄像机在建筑物内，推荐使用建筑物-楼层）
            </span>
          </FormItem>

          {+statusRadio === 1 && (
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
          )}

          <FormItem {...formItemLayout} label={fieldLabels.hasArea}>
            {getFieldDecorator('videoCameraArea', {
              initialValue: videoCameraArea,
              getValueFromEvent: this.handleTrim,
              rules: [
                {
                  required: true,
                  message: '请输入所在区域',
                },
              ],
            })(<Input {...itemStyles} placeholder="请输入所在区域" />)}
          </FormItem>

          <FormItem {...formItemLayout} label={fieldLabels.areaDetail}>
            {getFieldDecorator('location', {
              initialValue: location,
              getValueFromEvent: this.handleTrim,
              rules: [
                {
                  required: true,
                  message: '请输入位置详情',
                },
              ],
            })(<Input {...itemStyles} placeholder="请输入位置详情" />)}
          </FormItem>

          <FormItem {...formItemLayout} label={fieldLabels.equipmentNo}>
            {getFieldDecorator('equipmentNo', {
              initialValue: equipmentNo,
              getValueFromEvent: this.handleTrim,
            })(<Input {...itemStyles} placeholder="请输入设备ID" />)}
          </FormItem>

          <FormItem {...formItemLayout} label={fieldLabels.videoCameraNo}>
            {getFieldDecorator('videoCameraNo', {
              initialValue: videoCameraNo,
              getValueFromEvent: this.handleTrim,
            })(<Input {...itemStyles} placeholder="请输入摄像头ID" />)}
          </FormItem>

          <FormItem {...formItemLayout} label={fieldLabels.videoCameraUrl}>
            {getFieldDecorator('videoCameraUrl', {
              initialValue: videoCameraUrl,
              getValueFromEvent: this.handleTrim,
            })(<Input {...itemStyles} placeholder="请输入视频URL" />)}
          </FormItem>

          <Form.Item
            {...formItemLayout}
            label={fieldLabels.picLocation}
            style={{ marginBottom: 8 }}
          >
            <Button
              type="primary"
              onClick={this.handlePicInfoAdd}
              size="small"
              disabled={isDisabled}
            >
              新增
            </Button>
          </Form.Item>
          {this.renderPicInfo()}

          <FormItem {...formItemLayout} label={fieldLabels.status}>
            {getFieldDecorator('state', {
              valuePropName: 'checked',
              initialValue: (!state && +state !== 0) || +state === 1,
            })(<Switch checkedChildren="启用" unCheckedChildren="禁用" />)}
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
    return (
      <FooterToolbar>
        {this.renderErrorInfo()}
        <Button type="primary" size="large" onClick={this.handleClickValidate}>
          确定
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
      match: {
        params: { id },
      },
      location: {
        query: { id: pagesId, faceDataBaseId, companyName, companyId },
      },
    } = this.props;
    const title = id ? editTitle : addTitle;

    // 面包屑
    const breadcrumbList = [
      {
        title: '首页',
        name: '首页',
        href: '/',
      },
      {
        title: '出入口监测',
        name: '出入口监测',
        href: '/security-manage/entrance-and-exit-monitor/company-list',
      },
      {
        title: '人脸识别摄像机',
        name: '人脸识别摄像机',
        href: `/security-manage/entrance-and-exit-monitor/face-recognition-camera/${pagesId}?faceDataBaseId=${faceDataBaseId}&&companyId=${companyId}&&companyName=${companyName}`,
      },
      {
        title,
        name: title,
      },
    ];

    return (
      <PageHeaderLayout title={title} breadcrumbList={breadcrumbList}>
        {this.renderCameraInfo()}
        {this.renderFooterToolbar()}
      </PageHeaderLayout>
    );
  }
}
