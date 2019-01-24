import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Button, Card, Checkbox, Form, Input, Select, message } from 'antd';

import PageHeaderLayout from '@/layouts/PageHeaderLayout';
// import styles from './CompanyList.less';

const { Option } = Select;
const { Item: FormItem } = Form;
const { Group: CheckboxGroup } = Checkbox;

const CK_VALUES = [0, 1, 2, 3];
const CK_OPTIONS = ['越界', '长时间不动', '超员', '缺员'].map((label, i) => ({ label, value: CK_VALUES[i] }));

@connect(({ personPositionAlarm, loading }) => ({ personPositionAlarm, loading: loading.effects['personPositionAlarm/fetchAlarmList'] }))
@Form.create()
export default class AlarmList extends PureComponent {
  state = {
    checkedValues: [],
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
        <CheckboxGroup options={CK_OPTIONS} onChange={this.handleCkChange} />
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
        <Card title={infoTitle}>
          <Form>
            {checkedValues.includes(CK_VALUES[0]) && (
              <Fragment>
                报警类型：越界
                <FormItem label="允许进入人员">
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
                报警类型：长时间不动
                <FormItem label="不动时长(小时)">
                  {getFieldDecorator('fixedlyTimeLimit')(
                    <Input />
                  )}
                </FormItem>
              </Fragment>
            )}
            {checkedValues.includes(CK_VALUES[2]) && (
              <Fragment>
                报警类型：超员
                <FormItem label="超员人数">
                  {getFieldDecorator('outstripNumLimit')(
                    <Input />
                  )}
                </FormItem>
              </Fragment>
            )}
            {checkedValues.includes(CK_VALUES[3]) && (
              <Fragment>
                报警类型：缺员
                <FormItem label="缺员人数">
                  {getFieldDecorator('lackNumLimit')(
                    <Input />
                  )}
                </FormItem>
                <FormItem label="缺员时长(小时)">
                  {getFieldDecorator('lackTimeLimit')(
                    <Input />
                  )}
                </FormItem>
              </Fragment>
            )}
            <FormItem>
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
