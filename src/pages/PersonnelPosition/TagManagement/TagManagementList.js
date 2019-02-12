import React, { PureComponent } from 'react';
import { Button, Card, Input, Form, Row, Col, Select, List, Spin, Modal, Radio, Table } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import { connect } from 'dva';
import codes from '@/utils/codes';
import InfiniteScroll from 'react-infinite-scroller';
import Ellipsis from 'components/Ellipsis';
import { hasAuthority, AuthA } from '@/utils/customAuth';
import router from 'umi/router';
import tagImg from '@/assets/tag.png';
import styles from './TagManagementList.less';
import { message } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;
const confirm = Modal.confirm;

const {
  personnelPosition: {
    tag: {
      add: addCode,
      edit: editCode,
      delete: deleteCode,
      detail: viewCode,
    },
  },
} = codes

const title = "标签列表"
const defaultPageSize = 10;
const colWrapper = { lg: 12, md: 12, sm: 24, xs: 24 }

const cardStatusInfo = [
  { label: '已领用', value: 0 },
  { label: '未领用', value: 1 },
  { label: '禁用', value: 2 },
]

const typesInfo = [
  { label: '普通卡', value: '0' },
  { label: '临时卡', value: '1' },
]

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};
const itemStyles = { style: { width: 'calc(70%)', marginRight: '10px' } }
const columns = [
  {
    title: '用户名',
    dataIndex: 'userName',
    key: 'userName',
    align: 'center',
  },
  {
    title: '手机号',
    dataIndex: 'phoneNumber',
    key: 'phoneNumber',
    align: 'center',
  },
]

@Form.create()
@connect(({ personnelPosition, user, loading }) => ({
  personnelPosition,
  user,
  loading: loading.effects['personnelPosition/fetchTagList'],
}))
/* 标签管理 */
export default class TagManagement extends PureComponent {

  state = {
    modalVisible: false, // 弹窗可见
    employeeModalVisible: false,// 选择单位弹窗可见
    currentPersonnelList: [],   // 当前分页下人员列表
    selectedPersonnerlKeys: [],           // 选中的人员列表
    pagination: {               // 人员分页信息
      pageNum: 1,
      pageSize: 10,
      total: 0,
    },
    tagDetail: {},       // 领卡时保存的标签详情
    searchUserName: null,   // 持卡人用户名（搜索用）
    searchPhoneNumber: null,  // 持卡人手机号（搜索用）
  }

  componentDidMount() {
    const {
      form: { setFieldsValue },
      personnelPosition: {
        tag: { searchInfo: { searchType, searchCardStatus, searchCode } = {} },
      },
    } = this.props
    // 填入已保存的搜索栏数据
    setFieldsValue({ searchType, searchCardStatus, searchCode })
    // 获取标签卡列表
    this.handleQuery()
  }

  // 获取标签列表
  fetchTagList = (actions) => {
    const { dispatch } = this.props
    dispatch({
      type: 'personnelPosition/fetchTagList',
      ...actions,
    })
  }

  // 改变标签卡状态（领卡、退卡、启用、禁用）
  changeTag = (actions) => {
    // 参数 status 1：启用改禁用，2:禁用改启用，3:退卡,4:领卡
    const { dispatch } = this.props
    dispatch({
      type: 'personnelPosition/changeTag',
      ...actions,
    })
  }

  // 获取持卡人
  fetchEmployees = (actions) => {
    const { dispatch } = this.props
    dispatch({
      type: 'personnelPosition/fetchEmployees',
      ...actions,
    })
  }

  // 更新state
  changeState = (key, value) => {
    const item = {}
    item[key] = value
    this.setState(item)
  }

  // 加载更多列表数据
  handleLoadMore = () => {
    const {
      personnelPosition: {
        tag: { pagination: { pageNum, pageSize } },
      },
      form: { getFieldsValue },
    } = this.props
    const { searchType, searchCardStatus, searchCode } = getFieldsValue()
    this.fetchTagList({
      payload: {
        pageNum: pageNum + 1,
        pageSize,
        type: searchType,
        cardStatus: searchCardStatus,
        code: searchCode,
      },
    })
  }

  // 确认退卡
  checkOut = ({ id: cardId }) => {
    this.changeTag({
      payload: { status: '3', cardId },
      success: () => {
        message.success('退卡成功！')
        // 重新获取标签列表
        this.handleQuery()
      },
      error: () => { message.error('退卡失败！') },
    })
  }

  // 关闭弹窗
  handleCloseModal = () => {
    this.setState({
      modalVisible: false,
    })
  }

  // 点击新增
  handleToAdd = () => {
    const { match: { params: { companyId } } } = this.props
    router.push(`/personnel-position/tag-management/add/${companyId}`)
  }

  // 点击查看详情
  handleToDetail = ({ id }) => {
    const { match: { params: { companyId } } } = this.props
    router.push({
      pathname: '/personnel-position/tag-management/detail',
      query: { id, companyId },
    })
  }

  // 点击查询
  handleQuery = (needSave = false) => {
    const {
      dispatch,
      form: { getFieldsValue },
      personnelPosition: {
        tag: { pagination: { pageSize } },
      },
    } = this.props
    const { searchType, searchCardStatus, searchCode } = getFieldsValue()
    this.fetchTagList({
      payload: {
        pageNum: 1,
        pageSize,
        type: searchType,
        cardStatus: searchCardStatus,
        code: searchCode,
      },
    })
    if (needSave) {
      dispatch({
        type: 'personnelPosition/saveTagSearchInfo',
        payload: { searchType, searchCardStatus, searchCode },
      })
    }
  }

  // 点击重置
  handleReset = () => {
    const {
      dispatch,
      form: { resetFields },
    } = this.props
    resetFields()
    dispatch({
      type: 'personnelPosition/saveTagSearchInfo',
      payload: {},
    })
    this.fetchTagList({
      payload: {
        pageNum: 1,
        pageSize: defaultPageSize,
      },
    })
  }

  // 点击启用禁用标签
  handleEnableChange = (value, { id: cardId, cardStatus, type, userId, visitorName = null }) => {
    // type 0 普通卡 1 临时卡;
    // cardStatus 0 已领用 1 未领用 2 禁用;
    // 传递参数 status 1：启用改禁用，2:禁用改启用，3:退卡,4:领卡;
    if (value === 'jinyong') {
      // 选择禁用
      const settings = {
        title: '提示',
        content: '您确定要禁用该标签卡？',
        onOk: () => {
          this.changeTag({
            payload: { status: '1', cardId },
            success: () => {
              message.success('禁用成功！')
              // 重新获取标签卡列表
              this.handleQuery()
            },
            error: () => { message.error('禁用失败！') },
          })
        },
        okText: '确认',
        cancelText: '取消',
      }
      if (+type === 0) {
        // 普通卡
        if (userId) {
          // 已有持卡人
          confirm({
            ...settings,
            content: '该卡已有持卡人，禁用后则自动解除，您确定要禁用该卡？',
          })
        } else {
          // 空卡无人绑定
          confirm({
            ...settings,
            content: '您确定要禁用该标签卡？',
          })
        }
      } else {
        // 临时卡
        if (visitorName) {
          confirm({
            ...settings,
            content: '该卡已有持卡人，禁用后则自动解除，您确定要禁用该卡？',
          })
          return
        }
        confirm({
          ...settings,
          content: '您确定要禁用该标签卡？',
        })
      }
    } else {
      // 选择启用
      confirm({
        title: '提示',
        content: '您确定要启用该标签卡吗？',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          this.changeTag({
            payload: { status: '2', cardId },
            success: () => {
              message.success('启用成功！')
              // 重新获取标签卡列表
              this.handleQuery()
            },
          })
        },
      })
    }
  }

  // 点击跳转到编辑页面
  handleToEdit = (id) => {
    const { match: { params: { companyId } } } = this.props
    router.push(`/personnel-position/tag-management/edit/${companyId}/${id}`)
  }

  // 人员列表页面变化
  handlePageChange = (pageNum, pageSize) => {
    const {
      personnelPosition: {
        tag: { personnelList },
      },
    } = this.props
    this.setState({
      currentPersonnelList: personnelList.slice((pageNum - 1) * pageSize, pageNum * pageSize),
      pagination: {
        ...this.state.pagination,
        pageNum,
        pageSize,
      },
    })
  }

  // 点击打开选择人员弹窗
  handleToSelectEmployee = () => {
    const {
      personnelPosition: { tag: { personnelList = [] } },
    } = this.props
    const {
      tagDetail,
    } = this.state
    if (tagDetail.companyId) {
      const currentPersonnelList = personnelList.slice(0, defaultPageSize)
      this.setState({
        employeeModalVisible: true,
        currentPersonnelList,
        pagination: {
          pageNum: 1,
          pageSize: defaultPageSize,
          total: personnelList ? personnelList.length : 0,
        },
      })
    } else {
      message.error('未选择单位')
    }
  }

  // 关闭选择人员弹窗
  handleCloseEmployeeModal = () => {
    this.setState({ employeeModalVisible: false })
  }

  // 选择人员
  selectPersonnel = () => {
    const {
      form: { setFieldsValue },
    } = this.props
    const {
      selectedRows = [],
    } = this.state
    if (!selectedRows || selectedRows.length <= 0) {
      message.error('请选择持卡人')
      return
    }
    const [personnel] = selectedRows,
      { phoneNumber } = personnel
    this.setState({ personnel, employeeModalVisible: false })
    setFieldsValue({ personnel, phoneNumber })
  }

  // 打开领卡弹窗
  handleReceiveCard = (item) => {
    const { id: cardId, type, code, phoneNumber, companyId, sysId, companyName } = item
    const {
      dispatch,
      form: { setFieldsValue },
    } = this.props
    // type 0  普通卡 1 临时卡 临时卡没有领卡退卡
    if (+type !== 0) return
    // 获取该单位下系统配置
    dispatch({
      type: 'personnelPosition/fetchSystemConfiguration',
      payload: { pageNum: 1, pageSize: 0, companyId },
    })
    // 获取单位人员
    this.fetchEmployees({
      payload: { companyId },
    })
    // 如果是普通卡 打开弹窗选择持卡人
    this.setState({
      modalVisible: true,
      tagDetail: item,
      selectedPersonnerlKeys: [],
    }, () => {
      setFieldsValue({
        code,
        type,
        personnel: undefined,
        phoneNumber,
        sysId,
        company: { id: companyId, name: companyName },
      })
    })
  }

  // 领卡
  receiveCard = () => {
    const {
      form: { validateFields },
    } = this.props
    const { tagDetail: { id: cardId } } = this.state
    validateFields((err, values) => {
      if (err) return
      const { personnel: { id: userId } } = values
      this.changeTag({
        payload: { status: '4', cardId, userId },
        success: () => {
          message.success('领卡成功！')
          this.setState({
            employeeModalVisible: false,
            modalVisible: false,
            selectedPersonnerlKeys: [],
          })
          // 重新获取标签卡列表
          this.handleQuery()
        },
        error: () => { message.error('领卡失败！') },
      })
    })
  }

  // 点击退卡
  handleCheckOut = (item) => {
    confirm({
      title: '系统提示',
      content: '您确定要进行退卡操作？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => this.checkOut(item),
    })
  }

  // 点击搜素持卡人
  handleSearchPersonnel = () => {
    const { searchUserName: userName = null, searchPhoneNumber: phoneNumber = null, tagDetail: { companyId } } = this.state
    // 获取单位人员
    this.fetchEmployees({
      payload: { companyId, userName, phoneNumber },
      callback: (list) => {
        if (!list) return
        const currentPersonnelList = list.slice(0, defaultPageSize)
        this.setState({
          currentPersonnelList,
          pagination: {
            pageNum: 1,
            pageSize: defaultPageSize,
            total: list ? list.length : 0,
          },
        })
      },
    })
  }


  render() {

    const {
      loading,
      form: { getFieldDecorator, getFieldValue },
      personnelPosition: {
        tag: {
          // 标签列表
          list,
          isLast,
          // 标签分页数据
          pagination: {
            total: tagTotal = 0,
          },
        },
        systemConfiguration: { list: systemList },
      },
      user: { currentUser: { permissionCodes } },
    } = this.props
    const {
      modalVisible,
      employeeModalVisible,
      currentPersonnelList,
      // 选择人员分页数据
      pagination: {
        pageNum,
        pageSize,
        total,
      },
      selectedPersonnerlKeys,
    } = this.state
    const breadcrumbList = [
      { title: '首页', name: '首页', href: '/' },
      { title: '人员定位', name: '人员定位' },
      { title: '标签管理', name: '标签管理', href: '/personnel-position/tag-management/companies' },
      { title, name: title },
    ]

    // {id,userName}
    const personnel = getFieldValue('personnel')
    // {id,name}
    const company = getFieldValue('company')
    // 新增权限
    const addAuth = hasAuthority(addCode, permissionCodes)
    const deleteAuth = hasAuthority(deleteCode, permissionCodes)
    const editAuth = (cardStatus) => hasAuthority(editCode, permissionCodes) && +cardStatus !== 2
    const rowSelection = {
      selectedRowKeys: selectedPersonnerlKeys,
      onChange: (selectedPersonnerlKeys, selectedRows) => {
        this.setState({ selectedPersonnerlKeys, selectedRows })
      },
      type: 'radio',
    }

    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
        content={(
          <div style={{ overflow: 'hidden' }}>
            <span style={{ lineHeight: '32px' }}>标签数量：{tagTotal}</span>
          </div>
        )}
      >
        {/* 筛选栏 */}
        <Card className={styles.tagFilter}>
          <Form>
            <Row gutter={16}>
              <Col {...colWrapper}>
                <FormItem className={styles.formItem}>
                  {getFieldDecorator('searchCode')(
                    <Input placeholder="请输入标签卡号" />
                  )}
                </FormItem>
              </Col>
              <Col {...colWrapper}>
                <FormItem className={styles.formItem}>
                  {getFieldDecorator('searchCardStatus')(
                    <Select placeholder="标签卡状态">
                      {cardStatusInfo.map((item, i) => (
                        <Option key={i} value={item.value}>{item.label}</Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col {...colWrapper}>
                <FormItem className={styles.formItem}>
                  {getFieldDecorator('searchType')(
                    <Select placeholder="标签卡分类">
                      {typesInfo.map((item, i) => (
                        <Option key={i} value={item.value}>{item.label}</Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col {...colWrapper}>
                <FormItem className={styles.formItem}>
                  <Button type="primary" onClick={() => this.handleQuery(true)}>查询</Button>
                  <Button className={styles.ml10} onClick={this.handleReset}>重置</Button>
                  <Button type="primary" className={styles.ml10} disabled={!addAuth} onClick={this.handleToAdd}>新增</Button>
                  <Button className={styles.ml10} type="primary">模板下载</Button>
                  <Button className={styles.ml10} disabled={!addAuth} type="primary">批量导入</Button>
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Card>
        {/* 标签列表 */}
        <InfiniteScroll
          initialLoad={false}
          pageStart={0}
          loadMore={() => {
            // 防止多次加载
            !loading && this.handleLoadMore();
          }}
          hasMore={!isLast}
          loader={
            <div className="loader" key={0}>
              {loading && (
                <div style={{ paddingTop: '50px', textAlign: 'center' }}>
                  <Spin />
                </div>
              )}
            </div>
          }
        >
          <div className={styles.tagContainer}>
            <List
              rowKey="id"
              dataSource={list}
              grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
              locale={{ emptyText: '暂无数据' }}
              renderItem={(item) => {
                const {
                  id,
                  type, // 分类  0 普通卡  1 临时卡
                  cardStatus = null, // 状态  0 已领用 1 未领用 2 禁用
                  battery = null,    // 电量
                  code,             // 编号
                  userName = null,   // 持卡人
                  status,          // 1 在线 0 离线
                  visitorName = null,  // 临时卡持卡人
                } = item
                return (
                  <List.Item key={id}>
                    <Card
                      actions={[
                        <AuthA code={viewCode} onClick={() => this.handleToDetail(item)}>查看</AuthA>,
                        <span
                          style={{ cursor: editAuth(cardStatus) ? 'pointer' : 'not-allowed' }}
                          onClick={editAuth(cardStatus) ? () => this.handleToEdit(item.id) : null}
                        >编辑</span>,
                      ]}
                    >
                      <div className={styles.cardContent}>
                        <div className={styles.imgConatiner}
                          style={{
                            background: `url(${tagImg})`,
                            backgroundSize: '100% 100%',
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'center center',
                          }}
                        ></div>
                        <div className={styles.detail}>
                          <Ellipsis lines={1} tooltip className={styles.title}>{code}</Ellipsis>
                          <div className={styles.line}>卡分类：{+type === 0 ? '普通卡' : '临时卡'}</div>
                          {+type === 0 ? (
                            <div className={styles.line}>持卡人：{userName || '暂无信息'}</div>
                          ) : (
                              <div className={styles.line}>持卡人：{visitorName || '暂无信息'}</div>
                            )}
                          <div className={styles.line}>
                            电<span style={{ visibility: 'hidden' }}>隐</span>量：
                          <span style={{ color: !battery ? 'inherit' : +battery >= 25 ? 'green' : 'red' }}>{battery ? `${battery}%` : '暂无信息'}</span>
                          </div>
                          <div className={styles.line}>
                            状<span style={{ visibility: 'hidden' }}>隐</span>态：
                          {+status === 1 ? <span style={{ color: 'green' }}>在线</span> : <span style={{ color: 'red' }}>离线</span>}
                          </div>
                        </div>
                        {+type === 0 && ((+cardStatus === 0 && (
                          <div onClick={() => this.handleCheckOut(item)}
                            className={styles.fixedButton} style={{ cursor: 'pointer' }}>
                            <span>退卡</span>
                          </div>
                        )) || (+cardStatus === 1 && (
                          <div onClick={() => this.handleReceiveCard(item)}
                            className={styles.fixedButton} style={{ cursor: 'pointer' }}>
                            <span>领卡</span>
                          </div>
                        )) || (+cardStatus === 2 && (
                          <div className={styles.fixedButton} style={{ cursor: 'not-allowed' }}>
                            <span style={{ color: '#c2c0c0' }}>禁用</span>
                          </div>
                        )))}
                        <div className={styles.enableButton}>
                          <Radio.Group onChange={(e) => this.handleEnableChange(e.target.value, item)} value={+cardStatus === 2 ? 'jinyong' : 'qiyong'} size="small" buttonStyle="solid">
                            <Radio.Button value="qiyong">启用</Radio.Button>
                            <Radio.Button value="jinyong">禁用</Radio.Button>
                          </Radio.Group>
                        </div>
                      </div>
                    </Card>
                  </List.Item>
                )
              }}
            ></List>
          </div>
        </InfiniteScroll>
        {/* 领卡弹窗 */}
        <Modal
          title="领卡"
          width={800}
          visible={modalVisible}
          onCancel={this.handleCloseModal}
          onOk={this.receiveCard}
        >
          <Form>
            <FormItem label="标签号" {...formItemLayout}>
              {getFieldDecorator('code')(
                <Input disabled {...itemStyles} />
              )}
            </FormItem>
            <FormItem label="所属单位" {...formItemLayout}>
              {getFieldDecorator('company', {
                // initialValue: id ? { id: detail.companyId, name: detail.companyName } : undefined,
              })(
                <div style={{ display: 'inline-block', width: '100%' }}>
                  <Input value={company ? company.name : undefined} placeholder="请选择" disabled {...itemStyles} />
                </div>
              )}
            </FormItem>
            <FormItem label="所属系统" {...formItemLayout}>
              {getFieldDecorator('sysId', {
                rules: [{ required: true, message: '请选择所属系统' }],
              })(
                <Select disabled {...itemStyles} notFoundContent="暂无数据" >
                  {systemList.map(({ sysName, id }) => (
                    <Option key={id}>{sysName}</Option>
                  ))}
                </Select>
              )}
            </FormItem>
            <FormItem label="标签分类" {...formItemLayout}>
              {getFieldDecorator('type')(
                <Select disabled placeholder="请选择" {...itemStyles}>
                  {typesInfo.map(({ value, label }, i) => (
                    <Option key={i} value={value}>{label}</Option>
                  ))}
                </Select>
              )}
            </FormItem>
            <FormItem label="持卡人" {...formItemLayout}>
              {getFieldDecorator('personnel', {
                rules: [{ required: true, type: 'object', message: '请选择持卡人' }],
              })(
                <div style={{ display: 'inline-block', width: '100%' }}>
                  <Input value={personnel ? personnel.userName : undefined} disabled {...itemStyles} placeholder="请选择" />
                  <Button type="primary" onClick={this.handleToSelectEmployee}>选择人员</Button>
                </div>
              )}
            </FormItem>
            <FormItem label="联系方式" {...formItemLayout}>
              {getFieldDecorator('phoneNumber')(
                <Input disabled {...itemStyles} />
              )}
            </FormItem>
          </Form>
        </Modal>
        {/* 选择持卡人弹窗 */}
        <Modal
          title="选择持卡人"
          width={820}
          visible={employeeModalVisible}
          onCancel={this.handleCloseEmployeeModal}
          onOk={this.selectPersonnel}
          destroyOnClose
        >
          <div style={{ marginBottom: '24px', width: '100%' }}>
            <Input style={{ width: '300px' }} placeholder="请输入用户名" onChange={e => this.changeState('searchUserName', e.target.value)} />
            <Input style={{ marginLeft: '10px', width: '300px' }} placeholder="请输入手机号" onChange={e => this.changeState('searchPhoneNumber', e.target.value)} />
            <Button style={{ marginLeft: '10px' }} type="primary" onClick={this.handleSearchPersonnel}>查询</Button>
          </div>
          <Table
            rowKey="id"
            style={{ marginTop: '10px' }}
            columns={columns}
            dataSource={currentPersonnelList}
            bordered
            rowSelection={rowSelection}
            pagination={{
              current: pageNum,
              pageSize,
              total,
              showQuickJumper: true,
              showSizeChanger: true,
              onChange: this.handlePageChange,
              onShowSizeChange: (num, size) => {
                this.handlePageChange(1, size);
              },
            }}
          ></Table>
        </Modal>
      </PageHeaderLayout>
    )
  }
}
