import React, { PureComponent } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, Card, Upload, message } from 'antd';
import moment from 'moment';
import { getToken } from '@/utils/authority';

import CompanySelect from '@/jingan-components/CompanySelect';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import { renderSections } from '@/pages/SafetyKnowledgeBase/MSDS/utils';
import { BREADCRUMBLIST, LIST_URL, PROJECT, PROGRAM, TYPE, CONCLUSION } from './utils';
import { handleFileList, getInitPhotoList, getSubmitPhotoList } from '@/pages/RoleAuthorization/AccountManagement/utils';

const flatOption = list => Array.isArray(list) ? list.map((item, index) => ({ value: index + 1, label: item })) : [];
const PROJECT_OPTION = flatOption(PROJECT);
const PROGRAM_OPTION = flatOption(PROGRAM);
const TYPE_OPTION = flatOption(TYPE);

const FOLDER = 'threeSimu';
const UPLOAD_ACTION = '/acloud_new/v2/uploadFile';

@Form.create()
@connect(({ baseInfo, user }) => ({
  baseInfo,
  user,
}))
export default class Edit extends PureComponent {

  state = {
    detail: {},
    selectedCompany: {},// 选中的企业
    safeList: [],
    safeFacilitiesList: [],
    tryList: [],
    completeList: [],
  };

  componentDidMount () {
    const {
      dispatch,
      match: { params: { id } },
      form: { setFieldsValue },
      user: { currentUser: { unitType } },
    } = this.props;
    // 是否企业登录
    const isUnit = +unitType === 4;
    if (id) {
      dispatch({
        type: 'baseInfo/fetchThreeSimultaneity',
        payload: { id, pageNum: 1, pageSize: 10 },
        callback: ({ list }) => {
          const {
            safeDate,
            safeFacilitiesDesignDate,
            tryProductdate,
            safeFacilitiesCompleteDate,
            tryProductStartdate, // 试生产开始时间
            tryProductEnddate, // 试生产结束时间
            companyId,
            companyName,
            projectName,
            projectType,
            program,
            safeType,
            safeResult,
            safeFacilitiesDesignType,
            safeFacilitiesDesignResult,
            tryProductResult,
            safeFacilitiesCompleteType,
            safeFacilitiesCompleteResult,
            safeFileList,
            safeFacilitiesDesignFileList,
            tryProductFileList,
            safeFacilitiesCompleteFileList,
          } = list[0];

          const [safeList, safeFacilitiesList, tryList, completeList] =
            [safeFileList, safeFacilitiesDesignFileList, tryProductFileList, safeFacilitiesCompleteFileList].map(getInitPhotoList);
          this.setState({
            detail: list[0] || {},
            selectedCompany: { key: companyId, label: companyName },
            safeList,
            safeFacilitiesList,
            tryList,
            completeList,
          })
          setFieldsValue({
            safeDate: safeDate ? moment(safeDate) : undefined,
            safeFacilitiesDesignDate: safeFacilitiesDesignDate ? moment(safeFacilitiesDesignDate) : undefined,
            backupRange: [tryProductStartdate ? moment(tryProductStartdate) : undefined, tryProductEnddate ? moment(tryProductEnddate) : undefined],
            tryProductdate: tryProductdate ? moment(tryProductdate) : undefined,
            safeFacilitiesCompleteDate: safeFacilitiesCompleteDate ? moment(safeFacilitiesCompleteDate) : undefined,
            company: { key: companyId, label: companyName },
            projectName,
            projectType: projectType ? +projectType : undefined,
            program: program ? +program : undefined,
            safeType: safeType ? +safeType : undefined,
            safeResult: safeResult ? +safeResult : undefined,
            safeFacilitiesDesignType: safeFacilitiesDesignType ? +safeFacilitiesDesignType : undefined,
            safeFacilitiesDesignResult: safeFacilitiesDesignResult ? +safeFacilitiesDesignResult : undefined,
            tryProductResult: tryProductResult ? +tryProductResult : undefined,
            safeFacilitiesCompleteType: safeFacilitiesCompleteType ? +safeFacilitiesCompleteType : undefined,
            safeFacilitiesCompleteResult: safeFacilitiesCompleteResult ? +safeFacilitiesCompleteResult : undefined,
          })
        },
      })
    } else if (isUnit) {
      const { companyId, companyName } = this.props.user.currentUser;
      this.setState({ selectedCompany: { key: companyId, label: companyName } })
    }
  }

  getStartTime = obj => obj ? obj.startOf('day').unix() * 1000 : obj;

  getEndTime = obj => obj ? obj.endOf('day').unix() * 1000 : obj;

  handleSubmit = (e) => {
    const {
      dispatch,
      form: { validateFields },
      match: { params: { id } },
    } = this.props;
    const { selectedCompany, safeList, safeFacilitiesList, tryList, completeList } = this.state;
    const [safeFileList, safeFacilitiesDesignFileList, tryProductFileList, safeFacilitiesCompleteFileList] =
      [safeList, safeFacilitiesList, tryList, completeList].map(getSubmitPhotoList);

    e.preventDefault();
    validateFields((err, values) => {
      if (err) return;
      const {
        safeDate,
        safeFacilitiesDesignDate,
        backupRange, // 试生产日期
        tryProductdate,
        safeFacilitiesCompleteDate,
        company, // { key,label } 企业信息
        ...resValues
      } = values;
      const [startDate, endDate] = backupRange || [];
      const payload = {
        ...resValues,
        safeDate: this.getStartTime(safeDate),
        safeFacilitiesDesignDate: this.getStartTime(safeFacilitiesDesignDate),
        tryProductdate: this.getStartTime(tryProductdate),
        safeFacilitiesCompleteDate: this.getStartTime(safeFacilitiesCompleteDate),
        tryProductStartdate: this.getStartTime(startDate),
        tryProductEnddate: this.getEndTime(endDate),
        companyId: company ? company.key : selectedCompany.key,
        safeFileList,
        safeFacilitiesDesignFileList,
        tryProductFileList,
        safeFacilitiesCompleteFileList,
      };
      const tag = id ? '编辑' : '新增';
      const success = () => {
        message.success(`${tag}成功`)
        router.push(LIST_URL);
      };
      const error = res => { message.error(res ? res.msg : `${tag}失败`) };
      if (id) {
        // 如果编辑
        dispatch({
          type: 'baseInfo/editThreeSimultaneity',
          payload: { ...payload, id },
          success,
          error,
        })
      } else {
        // 新增
        dispatch({
          type: 'baseInfo/addThreeSimultaneity',
          payload,
          success,
          error,
        })
      }
    });
  };

  isDetail = () => {
    const { match: { url } } = this.props;
    return url && url.includes('detail');
  };

  validateCompany = (rule, value, callback) => {
    if (value && value.key) {
      callback()
    } else callback('请选择单位')
  };

  genHandleUploadPhoto = prop => info => {
    const { fileList, file } = info;
    let fList = fileList;
    if (file.status === 'done' || file.status === undefined){ // file.status === undefined 为文件被beforeUpload拦截下拉的情况
      fList = handleFileList(fileList);
    }

    this.setState({ [prop]: fList });
  };


  genUpload = name => {
    const prop = `${name}List`;
    const { [prop]: photoList } = this.state;

    return (
      <Upload
        name="files"
        data={{ folder: FOLDER }}
        action={UPLOAD_ACTION}
        fileList={photoList}
        onChange={this.genHandleUploadPhoto(prop)}
        headers={{ 'JA-Token': getToken() }}
      >
        <Button type="primary">点击上传</Button>
      </Upload>
    );
  };

  render () {
    const {
      match: { params: { id } },
      form: { getFieldDecorator },
      user: { currentUser: { unitType } },
    } = this.props;
    // 是否企业登录
    const isUnit = +unitType === 4;
    const isDet = this.isDetail();
    const title = isDet ? '详情' : id ? '编辑' : '新增';
    const breadcrumbList = Array.from(BREADCRUMBLIST);
    breadcrumbList.push({ title, name: title });
    const handleSubmit = isDet ? null : this.handleSubmit;
    const EDIT_FORMITEMS = [
      {
        title: '项目信息',
        fields: [
          ...(isUnit ? [] : [{
            name: 'company',
            label: '单位名称',
            type: 'component',
            component: getFieldDecorator('company', {
              rules: [{ required: true, validator: this.validateCompany }],
            })(
              <CompanySelect type={!isDet || 'span'} />
            ),
          }]),
          { name: 'projectName', label: '项目名称' },
          { name: 'projectType', label: '项目类型', type: 'radio', options: PROJECT_OPTION },
          { name: 'program', label: '程序', type: 'radio', options: PROGRAM_OPTION },
        ],
      },
      {
        title: '安全条件',
        fields: [
          { name: 'safeType', label: '类别', type: 'radio', options: TYPE_OPTION, required: false },
          { name: 'safeResult', label: '结论', type: 'radio', options: CONCLUSION, required: false },
          { name: 'safeDate', label: '出具文书日期', type: 'datepicker', required: false },
          { name: 'safeAttached', label: '附件', type: 'component', component: this.genUpload('safe') },
        ],
      },
      {
        title: '安全设施设计',
        fields: [
          { name: 'safeFacilitiesDesignType', label: '类别', type: 'radio', options: TYPE_OPTION, required: false },
          { name: 'safeFacilitiesDesignResult', label: '结论', type: 'radio', options: CONCLUSION, required: false },
          { name: 'safeFacilitiesDesignDate', label: '出具文书日期', type: 'datepicker', required: false },
          { name: 'safeFacilitiesAttached', label: '附件', type: 'component', component: this.genUpload('safeFacilities') },
        ],
      },
      {
        title: '试生产方案备案',
        fields: [
          { name: 'backupRange', label: '试生产日期', type: 'rangepicker', required: false },
          { name: 'tryProductResult', label: '结论', type: 'radio', options: CONCLUSION, required: false },
          { name: 'tryProductdate', label: '出具文书日期', type: 'datepicker', required: false },
          { name: 'tryAttached', label: '附件', type: 'component', component: this.genUpload('try') },
        ],
      },
      {
        title: '安全设施竣工',
        fields: [
          { name: 'safeFacilitiesCompleteType', label: '类别', type: 'radio', options: TYPE_OPTION, required: false },
          { name: 'safeFacilitiesCompleteResult', label: '结论', type: 'radio', options: CONCLUSION, required: false },
          { name: 'safeFacilitiesCompleteDate', label: '出具文书日期', type: 'datepicker', required: false },
          { name: 'completeAttached', label: '附件', type: 'component', component: this.genUpload('complete') },
        ],
      },
    ];
    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
      >
        <Card style={{ marginBottom: 15 }}>
          {renderSections(EDIT_FORMITEMS, getFieldDecorator, handleSubmit, LIST_URL)}
        </Card>
      </PageHeaderLayout>
    );
  }
}
