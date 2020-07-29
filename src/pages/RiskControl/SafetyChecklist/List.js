import React, { Fragment, Component } from 'react';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import Form from '@/jingan-components/Form';
import Table from '@/jingan-components/View/Table';
import EmptyText from '@/jingan-components/View/EmptyText';
import { Divider, Modal, message, Button } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import { AuthLink, AuthButton, AuthA, AuthPopConfirm } from '@/utils/customAuth';
import codes from '@/utils/codes';
import HandleModal from './HandleModal';
import router from 'umi/router';
import ImportModal from '@/components/ImportModal';
import { lecSettings } from './config';

export const FORMAT = 'YYYY-MM-DD';
export const title = '安全检查表-SCL分析';
export const listPath = '/risk-control/safety-checklist/list';
const BREADCRUMB_LIST = [
  { title: '首页', name: '首页', href: '/' },
  { title: '风险分级管控', name: '风险分级管控' },
  { title, name: title },
];
// 风险分析方法字典
export const analysisFunDict = [
  { shortLabel: 'LEC', label: '作业条件危险性分析法（LEC）', value: '1' },
  { shortLabel: 'LS', label: '风险矩阵分析法（LS）', value: '2' },
];
const {
  riskControl: {
    safetyChecklist: {
      add: addCode,
      edit: editCode,
      delete: deleteCode,
      view: viewCode,
      copy: copyCode,
      import: importCode,
      evaluationRecord: {
        list: recordListCode,
        add: addRecordCode,
      },
    },
  },
} = codes;
const { riskLevelList } = lecSettings;

@connect(({ safetyChecklist, user }) => ({
  user,
  safetyChecklist,
}))
export default class SafetyChecklist extends Component {

  state = {
    formData: {},
    handleModalVisible: false,
    detail: {},
    isDetail: false,
  };

  componentDidMount () {
    this.onSearch();
  }

  onSearch = values => {
    const { dispatch } = this.props;
    dispatch({
      type: 'safetyChecklist/fetchSafeChecklist',
      payload: { pageNum: 1, pageSize: 10, ...values },
    });
    this.setState({ formData: values });
  }

  // 新增/编辑
  onSubmitHnaldeModal = values => {
    // console.log('modal submit', values);
    const { dispatch } = this.props;
    const { detail, formData } = this.state;
    const callback = (success, res) => {
      if (success) {
        message.success('操作成功');
        this.setState({ handleModalVisible: false });
        if (!(detail && detail.id) && res.data.id) {
          this.jumpToAddRecord(res.data);
          return;
        }
        this.onSearch(formData);
      } else {
        message.error(res && res.msg ? res.msg : '操作失败');
      }
    }
    // 如果编辑
    if (detail && detail.id) {
      dispatch({
        type: 'safetyChecklist/editSafeChecklist',
        payload: values,
        callback,
      });
    } else {
      // 新增
      dispatch({
        type: 'safetyChecklist/addSafeChecklist',
        payload: values,
        callback,
      });
    }
  }

  // 选择风险点
  onSelectRiskPoint = riskId => {
    const {
      dispatch,
    } = this.props;
    // 判断判断是否有已评价记录
    dispatch({
      type: 'safetyChecklist/judgeRiskPoint',
      payload: { riskId, type: 1 },
      callback: (data) => {
        // 如果存在，询问是否同步
        if (data && data.id) {
          const { code, riskAnalyze } = data;
          const label = this.generateriskAnalyzeLabel(riskAnalyze);
          Modal.confirm({
            title: `系统检测到上一次评价记录，编号为${code}，评估法（${label}),是否需要同步该信息？`,
            okText: '确定',
            cancelText: '取消',
            onOk: () => {
              // 同步
              dispatch({
                type: 'safetyChecklist/synchronize',
                payload: { id: data.id },
                callback: (success) => {
                  if (success) {
                    message.success('同步成功');
                    this.setState({ handleModalVisible: false });
                    this.onSearch(this.state.formData);
                  } else {
                    message.success('同步失败');
                  }
                },
              });
            },
          })
        }
      },
    });
  }

  // 点击新增
  onClickAdd = () => {
    this.setState({ handleModalVisible: true, detail: {}, isDetail: false })
  }

  // 跳转到新增评价项
  jumpToAddRecord = row => {
    router.push(`/risk-control/safety-checklist/${row.id}/record/add?riskAnalyze=${row.riskAnalyze}`);
  }

  // 跳转到评价项列表
  jumpToRecordList = row => {
    router.push(`/risk-control/safety-checklist/${row.id}/record?riskAnalyze=${row.riskAnalyze}`);
  }

  // 删除
  handleDelete = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'safetyChecklist/deleteSafeChecklist',
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

  // 复制
  handleCopy = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'safetyChecklist/copySafeChecklist',
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
  handleViewEdit = row => {
    this.setState({ detail: row, handleModalVisible: true, isDetail: false });
  }

  // 点击查看
  handleView = row => {
    this.setState({ detail: row, handleModalVisible: true, isDetail: true });
  }

  // 根据key生成风险分析方法
  generateriskAnalyzeLabel = (value, key = 'shortLabel') => analysisFunDict[value - 1][key];

  render () {
    const {
      safetyChecklist: {
        data,
        data: {
          pagination: {
            pageNum: prePageNum,
            pageSize: prePageSize,
          },
        },
      },
      loading,
      user: { isCompany },
    } = this.props;
    const { handleModalVisible, detail, isDetail, formData } = this.state;
    // 表单配置对象
    const fields = [
      {
        name: 'riskPointName',
        label: '风险点名称',
        component: 'Input',
        props: {
          allowClear: true,
        },
      },
      {
        name: 'code',
        label: '编号',
        component: 'Input',
        props: {
          allowClear: true,
        },
      },
      {
        name: 'equip',
        label: '装置/设备/设施',
        component: 'Input',
        props: {
          allowClear: true,
        },
      },
      ...(!isCompany
        ? [
          {
            name: 'companyName',
            label: '单位名称',
            component: 'Input',
            props: {
              allowClear: true,
            },
          },
        ]
        : []),
    ];
    const columns = [
      ...(!isCompany
        ? [
          {
            dataIndex: 'companyName',
            title: '单位名称',
            render: value => value || <EmptyText />,
          },
        ]
        : []),
      {
        dataIndex: 'code',
        title: '编号',
        render: value => value || <EmptyText />,
      },
      {
        dataIndex: 'evaluateDate',
        title: '创建时间',
        render: value => value ? moment(value).format('YYYY-MM-DD') : <EmptyText />,
      },
      {
        dataIndex: 'riskPointName',
        title: '风险点',
        render: value => value || <EmptyText />,
      },
      {
        dataIndex: 'equip',
        title: '装置/设备/设施',
        render: value => value || <EmptyText />,
      },
      {
        dataIndex: 'riskAnalyze',
        title: '风险分析方法',
        render: value => value ? this.generateriskAnalyzeLabel(value, 'label') : <EmptyText />,
      },
      {
        dataIndex: 'highRiskLevel',
        title: '最高风险等级',
        render: value => value ? (<span style={{ color: (riskLevelList.find(item => item.colorName === value + '色') || {}).color }}>{value}</span>) : <EmptyText />,
      },
      {
        dataIndex: 'evaluateNum',
        title: '评价项目',
        render: (value, row) => isNaN(value) ? <EmptyText /> : (<AuthA code={recordListCode} onClick={() => this.jumpToRecordList(row)}>{value}</AuthA>),
      },
      {
        dataIndex: '操作',
        title: '操作',
        fixed: 'right',
        width: 164,
        render: (_, row) => (
          <Fragment>
            <AuthA code={addRecordCode} onClick={() => this.jumpToAddRecord(row)}>添加评价项</AuthA>
            <Divider type="vertical" />
            <AuthLink code={copyCode} onClick={() => this.handleCopy(row.id)}>复制</AuthLink>
            <Divider type="vertical" />
            <AuthA code={viewCode} onClick={() => this.handleView(row)}>查看</AuthA>
            <Divider type="vertical" />
            <AuthA code={editCode} onClick={() => this.handleViewEdit(row)}>编辑</AuthA>
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
        title={title}
      >
        <Form ref={form => this.form = form} fields={fields} onSearch={this.onSearch} onReset={this.onSearch} />
        <Table
          list={data}
          loading={loading}
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
              <AuthButton
                type="primary"
                code={addCode}
                onClick={this.onClickAdd}
              >
                新增SCL评价记录
              </AuthButton>,
              <Button
                href="http://data.jingan-china.cn/v2/chem/file/SCL分析.xls"
                target="_blank"
                style={{ marginRight: '10px' }}
              >
                模板下载
              </Button>,
              <ImportModal
                action={'/acloud_new/v2/safeCheck/importSafeCheck'}
                onUploadSuccess={this.handleSearch}
                code={importCode}
                showCompanySelect={false}
                data={{ type: 1, file: 'scl' }}
              />,
            ]
          }
        />
        <HandleModal
          title="SCL评价记录"
          visible={handleModalVisible}
          onOk={this.onSubmitHnaldeModal}
          onCancel={() => { this.setState({ handleModalVisible: false }) }}
          detail={detail || {}}
          isDetail={isDetail}
          onSelectRiskPoint={this.onSelectRiskPoint}
        />
      </PageHeaderLayout>
    )
  }
}
