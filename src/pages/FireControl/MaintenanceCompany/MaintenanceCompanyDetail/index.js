import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Card, Button, Spin } from 'antd';
import moment from 'moment';
import router from "umi/router";
import { Map, Marker } from 'react-amap';

import DescriptionList from '@/components/DescriptionList';
import Ellipsis from '@/components/Ellipsis';
import FooterToolbar from '@/components/FooterToolbar';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import { hasAuthority } from '@/utils/customAuth';
import urls from '@/utils/urls';
import codes from '@/utils/codes';
import titles from '@/utils/titles';

import styles from './index.less';

const { Description } = DescriptionList;

// 获取title
const {
  home: homeTitle,
  maintenance: { list: listTitle, menu: menuTitle, detail: title },
} = titles;
// 获取链接地址
const {
  home: homeUrl,
  maintenance: { list: backUrl, edit: editUrl },
} = urls;
// 获取code
const {
  maintenanceCompany: { edit: editCode },
} = codes;
// 面包屑
const breadcrumbList = [
  {
    title: homeTitle,
    name: homeTitle,
    href: homeUrl,
  },
  {
    title: menuTitle,
    name: menuTitle,
  },
  {
    title: listTitle,
    name: listTitle,
    href: backUrl,
  },
  {
    title,
    name: title,
  },
];
/* 表单标签 */
const fieldLabels = {
  name: '单位名称',
  businessScope: '经营范围',
  code: '社会信用代码',
  companyIchnography: '单位平面图',
  companyStatus: '单位状态',
  companyType: '单位类型',
  createTime: '成立时间',
  economicType: '经济类型',
  industryCategory: '行业类别',
  coordinate: '经纬度',
  licenseType: '营业执照类别',
  practicalAddress: '实际经营地址',
  registerAddress: '注册地址',
  scale: '规模情况',
  principalName: '姓名',
  principalPhone: '联系方式',
  principalEmail: '邮箱',
  companyNature: '单位性质',
  isBranch: '是否为分公司',
  parentId: '总公司',
};
/* 获取无数据 */
const getEmptyData = () => {
  return <span style={{ color: 'rgba(0,0,0,0.45)' }}>暂无数据</span>;
};

@connect(
  ({ maintenanceCompany, user, loading }) => ({
    maintenanceCompany,
    user,
    loading: loading.models.maintenanceCompany,
  }),
  dispatch => ({
    // 获取详情
    fetchDetail(action) {
      dispatch({
        type: 'maintenanceCompany/fetchDetail',
        ...action,
      });
    },
    // 跳转到编辑页面
    goToEdit(id) {
      router.push(editUrl + id);
    },
  })
)
@Form.create()
export default class App extends PureComponent {
  /* 生命周期函数 */
  componentDidMount() {
    const {
      fetchDetail,
      match: {
        params: { id },
      },
    } = this.props;
    // 获取详情
    fetchDetail({
      payload: {
        id,
      },
    });
  }

  /* 渲染基础信息 */
  renderBasicInfo() {
    const {
      maintenanceCompany: {
        detail: {
          companyBasicInfo: {
            name,
            code,
            longitude,
            latitude,
            companyIchnography,
            companyNatureLabel,
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
          } = {},
          parentUnitName,
          isBranch,
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

    let companyIchnographyList = companyIchnography ? JSON.parse(companyIchnography) : [];
    companyIchnographyList = Array.isArray(companyIchnographyList)
      ? companyIchnographyList
      : JSON.parse(companyIchnographyList.dbUrl);

    return (
      <Card title="基础信息" className={styles.card} bordered={false}>
        <DescriptionList col={3} style={{ marginBottom: 16 }}>
          <Description term={fieldLabels.name}>
            {name || getEmptyData()}
          </Description>
          <Description term={fieldLabels.companyNature}>
            {companyNatureLabel || '一般企业'}
          </Description>
          <Description term={fieldLabels.code}>
            {code || getEmptyData()}
          </Description>
          <Description term={fieldLabels.coordinate}>
            {longitude && latitude ? `${longitude},${latitude}` : (
              getEmptyData()
            )}
          </Description>
          <Description term={fieldLabels.isBranch}>
            {+isBranch ? '是' : '否'}
          </Description>
          {!!+isBranch && (
            <Description term={fieldLabels.parentId}>
              {parentUnitName || getEmptyData()}
            </Description>
          )}
          <Description term={fieldLabels.registerAddress} style={{ height: 38 }}>
            <Ellipsis tooltip lines={1} className={styles.ellipsisText}>
              {registerAddressLabel || getEmptyData()}
            </Ellipsis>
          </Description>
          <Description term={fieldLabels.practicalAddress} style={{ height: 38 }}>
            <Ellipsis tooltip lines={1} className={styles.ellipsisText}>
              {practicalAddressLabel || getEmptyData()}
            </Ellipsis>
          </Description>
        </DescriptionList>
        <DescriptionList col={1} style={{ marginBottom: 20 }}>
          <Description term={fieldLabels.companyIchnography}>
            {companyIchnographyList.length !== 0
              ? companyIchnographyList.map(({ name, url }) => (
                <div key={url}>
                  <a href={url} target="_blank" rel="noopener noreferrer">
                    {name || '预览'}
                  </a>
                </div>
              ))
              : getEmptyData()}
          </Description>
        </DescriptionList>
      </Card>
    );
  }

  /**
   * 渲染地图
   */
  renderMap() {
    const {
      maintenanceCompany: {
        detail: {
          companyBasicInfo: {
            longitude,
            latitude,
          } = {},
        },
      },
    } = this.props;
    const center = longitude && latitude ? { longitude, latitude } : undefined;

    return (
      <Card title="位置信息" className={`${styles.card} ${styles.mapCard}`} bordered={false}>
        <Map
          amapkey="08390761c9e9bcedbdb2f18a2a815541"
          plugins={['Scale', { name: 'ToolBar', options: { locate: false } }]}
          status={{
            keyboardEnable: false,
          }}
          center={center}
          useAMapUI
          scrollWheel={false}
        >
          {center && <Marker position={center} />}
        </Map>
      </Card>
    );
  }

  /* 渲染更多信息 */
  renderMoreInfo() {
    const {
      maintenanceCompany: {
        detail: {
          companyBasicInfo: {
            economicTypeLabel,
            scaleLabel,
            licenseTypeLabel,
            createTime,
            businessScope,
            companyTypeLable,
            industryCategoryLabel,
            companyStatusLabel,
          } = {},
        },
      },
    } = this.props;

    return (
      <Card title="更多信息" className={styles.card} bordered={false}>
        <DescriptionList col={3}>
          {/* <Description term={fieldLabels.industryCategory}>
            <Ellipsis tooltip lines={1} className={styles.ellipsisText}>
              {industryCategoryLabel || getEmptyData()}
            </Ellipsis>
          </Description>
          <Description term={fieldLabels.economicType}>
            {economicTypeLabel || getEmptyData()}
          </Description> */}
          <Description term={fieldLabels.companyStatus}>
            {companyStatusLabel || getEmptyData()}
          </Description>
          {/* <Description term={fieldLabels.companyType}>
            {companyTypeLable || getEmptyData()}
          </Description> */}
          <Description term={fieldLabels.scale}>
            {scaleLabel || getEmptyData()}
          </Description>
          <Description term={fieldLabels.licenseType}>
            {licenseTypeLabel || getEmptyData()}
          </Description>
          <Description term={fieldLabels.createTime}>
            {createTime ? moment(+createTime).format('YYYY-MM-DD') : getEmptyData()}
          </Description>
          <Description term={fieldLabels.businessScope}>
            <Ellipsis tooltip lines={1} className={styles.ellipsisText}>
              {businessScope || getEmptyData()}
            </Ellipsis>
          </Description>
        </DescriptionList>
      </Card>
    );
  }

  /* 渲染人员信息 */
  renderPersonalInfo() {
    const {
      maintenanceCompany: {
        detail: {
          principalName,
          principalPhone,
          principalEmail,
          companyBasicInfo: {
            legalName,
            legalPhone,
            legalEmail,
            safetyName,
            safetyPhone,
            safetyEmail,
          } = {},
        },
      },
    } = this.props;
    return (
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
    );
  }

  /* 渲染底部工具栏 */
  renderFooterToolbar() {
    const {
      goToEdit,
      match: {
        params: { id },
      },
      user: {
        currentUser: { permissionCodes },
      },
    } = this.props;
    // 是否有编辑权限
    const hasEditAuthority = hasAuthority(editCode, permissionCodes);

    return (
      <FooterToolbar>
        <Button
          type="primary"
          size="large"
          disabled={!hasEditAuthority}
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
    const {
      loading,
    } = this.props;

    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
        wrapperClassName={styles.advancedForm}
      >
        <Spin spinning={loading}>
          {this.renderBasicInfo()}
          {this.renderMap()}
          {this.renderMoreInfo()}
          {this.renderPersonalInfo()}
          {this.renderFooterToolbar()}
        </Spin>
      </PageHeaderLayout>
    );
  }
}
