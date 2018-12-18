import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { List, Card, Row, Button, Icon, Divider, Popconfirm, Form, Col, Input, Tag, Drawer, Select, DatePicker, Spin, message, Tooltip } from 'antd';
import router from 'umi/router';
import { hasAuthority } from '@/utils/customAuth';
import codes from '@/utils/codes';
import styles from './ArticleList.less';

const ListItem = List.Item
const FormItem = Form.Item
const Option = Select.Option
const { RangePicker } = DatePicker;

const {
  training: {
    library: { add: addCode, edit: editCode, delete: deleteCode },
  },
} = codes

const statusInfo = [
  { value: '1', label: '发布' },
  { value: '0', label: '未发布' },
]

// 默认每页显示数量
const defaultPageSize = 10;

// 筛选栏grid配置
const colWrapper = {
  xl: 8,
  md: 12,
  sm: 24,
  xs: 24,
};

@Form.create()
@connect(({ resourceManagement, user, loading }) => ({
  resourceManagement,
  user,
  initLoading: loading.effects['resourceManagement/fetchArticles'],
  moreLoading: loading.effects['resourceManagement/appendArticles'],
}))
export default class ArticleList extends PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      drawerVisible: false, // 控制预览抽屉的显示
      detail: {}, // 文章详情
    }
  }

  componentDidMount() {
    const {
      notCompany,
      companyId,
      knowledgeId,
    } = this.props
    // 获取文章列表
    this.fetchArticles({
      payload: {
        pageNum: 1,
        pageSize: defaultPageSize,
        type: '1', // type 1文章
        companyId: notCompany ? companyId : null,
        knowledgeId,
      },
    })
  }

  // 获取文章
  fetchArticles = (action) => {
    const { dispatch } = this.props
    dispatch({
      type: 'resourceManagement/fetchArticles',
      ...action,
    })
  }

  // 点击新增文章
  handleAddArticle = () => {
    const { knowledgeId } = this.props
    router.push({
      pathname: '/training/library/article/add',
      query: { knowledgeId },
    })
  }

  // 关闭预览抽屉
  onDrawerClose = () => {
    this.setState({
      drawerVisible: false,
      detail: {},
    })
  }

  // 打开预览抽屉
  handleOpenDrawer = (item) => {
    const { id, content } = item
    const { dispatch } = this.props
    dispatch({
      type: 'resourceManagement/addReadRecord',
      payload: {
        trainingId: id,
      },
    })
    this.setState({
      drawerVisible: true,
      detail: item,
    }, () => {
      // 指定预览文章的内容
      this.refs.articleView.innerHTML = content
    })
  }

  // 删除文章
  handleDelete = (id, delDisabled) => {
    if (delDisabled) {
      message.error('您没有权限')
      return
    }
    const { dispatch } = this.props
    dispatch({
      type: 'resourceManagement/deleteArticleOrCourseWare',
      payload: { id },
      success: () => {
        message.success('删除成功')
        this.handleQuery()
      },
      error: () => { message.error('删除失败') },
    })
  }

  // 点击改变发布状态
  handleChangeStatus = (id, oldStatus, auth) => {
    const { dispatch } = this.props
    if (!auth) {
      message.error('您没有权限')
    }
    dispatch({
      type: 'resourceManagement/changePublishStatus',
      payload: {
        id,
        status: oldStatus === '1' ? '0' : '1',
        type: '1',
      },
      success: () => { message.success(`${oldStatus === '1' ? '取消发布' : '发布'}文章成功`) },
      error: () => { message.error(`${oldStatus === '1' ? '取消发布' : '发布'}文章失败`) },
    })
  }

  // 点击查询
  handleQuery = () => {
    const {
      notCompany,
      companyId,
      knowledgeId,
      form: { getFieldsValue },
    } = this.props
    const { timeRange: [start, end] = [], ...others } = getFieldsValue()
    const query = {
      ...others,
      startTime: start && moment(start).format('YYYY-MM-DD HH:mm:ss.SSS'),
      endTime: end && moment(end).format('YYYY-MM-DD HH:mm:ss.SSS'),
    }
    this.fetchArticles({
      payload: {
        pageNum: 1,
        pageSize: defaultPageSize,
        type: '1', // type 1文章
        ...query,
        companyId: notCompany ? companyId : null,
        knowledgeId,
      },
    })
  }

  // 点击重置查询
  handleResetQuery = () => {
    const {
      notCompany,
      companyId,
      form: { resetFields },
    } = this.props
    resetFields()
    // 获取文章列表
    this.fetchArticles({
      payload: {
        pageNum: 1,
        pageSize: defaultPageSize,
        type: '1', // type 1文章
        companyId: notCompany ? companyId : null,
      },
    })
  }

  // 点击跳转到编辑页面
  handleToEdit = (id) => {
    router.push(`/training/library/article/edit/${id}`)
  }

  // 点击加载更多
  handleLoadMore = () => {
    const {
      dispatch,
      notCompany,
      companyId,
      form: { getFieldsValue },
      resourceManagement: {
        article: {
          pagination: {
            pageNum,
          },
        },
      },
    } = this.props
    const { timeRange: [start, end] = [], ...others } = getFieldsValue()
    const query = {
      ...others,
      startTime: start && moment(start).format('YYYY-MM-DD HH:mm:ss.SSS'),
      endTime: end && moment(end).format('YYYY-MM-DD HH:mm:ss.SSS'),
    }
    // 获取更多文章
    dispatch({
      type: 'resourceManagement/appendArticles',
      payload: {
        pageNum: pageNum + 1,
        pageSize: defaultPageSize,
        type: '1', // type 1文章
        ...query,
        companyId: notCompany ? companyId : null,
      },
    })
  }

  // 渲染搜索栏
  renderFilter = () => {
    const {
      notCompany,
      companyId,
      form: { getFieldDecorator },
      user: { currentUser: { permissionCodes } },
    } = this.props
    return (
      <Row gutter={8}>
        <Form>
          <Col {...colWrapper}>
            <FormItem>
              {getFieldDecorator('name')(
                <Input placeholder="请输入文章标题" />
              )}
            </FormItem>
          </Col>
          <Col {...colWrapper}>
            <FormItem>
              {getFieldDecorator('status')(
                <Select placeholder="请选择发布状态">
                  {statusInfo.map(({ value, label }) => (
                    <Option key={value} value={value}>{label}</Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col {...colWrapper}>
            <FormItem>
              {getFieldDecorator('timeRange')(
                <RangePicker
                  showTime={{
                    hideDisabledOptions: true,
                    defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')],
                  }}
                  format="YYYY-MM-DD HH:mm:ss"
                  style={{ width: '100%' }}
                />
              )}
            </FormItem>
          </Col>
        </Form>
        <Col {...colWrapper}>
          <FormItem>
            <Button style={{ marginRight: '10px' }} type="primary" onClick={this.handleQuery}>查询</Button>
            <Button style={{ marginRight: '10px' }} onClick={this.handleResetQuery}>重置</Button>
            <Button disabled={!hasAuthority(addCode, permissionCodes)} type="primary" onClick={this.handleAddArticle}>新增</Button>
          </FormItem>
        </Col>
      </Row>
    )
  }

  render() {
    const {
      initLoading,
      moreLoading,
      notCompany,
      resourceManagement: {
        article: {
          list,
          isLast,
        },
      },
      user: { currentUser: { permissionCodes } },
    } = this.props
    const { drawerVisible, detail } = this.state
    // 是否编辑和删除 没有权限或不是企业用户或已发布 不能操作
    const editDisabled = (status) => !hasAuthority(editCode, permissionCodes) || status === '1'
    const delDisabled = (status) => !hasAuthority(deleteCode, permissionCodes) || status === '1'
    // 改变发布状态的权限
    const statusAuth = hasAuthority(editCode, permissionCodes)
    return (
      <div className={styles.articleList}>
        {this.renderFilter()}
        <List
          grid={{ gutter: 16, column: 1 }}
          dataSource={list}
          loading={initLoading}
          loadMore={!isLast && !initLoading && (
            <div style={{ textAlign: 'center', marginTop: 12, height: 32, lineHeight: '32px' }}>
              {!moreLoading ? (<Button onClick={this.handleLoadMore}>加载更多</Button>) : (
                (<Spin spinning={moreLoading} />)
              )}
            </div>
          )}
          renderItem={item => (
            <ListItem>
              <Card className={styles.cardContainer}>
                <div className={styles.firstLine}>
                  <div className={styles.title}>{item.name}</div>
                  <div className={styles.rightIcon}>
                    <Icon className={editDisabled(item.status) ? styles.disabledIcon : styles.icon} type="edit" onClick={!editDisabled(item.status) ? () => { this.handleToEdit(item.id) } : null} />
                    <Divider type="vertical" />
                    <Icon className={styles.icon} type="eye" onClick={() => { this.handleOpenDrawer(item) }} />
                    <Divider type="vertical" />
                    {delDisabled(item.status) ? (
                      <Icon className={styles.disabledIcon} type="close" />
                    ) : (
                        <Popconfirm title="确认删除该文章吗？" onConfirm={() => { this.handleDelete(item.id, delDisabled(item.status)) }}>
                          <Icon className={styles.icon} type="close" />
                        </Popconfirm>
                      )}
                  </div>
                </div>
                {item.knowledgeName && <Tag className={styles.tags}>{item.knowledgeName}</Tag>}
                {statusAuth ? (
                  <Popconfirm title={`确认要${item.status === '1' ? '取消发布' : '发布'}文章吗？`} onConfirm={() => { this.handleChangeStatus(item.id, item.status, statusAuth) }}>
                    <Tag className={styles.tags} color={item.status === '1' ? 'blue' : 'grey'}>{item.status === '1' ? '已发布' : '未发布'}</Tag>
                  </Popconfirm>
                ) : (
                    <Tag className={styles.disabledTags} color={item.status === '1' ? 'blue' : 'grey'}>{item.status === '1' ? '已发布' : '未发布'}</Tag>
                  )}
                <div className={styles.introduction}>
                  {item.createName && (<span>{item.createName}</span>)}
                  <span className={styles.grey}>{' 创建于 '}</span>
                  <span>{item.createTime ? item.createTime.split(':').slice(0, -1).join(':') : '暂无数据'}</span>
                </div>
                <div className={styles.statistics}>
                  <Tooltip title="阅读次数"><span><Icon className={styles.icon} type="eye" />{item.totalRead}</span></Tooltip>
                  <Divider type="vertical" />
                  <Tooltip title="阅读人数"><span><Icon className={styles.icon} type="user" />{item.totalPerson}</span></Tooltip>
                </div>
              </Card>
            </ListItem>
          )}
        >
        </List>
        <Drawer
          title="文章预览"
          placement="right"
          closable={false}
          onClose={this.onDrawerClose}
          visible={drawerVisible}
          destroyOnClose
          width={900}
        >
          <div className={styles.articleViewTitle}>
            <div className={styles.titleContainer}>
              <span>{detail.name}</span>
            </div>
            <div className={styles.statistics}>
              <span>创建于 {detail.createTime ? detail.createTime.split(':').slice(0, -1).join(':') : null}</span>
              <Divider type="vertical" />
              <span>阅读次数：{detail.totalRead}</span>
              <Divider type="vertical" />
              <span>阅读人数：{detail.totalPerson}</span>
            </div>
          </div>
          <div ref="articleView"></div>
        </Drawer>
      </div>
    );
  }
}
