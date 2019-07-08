import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import {
  Form,
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
} from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';

import Coordinate from './Coordinate/index';
import CompanyModal from '../../BaseInfo/Company/CompanyModal';
import CheckModal from '../../LawEnforcement/Illegal/checkModal';
import styles from './RiskPointEdit.less';

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
  cycleType: '自定义检查周期：',
  RecommendCycle: '推荐检查周期:',
};

const COLUMNS = [
  {
    title: '标签编号',
    dataIndex: 'location_code',
    key: 'location_code',
    align: 'center',
    width: 120,
  },
  {
    title: '二维码',
    dataIndex: 'qr_code',
    key: 'qr_code',
    align: 'center',
    width: 90,
  },
  {
    title: 'NFC',
    dataIndex: 'nfc_code',
    key: 'nfc_code',
    align: 'center',
    width: 300,
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

@connect(({ illegalDatabase, buildingsInfo, riskPointManage, user, loading }) => ({
  illegalDatabase,
  riskPointManage,
  buildingsInfo,
  user,
  loading: loading.models.riskPointManage,
}))
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
  };

  // 返回到列表页面
  goBack = () => {
    const {
      dispatch,
      location: {
        query: { companyId, companyName },
      },
    } = this.props;
    dispatch(
      routerRedux.push(
        `/risk-control/risk-point-manage/risk-point-List/${companyId}?companyId=${companyId}&&companyName=${companyName}`
      )
    );
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
      location: {
        query: { companyId },
      },
    } = this.props;
    const payload = { pageSize: PageSize, pageNum: 1 };
    // 获取推荐检查周期
    dispatch({
      type: 'riskPointManage/fetchCheckCycle',
      payload: {
        companyId,
        type: 2,
      },
    });
    // 获取业务分类
    dispatch({
      type: 'illegalDatabase/fetchOptions',
    });
    // 获取行业类别
    dispatch({
      type: 'riskPointManage/fetchIndustryDict',
    });
    this.fetchPointLabel({ payload });
    this.fetchCheckContent({ payload });

    // 清空
    flow_id = [];

    if (id) {
      // 根据id获取详情
      dispatch({
        type: 'riskPointManage/fetchRiskPointDetail',
        payload: {
          id,
        },
        callback: response => {
          const { itemFlowList, pointFixInfoList } = response;

          const buildingList = pointFixInfoList.filter(item => item.imgType === 2);
          const buildingId = buildingList.map(item => item.buildingId).join('');
          const floorId = buildingList.map(item => item.fixImgId).join('');

          this.setState({ flowList: itemFlowList });
          flow_id = itemFlowList.map(d => {
            return { flow_id_data: d.flow_id_data, flow_id: d.flow_id };
          });

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
                  type: 'buildingsInfo/fetchBuildingList',
                  payload: {
                    company_id: companyId,
                    pageSize: 0,
                    pageNum: 1,
                  },
                });
                dispatch({
                  type: 'buildingsInfo/fetchFloorList',
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
            buildingId: buildingId,
            floorId: floorId,
            imgTypes: pointFixInfoList.map(item => item.imgType),
          });
        },
      });
    } else {
      // 清空详情
      dispatch({
        type: 'riskPointManage/clearDetail',
      });
    }
  }

  // 点击提交按钮验证表单信息
  handleClickValidate = () => {
    const {
      form: { validateFieldsAndScroll },
      match: {
        params: { id },
      },
      dispatch,
      location: {
        query: { companyId },
      },
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
          objectTitle,
          locationCode,
          qrCode,
          nfcCode,
          checkCycle,
          cycleType,
          itemCode,
        } = values;

        const payload = {
          id,
          companyId,
          objectTitle,
          locationCode,
          checkCycle,
          cycleType,
          qrCode,
          nfcCode,
          itemCode,
          itemFlowList: flow_id,
          pointFixInfoList: picList.filter(item => item.imgType),
        };
        const success = () => {
          const msg = id ? '编辑成功' : '新增成功';
          message.success(msg, 1, this.goBack());
        };
        const error = () => {
          const msg = id ? '修改失败' : '新增失败';
          message.error(msg, 1);
          this.setState({
            submitting: false,
          });
        };
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
    const {
      dispatch,
      location: {
        query: { companyId },
      },
    } = this.props;
    dispatch({
      type: 'riskPointManage/fetchLabelDict',
      payload: {
        companyId,
        ...payload,
      },
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
      locationCode: value.location_code,
      qrCode: value.qr_code,
      nfcCode: value.nfc_code,
    });
    this.handleClose();
  };

  // 关闭模态框(RFID)
  handleClose = () => {
    this.setState({
      rfidVisible: false,
    });
  };

  // 渲染模态框(RFID)
  renderRfidModal() {
    const {
      loading,
      riskPointManage: { labelModal },
    } = this.props;
    const { rfidVisible } = this.state;

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
      />
    );
  }

  // 显示模态框(检查内容)
  handleContentModal = e => {
    const { dispatch } = this.props;
    e.target.blur();
    this.setState({ checkVisible: true });
    // 初始化表格
    dispatch({
      type: 'illegalDatabase/fetchDtoList',
      payload: {
        ...defaultPagination,
      },
    });
  };

  // 获取内容（检查内容）
  fetchCheckContent = ({ payload }) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'illegalDatabase/fetchDtoList',
      payload,
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
                if (flow_id.join(',').indexOf(record.flow_id) >= 0) {
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

    const { picList, typeIndex } = this.state;
    const imgType = picList.map(i => i.imgType);
    const imgIndex = imgType[index];

    const xNumCurrent = picList.map(item => item.xnum)[index] || '';
    const yNumCurrent = picList.map(item => item.ynum)[index] || '';
    const imgIdCurrent = picList.map(item => item.fixImgId)[index] || '';

    const buildingList = picList.filter(item => item.imgType === 2);
    const buildingId = buildingList.map(item => item.buildingId).join('');
    const floorId = buildingList.map(item => item.floorId).join('');

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
    }

    if (id && list.length === 0 && !typeIndex && !imgIndex) {
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
              type: 'buildingsInfo/fetchBuildingList',
              payload: {
                company_id: companyId,
                pageSize: 0,
                pageNum: 1,
              },
              success: () => {
                callback();
                this.getFloorInfo(buildingId);
                dispatch({
                  type: 'riskPointManage/fetchFixImgInfo',
                  payload: {
                    companyId,
                    type: imgIndex,
                    buildingId: buildingId,
                    floorId: floorId,
                  },
                });
              },
            });
          }
        }
      } else {
        callback();
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
      typeIndex: '',
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
    this.setState({ typeIndex: key });
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
              typeIndex: '',
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
        width: 80,
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
        {list && list.length ? (
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
        ) : (
          <div style={{ textAlign: 'center' }}>暂无数据</div>
        )}
      </Card>
    );
  }

  // 渲染信息
  renderInfo() {
    const {
      form: { getFieldDecorator },
      riskPointManage: {
        checkCycleList,
        cycleTypeList,
        checkCycleData,
        detail: { data = {} },
      },
    } = this.props;

    const { isDisabled } = this.state;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 2 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };
    return (
      <Card className={styles.card} bordered={false}>
        <Form layout="vertical">
          <Row gutter={{ lg: 24, md: 12 }} style={{ position: 'relative' }}>
            <Col span={24}>
              <Row gutter={12}>
                <Col span={8}>
                  <Form.Item label={fieldLabels.riskPointName}>
                    {getFieldDecorator('objectTitle', {
                      initialValue: data.objectTitle,
                      getValueFromEvent: this.handleTrim,
                      rules: [{ required: true, message: '请输入风险点' }],
                    })(<Input placeholder="请输入风险点" />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label={fieldLabels.number}>
                    {getFieldDecorator('itemCode', {
                      initialValue: data.itemCode,
                      getValueFromEvent: this.handleTrim,
                      rules: [{ message: '请输入编号' }],
                    })(<Input placeholder="请输入编号" />)}
                  </Form.Item>
                </Col>
              </Row>
            </Col>
            <Col span={24}>
              <Row gutter={12}>
                <Col span={8}>
                  <Form.Item label={fieldLabels.RecommendCycle}>
                    {getFieldDecorator('recommendCycle', {
                      getValueFromEvent: this.handleTrim,
                      initialValue: getCycleType(checkCycleData),
                      rules: [{ required: true, message: '推荐检查周期' }],
                    })(<Input placeholder="推荐检查周期" disabled />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label={fieldLabels.cycleType}>
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
                <Col span={8}>
                  <Form.Item label={fieldLabels.checkCycle}>
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
              </Row>
            </Col>
            <Col span={24}>
              <Row gutter={12}>
                <Col span={6}>
                  <Form.Item label={fieldLabels.bindRFID}>
                    {getFieldDecorator('locationCode', {
                      initialValue: data.locationCode,
                      getValueFromEvent: this.handleTrim,
                      rules: [{ required: true, message: '请选择RFID' }],
                    })(<Input placeholder="请选择RFID" disabled />)}
                  </Form.Item>
                </Col>
                <Col span={2} style={{ position: 'relative', marginTop: '3%' }}>
                  <Button onClick={this.handleFocus}>选择</Button>
                </Col>
                <Col span={8}>
                  <Form.Item label={fieldLabels.ewm}>
                    {getFieldDecorator('qrCode', {
                      initialValue: data.qrCode,
                      getValueFromEvent: this.handleTrim,
                      rules: [{ required: true, message: '请选择二维码' }],
                    })(<Input placeholder="请选择二维码" disabled />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label={fieldLabels.nfc}>
                    {getFieldDecorator('nfcCode', {
                      initialValue: data.nfcCode,
                      getValueFromEvent: this.handleTrim,
                      rules: [{ required: true, message: '请选择NFC' }],
                    })(<Input placeholder="请选择NFC" disabled />)}
                  </Form.Item>
                </Col>
              </Row>
            </Col>
          </Row>
        </Form>

        <Form style={{ marginTop: 8 }}>
          <Form.Item {...formItemLayout} label={fieldLabels.picLocation}>
            <Button type="primary" onClick={this.handlePicInfoAdd} disabled={isDisabled}>
              新增
            </Button>
          </Form.Item>
          {this.renderPicInfo()}
        </Form>

        <Form style={{ marginTop: 30 }}>
          <Form.Item {...formItemLayout} label={fieldLabels.checkContent} />
          <Button
            type="primary"
            style={{ float: 'right', marginLeft: 10, marginBottom: 10 }}
            onClick={this.handleDeleteContent}
          >
            删除
          </Button>
          <Button
            type="primary"
            style={{ float: 'right', marginBottom: 10 }}
            onClick={this.handleContentModal}
          >
            新增
          </Button>
          <Divider style={{ marginTop: '-20px' }} />
          {this.renderCheckTable()}
        </Form>

        <div style={{ textAlign: 'center' }}>
          <Button size="large" type="primary" onClick={this.handleClickValidate}>
            提交
          </Button>
          <Button size="large" style={{ marginLeft: '20px' }} onClick={this.goBack}>
            返回
          </Button>
        </div>
      </Card>
    );
  }

  // 渲染页面所有信息
  render() {
    const {
      match: {
        params: { id },
      },
      location: {
        query: { companyId, companyName },
      },
    } = this.props;
    const title = id ? editTitle : addTitle;

    // 面包屑
    const breadcrumbList = [
      { title: '首页', name: '首页', href: '/' },
      { title: '风险管控', name: '风险管控' },
      { title: '风险点管理', name: '风险点管理', href: '/risk-control/risk-point-manage/index' },
      {
        title: '单位风险点',
        name: '单位风险点',
        href: `/risk-control/risk-point-manage/risk-point-List/${companyId}?companyId=${companyId}&&companyName=${companyName}`,
      },
      {
        title,
        name: title,
      },
    ];

    return (
      <PageHeaderLayout title={title} breadcrumbList={breadcrumbList}>
        {this.renderInfo()}
        {this.renderRfidModal()}
        {this.renderCheckModal()}
      </PageHeaderLayout>
    );
  }
}
