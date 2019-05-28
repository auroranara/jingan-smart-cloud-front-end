import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Card, Button, Spin, Modal } from 'antd';
import moment from 'moment';
import { routerRedux } from 'dva/router';
import { Map, Marker } from 'react-amap';

import DescriptionList from '@/components/DescriptionList';
// import Ellipsis from '@/components/Ellipsis';
import FooterToolbar from '@/components/FooterToolbar';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import { hasAuthority } from '@/utils/customAuth';
import urls from '@/utils/urls';
import codes from '@/utils/codes';
import titles from '@/utils/titles';
import { getImportantTypes } from '../utils';

import styles from './Company.less';
import SafetyDetail from './SafetyDetail';

const { Description } = DescriptionList;

// const companyTypes = ['', '重点单位', '一般单位', '九小场所'];
const IMPORTANT_TYPES = ['否', '是'];

// 获取title
const {
  home: homeTitle,
  company: { list: listTitle, menu: menuTitle, detail: title },
} = titles;
// 获取链接地址
const {
  home: homeUrl,
  company: { list: backUrl, edit: editUrl },
  exception: { 500: exceptionUrl },
} = urls;
// 获取code
const {
  company: { edit: editCode },
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
  administrativeDivision: '行政区域',
  businessScope: '经营范围',
  code: '社会信用代码',
  companyIchnography: '单位平面图',
  fireIchnography: '消防平面图',
  companyStatus: '单位状态',
  createTime: '成立时间',
  economicType: '经济类型',
  groupName: '集团公司名称',
  companyType: '单位类型',
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
  gridId: '所属网格',
  importantSafety: '安全重点单位',
  importantHost: '消防重点单位',
};
// tab列表
const tabList = [
  {
    key: '0',
    tab: '基本信息',
  },
  {
    key: '1',
    tab: '安全信息',
  },
];
// 默认选中一般企业
const defaultCompanyNature = '一般企业';
/* 获取无数据 */
const getEmptyData = () => {
  return <span style={{ color: 'rgba(0,0,0,0.45)' }}>暂无数据</span>;
};

@connect(
  ({ company, user, loading }) => ({
    company,
    user,
    loading: loading.models.company || loading.models.safety,
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
      dispatch(routerRedux.push(editUrl + id));
    },
    // 异常
    goToException() {
      dispatch(routerRedux.push(exceptionUrl));
    },
  })
)
@Form.create()
export default class CompanyDetail extends PureComponent {
  state = {
    isCompany: true,
    tabActiveKey: tabList[0].key,
    gridId: '',
    gotMenus: false,
  };

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
      success: ({ companyNatureLabel, gridId }) => {
        this.setState({
          gridId,
          isCompany: companyNatureLabel === defaultCompanyNature,
        });
      },
      error: () => {
        goToException();
      },
    });
  }

  // 从子组件中获取值并将获取menus接口的flag置为true
  setGotMenus = (idMap, textMap) => {
    this.idMap = idMap;
    this.textMap = textMap;
    this.setState({ gotMenus: true });
  };

  // 若menus菜单已获取并且detail已获取，则取值
  getGridLabel = () => {
    const idMap = this.idMap;
    const textMap = this.textMap;
    const { gridId, gotMenus } = this.state;

    if (gridId && gotMenus && idMap[gridId]) return idMap[gridId].map(id => textMap[id]).join('-');
    return '暂无信息';
  };

  handleTabChange = key => {
    this.setState({
      tabActiveKey: key,
    });
  };

  /* 渲染行业类别 */
  renderIndustryCategory() {
    const {
      company: {
        detail: {
          data: { industryCategoryLabel },
        },
      },
    } = this.props;

    return (
      <Description term={fieldLabels.industryCategory}>
        {industryCategoryLabel || getEmptyData()}
      </Description>
    );
  }

  /* 渲染单位状态 */
  renderCompanyStatus() {
    const {
      company: {
        detail: {
          data: { companyStatusLabel },
        },
      },
    } = this.props;

    return (
      <Description term={fieldLabels.companyStatus}>
        {companyStatusLabel || getEmptyData()}
      </Description>
    );
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
            fireIchnographyDetails,
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
            companyType,
          },
        },
      },
    } = this.props;
    const { isCompany, gridLabel } = this.state;

    const [importantHost, importantSafety] = getImportantTypes(companyType);

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
    // console.log(typeof companyIchnographyList);

    let fireIchnographyList = fireIchnographyDetails ? fireIchnographyDetails : [];
    // fireIchnographyList 肯定为true
    // fireIchnographyList = fireIchnographyList ? fireIchnographyList : fireIchnographyList.dbUrl;

    return (
      <Card title="基础信息" className={styles.card} bordered={false}>
        <DescriptionList col={3} style={{ marginBottom: 16 }}>
          <Description term={fieldLabels.name}>{name || getEmptyData()}</Description>
          <Description term={fieldLabels.companyNature}>
            {companyNatureLabel || getEmptyData()}
          </Description>
          <Description term={fieldLabels.code}>{code || getEmptyData()}</Description>
          <Description term={fieldLabels.coordinate}>
            {longitude && latitude ? `${longitude},${latitude}` : getEmptyData()}
          </Description>
          {!isCompany && this.renderIndustryCategory()}
          {!isCompany && this.renderCompanyStatus()}
        </DescriptionList>
        <DescriptionList col={1} style={{ marginBottom: 16 }}>
          <Description term={fieldLabels.gridId}>{this.getGridLabel()}</Description>
          <Description term={fieldLabels.registerAddress} style={{ height: 38 }}>
            {/* <Ellipsis tooltip lines={1} className={styles.ellipsisText}> */}
            {registerAddressLabel || getEmptyData()}
            {/* </Ellipsis> */}
          </Description>
          <Description term={fieldLabels.practicalAddress} style={{ height: 38 }}>
            {/* <Ellipsis tooltip lines={1} className={styles.ellipsisText}> */}
            {practicalAddressLabel || getEmptyData()}
            {/* </Ellipsis> */}
          </Description>
        </DescriptionList>
        <DescriptionList col={3} style={{ marginBottom: 16 }}>
          <Description term={fieldLabels.importantHost}>
            {IMPORTANT_TYPES[importantHost]}
          </Description>
          <Description term={fieldLabels.importantSafety}>
            {IMPORTANT_TYPES[importantSafety]}
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
          <Description term={fieldLabels.fireIchnography}>
            {fireIchnographyList.length !== 0
              ? fireIchnographyList.map(({ fileName, webUrl }, index) => (
                  <div key={webUrl}>
                    <a href={webUrl} target="_blank" rel="noopener noreferrer">
                      {fileName || '预览'}
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
      company: {
        detail: {
          data: { longitude, latitude },
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
      company: {
        detail: {
          data: {
            economicTypeLabel,
            scaleLabel,
            licenseTypeLabel,
            createTime,
            groupName,
            businessScope,
            companyTypeLabel,
          },
        },
      },
    } = this.props;

    return (
      <Card title="更多信息" className={styles.card} bordered={false}>
        <DescriptionList col={3}>
          {this.renderIndustryCategory()}
          <Description term={fieldLabels.economicType}>
            {economicTypeLabel || getEmptyData()}
          </Description>
          {this.renderCompanyStatus()}
          {/* <Description term={fieldLabels.companyType}>
            {companyTypeLabel || getEmptyData()}
          </Description> */}
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
          <DescriptionList title="安全管理员" col={3} style={{ marginBottom: 32 }}>
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
      match: {
        params: { id },
      },
    } = this.props;
    const { tabActiveKey, isCompany } = this.state;
    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
        tabList={tabList}
        onTabChange={this.handleTabChange}
        tabActiveKey={tabActiveKey}
        wrapperClassName={styles.advancedForm}
      >
        <Spin spinning={loading}>
          <div style={{ display: tabActiveKey === tabList[0].key ? 'block' : 'none' }}>
            {this.renderBasicInfo()}
            {this.renderMap()}
            {isCompany && this.renderMoreInfo()}
            {this.renderPersonalInfo()}
            {this.renderFooterToolbar()}
          </div>
          <div style={{ display: tabActiveKey === tabList[1].key ? 'block' : 'none' }}>
            <SafetyDetail companyId={id} setGotMenus={this.setGotMenus} />
          </div>
        </Spin>
      </PageHeaderLayout>
    );
  }
}
