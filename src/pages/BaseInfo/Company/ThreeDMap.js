import React, { PureComponent } from 'react';
import { Button, Card, Form, Input, message } from 'antd';
import router from 'umi/router';

import styles from './FireControl.less';

const { Item: FormItem } = Form;

const FIELDS = [
  { key: 'appName', label: '地图名称' },
  { key: 'mapId', label: '地图ID' },
  { key: 'key', label: 'key值' },
];

@Form.create()
export default class FireControl extends PureComponent {
  componentDidMount() {
    this.getMapList(list => {
      const { form: { setFieldsValue } } = this.props;
      if (list.length)
        setFieldsValue(list[0]);
    });
  }

  handleSubmit = e => {
    const {
      form: { validateFields },
    } = this.props;
    e.preventDefault();
    validateFields((err, fieldsValue) => {
      if (err) return;
      this.getMapList(list => {
        const isPost = !list.length;
        const detail = list[0] || {};
        this.editMap(isPost, fieldsValue, detail.id);
      });
    });
  };

  getMapList = callback => {
    const { dispatch, companyId } = this.props;
    dispatch({
      type: 'company/fetchMapList',
      payload: { pageSize: 0, pageNum: 1, companyId },
      callback,
    });
  };

  editMap = (isPost, fieldsValue, id) => {
    const { dispatch, companyId } = this.props;
    dispatch({
      type: `company/${isPost ? 'add' : 'edit'}Map`,
      payload: { ...fieldsValue, id, companyId },
      callback: (code, msg) => {
        if (code === 200) {
          message.success(msg);
          router.push('/base-info/company/list');
        } else
          message.error(msg);
      },
    });
  };

  renderFormItems() {
    const {
      form: { getFieldDecorator },
    } = this.props;

    return FIELDS.map(({ key, label }) => (
      <FormItem
        label={label}
        labelCol={{ xs: { span: 24 }, sm: { span: 4 } }}
        wrapperCol={{ xs: { span: 24 }, sm: { span: 16 } }}
      >
        {getFieldDecorator(key, {
          rules: [{ required: true, message: `请输入${label}` }],
        })(
          <Input placeholder={`请输入${label}`} />
        )}
      </FormItem>
    ));
  }

  render() {
    const {
      data,
    } = this.props;
    return (
      <Card className={styles.threedCard}>
        <Form
          onSubmit={this.handleSubmit}
        >
          {this.renderFormItems()}
          <FormItem wrapperCol={{ xs: { span: 24, offset: 0 }, sm: { span: 13, offset: 11 } }}>
            <Button type="primary" htmlType="submit">
              提交
            </Button>
          </FormItem>
        </Form>
      </Card>
    );
  }
}
