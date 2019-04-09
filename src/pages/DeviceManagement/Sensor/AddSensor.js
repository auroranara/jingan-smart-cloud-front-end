import { Component, Fragment } from 'react';
import { Card, Form, Input, Select, Button, Table, Row } from 'antd';
import { connect } from 'dva';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import router from 'umi/router';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};
const itemStyles = { style: { width: 'calc(70%)', marginRight: '10px' } }
const defaultPageSize = 10;

@Form.create()
export default class AddSensor extends Component {

  handleSubmit = () => { }


  /**
   * 渲染表单
   */
  renderForm = () => {
    const {
      form: { getFieldDecorator },
    } = this.props
    return (
      <Card>
        <Form>
          <FormItem label="所属企业" {...formItemLayout}></FormItem>
          <FormItem label="监测类型" {...formItemLayout}></FormItem>
          <FormItem label="品牌" {...formItemLayout}></FormItem>
          <FormItem label="传感器型号" {...formItemLayout}></FormItem>
          <FormItem label="传感器名称" {...formItemLayout}>
            {getFieldDecorator('a')(
              <Input {...itemStyles} />
            )}
          </FormItem>
          <FormItem label="传感器位号" {...formItemLayout}>
            {getFieldDecorator('b')(
              <Input {...itemStyles} />
            )}
          </FormItem>
          <FormItem label="传感器ID" {...formItemLayout}>
            {getFieldDecorator('c')(
              <Input {...itemStyles} />
            )}
          </FormItem>
          <FormItem label="监测参数" {...formItemLayout}></FormItem>
          <FormItem label="所在区域" {...formItemLayout}>
            {getFieldDecorator('d')(
              <Input {...itemStyles} />
            )}
          </FormItem>
          <FormItem label="位置详情" {...formItemLayout}>
            {getFieldDecorator('e')(
              <Input {...itemStyles} />
            )}
          </FormItem>
          <FormItem label="地图定位" {...formItemLayout}></FormItem>
        </Form>
        <Row style={{ textAlign: 'center', marginTop: '24px' }}>
          <Button onClick={() => { router.push('/device-management/sensor/list') }}>取消</Button>
          <Button type="primary" style={{ marginLeft: '10px' }} onClick={this.handleSubmit}>确定</Button>
        </Row>
      </Card>
    )
  }

  render() {
    const {
      match: { prams: { id = null } = {} },
    } = this.props
    const title = id ? '编辑传感器' : '新增传感器'
    const breadcrumbList = [
      { title: '首页', name: '首页', href: '/' },
      { title: '设备管理', name: '设备管理' },
      { title: '传感器管理', name: '传感器管理', href: '/device-management/sensor/list' },
      { title, name: title },
    ]
    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
      >
        {this.renderForm()}
      </PageHeaderLayout>
    )
  }
}
