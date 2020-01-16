import React, { Fragment, PureComponent } from 'react';
import { Button, Card, Form, Input, Select, Slider, message } from 'antd';
import router from 'umi/router';

import styles from './FireControl.less';

const { Item: FormItem } = Form;

const FIELDS = [
  { key: 'appName', label: '地图名称' },
  { key: 'mapId', label: '地图ID' },
  { key: 'key', label: 'key值' },
];

const LABEL_COL = { xs: { span: 24 }, sm: { span: 4 } };
const WRAPPER_COL = { xs: { span: 24 }, sm: { span: 16 } };

@Form.create()
export default class ThreeDMap extends PureComponent {
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

    const formItems = FIELDS.map(({ key, label }) => (
      <FormItem
        key={key}
        label={label}
        labelCol={LABEL_COL}
        wrapperCol={WRAPPER_COL}
      >
        {getFieldDecorator(key, {
          rules: [{ required: true, message: `请输入${label}` }],
        })(
          <Input placeholder={`请输入${label}`} />
        )}
      </FormItem>
    ));

    const moreItems = (
      <Fragment>
        <FormItem label="默认中心位置" labelCol={LABEL_COL} wrapperCol={WRAPPER_COL}>
          {getFieldDecorator('defaultViewCenter', {
          })(
            <Input placeholder="请输入默认中心位置并以英文逗号分割" />
          )}
        </FormItem>
        <FormItem label="默认视图模式" labelCol={LABEL_COL} wrapperCol={WRAPPER_COL}>
          {getFieldDecorator('defaultViewMode', {
          })(
            <Select placeholder="请选择默认视图模式" />
          )}
        </FormItem>
        <FormItem label="缩放等级范围" labelCol={LABEL_COL} wrapperCol={WRAPPER_COL}>
          {getFieldDecorator('mapScaleLevelRange', {
          })(
            <Slider range min={16} max={23} defaultValue={[16, 23]} />
          )}
        </FormItem>
        <FormItem label="默认缩放等级" labelCol={LABEL_COL} wrapperCol={WRAPPER_COL}>
          {getFieldDecorator('defaultMapScaleLevel', {
          })(
            <Slider defaultValue={9} min={16} max={23} />
          )}
        </FormItem>
      </Fragment>
    );

    return formItems.concat(moreItems);
  }

  render() {
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
