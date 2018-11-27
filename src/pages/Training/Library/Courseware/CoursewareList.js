import React, { PureComponent } from 'react';
import { Tag, List, Button, Row, Col, Card, Form, Input, Select, DatePicker, Divider, Popconfirm, Icon, Spin, Drawer, message, Tooltip } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import router from 'umi/router';
import Resource from '@/components/Resource';
import { hasAuthority } from '@/utils/customAuth';
import codes from '@/utils/codes';
import styles from './CoursewareList.less'

const FormItem = Form.Item;
const Option = Select.Option;
const ListItem = List.Item;
const { RangePicker } = DatePicker;

const {
  training: {
    library: { add: addCode, edit: editCode, delete: deleteCode },
  },
} = codes

const defaultPageSize = 10;

// 筛选栏grid配置
const colWrapper = {
  xl: 12, md: 12, sm: 24, xs: 24,
}
const statusList = [
  { value: '1', label: '发布' },
  { value: '0', label: '未发布' },
]

@Form.create()
@connect(({ resourceManagement, user, loading }) => ({
  resourceManagement,
  user,
  initLoading: loading.effects['resourceManagement/fetchCourseWare'],
  moreLoading: loading.effects['resourceManagement/appendCourseWare'],
}))
export default class CoursewareList extends PureComponent {

  state = {
    drawerVisible: false, // 控制预览抽屉显示
    detail: {}, // 课件预览详情
    fileSrc: null, // 预览文件的url
    fileType: null, // 预览文件类型
    coverSrc: null, // 预览文件封面url
  }

  componentDidMount() {
    const {
      dispatch,
      notCompany,
      companyId,
      knowledgeId,
    } = this.props
    dispatch({
      type: 'resourceManagement/fetchCourseWare',
      payload: {
        pageNum: 1,
        pageSize: defaultPageSize,
        type: '2', // type '1'文章 '2' 课件
        companyId: notCompany ? companyId : null,
        knowledgeId,
      },
    })
  }

  // 点击新增
  handleToAdd = () => {
    const { knowledgeId } = this.props
    router.push({
      pathname: '/training/library/courseware/add',
      query: { knowledgeId },
    })
  }

  // 跳转到编辑页面
  handleToEdit = (id) => {
    router.push(`/training/library/courseware/edit/${id}`)
  }

  // 点击加载更多
  handleLoadMore = () => {
    const {
      dispatch,
      notCompany,
      companyId,
      form: { getFieldsValue },
      resourceManagement: {
        courseWare: {
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
      type: 'resourceManagement/appendCourseWare',
      payload: {
        pageNum: pageNum + 1,
        pageSize: defaultPageSize,
        type: '2', // type 1文章
        ...query,
        companyId: notCompany ? companyId : null,
      },
    })
  }

  // 点击查询
  handleQuery = () => {
    const {
      dispatch,
      form: { getFieldsValue },
      notCompany,
      companyId,
    } = this.props
    const { timeRange: [start, end] = [], ...others } = getFieldsValue()
    const query = {
      ...others,
      startTime: start && moment(start).format('YYYY-MM-DD HH:mm:ss.SSS'),
      endTime: end && moment(end).format('YYYY-MM-DD HH:mm:ss.SSS'),
    }
    dispatch({
      type: 'resourceManagement/fetchCourseWare',
      payload: {
        pageNum: 1,
        pageSize: defaultPageSize,
        type: '2', // type 1文章
        ...query,
        companyId: notCompany ? companyId : null,
      },
    })
  }

  // 点击重置
  handleResetQuery = () => {
    const {
      dispatch,
      notCompany,
      companyId,
      form: { resetFields },
    } = this.props
    resetFields()
    dispatch({
      type: 'resourceManagement/fetchCourseWare',
      payload: {
        pageNum: 1,
        pageSize: defaultPageSize,
        type: '2', // type 1文章
        companyId: notCompany ? companyId : null,
      },
    })
  }

  // 点击改变课件发布状态
  handleChangeStatus = (id, oldStatus, type, auth) => {
    const { dispatch } = this.props
    if (!auth) {
      message.error('您没有权限')
    }
    dispatch({
      type: 'resourceManagement/changePublishStatus',
      payload: {
        id,
        status: oldStatus === '1' ? '0' : '1',
        type,
      },
      success: () => { message.success(`${oldStatus === '1' ? '取消发布' : '发布'}课件成功`) },
      error: () => { message.error(`${oldStatus === '1' ? '取消发布' : '发布'}课件失败`) },
    })
  }

  // 删除课件
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

  // 预览课件
  handleViewCourseWare = (item) => {
    const { id, webFileUrl, fileUrl, webVideoCover } = item
    const { dispatch } = this.props
    dispatch({
      type: 'resourceManagement/addReadRecord',
      payload: {
        trainingId: id,
      },
    })
    this.setState({
      fileSrc: webFileUrl[0],
      fileType: fileUrl.split('.').pop(),
      drawerVisible: true,
      detail: item,
      coverSrc: webVideoCover && webVideoCover.length > 0 ? webVideoCover[0] : null,
    })
  }

  onDrawerClose = () => {
    this.setState({
      drawerVisible: false,
      detail: {},
    })
  }

  // 渲染搜索栏
  renderFilter = () => {
    const {
      notCompany,
      form: { getFieldDecorator },
      user: { currentUser: { permissionCodes } },
    } = this.props
    return (
      <Row gutter={8}>
        <Form>
          <Col {...colWrapper}>
            <FormItem>
              {getFieldDecorator('name')(
                <Input placeholder="请输入课件名称" />
              )}
            </FormItem>
          </Col>
          <Col {...colWrapper}>
            <FormItem>
              {getFieldDecorator('status')(
                <Select placeholder="请选择发布状态">
                  {statusList.map(({ value, label }) => (
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
          <Col {...colWrapper}>
            <FormItem>
              <Button className={styles.mr10} type="primary" onClick={this.handleQuery}>查询</Button>
              <Button className={styles.mr10} onClick={this.handleResetQuery}>重置</Button>
              <Button disabled={!hasAuthority(addCode, permissionCodes) || notCompany} onClick={this.handleToAdd} type="primary">新增</Button>
            </FormItem>
          </Col>
        </Form>
      </Row>
    )
  }

  render() {
    const {
      initLoading,
      moreLoading,
      notCompany,
      resourceManagement: {
        courseWare: {
          list,
          isLast,
        },
      },
      user: { currentUser: { permissionCodes } },
    } = this.props
    const { drawerVisible, fileSrc, fileType, detail, coverSrc } = this.state
    // 是否编辑和删除 没有权限或不是企业用户或已发布 不能操作
    const editDisabled = (status) => !hasAuthority(editCode, permissionCodes) || notCompany || status === '1'
    const delDisabled = (status) => !hasAuthority(deleteCode, permissionCodes) || notCompany || status === '1'
    // 改变课件发布状态权限
    const statusAuth = hasAuthority(editCode, permissionCodes) || notCompany

    return (
      <div className={styles.coursewareList}>
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
                  <div className={styles.rightIcons}>
                    <Icon className={editDisabled(item.status) ? styles.disabledIcon : styles.icon} type="edit" onClick={!editDisabled(item.status) ? () => this.handleToEdit(item.id) : null} />
                    <Divider type="vertical" />
                    <Icon className={styles.icon} type="eye" onClick={() => this.handleViewCourseWare(item)} />
                    <Divider type="vertical" />
                    <Popconfirm title="确认删除该课件吗？" onConfirm={() => { this.handleDelete(item.id, delDisabled((item.status))) }}>
                      <Icon className={delDisabled((item.status)) ? styles.disabledIcon : styles.icon} type="close" />
                    </Popconfirm>
                  </div>
                </div>
                <div className={styles.tags}>
                  <Tag>{item.type === '2' ? '视频' : '文档'}</Tag>
                  <Popconfirm title={`确认要${item.status === '1' ? '取消发布' : '发布'}课件吗？`} onConfirm={() => { this.handleChangeStatus(item.id, item.status, item.type, statusAuth) }}>
                    <Tag className={statusAuth ? styles.tag : styles.disabledTag} color={item.status === '1' ? 'blue' : 'grey'}>{item.status === '1' ? '已发布' : '未发布'}</Tag>
                  </Popconfirm>
                </div>
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
        ></List>
        <Drawer
          title="课件预览"
          placement="right"
          closable={false}
          onClose={this.onDrawerClose}
          visible={drawerVisible}
          destroyOnClose
          width={900}>
          <div className={styles.courseViewContainer}>
            <div className={styles.titleContainer}>
              <span>{detail.name}</span>
            </div>
            <div className={styles.statistics}>
              <span>创建于 {detail.createTime}</span>
              <Divider type="vertical" />
              <span>阅读次数：{detail.totalRead}</span>
              <Divider type="vertical" />
              <span>阅读人数：{detail.totalPerson}</span>
            </div>
            {fileSrc && (<Resource src={fileSrc} poster={coverSrc} extension={fileType} styles={{ width: '100%', height: 800 }} />)}
            {detail.content && (
              <div className={styles.detail}>
                <span>详细内容：</span>
                <p className={styles.content}>&nbsp;&nbsp;{detail.content}</p>
              </div>
            )}
          </div>
        </Drawer>
      </div>
    )
  }
}
