import React, { Component, Fragment } from 'react';
import { Icon as LegacyIcon } from '@ant-design/compatible';
import { Button, Spin, message, TreeSelect, Upload, Popover } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import CustomForm from '@/jingan-components/CustomForm';
import CompanySelect from '@/jingan-components/CompanySelect';
import SelectOrSpan from '@/jingan-components/SelectOrSpan';
import DatePickerOrSpan from '@/jingan-components/DatePickerOrSpan';
import InputOrSpan from '@/jingan-components/InputOrSpan';
import RadioOrSpan from '@/jingan-components/RadioOrSpan';
import FooterToolbar from '@/components/FooterToolbar';
import { getToken } from 'utils/authority';
import { getFileList } from '@/pages/BaseInfo/utils';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import debounce from 'lodash-decorators/debounce';
import bind from 'lodash-decorators/bind';
import { isNumber } from '@/utils/utils';
import { ADD_CODE, LIST_PATH, EDIT_PATH } from '../List';
import { ORGIN_PATH, STATUS } from './index';
import styles from './Other.less';

const { TreeNode } = TreeSelect;
const SPAN = { span: 24 };
const LABEL_COL = { span: 4 };
const GET_DETAIL = 'productionFacility/getDetail';
const ADD = 'productionFacility/checkAdd';
const EDIT = 'productionFacility/edit';
const GET_COMPANY = 'productionFacility/getCompany';
const DEFAULT_FORMAT = 'YYYY-MM-DD';
const ISSELFCOMPANY = [{ key: '0', value: '本单位' }, { key: '1', value: '外部单位' }];

// 上传文件地址
const uploadAction = '/acloud_new/v2/uploadFile';
// 上传文件夹
const folder = 'productionFacility';
const defaultUploadProps = {
  name: 'files',
  data: { folder },
  multiple: true,
  action: uploadAction,
  headers: { 'JA-Token': getToken() },
};

@connect(
  ({ productionFacility, user, loading }) => ({
    productionFacility,
    user,
    loading: loading.effects[GET_DETAIL],
  }),
  dispatch => ({
    getDetail(payload, callback) {
      dispatch({
        type: GET_DETAIL,
        payload,
        callback,
      });
    },
    setDetail() {
      dispatch({
        type: 'productionFacility/save',
        payload: {
          detail: {},
        },
      });
    },
    checkAdd(payload, callback) {
      dispatch({
        type: ADD,
        payload: {
          ...payload,
        },
        callback,
      });
    },
    edit(payload, callback) {
      dispatch({
        type: EDIT,
        payload,
        callback,
      });
    },
    getCompany(payload, callback) {
      dispatch({
        type: GET_COMPANY,
        payload,
        callback,
      });
    },
  })
)
export default class InjuryReportOther extends Component {
  state = {
    submitting: false,
    fileList: [],
    uploading: false,
    companyId: undefined,
    companyName: '',
  };

  componentDidMount() {
    const {
      match: {
        params: { id },
      },
      getDetail,
    } = this.props;
    getDetail &&
      getDetail({ id }, (success, data) => {
        if (success) {
          const { companyId, companyName } = data || {};
          this.setState({ companyId, companyName });
        }
      });
  }

  componentWillUnmount() {
    const { setDetail } = this.props;
    setDetail && setDetail();
  }

  getType = () => {
    const {
      route: { name },
    } = this.props;

    return name;
  };

  getTitle = type => {
    return { checkAdd: '新增检测记录', detail: '检测记录详情', edit: '编辑检测记录' }[type];
  };

  getBreadcrumbList = title => {
    const {
      match: {
        params: { id },
      },
    } = this.props;
    return [
      { title: '首页', name: '首页', href: '/' },
      { title: '设备设施管理', name: '设备设施管理' },
      {
        title: '生产设施',
        name: '生产设施',
        href: LIST_PATH,
      },
      { title: '检测记录', name: '检测记录', href: `${ORGIN_PATH}/${id}/list` },
      { title, name: title },
    ];
  };

  setFormReference = form => {
    this.form = form;
  };

  @bind()
  @debounce(300)
  refresh() {
    this.forceUpdate();
  }

  // 返回按钮点击事件
  handleBackButtonClick = () => {
    router.goBack();
  };

  // 提交按钮点击事件
  handleSubmitButtonClick = () => {
    const {
      checkAdd,
      match: {
        params: { id },
      },
    } = this.props;
    const { validateFieldsAndScroll } = this.form;
    const { fileList, companyId } = this.state;
    validateFieldsAndScroll((errors, values) => {
      if (!errors) {
        const { checkUnit, checkUnitName, ...rest } = values;
        const payload = {
          facilityId: id,
          checkFileList: fileList.map(({ name, url, dbUrl }) => ({
            fileName: name,
            webUrl: url,
            dbUrl,
            name,
          })),
          ...rest,
          checkFile: undefined,
          checkUnit,
          checkUnitName: checkUnit === '0' ? companyId : checkUnitName,
        };
        this.setState({ submitting: true });
        checkAdd(payload, success => {
          if (success) {
            message.success(`新增成功！`);
            router.push(`${ORGIN_PATH}/${id}/list`);
          } else {
            message.error(`新增失败，请稍后重试！`);
            this.setState({
              submitting: false,
            });
          }
        });
      }
    });
  };

  // 编辑按钮点击事件
  handleEditButtonClick = () => {
    const {
      match: {
        params: { id },
      },
    } = this.props;
    router.push(`${EDIT_PATH}${EDIT_PATH.endsWith('/') ? id : `/${id}`}`);
    window.scrollTo(0, 0);
  };

  // 企业发生变化
  handleCompanyChange = company => {
    if (company && company.key !== company.label) {
      const { getCompany } = this.props;
      getCompany(
        {
          id: company.key,
        },
        (success, data) => {
          if (success) {
          }
          // 如果失败怎么办，还没有想好
        }
      );
    }
  };

  renderTreeNodes = dict =>
    dict.map(
      ({ key, value, children }) =>
        children ? (
          <TreeNode title={value} key={key} value={key}>
            {this.renderTreeNodes(children)}
          </TreeNode>
        ) : (
          <TreeNode title={value} key={key} value={key} />
        )
    );

  // 上传附件
  handleFileChange = ({ fileList, file }) => {
    if (file.status === 'done') {
      let fList = [...fileList];
      if (file.response.code === 200) {
        message.success('上传成功');
      } else {
        message.error('上传失败');
        fList.splice(-1, 1);
      }
      fList = getFileList(fList);
      this.setState({ fileList: fList, uploading: false });
    } else {
      if (file.status === 'uploading') this.setState({ uploading: true });
      // 其他情况，直接用原文件数组
      fileList = getFileList(fileList);
      this.setState({ fileList });
    }
    return fileList;
  };

  renderForm() {
    const { fileList, uploading, companyName } = this.state;
    const type = this.getType();
    const isNotDetail = type !== 'detail';
    const values = (this.form && this.form.getFieldsValue()) || {};
    const { checkUnit } = values;
    const fields = [
      {
        key: 1,
        fields: [
          {
            id: 'checkName',
            label: '检测人',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => (
              <InputOrSpan
                className={styles.item}
                placeholder="请输入检测人"
                maxLength={50}
                type={isNotDetail ? 'Input' : 'span'}
              />
            ),
            options: {
              rules: isNotDetail
                ? [
                    {
                      required: true,
                      whitespace: true,
                      message: '检测人不能为空',
                    },
                  ]
                : undefined,
            },
          },
          {
            id: 'checkUnit',
            label: '检测单位',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => <RadioOrSpan list={ISSELFCOMPANY} type={isNotDetail || 'span'} />,
            options: {
              rules: isNotDetail
                ? [
                    {
                      required: true,
                      message: '检测单位不能为空',
                    },
                  ]
                : undefined,
            },
          },
          ...(checkUnit === '0'
            ? [
                {
                  id: 'checkUnitName',
                  label: '检测单位名称',
                  span: SPAN,
                  labelCol: LABEL_COL,
                  render: () => <span>{companyName}</span>,
                },
              ]
            : []),
          ...(checkUnit === '1'
            ? [
                {
                  id: 'checkUnitName',
                  label: '检测单位名称',
                  span: SPAN,
                  labelCol: LABEL_COL,
                  render: () => (
                    <InputOrSpan
                      className={styles.item}
                      placeholder="请输入检测单位名称"
                      maxLength={50}
                      type={isNotDetail ? 'Input' : 'span'}
                    />
                  ),
                  options: {
                    rules: isNotDetail
                      ? [
                          {
                            required: true,
                            whitespace: true,
                            message: '检测单位名称不能为空',
                          },
                        ]
                      : undefined,
                  },
                },
              ]
            : []),
          {
            id: 'checkDate',
            label: '检测日期',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => (
              <DatePickerOrSpan
                className={styles.item}
                type={isNotDetail ? 'DatePicker' : 'span'}
                format={DEFAULT_FORMAT}
                placeholder="请选择检测日期"
                allowClear={false}
              />
            ),
            options: {
              rules: isNotDetail
                ? [
                    {
                      required: true,
                      message: '检测日期不能为空',
                    },
                  ]
                : undefined,
            },
          },
          {
            id: 'checkReason',
            label: '检测内容',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => (
              <InputOrSpan
                className={styles.item}
                placeholder="请输入检测内容"
                type={isNotDetail ? 'TextArea' : 'span'}
                autosize={{ minRows: 3 }}
              />
            ),
          },
          {
            id: 'checkResult',
            label: '检测结果',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => (
              <InputOrSpan
                className={styles.item}
                placeholder="请输入检测结果"
                type={isNotDetail ? 'TextArea' : 'span'}
                autosize={{ minRows: 3 }}
              />
            ),
          },
          {
            id: 'checkStatus',
            label: '检测状态',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => <RadioOrSpan list={STATUS} type={isNotDetail || 'span'} />,
            options: {
              rules: isNotDetail
                ? [
                    {
                      required: true,
                      message: '检测状态不能为空',
                    },
                  ]
                : undefined,
            },
          },
          {
            id: 'checkFile',
            label: '检测报告',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () =>
              isNotDetail ? (
                <div>
                  <Upload
                    {...defaultUploadProps}
                    fileList={fileList}
                    onChange={this.handleFileChange}
                  >
                    <Button type="dashed" style={{ width: '96px', height: '96px' }}>
                      <LegacyIcon type="plus" style={{ fontSize: '32px' }} />
                      <div style={{ marginTop: '8px' }}>点击上传</div>
                    </Button>
                  </Upload>
                  {/* <div>支持扩展名：.rar .zip .doc .docx .pdf .jpg...</div> */}
                </div>
              ) : (
                <Fragment>
                  {fileList.map(item => {
                    const { fileName, url, id } = item;
                    const fileNames = fileName.split('.');
                    const name = fileNames.slice(0, fileNames.length - 1).join('.');
                    return (
                      <div key={id}>
                        <a href={url} target="_blank" rel="noopener noreferrer">
                          {name}
                        </a>
                      </div>
                    );
                  })}
                </Fragment>
              ),
          },
        ],
      },
    ];

    return (
      <CustomForm
        mode="multiple"
        fields={fields}
        searchable={false}
        resetable={false}
        ref={this.setFormReference}
        refresh={this.refresh}
        action={
          <Fragment>
            <Button onClick={this.handleBackButtonClick}>返回</Button>
            <Button type="primary" onClick={this.handleSubmitButtonClick} loading={uploading}>
              提交
            </Button>
          </Fragment>
        }
      />
    );
  }

  render() {
    const { loading } = this.props;
    const { submitting } = this.state;
    const type = this.getType();
    const title = this.getTitle(type);
    const breadcrumbList = this.getBreadcrumbList(title);

    return (
      <PageHeaderLayout title={title} breadcrumbList={breadcrumbList} key={type}>
        <Spin spinning={loading || submitting || false}>{this.renderForm()}</Spin>
      </PageHeaderLayout>
    );
  }
}
