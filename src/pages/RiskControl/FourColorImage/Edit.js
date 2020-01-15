import { connect } from 'dva';
import React, { Fragment } from 'react';
import {
  Button,
  Row,
  Col,
  Form,
  Input,
  Card,
  Select,
  Spin,
  Tag,
  message,
  AutoComplete,
  DatePicker,
} from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import { phoneReg } from '@/utils/validate';
import router from 'umi/router';
import debounce from 'lodash/debounce';
import moment from 'moment';
import styles from './TableList.less';
import Map from './Map';

const FormItem = Form.Item;

const title = '风险四色图管理';
//面包屑
const breadcrumbList = [
  {
    title: '首页',
    name: '首页',
    href: '/',
  },
  {
    title: '风险分级管控',
    name: '风险分级管控',
  },
  {
    title,
    name: '风险四色图管理',
    href: '/risk-control/four-color-image/list',
  },
];

const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19 },
};

const itemStyles = {
  style: {
    width: 'calc(70%)',
    marginRight: '10px',
  },
};
@Form.create()
@connect(({ fourColorImage, user, map, account, loading }) => ({
  fourColorImage,
  user,
  map,
  account,
  loading: loading.models.fourColorImage,
  perLoading: loading.effects['account/fetch'],
}))
export default class TableList extends React.Component {
  constructor(props) {
    super(props);
    this.handlePersonSearch = debounce(this.handlePersonSearch, 800);
    this.state = {
      isDrawing: false,
      isRest: false,
      detailList: {},
      pointList: [],
      points: [],
      buildingId: [], // 新增时获取的区域Id
      modelIds: '', // 编辑时获取的区域Id
    };
  }

  componentDidMount() {
    const {
      dispatch,
      match: {
        params: { id },
      },
      user: {
        currentUser: { companyId },
      },
      location: {
        query: { companyId: extraCompanyId },
      },
    } = this.props;

    this.fetchPersonList({ unitId: companyId || extraCompanyId });
    this.fetchMap({ companyId: companyId || extraCompanyId }, mapInfo => {
      this.childMap.initMap({ ...mapInfo });
    });

    if (id) {
      dispatch({
        type: 'fourColorImage/fetchList',
        payload: {
          id,
          pageSize: 10,
          pageNum: 1,
        },
        callback: res => {
          const { list } = res;
          const currentList = list.find(item => item.id === id) || {};
          const pointList = list.filter(item => item.id === id) || [];
          this.setState({
            detailList: currentList,
            pointList,
            modelIds: currentList.modelIds,
            points: currentList.coordinateList.map(item => ({
              x: +item.x,
              y: +item.y,
              z: +item.z,
              groupID: 1,
            })),
          });
        },
      });
    }
  }

  goBack = () => {
    router.push('/risk-control/four-color-image/list');
  };

  onRef = ref => {
    this.childMap = ref;
  };

  handleReset = () => {
    this.childMap.setRestMap();
    this.setState({ buildingId: [] });
  };

  // 获取人员列表
  fetchPersonList = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'account/fetch',
      payload: {
        pageSize: 10,
        pageNum: 1,
        ...params,
      },
    });
  };

  // 获取地图
  fetchMap = (params, callback) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'map/fetchMapList',
      payload: { ...params },
      callback,
    });
  };

  // 模糊搜索个人列表
  handlePersonSearch = value => {
    const { dispatch } = this.props;
    // 根据输入值获取列表
    dispatch({
      type: 'account/fetch',
      payload: {
        userName: value && value.trim(),
        pageNum: 1,
        pageSize: 18,
      },
    });
  };

  // 回调人员列表
  handlePersonChange = e => {
    const {
      account: { list: personList = [] },
      form: { setFieldsValue },
    } = this.props;
    const phnoneValue = personList
      .filter(({ userName }) => userName === e.label)
      .map(item => item.phoneNumber)[0];

    setFieldsValue({ phoneNumber: phnoneValue });
  };

  // 个人选择框失去焦点
  handlePersonBlur = value => {
    const {
      form: { setFieldsValue },
    } = this.props;
    if (value && value.key && value.key === value.label) {
      setFieldsValue({ zoneCharger: '' });
    }
  };

  // 去除左右两边空白
  handleTrim = e => e.target.value.trim();

  handleSubmit = () => {
    const {
      dispatch,
      form: { validateFieldsAndScroll },
      match: {
        params: { id },
      },
      user: {
        currentUser: { companyId },
      },
      location: {
        query: { companyId: extraCompanyId },
      },
    } = this.props;

    const { points, detailList, buildingId } = this.state;
    const { coordinateList } = detailList;
    if (!id ? points.length === 0 : coordinateList.length === 0) {
      return message.warning('请在地图上划分区域');
    }

    validateFieldsAndScroll((errors, values) => {
      if (!errors) {
        const {
          zoneCode,
          zoneName,
          zoneLevel,
          zoneType,
          zoneCharger,
          phoneNumber,
          checkCircle,
          createTime,
        } = values;
        const payload = {
          id,
          zoneCode,
          zoneName,
          zoneLevel,
          zoneType,
          phoneNumber,
          checkCircle,
          createTime: createTime.format('YYYY-MM-DD'),
          companyId: companyId || extraCompanyId,
          zoneCharger: zoneCharger.key,
          coordinate:
            points.length > 0
              ? JSON.stringify(points.map(({ x, y, z, groupID }) => ({ x, y, z, groupID })))
              : undefined,
          groupId: 1,
          modelIds: buildingId
            .filter(item => item.selected === true)
            .map(item => item.areaId)
            .join(','),
        };
        const success = () => {
          const msg = id ? '编辑成功' : '新增成功';
          message.success(msg, 1, this.goBack());
        };

        const error = () => {
          message.error(id ? '编辑失败' : '新增失败');
        };

        if (id) {
          dispatch({
            type: 'fourColorImage/fetchEdit',
            payload,
            success,
            error,
          });
        } else {
          dispatch({
            type: 'fourColorImage/fetchAdd',
            payload,
            success,
            error,
          });
        }
      }
    });
  };

  // 获取地图上的坐标
  getPoints = points => {
    this.setState({ points });
  };

  getBuilding = (buildingId, s) => {
    const { modelIds } = this.state;
    const modeIdList = modelIds.split(',').map(Number);
    const areaList = buildingId.filter(item => item).map((item, index) => ({
      key: index,
      areaId: item.buildingId,
      point: item.points,
      selected: true,
    }));
    if (s === 0) {
      areaList.forEach(element => {
        if (!modeIdList.includes(element.areaId)) {
          element.selected = !element.selected;
        }
      });
      this.setState({ buildingId: areaList });
    } else {
      this.setState({ buildingId: areaList });
    }
  };

  handleTagClick = (areaId, point, selected) => {
    const { points } = this.state;
    this.childMap.handleModelEdit(points, point, selected);
    const { buildingId } = this.state;
    buildingId.forEach(item => {
      if (item.areaId === areaId) {
        item.selected = !item.selected;
      }
    });
    this.setState({
      buildingId: buildingId,
    });
  };

  renderDrawButton = () => {
    const { isDrawing, points } = this.state;
    return (
      <Fragment>
        <Button
          style={{ marginLeft: 40 }}
          onClick={() => {
            if (!!isDrawing && points.length <= 2) return message.error('区域至少三个坐标点！');
            this.setState({ isDrawing: !isDrawing });
          }}
        >
          {!isDrawing ? '开始画' : '结束画'}
        </Button>
        <Button style={{ marginLeft: 10 }} disabled={!!isDrawing} onClick={this.handleReset}>
          重置
        </Button>
      </Fragment>
    );
  };

  render() {
    const {
      perLoading,
      match: {
        params: { id },
      },
      form: { getFieldDecorator },
      account: { list: personList = [] },
    } = this.props;
    const { isDrawing, detailList, pointList, buildingId, modelIds } = this.state;
    const editTitle = id ? '编辑' : '新增';
    console.log('buildingId', buildingId);
    const {
      zoneCode,
      zoneName,
      zoneLevel,
      zoneType,
      zoneCharger,
      zoneChargerName,
      phoneNumber,
      checkCircle,
      createTime,
    } = detailList;
    return (
      <PageHeaderLayout title={title} breadcrumbList={breadcrumbList}>
        <Row>
          <Col span={12}>
            <Card title="地图" bordered={false}>
              {this.renderDrawButton()}
              <Map
                isDrawing={isDrawing}
                onRef={this.onRef}
                getPoints={this.getPoints}
                getBuilding={this.getBuilding}
                pointList={pointList}
                modelIds={modelIds}
              />
            </Card>
          </Col>
          <Col span={12}>
            <Card title={editTitle} bordered={false}>
              <FormItem label="区域编号" {...formItemLayout}>
                {getFieldDecorator('zoneCode', {
                  initialValue: zoneCode,
                  getValueFromEvent: this.handleTrim,
                  rules: [{ required: true, message: '请输入' }],
                })(<Input placeholder="请输入" {...itemStyles} maxLength={10} />)}
              </FormItem>
              <FormItem label="区域名称" {...formItemLayout}>
                {getFieldDecorator('zoneName', {
                  initialValue: zoneName,
                  getValueFromEvent: this.handleTrim,
                  rules: [{ required: true, message: '请输入' }],
                })(<Input placeholder="请输入" {...itemStyles} maxLength={15} />)}
              </FormItem>
              <FormItem label="风险分级" {...formItemLayout}>
                {getFieldDecorator('zoneLevel', {
                  initialValue: zoneLevel ? +zoneLevel : undefined,
                  rules: [{ required: true, message: '请选择' }],
                })(
                  <Select placeholder="请选择" {...itemStyles} allowClear>
                    {['红', '橙', '黄', '蓝'].map((item, index) => (
                      <Select.Option key={index + 1} value={index + 1}>
                        {item}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </FormItem>
              <FormItem label="所属图层" {...formItemLayout}>
                {getFieldDecorator('zoneType', {
                  initialValue: zoneType ? +zoneType : undefined,
                  rules: [{ required: true, message: '请选择' }],
                })(
                  <Select placeholder="请选择" {...itemStyles} allowClear>
                    {['风险四色图'].map((item, index) => (
                      <Select.Option key={index} value={index}>
                        {item}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </FormItem>
              <FormItem label="区域负责人" {...formItemLayout}>
                {getFieldDecorator('zoneCharger', {
                  initialValue: zoneCharger
                    ? { key: zoneCharger, label: zoneChargerName }
                    : undefined,
                  rules: [{ required: true, message: '请选择' }],
                })(
                  <AutoComplete
                    mode="combobox"
                    labelInValue
                    optionLabelProp="children"
                    placeholder="请选择"
                    notFoundContent={perLoading ? <Spin size="small" /> : '暂无数据'}
                    onSearch={this.handlePersonSearch}
                    onBlur={this.handlePersonBlur}
                    onChange={e => this.handlePersonChange(e)}
                    filterOption={false}
                    {...itemStyles}
                  >
                    {personList.map(({ users, userName }) => (
                      <Select.Option
                        key={users.map(item => item.id)[0]}
                        value={users.map(item => item.id)[0]}
                      >
                        {userName}
                      </Select.Option>
                    ))}
                  </AutoComplete>
                )}
              </FormItem>
              <FormItem label="联系电话" {...formItemLayout}>
                {getFieldDecorator('phoneNumber', {
                  initialValue: phoneNumber,
                  getValueFromEvent: this.handleTrim,
                  rules: [
                    { required: true, message: '请选择' },
                    { pattern: phoneReg, message: '联系电话格式不正确' },
                  ],
                })(<Input placeholder="请选择" disabled {...itemStyles} />)}
              </FormItem>
              <FormItem label="复评周期(月)" {...formItemLayout}>
                {getFieldDecorator('checkCircle', {
                  initialValue: checkCircle,
                  getValueFromEvent: this.handleTrim,
                  rules: [{ required: true, message: '请输入' }],
                })(<Input placeholder="请输入" {...itemStyles} maxLength={4} />)}
              </FormItem>
              <FormItem label="开始时间" {...formItemLayout}>
                {getFieldDecorator('createTime', {
                  initialValue: createTime ? moment(+createTime) : undefined,
                  rules: [{ required: true, message: '请选择' }],
                })(<DatePicker placeholder="请选择" format="YYYY-MM-DD" {...itemStyles} />)}
              </FormItem>
              {/* <FormItem label="关联内容" {...formItemLayout}>
                {getFieldDecorator('conetnt', {
                  initialValue: '',
                  getValueFromEvent: this.handleTrim,
                  rules: [{ required: true, message: '请输入' }],
                })(<Input placeholder="请输入" {...itemStyles} />)}
              </FormItem> #555252*/}
              <FormItem label="所选建筑物" {...formItemLayout}>
                {buildingId.map(({ key, areaId, point, selected }) => (
                  <Tag
                    color={!selected ? '' : '#555252'}
                    key={key}
                    onClick={() => this.handleTagClick(areaId, point, selected)}
                  >
                    {areaId}
                  </Tag>
                ))}
              </FormItem>
              <FormItem {...formItemLayout}>
                <div style={{ textAlign: 'center' }}>
                  <Button style={{ marginRight: 10 }} type="primary" onClick={this.handleSubmit}>
                    提交
                  </Button>
                  <Button href={'#/risk-control/four-color-image/list'}>返回</Button>
                </div>
              </FormItem>
            </Card>
          </Col>
        </Row>
      </PageHeaderLayout>
    );
  }
}
