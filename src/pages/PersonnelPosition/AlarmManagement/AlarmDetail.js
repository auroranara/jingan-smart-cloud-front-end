import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Checkbox, Form, Spin, message } from 'antd';

import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import ImageDraw from '@/components/ImageDraw';
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

@connect(({ personPositionAlarm, zoning, loading }) => ({
  personPositionAlarm,
  zoning,
  loading: loading.effects['zoning/fetchZone'] || loading.effects['personPositionAlarm/getAlarmStrategy'],
}))
export default class AlarmDetail extends PureComponent {
  state = {
    data: [],
    url: undefined,
    images: undefined,
    reference: undefined,
  };

  componentDidMount() {
    const { dispatch, match: { params: { alarmId } } } = this.props;
    dispatch({
      type: 'personPositionAlarm/getAlarmStrategy',
      payload: alarmId,
      callback: ({ areaId }) => {
        areaId && this.getZoning(areaId);
      },
    });
  }

  getZoning = id => {
    const { dispatch } = this.props;
    // 获取区域信息
    dispatch({
      type: 'zoning/fetchZone',
      payload: { id },
      callback: (data) => {
        if (data) {
          const { areaInfo: { name, range }, companyMap: { id: id1, mapPhoto: image1 }={}, floorMap: { id: id2, mapPhoto: image2, jsonMap }={} } = data;
          const { url: url1 } = JSON.parse(image1 || '{}');
          const { url: url2 } = JSON.parse(image2 || '{}');
          const json = JSON.parse(jsonMap || null);
          const item = range ? [JSON.parse(range)] : [];
          if (url1 && url2 && json) {
            const image = {
              id: id2,
              url: url2,
              ...json,
            };
            this.setState({
              url: url1,
              images: [image],
              reference: image,
              // name,
              data: item,
            });
          }
          else if (url1) {
            const image = {
              id: id1,
              url: url1,
              latlngs: [
                { lat: 0, lng: 0 },
                { lat: 1, lng: 0 },
                { lat: 1, lng: 1 },
                { lat: 0, lng: 1 },
              ],
            };
            this.setState({
              url: url1,
              images: [image],
              reference: image,
              // name,
              data: item,
            });
          }
          else {
            message.error('数据异常，请联系维护人员或稍后重试！');
          }
        }
        else {
          message.error('获取数据失败，请稍后重试！');
        }
      },
    });
  };

  render() {
    const {
      loading,
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
    const { data, url, images, reference } = this.state;

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
    );

    const imgDraw = (
      <Spin spinning={loading}>
        <ImageDraw
          autoZoom
          hideBackground
          url={url}
          data={data}
          images={images}
          reference={reference}
          className={styles.img1}
          color='#00a8ff'
          style={{ backgroundColor: '#ccc' }}
        />
      </Spin>
    );

    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
      >
        <Card title="区域信息">
          <p>区域编号：{areaCode}</p>
          <p>区域名称：{areaName || NO_DATA}</p>
          <p>所属地图：{mapName || NO_DATA}</p>
          {/* {mapPhotoUrl && <img className={styles.img} src={mapPhotoUrl} alt="map" />} */}
          {imgDraw}
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
