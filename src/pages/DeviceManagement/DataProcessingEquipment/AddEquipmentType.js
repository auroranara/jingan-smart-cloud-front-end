import { PureComponent, Fragment } from 'react';
import { Card, Button, Form, Input, Row, Col, Select, message, Checkbox } from 'antd';
import { connect } from 'dva';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import CompanyModal from '@/pages/BaseInfo/Company/CompanyModal';
import router from 'umi/router';

const FormItem = Form.Item;

const listUrl = '/device-management/data-processing/list'
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};
const itemStyles = { style: { width: 'calc(70%)', marginRight: '10px' } }

@Form.create()
@connect(({ device, sensor, loading }) => ({
  device,
  sensor,
  companyLoading: loading.effects['sensor/fetchModelList'],
}))
export default class AddEquipmentType extends PureComponent {

  state = {
    // 选择企业弹窗
    companyModalVisible: false,
    // 选中的企业
    selectedCompany: {},
  }

  componentDidMount() {
    this.fetchAllDeviceTypes()
  }

  /**
   * 获取企业列表（弹窗）
   */
  fetchCompany = ({ payload }) => {
    const { dispatch } = this.props;
    dispatch({ type: 'sensor/fetchModelList', payload });
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
      match: { params: { companyId } },
    } = this.props
    validateFields((err, values) => {
      if (err) return
      const tag = companyId ? '编辑' : '新增'
      const success = () => {
        message.success(`${tag}成功`)
        router.push(listUrl)
      }
      const error = (res) => { message.error(res ? res.msg : `${tag}失败`) }
      // 如果编辑
      if (companyId) {
        dispatch({
          type: 'device/editDeviceType',
          payload: { ...values, id: companyId },
          success,
          error,
        })
      } else {
        // 如果新增
        dispatch({
          type: 'device/addDeviceType',
          payload: values,
          success,
          error,
        })
      }
    })
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
    const { selectedCompany } = this.state
    return (
      <Card>
        <Form>
          <FormItem label="所属单位" {...formItemLayout}>
            {getFieldDecorator('companyId')(
              <Fragment>
                <Input {...itemStyles} disabled value={selectedCompany.name} placeholder="请选择" />
                <Button type="primary" onClick={this.handleViewCompanyModal}>选择单位</Button>
              </Fragment>
            )}
          </FormItem>
          <FormItem label="数据处理设备类型" {...formItemLayout}>
            {getFieldDecorator('type')(
              <Checkbox.Group>
                {deviceTypeList.map(({ id, name }) => (
                  <Col span={8} key={id}>
                    <Checkbox value={id}>{name}</Checkbox>
                  </Col>
                ))}
              </Checkbox.Group>
            )}
          </FormItem>
        </Form>
        <Row style={{ textAlign: 'center', marginTop: '24px' }}>
          <Button onClick={() => { router.push(listUrl) }}>取消</Button>
          <Button type="primary" style={{ marginLeft: '10px' }} onClick={this.handleSubmit}>确定</Button>
        </Row>
      </Card>
    )
  }

  render() {
    const {
      companyLoading,
      match: { params: { companyId } },
      sensor: { companyModal },
    } = this.props
    const { companyModalVisible } = this.state
    const title = companyId ? '编辑数据处理设备类型' : '新增数据处理设备类型'
    const breadcrumbList = [
      { title: '首页', name: '首页', href: '/' },
      { title: '设备管理', name: '设备管理' },
      { title: '单位数据处理设备', name: '单位数据处理设备', href: listUrl },
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
