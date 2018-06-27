import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Card, Button, Spin } from 'antd';
import moment from 'moment';
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
  createTime: '成立时间',
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
  })
)
@Form.create()
export default class CompanyDetail extends PureComponent {
  state = {
    loading: true,
  };

  /* 生命周期函数 */
  componentWillMount() {
    const {
      fetchCompany,
      match: {
        params: { id },
      },
    } = this.props;
    // 获取详情
    fetchCompany({
      payload: {
        id,
      },
      success: () => {
        this.setState({
          loading: false,
        });
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
            registerAddress,
            code,
            practicalAddress,
            longitude,
            latitude,
            provinceLabel,
            cityLabel,
            districtLabel,
            townLabel,
            companyIchnography,
          },
        },
      },
    } = this.props;

    const administrativeDivision =
      (provinceLabel || '') + (cityLabel || '') + (districtLabel || '') + (townLabel || '');

    return (
      <Card title="基础信息" className={styles.card} bordered={false}>
        <DescriptionList col={3}>
          <Description term={fieldLabels.name}>{name || getEmptyData()}</Description>
          <Description term={fieldLabels.registerAddress}>
            {registerAddress || getEmptyData()}
          </Description>
          <Description term={fieldLabels.code}>{code || getEmptyData()}</Description>
          <Description term={fieldLabels.practicalAddress}>
            {practicalAddress || getEmptyData()}
          </Description>
          <Description term={fieldLabels.longitude}>{longitude || getEmptyData()}</Description>
          <Description term={fieldLabels.latitude}>{latitude || getEmptyData()}</Description>
          <Description term={fieldLabels.administrativeDivision}>
            {administrativeDivision || getEmptyData()}
          </Description>
          <Description term={fieldLabels.companyIchnography}>
            {(companyIchnography && (
              <a href={companyIchnography} target="_bland">
                预览
              </a>
            )) ||
              getEmptyData()}
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
            {createTime ? moment(createTime).format('YYYY-MM-DD') : getEmptyData()}
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
        detail: {
          data: { maintenanceUnitName, maintenanceContract },
        },
      },
    } = this.props;

    return (
      <Card title="其他信息" className={styles.card} bordered={false}>
        <DescriptionList col={3}>
          <Description term={fieldLabels.maintenanceId}>
            {maintenanceUnitName || getEmptyData()}
          </Description>
          <Description term={fieldLabels.maintenanceContract}>
            {(maintenanceContract && (
              <a href={maintenanceContract} target="_bland">
                预览
              </a>
            )) ||
              getEmptyData()}
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
    const { loading } = this.state;
    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
        wrapperClassName={styles.advancedForm}
      >
        <Spin spinning={loading}>
          {this.renderBasicInfo()}
          {this.renderMoreInfo()}
          {/* {this.renderPersonalInfo()} */}
          {this.renderOtherInfo()}
          {this.renderFooterToolbar()}
        </Spin>
      </PageHeaderLayout>
    );
  }
}
