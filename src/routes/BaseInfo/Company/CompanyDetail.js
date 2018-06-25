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
      success: data => {
        console.log(data);
        // 判断字典是否有值，有值的话根据id获取对应的值
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
            province,
            city,
            district,
            town,
            companyIchnography,
          },
        },
      },
    } = this.props;

    const administrativeDivision = province + city + district + town;

    return (
      <Card title="基础信息" className={styles.card} bordered={false}>
        <DescriptionList>
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
            industryCategory,
            economicType,
            companyStatus,
            scale,
            licenseType,
            createDate,
            groupName,
            businessScope,
          },
        },
      },
    } = this.props;

    return (
      <Card title="更多信息" className={styles.card} bordered={false}>
        <DescriptionList>
          <Description term={fieldLabels.industryCategory}>
            {industryCategory || getEmptyData()}
          </Description>
          <Description term={fieldLabels.economicType}>
            {economicType || getEmptyData()}
          </Description>
          <Description term={fieldLabels.companyStatus}>
            {companyStatus || getEmptyData()}
          </Description>
          <Description term={fieldLabels.scale}>{scale || getEmptyData()}</Description>
          <Description term={fieldLabels.licenseType}>{licenseType || getEmptyData()}</Description>
          <Description term={fieldLabels.createDate}>{createDate || getEmptyData()}</Description>
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
          data: { maintenanceId, maintenanceContract },
        },
      },
    } = this.props;

    return (
      <Card title="其他信息" className={styles.card} bordered={false}>
        <DescriptionList>
          <Description term={fieldLabels.maintenanceId}>
            {maintenanceId || getEmptyData()}
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
