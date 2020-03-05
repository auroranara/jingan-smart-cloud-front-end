import { PureComponent, Fragment } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import {
  Card,
  Input,
  Select,
  Button,
  Radio,
  Row,
  Modal,
  Col,
  message,
  InputNumber,
  Cascader,
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import router from 'umi/router';
import CompanyModal from '@/pages/BaseInfo/Company/CompanyModal';
import { getToken } from 'utils/authority';
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
const listUrl = '/emergency-management/emergency-supplies/list';

const itemStyles = { style: { width: 'calc(70%)', marginRight: '10px' } };

const SuppliesCodes = [
  { key: '43B01', name: '43B01 防汛抗旱专用物资' },
  { key: '43B02', name: '43B02 防震减灾专用物资' },
  { key: '43B03', name: '43B03 防疫应急专用物资' },
  { key: '43B04', name: '43B04 有害生物灾害应急防控专用物资' },
  { key: '43B05', name: '43B05 危险化学品事故救援专用物资' },
  { key: '43B06', name: '43B06 矿山事故救援专用物资' },
  { key: '43B07', name: '43B07 油污染处置物资' },
  { key: '43B99', name: '43B99 其他专项救援物资储备' },
];

@Form.create()
@connect(({ emergencyManagement, company, loading, user }) => ({
  emergencyManagement,
  user,
  company,
  companyLoading: loading.effects['company/fetchModelList'],
}))
export default class EmergencySuppliesHandler extends PureComponent {
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
    this.fetchDict({ type: 'emergencyEquip' });
    // 如果编辑
    if (id) {
      // 获取详情
      dispatch({
        type: 'emergencyManagement/fetchSuppliesList',
        payload: { id, pageNum: 1, pageSize: 10 },
        callback: response => {
          const {
            companyId,
            materialName,
            code,
            levelCode,
            materialType,
            materialCode,
            materialCount,
            remark,
            companyName,
            daySpace,
            dayMaintSpace,
          } = response.data.list[0];
          setFieldsValue({
            companyId,
            materialName,
            code,
            levelCode,
            materialType: materialType && materialType.split(','),
            materialCode,
            materialCount,
            remark,
            daySpace,
            dayMaintSpace,
          });
          this.setState({
            selectedCompany: { id: companyId, name: companyName },
          });
        },
      });
    }
  }

  fetchDict = (payload, success, error) => {
    const { dispatch } = this.props;
    dispatch({ type: 'emergencyManagement/fetchDicts', payload, success, error });
  };

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
      user: {
        currentUser: { unitType, companyId },
      },
    } = this.props;

    validateFields((error, formData) => {
      if (!error) {
        const payload = {
          ...formData,
          companyId: unitType === 4 ? companyId : formData.companyId,
          materialType: formData.materialType.join(','),
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
            type: 'emergencyManagement/editSupplies',
            payload: { ...payload, id },
            success,
            error,
          });
        } else {
          dispatch({
            type: 'emergencyManagement/addSupplies',
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

  handleChangeMaterialType = value => {
    const {
      emergencyManagement: { emergencyEquip = [] },
      form: { setFieldsValue },
    } = this.props;
    let treeData = emergencyEquip;
    const typeCodes = value.map(id => {
      const val = treeData.find(item => item.id === id) || {};
      treeData = val.children || [];
      return val.value;
    });
    setFieldsValue({ materialCode: typeCodes[typeCodes.length - 1] });
  };

  /**
   * 渲染表单
   */
  renderForm = () => {
    const {
      form: { getFieldDecorator, getFieldsValue },
      emergencyManagement: { emergencyEquip = [] },
      user: {
        currentUser: { unitType },
      },
    } = this.props;
    const { selectedCompany } = this.state;
    const { materialCode } = getFieldsValue();
    return (
      <Card>
        <Form>
          {unitType !== 4 && (
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
          )}
          <FormItem label="物资名称" {...formItemLayout}>
            {getFieldDecorator('materialName', {
              getValueFromEvent: e => e.target.value.trim(),
              rules: [{ required: true, message: '请输入物资名称' }],
            })(<Input placeholder="请输入物资名称" {...itemStyles} />)}
          </FormItem>
          <FormItem label="资源编码" {...formItemLayout}>
            {getFieldDecorator('code', {
              rules: [{ required: true, message: '请选择资源编码' }],
            })(
              <Select placeholder="请选择资源编码" {...itemStyles}>
                {SuppliesCodes.map(item => (
                  <Option value={item.key} key={item.key}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem label="级别编码" {...formItemLayout}>
            {getFieldDecorator('levelCode', {
              rules: [{ required: true, message: '请选择级别编码' }],
            })(
              <RadioGroup {...itemStyles}>
                <Radio value="1">01 国家级</Radio>
                <Radio value="2">02 社会力量</Radio>
                <Radio value="3">99 其他</Radio>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem label="物资类型" {...formItemLayout}>
            {getFieldDecorator('materialType', {
              rules: [{ required: true, message: '请选择物资类型' }],
            })(
              <Cascader
                options={emergencyEquip}
                fieldNames={{
                  value: 'id',
                  label: 'label',
                  children: 'children',
                  isLeaf: 'isLeaf',
                }}
                changeOnSelect
                placeholder="请选择模拟事故类型"
                allowClear
                getPopupContainer={getRootChild}
                onChange={this.handleChangeMaterialType}
                {...itemStyles}
              />
            )}
          </FormItem>
          <FormItem label="物资编码" {...formItemLayout}>
            {getFieldDecorator('materialCode')(<span>{materialCode || ''}</span>)}
          </FormItem>
          <FormItem label="物资数量" {...formItemLayout}>
            {getFieldDecorator('materialCount', {
              rules: [{ required: true, message: '请输入物资数量' }],
            })(
              <InputNumber
                {...itemStyles}
                min={0}
                placeholder="请输入物资数量"
                formatter={value => (!value || isNaN(value) ? '' : Math.round(value))}
                parser={value => (!value || isNaN(value) ? '' : Math.round(value))}
              />
            )}
          </FormItem>
          <FormItem label="定期检查间隔（天）" {...formItemLayout}>
            {getFieldDecorator('daySpace', {
              // rules: [{ required: true, message: '请输入定期检查间隔（天）' }],
            })(
              <InputNumber
                {...itemStyles}
                min={0}
                placeholder="请输入定期检查间隔"
                formatter={value => (!value || isNaN(value) ? '' : Math.round(value))}
                parser={value => (!value || isNaN(value) ? '' : Math.round(value))}
              />
            )}
          </FormItem>
          <FormItem label="定期保修间隔（天）" {...formItemLayout}>
            {getFieldDecorator('dayMaintSpace', {
              // rules: [{ required: true, message: '请输入物资数量' }],
            })(
              <InputNumber
                {...itemStyles}
                min={0}
                placeholder="请输入定期保修间隔"
                formatter={value => (!value || isNaN(value) ? '' : Math.round(value))}
                parser={value => (!value || isNaN(value) ? '' : Math.round(value))}
              />
            )}
          </FormItem>
          <FormItem label="备注" {...formItemLayout}>
            {getFieldDecorator('remark', { getValueFromEvent: e => e.target.value.trim() })(
              <TextArea rows={4} placeholder="请输入备注" maxLength="500" {...itemStyles} />
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
    const title = id ? '编辑应急物资' : '新增应急物资';
    const breadcrumbList = [
      { title: '首页', name: '首页', href: '/' },
      { title: '应急管理', name: '应急管理' },
      { title: '应急物资', name: '应急物资', href: listUrl },
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
