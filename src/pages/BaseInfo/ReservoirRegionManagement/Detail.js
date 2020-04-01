import React, { Component, Fragment } from 'react';
import { Spin, Card, Button } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import CustomForm from '@/jingan-components/CustomForm';
import { connect } from 'dva';
import router from 'umi/router';
import codes from '@/utils/codes';
import { hasAuthority } from '@/utils/customAuth';

const {
  baseInfo: {
    reservoirRegionManagement: { edit: editCode },
  },
} = codes;
const listUrl = '/major-hazard-info/reservoir-region-management/list';
const HEADER = '库区管理';
const TITLE = '详情';
const BREADCRUMB = [
  {
    title: '首页',
    name: '首页',
    href: '/',
  },
  {
    title: '基本信息',
    name: '基本信息',
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
const NO_DATA = '---';

@connect(({ reservoirRegion, loading, user }) => ({
  reservoirRegion,
  user,
  loading: loading.models.reservoirRegion,
}))
export default class StorehouseDetail extends Component {
  state = {};

  componentDidMount() {
    this.getDetail();
  }

  getDetail = () => {
    const {
      dispatch,
      match: { params: { id = null } = {} },
    } = this.props;
    dispatch({
      type: 'reservoirRegion/fetchAreaList',
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

  generateJudgeLabel = value => (+value === 1 ? '有' : '无');

  render() {
    const {
      user: {
        currentUser: { unitType, permissionCodes },
      },
      reservoirRegion: { envirTypeList, list = [{}] },
      loading,
    } = this.props;
    const dspItems = [
      ...(unitType === 4 ? [] : [{ id: 'companyName', label: '单位名称' }]),
      { id: 'number', label: '库区编号' },
      { id: 'name', label: '库区名称' },
      { id: 'area', label: '库区面积（㎡）' },
      { id: 'position', label: '区域位置' },
      {
        id: 'environment',
        label: '所处环境功能区',
        render: ({ environment }) => (envirTypeList[environment - 1] || {}).value || NO_DATA,
      },
      {
        id: 'wareHouseName',
        label: '包含的库房',
        render: ({ warehouseInfos }) =>
          warehouseInfos && warehouseInfos.length
            ? warehouseInfos.map(item => item.name).join(',')
            : NO_DATA,
      },
      { id: 'spaceBetween', label: '相邻库房最小间距（m）' },
      { id: 'safetyDistance', label: '周边安全防护间距（m）' },
      { id: 'deviceDistance', label: '与周边装置的距离（m）' },
    ];
    const detail = list[0] || {};
    const fields = dspItems.map(item => {
      if (!item) return null;
      const { id, render } = item;
      return {
        ...item,
        span: SPAN,
        labelCol: LABELCOL,
        wrapperCol: WRAPPERCOL,
        render:
          render && typeof render === 'function'
            ? () => <span>{render(detail)}</span>
            : () => <span>{detail[id] || NO_DATA}</span>,
      };
    });
    const hasEditAuthority = hasAuthority(editCode, permissionCodes);

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
                  <Button
                    onClick={e =>
                      router.push(
                        `/major-hazard-info/reservoir-region-management/edit/${detail.id}`
                      )
                    }
                    type="primary"
                    disabled={!hasEditAuthority}
                  >
                    编辑
                  </Button>
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
