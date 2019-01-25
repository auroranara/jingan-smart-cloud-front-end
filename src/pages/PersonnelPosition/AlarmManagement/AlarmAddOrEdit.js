import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Button, Card, Checkbox, Form, Input, Select, TreeSelect, message } from 'antd';

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
    sm: { span: 12 },
  },
};

@connect(({ personPositionAlarm, loading }) => ({ personPositionAlarm, loading: loading.models.personPositionAlarm }))
@Form.create()
export default class AlarmAddOrEdit extends PureComponent {
  state = {
    checkedValues: CK_VALUES,
    mapUrl: '',
  };

  componentDidMount() {
    const { dispatch, match: { params: { companyId, alarmId } } } = this.props;
    dispatch({ type: 'personPositionAlarm/fetchMapList', payload: { companyId, pageSize: 0 } });
  }

  isAdd = () => {
    const { match: { params: { alarmId } } } = this.props;
    return !alarmId;
  };

  handleCkChange = checkedValues => {
    this.setState({ checkedValues });
  };

  handleMapChange = value => {
    const { dispatch, personPositionAlarm: { mapList } } = this.props;
    dispatch({ type: 'personPositionAlarm/fetchSectionList', payload: { mapId: value, pageSize: 0 } });

    const url = mapList.find(({ id }) => id === value).mapPhotoUrl;
    this.setState({ mapUrl: url });
  };

  handleSectionChange = value => {
    const { dispatch, personPositionAlarm } = this.props;
    dispatch({ type: 'personPositionAlarm/fetchSectionLimits', payload: value });
  };

  genTimeLimitCheck = (min, max) => {
    return function (rule, value, callback) {
      const val = Number.parseFloat(value.trim());
      if (!val || val < 0) {
        callback('设定的值必须为一个大于0的数字');
        return;
      }

      if (min && !max && val >= min || !min && max && val <= max || min && max && val >=min && val <= max) {
        callback();
        return;
      }

      callback(`设定的值必须大于等于下级区域设定的最小值${min}且必须小于等于上级区域设置的最大值${max}`);
    };
  };

  render() {
    const {
      match: { params: { companyId } },
      form: { getFieldDecorator },
      personPositionAlarm: {
        mapList,
        sectionList,
        sectionLimits: {
          minCanEnterUsers, // 最小允许进入范围
          maxCanEnterUsers, // 最大允许进入范围
          minTLongLimitTime, // 最小停留时间
          maxTLongLimitTime, // 最大停留时间
          minLimitOutstripNum, // 最小超员人数
          maxLimitOutstripNum, // 最大超员人数
          minLimitLackNum, // 最小缺员人数
          maxLimitLackNum, // 最大缺员人数
        },
      },
    } = this.props;
    const { checkedValues, mapUrl } = this.state;

    const isAdd = this.isAdd();
    const title = isAdd ? '新增' : '编辑';
    const breadcrumbList = [
      { title: '首页', name: '首页', href: '/' },
      { title: '人员定位', name: '人员定位' },
      { title: '报警管理', name: '报警管理', href: '/personnel-position/alarm-management/index' },
      { title: '报警策略列表', name: '报警策略列表', href: `/personnel-position/alarm-management/list/${companyId}` },
      { title, name: title },
    ];

    const infoTitle = (
      <Fragment>
        报警策略配置
        <CheckboxGroup options={CK_OPTIONS} defaultValue={CK_VALUES} onChange={this.handleCkChange} className={styles.checks} />
      </Fragment>
    )

    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
      >
        <Card title="区域信息">
          {isAdd
            ? (
              <Fragment>
                <div className={styles.map}>
                  所属地图：
                  <Select placeholder="请选择地图" style={{ width: 200 }} onChange={this.handleMapChange}>
                    {mapList.map(({ id, mapName }) => <Option value={id} key={id}>{mapName}</Option>)}
                  </Select>
                </div>
                <div>
                  区域名称：
                  <Select placeholder="请选择区域" style={{ width: 200 }} onChange={this.handleSectionChange}>
                    {sectionList.map(({ id, name }) => <Option value={id} key={id}>{name}</Option>)}
                  </Select>
                </div>
                {mapUrl && <img src={mapUrl} alt="map" />}
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
                  {getFieldDecorator('canEnterUsers', { rules: [
                    { required: true, message: '请选择允许进入人员' },
                  ] })(
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
                  {getFieldDecorator('fixedlyTimeLimit', { rules: [
                    { required: true, message: '请设置不动时长' },
                    { validator: this.genTimeLimitCheck(minTLongLimitTime, maxTLongLimitTime) },
                  ] })(
                    <Input placeholder="单位为小时" />
                  )}
                </FormItem>
              </Fragment>
            )}
            {checkedValues.includes(CK_VALUES[2]) && (
              <Fragment>
                <FormItem label="报警类型" {...FORMITEM_LAYOUT} style={{ marginTop: 24 }}>超员</FormItem>
                <FormItem label="超员人数" {...FORMITEM_LAYOUT}>
                  {getFieldDecorator('outstripNumLimit', { rules: [
                    { required: true, message: '请设置超员人数' },
                    { validator: this.genTimeLimitCheck(minLimitOutstripNum, maxLimitOutstripNum) },
                  ] })(
                    <Input placeholder="大于该人数时报警" />
                  )}
                </FormItem>
              </Fragment>
            )}
            {checkedValues.includes(CK_VALUES[3]) && (
              <Fragment>
                <FormItem label="报警类型" {...FORMITEM_LAYOUT} style={{ marginTop: 24 }}>缺员</FormItem>
                <FormItem label="缺员人数" {...FORMITEM_LAYOUT}>
                  {getFieldDecorator('lackNumLimit', { rules: [
                    { required: true, message: '请设置缺员人数' },
                    { validator: this.genTimeLimitCheck(minLimitLackNum, maxLimitLackNum) },
                  ] })(
                    <Input placeholder="小于该人数时报警" />
                  )}
                </FormItem>
                <FormItem label="缺员时长" {...FORMITEM_LAYOUT}>
                  {getFieldDecorator('lackTimeLimit', { rules: [
                    { required: true, message: '请设置缺员时长' },
                  ] })(
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
