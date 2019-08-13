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

import CompanyModal from '../../BaseInfo/Company/CompanyModal';
import CheckModal from '../../LawEnforcement/Illegal/checkModal';
import styles from './GridPointEdit.less';

const { Option } = Select;
let flow_id = [];
const PageSize = 10;

//  默认分页参数
const defaultPagination = {
  pageNum: 1,
  pageSize: 10,
};

/* 标题---编辑 */
const editTitle = '编辑网格点';
/* 标题---新增 */
const addTitle = '新增网格点';

/* 表单标签 */
const fieldLabels = {
  riskPointName: '监督点名称:',
  bindRFID: '监督点位置:',
  level: '监督点级别:',
  ewm: '二维码：',
  nfc: 'NFC：',
  checkContent: '检查内容',
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
    width: 150,
  },
  {
    title: '绑定的点位',
    dataIndex: 'objectTitles',
    key: 'objectTitles',
    align: 'center',
    width: 200,
    render: val => {
      return val && val.length > 0 ? val.join('、') : '————';
    },
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

@connect(({ illegalDatabase, buildingsInfo, riskPointManage, user, loading }) => ({
  illegalDatabase,
  riskPointManage,
  buildingsInfo,
  user,
  loading: loading.models.riskPointManage,
}))
@Form.create()
export default class GridPointEdit extends PureComponent {
  state = {
    rfidVisible: false, // RFID模态框是否可见
    checkVisible: false, // 检查内容模态框是否可见
    picModalVisible: false, // 定位模态框是否可见
    flowList: [], // 当前检查内容list
    selectedRowKeys: [],
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
        `/risk-control/grid-point-manage/grid-point-List/${companyId}?companyId=${companyId}&&companyName=${companyName}`
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
        type: 'riskPointManage/fetchGridPointDetail',
        payload: {
          id,
        },
        callback: response => {
          const { itemFlowList } = response;

          this.setState({ flowList: itemFlowList });
          flow_id = itemFlowList.map(d => {
            return { flow_id_data: d.flow_id_data, flow_id: d.flow_id };
          });
        },
      });
    } else {
      // 清空详情
      dispatch({
        type: 'riskPointManage/clearGridDetail',
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
      riskPointManage: { checkCycleData },
    } = this.props;

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
          dangerLevel,
        } = values;

        if (+cycleType === 1 && checkCycleData === null) {
          return (
            recommendCycle !== null, message.error('推荐检查周期为空，可以选择自定义检查周期！')
          );
        }

        if (+cycleType === 2 && checkCycle === undefined) {
          return message.error('自定义检查周期不能为空！');
        }

        if (flow_id.length === 0) {
          return message.error('请选择检查内容！');
        }

        const payload = {
          id,
          companyId,
          objectTitle,
          locationCode,
          checkCycle,
          cycleType,
          qrCode,
          nfcCode,
          dangerLevel,
          itemFlowList: flow_id,
        };
        const success = () => {
          const msg = id ? '编辑成功' : '新增成功';
          message.success(msg, 1, this.goBack());
        };
        const error = () => {
          const msg = id ? '修改失败' : '新增失败,一个单位只能有一个监督点';
          message.error(msg, 1);
          this.setState({
            submitting: false,
          });
        };
        // 如果id存在的话，为编辑
        if (id) {
          dispatch({
            type: 'riskPointManage/fetchGridPointEdit',
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
            type: 'riskPointManage/fetchGridPointAdd',
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

    const { checked } = this.state;

    dispatch({
      type: 'riskPointManage/fetchLabelDict',
      payload: {
        itemType: 1,
        noBind: checked === true ? 1 : '',
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
  onChangeCheckBox = e => {
    const {
      dispatch,
      location: {
        query: { companyId },
      },
    } = this.props;
    const isChecked = e.target.checked;
    dispatch({
      type: 'riskPointManage/fetchLabelDict',
      payload: {
        companyId,
        noBind: isChecked === true ? 1 : '',
        pageNum: 1,
        pageSize: 10,
      },
    });
    this.setState({
      checked: isChecked,
    });
  };

  // 渲染模态框(RFID)
  renderRfidModal() {
    const {
      loading,
      riskPointManage: { labelModal },
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
        gridDetail: { data = {} },
        levelList,
      },
    } = this.props;

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
                      rules: [{ required: true, message: '请输入监督点名称' }],
                    })(<Input placeholder="请输入监督点名称" maxLength="30" />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label={fieldLabels.level}>
                    {getFieldDecorator('dangerLevel', {
                      initialValue: data.dangerLevel,
                      rules: [{ message: '请选择监督点级别' }],
                    })(
                      <Select allowClear placeholder="请选择监督点级别">
                        {levelList.map(({ key, value }) => (
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
                <Col span={8}>
                  <Form.Item label={fieldLabels.RecommendCycle}>
                    {getFieldDecorator('recommendCycle', {
                      getValueFromEvent: this.handleTrim,
                      initialValue: getCycleType(checkCycleData),
                      rules: [
                        {
                          message: '推荐检查周期',
                        },
                      ],
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
                      rules: [{ required: true, message: '请选择监督点位置' }],
                    })(<Input placeholder="请选择监督点位置" disabled />)}
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
      {
        title: '企业网格点管理',
        name: '企业网格点管理',
        href: '/risk-control/grid-point-manage/index',
      },
      {
        title: '单位网格点',
        name: '单位网格点',
        href: `/risk-control/grid-point-manage/grid-point-List/${companyId}?companyId=${companyId}&&companyName=${companyName}`,
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
