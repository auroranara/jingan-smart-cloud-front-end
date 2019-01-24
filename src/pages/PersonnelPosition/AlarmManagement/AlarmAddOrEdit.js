import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Button, Card, Checkbox, Form, Input, Select, message } from 'antd';

import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import styles from './AlarmAddOrEdit.less';

const { Option } = Select;
const { Item: FormItem } = Form;
const { Group: CheckboxGroup } = Checkbox;

const CK_VALUES = [0, 1, 2, 3];
const CK_OPTIONS = ['越界', '长时间不动', '超员', '缺员'].map((label, i) => ({ label, value: CK_VALUES[i] }));
const FORMITEM_LAYOUT1 = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
  },
};
const FORMITEM_LAYOUT = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
};

@connect(({ personPositionAlarm, loading }) => ({ personPositionAlarm, loading: loading.effects['personPositionAlarm/fetchAlarmList'] }))
@Form.create()
export default class AlarmAddOrEdit extends PureComponent {
  state = {
    checkedValues: CK_VALUES,
  };

  componentDidMount() {
    const { match: { params: { id } } } = this.props;
    this.isAdd = !!id;
    const title = this.title = this.isAdd ? '添加' : '编辑';
    this.breadcrumbList = [
      { title: '首页', name: '首页', href: '/' },
      { title: '人员定位', name: '人员定位' },
      { title: '报警管理', name: '报警管理', href: '/personnel-position/alarm-management/index' },
      { title, name: title },
    ];
  }

  isAdd=false;
  title='';
  breadcrumbList=[];

  handleCkChange = checkedValues => {
    this.setState({ checkedValues });
  };

  render() {
    const { form: { getFieldDecorator } } = this.props;
    const { checkedValues } = this.state;

    const infoTitle = (
      <Fragment>
        报警策略配置
        <CheckboxGroup options={CK_OPTIONS} defaultValue={CK_VALUES} onChange={this.handleCkChange} className={styles.checks} />
      </Fragment>
    )

    return (
      <PageHeaderLayout
        title={this.title}
        breadcrumbList={this.breadcrumbList}
      >
        <Card title="区域信息">
          {this.isAdd
            ? (
              <Fragment>
                所属地图：
                <Select>
                  <Option value="0">1号车间</Option>
                </Select>
                区域名称：
                <Select>
                  <Option value="001">危化品存储一处</Option>
                </Select>
              </Fragment>
            ): (
              <Fragment>
                <p>区域编号：001</p>
                <p>区域名称：危化品存储一处</p>
                <p>所属地图：1号车间</p>
              </Fragment>
            )
          }
        </Card>
        <Card title={infoTitle} className={styles.card}>
          <Form>
            {checkedValues.includes(CK_VALUES[0]) && (
              <Fragment>
                <FormItem label="报警类型" {...FORMITEM_LAYOUT}>越界</FormItem>
                <FormItem label="允许进入人员" {...FORMITEM_LAYOUT1}>
                  {getFieldDecorator('canEnterUsers')(
                    <Select mode="multiple">
                      <Option value="0">张三</Option>
                    </Select>
                  )}
                </FormItem>
              </Fragment>
            )}
            {checkedValues.includes(CK_VALUES[1]) && (
              <Fragment>
                <FormItem label="报警类型" {...FORMITEM_LAYOUT} style={{ marginTop: 24 }}>长时间不动</FormItem>
                <FormItem label="不动时长" {...FORMITEM_LAYOUT}>
                  {getFieldDecorator('fixedlyTimeLimit')(
                    <Input placeholder="单位为小时" />
                  )}
                </FormItem>
              </Fragment>
            )}
            {checkedValues.includes(CK_VALUES[2]) && (
              <Fragment>
                <FormItem label="报警类型" {...FORMITEM_LAYOUT} style={{ marginTop: 24 }}>超员</FormItem>
                <FormItem label="超员人数" {...FORMITEM_LAYOUT}>
                  {getFieldDecorator('outstripNumLimit')(
                    <Input placeholder="大于该人数时报警" />
                  )}
                </FormItem>
              </Fragment>
            )}
            {checkedValues.includes(CK_VALUES[3]) && (
              <Fragment>
                <FormItem label="报警类型" {...FORMITEM_LAYOUT} style={{ marginTop: 24 }}>缺员</FormItem>
                <FormItem label="缺员人数" {...FORMITEM_LAYOUT}>
                  {getFieldDecorator('lackNumLimit')(
                    <Input placeholder="小于该人数时报警" />
                  )}
                </FormItem>
                <FormItem label="缺员时长" {...FORMITEM_LAYOUT}>
                  {getFieldDecorator('lackTimeLimit')(
                    <Input placeholder="单位为小时" />
                  )}
                </FormItem>
              </Fragment>
            )}
            <FormItem style={{ textAlign: 'center', marginTop: 24 }}>
              {!!checkedValues.length && (
                <Button type="primary" htmlType="submit">
                  提交
                </Button>
              )}
            </FormItem>
          </Form>
        </Card>
      </PageHeaderLayout>
    );
  }
}
