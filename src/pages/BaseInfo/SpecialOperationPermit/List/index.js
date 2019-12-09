import { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Card,
  Button,
  Form,
  Table,
  Input,
  Select,
  Divider,
  Row,
  Col,
  Cascader,
  message,
  // Collapse,
} from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import urls from '@/utils/urls';
import titles from '@/utils/titles';
import router from 'umi/router';
import codes from '@/utils/codes';
import { AuthA, AuthButton, AuthPopConfirm } from '@/utils/customAuth';
import moment from 'moment';

const FormItem = Form.Item;
// const { Panel } = Collapse;
const {
  baseInfo: {
    specialOperationPermit: {
      add: addCode,
      edit: editCode,
      delete: deleteCode,
    },
  },
} = codes;

const {
  home: homeUrl,
} = urls;

const {
  home: homeTitle,
  specialOperationPermit: { menu: menuTitle },
} = titles;
const title = "特种作业操作证人员"
const breadcrumbList = [
  {
    title: homeTitle,
    name: homeTitle,
    href: homeUrl,
  },
  {
    title: menuTitle,
    name: menuTitle,
  },
  {
    title,
    name: title,
  },
];
const colWrapper = { lg: 8, md: 12, sm: 24, xs: 24 }
const formItemStyle = { style: { margin: '0', padding: '4px 0' } }
// 到期状态选项
const expirationStatusList = [
  { key: '0', label: '未到期' },
  { key: '1', label: '即将到期' },
  { key: '2', label: '已过期' },
]
const defaultPageSize = 10;

@Form.create()
@connect(({ baseInfo, loading }) => ({
  baseInfo,
  tableLoading: loading.effects['baseInfo/fetchSpecialWorkPerson'],
}))
export default class specialOperationPermitList extends PureComponent {

  state = {
    operationCategory: [], // 作业类别选项
  };

  componentDidMount () {
    // 获取作业类别
    this.fetchDict({
      payload: { type: 'workType', parentId: 0 },
      callback: list => {
        this.setState({ operationCategory: this.generateOperationCategory(list) })
      },
    })
    this.handleQuery()
  }

  // 获取作业类别
  fetchDict = actions => {
    const { dispatch } = this.props;
    dispatch({
      type: 'baseInfo/fetchDict',
      ...actions,
    })
  }

  // 查询列表数据
  handleQuery = (pageNum = 1, pageSize = defaultPageSize) => {
    const {
      dispatch,
      form: { getFieldsValue },
    } = this.props;
    const { workType, ...resValues } = getFieldsValue();
    const payload = { ...workType && workType.length ? { workType: workType.join(',') } : {}, ...resValues };
    dispatch({
      type: 'baseInfo/fetchSpecialWorkPerson',
      payload: { ...payload, pageNum, pageSize },
    })
  }

  // 点击重置
  handleReset = () => {
    const { form: { resetFields } } = this.props;
    resetFields();
    this.handleQuery()
  }

  // 点击新增
  handleToAdd = () => {
    router.push('/operation-safety/special-operation-permit/add')
  }

  // 格式化作业列别选项
  generateOperationCategory = list => list.length ? list.map(({ id, label, hasChild }) => ({ value: id, label, isLeaf: !Number(hasChild) })) : []

  // 加载作业类别下级选项
  loadOperationCategory = selectedOptions => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    this.fetchDict({
      payload: { type: 'workType', parentId: targetOption.value },
      callback: list => {
        const children = this.generateOperationCategory(list);
        targetOption.loading = false;
        targetOption.children = children;
        this.setState({ operationCategory: [...this.state.operationCategory] })
      },
    })
  }

  formateTime = timestramp => moment(timestramp).format('YYYY-MM-DD')

  // 删除数据
  handleDelete = (id) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'baseInfo/deleteSpecialWorkPerson',
      payload: { id },
      success: () => {
        message.success('删除成功');
        this.handleQuery()
      },
      error: res => { message.error(res ? res.msg : '删除失败') },
    })
  }

  /**
   * 渲染筛选栏
   */
  renderFilter = () => {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { operationCategory } = this.state;
    return (
      <Card>
        <Form>
          <Row gutter={16}>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                {getFieldDecorator('name')(
                  <Input placeholder="姓名" />
                )}
              </FormItem>
            </Col>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                {getFieldDecorator('certificateNumber')(
                  <Input placeholder="证号" />
                )}
              </FormItem>
            </Col>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                {getFieldDecorator('paststatus')(
                  <Select placeholder="到期状态">
                    {expirationStatusList.map(({ key, label }) => (
                      <Select.Option key={key} value={key}>{label}</Select.Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                {getFieldDecorator('workType')(
                  <Cascader
                    placeholder="作业类别"
                    options={operationCategory}
                    loadData={this.loadOperationCategory}
                    changeOnSelect
                  />
                )}
              </FormItem>
            </Col>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                {getFieldDecorator('companyName')(
                  <Input placeholder="单位名称" />
                )}
              </FormItem>
            </Col>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                <Button style={{ marginRight: '10px' }} type="primary" onClick={() => this.handleQuery()}>查询</Button>
                <Button style={{ marginRight: '10px' }} onClick={this.handleReset}>重置</Button>
                <AuthButton code={addCode} type="primary" onClick={this.handleToAdd}>新增</AuthButton>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Card>
    )
  }

  /**
   * 渲染表格
   */
  renderTable = () => {
    const {
      tableLoading,
      baseInfo: {
        specialOperationPermit: {
          list = [],
          pagination: { total = 0, pageNum = 1, pageSize = 10 },
        },
      },
    } = this.props
    const columns = [
      {
        title: '单位名称',
        dataIndex: 'companyName',
        align: 'center',
        width: 300,
      },
      {
        title: '基本信息',
        key: '基本信息',
        align: 'center',
        width: 300,
        render: (val, { name, sex, birthday, telephone }) => (
          <div style={{ textAlign: 'left' }}>
            <div>姓名：{name}</div>
            <div>性别：{(sex === '1' && '男') || (sex === '2' && '女')}</div>
            <div>出生年月：{this.formateTime(birthday)}</div>
            <div>联系电话：{telephone}</div>
          </div>
        ),
      },
      {
        title: '作业类别',
        dataIndex: 'workTypeName',
        align: 'center',
        width: 250,
      },
      {
        title: '操作证',
        dataIndex: 'operationPermit',
        align: 'center',
        width: 300,
        render: (val, { paststatus, certificateNumber, firstDate, reviewDate, startDate, endDate }) => (
          <div style={{ textAlign: 'left' }}>
            {!isNaN(paststatus) && [1, 2].includes(+paststatus) && (<div style={{ color: 'red' }}>{expirationStatusList[+paststatus].label}</div>)}
            <div>证号：{certificateNumber}</div>
            <div>初领日期：{this.formateTime(firstDate)}</div>
            <div>有效日期：{`${this.formateTime(startDate)}~${this.formateTime(endDate)}`}</div>
            <div>复审日期：{this.formateTime(reviewDate)}</div>
          </div>
        ),
      },
      {
        title: '证照附件',
        key: '证照附件',
        align: 'center',
        width: 250,
        render: (val, { certificatePositiveFileList, certificateReverseFileList }) => (
          <div style={{ textAlign: 'left' }}>
            <Row style={{ marginBottom: '10px' }}>
              正面附件：
              {certificatePositiveFileList.map(({ fileName, webUrl, id }) => (
                <div
                  style={{ color: '#1890ff', cursor: 'pointer' }}
                  key={id}
                  onClick={() => { window.open(webUrl, '_blank') }}
                >
                  {fileName}
                </div>
              ))}
            </Row>
            <Row>
              反面附件：
              {certificateReverseFileList.map(({ fileName, webUrl, id }) => (
                <div
                  style={{ color: '#1890ff', cursor: 'pointer' }}
                  key={id}
                  onClick={() => { window.open(webUrl, '_blank') }}
                >
                  {fileName}
                </div>
              ))}
            </Row>
          </div>
        ),
      },
      {
        title: '操作',
        key: '操作',
        align: 'center',
        width: 200,
        fixed: 'right',
        render: (val, row) => (
          <Fragment>
            <AuthA code={editCode} onClick={() => { router.push(`/operation-safety/special-operation-permit/edit/${row.id}`) }}>编辑</AuthA>
            <Divider type="vertical" />
            <AuthPopConfirm
              code={deleteCode}
              title="确认要删除该数据吗？"
              onConfirm={() => this.handleDelete(row.id)}
            >
              删除
            </AuthPopConfirm>
          </Fragment>
        ),
      },
    ]
    return list && list.length ? (
      <Card style={{ marginTop: '24px' }}>
        <Table
          rowKey="id"
          loading={tableLoading}
          columns={columns}
          dataSource={list}
          bordered
          scroll={{ x: 'max-content' }}
          pagination={{
            current: pageNum,
            pageSize,
            total,
            showQuickJumper: true,
            showSizeChanger: true,
            pageSizeOptions: ['5', '10', '15', '20'],
            onChange: this.handleQuery,
            onShowSizeChange: (num, size) => {
              this.handleQuery(1, size);
            },
          }}
        />
      </Card>
    ) : (<div style={{ textAlign: 'center', padding: '70px' }}> 暂无数据</div>)
  }

  render () {
    const {
      baseInfo: {
        specialOperationPermit: {
          a = 0,
          pagination: { total = 0 },
        },
      },
    } = this.props;
    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
        content={`单位数量：${a} 人员数量：${total}`}
      >
        {this.renderFilter()}
        {this.renderTable()}
      </PageHeaderLayout>
    )
  }
}