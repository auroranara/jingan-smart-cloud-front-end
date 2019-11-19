import { PureComponent, Fragment } from 'react';
import {
  Card,
  Form,
  Input,
  Select,
  Button,
  Radio,
  Row,
  message,
  InputNumber,
  DatePicker,
  Cascader,
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import router from 'umi/router';
import CompanyModal from '@/pages/BaseInfo/Company/CompanyModal';
import styles from './index.less';

const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option;
const { Group: RadioGroup } = Radio;
/* root下的div */
const getRootChild = () => document.querySelector('#root>div');
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};
const listUrl = '/emergency-management/emergency-drill/list';

const itemStyles = { style: { width: 'calc(70%)', marginRight: '10px' } };
const limitDecimals = value => {
  const reg = /^(\-)*(\d+)\.(\d\d).*$/;
  if (typeof value === 'string') {
    return !isNaN(Number(value)) ? value.replace(reg, '$1$2.$3') : '';
  } else if (typeof value === 'number') {
    return !isNaN(value) ? String(value).replace(reg, '$1$2.$3') : '';
  } else {
    return '';
  }
};

@Form.create()
@connect(({ emergencyManagement, loading, company }) => ({
  emergencyManagement,
  company,
  companyLoading: loading.effects['company/fetchModelList'],
}))
export default class EmergencyDrillHandler extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      // 选择企业弹窗
      compayModalVisible: false,
      // 选中的企业
      selectedCompany: {},
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
      // 获取传感器详情
      dispatch({
        type: 'emergencyManagement/fetchDrillDetail',
        payload: { id },
        callback: response => {
          const {
            companyId,
            companyName,
            projectName,
            projectCode,
            projectStatus,
            draftBy,
            draftDate,
            reportBy,
            planName,
            planType,
            typeCode,
            planBack,
            planCode,
            planLocation,
            planGoal,
            planClaim,
            planContent,
            keyword,
            budget,
          } = response.data;
          setFieldsValue({
            companyId,
            projectName,
            projectCode,
            projectStatus,
            draftBy,
            draftDate: moment(draftDate),
            reportBy,
            planName,
            planType,
            typeCode,
            planBack,
            planCode,
            planLocation,
            planGoal,
            planClaim,
            planContent,
            keyword,
            budget,
          });
          this.setState({
            selectedCompany: { id: companyId, name: companyName },
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

  handleSubmit = () => {
    const {
      dispatch,
      form: { validateFields },
      match: {
        params: { id },
      },
    } = this.props;

    validateFields((error, formData) => {
      console.log('formData', formData);

      if (!error) {
        const payload = { ...formData };
        const success = () => {
          message.success(id ? '编辑成功！' : '新增成功！');
          router.push(listUrl);
        };
        const error = () => {
          message.error(id ? '编辑失败' : '新增失败！');
        };
        if (id) {
          dispatch({
            type: 'emergencyManagement/editDrill',
            payload: { ...payload, id },
            success,
            error,
          });
        } else {
          dispatch({
            type: 'emergencyManagement/addDrill',
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

  /* 去除左右两边空白 */
  handleTrim = e => e.target.value.trim();

  /**
   * 渲染表单
   */
  renderForm = () => {
    const {
      form: { getFieldDecorator, getFieldValue },
    } = this.props;
    const { selectedCompany } = this.state;

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
          <FormItem label="计划名称" {...formItemLayout}>
            {getFieldDecorator('projectName', {
              getValueFromEvent: this.handleTrim,
              rules: [{ required: true, message: '请输入计划名称' }],
            })(<Input placeholder="请输入计划名称" {...itemStyles} />)}
          </FormItem>
          <FormItem label="版本号" {...formItemLayout}>
            {getFieldDecorator('projectCode', { getValueFromEvent: this.handleTrim })(
              <Input placeholder="请输入版本号" {...itemStyles} />
            )}
          </FormItem>
          <FormItem label="计划状态" {...formItemLayout}>
            {getFieldDecorator('projectStatus', {
              rules: [{ required: true, message: '请选择计划状态' }],
            })(
              <RadioGroup {...itemStyles}>
                <Radio value="1">已执行</Radio>
                <Radio value="0">未执行</Radio>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem label="制定人" {...formItemLayout}>
            {getFieldDecorator('draftBy', {
              getValueFromEvent: this.handleTrim,
              rules: [{ required: true, message: '请输入制定人' }],
            })(<Input placeholder="请输入制定人" {...itemStyles} />)}
          </FormItem>
          <FormItem label="制定日期" {...formItemLayout}>
            {getFieldDecorator('draftDate')(
              <DatePicker
                placeholder="请选择制定日期"
                getCalendarContainer={getRootChild}
                {...itemStyles}
              />
            )}
          </FormItem>
          <FormItem label="上报人" {...formItemLayout}>
            {getFieldDecorator('reportBy', {
              getValueFromEvent: this.handleTrim,
              rules: [{ required: true, message: '请输入上报人' }],
            })(<Input placeholder="请输入上报人" {...itemStyles} />)}
          </FormItem>
          <FormItem label="演练名称" {...formItemLayout}>
            {getFieldDecorator('planName', {
              getValueFromEvent: this.handleTrim,
              rules: [{ required: true, message: '请输入演练名称' }],
            })(<Input placeholder="请输入演练名称" {...itemStyles} />)}
          </FormItem>
          <FormItem label="演练类型" {...formItemLayout}>
            {getFieldDecorator('planType', {
              // rules: [{ required: true, message: '请选择演练类型' }],
            })(
              <Cascader
                options={[]}
                fieldNames={{
                  value: 'id',
                  label: 'name',
                  children: 'children',
                  isLeaf: 'isLeaf',
                }}
                loadData={selectedOptions => {
                  this.handleLoadData(['registerAddress'], selectedOptions);
                }}
                changeOnSelect
                placeholder="请选择演练类型"
                allowClear
                getPopupContainer={getRootChild}
                {...itemStyles}
              />
            )}
          </FormItem>
          <FormItem label="演练类型代码" {...formItemLayout}>
            {getFieldDecorator('typeCode')(<span>{}</span>)}
          </FormItem>
          <FormItem label="演练背景" {...formItemLayout}>
            {getFieldDecorator('planBack', { getValueFromEvent: this.handleTrim })(
              <Input placeholder="请输入演练背景" {...itemStyles} />
            )}
          </FormItem>
          <FormItem label="演练编号" {...formItemLayout}>
            {getFieldDecorator('planCode', {
              getValueFromEvent: this.handleTrim,
              rules: [{ required: true, message: '请输入演练编号' }],
            })(<Input placeholder="请输入演练编号" {...itemStyles} />)}
          </FormItem>
          <FormItem label="演练地点" {...formItemLayout}>
            {getFieldDecorator('planLocation', {
              getValueFromEvent: this.handleTrim,
              rules: [{ required: true, message: '请输入演练地点' }],
            })(<Input placeholder="请输入演练地点" {...itemStyles} />)}
          </FormItem>
          <FormItem label="演练目的" {...formItemLayout}>
            {getFieldDecorator('planGoal', {
              getValueFromEvent: this.handleTrim,
              rules: [{ required: true, message: '请输入演练目的' }],
            })(<TextArea rows={4} placeholder="请输入演练目的" maxLength="500" {...itemStyles} />)}
          </FormItem>
          <FormItem label="演练要求" {...formItemLayout}>
            {getFieldDecorator('planClaim', {
              getValueFromEvent: this.handleTrim,
              rules: [{ required: true, message: '请输入演练要求' }],
            })(<TextArea rows={4} placeholder="请输入演练要求" maxLength="500" {...itemStyles} />)}
          </FormItem>
          <FormItem label="演练内容" {...formItemLayout}>
            {getFieldDecorator('planContent', {
              getValueFromEvent: this.handleTrim,
              rules: [{ required: true, message: '请输入演练内容' }],
            })(<TextArea rows={4} placeholder="请输入演练内容" maxLength="500" {...itemStyles} />)}
          </FormItem>
          <FormItem label="关键字" {...formItemLayout}>
            {getFieldDecorator('keyword', { getValueFromEvent: this.handleTrim })(
              <Input placeholder="请输入关键字" {...itemStyles} />
            )}
          </FormItem>
          <FormItem label="经费预算（元）" {...formItemLayout}>
            {getFieldDecorator('budget')(
              <InputNumber
                {...itemStyles}
                min={0}
                placeholder="请输入经费预算"
                formatter={limitDecimals}
                parser={limitDecimals}
              />
            )}
          </FormItem>
        </Form>
        <Row style={{ textAlign: 'center', marginTop: '24px' }}>
          <Button type="primary" style={{ marginLeft: '10px' }} onClick={this.handleSubmit}>
            提交
          </Button>
        </Row>
      </Card>
    );
  };

  render() {
    const {
      companyLoading,
      match: { params: { id = null } = {} },
      company: { companyModal },
    } = this.props;
    const { companyModalVisible } = this.state;
    const title = id ? '编辑应急演练计划' : '新增应急演练计划';
    const breadcrumbList = [
      { title: '首页', name: '首页', href: '/' },
      { title: '应急管理', name: '应急管理' },
      { title: '应急演练计划', name: '应急演练计划', href: listUrl },
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
