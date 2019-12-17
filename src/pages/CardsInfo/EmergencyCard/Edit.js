import React, { PureComponent } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Button, Card, Form, Input, Modal, Select, Table, message } from 'antd';

import ToolBar from '@/components/ToolBar';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import { renderSections } from '@/pages/SafetyKnowledgeBase/MSDS/utils';
import { BREADCRUMBLIST, LIST_URL, handleEquipmentValues } from './utils';
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

@connect(({ user, cardsInfo, loading }) => ({
  user,
  cardsInfo,
  loading: loading.models.cardsInfo,
}))
@Form.create()
export default class Edit extends PureComponent {
  state = {
    current: 1,
    modalVisible: false,
    selectedCard: undefined,
  };

  componentDidMount() {
    const {
      dispatch,
      match: { params: { id } },
      form: { setFieldsValue },
      user: { currentUser: { unitType, companyId, companyName } },
    } = this.props;
    if (id)
      this.getDetail(id);
    else if (isCompanyUser(+unitType))
      setFieldsValue({ companyId: { key: companyId, label: companyName } });
    dispatch({ type: 'cardsInfo/fetchRiskTypes' });
  }

  values = {};

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
      },
    });
  };

  handleSubmit = e => {
    const {
      dispatch,
      form: { validateFields },
      match: { params: { id } },
    } = this.props;

    e.preventDefault();
    validateFields((errors, values) => {
      if (errors)
        return;

      const vals = { ...values, companyId: values.companyId.key, time: +values.time };
      dispatch({
        type: `cardsInfo/${id ? 'edit' : 'add'}EmergencyCard`,
        payload: id ? { id, ...vals } : vals,
        callback: (code, msg) => {
          if (code === 200) {
            message.success('操作成功');
            router.push(LIST_URL);
          } else
            message.error(msg);
        },
      });
    });
  };

  isDetail = () => {
    const { match: { url } } = this.props;
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

    if (!pageNum) { // pageNum不传，则为初始化
      pageNum = 1;
      this.setState({ current: 1 });
    }

    this.setState({ selectedCard: undefined });
    const companyId = getFieldValue('companyId');
    if (!this.values.letterName)
      delete this.values.letterName;
    companyId && companyId.key && dispatch({
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
    const { form: { setFieldsValue } } = this.props;
    const { selectedCard } = this.state;
    this.hideModal();
    setFieldsValue(handleEquipmentValues(selectedCard));
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
            {riskTypes.map(({ value, desc }) => <Option value={value} key={value}>{desc}</Option>)}
          </Select>
        ),
      },
    ];

    const toolBarAction = (
      <Button type="primary" disabled={!selectedCard} onClick={this.handleConfirm} style={{ marginTop: '8px' }}>
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

  render() {
    const {
      loading,
      match: { params: { id } },
      form: { getFieldDecorator },
      user: { currentUser: { unitType } },
    } = this.props;

    const isDet = this.isDetail();
    const title = isDet ? '详情' : id ? '编辑' : '新增';
    const breadcrumbList = Array.from(BREADCRUMBLIST);
    breadcrumbList.push({ title, name: title });
    const handleSubmit = isDet ? null : this.handleSubmit;

    // const selectButton = (
    //   <Search
    //     // disabled={isDet ? true : loading}
    //     disabled
    //     placeholder="请选择作业/设备名称"
    //     enterButton={<Button type="primary" onClick={this.showModal}>选择</Button>}
    //     // onSearch={this.showModal}
    //   />
    // );
    const selectButton = (
      <div className={styles.container}>
        <Input
          disabled
          placeholder="请选择作业/设备名称"
          addonAfter={<Button type="primary" disabled={isDet ? true : loading} onClick={this.showModal}>选择</Button>}
        />
      </div>
    );

    const formItems = [
      { name: 'companyId', label: '单位名称', type: 'companyselect', disabled: isCompanyUser(+unitType) },
      { name: 'name', label: '应急卡名称' },
      { name: 'equipmentName', label: '作业/设备名称', type: 'compt', component: selectButton },
      { name: 'riskWarning', label: '风险提示', type: 'text' },
      { name: 'emergency', label: '应急处置方法', type: 'text' },
      { name: 'needAttention', label: '注意事项', type: 'text' },
      { name: 'emergency1', label: '应急联系方式-内部', type: 'component', component: '' },
      { name: 'safetyNum', label: '安全负责人' },
      { name: 'telNum', label: '联系方式' },
      { name: 'emergency2', label: '应急联系方式-外部', type: 'component', component: '' },
      { name: 'fire', label: '火警', type: 'component', component: '119' },
      { name: 'rescue', label: '医疗救护', type: 'component', component: '120' },
      { name: 'section', label: '风险分区', type: 'select', required: false },
    ];

    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
      >
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
