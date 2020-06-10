import { PureComponent, Fragment } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Card, Button, Input, Row, Col, Select, message, Checkbox } from 'antd';
import { connect } from 'dva';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import CompanyModal from '@/pages/BaseInfo/Company/CompanyModal';
// import router from 'umi/router';
import { genGoBack } from '@/utils/utils';

const FormItem = Form.Item;

const listUrl = '/device-management/data-processing/list'
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};
const itemStyles = { style: { width: 'calc(70%)', marginRight: '10px' } }

@Form.create()
@connect(({ device, loading }) => ({
  device,
  companyLoading: loading.effects['device/fetchCompanyiesForAdd'],
}))
export default class AddEquipmentType extends PureComponent {
  constructor(props) {
    super(props);
    this.goBack = genGoBack(props, listUrl);
  }

  state = {
    // 选择企业弹窗
    companyModalVisible: false,
    // 选中的企业
    selectedCompany: {},
    disabledKeys: [],
  }

  componentDidMount() {
    const {
      dispatch,
      form: { setFieldsValue },
      match: { params: { id } },
    } = this.props
    this.fetchAllDeviceTypes()
    // 如果编辑
    if (id) {
      dispatch({
        type: 'device/fetchCompanyDetail',
        payload: { id },
        callback: ({ equipmentTypeList, companyName, companyId }) => {
          const keys = equipmentTypeList.map(item => item.id)
          const disabledKeys = equipmentTypeList.reduce((arr, item) => {
            return +item.count > 0 ? [...arr, item.id] : arr
          }, [])
          this.setState({ selectedCompany: { id, name: companyName }, disabledKeys })
          setFieldsValue({ companyId, equipmentTypeList: keys })
        },
      })
    }
  }

  /**
   * 获取企业列表（弹窗）
   */
  fetchCompany = ({ payload }) => {
    const { dispatch } = this.props;
    dispatch({ type: 'device/fetchCompanyiesForAdd', payload });
  };


  /**
   * 获取所有处理设备类型
   */
  fetchAllDeviceTypes = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'device/fetchAllDeviceTypes', payload: { type: 1 } });
  }

  /**
   * 打开选择单位弹窗
   */
  handleViewCompanyModal = () => {
    this.setState({ companyModalVisible: true })
    this.fetchCompany({
      payload: {
        pageSize: 10,
        pageNum: 1,
      },
    })
  }

  /**
   * 选择企业
   */
  handleSelectCompany = (selectedCompany) => {
    const {
      form: { setFieldsValue },
    } = this.props
    this.setState({ selectedCompany, companyModalVisible: false })
    setFieldsValue({ companyId: selectedCompany.id })
  }


  /**
   * 提交数据
   */
  handleSubmit = () => {
    const {
      dispatch,
      form: { validateFields },
      match: { params: { id } },
      device: {
        deviceType: { list: deviceTypeList }, // 设备类型列表
      },
    } = this.props
    validateFields((err, values) => {
      if (err) return
      // 处理 数据处理设备类型 数据
      const { equipmentTypeList } = values
      const newList = equipmentTypeList.map(id => {
        const item = deviceTypeList.find(item => item.id === id)
        return item
      })
      const payload = { ...values, equipmentTypeList: newList }
      const tag = id ? '编辑' : '新增'
      const success = () => {
        message.success(`${tag}成功`)
        // router.push(listUrl)
        setTimeout(this.goBack, 1000);
      }
      const error = (res) => { message.error(res ? res.msg : `${tag}失败`) }
      // 如果编辑
      if (id) {
        dispatch({
          type: 'device/editDeviceType',
          payload: { ...payload, id },
          success,
          error,
        })
      } else {
        // 如果新增
        dispatch({
          type: 'device/addDeviceType',
          payload,
          success,
          error,
        })
      }
    })
  }

  validateTypeList = (rule, value, callback) => {
    if (value && value.length) {
      callback()
    } else callback('请选择数据处理设备类型')
  }

  /**
   * 渲染表单
   */
  renderForm = () => {
    const {
      form: { getFieldDecorator },
      device: {
        deviceType: { list: deviceTypeList }, // 设备类型列表
      },
    } = this.props
    const { selectedCompany, disabledKeys } = this.state
    return (
      <Card>
        <Form>
          <FormItem label="所属单位" {...formItemLayout}>
            {getFieldDecorator('companyId', {
              rules: [{ required: true, message: '请选择所属单位' }],
            })(
              <Fragment>
                <Input {...itemStyles} disabled value={selectedCompany.name} placeholder="请选择" />
                <Button type="primary" onClick={this.handleViewCompanyModal}>选择单位</Button>
              </Fragment>
            )}
          </FormItem>
          <FormItem label="数据处理设备类型" {...formItemLayout}>
            {getFieldDecorator('equipmentTypeList', {
              rules: [{ required: true, validator: this.validateTypeList }],
            })(
              <Checkbox.Group >
                {deviceTypeList.map(({ id, name }) => (
                  <Checkbox disabled={disabledKeys.includes(id)} value={id}>{name}</Checkbox>
                ))}
              </Checkbox.Group>
            )}
          </FormItem>
        </Form>
        <Row justify="center" style={{ textAlign: 'center', marginTop: '24px' }}>
          <Button type="primary" style={{ marginRight: 20 }} onClick={this.handleSubmit}>提交</Button>
          <Button
            // onClick={() => { router.push(listUrl) }}
            onClick={this.goBack}
          >
            返回
          </Button>
        </Row>
      </Card>
    )
  }

  render() {
    const {
      companyLoading,
      match: { params: { id } },
      device: { companyModal },
    } = this.props
    const { companyModalVisible } = this.state
    const title = id ? '编辑数据处理设备类型' : '新增数据处理设备类型'
    const breadcrumbList = [
      { title: '首页', name: '首页', href: '/' },
      { title: '物联设备管理', name: '物联设备管理' },
      { title: '数据处理设备', name: '数据处理设备', href: listUrl },
      { title, name: title },
    ]
    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
      >
        {this.renderForm()}
        <CompanyModal
          title="选择单位"
          loading={companyLoading}
          visible={companyModalVisible}
          modal={companyModal}
          fetch={this.fetchCompany}
          onSelect={this.handleSelectCompany}
          onClose={() => { this.setState({ companyModalVisible: false }) }}
        />
      </PageHeaderLayout>
    )
  }
}
