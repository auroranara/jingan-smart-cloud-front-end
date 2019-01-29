import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Button, Card, Checkbox, Form, Input, Select, message } from 'antd';

import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import styles from './AlarmAddOrEdit.less';
import { msgCallback, handleInitFormValues } from './utils';

const { Option } = Select;
const { Item: FormItem } = Form;
const { Group: CheckboxGroup } = Checkbox;

const NO_DATA = '暂无信息';
const CK_VALUES = [2, 3, 4, 5];
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
const FORM_PROPS = {
  [CK_VALUES[0]]: ['canEnterUsers'],
  [CK_VALUES[1]]: ['fixedlyTimeLimit'],
  [CK_VALUES[2]]: ['outstripNumLimit'],
  [CK_VALUES[3]]: ['lackNumLimit', 'lackTimeLimit'],
};

@connect(({ personPositionAlarm, loading }) => ({ personPositionAlarm, loading: loading.models.personPositionAlarm }))
@Form.create()
export default class AlarmAddOrEdit extends PureComponent {
  state = {
    checkedValues: CK_VALUES,
    mapUrl: '',
    mapId: undefined,
    areaId: undefined,
  };

  componentDidMount() {
    const { dispatch, match: { params: { companyId, alarmId } }, form: { setFieldsValue } } = this.props;
    const isAdd = this.isAdd();
    isAdd && dispatch({ type: 'personPositionAlarm/fetchMapList', payload: { companyId, pageSize: 0 } });
    dispatch({
      type: 'personPositionAlarm/fetchAllCards',
      payload: { companyId, pageSize: 0 },
      callback: () => {
        if (isAdd)
          return;

        dispatch({
          type: 'personPositionAlarm/getAlarmStrategy',
          payload: alarmId,
          callback: detail => {
            const { typeList, areaId } = detail;
            dispatch({ type: 'personPositionAlarm/fetchSectionLimits', payload: areaId });
            this.setState({ checkedValues: typeList.map(n => Number(n)) }, () => {
              setFieldsValue(handleInitFormValues(detail, typeList, FORM_PROPS));
            });
          },
        });
      },
    });
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
    this.setState({ mapId: value });
    dispatch({
      type: 'personPositionAlarm/fetchSectionList',
      payload: { mapId: value, pageSize: 0 },
      callback: areas => {
        this.setState({ areaId: areas.length ? areas[0].id : '' });
      },
    });

    const url = mapList.find(({ id }) => id === value).mapPhotoUrl;
    this.setState({ mapUrl: url });
  };

  handleSectionChange = value => {
    const { dispatch, personPositionAlarm } = this.props;
    this.setState({ areaId: value });
    dispatch({
      type: 'personPositionAlarm/fetchSectionLimits',
      payload: value,
      callback: ({ minCanEnterUsers }) => {
        this.setCards(minCanEnterUsers);
      },
    });
  };

  handleCardsChange = values => {
    // console.log(values);
    const { personPositionAlarm: { sectionLimits: { minCanEnterUsers } } } = this.props;
    this.setCards(minCanEnterUsers, values);
  };

  setCards = (minCanEnterUsers, values=[]) => {
    const { form: { setFieldsValue } } = this.props;
    const min = Array.isArray(minCanEnterUsers) ? minCanEnterUsers.map(({ cardId }) => cardId) : [];
    setFieldsValue({ canEnterUsers: [...min, ...values] });
  };

  genTimeLimitCheck = (min, max) => {
    return function (rule, value, callback) {
      const val = Number(value.trim());
      if (!val || val < 0) {
        callback('设定的值必须为一个大于0的数字');
        return;
      }

      if (min && !max && val >= min || !min && max && val <= max || min && max && val >=min && val <= max || !min && !max) {
        callback();
        return;
      }

      callback(`设定的值必须大于等于下级区域设定的最小值${min}且必须小于等于上级区域设置的最大值${max}`);
    };
  };

  handleSubmit = e => {
    const {
      dispatch,
      form: { validateFields },
      match: { params: { companyId, alarmId } },
    } = this.props;
    const { checkedValues, areaId } = this.state;
    const isAdd = this.isAdd();

    e.preventDefault();

    validateFields((err, values) => {
      console.log(err, values);
      if (err)
        return;

      const newValues = { ...values };
      newValues.areaId = areaId;
      newValues.typeList = checkedValues;
      if (values.canEnterUsers)
        newValues.canEnterUsers = values.canEnterUsers.map((cardId) => ({ cardId }));
      if (!isAdd)
        newValues.id = alarmId;

      // console.log(newValues);
      dispatch({
        type: `personPositionAlarm/${isAdd ? 'add' : 'edit'}AlarmStrategy`,
        payload: newValues,
        callback: (code, msg) => {
          msgCallback(code, msg);
          if (code === 200)
            router.push(`/personnel-position/alarm-management/list/${companyId}`);
        },
      });
    });
  };

  render() {
    const {
      loading,
      match: { params: { companyId } },
      form: { getFieldDecorator },
      personPositionAlarm: {
        mapList,
        sectionList,
        sectionLimits: {
          // minCanEnterUsers, // 最小允许进入范围
          maxCanEnterUsers, // 最大允许进入范围
          minTLongLimitTime, // 最小停留时间
          maxTLongLimitTime, // 最大停留时间
          minLimitOutstripNum, // 最小超员人数
          maxLimitOutstripNum, // 最大超员人数
          minLimitLackNum, // 最小缺员人数
          maxLimitLackNum, // 最大缺员人数
        },
        allCards,
        detail: { areaName, mapName },
      },
    } = this.props;
    const { checkedValues, mapId, areaId, mapUrl } = this.state;

    const isAdd = this.isAdd();
    const title = isAdd ? '新增' : '编辑';
    const breadcrumbList = [
      { title: '首页', name: '首页', href: '/' },
      { title: '人员定位', name: '人员定位' },
      { title: '报警管理', name: '报警管理', href: '/personnel-position/alarm-management/index' },
      { title: '报警策略列表', name: '报警策略列表', href: `/personnel-position/alarm-management/list/${companyId}` },
      { title, name: title },
    ];

    const cardList = maxCanEnterUsers ? maxCanEnterUsers : allCards;

    const infoTitle = (
      <Fragment>
        报警策略配置
        <CheckboxGroup
          // disabled={!areaId}
          options={CK_OPTIONS}
          defaultValue={CK_VALUES}
          onChange={this.handleCkChange}
          className={styles.checks}
        />
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
                  <Select placeholder="请选择地图" style={{ width: 200 }} onChange={this.handleMapChange} value={mapId}>
                    {mapList.map(({ id, mapName }) => <Option value={id} key={id}>{mapName}</Option>)}
                  </Select>
                </div>
                <div>
                  区域名称：
                  <Select placeholder="请选择区域" style={{ width: 200 }} onChange={this.handleSectionChange} value={areaId}>
                    {sectionList.map(({ id, name }) => <Option value={id} key={id}>{name}</Option>)}
                  </Select>
                </div>
                {mapUrl && <img src={mapUrl} alt="map" />}
              </Fragment>
            ): (
              <Fragment>
                {/* <p>区域编号：001</p> */}
                <p>区域名称：{areaName || NO_DATA}</p>
                <p>所属地图：{mapName || NO_DATA}</p>
              </Fragment>
            )
          }
        </Card>
        <Card title={infoTitle} className={styles.card}>
          <Form onSubmit={this.handleSubmit}>
            {checkedValues.includes(CK_VALUES[0]) && (
              <Fragment>
                <FormItem label="报警类型" {...FORMITEM_LAYOUT}>越界</FormItem>
                <FormItem label="允许进入人员" {...FORMITEM_LAYOUT1}>
                  {getFieldDecorator('canEnterUsers', { rules: [
                    { required: true, message: '请选择允许进入人员' },
                  ] })(
                    <Select mode="multiple" onChange={this.handleCardsChange}>
                      {cardList.map(({ cardId, cardCode, userName }) => <Option value={cardId} key={cardId}>{cardCode}({userName})</Option>)}
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
                    <Input style={{ width: 150 }} placeholder="请输入不动时长" />
                  )}
                  <span className={styles.hour}>小时</span>
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
                    <Input style={{ width: 150 }} placeholder="大于该人数时报警" />
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
                    <Input style={{ width: 150 }} placeholder="小于该人数时报警" />
                  )}
                </FormItem>
                <FormItem label="缺员时长" {...FORMITEM_LAYOUT}>
                  {getFieldDecorator('lackTimeLimit', { rules: [
                    { required: true, message: '请设置缺员时长' },
                  ] })(
                    <Input style={{ width: 150 }} placeholder="请输入缺员时长" />
                  )}
                  <span className={styles.hour}>小时</span>
                </FormItem>
              </Fragment>
            )}
            <FormItem style={{ textAlign: 'center', marginTop: 24 }}>
              {!!checkedValues.length && (
                <Button type="primary" htmlType="submit" disabled={isAdd ? !areaId : loading}>
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
