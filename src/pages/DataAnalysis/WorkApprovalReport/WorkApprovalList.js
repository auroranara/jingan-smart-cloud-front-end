import { PureComponent } from 'react';
import { Card, Form, Input, DatePicker, Select, Table, Badge } from 'antd';
import { connect } from 'dva';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import InlineForm from '@/pages/BaseInfo/Company/InlineForm'
import router from 'umi/router';
import moment from 'moment';
import { AuthA } from '@/utils/customAuth';
import styles from './WorkApprovalList.less';
import codes from '@/utils/codes'

const { RangePicker } = DatePicker
const { Option } = Select

const {
  dataAnalysis: {
    workApprovalReport: {
      detail: detailCode,
    },
  },
} = codes

const TITLE = '作业审批列表'
const BREADCRUMBLIST = [
  { title: '首页', name: '首页', href: '/' },
  { title: '数据分析', name: '数据分析' },
  { title: '作业审批报表', name: '作业审批报表', href: '/data-analysis/work-approval-report/list' },
  { title: TITLE, name: TITLE },
]
// 审批状态颜色
// const APPROVALCOLOR = ['#CCCCCC', '#FF9900', '#008000', '#FF0000']
const APPROVALCOLOR = ['default', 'warning', 'success', 'error']
const QUALIFIED = [{ label: '合格', value: '1' }, { label: '不合格', value: '0' }]
// 页头切换列表配置
// fields用于存放allFields中key，用于显示表单（顺序）
// columns数组中存放allColumns中的title值，用于显示表格columns（顺序）
const TABLIST = [
  {
    key: '0',
    tab: '准卸证',
    fields: ['申请部门', '申请人', '申请时间', '危险化学品', '是否合格', '供货方单位', '使用单位', '审批状态'],
    columns: ['申请时间', '申请人', '申请部门', '危险化学品', '重量（吨）', '是否合格', '供货方单位', '货主或相关人员', '使用单位', '卸货监护人', '审批状态', '操作'],
  },
  {
    key: '1',
    tab: '动火作业',
    fields: ['申请部门', '申请人', '申请时间', '作业级别', '作业证编号', '作业时间', '动火地点', '动火人', '审批状态'],
    columns: ['申请时间', '申请人', '申请部门', '作业级别', '作业证编号', '作业开始时间', '作业结束时间', '动火地点', '动火人', '审批状态', '操作'],
  },
  {
    key: '2',
    tab: '受限空间作业',
    fields: ['申请部门', '申请人', '申请时间', '作业证编号', '受限空间名称', '作业时间', '完工验收时间', '作业人', '审批状态'],
    columns: ['申请时间', '申请人', '申请部门', '作业证编号', '受限空间名称', '作业开始时间', '作业结束时间', '完工验收时间', '作业人', '审批状态', '操作'],
  },
  {
    key: '3',
    tab: '盲板抽堵作业',
    fields: ['申请部门', '申请人', '申请时间', '作业证编号', '盲板编号', '作业时间', '作业人', '审批状态'],
    columns: ['申请时间', '申请人', '申请部门', '作业证编号', '盲板编号', '作业开始时间', '作业结束时间', '作业人', '审批状态', '操作'],
  },
  {
    key: '4',
    tab: '高处作业',
    fields: ['申请部门', '申请人', '申请时间', '作业类别', '作业证编号', '作业时间', '作业地点', '完工验收时间', '作业人', '审批状态'],
    columns: ['申请时间', '申请人', '申请部门', '作业类别', '作业证编号', '作业开始时间', '作业结束时间', '完工验收时间', '作业地点', '作业人', '审批状态', '操作'],
  },
  {
    key: '5',
    tab: '吊装作业',
    fields: ['申请部门', '申请人', '申请时间', '作业级别', '作业证编号', '作业时间', '作业地点', '吊装人', '审批状态'],
    columns: ['申请时间', '申请人', '申请部门', '作业级别', '作业证编号', '作业开始时间', '作业结束时间', '作业地点', '作业人', '审批状态', '操作'],
  },
  {
    key: '6',
    tab: '临时用电作业',
    fields: ['申请部门', '申请人', '申请时间', '作业证编号', '作业时间', '完工验收时间', '作业地点', '作业人', '审批状态'],
    columns: ['申请时间', '申请人', '申请部门', '作业证编号', '作业开始时间', '作业结束时间', '完工验收时间', '作业地点', '作业人', '审批状态', '操作'],
  },
  {
    key: '7',
    tab: '动土作业',
    fields: ['申请部门', '申请人', '申请时间', '作业证编号', '作业时间', '完工验收时间', '作业地点', '审批状态'],
    columns: ['申请时间', '申请人', '申请部门', '作业证编号', '作业开始时间', '作业结束时间', '完工验收时间', '作业地点', '审批状态', '操作'],
  },
  {
    key: '8',
    tab: '断路作业',
    fields: ['申请部门', '申请人', '申请时间', '作业证编号', '作业时间', '完工验收时间', '审批状态'],
    columns: ['申请时间', '申请人', '申请部门', '作业证编号', '作业开始时间', '作业结束时间', '完工验收时间', '审批状态', '操作'],
  },
]

// TODO:将所有情况下的筛选栏配置放在数组中，根据当前activeKey下的TABLIST数据filter筛选下

@Form.create()
@connect(({ dataAnalysis, account }) => ({
  dataAnalysis,
  account,
}))
export default class WorkApprovalList extends PureComponent {

  state = {
    filterValues: {}, // 保存筛选数据
  }

  componentDidMount() {
    const {
      dispatch,
      match: { params: { companyId } },
    } = this.props
    this.fetchDepartmentList({ payload: { companyId } })
    // 获取审批状态列表
    dispatch({ type: 'dataAnalysis/fetchApprovalStatus' })
    this.init()
  }


  /**
   * 初始化获取数据
   */
  init = () => {
    const {
      match: { params: { type } },
    } = this.props
    this.handleFetch()
    if (['1', '4', '5'].includes(type)) { this.fetchJobLevel({ payload: { type } }) }
    type === '0' && this.fetchDangerChemicals()
  }


  /**
   * 获取部门列表
   */
  fetchDepartmentList = actions => {
    const { dispatch } = this.props
    dispatch({ type: 'account/fetchDepartmentList', ...actions })
  }


  /**
   * 获取危险化学品或者供货方单位
   */
  fetchDangerChemicals = actions => {
    const { dispatch } = this.props
    dispatch({ type: 'dataAnalysis/fetchDangerChemicals', ...actions })
  }

  /**
   * 获取作业审批报表列表
   */
  fetchWorkApprovalList = actions => {
    const { dispatch } = this.props
    dispatch({
      type: 'dataAnalysis/fetchWorkApprovalList',
      ...actions,
    })
  }

  /**
   * 获取供货方单位（需要传参数 materialsId）
   */
  fetchSupplierUnits = actions => {
    const { dispatch } = this.props
    dispatch({
      type: 'dataAnalysis/fetchSupplierUnits',
      ...actions,
    })
  }

  /**
   * 获取作业级别（或作业类别）列表
   */
  fetchJobLevel = actions => {
    const { dispatch } = this.props
    dispatch({
      type: 'dataAnalysis/fetchJobLevel',
      ...actions,
    })
  }

  saveAataAnalysisState = payload => {
    const { dispatch } = this.props
    dispatch({
      type: 'dataAnalysis/save',
      payload,
    })
  }

  /**
   * 点击切换tab
   */
  handleTabChange = async type => {
    const {
      match: { params: { companyId } },
      location: { query: { companyName } },
    } = this.props
    await router.push(`/data-analysis/work-approval-report/company/${companyId}/${type}?companyName=${companyName}`)
    // 清空筛选数据
    this.setState({ filterValues: {} })
    this.filterForm.resetFields()
    this.init()
  }

  handleFetch = (pageNum = 1, pageSize = 10) => {
    const {
      match: { params: { companyId, type } },
    } = this.props
    const { filterValues = {} } = this.state
    this.fetchWorkApprovalList({
      payload: {
        ...filterValues,
        pageNum,
        pageSize,
        companyId,
        type,
      },
    })
  }


  /**
   * 筛选条件-危险化学品改变
   */
  handleChemicalSelect = (materialsId) => {
    if (!materialsId) return
    // 获取供货方单位
    this.fetchSupplierUnits({ payload: { materialsId } })
  }


  /**
   * 点击查看详情
   */
  handleViewDetail = (id) => {
    const {
      match: { params: { companyId, type } },
      location: { query: { companyName } },
    } = this.props
    router.push(`/data-analysis/work-approval-report/company/${companyId}/${type}/detail/${id}?companyName=${companyName}`)
  }

  /**
   * 点击查询
   */
  handleSearch = values => {
    const {
      sqsj: [query_start_time, query_end_time] = [],      // 申请时间
      zysj: [work_start_time, work_end_time] = [],        // 作业时间
      wgyssj: [finish_start_time, finish_end_time] = [],  // 完工验收时间
      sxkjmc,   // 受限空间名称
      dhdd,     // 动火地点
      zydd,     // 作业地点
      zyr,      // 作业人
      dhr,      // 动火人
      dzr,      // 吊装人
      zyjb,     // 作业级别
      zylb,     // 作业类别
      ...others
    } = values
    let filterValues = {
      ...others,
      address: sxkjmc || dhdd || zydd,
      jobUsers: zyr || dhr || dzr,
      level: zyjb || zylb,
      query_start_time: this.formatDateToMs(query_start_time),
      query_end_time: this.formatDateToMs(query_end_time),
      work_start_time: this.formatDateToMs(work_start_time),
      work_end_time: this.formatDateToMs(work_end_time),
      finish_start_time: this.formatDateToMs(finish_start_time),
      finish_end_time: this.formatDateToMs(finish_end_time),
    }
    // 筛选掉空数据
    filterValues = Object.fromEntries(Object.entries(filterValues).filter(([, value]) => value))
    // console.log('filterValues', filterValues);

    // 保存筛选栏数据
    this.setState({ filterValues }, () => {
      this.handleFetch()
    })

  }

  formatDateToMs = date => {
    return date && moment(date).format('YYYY-MM-DD HH:mm:ss')
  }

  formatDateToMin = date => {
    return date && moment(date).format('YYYY-MM-DD HH:mm')
  }


  /**
   * 点击重置
   */
  handleReset = () => {
    this.saveAataAnalysisState({
      payload: { supplierUnits: [] },
    })
    this.setState({ filterValues: {} }, () => {
      this.handleFetch()
    })
  }


  /**
   * 渲染筛选栏
   */
  renderFilter = () => {
    const {
      match: { params: { type: activeKey } },
      account: { departments = [] },
      dataAnalysis: {
        approvalStatus = [],    // 审批状态列表
        dangerChemicals = [],   // 危险化学品
        supplierUnits = [],     // 供货方单位
        jobLevel = [],            // 作业级别（类别）
      },
    } = this.props
    // 筛选栏所有表单项
    // key用来不同类型筛选
    const allFields = [
      {
        id: 'applyDepartment',
        key: '申请部门',
        render: () => (
          <Select placeholder="申请部门" >
            {departments.map(({ id, name }) => (
              <Option key={id} value={id}>{name}</Option>
            ))}
          </Select>
        ),
      },
      {
        id: 'applyUserName',
        key: '申请人',
        render: () => <Input placeholder="申请人" />,
      },
      {
        id: 'sqsj', // query_start_time,query_end_time
        key: '申请时间',
        render: () => (
          <RangePicker
            placeholder={['申请', '时间']}
            showTime={{ format: 'HH:mm:ss' }}
            format="YYYY-MM-DD HH:mm:ss"
            style={{ width: '100%' }}
            ranges={{
              '当天': [moment(), moment()],
              '本月': [moment().startOf('month'), moment().endOf('month')],
            }}
          />
        ),
      },
      {
        id: 'dangerChemicalId',
        key: '危险化学品',
        render: () => (
          <Select placeholder="危险化学品" onSelect={this.handleChemicalSelect} >
            {dangerChemicals.map(item => (<Option key={item.id}>{item.name}</Option>))}
          </Select>
        ),
      },
      {
        id: 'qualified',
        key: '是否合格',
        render: () => (
          <Select placeholder="是否合格" >
            {QUALIFIED.map(({ value, label }) => (<Option key={value}>{label}</Option>))}
          </Select>
        ),
      },
      {
        id: 'supplyCompany',
        key: '供货方单位',
        render: () => (
          <Select placeholder="供货方单位" >
            {supplierUnits.map(item => (<Option key={item.id}>{item.name}</Option>))}
          </Select>
        ),
      },
      {
        id: 'useCompany',
        key: '使用单位',
        render: () => (
          <Select placeholder="使用单位" >
            {departments.map(({ id, name }) => (
              <Option key={id} value={id}>{name}</Option>
            ))}
          </Select>
        ),
      },
      {
        id: 'approveStatus',
        key: '审批状态',
        render: () => (
          <Select placeholder="审批状态" >
            {approvalStatus.map(item => (<Option key={item.value}>{item.desc}</Option>))}
          </Select>
        ),
      },
      {
        id: 'zyjb',
        key: '作业级别',
        render: () => (
          <Select placeholder="作业级别" >
            {jobLevel.map(item => (<Option key={item.value}>{item.desc}</Option>))}
          </Select>
        ),
      },
      {
        id: 'zylb',
        key: '作业类别',
        render: () => (
          <Select placeholder="作业类别" >
            {jobLevel.map(item => (<Option key={item.value}>{item.desc}</Option>))}
          </Select>
        ),
      },
      {
        id: 'code',
        key: '作业证编号',
        render: () => <Input placeholder="作业证编号" />,
      },
      {
        id: 'zysj', // work_start_time , work_end_time
        key: '作业时间',
        render: () => (
          <RangePicker
            placeholder={['作业', '时间']}
            style={{ width: '100%' }}
            ranges={{
              '当天': [moment(), moment()],
              '本月': [moment().startOf('month'), moment().endOf('month')],
            }}
          />
        ),
      },
      {
        id: 'dhdd',
        key: '动火地点',
        render: () => <Input placeholder="动火地点" />,
      },
      {
        id: 'dhr',
        key: '动火人',
        render: () => <Input placeholder="动火人" />,
      },
      {
        id: 'sxkjmc',
        key: '受限空间名称',
        render: () => <Input placeholder="受限空间名称" />,
      },
      {
        id: 'wgyssj',
        key: '完工验收时间',
        render: () => (
          <RangePicker
            placeholder={['完工验收', '时间']}
            style={{ width: '100%' }}
            ranges={{
              '当天': [moment(), moment()],
              '本月': [moment().startOf('month'), moment().endOf('month')],
            }}
          />
        ),
      },
      {
        id: 'zyr',
        key: '作业人',
        render: () => <Input placeholder="作业人" />,
      },
      {
        id: 'dzr',
        key: '吊装人',
        render: () => <Input placeholder="吊装人" />,
      },
      {
        id: 'zydd',
        key: '作业地点',
        render: () => <Input placeholder="作业地点" />,
      },
      {
        id: 'mbbh',
        key: '盲板编号',
        render: () => <Input placeholder="盲板编号" />,
      },
    ]
    const fields = (TABLIST.find(item => item.key === activeKey) || {}).fields
    const formFields = fields && fields.length ? fields.map(item => allFields.find(val => val.key === item)) : []

    return (
      <Card>
        <InlineForm
          ref={filterForm => { this.filterForm = filterForm }}
          fields={formFields}
          gutter={{ lg: 48, md: 24 }}
          onSearch={this.handleSearch}
          onReset={this.handleReset}
        ></InlineForm>
      </Card>
    )
  }


  /**
   * 渲染列表
   */
  renderTable = () => {
    const {
      dataAnalysis: {
        workApproval: {
          list = [],
          pagination: {
            total = 0,
            pageNum = 1,
            pageSize = 10,
          },
        },
      },
    } = this.props
    const {
      match: { params: { type: activeKey } },
    } = this.props
    const allColumns = [
      {
        title: '申请时间',
        key: 'sqsj',
        align: 'center',
        width: 300,
        render: (val, row) => <span>{this.formatDateToMin(row.applyTime)}</span>,
      },
      {
        title: '申请人',
        dataIndex: 'applyUserName',
        align: 'center',
        width: 150,
      },
      {
        title: '申请部门',
        dataIndex: 'applyDepartmentName',
        align: 'center',
        width: 200,
      },
      {
        title: '危险化学品',
        dataIndex: 'chemicalName',
        align: 'center',
        width: 200,
      },
      {
        title: '重量（吨）',
        dataIndex: 'weight',
        align: 'center',
        width: 150,
      },
      {
        title: '是否合格',
        dataIndex: 'qualifiedName',
        align: 'center',
        width: 200,
      },
      {
        title: '供货方单位',
        dataIndex: 'supplyCompanyName',
        align: 'center',
        width: 300,
      },
      {
        title: '货主或相关人员',
        dataIndex: 'supplyPerson',
        align: 'center',
        width: 300,
      },
      {
        title: '使用单位',
        dataIndex: 'useDepartmentName',
        align: 'center',
        width: 300,
      },
      {
        title: '卸货监护人',
        dataIndex: 'guardian',
        align: 'center',
        width: 200,
      },
      {
        title: '审批状态',
        align: 'center',
        key: '审批状态',
        width: 150,
        render: (val, row) => (
          <Badge status={APPROVALCOLOR[row.approveStatus]} text={row.approveStatusName} />
        ),
      },
      {
        title: '作业级别',
        dataIndex: 'levelName',
        align: 'center',
        width: 150,
        render: (val) => <span>{val}</span>,
      },
      {
        title: '作业证编号',
        dataIndex: 'code',
        align: 'center',
        width: 150,
      },
      {
        title: '作业开始时间',
        dataIndex: 'startTime',
        align: 'center',
        width: 150,
        render: (val, row) => <span>{this.formatDateToMin(val)}</span>,
      },
      {
        title: '作业结束时间',
        dataIndex: 'endTime',
        align: 'center',
        width: 150,
        render: (val, row) => <span>{this.formatDateToMin(val)}</span>,
      },
      {
        title: '动火地点',
        dataIndex: 'address',
        align: 'center',
        width: 150,
      },
      {
        title: '动火人',
        dataIndex: 'jobUsers',
        align: 'center',
        width: 150,
      },
      {
        title: '操作',
        key: '操作',
        align: 'center',
        width: 150,
        fixed: 'right',
        render: (val, row) => (
          <span>
            <AuthA code={detailCode} onClick={() => this.handleViewDetail(row.id)}>查看</AuthA>
          </span>
        ),
      },
      {
        title: '受限空间名称',
        dataIndex: 'address',
        align: 'center',
        width: 150,
      },
      {
        title: '完工验收时间',
        dataIndex: 'jobFinishTime',
        align: 'center',
        width: 150,
        render: (val, row) => <span style={{ color: row.endTime > row.jobFinishTime ? 'red' : 'inherit' }}>{this.formatDateToMin(val)}</span>,
      },
      {
        title: '作业人',
        dataIndex: 'jobUsers',
        key: 'wgyssj',
        align: 'center',
        width: 150,
      },
      {
        title: '作业地点',
        dataIndex: 'address',
        align: 'center',
        width: 150,
      },
      {
        title: '盲板编号',
        dataIndex: 'mbbh',
        key: 'mbbh',
        align: 'center',
        width: 150,
      },
      {
        title: '作业类别',
        dataIndex: 'levelName',
        align: 'center',
        width: 150,
      },
    ]
    const columns = TABLIST.find(item => item.key === activeKey).columns
    const tableColumns = columns && columns.length ? columns.map(item => allColumns.find(val => val.title === item)) : []
    // console.log('tableColumns', tableColumns)
    return (
      <Card style={{ marginTop: '24px' }}>
        <Table
          rowKey="id"
          dataSource={list}
          bordered
          columns={tableColumns}
          scroll={{ x: 'max-content' }}
          pagination={{
            current: pageNum,
            pageSize,
            total,
            showQuickJumper: true,
            showSizeChanger: true,
            pageSizeOptions: ['10', '15', '20', '30'],
            onChange: this.handleFetch,
            onShowSizeChange: (num, size) => {
              this.handleFetch(1, size);
            },
          }}
        />
      </Card>
    )
  }

  render() {
    const {
      match: { params: { type: activeKey } },
      location: { query: { companyName } },
      dataAnalysis: {
        workApproval: {
          list = [],
          pagination: {
            total = 0,
          },
        },
      },
    } = this.props

    return (
      <PageHeaderLayout
        title={companyName}
        breadcrumbList={BREADCRUMBLIST}
        tabList={TABLIST}
        onTabChange={this.handleTabChange}
        tabActiveKey={activeKey}
        wrapperClassName={styles.workApprovalHead}
        content={<span>检查记录总数：{total}</span>}
      >
        {this.renderFilter()}
        {list.length > 0 ? this.renderTable() : <div className={styles.emptyContainer}><span>暂无数据</span></div>}
      </PageHeaderLayout>
    )
  }
}