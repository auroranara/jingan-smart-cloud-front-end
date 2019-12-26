import React, { Component, Fragment } from 'react';
import { Spin, Card, Button } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import CustomForm from '@/jingan-components/CustomForm';
import { connect } from 'dva';
import router from 'umi/router';
import moment from 'moment';

import styles from './index.less';

const listUrl = '/emergency-management/emergency-supplies/list';
const HEADER = '应急物资';
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
  { id: 'materialName', label: '物资名称' },
  { id: 'code', label: '资源编码' },
  { id: 'levelCode', label: '级别编码' },
  { id: 'materialType', label: '物资类型' },
  { id: 'materialCode', label: '物资编码' },
  { id: 'materialCount', label: '物资数量' },
  { id: 'remark', label: '备注' },
];

const SuppliesCodes = [
  { key: '43B01', name: '43B01 防汛抗旱专用物资' },
  { key: '43B02', name: '43B02 防震减灾专用物资' },
  { key: '43B03', name: '43B03 防疫应急专用物资' },
  { key: '43B04', name: '43B04 有害生物灾害应急防控专用物资' },
  { key: '43B05', name: '43B05 危险化学品事故救援专用物资' },
  { key: '43B06', name: '43B06 矿山事故救援专用物资' },
  { key: '43B07', name: '43B07 油污染处置物资' },
  { key: '43B99', name: '43B99 其他专项救援物资储备' },
];
const LvlCodes = ['01 国家级', '02 社会力量', '99 其他'];

@connect(({ emergencyManagement, loading, user }) => ({
  emergencyManagement,
  user,
  loading: loading.models.emergencyManagement,
}))
export default class EmergencySuppliesDetail extends Component {
  componentDidMount() {
    this.fetchDict({ type: 'emergencyEquip' });
    this.getDetail();
  }

  fetchDict = (payload, success, error) => {
    const { dispatch } = this.props;
    dispatch({ type: 'emergencyManagement/fetchDicts', payload, success, error });
  };

  getDetail = () => {
    const {
      dispatch,
      match: { params: { id = null } = {} },
    } = this.props;
    dispatch({
      type: 'emergencyManagement/fetchSuppliesList',
      payload: {
        pageNum: 1,
        pageSize: 10,
        id,
      },
    });
  };

  handleBackButtonClick = () => {
    router.push(listUrl);
  };

  render() {
    const {
      emergencyManagement: {
        supplies: { list = [{}] },
        emergencyEquip = [],
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
      if (id === 'code') {
        const codeItem = SuppliesCodes.find(code => code.key === data);
        renderItem = <span>{codeItem ? codeItem.name : NO_DATA}</span>;
      } else if (id === 'levelCode') {
        renderItem = <span>{LvlCodes[data - 1] || NO_DATA}</span>;
      } else if (id === 'materialType') {
        let treeData = emergencyEquip;
        const string = data
          .split(',')
          .map(id => {
            const val = treeData.find(item => item.id === id) || {};
            treeData = val.children || [];
            return val.label;
          })
          .join('/');
        renderItem = <span>{string || NO_DATA}</span>;
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
