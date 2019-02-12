import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Checkbox, Form } from 'antd';

import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import styles from './AlarmAddOrEdit.less';
import { getJSONProp } from './utils';

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

@connect(({ personPositionAlarm }) => ({ personPositionAlarm }))
export default class AlarmDetail extends PureComponent {
  componentDidMount() {
    const { dispatch, match: { params: { alarmId } } } = this.props;
    dispatch({ type: 'personPositionAlarm/getAlarmStrategy', payload: alarmId });
  }

  render() {
    const {
      match: { params: { companyId } },
      personPositionAlarm: {
        detail: {
          areaCode,
          areaName,
          mapName,
          canEnterUsers,
          fixedlyTimeLimit,
          outstripNumLimit,
          lackNumLimit,
          lackTimeLimit,
          mapPhoto,
          typeList=[],
        },
      },
    } = this.props;

    const mapPhotoUrl = getJSONProp(mapPhoto, 'url');

    const types = typeList.map(n => Number(n));
    const title = '详情';
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
        <CheckboxGroup
          options={CK_OPTIONS}
          onChange={this.handleCkChange}
          className={styles.checks}
          value={types}
        />
      </Fragment>
    )

    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
      >
        <Card title="区域信息">
          <p>区域编号：{areaCode}</p>
          <p>区域名称：{areaName || NO_DATA}</p>
          <p>所属地图：{mapName || NO_DATA}</p>
          {mapPhotoUrl && <img className={styles.img} src={mapPhotoUrl} alt="map" />}
        </Card>
        <Card title={infoTitle} className={styles.card}>
          <Form onSubmit={this.handleSubmit}>
            {types.includes(CK_VALUES[0]) && (
              <Fragment>
                <FormItem label="报警类型" {...FORMITEM_LAYOUT}>越界</FormItem>
                <FormItem label="允许进入人员" {...FORMITEM_LAYOUT1}>
                  {canEnterUsers.map(({ cardId, cardCode, userName }) => `${cardCode}(${userName})`).join('，')}
                </FormItem>
              </Fragment>
            )}
            {types.includes(CK_VALUES[1]) && (
              <Fragment>
                <FormItem label="报警类型" {...FORMITEM_LAYOUT} style={{ marginTop: 24 }}>长时间不动</FormItem>
                <FormItem label="不动时长" {...FORMITEM_LAYOUT}>
                  {fixedlyTimeLimit}
                  <span className={styles.hour}>小时</span>
                </FormItem>
              </Fragment>
            )}
            {types.includes(CK_VALUES[2]) && (
              <Fragment>
                <FormItem label="报警类型" {...FORMITEM_LAYOUT} style={{ marginTop: 24 }}>超员</FormItem>
                <FormItem label="超员人数" {...FORMITEM_LAYOUT}>
                  {outstripNumLimit}
                </FormItem>
              </Fragment>
            )}
            {types.includes(CK_VALUES[3]) && (
              <Fragment>
                <FormItem label="报警类型" {...FORMITEM_LAYOUT} style={{ marginTop: 24 }}>缺员</FormItem>
                <FormItem label="缺员人数" {...FORMITEM_LAYOUT}>
                  {lackNumLimit}
                </FormItem>
                <FormItem label="缺员时长" {...FORMITEM_LAYOUT}>
                  {lackTimeLimit}
                  <span className={styles.hour}>小时</span>
                </FormItem>
              </Fragment>
            )}
          </Form>
        </Card>
      </PageHeaderLayout>
    );
  }
}
