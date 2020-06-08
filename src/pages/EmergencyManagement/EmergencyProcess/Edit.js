import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import moment from 'moment';
import { getToken } from 'utils/authority';
import { Form, Icon as LegacyIcon } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Card, message, Upload, Button, Input, Cascader } from 'antd';
import CompanyModal from '@/pages/BaseInfo/Company/CompanyModal';
import { getFileList, getImageSize } from '@/pages/BaseInfo/utils';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import { renderSections } from '@/pages/SafetyKnowledgeBase/MSDS/utils';
import { BREADCRUMBLIST, LIST, LIST_URL } from './utils';

// 上传文件地址
const uploadAction = '/acloud_new/v2/uploadFile';
// 上传文件夹
const folder = 'emergency';
const defaultUploadProps = {
  name: 'files',
  data: { folder },
  multiple: true,
  action: uploadAction,
  headers: { 'JA-Token': getToken() },
};
/* root下的div */
const getRootChild = () => document.querySelector('#root>div');

const drillFields = [
  {
    id: 'planCode',
    render() {
      return <Input placeholder="演练编号" />;
    },
    transform(value) {
      return value.trim();
    },
  },
  {
    id: 'planName',
    render() {
      return <Input placeholder="演练名称" />;
    },
    transform(value) {
      return value.trim();
    },
  },
];

@connect(({ loading, company, emergencyManagement, user }) => ({
  company,
  emergencyManagement,
  companyLoading: loading.effects['company/fetchModelList'],
  drillLoading: loading.effects['emergencyManagement/fetchDrillList'],
  materialsLoading: loading.effects['materials/fetchMaterialsList'],
  user,
}))
@Form.create()
export default class Edit extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      compayModalVisible: false,
      selectedCompany: {},
      drillModalVisible: false,
      selectedDrill: {},
      fileList: [],
    };
  }

  componentDidMount() {
    const {
      match: {
        params: { id },
      },
      user: {
        currentUser: { unitType, companyId },
      },
      form: { setFieldsValue },
    } = this.props;
    if (unitType === 4) setFieldsValue({ companyId });
    this.fetchDict({ type: 'simAccidentType' });
    this.fetchDict({ type: 'emergencyDrill' });
    id && this.getDetail();
  }

  getDetail = () => {
    const {
      dispatch,
      form: { setFieldsValue },
      match: {
        params: { id },
      },
    } = this.props;
    dispatch({
      type: 'emergencyManagement/fetchProcessList',
      payload: { id, pageNum: 1, pageSize: 10 },
      callback: response => {
        const {
          data: {
            list: [
              {
                companyId,
                planName, //方案名称
                accidName, //事故名称
                accidType, //事故类型
                startTime, //演练开始时间
                endTime, //演练结束时间
                place, //演练地点
                treatOrg, //演练机构
                treatMem, //演练人员
                treatment, //演练过程描述
                treatName, //演练名称 (存id)
                projectName, //演练名称(存名字)
                treatType, //演练类型
                companyName,
                treatmentList,
              },
            ],
          },
        } = response;
        const accidentIds = accidType.split(',');
        setFieldsValue({
          companyId,
          planName, //方案名称
          accidName, //事故名称
          accidType: accidentIds, //事故类型
          // startTime: moment(startTime),//演练开始时间
          // endTime: moment(endTime),//演练结束时间
          drillTime: [moment(startTime), moment(endTime)],
          place, //演练地点
          treatOrg, //演练机构
          treatMem, //演练人员
          treatment, //演练过程描述
          treatName, //演练名称 (存id)
          projectName, //演练名称(存名字)
          treatType, //演练类型
        });
        this.setState({
          selectedCompany: { id: companyId, name: companyName },
          selectedDrill: { id: treatName, planName: projectName, planType: treatType },
          fileList: treatmentList.map(({ id, dbUrl, webUrl, fileName }, index) => ({
            uid: id || index,
            fileName,
            status: 'done',
            name: fileName,
            url: webUrl,
            dbUrl,
          })),
        });
      },
    });
  };

  fetchDict = (payload, success, error) => {
    const { dispatch } = this.props;
    dispatch({ type: 'emergencyManagement/fetchDicts', payload, success, error });
  };

  fetchCompany = ({ payload }) => {
    const { dispatch } = this.props;
    dispatch({ type: 'company/fetchModelList', payload });
  };

  handleSelectCompany = selectedCompany => {
    const {
      form: { setFieldsValue },
    } = this.props;
    this.setState({ selectedCompany, companyModalVisible: false, selectedDrill: {} });
    // setFieldsValue({ companyId: selectedCompany.id });
    setTimeout(() => setFieldsValue({ companyId: selectedCompany.id, treatName: undefined }), 0.3);
  };

  handleViewCompanyModal = () => {
    this.setState({ companyModalVisible: true });
    this.fetchCompany({
      payload: {
        pageSize: 10,
        pageNum: 1,
      },
    });
  };

  fetchDrill = ({ payload }) => {
    const { dispatch } = this.props;
    const { selectedCompany } = this.state;
    dispatch({
      type: 'emergencyManagement/fetchDrillList',
      payload: { ...payload, companyId: selectedCompany.id },
    });
  };

  handleSelectDrill = selectedDrill => {
    const {
      form: { setFieldsValue },
    } = this.props;
    this.setState({ selectedDrill, drillModalVisible: false });
    setFieldsValue({
      treatName: selectedDrill.id,
      place: selectedDrill.planLocation,
      treatType: selectedDrill.planType,
    });
  };

  handleViewDrillModal = () => {
    this.setState({ drillModalVisible: true });
    this.fetchDrill({
      payload: {
        pageSize: 10,
        pageNum: 1,
      },
    });
  };

  isDetail = () => {
    const {
      match: { url },
    } = this.props;
    return url && url.includes('view');
  };

  handleSubmit = e => {
    const {
      dispatch,
      form: { validateFields, setFields },
      match: {
        params: { id },
      },
      user: {
        currentUser: { unitType, companyId },
      },
    } = this.props;
    const { selectedDrill, fileList } = this.state;

    e.preventDefault();
    validateFields((errors, formData) => {
      if (!errors) {
        if (!fileList.length) {
          setFields({
            treatment: { value: undefined, errors: [new Error('请上传演练过程描述')] },
          });
          return;
        }
        const {
          drillTime: [startTime, endTime],
        } = formData;
        const payload = {
          ...formData,
          companyId: unitType === 4 ? companyId : formData.companyId,
          accidType: formData.accidType.join(','),
          startTime: startTime.valueOf(),
          endTime: endTime.valueOf(),
          projectName: selectedDrill.planName,
          treatment: JSON.stringify(
            fileList.map(({ name, url, dbUrl }) => ({
              fileName: name,
              webUrl: url,
              dbUrl,
              name,
            }))
          ),
        };
        console.log('payload', payload);
        console.log('JSON.stringify(payload)', JSON.stringify(payload));
        // return;
        const success = () => {
          message.success(id ? '编辑成功！' : '新增成功！');
          router.push(LIST_URL);
        };
        const error = () => {
          message.error(id ? '编辑失败' : '新增失败！');
        };
        if (id) {
          dispatch({
            type: 'emergencyManagement/editProcess',
            payload: { ...payload, id },
            success,
            error,
          });
        } else {
          dispatch({
            type: 'emergencyManagement/addProcess',
            payload,
            success,
            error,
          });
        }
      }
    });
  };

  /* 模拟事故类型动态加载 */
  handleLoadData = selectedOptions => {
    console.log('selectedOptions', selectedOptions);
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    this.fetchDict(
      {
        type: 'simAccidentType',
        parentId: targetOption.id,
        append: true,
      },
      data => {
        targetOption.loading = false;
        targetOption.children = data;
      },
      msg => {
        message.error(msg, () => {
          targetOption.loading = false;
        });
      }
    );
  };

  handleFileChange = ({ fileList, file }) => {
    if (file.status === 'done') {
      let fList = [...fileList];
      if (file.response.code === 200) {
        // if (fList.length > 1) fList.splice(0, 1);
        message.success('上传成功');
      } else {
        message.error('上传失败');
        fList.splice(-1, 1);
      }
      fList = getFileList(fList);
      this.setState({ fileList: fList, uploading: false });
    } else {
      if (file.status === 'uploading') this.setState({ uploading: true });
      // 其他情况，直接用原文件数组
      fileList = getFileList(fileList);
      this.setState({ fileList });
    }
    return fileList;
  };

  render() {
    const {
      companyLoading,
      drillLoading,
      company: { companyModal },
      match: {
        params: { id },
      },
      form: { getFieldDecorator },
      emergencyManagement: { drill: drillModal, simAccidentType = [], emergencyDrill = [] },
      user: {
        currentUser: { unitType },
      },
    } = this.props;
    const {
      companyModalVisible,
      selectedCompany,
      drillModalVisible,
      selectedDrill,
      fileList,
    } = this.state;

    const isDet = this.isDetail();
    const title = isDet ? '详情' : id ? '编辑' : '新增';
    const breadcrumbList = Array.from(BREADCRUMBLIST);
    breadcrumbList.push({ title, name: title });
    const handleSubmit = isDet ? null : this.handleSubmit;

    let treeData = emergencyDrill;
    const planType = selectedDrill.planType
      ? selectedDrill.planType
          .split(',')
          .map(id => {
            const val = treeData.find(item => item.id === id) || {};
            treeData = val.children || [];
            return val.label;
          })
          .join('/')
      : '';

    const drillColumns = [
      {
        title: '演练编号',
        dataIndex: 'planCode',
        key: 'planCode',
      },
      {
        title: '演练名称',
        dataIndex: 'planName',
        key: 'planName',
      },
      {
        title: '演练类型',
        dataIndex: 'planType',
        key: 'planType',
        render: data => {
          let treeData = emergencyDrill;
          const planType = data
            .split(',')
            .map(id => {
              const val = treeData.find(item => item.id === id) || {};
              treeData = val.children || [];
              return val.label;
            })
            .join('/');
          return planType;
        },
      },
      {
        title: '演练地点',
        dataIndex: 'planLocation',
        key: 'planLocation',
      },
    ];

    const EDIT_FORMITEMS = [
      // modify
      {
        name: 'companyId',
        label: '单位名称',
        type: 'component',
        component: getFieldDecorator('companyId', {
          rules: [{ required: true, message: '请选择单位名称' }],
        })(
          <Fragment>
            <Input
              style={{ width: 'calc(100% - 98px)', marginRight: '10px' }}
              disabled
              value={selectedCompany.name}
              placeholder="请选择单位名称"
            />
            <Button type="primary" onClick={this.handleViewCompanyModal}>
              选择单位
            </Button>
          </Fragment>
        ),
      },
      { name: 'planName', label: '方案名称' },
      {
        name: 'treatName',
        label: '演练名称',
        type: 'component',
        component: getFieldDecorator('treatName', {
          rules: [{ required: true, message: '请选择应急演练' }],
        })(
          <Fragment>
            <Input
              style={{ width: 'calc(100% - 74px)', marginRight: '10px' }}
              disabled
              value={selectedDrill.planName}
              placeholder="请选择应急演练"
            />
            <Button type="primary" onClick={this.handleViewDrillModal}>
              选择
            </Button>
          </Fragment>
        ),
      },
      {
        name: 'treatType',
        label: '演练类型',
        type: 'component',
        component: getFieldDecorator('treatType', {
          // rules: [{ required: true, message: '请选择单位名称' }],
        })(<span>{planType}</span>),
      },
      { name: 'drillTime', label: '演练起止日期', type: 'rangepicker' },
      { name: 'place', label: '演练地点' },
      { name: 'accidName', label: '事故名称' },
      {
        name: 'accidType',
        label: '模拟事故类型',
        type: 'component',
        component: getFieldDecorator('accidType', {
          rules: [{ required: true, message: '请选择模拟事故类型' }],
        })(
          <Cascader
            options={simAccidentType}
            fieldNames={{
              value: 'id',
              label: 'label',
              children: 'children',
              isLeaf: 'isLeaf',
            }}
            // loadData={selectedOptions => {
            //   this.handleLoadData(selectedOptions);
            // }}
            changeOnSelect
            placeholder="请选择模拟事故类型"
            allowClear
            getPopupContainer={getRootChild}
          />
        ),
      },
      { name: 'treatOrg', label: '演练机构', type: 'text' },
      { name: 'treatMem', label: '演练人员', type: 'text' },
      {
        name: 'treatment',
        label: '演练过程描述',
        type: 'component',
        component: getFieldDecorator('treatment', {
          rules: [{ required: true, message: '请上传演练过程描述' }],
        })(
          <Upload {...defaultUploadProps} fileList={fileList} onChange={this.handleFileChange}>
            <Button type="dashed" style={{ width: '96px', height: '96px' }}>
              <LegacyIcon type="plus" style={{ fontSize: '32px' }} />
              <div style={{ marginTop: '8px' }}>点击上传</div>
            </Button>
          </Upload>
        ),
      },
    ];

    return (
      <PageHeaderLayout title={title} breadcrumbList={breadcrumbList}>
        <Card style={{ marginBottom: 15 }}>
          {renderSections(
            unitType === 4 ? EDIT_FORMITEMS.slice(1, EDIT_FORMITEMS.length) : EDIT_FORMITEMS,
            getFieldDecorator,
            handleSubmit,
            LIST_URL
          )}
        </Card>
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
        {/* 选择应急演练 */}
        <CompanyModal
          title="选择应急演练"
          columns={drillColumns}
          field={drillFields}
          butonStyles={{ width: 'auto' }}
          loading={drillLoading}
          visible={drillModalVisible}
          modal={drillModal}
          fetch={this.fetchDrill}
          onSelect={this.handleSelectDrill}
          onClose={() => {
            this.setState({ drillModalVisible: false });
          }}
        />
      </PageHeaderLayout>
    );
  }
}
