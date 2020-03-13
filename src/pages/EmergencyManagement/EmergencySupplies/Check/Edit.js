import React, { Component, Fragment } from 'react';
import { Button, Spin, message, Upload, Icon } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import CustomForm from '@/jingan-components/CustomForm';
import SelectOrSpan from '@/jingan-components/SelectOrSpan';
import DatePickerOrSpan from '@/jingan-components/DatePickerOrSpan';
import InputOrSpan from '@/jingan-components/InputOrSpan';
import RadioOrSpan from '@/jingan-components/RadioOrSpan';
import { getToken } from 'utils/authority';
import { getFileList } from '@/pages/BaseInfo/utils';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import debounce from 'lodash-decorators/debounce';
import bind from 'lodash-decorators/bind';
import { EDIT_CODE, ADD_CODE, DETAIL_CODE, ORGIN_PATH, CHECKINFO, PATH } from './index';
import styles from './Edit.less';

const SPAN = { span: 24 };
const LABEL_COL = { span: 4 };
const GET_DETAIL = 'emergencyManagement/fetchMaterialmentCheckDetail';
const ADD = 'emergencyManagement/addMaterialmentCheck';
const EDIT = 'emergencyManagement/editMaterialmentCheck';
const DEFAULT_FORMAT = 'YYYY-MM-DD';

// 上传文件地址
const uploadAction = '/acloud_new/v2/uploadFile';
// 上传文件夹
const folder = 'emergency';
const defaultUploadProps = {
  name: 'files',
  data: { folder },
  multiple: true,
  action: uploadAction,
  headers: { 'JA-Token': getToken() },
};

@connect(
  ({ user, loading, emergencyManagement }) => ({
    user,
    loading: loading.effects[GET_DETAIL],
    emergencyManagement,
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
        type: 'emergencyManagement/saveCheckDetail',
        payload: {},
      });
    },
    add(payload, callback) {
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
  })
)
export default class CheckEdit extends Component {
  state = {
    submitting: false,
    fileList: [],
    uploading: false,
  };

  componentDidMount() {
    const {
      match: {
        params: { id },
      },
      user: {
        currentUser: { permissionCodes },
      },
      getDetail,
      setDetail,
    } = this.props;
    const type = this.getType();
    const hasAddAuthority = permissionCodes.includes(ADD_CODE);
    const hasEditAuthority = permissionCodes.includes(EDIT_CODE);
    const hasDetailAuthority = permissionCodes.includes(DETAIL_CODE);
    if (
      (type === 'checkAdd' && hasAddAuthority) ||
      (type === 'checkEdit' && hasEditAuthority) ||
      (type === 'checkDetail' && hasDetailAuthority)
    ) {
      setDetail();
      if (type !== 'checkAdd') {
        // 不考虑id不存在的情况，由request来跳转到500
        getDetail &&
          getDetail({ id }, (success, data) => {
            if (success) {
              const { checkDate, checkPerson, checkInfo, checkEstimate, otherFileList } =
                data || {};
              this.form &&
                this.form.setFieldsValue({
                  checkDate: checkDate && moment(checkDate),
                  checkPerson,
                  checkInfo,
                  checkEstimate,
                });
              this.setState({
                fileList: otherFileList.map(({ id, dbUrl, webUrl, fileName }, index) => ({
                  uid: id || index,
                  fileName,
                  status: 'done',
                  name: fileName,
                  url: webUrl,
                  dbUrl,
                })),
              });
            } else {
              message.error('获取详情失败，请稍后重试或联系管理人员');
            }
          });
      }
    } else {
      router.replace('/404');
    }
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
    return { checkAdd: '新增', checkDetail: '详情', checkEdit: '编辑' }[type];
  };

  getBreadcrumbList = title => {
    const {
      match: {
        params: { materialId },
      },
    } = this.props;
    return [
      { title: '首页', name: '首页', href: '/' },
      { title: '应急管理', name: '应急管理' },
      { title: '应急物资', name: '应急物资', href: ORGIN_PATH },
      { title: '检查记录', name: '检查记录', href: `${PATH}/${materialId}/list` },
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
      add,
      edit,
      match: {
        params: { materialId },
      },
      emergencyManagement: { checkDetail: { id } = {} },
    } = this.props;
    const { validateFieldsAndScroll } = this.form;
    const { fileList } = this.state;
    validateFieldsAndScroll((errors, values) => {
      if (!errors) {
        const { company, ...rest } = values;
        const payload = {
          id,
          materialId,
          otherFileList: fileList.map(({ name, url, dbUrl }) => ({
            fileName: name,
            webUrl: url,
            dbUrl,
            name,
          })),
          ...rest,
        };
        this.setState({ submitting: true });
        (id ? edit : add)(payload, success => {
          if (success) {
            message.success(`${id ? '编辑' : '新增'}成功！`);
            router.push(`${PATH}/${materialId}/list`);
          } else {
            message.error(`${id ? '编辑' : '新增'}失败，请稍后重试！`);
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
        params: { id, materialId },
      },
    } = this.props;
    router.push(`${PATH}/${materialId}/edit/${id}`);
    window.scrollTo(0, 0);
  };

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
    const {
      user: {
        currentUser: { permissionCodes },
      },
    } = this.props;
    const { fileList, uploading } = this.state;
    const type = this.getType();
    const isNotDetail = type !== 'checkDetail';
    const hasEditAuthority = permissionCodes.includes(EDIT_CODE);

    const fields = [
      {
        key: 1,
        fields: [
          {
            id: 'checkDate',
            label: '检查时间',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => (
              <DatePickerOrSpan
                className={styles.item}
                type={isNotDetail ? 'DatePicker' : 'span'}
                format={DEFAULT_FORMAT}
                placeholder="请选择检查时间"
                allowClear={false}
              />
            ),
            options: {
              rules: isNotDetail
                ? [
                    {
                      required: true,
                      type: 'object',
                      message: '检查时间不能为空',
                    },
                  ]
                : undefined,
            },
          },
          {
            id: 'checkPerson',
            label: '检查人员',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => (
              <InputOrSpan
                className={styles.item}
                placeholder="请输入检查人员"
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
                      message: '检查人员不能为空',
                    },
                  ]
                : undefined,
            },
          },
          {
            id: 'checkInfo',
            label: '检查情况',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => <RadioOrSpan list={CHECKINFO} type={isNotDetail || 'span'} />,
            options: {
              rules: isNotDetail
                ? [
                    {
                      required: true,
                      message: '检查情况不能为空',
                    },
                  ]
                : undefined,
            },
          },
          {
            id: 'checkEstimate',
            label: '检查评价',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => (
              <InputOrSpan
                className={styles.item}
                placeholder="请输入检查评价"
                type={isNotDetail ? 'TextArea' : 'span'}
                autosize={{ minRows: 3 }}
              />
            ),
          },
          {
            id: 'files',
            label: '附件',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () =>
              isNotDetail ? (
                <Upload
                  {...defaultUploadProps}
                  fileList={fileList}
                  onChange={this.handleFileChange}
                >
                  <Button
                    type="dashed"
                    style={{ width: '96px', height: '96px' }}
                    disabled={uploading}
                  >
                    <Icon type="plus" style={{ fontSize: '32px' }} />
                    <div style={{ marginTop: '8px' }}>点击上传</div>
                  </Button>
                </Upload>
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
            {type !== 'checkDetail' ? (
              <Button type="primary" onClick={this.handleSubmitButtonClick} loading={uploading}>
                提交
              </Button>
            ) : (
              <Button
                type="primary"
                onClick={this.handleEditButtonClick}
                disabled={!hasEditAuthority}
                loading={uploading}
              >
                编辑
              </Button>
            )}
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
