import React, { PureComponent } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Card, Form, message } from 'antd';
import CompanySelect from '@/jingan-components/CompanySelect';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import { renderSections } from '@/pages/SafetyKnowledgeBase/MSDS/utils';
import { BREADCRUMBLIST, LIST_URL, PROJECT, PROGRAM, TYPE, CONCLUSION } from './utils';
import moment from 'moment';

const flatOption = list => Array.isArray(list) ? list.map((item, index) => ({ value: index + 1, label: item })) : [];
const PROJECT_OPTION = flatOption(PROJECT);
const PROGRAM_OPTION = flatOption(PROGRAM);
const TYPE_OPTION = flatOption(TYPE);

@Form.create()
@connect(({ baseInfo }) => ({
  baseInfo,
}))
export default class Edit extends PureComponent {

  state = {
    detail: {},
  };

  componentDidMount () {
    const {
      match: { params: { id } },
    } = this.props;
    id && this.getDetail();
  }

  getDetail = () => {
    const {
      dispatch,
      match: { params: { id } },
      form: { setFieldsValue },
    } = this.props;
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
          } = list[0];
          setFieldsValue({
            safeDate: moment(safeDate),
            safeFacilitiesDesignDate: moment(safeFacilitiesDesignDate),
            backupRange: [moment(tryProductStartdate), moment(tryProductEnddate)],
            tryProductdate: moment(tryProductdate),
            safeFacilitiesCompleteDate: moment(safeFacilitiesCompleteDate),
            company: { key: companyId, label: companyName },
            projectName,
            projectType: +projectType,
            program: +program,
            safeType: +safeType,
            safeResult: +safeResult,
            safeFacilitiesDesignType: +safeFacilitiesDesignType,
            safeFacilitiesDesignResult: +safeFacilitiesDesignResult,
            tryProductResult: +tryProductResult,
            safeFacilitiesCompleteType: +safeFacilitiesCompleteType,
            safeFacilitiesCompleteResult: +safeFacilitiesCompleteResult,
          })
        },
      })
    }
  };

  getStartTime = obj => obj ? obj.startOf('day').unix() * 1000 : obj;

  getEndTime = obj => obj ? obj.endOf('day').unix() * 1000 : obj;

  handleSubmit = (e) => {
    const {
      dispatch,
      form: { validateFields },
      match: { params: { id } },
    } = this.props;
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
      const [startDate, endDate] = backupRange;
      const payload = {
        ...resValues,
        safeDate: this.getStartTime(safeDate),
        safeFacilitiesDesignDate: this.getStartTime(safeFacilitiesDesignDate),
        tryProductdate: this.getStartTime(tryProductdate),
        safeFacilitiesCompleteDate: this.getStartTime(safeFacilitiesCompleteDate),
        tryProductStartdate: this.getStartTime(startDate),
        tryProductEnddate: this.getEndTime(endDate),
        companyId: company.key,
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
  }

  render () {
    const {
      match: { params: { id } },
      form: { getFieldDecorator },
    } = this.props;

    const isDet = this.isDetail();
    const title = isDet ? '详情' : id ? '编辑' : '新增';
    const breadcrumbList = Array.from(BREADCRUMBLIST);
    breadcrumbList.push({ title, name: title });
    const handleSubmit = isDet ? null : this.handleSubmit;
    const EDIT_FORMITEMS = [
      {
        title: '项目信息',
        fields: [
          {
            name: 'company',
            label: '单位名称',
            type: 'component',
            component: getFieldDecorator('company', {
              rules: [{ required: true, validator: this.validateCompany }],
            })(
              <CompanySelect type={!isDet || 'span'} />
            ),
          },
          { name: 'projectName', label: '项目名称' },
          { name: 'projectType', label: '项目类型', type: 'radio', options: PROJECT_OPTION },
          { name: 'program', label: '程序', type: 'radio', options: PROGRAM_OPTION },
        ],
      },
      {
        title: '安全条件',
        fields: [
          { name: 'safeType', label: '类别', type: 'radio', options: TYPE_OPTION },
          { name: 'safeResult', label: '结论', type: 'radio', options: CONCLUSION },
          { name: 'safeDate', label: '出具文书日期', type: 'datepicker' },
        ],
      },
      {
        title: '安全设施设计',
        fields: [
          { name: 'safeFacilitiesDesignType', label: '类别', type: 'radio', options: TYPE_OPTION },
          { name: 'safeFacilitiesDesignResult', label: '结论', type: 'radio', options: CONCLUSION },
          { name: 'safeFacilitiesDesignDate', label: '出具文书日期', type: 'datepicker' },
        ],
      },
      {
        title: '试生产方案备案',
        fields: [
          { name: 'backupRange', label: '试生产日期', type: 'rangepicker' },
          { name: 'tryProductResult', label: '结论', type: 'radio', options: CONCLUSION },
          { name: 'tryProductdate', label: '出具文书日期', type: 'datepicker' },
        ],
      },
      {
        title: '安全设施竣工',
        fields: [
          { name: 'safeFacilitiesCompleteType', label: '类别', type: 'radio', options: TYPE_OPTION },
          { name: 'safeFacilitiesCompleteResult', label: '结论', type: 'radio', options: CONCLUSION },
          { name: 'safeFacilitiesCompleteDate', label: '出具文书日期', type: 'datepicker' },
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
