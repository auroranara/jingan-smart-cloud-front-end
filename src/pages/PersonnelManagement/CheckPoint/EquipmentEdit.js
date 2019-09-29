import React, { PureComponent } from 'react';
import router from 'umi/router';
import { Button, Col, Form, Input, Row, Switch } from 'antd';

import styles from './CompanyList.less';
import { genOperateCallback, getFieldDecConfig, initFormValues, EQUIPMENT_INDEX } from './utils';

const { Item: FormItem } = Form;

@Form.create()
export default class EquipmentEdit extends PureComponent {
  componentDidMount() {
    const { match: { params: { id } } } = this.props;
    id && this.fetchDetail();
  }

  fetchDetail() {
    const {
      dispatch,
      match: { params: { tabIndex, id } },
      form: { setFieldsValue },
    } = this.props;
    dispatch({
      type: 'checkPoint/fetchCheckPoint',
      index: tabIndex,
      payload: id,
      callback: detail => setFieldsValue(initFormValues(detail, EQUIPMENT_INDEX)),
    });
  }

  handleSubmit = e => {
    const {
      dispatch,
      match: { params: { companyId, id } },
      form: { validateFields },
    } = this.props;

    e.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        const { status } = values;
        const params = { ...values, companyId, status: +!status };
        // if (companyId)
        //   params.companyId = companyId;
        if (id)
          params.id = id;
        dispatch({
          type: `checkPoint/${id ? 'edit' : 'add'}CheckPoint`,
          index: EQUIPMENT_INDEX,
          payload: params,
          callback: genOperateCallback(`/personnel-management/check-point/list/${companyId}/${EQUIPMENT_INDEX}`),
        });
      }
    });
  };

  back = () => {
    const { match: { params: { companyId } } } = this.props;
    router.push(`/personnel-management/check-point/list/${companyId}/${EQUIPMENT_INDEX}`);
  };

  render() {
    const {
      isDetail,
      form: { getFieldDecorator },
    } = this.props;

    const btn = isDetail ? null :  <Button type="primary" htmlType="submit">提交</Button>;

    return (
      <Form layout="vertical" onSubmit={this.handleSubmit}>
        <Row gutter={{ lg: 48, md: 24 }}>
          <Col lg={8} md={12} sm={24}>
            <FormItem label="设备名称">
              {getFieldDecorator('name', getFieldDecConfig('请输入设备名称'))(
                <Input placeholder="请输入设备名称" min={1} max={20} />
              )}
            </FormItem>
          </Col>
          <Col lg={8} md={12} sm={24}>
            <FormItem label="设备编号">
              {getFieldDecorator('code', getFieldDecConfig('请输入设备编号'))(
                <Input placeholder="请输入设备编号" min={1} max={20} />
              )}
            </FormItem>
          </Col>
          <Col lg={8} md={12} sm={24}>
            <FormItem label="设备ID">
              {getFieldDecorator('number', getFieldDecConfig('请输入设备ID'))(
                <Input placeholder="请输入设备ID" min={1} max={20} />
              )}
            </FormItem>
          </Col>
          <Col lg={8} md={12} sm={24}>
            <FormItem label="所在区域">
              {getFieldDecorator('area', getFieldDecConfig('请输入所在区域'))(
                <Input placeholder="请输入所在区域" min={1} max={20} />
              )}
            </FormItem>
          </Col>
          <Col lg={8} md={12} sm={24}>
            <FormItem label="所在位置">
              {getFieldDecorator('location', getFieldDecConfig('请输入所在位置'))(
                <Input placeholder="请输入所在位置" min={1} max={20} />
              )}
            </FormItem>
          </Col>
          <Col lg={8} md={12} sm={24}>
            <FormItem label="设备状态">
              {getFieldDecorator('status', {
                initialValue: true,
                rules: [{ required: true, message: '请选择设备状态' }],
                valuePropName: 'checked',
              })(
                <Switch
                  checkedChildren="启用"
                  unCheckedChildren="禁用"
                />
              )}
            </FormItem>
          </Col>
        </Row>
        <Form.Item wrapperCol={{ span: 24, offset: 11 }}>
          <Button onClick={this.back} className={styles.back}>返回</Button>
          {btn}
        </Form.Item>
      </Form>
    )
  }
}
