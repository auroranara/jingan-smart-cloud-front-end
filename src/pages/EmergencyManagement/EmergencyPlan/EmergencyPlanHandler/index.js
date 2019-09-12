import React, { Component, Fragment } from 'react';
import { Card, Button, Input, Select, message, Spin, Radio, DatePicker } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import CustomForm from '@/jingan-components/CustomForm';
import CompanySelect from '@/jingan-components/CompanySelect';
import CustomUpload from '@/jingan-components/CustomUpload';
import Text from './Text';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import {
  SPAN,
  LABEL_COL,
  BUTTON_WRAPPER_SPAN,
  VERSION_TYPE_MAPPER,
  TYPE_MAPPER,
  VERSION_MAPPER,
  LEVEL_CODE_MAPPER,
} from './config';
import {
  TYPE_CODES,
  SECRET_CODES,
  RECORD_STATUSES,
} from '../EmergencyPlanList/config';
import styles from './index.less';

const { Option } = Select;
const { RangePicker } = DatePicker;

@connect(({ emergencyPlan, loading }) => ({
  emergencyPlan,
  loading: loading.effects['emergencyPlan/fetchDetail'],
}))
export default class EmergencyPlanHandler extends Component {
  state = {
    submitting: false,
    currentRecordStatus: 0,
  }

  componentDidMount() {
    const { match: { params: { id } } } = this.props;
    if (id) {
      this.getDetail(({ recordStatus }) => {
        this.setState({
          currentRecordStatus: recordStatus,
        });
      });
    } else {
      this.clearDetail();
    }
  }

  getDetail = () => {
    const { dispatch, match: { params: { id } } } = this.props;
    dispatch({
      type: 'emergencyPlan/fetchDetail',
      payload: {
        id,
      },
    });
  }

  clearDetail = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'emergencyPlan/save',
      payload: {
        detail: {},
      },
    });
  }

  setFormReference = form => {
    this.form = form;
  }

  // 返回按钮点击事件
  handleBackButtonClick = () => {
    router.goBack();
  }

  // 提交按钮点击事件
  handleSubmitButtonClick = () => {
    const { dispatch, match: { params: { id } } } = this.props;
    const { validateFieldsAndScroll } = this.form;
    console.log(this.form);
    validateFieldsAndScroll((errors, values) => {
      console.log(values);
      if (!errors) {
        this.setState({ submitting: true });
        const { companyName, expiryDate: [startExpiryDate, endExpiryDate]=[], recordDate, ...rest } = values;
        const payload = {
          id,
          companyName: companyName.key,
          startExpiryDate: startExpiryDate && startExpiryDate.format('YYYY-MM-DD'),
          endExpiryDate: endExpiryDate && endExpiryDate.format('YYYY-MM-DD'),
          recordDate: recordDate && recordDate.format('YYYY-MM-DD'),
          ...rest,
        };
        const callback = (isSuccess) => {
          if (isSuccess) {
            message.success(`${id ? '编辑' : '添加'}成功！`, () => {
              router.goBack();
            });
          } else {
            message.error(`${id ? '编辑' : '添加'}失败，请稍后重试！`, () => {
              this.setState({
                submitting: false,
              });
            });
          }
        };
        dispatch({
          type: `emergencyPlan/${id ? 'edit' : 'add'}`,
          payload,
          callback,
        });
      }
    });
  }

  handleRecordStatusChange = (e) => {
    const currentRecordStatus = e.target.value;
    this.setState({
      currentRecordStatus,
    });
  }

  render() {
    const {
      emergencyPlan: {
        detail: {
          companyId,
          companyName,
          name,
          version,
          majorHazard,
          applyArea,
          abstract,
          content,
          keyword,
          startExpiryDate,
          endExpiryDate,
          typeCode,
          secretCode,
          recordStatus,
          recordNumber,
          recordDate,
          recordCredential,
          attachment,
          remark,
        }={},
      },
      match: {
        params: {
          id,
        },
      },
      loading,
    } = this.props;
    const { submitting, currentRecordStatus } = this.state;
    const TITLE = id ? '编辑应急预案' : '新增应急预案';
    const BREADCRUMB_LIST = [
      {
        title: '首页',
        name: '首页',
        href: '/',
      },
      {
        title: '应急管理',
        name: '应急管理',
      },
      {
        title: '应急预案',
        name: '应急预案',
        href: '/emergency-management/emergency-plan/list',
      },
      {
        title: TITLE,
        name: TITLE,
      },
    ];
    const FIELDS = [
      {
        id: 'companyName',
        label: '单位名称',
        span: SPAN,
        labelCol: LABEL_COL,
        render: () => <CompanySelect />,
        options: {
          initialValue: companyId && { key: companyId, label: companyName },
          rules: [
            {
              required: true,
              message: '单位名称不能为空',
              transform: value => value && value.label,
            },
          ],
        },
      },
      {
        id: 'name',
        label: '预案名称',
        span: SPAN,
        labelCol: LABEL_COL,
        render: () => <Input placeholder="请输入预案名称" />,
        options: {
          initialValue: name,
          rules: [
            {
              required: true,
              whitespace: true,
              message: '预案名称不能为空',
            },
          ],
        },
      },
      {
        id: 'type',
        label: '预案类型',
        span: SPAN,
        labelCol: LABEL_COL,
        render: () => <Text transform={TYPE_MAPPER} />,
        options: {
          initialValue: 0,
        },
      },
      {
        id: 'versionType',
        label: '版本类',
        span: SPAN,
        labelCol: LABEL_COL,
        render: () => <Text transform={VERSION_TYPE_MAPPER} />,
        options: {
          initialValue: +!!id,
        },
      },
      {
        id: 'version',
        label: '版本号',
        span: SPAN,
        labelCol: LABEL_COL,
        render: () => <Text transform={VERSION_MAPPER} />,
        options: {
          initialValue: version ? (+version+0.01).toFixed(2) : '1.00',
        },
      },
      {
        id: 'majorHazard',
        label: '是否重大危险源',
        span: SPAN,
        labelCol: LABEL_COL,
        render: () => (
          <Radio.Group>
            <Radio value="1">是</Radio>
            <Radio value="0">否</Radio>
          </Radio.Group>
        ),
        options: {
          initialValue: majorHazard >= 0 ? `${majorHazard}` : undefined,
        },
      },
      {
        id: 'applyArea',
        label: '适用领域',
        span: SPAN,
        labelCol: LABEL_COL,
        render: () => <Input placeholder="请输入适用领域" />,
        options: {
          initialValue: applyArea,
          rules: [
            {
              required: true,
              whitespace: true,
              message: '适用领域不能为空',
            },
          ],
        },
      },
      {
        id: 'abstract',
        label: '预案摘要',
        span: SPAN,
        labelCol: LABEL_COL,
        render: () => <Input.TextArea placeholder="请输入预案摘要" autosize={{ minRows: 3 }} />,
        options: {
          initialValue: abstract,
          rules: [
            {
              required: true,
              whitespace: true,
              message: '预案摘要不能为空',
            },
          ],
        },
      },
      {
        id: 'content',
        label: '预案内容',
        span: SPAN,
        labelCol: LABEL_COL,
        render: () => <Input.TextArea placeholder="请输入预案内容" autosize={{ minRows: 3 }} />,
        options: {
          initialValue: content,
          rules: [
            {
              required: true,
              whitespace: true,
              message: '预案内容不能为空',
            },
          ],
        },
      },
      {
        id: 'keyword',
        label: '关键字',
        span: SPAN,
        labelCol: LABEL_COL,
        render: () => <Input placeholder="请输入关键字" />,
        options: {
          initialValue: keyword,
          rules: [
            {
              required: true,
              whitespace: true,
              message: '关键字不能为空',
            },
          ],
        },
      },
      {
        id: 'expiryDate',
        label: '预案有效期',
        span: SPAN,
        labelCol: LABEL_COL,
        render: () => <RangePicker className={styles.datePicker} />,
        options: {
          initialValue: [startExpiryDate && moment(startExpiryDate), endExpiryDate && moment(endExpiryDate)],
        },
      },
      {
        id: 'levelCode',
        label: '预案级别代码',
        span: SPAN,
        labelCol: LABEL_COL,
        render: () => <Text transform={LEVEL_CODE_MAPPER} />,
        options: {
          initialValue: 0,
        },
      },
      {
        id: 'typeCode',
        label: '预案类型代码',
        span: SPAN,
        labelCol: LABEL_COL,
        render: () => (
          <Select placeholder="请选择预案类型代码">
            {TYPE_CODES.map(({ key, value }) => <Option key={key}>{value}</Option>)}
          </Select>
        ),
        options: {
          initialValue: typeCode,
          rules: [
            {
              required: true,
              message: '预案类型代码不能为空',
            },
          ],
        },
      },
      {
        id: 'secretCode',
        label: '预案密级代码',
        span: SPAN,
        labelCol: LABEL_COL,
        render: () => (
          <Radio.Group>
            {SECRET_CODES.map(({ key, value }) => <Radio key={key} value={key}>{value}</Radio>)}
          </Radio.Group>
        ),
        options: {
          initialValue: `${secretCode || 0}`,
          rules: [
            {
              required: true,
            },
          ],
        },
      },
      {
        id: 'recordStatus',
        label: '是否已备案',
        span: SPAN,
        labelCol: LABEL_COL,
        render: () => (
          <Radio.Group onChange={this.handleRecordStatusChange}>
            {RECORD_STATUSES.map(({ key, value }) => <Radio key={key} value={key}>{value}</Radio>)}
          </Radio.Group>
        ),
        options: {
          initialValue: `${recordStatus || currentRecordStatus}`,
          rules: [
            {
              required: true,
            },
          ],
        },
      },
      ...(currentRecordStatus > 0 ? [{
        id: 'recordNumber',
        label: '备案编号',
        span: SPAN,
        labelCol: LABEL_COL,
        render: () => <Input placeholder="请输入备案编号" />,
        options: {
          initialValue: recordNumber,
          rules: [
            {
              required: true,
              whitespace: true,
              message: '备案编号不能为空',
            },
          ],
        },
      },
      {
        id: 'recordDate',
        label: '备案日期',
        span: SPAN,
        labelCol: LABEL_COL,
        render: () => <DatePicker placeholder="请选择备案日期" allowClear={false} className={styles.datePicker} />,
        options: {
          initialValue: recordDate && moment(recordDate),
          rules: [
            {
              required: true,
              message: '备案日期不能为空',
            },
          ],
        },
      },
      {
        id: 'recordCredential',
        label: '备案证明',
        span: SPAN,
        labelCol: LABEL_COL,
        render: () => <CustomUpload folder="emergencyPlan" />,
        options: {
          initialValue: recordCredential || [],
          rules: [
            {
              required: true,
              message: '请上传备案证明',
            },
          ],
        },
      }] : []),
      {
        id: 'attachment',
        label: '应急预案附件',
        span: SPAN,
        labelCol: LABEL_COL,
        render: () => <CustomUpload folder="emergencyPlan" />,
        options: {
          initialValue: attachment || [],
          rules: [
            {
              required: true,
              message: '请上传应急预案附件',
            },
          ],
        },
      },
      {
        id: 'remark',
        label: '备注',
        span: SPAN,
        labelCol: LABEL_COL,
        render: () => <Input.TextArea placeholder="请输入备注" autosize={{ minRows: 3 }} />,
        options: {
          initialValue: remark,
        },
      },
    ];

    return (
      <PageHeaderLayout
        title={TITLE}
        breadcrumbList={BREADCRUMB_LIST}
      >
        <Spin spinning={loading || submitting}>
          <Card bordered={false}>
            <CustomForm
              buttonWrapperSpan={BUTTON_WRAPPER_SPAN}
              buttonWrapperClassName={styles.buttonWrapper}
              fields={FIELDS}
              searchable={false}
              resetable={false}
              ref={this.setFormReference}
              action={
                <Fragment>
                  <Button onClick={this.handleBackButtonClick}>返回</Button>
                  <Button type="primary" onClick={this.handleSubmitButtonClick}>提交审核</Button>
                </Fragment>
              }
            />
          </Card>
        </Spin>
      </PageHeaderLayout>
    );
  }
}
