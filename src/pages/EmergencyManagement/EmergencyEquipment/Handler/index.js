import { PureComponent, Fragment } from 'react';
import { Form, Icon as LegacyIcon } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import {
  Card,
  Input,
  Select,
  Button,
  Radio,
  Row,
  message,
  InputNumber,
  DatePicker,
  Upload,
  Cascader,
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import router from 'umi/router';
import CompanyModal from '@/pages/BaseInfo/Company/CompanyModal';
import { getToken } from 'utils/authority';
import { getFileList, getImageSize } from '../../../BaseInfo/utils';
import { genGoBack } from '@/utils/utils';
// import styles from './index.less';

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
const listUrl = '/emergency-management/emergency-equipment/list';

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
@connect(({ emergencyManagement, company, loading, user }) => ({
  emergencyManagement,
  user,
  company,
  companyLoading: loading.effects['company/fetchModelList'],
}))
export default class EmergencyEquipmentHandler extends PureComponent {
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
    };
    this.goBack = genGoBack(props, listUrl);
  }

  componentDidMount() {
    const {
      dispatch,
      match: {
        params: { id },
      },
      form: { setFieldsValue },
    } = this.props;
    this.fetchDict({ type: 'emergencyOutfit' });
    // 如果编辑
    if (id) {
      // 获取详情
      dispatch({
        type: 'emergencyManagement/fetchEquipList',
        payload: { id, pageNum: 1, pageSize: 10 },
        callback: response => {
          const {
            companyId,
            companyName,
            equipName,
            equipType,
            equipCode,
            equipSource,
            equipModel,
            equipCount,
            equipPrice,
            equipUnit,
            equipProducer,
            produceDate,
            limitYear,
            buyDate,
            use,
            status,
            storeName,
            registerType,
            daySpace,
            dayMaintSpace,
            remark,
            fileList,
          } = response.data.list[0];
          setFieldsValue({
            companyId,
            equipName,
            equipType: equipType && equipType.split(','),
            equipCode,
            equipSource,
            equipModel,
            equipCount,
            equipPrice,
            equipUnit,
            equipProducer,
            produceDate: produceDate && moment(+produceDate),
            limitYear,
            buyDate: buyDate ? moment(+buyDate) : undefined,
            use,
            status,
            storeName,
            registerType,
            daySpace,
            dayMaintSpace,
            remark,
          });
          this.setState({
            selectedCompany: { id: companyId, name: companyName },
            fileList: fileList.map(({ id, dbUrl, webUrl, fileName }, index) => ({
              uid: id || index,
              status: 'done',
              name: fileName,
              url: webUrl,
              dbUrl,
            })),
          });

          // this.fetchSensorTypeDict({ payload: { monitoringTypeId } });
          // dispatch({
          //   type: 'sensor/saveState',
          //   payload: { key: 'monitoringParameters', value: monitoringParameters },
          // });
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
    const { fileList } = this.state;

    validateFields((error, formData) => {
      if (!error) {
        const payload = {
          ...formData,
          companyId: unitType === 4 ? companyId : formData.companyId,
          equipType: formData.equipType.join(','),
          fileList: fileList.map(({ name, url, dbUrl }) => ({
            fileName: name,
            webUrl: url,
            dbUrl,
            name,
          })),
          daySpace: formData.daySpace || '',
          dayMaintSpace: formData.dayMaintSpace || '',
        };
        const success = () => {
          message.success(id ? '编辑成功！' : '新增成功！');
          // router.push(listUrl);
          setTimeout(this.goBack, 1000);
        };
        const error = () => {
          message.error(id ? '编辑失败' : '新增失败！');
        };
        if (id) {
          dispatch({
            type: 'emergencyManagement/editEquipment',
            payload: { ...payload, id },
            success,
            error,
          });
        } else {
          dispatch({
            type: 'emergencyManagement/addEquipment',
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

  handleChangeEquipType = value => {
    const {
      emergencyManagement: { emergencyOutfit = [] },
      form: { setFieldsValue },
    } = this.props;
    let treeData = emergencyOutfit;
    const typeCodes = value.map(id => {
      const val = treeData.find(item => item.id === id) || {};
      treeData = val.children || [];
      return val.value;
    });
    setFieldsValue({ equipCode: typeCodes[typeCodes.length - 1] });
  };

  /**
   * 渲染表单
   */
  renderForm = () => {
    const {
      form: { getFieldDecorator, getFieldsValue },
      emergencyManagement: { emergencyOutfit = [] },
      user: {
        currentUser: { unitType },
      },
    } = this.props;
    const { selectedCompany, uploading, fileList } = this.state;
    const { equipCode } = getFieldsValue();
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
          <FormItem label="装备名称" {...formItemLayout}>
            {getFieldDecorator('equipName', {
              getValueFromEvent: e => e.target.value.trim(),
              rules: [{ required: true, message: '请输入装备名称' }],
            })(<Input placeholder="请输入装备名称" {...itemStyles} />)}
          </FormItem>
          <FormItem label="装备类型" {...formItemLayout}>
            {getFieldDecorator('equipType', {
              rules: [{ required: true, message: '请选择装备类型' }],
            })(
              <Cascader
                options={emergencyOutfit}
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
                onChange={this.handleChangeEquipType}
                {...itemStyles}
              />
            )}
          </FormItem>
          <FormItem label="装备编码" {...formItemLayout}>
            {getFieldDecorator('equipCode')(<span>{equipCode || ''}</span>)}
          </FormItem>
          <FormItem label="装备来源" {...formItemLayout}>
            {getFieldDecorator('equipSource')(
              <RadioGroup {...itemStyles}>
                <Radio value="1">国配</Radio>
                <Radio value="2">自购</Radio>
                <Radio value="3">社会装备</Radio>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem label="规格型号" {...formItemLayout}>
            {getFieldDecorator('equipModel', {
              getValueFromEvent: e => e.target.value.trim(),
              rules: [{ required: true, message: '请输入规格型号' }],
            })(<Input placeholder="请输入规格型号" {...itemStyles} />)}
          </FormItem>
          <FormItem label="装备数量" {...formItemLayout}>
            {getFieldDecorator('equipCount', {
              rules: [{ required: true, message: '请输入装备数量' }],
            })(
              <InputNumber
                {...itemStyles}
                min={0}
                placeholder="请输入装备数量"
                formatter={value => (!value || isNaN(value) ? '' : Math.round(value))}
                parser={value => (!value || isNaN(value) ? '' : Math.round(value))}
              />
            )}
          </FormItem>
          <FormItem label="装备单价（元）" {...formItemLayout}>
            {getFieldDecorator('equipPrice')(
              <InputNumber
                {...itemStyles}
                min={0}
                placeholder="请输入装备单价"
                formatter={limitDecimals}
                parser={limitDecimals}
              />
            )}
          </FormItem>
          <FormItem label="计量单位" {...formItemLayout}>
            {getFieldDecorator('equipUnit', { getValueFromEvent: e => e.target.value.trim() })(
              <Input placeholder="请输入计量单位" {...itemStyles} />
            )}
          </FormItem>
          <FormItem label="生产厂家" {...formItemLayout}>
            {getFieldDecorator('equipProducer', {
              getValueFromEvent: e => e.target.value.trim(),
              rules: [{ required: true, message: '请输入生产厂家' }],
            })(<Input placeholder="请输入生产厂家" {...itemStyles} />)}
          </FormItem>
          <FormItem label="出厂日期" {...formItemLayout}>
            {getFieldDecorator('produceDate', {
              rules: [{ required: true, message: '请选择出厂日期' }],
            })(
              <DatePicker
                placeholder="请选择出厂日期"
                getCalendarContainer={getRootChild}
                {...itemStyles}
              />
            )}
          </FormItem>
          <FormItem label="使用年限" {...formItemLayout}>
            {getFieldDecorator('limitYear', {
              rules: [{ required: true, message: '请输入使用年限' }],
            })(
              <InputNumber
                {...itemStyles}
                min={0}
                placeholder="请输入使用年限"
                formatter={value => (!value || isNaN(value) ? '' : Math.round(value))}
                parser={value => (!value || isNaN(value) ? '' : Math.round(value))}
              />
            )}
          </FormItem>
          <FormItem label="购买日期" {...formItemLayout}>
            {getFieldDecorator('buyDate')(
              <DatePicker
                placeholder="请选择购买日期"
                getCalendarContainer={getRootChild}
                {...itemStyles}
              />
            )}
          </FormItem>
          <FormItem label="装备用途" {...formItemLayout}>
            {getFieldDecorator('use', {
              getValueFromEvent: e => e.target.value.trim(),
              rules: [{ required: true, message: '请输入装备用途' }],
            })(<TextArea rows={4} placeholder="请输入装备用途" maxLength={500} {...itemStyles} />)}
          </FormItem>
          <FormItem label="装备状态" {...formItemLayout}>
            {getFieldDecorator('status', {
              rules: [{ required: true, message: '请选择装备状态' }],
            })(
              <RadioGroup {...itemStyles}>
                <Radio value="1">正常</Radio>
                <Radio value="2">维检</Radio>
                <Radio value="3">报废</Radio>
                <Radio value="4">使用中</Radio>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem label="装备库名称" {...formItemLayout}>
            {getFieldDecorator('storeName', { getValueFromEvent: e => e.target.value.trim() })(
              <Input placeholder="请输入装备库名称" {...itemStyles} />
            )}
          </FormItem>
          <FormItem label="登记类型" {...formItemLayout}>
            {getFieldDecorator('registerType')(
              <RadioGroup {...itemStyles}>
                <Radio value="1">救援队装备</Radio>
                <Radio value="2">社会装备</Radio>
                <Radio value="3">储备库装备</Radio>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem label="定期检查间隔（天）" {...formItemLayout}>
            {getFieldDecorator('daySpace')(
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
            {getFieldDecorator('dayMaintSpace')(
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
              <TextArea rows={4} placeholder="请输入备注" maxLength={500} {...itemStyles} />
            )}
          </FormItem>
          <FormItem label="图片" {...formItemLayout}>
            <Upload
              {...defaultUploadProps}
              fileList={fileList}
              onChange={this.handleImgChange}
              disabled={uploading}
            >
              <Button type="dashed" style={{ width: '96px', height: '96px' }}>
                <LegacyIcon type="plus" style={{ fontSize: '32px' }} />
                <div style={{ marginTop: '8px' }}>点击上传</div>
              </Button>
            </Upload>
          </FormItem>
        </Form>
        <Row justify="center" style={{ textAlign: 'center', marginTop: '24px' }}>
          <Button type="primary" onClick={this.handleSubmit}>
            提交
          </Button>
          <Button style={{ marginLeft: 20 }} onClick={this.goBack}>
            返回
          </Button>
        </Row>
      </Card>
    );
  };

  render() {
    const {
      companyLoading,
      match: { params: { id = null } = {} },
      company: { companyModal = [] },
    } = this.props;
    const { companyModalVisible } = this.state;
    const title = id ? '编辑应急装备' : '新增应急装备';
    const breadcrumbList = [
      { title: '首页', name: '首页', href: '/' },
      { title: '应急管理', name: '应急管理' },
      { title: '应急装备', name: '应急装备', href: listUrl },
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
