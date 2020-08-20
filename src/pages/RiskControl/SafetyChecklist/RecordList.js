import React, { Fragment, Component } from 'react';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import Form from '@/jingan-components/Form';
import Table from '@/jingan-components/View/Table';
import EmptyText from '@/jingan-components/View/EmptyText';
// import TextAreaEllipsis from '@/jingan-components/View/TextAreaEllipsis';
import { Divider, message } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import { AuthA, AuthButton, AuthPopConfirm } from '@/utils/customAuth';
import codes from '@/utils/codes';
import { title as listTitlt, listPath, basePath, type } from './List';
import router from 'umi/router';
import { stringify } from 'qs';
import { lecSettings } from './config';
import Ellipsis from '@/components/Ellipsis';
import { round } from '@/utils/utils';

export const FORMAT = 'YYYY-MM-DD';
export const title = '评价项目';
const BREADCRUMB_LIST = [
  { title: '首页', name: '首页', href: '/' },
  { title: '风险分级管控', name: '风险分级管控' },
  { title: listTitlt, name: listTitlt, href: listPath },
  { title, name: title },
];
const {
  riskControl: {
    safetyChecklist: {
      evaluationRecord: {
        add: addCode,
        edit: editCode,
        delete: deleteCode,
        view: viewCode,
      },
    },
  },
} = codes;
const { riskLevelList } = lecSettings;

@connect(({ user, safetyChecklist, loading }) => ({
  user,
  safetyChecklist,
  tableLoading: loading.effects['safetyChecklist/fetchRecordList'],
}))
export default class SafetyChecklist extends Component {

  state = {
    formData: {},
    info: {},
  };

  componentDidMount () {
    const {
      dispatch,
      match: { params: { id } },
    } = this.props;
    this.onSearch();
    // 获取评价记录信息
    dispatch({
      type: 'safetyChecklist/fetchSafeChecklist',
      payload: { pageNum: 1, pageSize: 10, id },
      callback: data => {
        if (data && data.list) {
          this.setState({ info: data.list[0] || {} });
        }
      },
    });
  }

  onSearch = values => {
    const { dispatch, match: { params: { id } } } = this.props;
    dispatch({
      type: 'safetyChecklist/fetchRecordList',
      payload: {
        pageNum: 1,
        pageSize: 10,
        ...values,
        safeCheckId: id,
        type,
      },
    });
    this.setState({ formData: values });
  }

  onClickAdd = () => {
    const {
      match: { params: { id } },
      location: { query },
    } = this.props;
    router.push(`${basePath}/${id}/record/add?${stringify(query)}`)
  }

  // 删除
  handleDelete = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'safetyChecklist/deleteRecord',
      payload: { id },
      callback: (success, res) => {
        if (success) {
          message.success('操作成功');
          this.onSearch(this.state.formData);
        } else {
          message.error(res && res.msg ? res.msg : '操作失败');
        }
      },
    });
  }

  // 点击编辑
  handleViewEdit = recordId => {
    const {
      match: { params: { id } },
      location: { query },
    } = this.props;
    router.push(`${basePath}/${id}/record/edit/${recordId}?${stringify(query)}`);
  }

  // 点击查看
  handleView = recordId => {
    const {
      match: { params: { id } },
      location: { query },
    } = this.props;
    router.push(`${basePath}/${id}/record/view/${recordId}?${stringify(query)}`);
  }

  render () {
    const {
      tableLoading,
      safetyChecklist: {
        record,
        record: {
          pagination: {
            pageNum: prePageNum,
            pageSize: prePageSize,
          },
        },
      },
      location: { query: { riskAnalyze } }, // 风险分析方法 lec:1 ls:2
    } = this.props;
    const { formData, info } = this.state;
    // 表单配置对象
    const fields = [
      {
        name: 'evaluateProject',
        label: '评估项目',
        component: 'Input',
        props: {
          allowClear: true,
        },
      },
    ];
    const columns = [
      {
        dataIndex: 'evaluateProject',
        title: '评估项目',
        render: value => value ? (<Ellipsis tooltip length={10}>{value}</Ellipsis>) : <EmptyText />,
      },
      {
        dataIndex: 'majorHidden',
        title: '主要危险因素（人、物、作业环境、管理）',
        render: value => value ? (<Ellipsis tooltip length={20}>{value}</Ellipsis>) : <EmptyText />,
      },
      {
        dataIndex: 'hiddenTypeResultName',
        title: '可能发生的事故类型及后果',
        render: value => value || <EmptyText />,
      },
      {
        dataIndex: 'riskMeasures',
        title: '风险管控措施',
        width: 300,
        render: value => value ? (<div style={{ whiteSpace: 'pre-line' }}>{value}</div>) : <EmptyText />,
      },
      {
        dataIndex: 'emergencyMeasures',
        title: '应急处置措施',
        width: 400,
        render: value => value ? (<Ellipsis tooltip length={25}>{value}</Ellipsis>) : <EmptyText />,
      },
      +riskAnalyze === 1 ? {
        dataIndex: 'highRiskLevel',
        title: '风险评价结果（LEC)',
        render: (value, { l, e, c, riskLevel, evaluatePer, evaluateDate }) => (
          <div style={{ textAgin: 'left' }}>
            <p>可能性（L)：{l}</p>
            <p>频次(E)：{e}</p>
            <p>严重性(C)：{c}</p>
            <p>评估风险值(D)：{round(l * e * c)}</p>
            <p>评价级别：{riskLevel ? riskLevel + '级' : ''}</p>
            <p>评估人员：{evaluatePer}</p>
            <p>评估日期：{evaluateDate ? moment(evaluateDate).format('YYYY-MM-DD') : ''}</p>
          </div>
        ),
      } : {
          dataIndex: 'highRiskLevel',
          title: '风险评价结果（LS)',
          render: (value, { l, s, riskLevel, evaluatePer, evaluateDate }) => (
            <div style={{ textAgin: 'left' }}>
              <p>可能性（L)：{l}</p>
              <p>频次(S)：{s}</p>
              <p>评估风险值(R)：{round(l * s)}</p>
              <p>评价级别：{riskLevel ? riskLevel + '级' : ''}</p>
              <p>评估人员：{evaluatePer}</p>
              <p>评估日期：{evaluateDate ? moment(evaluateDate).format('YYYY-MM-DD') : ''}</p>
            </div>
          ),
        },
      {
        dataIndex: 'riskLevelColor',
        title: '风险等级',
        render: (value, row) => value ? (<span style={{ color: riskLevelList[+row.riskLevel - 1].color }}>{value}</span>) : <EmptyText />,
      },
      {
        dataIndex: '操作',
        title: '操作',
        fixed: 'right',
        width: 164,
        render: (_, row) => (
          <Fragment>
            <AuthA code={viewCode} onClick={() => this.handleView(row.id)}>查看</AuthA>
            <Divider type="vertical" />
            <AuthA code={editCode} onClick={() => this.handleViewEdit(row.id)}>编辑</AuthA>
            <Divider type="vertical" />
            <AuthPopConfirm
              code={deleteCode}
              title="确认要删除该数据吗？"
              onConfirm={() => this.handleDelete(row.id)}
            >删除</AuthPopConfirm>
          </Fragment>
        ),
      },
    ];
    return (
      <PageHeaderLayout
        breadcrumbList={BREADCRUMB_LIST}
        title={BREADCRUMB_LIST[BREADCRUMB_LIST.length - 1].title}
        content={(
          <div>
            <span style={{ marginRight: '30px' }}>风险点：{info.riskPointName}</span>
            <span>装置/设备/设施：{info.equip}</span>
          </div>
        )}
      >
        <Form ref={form => this.form = form} fields={fields} onSearch={this.onSearch} onReset={this.onSearch} />
        <Table
          list={record}
          loading={tableLoading}
          columns={columns}
          onChange={({ current, pageSize }) => {
            this.onSearch({
              ...formData,
              pageNum: pageSize !== prePageSize ? 1 : current,
              pageSize,
            })
            this.form.setFieldsValue(formData);
          }}
          onReload={() => {
            this.onSearch({
              ...formData,
              pageNum: prePageNum,
              pageSize: prePageSize,
            })
            this.form.setFieldsValue(formData);
          }}
          showAddButton={false}
          operation={
            [
              <AuthButton type="primary" code={addCode} onClick={this.onClickAdd}>
                新增评价记录
              </AuthButton>,
            ]
          }
        />
      </PageHeaderLayout>
    )
  }
}
