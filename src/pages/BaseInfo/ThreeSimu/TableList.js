import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import {
  Card,
  Table,
  Form,
  message,
  Input,
  Select,
  DatePicker,
  Divider,
} from 'antd';
import ToolBar from '@/components/ToolBar';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import styles1 from '@/pages/SafetyKnowledgeBase/MSDS/MList.less';
import moment from 'moment';
import {
  BREADCRUMBLIST,
  PAGE_SIZE, ROUTER,
  formatTime,
  PROJECT,
  PROGRAM,
  TYPE,
  CONCLUSION,
} from './utils';
import { AuthA, AuthButton, AuthLink, AuthPopConfirm } from '@/utils/customAuth';
import codes from '@/utils/codes';

const { RangePicker } = DatePicker;
const { Option } = Select;

const {
  facilityManagement: {
    threeSimultaneity: {
      add: addCode,
      edit: editCode,
      delete: deleteCode,
    },
  },
} = codes;

@Form.create()
@connect(({ baseInfo, user, loading }) => ({
  baseInfo,
  user,
  tableLoading: loading.effects['baseInfo/fetchThreeSimultaneity'],
}))
export default class TableList extends PureComponent {

  componentDidMount () {
    this.handleQuery()
  }

  handleQuery = (pageNum = 1, pageSize = PAGE_SIZE) => {
    const {
      dispatch,
    } = this.props;
    const values = this.toobar.props.form.getFieldsValue();
    const { registrationDate, ...resValues } = values;
    let payload = {
      ...resValues,
      pageNum,
      pageSize,
    };
    if (registrationDate && registrationDate.length) {
      const [start, end] = registrationDate;
      payload = {
        ...payload,
        registrationStartDate: start ? moment(start).startOf('day').format('YYYY/MM/DD HH:mm:ss') : undefined,
        registrationEndDate: end ? moment(end).endOf('day').format('YYYY/MM/DD HH:mm:ss') : undefined,
      }
    }
    dispatch({
      type: 'baseInfo/fetchThreeSimultaneity',
      payload,
    })
  };

  handleReset = () => {
    this.toobar.props.form.resetFields()
    this.handleQuery()
  };

  getTime = obj => obj ? obj.unix() * 1000 : obj;

  handleAdd = () => {
    router.push(`${ROUTER}/add`);
  };

  handleDelete = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'baseInfo/deleteThreeSimultaneity',
      payload: { id },
      success: () => {
        message.success('删除成功');
        this.handleQuery()
      },
      error: res => { message.error(res ? res.msg : '删除失败') },
    })
  }

  render () {
    const {
      tableLoading,
      baseInfo: {
        threeSimultaneity: {
          list,
          pagination: {
            pageNum,
            pageSize,
            total,
          },
        },
      },
      user: { currentUser: { unitType } },
    } = this.props;
    // 是否企业登录
    const isUnit = +unitType === 4;
    const breadcrumbList = Array.from(BREADCRUMBLIST);
    breadcrumbList.push({ title: '列表', name: '列表' });
    const toolBarAction = (
      <AuthButton code={addCode} type="primary" onClick={this.handleAdd} style={{ marginTop: '8px' }}>
        新增
      </AuthButton>
    );
    const fields = [ // modify
      ...isUnit ? [] : [{
        id: 'companyName',
        label: '单位名称',
        render: () => <Input placeholder="请输入" allowClear />,
        transform: v => v.trim(),
      }],
      {
        id: 'projectName',
        label: '项目名称',
        render: () => <Input placeholder="请输入" allowClear />,
        transform: v => v.trim(),
      },
      {
        id: 'projectType',
        label: '项目类型',
        render: () => <Select placeholder="请选择" allowClear>{PROJECT.map((r, i) => <Option key={i + 1}>{r}</Option>)}</Select>,
      },
      {
        id: 'program',
        label: '程序',
        render: () => <Select placeholder="请选择" allowClear>{PROGRAM.map((r, i) => <Option key={i + 1}>{r}</Option>)}</Select>,
      },
      {
        id: 'registrationDate',
        label: '登记时间',
        render: () => (
          <RangePicker
            // format="YYYY-MM-DD HH:mm:ss"
            // showTime={{
            //   defaultValue: [moment().startOf('day'), moment().endOf('day')],
            // }}
            style={{ width: '100%' }}
            allowClear
          />
        ),
      },
    ];
    const columns = [ // modify
      ...isUnit ? [] : [{
        title: '单位名称',
        dataIndex: 'companyName',
        key: 'companyName',
        align: 'center',
        width: 300,
      }],
      {
        title: '项目信息',
        dataIndex: 'info',
        width: 300,
        render (ns, record) {
          return [
            `项目名称：${record.projectName}`,
            `项目类型：${PROJECT[+record.projectType - 1]}`,
            `程序：${PROGRAM[+record.program - 1]}`,
          ].map((n, i) => <p key={i} className={styles1.p}>{n}</p>);
        },
      },
      {
        title: '安全条件',
        dataIndex: 'condition',
        width: 300,
        render (ns, record) {
          return [
            `类别：${TYPE[+record.safeType - 1] || '-'}`,
            `结论：${CONCLUSION[+record.safeResult]}`,
            `文书日期：${formatTime(record.safeDate)}`,
          ].map((n, i) => <p key={i} className={styles1.p}>{n}</p>);
        },
      },
      {
        title: '安全设施设计',
        dataIndex: 'design',
        width: 300,
        render (ns, record) {
          return [
            `类别：${TYPE[+record.safeFacilitiesDesignType - 1] || '-'}`,
            `结论：${CONCLUSION[+record.safeFacilitiesDesignResult]}`,
            `文书日期：${formatTime(record.safeFacilitiesDesignDate)}`,
          ].map((n, i) => <p key={i} className={styles1.p}>{n}</p>);
        },
      },
      {
        title: '试生产方案备案',
        dataIndex: 'backup',
        width: 300,
        render (ns, record) {
          return [
            `试生产日期：${formatTime(record.tryProductStartdate)} ~ ${formatTime(record.tryProductEnddate)}`,
            `结论：${CONCLUSION[+record.tryProductResult]}`,
            `文书日期：${formatTime(record.tryProductdate)}`,
          ].map((n, i) => <p key={i} className={styles1.p}>{n}</p>);
        },
      },
      {
        title: '安全设施竣工',
        dataIndex: 'complete',
        width: 300,
        render (ns, record) {
          return [
            `类别：${TYPE[+record.safeFacilitiesCompleteType - 1] || '-'}`,
            `结论：${CONCLUSION[+record.safeFacilitiesCompleteResult]}`,
            `文书日期：${formatTime(record.safeFacilitiesCompleteDate)}`,
          ].map((n, i) => <p key={i} className={styles1.p}>{n}</p>);
        },
      },
      {
        title: '登记时间',
        dataIndex: 'registrationDate',
        align: 'center',
        render: val => formatTime(val, 'YYYY-MM-DD'),
      },
      {
        title: '操作',
        dataIndex: 'id',
        key: 'id',
        fixed: 'right',
        align: 'center',
        width: 200,
        render: (id, row) => {
          return (
            <Fragment>
              <AuthLink code={editCode} to={`${ROUTER}/edit/${id}`}>编辑</AuthLink>
              <Divider type="vertical" />
              <AuthPopConfirm
                title="确定删除当前数据？"
                onConfirm={e => this.handleDelete(row.id)}
                okText="确定"
                cancelText="取消"
                code={deleteCode}
              >删除</AuthPopConfirm>
            </Fragment>
          );
        },
      },
    ];
    return (
      <PageHeaderLayout
        title={BREADCRUMBLIST[BREADCRUMBLIST.length - 1].title}
        breadcrumbList={breadcrumbList}
        content={`总数：${total}`}
      >
        <Card style={{ marginBottom: 15 }}>
          <ToolBar
            fields={fields}
            action={toolBarAction}
            onSearch={(payload) => this.handleQuery()}
            onReset={this.handleReset}
            buttonStyle={{ textAlign: 'right' }}
            buttonSpan={{ xl: 8, sm: 12, xs: 24 }}
            wrappedComponentRef={toobar => { this.toobar = toobar }}
          />
        </Card>
        {list && list.length ? (
          <div className={styles1.container}>
            <Table
              rowKey="id"
              loading={tableLoading}
              columns={columns}
              dataSource={list}
              scroll={{ x: 'max-content' }}
              pagination={{
                pageSize,
                total,
                current: pageNum,
                showQuickJumper: true,
                showSizeChanger: true,
                pageSizeOptions: ['5', '10', '15', '20'],
                onChange: (pageNum, pageSize) => this.handleQuery(pageNum, pageSize),
                onShowSizeChange: (pageNum, pageSize) => this.handleQuery(1, pageSize),
              }}
            />
          </div>
        ) : (
            <div style={{ textAlign: 'center', padding: '70px' }}> 暂无数据</div>
          )}
      </PageHeaderLayout>
    );
  }
}
