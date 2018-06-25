import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Card, Button } from 'antd';
// import moment from 'moment';
import { routerRedux } from 'dva/router';

import DescriptionList from 'components/DescriptionList';
import FooterToolbar from 'components/FooterToolbar';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout.js';

import styles from './Company.less';

const { Description } = DescriptionList;

// 标题
const title = '企业详情';
// 返回地址
const href = '/base-info/company-list';
// 面包屑
const breadcrumbList = [
  {
    title: '首页',
    href: '/',
  },
  {
    title: '基础信息',
  },
  {
    title: '企业单位',
    href,
  },
  {
    title,
  },
];
/* 表单标签 */
const fieldLabels = {
  administrativeDivision: '行政区域',
  businessScope: '经营范围',
  code: '企业社会信用码',
  companyIchnography: '企业平面图',
  companyStatus: '企业状态',
  createDate: '成立时间',
  economicType: '经济类型',
  groupName: '集团公司名称',
  industryCategory: '行业类别',
  latitude: '纬度',
  licenseType: '营业执照类别',
  longitude: '经度',
  maintenanceContract: '维保合同',
  maintenanceId: '选择消防维修单位',
  name: '	企业名称',
  practicalAddress: '实际经营地址',
  registerAddress: '注册地址',
  scale: '规模情况',
};
/* 获取无数据 */
const getEmptyData = () => {
  return <span style={{ color: 'rgba(0,0,0,0.45)' }}>暂无数据</span>;
};

@connect(
  ({ company, loading }) => ({
    company,
    loading: loading.models.company,
  }),
  dispatch => ({
    fetchCompany(action) {
      dispatch({
        type: 'company/fetchCompany',
        ...action,
      });
    },
    fetchDict(action) {
      dispatch({
        type: 'company/fetchDict',
        ...action,
      });
    },
    goToEdit(id) {
      dispatch(routerRedux.push(`/base-info/company/edit/${id}`));
    },
  })
)
@Form.create()
export default class CompanyDetail extends PureComponent {
  /* 生命周期函数 */
  componentWillMount() {
    const {
      fetchCompany,
      fetchDict,
      match: {
        params: { id },
      },
    } = this.props;
    // 获取详情
    fetchCompany({
      payload: {
        id,
      },
    });
    // 获取行业类别
    fetchDict({
      payload: {
        type: 'industryCategories',
      },
    });
    // 获取经济类型
    fetchDict({
      payload: {
        type: 'economicTypes',
      },
    });
    // 获取企业状态
    fetchDict({
      payload: {
        type: 'companyStatuses',
      },
    });
    // 获取规模情况
    fetchDict({
      payload: {
        type: 'scales',
      },
    });
    // 获取营业执照类别
    fetchDict({
      payload: {
        type: 'licenseTypes',
      },
    });
  }

  /* 渲染基础信息 */
  renderBasicInfo() {
    const {
      company: {
        detail: { data },
      },
    } = this.props;

    return (
      <Card title="基础信息" className={styles.card} bordered={false}>
        <DescriptionList>
          <Description term={fieldLabels.name}>{data.name || getEmptyData()}</Description>
          <Description term={fieldLabels.registerAddress}>
            {data.registerAddress || getEmptyData()}
          </Description>
          <Description term={fieldLabels.code}>{data.code || getEmptyData()}</Description>
          <Description term={fieldLabels.practicalAddress}>
            {data.practicalAddress || getEmptyData()}
          </Description>
          <Description term={fieldLabels.longitude}>{data.longitude || getEmptyData()}</Description>
          <Description term={fieldLabels.latitude}>{data.latitude || getEmptyData()}</Description>
          <Description term={fieldLabels.administrativeDivision}>
            {data.province + data.city + data.district + data.town || getEmptyData()}
          </Description>
          <Description term={fieldLabels.companyIchnography}>
            {data.companyIchnography || getEmptyData()}
          </Description>
        </DescriptionList>
      </Card>
    );
  }

  /* 渲染更多信息 */
  renderMoreInfo() {
    const {
      company: {
        detail: { data },
      },
    } = this.props;

    return (
      <Card title="更多信息" className={styles.card} bordered={false}>
        <DescriptionList>
          <Description term={fieldLabels.industryCategory}>
            {data.industryCategory || getEmptyData()}
          </Description>
          <Description term={fieldLabels.economicType}>
            {data.economicType || getEmptyData()}
          </Description>
          <Description term={fieldLabels.companyStatus}>
            {data.companyStatus || getEmptyData()}
          </Description>
          <Description term={fieldLabels.scale}>{data.scale || getEmptyData()}</Description>
          <Description term={fieldLabels.licenseType}>
            {data.licenseType || getEmptyData()}
          </Description>
          <Description term={fieldLabels.createDate}>
            {data.createDate || getEmptyData()}
          </Description>
          <Description term={fieldLabels.groupName}>{data.groupName || getEmptyData()}</Description>
          <Description term={fieldLabels.businessScope}>
            {data.businessScope || getEmptyData()}
          </Description>
        </DescriptionList>
      </Card>
    );
  }

  /* 渲染人员信息 */
  // renderPersonalInfo() {
  //   const {
  //     form: { getFieldDecorator },
  //   } = this.props;

  //   return (
  //     <Card title="人员信息" className={styles.card} bordered={false}>
  //       <div>这里是人员信息</div>
  //     </Card>
  //   );
  // }

  /* 渲染其他信息 */
  renderOtherInfo() {
    const {
      company: {
        detail: { data },
      },
    } = this.props;

    return (
      <Card title="其他信息" className={styles.card} bordered={false}>
        <DescriptionList>
          <Description term={fieldLabels.maintenanceId}>
            {data.maintenanceId || getEmptyData()}
          </Description>
          <Description term={fieldLabels.maintenanceContract}>
            {data.maintenanceContract || getEmptyData()}
          </Description>
        </DescriptionList>
      </Card>
    );
  }

  /* 渲染底部工具栏 */
  renderFooterToolbar() {
    const {
      goToEdit,
      match: {
        params: { id },
      },
    } = this.props;
    return (
      <FooterToolbar>
        <Button
          type="primary"
          onClick={() => {
            goToEdit(id);
          }}
        >
          编辑
        </Button>
      </FooterToolbar>
    );
  }

  render() {
    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
        wrapperClassName={styles.advancedForm}
      >
        {this.renderBasicInfo()}
        {this.renderMoreInfo()}
        {/* {this.renderPersonalInfo()} */}
        {this.renderOtherInfo()}
        {this.renderFooterToolbar()}
      </PageHeaderLayout>
    );
  }
}
