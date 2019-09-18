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
  DEFAULT_RECORD_STATUS,
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
    currentRecordStatus: DEFAULT_RECORD_STATUS,
  }

  componentDidMount() {
    const { match: { params: { id } } } = this.props;
    if (id) {
      this.getDetail(({ isRecord }) => {
        this.setState({
          currentRecordStatus: isRecord,
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
    validateFieldsAndScroll((errors, values) => {
      if (!errors) {
        this.setState({ submitting: true });
        const { company, expiryDate: [startDate, endDate]=[], recordDate, recordCertificate, emergencyFiles, ...rest } = values;
        const payload = {
          id,
          companyId: company.key,
          startDate: startDate && startDate.format('YYYY-MM-DD'),
          endDate: endDate && endDate.format('YYYY-MM-DD'),
          recordDate: recordDate && recordDate.format('YYYY-MM-DD'),
          recordCertificate: recordCertificate.map(({ name, dbUrl, url }) => ({ name, dbUrl, webUrl: url })),
          emergencyFiles: emergencyFiles.map(({ name, dbUrl, url }) => ({ name, dbUrl, webUrl: url })),
          ...rest,
        };
        console.log(payload);
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
          planType,
          editionType,
          editionCode,
          status,
          isMajorHazard,
          applicationArea,
          emergencyMain,
          emergencyAll,
          keyword,
          startDate,
          endDate,
          jbLevelCode,
          lxLevelCode,
          mjLevelCode,
          isRecord,
          recordCode,
          recordDate,
          recordCertificate,
          emergencyFiles,
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
        id: 'company',
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
        id: 'planType',
        label: '预案类型',
        span: SPAN,
        labelCol: LABEL_COL,
        render: () => <Text transform={TYPE_MAPPER} />,
        options: {
          initialValue: planType || '1',
        },
      },
      {
        id: 'editionType',
        label: '版本类',
        span: SPAN,
        labelCol: LABEL_COL,
        render: () => <Text transform={VERSION_TYPE_MAPPER} />,
        options: {
          initialValue: +status === 4 ? '2' : editionType || '1',
        },
      },
      {
        id: 'editionCode',
        label: '版本号',
        span: SPAN,
        labelCol: LABEL_COL,
        render: () => <Text transform={VERSION_MAPPER} />,
        options: {
          initialValue: +status === 4 ? (+editionCode+0.01).toFixed(2) : editionCode || '1.00',
        },
      },
      {
        id: 'isMajorHazard',
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
          initialValue: isMajorHazard || undefined,
        },
      },
      {
        id: 'applicationArea',
        label: '适用领域',
        span: SPAN,
        labelCol: LABEL_COL,
        render: () => <Input placeholder="请输入适用领域" />,
        options: {
          initialValue: applicationArea,
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
        id: 'emergencyMain',
        label: '预案摘要',
        span: SPAN,
        labelCol: LABEL_COL,
        render: () => <Input.TextArea placeholder="请输入预案摘要" autosize={{ minRows: 3 }} />,
        options: {
          initialValue: emergencyMain,
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
        id: 'emergencyAll',
        label: '预案内容',
        span: SPAN,
        labelCol: LABEL_COL,
        render: () => <Input.TextArea placeholder="请输入预案内容" autosize={{ minRows: 3 }} />,
        options: {
          initialValue: emergencyAll,
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
          initialValue: [startDate && moment(startDate) || undefined, endDate && moment(endDate) || undefined],
        },
      },
      {
        id: 'jbLevelCode',
        label: '预案级别代码',
        span: SPAN,
        labelCol: LABEL_COL,
        render: () => <Text transform={LEVEL_CODE_MAPPER} />,
        options: {
          initialValue: jbLevelCode || '66000',
        },
      },
      {
        id: 'lxLevelCode',
        label: '预案类型代码',
        span: SPAN,
        labelCol: LABEL_COL,
        render: () => (
          <Select placeholder="请选择预案类型代码">
            {TYPE_CODES.map(({ key, value }) => <Option key={key}>{value}</Option>)}
          </Select>
        ),
        options: {
          initialValue: lxLevelCode,
          rules: [
            {
              required: true,
              message: '预案类型代码不能为空',
            },
          ],
        },
      },
      {
        id: 'mjLevelCode',
        label: '预案密级代码',
        span: SPAN,
        labelCol: LABEL_COL,
        render: () => (
          <Radio.Group>
            {SECRET_CODES.map(({ key, value }) => <Radio key={key} value={key}>{value}</Radio>)}
          </Radio.Group>
        ),
        options: {
          initialValue: mjLevelCode,
          rules: [
            {
              required: true,
              message: '预案密级代码不能为空',
            },
          ],
        },
      },
      {
        id: 'isRecord',
        label: '是否已备案',
        span: SPAN,
        labelCol: LABEL_COL,
        render: () => (
          <Radio.Group onChange={this.handleRecordStatusChange}>
            {RECORD_STATUSES.map(({ key, value }) => <Radio key={key} value={key}>{value}</Radio>)}
          </Radio.Group>
        ),
        options: {
          initialValue: isRecord || DEFAULT_RECORD_STATUS,
          rules: [
            {
              required: true,
            },
          ],
        },
      },
      ...(currentRecordStatus > 0 ? [{
        id: 'recordCode',
        label: '备案编号',
        span: SPAN,
        labelCol: LABEL_COL,
        render: () => <Input placeholder="请输入备案编号" />,
        options: {
          initialValue: recordCode,
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
        id: 'recordCertificate',
        label: '备案证明',
        span: SPAN,
        labelCol: LABEL_COL,
        render: () => <CustomUpload folder="emergencyPlan" />,
        options: {
          initialValue: recordCertificate || [],
          rules: [
            {
              required: true,
              message: '请上传备案证明',
            },
          ],
        },
      }] : []),
      {
        id: 'emergencyFiles',
        label: '应急预案附件',
        span: SPAN,
        labelCol: LABEL_COL,
        render: () => <CustomUpload folder="emergencyPlan" />,
        options: {
          initialValue: emergencyFiles || [],
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
          initialValue: remark || undefined,
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
