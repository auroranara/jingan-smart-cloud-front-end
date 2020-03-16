import React, { Component, Fragment } from 'react';
import { Spin, Card, Button } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import CustomForm from '@/jingan-components/CustomForm';
import { connect } from 'dva';
import router from 'umi/router';
import moment from 'moment';

import styles from './index.less';

const listUrl = '/emergency-management/emergency-equipment/list';
const HEADER = '应急装备';
const TITLE = HEADER + '详情';
const BREADCRUMB = [
  {
    title: '首页',
    name: '首页',
    href: '/',
  },
  {
    title: '应急管理',
    name: '应急管理',
  },
  {
    title: HEADER,
    name: HEADER,
    href: listUrl,
  },
  {
    title: TITLE,
    name: TITLE,
  },
];
const BUTTON_WRAPPER_SPAN = {
  sm: 24,
  xs: 24,
};
const SPAN = { sm: 24, xs: 24 };
const LABELCOL = { span: 6 };
const WRAPPERCOL = { span: 13 };
const NO_DATA = '暂无数据';

const dspItems = [
  { id: 'companyName', label: '单位名称' },
  { id: 'equipName', label: '装备名称' },
  { id: 'equipType', label: '装备类型' },
  { id: 'equipCode', label: '装备编码' },
  { id: 'equipSource', label: '装备来源' },
  { id: 'equipModel', label: '规格型号' },
  { id: 'equipCount', label: '装备数量' },
  { id: 'equipPrice', label: '装备单价（元）' },
  { id: 'equipUnit', label: '计量单位' },
  { id: 'equipProducer', label: '生产厂家' },
  { id: 'produceDate', label: '出厂日期' },
  { id: 'limitYear', label: '使用年限' },
  { id: 'buyDate', label: '购买日期' },
  { id: 'use', label: '装备用途' },
  { id: 'status', label: '装备状态' },
  { id: 'storeName', label: '装备库名称' },
  { id: 'registerType', label: '登记类型' },
  { id: 'daySpace', label: '定期检查间隔（天）' },
  { id: 'dayMaintSpace', label: '定期保修间隔（天）' },
  { id: 'remark', label: '备注' },
  { id: 'fileList', label: '图片' },
];

const Sources = ['国配', '自购', '社会装备'];
const Statuss = ['正常', '维检', '报废', '使用中'];
const RegisterTypes = ['救援队装备', '社会装备', '储备库装备'];

@connect(({ emergencyManagement, loading, user }) => ({
  emergencyManagement,
  loading: loading.models.emergencyManagement,
  user,
}))
export default class EmergencyEquipmentDetail extends Component {
  componentDidMount() {
    this.getDetail();
  }

  getDetail = () => {
    const {
      dispatch,
      match: { params: { id = null } = {} },
    } = this.props;
    dispatch({
      type: 'emergencyManagement/fetchEquipList',
      payload: {
        pageNum: 1,
        pageSize: 10,
        id,
      },
    });
  };

  fetchDict = (payload, success, error) => {
    const { dispatch } = this.props;
    dispatch({ type: 'emergencyManagement/fetchDicts', payload, success, error });
  };

  handleBackButtonClick = () => {
    router.push(listUrl);
  };

  render() {
    const {
      emergencyManagement: {
        equipment: { list = [{}] },
        emergencyOutfit = [],
      },
      user: {
        currentUser: { unitType },
      },
      loading,
    } = this.props;
    const detail = list[0] || {};
    const fields = dspItems.map(item => {
      const { id } = item;
      const data = detail[id];
      let renderItem = <span>{data || NO_DATA}</span>;
      if (id === 'equipSource') {
        renderItem = <span>{Sources[data - 1] || NO_DATA}</span>;
      } else if (id === 'produceDate' || id === 'buyDate') {
        renderItem = <span>{data ? moment(data).format('YYYY-MM-DD') : NO_DATA}</span>;
      } else if (id === 'status') {
        renderItem = <span>{Statuss[data - 1] || NO_DATA}</span>;
      } else if (id === 'registerType') {
        renderItem = <span>{RegisterTypes[data - 1] || NO_DATA}</span>;
      } else if (id === 'equipType') {
        let treeData = emergencyOutfit;
        const string =
          emergencyOutfit.length > 0
            ? data
                .split(',')
                .map(id => {
                  const val = treeData.find(item => item.id === id) || {};
                  treeData = val.children || [];
                  return val.label;
                })
                .join('/')
            : '';
        renderItem = <span>{string || NO_DATA}</span>;
      } else if (id === 'fileList') {
        renderItem = (
          <div>
            {!data || data.length === 0
              ? NO_DATA
              : data.map((img, i) => (
                  <div key={i}>
                    <a
                      className={styles.clickable}
                      href={img.webUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {img.fileName}
                    </a>
                  </div>
                ))}
          </div>
        );
      }
      return {
        ...item,
        span: SPAN,
        labelCol: LABELCOL,
        wrapperCol: WRAPPERCOL,
        render: () => {
          return renderItem;
        },
      };
    });

    return (
      <PageHeaderLayout title={TITLE} breadcrumbList={BREADCRUMB}>
        <Spin spinning={loading}>
          <Card bordered={false}>
            <CustomForm
              buttonWrapperSpan={BUTTON_WRAPPER_SPAN}
              buttonWrapperStyle={{ textAlign: 'center' }}
              fields={unitType === 4 ? fields.slice(1, fields.length) : fields}
              searchable={false}
              resetable={false}
              action={
                <Fragment>
                  <Button onClick={this.handleBackButtonClick}>返回</Button>
                </Fragment>
              }
            />
          </Card>
        </Spin>
      </PageHeaderLayout>
    );
  }
}
