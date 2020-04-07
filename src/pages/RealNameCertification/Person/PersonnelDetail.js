import React, { Component, Fragment } from 'react';
import { Spin, Card, Button } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import CustomForm from '@/jingan-components/CustomForm';
import ImagePreview from '@/jingan-components/ImagePreview';
import { connect } from 'dva';
import router from 'umi/router';

const title = '查看人员信息';

const BUTTON_WRAPPER_SPAN = {
  sm: 24,
  xs: 24,
};
const SPAN = { sm: 24, xs: 24 };
const LABELCOL = { span: 6 };
const WRAPPERCOL = { span: 13 };
const NO_DATA = '暂无数据';

const getPersonType = {
  4: '操作人员',
  5: '管理人员',
  6: '安全巡查人员',
  1: '外协人员',
  2: '临时人员',
};

const getEducation = {
  1: '初中',
  2: '高中',
  3: '中专',
  4: '大专',
  5: '本科',
  6: '硕士',
  7: '博士',
};
@connect(({ realNameCertification, loading, user }) => ({
  realNameCertification,
  user,
  loading: loading.models.realNameCertification,
}))
export default class PersonnelDetail extends Component {
  state = {
    detail: {},
    images: [],
    currentImage: 0,
  };

  componentDidMount() {
    this.getDetail();
  }

  getDetail = () => {
    const {
      dispatch,
      match: { params: { id = null } = {} },
    } = this.props;
    dispatch({
      type: 'realNameCertification/fetchDetail',
      payload: {
        pageNum: 1,
        pageSize: 10,
        id,
      },
      callback: detail => {
        this.setState({ detail, perType: detail.personType });
      },
    });
  };

  handleBackButtonClick = () => {
    const {
      location: {
        query: { companyName: routerCompanyName, companyId },
      },
      user: {
        currentUser: { companyName },
      },
    } = this.props;
    router.push(
      `/real-name-certification/personnel-management/person-list/${companyId}?companyName=${routerCompanyName ||
        companyName}`
    );
  };

  render() {
    const {
      user: {
        currentUser: { unitType },
      },
      location: {
        query: { companyName: routerCompanyName, companyId },
      },
      user: {
        currentUser: { companyName },
      },
      loading,
    } = this.props;

    const { detail, images, currentImage } = this.state;
    const noCompanyName = detail.perType === '2' || detail.perType === '3';

    const dspItems = [
      { id: 'name', label: '姓名' },
      {
        id: 'workerNumber',
        label: '职工号',
        render: ({ workerNumber }) => workerNumber || NO_DATA,
      },
      {
        id: 'sex',
        label: '性别',
        render: ({ sex }) => (+sex === 1 ? '女' : '男'),
      },
      { id: 'telephone', label: '手机号', render: ({ telephone }) => telephone || NO_DATA },
      {
        id: 'personType',
        label: '人员类型',
        render: ({ personType }) => getPersonType[personType],
      },
      { id: 'partName', label: '部门' },
      ...(noCompanyName ? { id: 'personCompany', label: '单位名称' } : []),
      { id: 'icnumber', label: 'IC卡号', render: ({ icnumber }) => icnumber || NO_DATA },
      {
        id: 'entranceNumber',
        label: 'SN卡号',
        render: ({ entranceNumber }) => entranceNumber || NO_DATA,
      },
      {
        id: 'photoDetails',
        label: '人脸照',
        render: ({ photoDetails }) =>
          Array.isArray(photoDetails) ? (
            <div>
              {photoDetails !== null &&
                photoDetails.map((item, i) => (
                  <img
                    onClick={() => {
                      this.setState({
                        images: photoDetails.map(item => item.webUrl),
                        currentImage: i,
                      });
                    }}
                    style={{
                      width: '50px',
                      height: '50px',
                      objectFit: 'contain',
                      cursor: 'pointer',
                      margin: '5px',
                    }}
                    key={i}
                    src={item.webUrl}
                    alt="照片"
                  />
                ))}
            </div>
          ) : (
            NO_DATA
          ),
      },
      {
        id: 'education',
        label: '学历',
        render: ({ education }) => (education ? getEducation[education] : NO_DATA),
      },
      {
        id: 'educationCertificateDetails',
        label: '学历证书',
        render: ({ educationCertificateDetails }) =>
          Array.isArray(educationCertificateDetails) ? (
            <div>
              {educationCertificateDetails !== null &&
                educationCertificateDetails.map((item, i) => (
                  <img
                    onClick={() => {
                      this.setState({
                        images: educationCertificateDetails.map(item => item.webUrl),
                        currentImage: i,
                      });
                    }}
                    style={{
                      width: '50px',
                      height: '50px',
                      objectFit: 'contain',
                      cursor: 'pointer',
                      margin: '5px',
                    }}
                    key={i}
                    src={item.webUrl}
                    alt="照片"
                  />
                ))}
            </div>
          ) : (
            NO_DATA
          ),
      },
    ];
    const items = dspItems;
    const fields = items.map(item => {
      const { id, render } = item;
      return {
        ...item,
        span: SPAN,
        labelCol: LABELCOL,
        wrapperCol: WRAPPERCOL,
        render:
          render && typeof render === 'function'
            ? () => <span>{render(detail)}</span>
            : () => <span>{detail[id]}</span>,
      };
    });

    const BREADCRUMB = [
      {
        title: '首页',
        name: '首页',
        href: '/',
      },
      {
        title: '实名制认证系统',
        name: '实名制认证系统',
      },
      {
        title: '人员管理',
        name: '人员管理',
        href: `/real-name-certification/personnel-management/person-list/${companyId}?companyName=${routerCompanyName ||
          companyName}`,
      },
      {
        title,
        name: title,
      },
    ];

    return (
      <PageHeaderLayout title={title} breadcrumbList={BREADCRUMB}>
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
                    type="primary"
                    onClick={e =>
                      router.push(
                        `/real-name-certification/personnel-management/edit/${
                          detail.id
                        }?companyId=${companyId}&&companyName=${companyName}`
                      )
                    }
                  >
                    编辑
                  </Button>
                  <Button onClick={this.handleBackButtonClick}>返回</Button>
                </Fragment>
              }
            />
          </Card>
          <ImagePreview images={images} currentImage={currentImage} />
        </Spin>
      </PageHeaderLayout>
    );
  }
}
