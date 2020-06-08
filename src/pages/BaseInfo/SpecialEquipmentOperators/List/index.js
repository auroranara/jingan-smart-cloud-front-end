import { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import {
Card, Button, Table, Input, Select, Divider, Row, Col, // Cascader,
message,
} from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import urls from '@/utils/urls';
import titles from '@/utils/titles';
import router from 'umi/router';
import { AuthA, AuthButton, AuthPopConfirm } from '@/utils/customAuth';
import moment from 'moment';
import codes from '@/utils/codes';
import { getColorVal, paststatusVal } from '@/pages/BaseInfo/SpecialEquipment/utils';

const FormItem = Form.Item;

const title = '特种设备作业人员';
const defaultPageSize = 10;
const {
  home: homeUrl,
  baseInfo: {
    specialEquipmentOperators: { add: addUrl },
  },
} = urls;

const {
  home: homeTitle,
  specialEquipmentOperators: { menu: menuTitle },
} = titles;
const {
  baseInfo: {
    specialEquipmentOperators: {
      add: addCode,
      edit: editCode,
      delete: deleteCode,
    },
  },
} = codes;
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
]
const colWrapper = { lg: 8, md: 12, sm: 24, xs: 24 }
const formItemStyle = { style: { margin: '0', padding: '4px 0' } }
const expirationStatusList = [
  { key: '0', label: '未到期' },
  { key: '1', label: '即将到期' },
  { key: '2', label: '已过期' },
]

@Form.create()
@connect(({ baseInfo, user, emergencyManagement, loading }) => ({
  baseInfo,
  user,
  emergencyManagement,
  tableLoading: loading.effects['baseInfo/fetchSpecialEquipPerson'],
}))
export default class SpecialEquipmentOperatorsList extends PureComponent {

  state = {
    workProjectOptions: [], // 作业项目选项
    workTypeOptions: [], // 作业种类
  }

  componentDidMount () {
    // const { user: { currentUser: { unitType } } } = this.props;
    this.handleQuery();
    this.fetchTypeOptions()
    this.fetchDict({
      payload: { type: 'workProject' },
      callback: list => { this.setState({ workTypeOptions: list }) },
    })
  }

  // 获取分类
  fetchTypeOptions = (payload, success, error) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'emergencyManagement/fetchDicts',
      payload: { type: 'specialEquipment' },
    });
  };

  // 获取字典
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
    dispatch({
      type: 'baseInfo/fetchSpecialEquipPerson',
      payload: {
        ...resValues,
        pageNum,
        pageSize,
        workType: Array.isArray(workType) ? workType.join(',') : undefined,
      },
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
    router.push(addUrl)
  }

  formateTime = timestramp => timestramp ? moment(timestramp).format('YYYY-MM-DD') : '-'

  // 点击删除
  handleDelete = (id) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'baseInfo/deleteSpecialEquipPerson',
      payload: { id },
      success: () => {
        message.success('删除成功');
        this.handleQuery()
      },
      error: res => { message.error(res ? res.msg : '删除失败') },
    })
  }

  // 作业种类改变
  handleWorkTypeChange = (workType) => {
    const { form: { setFieldsValue } } = this.props;
    if (workType) {
      this.fetchDict({
        payload: { type: 'workProject', parentId: workType },
        callback: list => { this.setState({ workProjectOptions: list }) },
      })
    } else this.setState({ workProjectOptions: [] });
    setFieldsValue({ workProject: undefined })
  }

  /**
   * 渲染筛选栏
   */
  renderFilter = () => {
    const {
      form: { getFieldDecorator },
      user: { isCompany },
      // emergencyManagement: { specialEquipment = [] },
    } = this.props;
    // const { workTypeOptions, workProjectOptions } = this.state;
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
                {getFieldDecorator('operapersonNumber')(
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
            {/* <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                {getFieldDecorator('workType')(
                  <Cascader
                    options={specialEquipment}
                    fieldNames={{
                      value: 'id',
                      label: 'label',
                      children: 'children',
                      isLeaf: 'isLeaf',
                    }}
                    changeOnSelect
                    placeholder="作业种类"
                    allowClear
                  />
                )}
              </FormItem>
            </Col> */}
            {/* <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                {getFieldDecorator('workProject')(
                  <Select placeholder="作业项目" allowClear>
                    {workProjectOptions.map(({ id, label }) => (
                      <Select.Option key={id} value={id}>{label}</Select.Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col> */}
            {!isCompany && (
              <Col {...colWrapper}>
                <FormItem {...formItemStyle}>
                  {getFieldDecorator('companyName')(
                    <Input placeholder="单位名称" />
                  )}
                </FormItem>
              </Col>
            )}
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
        specialEquipmentOperators: {
          list = [],
          pagination: { total = 0, pageNum = 1, pageSize = 10 },
        },
      },
      user: { isCompany },
    } = this.props;
    const columns = [
      ...(isCompany ? [] : [{
        title: '单位名称',
        dataIndex: 'companyName',
        align: 'center',
        width: 300,
      }]),
      {
        title: '基本信息',
        key: '基本信息',
        align: 'center',
        width: 300,
        render: (val, { name, sex, birthday, telephone }) => (
          <div style={{ textAlign: 'left' }}>
            <div>姓名：{name}</div>
            {sex !== null && <div>性别：{(sex === '1' && '男') || (sex === '2' && '女')}</div>}
            {birthday !== null && <div>出生年月：{this.formateTime(birthday)}</div>}
            {telephone && <div>联系电话：{telephone}</div>}
          </div>
        ),
      },
      {
        title: '作业种类—作业项目',
        dataIndex: 'workTypeName',
        align: 'center',
        width: 300,
        render: (val, { projectCode, workTypeName, workProjectName, choose }) => {
          let projectCodeName = projectCode;
          if (+choose === 0) {
            // 如果 项目代号输入方式为选择
            const target = this.state.workTypeOptions.find(item => item.id === projectCode);
            projectCodeName = target ? target.value : '暂无数据';
          }
          return (
            <div style={{ textAlign: 'left' }}>
              <div>{projectCodeName}</div>
              <div>{`${workTypeName || '暂无数据'} / ${workProjectName || '暂无数据'}`}</div>
            </div>
          )
        },
      },
      // {
      //   title: '作业项目',
      //   dataIndex: 'workProjectName',
      //   align: 'center',
      //   width: 250,
      //   render: (val, { workProjectName }) => workProjectName ? workProjectName.split('-')[1] : '暂无数据',
      // },
      {
        title: '作业人员证',
        dataIndex: 'permit',
        align: 'center',
        width: 300,
        render: (val, { paststatus, operapersonNumber, firstDate, startDate, endDate, reviewDate }) => (
          <div style={{ textAlign: 'left' }}>
            {/* {!isNaN(paststatus) && [1, 2].includes(+paststatus) && (<div style={{ color: 'red' }}>{expirationStatusList[+paststatus].label}</div>)} */}
            <div>证号：{operapersonNumber}</div>
            <div>初领日期：{this.formateTime(firstDate)}</div>
            <div>有效日期：{`${this.formateTime(endDate)}`}</div>
            <div>复审日期：{this.formateTime(reviewDate)}</div>
          </div>
        ),
      },
      {
        title: '证件状态',
        dataIndex: 'paststatus',
        key: 'paststatus',
        align: 'center',
        width: 120,
        render: (status, { endDate }) => {
          return (
            <span style={{ color: getColorVal(status) }}>
              {endDate ? paststatusVal[status] : '-'}
            </span>
          );
        },
      },
      {
        title: '附件',
        key: '附件',
        align: 'center',
        width: 300,
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
        width: 120,
        fixed: 'right',
        render: (val, row) => (
          <Fragment>
            <AuthA
              code={editCode}
              // onClick={() => { router.push(`/operation-safety/special-equipment-operators/edit/${row.id}`) }}
              onClick={e => window.open(`${window.publicPath}#/operation-safety/special-equipment-operators/edit/${row.id}`)}
            >
              编辑
            </AuthA>
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
            // pageSizeOptions: ['5', '10', '15', '20'],
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
        specialEquipmentOperators: {
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
