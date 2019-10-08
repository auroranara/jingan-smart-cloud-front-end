import { PureComponent, Fragment } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  Radio,
  Row,
  message,
  DatePicker,
  Upload,
  Icon,
  Cascader,
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import router from 'umi/router';
import CompanyModal from '@/pages/BaseInfo/Company/CompanyModal';
import { getToken } from 'utils/authority';
import { getFileList, getImageSize } from '../../../BaseInfo/utils';
import styles from './index.less';

const FormItem = Form.Item;
const { TextArea } = Input;
/* root下的div */
const getRootChild = () => document.querySelector('#root>div');
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};
const listUrl = '/emergency-management/emergency-estimate/list';

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

const itemStyles = { style: { width: '70%', marginRight: '10px' } };

const drillColumns = [
  {
    title: '计划名称',
    dataIndex: 'projectName',
    key: 'projectName',
  },
  {
    title: '演练名称',
    dataIndex: 'planName',
    key: 'planName',
  },
  {
    title: '演练编号',
    dataIndex: 'planCode',
    key: 'planCode',
  },
];
const drillFields = [
  {
    id: 'projectName',
    render() {
      return <Input placeholder="计划名称" />;
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
  {
    id: 'planCode',
    render() {
      return <Input placeholder="演练编号" />;
    },
    transform(value) {
      return value.trim();
    },
  },
];

@Form.create()
@connect(({ emergencyManagement, company, loading }) => ({
  emergencyManagement,
  company,
  companyLoading: loading.effects['company/fetchModelList'],
}))
export default class EmergencyEstimateHandler extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      fileList: [],
      uploading: false,
      submitting: false,
      // 选择企业弹窗
      compayModalVisible: false,
      // 选中的企业
      selectedCompany: {},
      drillModalVisible: false,
      selectedDrill: {},
    };
  }

  componentDidMount() {
    const {
      dispatch,
      match: {
        params: { id },
      },
      form: { setFieldsValue },
    } = this.props;
    // 如果编辑
    if (id) {
      // 获取详情
      dispatch({
        type: 'emergencyManagement/fetchEstimateDetail',
        payload: { id },
        callback: response => {
          const {
            companyId,
            companyName,
            assessId,
            assessName,
            assessUnit,
            assessDate,
            assessMem,
            realizatin,
            orgProcess,
            conclusion,
            drillReportList,
          } = response.data;
          setFieldsValue({
            companyId,
            assessDate: moment(+assessDate),
            assessId,
            assessUnit,
            assessMem,
            realizatin,
            orgProcess,
            conclusion,
            drillReport: JSON.stringify(drillReportList),
          });
          this.setState({
            selectedCompany: { id: companyId, name: companyName },
            selectedDrill: { id: assessId, projectName: assessName },
            fileList: drillReportList.map(({ id, dbUrl, webUrl, fileName }, index) => ({
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
    }
  }

  /**
   * 获取企业列表（弹窗）
   */
  fetchCompany = ({ payload }) => {
    const { dispatch } = this.props;
    dispatch({ type: 'company/fetchModelList', payload });
  };

  fetchDrill = ({ payload }) => {
    const {
      form: { getFieldValue },
    } = this.props;
    const { dispatch } = this.props;
    dispatch({
      type: 'emergencyManagement/fetchDrillList',
      payload: {
        ...payload,
        // companyId: getFieldValue('companyId'),
      },
    });
  };

  handleSubmit = () => {
    const {
      dispatch,
      form: { validateFields },
      match: {
        params: { id },
      },
    } = this.props;
    const { fileList } = this.state;

    validateFields((error, formData) => {
      if (!error) {
        const payload = {
          ...formData,
          drillReport: JSON.stringify(
            fileList.map(({ name, url, dbUrl }) => ({
              fileName: name,
              webUrl: url,
              dbUrl,
              name,
            }))
          ),
        };
        const success = () => {
          message.success(id ? '编辑成功！' : '新增成功！');
          router.push(listUrl);
        };
        const error = () => {
          message.error(id ? '编辑失败' : '新增失败！');
        };
        if (id) {
          dispatch({
            type: 'emergencyManagement/editEstimate',
            payload: { ...payload, id },
            success,
            error,
          });
        } else {
          dispatch({
            type: 'emergencyManagement/addEstimate',
            payload,
            success,
            error,
          });
        }
      }
    });
  };

  /**
   * 选择企业
   */
  handleSelectCompany = selectedCompany => {
    const {
      form: { setFieldsValue },
    } = this.props;
    this.setState({ selectedCompany, companyModalVisible: false });
    setFieldsValue({ companyId: selectedCompany.id });
  };

  handleSelectDrill = selectedDrill => {
    const {
      form: { setFieldsValue },
    } = this.props;
    this.setState({ selectedDrill, drillModalVisible: false });
    setFieldsValue({ assessId: selectedDrill.id });
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

  handleViewDrillModal = () => {
    this.setState({ drillModalVisible: true });
    this.fetchDrill({
      payload: {
        pageSize: 10,
        pageNum: 1,
      },
    });
  };

  handleImgChange = ({ fileList, file }) => {
    if (file.status === 'done') {
      let fList = [...fileList];
      if (file.response.code === 200) {
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

  /**
   * 渲染表单
   */
  renderForm = () => {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { selectedCompany, uploading, fileList, selectedDrill } = this.state;

    return (
      <Card>
        <Form>
          <FormItem label="单位名称" {...formItemLayout}>
            {getFieldDecorator('companyId', {
              rules: [{ required: true, message: '请选择单位名称' }],
            })(
              <Fragment>
                <Input
                  {...itemStyles}
                  disabled
                  value={selectedCompany.name}
                  placeholder="请选择单位名称"
                />
                <Button type="primary" onClick={this.handleViewCompanyModal}>
                  选择单位
                </Button>
              </Fragment>
            )}
          </FormItem>
          <FormItem label="演练计划名称" {...formItemLayout}>
            {getFieldDecorator('assessId', {
              rules: [{ required: true, message: '请选择演练计划名称' }],
              getValueFromEvent: e => e.target.value.trim(),
            })(
              <Fragment>
                <Input
                  {...itemStyles}
                  disabled
                  value={selectedDrill.projectName}
                  placeholder="请选择演练计划名称"
                />
                <Button type="primary" onClick={this.handleViewDrillModal}>
                  选择
                </Button>
              </Fragment>
            )}
          </FormItem>
          <FormItem label="评估单位" {...formItemLayout}>
            {getFieldDecorator('assessUnit', {
              rules: [{ required: true, message: '请输入评估单位' }],
              getValueFromEvent: e => e.target.value.trim(),
            })(<Input placeholder="请输入评估单位" {...itemStyles} />)}
          </FormItem>
          <FormItem label="评估日期" {...formItemLayout}>
            {getFieldDecorator('assessDate', {
              rules: [{ required: true, message: '请输入评估日期' }],
            })(
              <DatePicker
                placeholder="请选择评估日期"
                getCalendarContainer={getRootChild}
                {...itemStyles}
              />
            )}
          </FormItem>
          <FormItem label="演练人员" {...formItemLayout}>
            {getFieldDecorator('assessMem', {
              rules: [{ required: true, message: '请输入演练人员' }],
            })(<TextArea rows={4} placeholder="请输入演练人员" maxLength="500" {...itemStyles} />)}
          </FormItem>
          <FormItem label="演练目标实现" {...formItemLayout}>
            {getFieldDecorator('realizatin', {
              rules: [{ required: true, message: '请输入演练目标实现' }],
            })(
              <TextArea rows={4} placeholder="请输入演练目标实现" maxLength="500" {...itemStyles} />
            )}
          </FormItem>
          <FormItem label="演练组织情况" {...formItemLayout}>
            {getFieldDecorator('orgProcess', {
              rules: [{ required: true, message: '请输入演练组织情况' }],
            })(
              <TextArea rows={4} placeholder="请输入演练组织情况" maxLength="500" {...itemStyles} />
            )}
          </FormItem>
          <FormItem label="评估总结" {...formItemLayout}>
            {getFieldDecorator('conclusion', {
              rules: [{ required: true, message: '请输入评估总结' }],
            })(<TextArea rows={4} placeholder="请输入评估总结" maxLength="500" {...itemStyles} />)}
          </FormItem>

          <FormItem label="演练评估报告" {...formItemLayout}>
            {getFieldDecorator('drillReport', {
              // rules: [{ required: true, message: '请上传演练评估报告' }],
            })(
              <Upload
                {...defaultUploadProps}
                fileList={fileList}
                onChange={this.handleImgChange}
                disabled={uploading}
              >
                <Button type="dashed" style={{ width: '96px', height: '96px' }}>
                  <Icon type="plus" style={{ fontSize: '32px' }} />
                  <div style={{ marginTop: '8px' }}>点击上传</div>
                </Button>
              </Upload>
            )}
          </FormItem>
        </Form>
        <Row style={{ textAlign: 'center', marginTop: '24px' }}>
          <Button type="primary" onClick={this.handleSubmit}>
            提交
          </Button>
        </Row>
      </Card>
    );
  };

  render() {
    const {
      companyLoading,
      drillLoading,
      match: { params: { id = null } = {} },
      company: { companyModal = [] },
      emergencyManagement: { drill: drillModal },
    } = this.props;
    const { companyModalVisible, drillModalVisible } = this.state;
    const title = id ? '编辑应急演练评估' : '新增应急演练评估';
    const breadcrumbList = [
      { title: '首页', name: '首页', href: '/' },
      { title: '应急管理', name: '应急管理' },
      { title: '应急演练评估', name: '应急演练评估', href: listUrl },
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
        {/* 选择演练计划弹窗 */}
        <CompanyModal
          title="选择库区"
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
