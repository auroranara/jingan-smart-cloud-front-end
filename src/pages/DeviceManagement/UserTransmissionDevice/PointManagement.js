import { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import {
  Table,
  Card,
  Row,
  Col,
  Input,
  Select,
  Button,
  Divider,
  Spin,
  message,
  Popconfirm,
  Modal,
} from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import { AuthA, hasAuthority, AuthButton } from '@/utils/customAuth';
import codes from '@/utils/codes';
import styles from './PointManagement.less';

const FormItem = Form.Item;
const Option = Select.Option;

const TITLE = '点位管理';
const colWrapper = { lg: 8, md: 12, sm: 24, xs: 24 }
const formItemStyle = { style: { margin: '0', padding: '4px 0' } }
const defaultPageSize = 10;
const formItemLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 15 },
}
const {
  deviceManagement: {
    transmission: {
      point: {
        edit: editCode,
        delete: deleteCode,
        add: addCode,
      },
    },
  },
} = codes

@Form.create()
@connect(({ transmission, user, loading }) => ({
  transmission,
  user,
  loading: loading.effects['transmission/fetchPoints'],
}))
export default class PointManagement extends Component {

  state = {
    visible: false, // 编辑弹窗可见
    pointId: null,  // 编辑时保存id
  }

  componentDidMount () {
    const { dispatch } = this.props
    // 获取设施类型、部件类型下拉列表
    dispatch({ type: 'transmission/fetchDictList' })
    this.handleSearch()
  }

  /**
   * 查询列表
   */
  handleSearch = (pageNum = 1, pageSize = defaultPageSize) => {
    const {
      dispatch,
      form: { getFieldsValue },
      match: { params: { hostId } },
    } = this.props
    const fields = getFieldsValue()
    let values = {}
    // 找到fields中所有ser开头的参数（搜索栏参数）并过滤
    for (const i in fields) {
      const value = fields[i]
      if (i.includes('ser') && value) {
        values[i.replace(/^ser/, '')] = value
      }
    }
    // 获取点位列表
    dispatch({
      type: 'transmission/fetchPoints',
      payload: {
        pageNum,
        pageSize,
        hostId, // 主机Id
        ...values,
      },
    })
  }

  // 点击重置
  handleReset = () => {
    const {
      form: { resetFields },
    } = this.props
    resetFields()
    this.handleSearch()
  }

  // 点击打开编辑弹窗
  handleToEdit = (row) => {
    const {
      form: { setFieldsValue },
    } = this.props
    const {
      id,
      systemType,
      unitType,
      loopNumber,
      partNumber,
      componentModel,
      createCompanyName,
      installFloor,
      installAddress,
    } = row
    this.setState({ visible: true, pointId: id }, () => {
      setFieldsValue({
        systemType: systemType + '',
        unitType: unitType + '',
        loopNumber,
        partNumber,
        componentModel,
        createCompanyName,
        installFloor,
        installAddress,
      })
    })
  }

  // 确认新增/编辑
  handleSubmit = () => {
    const {
      dispatch,
      form: { validateFields },
      match: { params: { hostId } },
    } = this.props
    const { pointId } = this.state
    validateFields([
      'systemType',
      'unitType',
      'loopNumber',
      'partNumber',
      'componentModel',
      'createCompanyName',
      'installFloor',
      'installAddress',
    ], (errs, values) => {
      if (errs) return
      const { loopNumber, partNumber, installFloor, ...others } = values
      const success = () => {
        message.success(`${pointId ? '编辑' : '新增'}点位成功`)
        this.setState({ visible: false })
        this.handleSearch()
      }
      const error = (res) => {
        const prompt = `${pointId ? '编辑' : '新增'}点位失败`
        const msg = res && res.msg ? `${prompt}，${res.msg}` : prompt
        message.error(msg)
      }
      const numbers = {
        loopNumber: +loopNumber, partNumber: +partNumber, installFloor: +installFloor,
      }
      if (pointId) {
        // 如果编辑
        dispatch({
          type: 'transmission/editPoint',
          payload: { ...others, id: pointId, hostId, ...numbers },
          success,
          error,
        })
      } else {
        // 如果新增
        dispatch({
          type: 'transmission/addPoint',
          payload: { ...others, hostId, ...numbers },
          success,
          error,
        })
      }
    })

  }

  // 删除操作
  handelDoDelete = (row) => {
    const { dispatch } = this.props
    dispatch({
      type: 'transmission/deletePoint',
      payload: { id: row.id },
      success: () => {
        message.success('删除成功')
        this.handleSearch()
      },
      error: (res) => {
        const msg = res && res.msg ? `删除点位失败，${res.msg}` : '删除点位失败'
        message.error(msg)
      },
    })
  }

  onClose = () => {
    this.setState({ visible: false })
  }


  /**
   * 点击新增
   */
  handleToAdd = () => {
    this.setState({ visible: true, pointId: null })
  }

  /**
   * 渲染筛选栏
   */
  renderFilter = () => {
    const {
      form: { getFieldDecorator },
      transmission: {
        facilityTypes = [],// 设施类型
        componentTypes = [],// 部件类型
      },
    } = this.props
    return (
      <Card>
        <Form>
          <Row gutter={16}>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle} >
                {getFieldDecorator('serSystemType')(
                  <Select placeholder="请选择系统类型" allowClear>
                    {facilityTypes.map(({ value, label }) => (
                      <Option key={value} value={value}>{label}</Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle} >
                {getFieldDecorator('serUnitType')(
                  <Select placeholder="请选择部件类型" allowClear>
                    {componentTypes.map(({ value, label }) => (
                      <Option key={value} value={value}>{label}</Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle} >
                {getFieldDecorator('serLoopNumber')(
                  <Input placeholder="请输入回路号" />
                )}
              </FormItem>
            </Col>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle} >
                {getFieldDecorator('serPartNumber')(
                  <Input placeholder="请输入部位号" />
                )}
              </FormItem>
            </Col>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle} >
                {getFieldDecorator('serComponentModel')(
                  <Input placeholder="请输入部件型号" />
                )}
              </FormItem>
            </Col>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle} >
                {getFieldDecorator('serInstallFloor')(
                  <Input placeholder="请输入安装楼层" />
                )}
              </FormItem>
            </Col>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle} >
                {getFieldDecorator('serInstallAddress')(
                  <Input placeholder="请输入安装位置" />
                )}
              </FormItem>
            </Col>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle} >
                <Button type="primary" style={{ marginRight: '10px' }} onClick={() => this.handleSearch()}>查询</Button>
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
   * 渲染弹窗
   */
  renderModal = () => {
    const {
      form: { getFieldDecorator },
      transmission: {
        facilityTypes = [],
        componentTypes = [],
      },
    } = this.props
    const { visible, pointId } = this.state
    return (
      <Modal
        width={600}
        title={pointId ? '编辑点位' : '新增点位'}
        visible={visible}
        destroyOnClose
        onCancel={this.onClose}
        onOk={this.handleSubmit}
      >
        <Form>
          <FormItem label="系统类型" {...formItemLayout}>
            {getFieldDecorator('systemType', {
              rules: [{ required: true, message: '请选择系统类型' }],
            })(
              <Select placeholder="请选择系统类型" allowClear>
                {facilityTypes.map(({ value, label }) => (
                  <Option key={value} value={value}>{label}</Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem label="部件类型" {...formItemLayout}>
            {getFieldDecorator('unitType', {
              rules: [{ required: true, message: '请选择部件类型' }],
            })(
              <Select placeholder="请选择部件类型" allowClear>
                {componentTypes.map(({ value, label }) => (
                  <Option key={value} value={value}>{label}</Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem label="回路号" {...formItemLayout}>
            {getFieldDecorator('loopNumber', {
              validateTrigger: 'onBlur',
              rules: [
                { required: true, message: '请输入回路号' },
                { message: '请输入1-9位数字', pattern: /^\d{1,9}$/ },
              ],
            })(
              <Input placeholder="请输入回路号" />
            )}
          </FormItem>
          <FormItem label="部位号" {...formItemLayout}>
            {getFieldDecorator('partNumber', {
              validateTrigger: 'onBlur',
              rules: [
                { required: true, message: '请输入部位号' },
                { message: '请输入1-9位数字', pattern: /^\d{1,9}$/ },
              ],
            })(
              <Input placeholder="请输入部位号" />
            )}
          </FormItem>
          <FormItem label="部件型号" {...formItemLayout}>
            {getFieldDecorator('componentModel', {
              validateTrigger: 'onBlur',
              rules: [
                { required: true, message: '请输入部件型号' },
                { message: '请勿输入除"-"以外的特殊字符', pattern: /^[\u4e00-\u9fa5a-z0-9\-]+$/gi },
                { message: '输入限制为100个字符', max: 100 },
              ],
            })(
              <Input placeholder="请输入部件型号" />
            )}
          </FormItem>
          <FormItem label="生产企业名称" {...formItemLayout}>
            {getFieldDecorator('createCompanyName', {
              validateTrigger: 'onBlur',
              rules: [
                { required: true, message: '请输入生产企业名称' },
                { message: '请勿输入特殊字符', pattern: /^[\u4e00-\u9fa5a-z0-9]+$/gi },
                { message: '输入限制为100个字符', max: 100 },
              ],
            })(
              <Input placeholder="请输入生产企业名称" />
            )}
          </FormItem>
          <FormItem label="安装楼层" {...formItemLayout}>
            {getFieldDecorator('installFloor', {
              validateTrigger: 'onBlur',
              rules: [
                { required: true, message: '请输入安装楼层' },
                { message: '请输入1-9位数字', pattern: /^\d{1,9}$/ },
              ],
            })(
              <Input placeholder="请输入安装楼层" />
            )}
          </FormItem>
          <FormItem label="安装位置" {...formItemLayout}>
            {getFieldDecorator('installAddress', {
              validateTrigger: 'onBlur',
              rules: [
                { required: true, message: '请输入安装位置' },
                { message: '请勿输入特殊字符', pattern: /^[\u4e00-\u9fa5a-z0-9\-\(\)\（\）]+$/gi },
                { message: '输入限制为100个字符', max: 100 },
              ],
            })(
              <Input placeholder="请输入安装位置" />
            )}
          </FormItem>
        </Form>
        {/* <div
          style={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            width: '100%',
            borderTop: '1px solid #e9e9e9',
            padding: '10px 16px',
            background: '#fff',
            textAlign: 'right',
          }}
        >
          <Button style={{ marginRight: 8 }} onClick={this.onClose}>取消</Button>
          <Button type="primary" onClick={this.handleSubmit}>确认</Button>
        </div> */}
      </Modal>
    );
  }

  render () {
    const {
      loading,
      match: { params: { companyId } },
      location: { query: { deviceCode } },
      user: { currentUser: { permissionCodes } },
      transmission: {
        // 点位列表分页信息
        pointManagement: {
          list = [],
          pagination: {
            pageNum = 1,
            pageSize = defaultPageSize,
            total = 0,
          },
        },
        facilityTypes = [], // 设施类型
        componentTypes = [], // 部件类型
      },
    } = this.props
    const deleteAuth = hasAuthority(deleteCode, permissionCodes)
    const breadcrumbList = [
      { title: '首页', name: '首页', href: '/' },
      { title: '物联设备管理', name: '物联设备管理' },
      { title: '用户传输装置', name: '用户传输装置', href: '/device-management/user-transmission-device/list' },
      { title: '详情页', name: '详情页', href: `/device-management/user-transmission-device/${companyId}/detail` },
      { title: TITLE, name: TITLE },
    ]
    const columns = [
      {
        title: '消防设施系统类型',
        dataIndex: 'systemType',
        align: 'center',
        width: 300,
        render: (val) => {
          const target = facilityTypes.find(item => +item.value === val)
          return target ? <span>【{val}】{target.label}</span> : null
        },
      },
      {
        title: '消防设施部件类型',
        dataIndex: 'unitType',
        align: 'center',
        width: 300,
        render: (val) => {
          const target = componentTypes.find(item => +item.value === val)
          return target ? <span>【{val}】{target.label}</span> : null
        },
      },
      {
        title: '回路号',
        dataIndex: 'loopNumber',
        align: 'center',
        width: 150,
      },
      {
        title: '部位号',
        dataIndex: 'partNumber',
        align: 'center',
        width: 150,
      },
      {
        title: '部件型号',
        dataIndex: 'componentModel',
        align: 'center',
        width: 150,
      },
      {
        title: '生产企业名称',
        dataIndex: 'createCompanyName',
        align: 'center',
        width: 300,
      },
      {
        title: '安装楼层',
        dataIndex: 'installFloor',
        align: 'center',
        width: 100,
      },
      {
        title: '安装位置',
        dataIndex: 'installAddress',
        align: 'center',
        width: 200,
      },
      {
        title: '操作',
        key: '操作',
        align: 'center',
        width: 150,
        fixed: 'right',
        render: (val, row) => (
          <Fragment>
            {!row.hasData ? (
              <span className={styles.noAuth}>编辑</span>
            ) : (
                <AuthA
                  code={editCode}
                  onClick={() => { this.handleToEdit(row) }}
                >
                  编辑
                </AuthA>
              )}
            <Divider type="vertical" />
            {deleteAuth && row.hasData ? (
              <Popconfirm title="确认要删除改点位吗？" onConfirm={() => this.handelDoDelete(row)}>
                <a>删除</a>
              </Popconfirm>
            ) : (<span className={styles.noAuth}>删除</span>)}
          </Fragment>
        ),
      },
    ]
    return (
      <PageHeaderLayout
        title={TITLE}
        breadcrumbList={breadcrumbList}
        content={(
          <Fragment>
            <span style={{ paddingRight: '5em' }}>主机编号：{deviceCode}</span>
            <span>点位总数：{total}</span>
          </Fragment>
        )}
      >
        {this.renderFilter()}
        <Spin spinning={loading}>
          {list.length > 0 ? (
            <Card style={{ marginTop: '24px' }}>
              <Table
                rowKey="id"
                bordered
                dataSource={list}
                columns={columns}
                scroll={{ x: 'max-content' }}
                pagination={{
                  current: pageNum,
                  pageSize,
                  total,
                  showQuickJumper: true,
                  showSizeChanger: true,
                  // pageSizeOptions: ['5', '10', '15', '20'],
                  onChange: this.handleSearch,
                  onShowSizeChange: (num, size) => {
                    this.handleSearch(1, size);
                  },
                }}
              />
            </Card>
          ) : <div style={{ padding: '20px', color: 'rgba(0, 0, 0, 0.45)', textAlign: 'center' }}>暂无数据</div>}
        </Spin>
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <Button onClick={e => window.close()}>
            返回
          </Button>
        </div>
        {this.renderModal()}
      </PageHeaderLayout>
    )
  }
}
