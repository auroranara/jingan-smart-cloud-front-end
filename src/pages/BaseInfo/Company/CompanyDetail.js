import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Card, Button, Spin } from 'antd';
import moment from 'moment';
import { routerRedux } from 'dva/router';

import DescriptionList from 'components/DescriptionList';
import FooterToolbar from 'components/FooterToolbar';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './Company.less';

const { Description } = DescriptionList;

// 标题
const title = '单位详情';
// 返回地址
const href = '/base-info/company/list';
// 面包屑
const breadcrumbList = [
  {
    title: '首页',
    name: '首页',
    href: '/',
  },
  {
    title: '一企一档',
    name: '一企一档',
  },
  {
    title: '单位单位',
    name: '单位单位',
    href,
  },
  {
    title,
    name: title,
  },
];
/* 表单标签 */
const fieldLabels = {
  administrativeDivision: '行政区域',
  businessScope: '经营范围',
  code: '社会信用代码',
  companyIchnography: '单位平面图',
  companyStatus: '单位状态',
  createTime: '成立时间',
  economicType: '经济类型',
  groupName: '集团公司名称',
  industryCategory: '行业类别',
  coordinate: '经纬度',
  licenseType: '营业执照类别',
  name: '	单位名称',
  practicalAddress: '实际经营地址',
  registerAddress: '注册地址',
  scale: '规模情况',
  principalName: '姓名',
  principalPhone: '联系方式',
  principalEmail: '邮箱',
  companyNature: '单位性质',
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
    // 获取详情
    fetchCompany(action) {
      dispatch({
        type: 'company/fetchCompany',
        ...action,
      });
    },
    // 跳转到编辑页面
    goToEdit(id) {
      dispatch(routerRedux.push(`/base-info/company/edit/${id}`));
    },
    // 异常
    goToException() {
      dispatch(routerRedux.push('/exception/500'));
    },
  })
)
@Form.create()
export default class CompanyDetail extends PureComponent {
  /* 生命周期函数 */
  componentDidMount() {
    const {
      fetchCompany,
      match: {
        params: { id },
      },
      goToException,
    } = this.props;
    // 获取详情
    fetchCompany({
      payload: {
        id,
      },
      error: () => {
        goToException();
      },
    });
  }

  /* 渲染基础信息 */
  renderBasicInfo() {
    const {
      company: {
        detail: {
          data: {
            name,
            code,
            longitude,
            latitude,
            companyNatureLabel,
            companyIchnography,
            registerAddress,
            registerProvinceLabel,
            registerCityLabel,
            registerDistrictLabel,
            registerTownLabel,
            practicalAddress,
            practicalProvinceLabel,
            practicalCityLabel,
            practicalDistrictLabel,
            practicalTownLabel,
          },
        },
      },
    } = this.props;

    const registerAddressLabel =
      (registerProvinceLabel || '') +
      (registerCityLabel || '') +
      (registerDistrictLabel || '') +
      (registerTownLabel || '') +
      (registerAddress || '');
    const practicalAddressLabel =
      (practicalProvinceLabel || '') +
      (practicalCityLabel || '') +
      (practicalDistrictLabel || '') +
      (practicalTownLabel || '') +
      (practicalAddress || '');
    const companyIchnographyList = companyIchnography ? JSON.parse(companyIchnography) : [];

    return (
      <Card title="基础信息" className={styles.card} bordered={false}>
        <DescriptionList col={3}>
          <Description term={fieldLabels.name}>{name || getEmptyData()}</Description>
          <Description term={fieldLabels.companyNature}>{companyNatureLabel || getEmptyData()}</Description>
          <Description term={fieldLabels.code}>{code || getEmptyData()}</Description>
          <Description term={fieldLabels.coordinate}>{longitude && latitude ? `${longitude},${latitude}` : getEmptyData()}</Description>
        </DescriptionList>
        <DescriptionList col={1} style={{ marginBottom: 32 }}>
          <Description term={fieldLabels.registerAddress}>
            {registerAddressLabel || getEmptyData()}
          </Description>
        </DescriptionList>
        <DescriptionList col={1} style={{ marginBottom: 32 }}>
          <Description term={fieldLabels.practicalAddress}>
            {practicalAddressLabel || getEmptyData()}
          </Description>
        </DescriptionList>
        <DescriptionList col={1} style={{ marginBottom: 32 }}>
          <Description term={fieldLabels.companyIchnography}>
            {companyIchnographyList.length !== 0 ? companyIchnographyList.map(({ name, webUrl }) => (
              <div>
                <a href={webUrl} target="_blank" rel="noopener noreferrer">
                  {name || '预览'}
                </a>
              </div>
            )) : (
              getEmptyData()
            )}
          </Description>
        </DescriptionList>
      </Card>
    );
  }

  /* 渲染更多信息 */
  renderMoreInfo() {
    const {
      company: {
        detail: {
          data: {
            industryCategoryLabel,
            economicTypeLabel,
            companyStatusLabel,
            scaleLabel,
            licenseTypeLabel,
            createTime,
            groupName,
            businessScope,
          },
        },
      },
    } = this.props;

    return (
      <Card title="更多信息" className={styles.card} bordered={false}>
        <DescriptionList col={3}>
          <Description term={fieldLabels.industryCategory}>
            {industryCategoryLabel || getEmptyData()}
          </Description>
          <Description term={fieldLabels.economicType}>
            {economicTypeLabel || getEmptyData()}
          </Description>
          <Description term={fieldLabels.companyStatus}>
            {companyStatusLabel || getEmptyData()}
          </Description>
          <Description term={fieldLabels.scale}>{scaleLabel || getEmptyData()}</Description>
          <Description term={fieldLabels.licenseType}>
            {licenseTypeLabel || getEmptyData()}
          </Description>
          <Description term={fieldLabels.createTime}>
            {createTime ? moment(+createTime).format('YYYY-MM-DD') : getEmptyData()}
          </Description>
          <Description term={fieldLabels.groupName}>{groupName || getEmptyData()}</Description>
          <Description term={fieldLabels.businessScope}>
            {businessScope || getEmptyData()}
          </Description>
        </DescriptionList>
      </Card>
    );
  }

  /* 渲染人员信息 */
  renderPersonalInfo() {
    const {
      company: {
        detail: {
          data: {
            legalName,
            legalPhone,
            legalEmail,
            principalName,
            principalPhone,
            principalEmail,
            safetyName,
            safetyPhone,
            safetyEmail,
          },
        },
      },
    } = this.props;
    return (
      <Fragment>
        <Card title="人员信息" bordered={false}>
          <DescriptionList title="法定代表人" col={3} style={{ marginBottom: 32 }}>
            <Description term={fieldLabels.principalName}>
              {legalName || getEmptyData()}
            </Description>
            <Description term={fieldLabels.principalPhone}>
              {legalPhone || getEmptyData()}
            </Description>
            <Description term={fieldLabels.principalEmail}>
              {legalEmail || getEmptyData()}
            </Description>
          </DescriptionList>
          <DescriptionList title="主要负责人" col={3} style={{ marginBottom: 32 }}>
            <Description term={fieldLabels.principalName}>
              {principalName || getEmptyData()}
            </Description>
            <Description term={fieldLabels.principalPhone}>
              {principalPhone || getEmptyData()}
            </Description>
            <Description term={fieldLabels.principalEmail}>
              {principalEmail || getEmptyData()}
            </Description>
          </DescriptionList>
          <DescriptionList title="安全负责人" col={3} style={{ marginBottom: 32 }}>
            <Description term={fieldLabels.principalName}>
              {safetyName || getEmptyData()}
            </Description>
            <Description term={fieldLabels.principalPhone}>
              {safetyPhone || getEmptyData()}
            </Description>
            <Description term={fieldLabels.principalEmail}>
              {safetyEmail || getEmptyData()}
            </Description>
          </DescriptionList>
        </Card>
      </Fragment>
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
          size="large"
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
    const { loading } = this.props;
    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
        wrapperClassName={styles.advancedForm}
      >
        <Spin spinning={loading}>
          {this.renderBasicInfo()}
          {this.renderMoreInfo()}
          {this.renderPersonalInfo()}
          {this.renderFooterToolbar()}
        </Spin>
      </PageHeaderLayout>
    );
  }
}
