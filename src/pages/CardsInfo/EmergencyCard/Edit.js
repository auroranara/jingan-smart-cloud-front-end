import React, { PureComponent } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Button, Card, Form, Input, Modal, Select, Table, message } from 'antd';

import ToolBar from '@/components/ToolBar';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import { renderSections } from '@/pages/SafetyKnowledgeBase/MSDS/utils';
import {
  BREADCRUMBLIST,
  LIST_URL,
  handleEquipmentValues,
  handleEquipmentOtherValues,
} from './utils';
import { handleDetails } from '../CommitmentCard/utils';
import { isCompanyUser } from '@/pages/RoleAuthorization/Role/utils';
import styles from './TableList.less';

// const { Search } = Input;
const { Option } = Select;

const TABLE_PAGE_SIZE = 10;
const COLUMNS = [
  {
    title: '告知卡名称',
    dataIndex: 'letterName',
    align: 'center',
  },
  {
    title: '场所/环节/部位',
    dataIndex: 'areaName',
    align: 'center',
  },
  {
    title: '风险分类',
    dataIndex: 'riskTypeName',
    align: 'center',
  },
  {
    title: '易导致的事故类型',
    dataIndex: 'accidentTypeName',
    align: 'center',
  },
];

@connect(({ user, cardsInfo, riskPointManage, fourColorImage, loading }) => ({
  user,
  cardsInfo,
  fourColorImage,
  riskPointManage,
  loading: loading.models.cardsInfo,
}))
@Form.create()
export default class Edit extends PureComponent {
  state = {
    current: 1,
    modalVisible: false,
    selectedCard: undefined,
    selectedUnitId: '',
  };

  componentDidMount() {
    const {
      dispatch,
      match: {
        params: { id },
      },
      form: { setFieldsValue },
      user: {
        currentUser: { unitType, companyId, companyName },
      },
    } = this.props;
    if (id) this.getDetail(id);
    else if (isCompanyUser(+unitType)) {
      this.fetchRiskList({ companyId: companyId });
      setFieldsValue({ companyId: { key: companyId, label: companyName } });
    }
    dispatch({ type: 'cardsInfo/fetchRiskTypes' });
  }

  values = {};

  // 获取风险分区列表
  fetchRiskList = (params, callback) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'fourColorImage/fetchList',
      payload: {
        ...params,
        pageNum: 1,
        pageSize: 24,
      },
      callback,
    });
  };

  getDetail = id => {
    const {
      dispatch,
      form: { setFieldsValue },
    } = this.props;
    dispatch({
      type: 'cardsInfo/getEmergencyCard',
      payload: id,
      callback: detail => {
        setFieldsValue(handleDetails(detail));
        this.fetchRiskList({ companyId: detail.companyId });
      },
    });
  };

  handleSubmit = e => {
    const {
      dispatch,
      form: { validateFields },
      match: {
        params: { id },
      },
    } = this.props;

    e.preventDefault();

    validateFields((errors, values) => {
      if (errors) return;
      const vals = {
        ...values,
        companyId: values.companyId.key,
        pointFixInfoList: [{ areaId: values.section, imgType: 5 }],
      };
      dispatch({
        type: `cardsInfo/${id ? 'edit' : 'add'}EmergencyCard`,
        payload: id ? { id, ...vals } : vals,
        callback: (code, msg) => {
          if (code === 200) {
            message.success('操作成功');
            router.push(LIST_URL);
          } else message.error(msg);
        },
      });
    });
  };

  isDetail = () => {
    const {
      match: { url },
    } = this.props;
    return url && url.includes('view');
  };

  showModal = e => {
    this.handleReset();
    this.setState({ modalVisible: true });
  };

  hideModal = e => {
    this.setState({ modalVisible: false });
  };

  getInformList = pageNum => {
    const {
      dispatch,
      form: { getFieldValue },
    } = this.props;

    if (!pageNum) {
      // pageNum不传，则为初始化
      pageNum = 1;
      this.setState({ current: 1 });
    }

    this.setState({ selectedCard: undefined });
    const companyId = getFieldValue('companyId');
    if (!this.values.letterName) delete this.values.letterName;
    companyId &&
      companyId.key &&
      dispatch({
        type: 'cardsInfo/fetchInformCards',
        payload: { pageNum, pageSize: TABLE_PAGE_SIZE, companyId: companyId.key, ...this.values },
      });
  };

  handleSearch = values => {
    this.values = values;
    this.getInformList();
  };

  handleReset = () => {
    this.values = {};
    this.getInformList();
  };

  handleConfirm = () => {
    const {
      dispatch,
      form: { setFieldsValue },
    } = this.props;
    const { selectedCard } = this.state;
    this.hideModal();
    setFieldsValue(handleEquipmentValues(selectedCard));
    dispatch({
      type: 'riskPointManage/fetchShowLetter',
      payload: {
        id: selectedCard.id,
      },
      callback: res => {
        const { headOfSecurity, headOfSecurityPhone } = res.companyInfo;
        setFieldsValue(handleEquipmentOtherValues(headOfSecurity, headOfSecurityPhone));
      },
    });
  };

  onTableChange = (pagination, filters, sorter) => {
    const { current } = pagination;
    this.setState({ current });
    this.getInformList(current);
  };

  handleSelectedRowKeysChange = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedCard: selectedRows[0] });
  };

  renderModal = () => {
    const {
      loading,
      cardsInfo: { informTotal, informCards: list, riskTypes },
    } = this.props;
    const { current, modalVisible, selectedCard } = this.state;

    const fields = [
      {
        id: 'letterName',
        label: '告知卡名称',
        render: () => <Input placeholder="请输入告知卡名称" allowClear />,
        transform: v => v.trim(),
      },
      {
        id: 'riskType',
        label: '风险分类',
        render: () => (
          <Select placeholder="请选择风险分类" allowClear>
            {riskTypes.map(({ value, desc }) => (
              <Option value={value} key={value}>
                {desc}
              </Option>
            ))}
          </Select>
        ),
      },
    ];

    const toolBarAction = (
      <Button
        type="primary"
        disabled={!selectedCard}
        onClick={this.handleConfirm}
        style={{ marginTop: '8px' }}
      >
        选择
      </Button>
    );

    return (
      <Modal
        title="选择作业活动/设备设施"
        width="50%"
        // zIndex={1009}
        visible={modalVisible}
        footer={null}
        onCancel={this.hideModal}
      >
        <ToolBar
          fields={fields}
          action={toolBarAction}
          onSearch={this.handleSearch}
          onReset={this.handleReset}
          buttonStyle={{ textAlign: 'right' }}
          buttonSpan={{ xl: 8, sm: 12, xs: 24 }}
        />
        <Table
          dataSource={list}
          columns={COLUMNS}
          rowKey="id"
          loading={loading}
          onChange={this.onTableChange}
          pagination={{ pageSize: TABLE_PAGE_SIZE, total: informTotal, current }}
          rowSelection={{
            type: 'radio',
            selectedRowKeys: selectedCard ? [selectedCard.id] : [],
            onChange: this.handleSelectedRowKeysChange,
          }}
        />
      </Modal>
    );
  };

  onSelectChange = e => {
    const {
      form: { setFieldsValue },
    } = this.props;
    setFieldsValue({ section: undefined });
    this.fetchRiskList({ companyId: e.key });
  };

  render() {
    const {
      loading,
      match: {
        params: { id },
      },
      form: { getFieldDecorator },
      user: {
        currentUser: { unitType },
      },
      fourColorImage: {
        data: { list = [] },
      },
    } = this.props;

    const newRiskList = list.map(({ zoneName, id }) => ({ key: id, value: zoneName }));

    const isDet = this.isDetail();
    const title = isDet ? '详情' : id ? '编辑' : '新增';
    const breadcrumbList = Array.from(BREADCRUMBLIST);
    breadcrumbList.push({ title, name: title });
    const handleSubmit = isDet ? null : this.handleSubmit;
    const isComUser = isCompanyUser(+unitType);

    const selectButton = (
      <Input
        disabled
        placeholder="请选择作业/设备名称"
        addonAfter={
          <Button type="primary" disabled={isDet ? true : loading} onClick={this.showModal}>
            选择
          </Button>
        }
      />
    );

    const formItems = [
      {
        name: 'companyId',
        label: '单位名称',
        type: 'companyselect',
        disabled: isComUser,
        wrapperClassName: isComUser ? styles.disappear : undefined,
        onSelectChange: e => this.onSelectChange(e),
      },
      { name: 'name', label: '应急卡名称' },
      {
        name: 'equipmentName',
        label: '作业/设备名称',
        type: 'compt',
        component: selectButton,
        wrapperClassName: styles.container,
      },
      { name: 'riskWarning', label: '风险提示', type: 'text' },
      { name: 'emergency', label: '应急处置方法', type: 'text' },
      { name: 'needAttention', label: '注意事项', type: 'text' },
      { name: 'emergency1', label: '应急联系方式-内部', type: 'component', component: '' },
      { name: 'safetyNum', label: '安全负责人' },
      { name: 'telNum', label: '联系方式' },
      { name: 'emergency2', label: '应急联系方式-外部', type: 'component', component: '' },
      { name: 'fire', label: '火警', type: 'component', component: '119' },
      { name: 'rescue', label: '医疗救护', type: 'component', component: '120' },
      {
        name: 'section',
        label: '风险分区',
        type: 'select',
        options: newRiskList,
      },
      {
        name: 'meg',
        label: '提示',
        type: 'component',
        component: (
          <div>
            如果没有做区域划分，请先到
            <a href="#/risk-control/four-color-image/list">风险分区</a>
            中划分区域
          </div>
        ),
      },
    ];

    return (
      <PageHeaderLayout title={title} breadcrumbList={breadcrumbList}>
        <Card style={{ marginBottom: 15 }}>
          {renderSections(formItems, getFieldDecorator, handleSubmit, LIST_URL, loading)}
          {isDet ? (
            <Button
              type="primary"
              style={{ marginLeft: '45%' }}
              onClick={e => router.push(`/cards-info/emergency-card/edit/${id}`)}
            >
              编辑
            </Button>
          ) : null}
        </Card>
        {this.renderModal()}
      </PageHeaderLayout>
    );
  }
}
