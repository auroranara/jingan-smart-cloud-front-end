import React, { PureComponent } from 'react';
import { List, Card, Button, Row, Icon, Form, Input, Select, Col, Divider, Popconfirm, Tag, Spin, message } from 'antd';
import router from 'umi/router';
import { connect } from 'dva';
import { hasAuthority } from '@/utils/customAuth';
import codes from '@/utils/codes';
import styles from './QuestionsList.less';

const Option = Select.Option
const FormItem = Form.Item
const ListItem = List.Item
const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

const {
  training: {
    library: { add: addCode, edit: editCode, delete: deleteCode },
  },
} = codes

// 筛选栏grid配置
const colWrapper = {
  xl: 8, md: 12, sm: 24, xs: 24,
}

const defaultPageSize = 10;

const formWrapper = {
  wrapperCol: {
    span: 22,
  },
}
// 标签颜色
const colors = ['green', 'blue', 'volcano']
// 试题类型选项
const questionsTypes = [
  { value: '1', label: '单选题' },
  { value: '2', label: '多选题' },
  { value: '3', label: '判断题' },
]
// 难易程度选项
const levels = [
  { value: '1', label: '简单' },
  { value: '2', label: '一般' },
  { value: '3', label: '较难' },
]

@Form.create()
@connect(({ resourceManagement, user, loading }) => ({
  resourceManagement,
  user,
  initLoading: loading.effects['resourceManagement/fetchQuestions'],
  moreLoading: loading.effects['resourceManagement/appendQuestions'],
}))
export default class QuestionsList extends PureComponent {

  componentDidMount() {
    const {
      dispatch,
      notCompany,
      companyId,
      knowledgeId,
      resourceManagement: { searchInfo },
    } = this.props
    // 如果没有传入companyId，则使用保存在redux中的
    const id = companyId || searchInfo.id
    // 获取试题列表
    dispatch({
      type: 'resourceManagement/fetchQuestions',
      payload: {
        pageNum: 1,
        pageSize: defaultPageSize,
        companyId: notCompany ? id : null,
        knowledgeId,
      },
    })
  }

  // 点击新增
  handleAddQuestions = () => {
    const { knowledgeId, companyId } = this.props
    router.push({
      pathname: '/training/library/questions/add',
      query: { knowledgeId, companyId },
    })
  }

  // 点击查询按钮
  handleQuery = () => {
    const {
      dispatch,
      knowledgeId,
      notCompany,
      companyId,
      form: { getFieldsValue },
      resourceManagement: {
        questions: {
          pagination: { pageSize },
        },
      },
    } = this.props
    const values = getFieldsValue()
    dispatch({
      type: 'resourceManagement/fetchQuestions',
      payload: {
        pageNum: 1,
        pageSize,
        knowledgeId,
        companyId: notCompany ? companyId : null,
        ...values,
      },
    })
  }

  // 加载更多试题
  handleLoadMore = () => {
    const {
      dispatch,
      knowledgeId,
      notCompany,
      companyId,
      form: { getFieldsValue },
      resourceManagement: {
        questions: {
          pagination: { pageSize, pageNum },
        },
      },
    } = this.props
    const values = getFieldsValue()
    dispatch({
      type: 'resourceManagement/appendQuestions',
      payload: {
        pageNum: pageNum + 1,
        pageSize,
        knowledgeId,
        companyId: notCompany ? companyId : null,
        ...values,
      },
    })
  }

  // 删除试题
  handleDeleteQuestion = (id, delDisabled) => {
    if (delDisabled) {
      message.error('您没有权限')
      return
    }
    const {
      dispatch,
    } = this.props
    dispatch({
      type: 'resourceManagement/deleteQuestion',
      payload: { id },
      success: () => {
        message.success('删除成功')
        this.handleQuery()
      },
      error: () => {
        message.error('删除失败')
      },
    })
  }

  // 点击重置按钮
  handleReset = () => {
    const {
      dispatch,
      notCompany,
      companyId,
      knowledgeId,
      form: { resetFields },
    } = this.props
    // 清空筛选数据
    resetFields()
    dispatch({
      type: 'resourceManagement/fetchQuestions',
      payload: {
        pageNum: 1,
        pageSize: defaultPageSize,
        knowledgeId,
        companyId: notCompany ? companyId : null,
      },
    })
  }

  // 渲染试题单元
  renderQuestionItem = ({ label, content, isLast = false }) => {
    return (
      <div className={styles.questionsItem}>
        <div className={styles.label} style={{ fontWeight: 600 }}><span>{label}</span></div>
        <div className={styles.content}><span>{content}</span></div>
      </div>
    )
  }

  handleToEdit = (id) => {
    const { companyId } = this.props
    router.push({
      pathname: `/training/library/questions/edit/${id}`,
      query: { companyId },
    })
  }

  // 渲染筛选
  renderFilter = () => {
    const {
      companyId,
      notCompany,
      form: { getFieldDecorator },
      user: { currentUser: { permissionCodes } },
    } = this.props

    return (
      <Form>
        <Col {...colWrapper}>
          <FormItem label="" {...formWrapper}>
            {getFieldDecorator('stem')(
              <Input placeholder="请输入试题题干" />
            )}
          </FormItem>
        </Col>
        <Col {...colWrapper}>
          <FormItem {...formWrapper}>
            {getFieldDecorator('type')(
              <Select placeholder="试题类型">
                {questionsTypes.map(({ value, label }) => (
                  <Option key={value} value={value}>{label}</Option>
                ))}
              </Select>
            )}
          </FormItem>
        </Col>
        {/*  <Col {...colWrapper}>
          <FormItem {...formWrapper}>
            {getFieldDecorator('sort')(
              <Select placeholder="试题分类">
                {[{ value: 'normal', label: '普通题' }].map(({ value, label }) => (
                  <Option key={value} value={value}>{label}</Option>
                ))}
              </Select>
            )}
          </FormItem>
        </Col> */}
        <Col {...colWrapper}>
          <FormItem {...formWrapper}>
            {getFieldDecorator('level')(
              <Select placeholder="难易程度">
                {levels.map(({ value, label }) => (
                  <Option key={value} value={value}>{label}</Option>
                ))}
              </Select>
            )}
          </FormItem>
        </Col>
        <Col {...colWrapper}>
          <FormItem>
            <Button style={{ marginRight: '10px' }} type="primary" onClick={this.handleQuery}>查询</Button>
            <Button style={{ marginRight: '10px' }} onClick={this.handleReset}>重置</Button>
            <Button disabled={!hasAuthority(addCode, permissionCodes)} onClick={this.handleAddQuestions} type="primary">新增</Button>
          </FormItem>
        </Col>
      </Form>
    )
  }

  render() {
    const {
      initLoading,
      moreLoading,
      resourceManagement: {
        questions: {
          list,
          isLast,
        },
      },
      user: { currentUser: { permissionCodes } },
    } = this.props
    const editDisabled = !hasAuthority(editCode, permissionCodes)
    const delDisabled = !hasAuthority(deleteCode, permissionCodes)
    return (
      <div className={styles.questionsList}>
        <Row>
          {this.renderFilter()}
        </Row>
        <List
          loading={initLoading}
          loadMore={!isLast && !initLoading && (
            <div style={{ textAlign: 'center', marginTop: 12, height: 32, lineHeight: '32px' }}>
              {!moreLoading ? (<Button onClick={this.handleLoadMore}>加载更多</Button>) : (
                (<Spin spinning={moreLoading} />)
              )}
            </div>
          )}
          grid={{ gutter: 16, column: 1 }}
          dataSource={list}
          renderItem={item => {
            return (
              <ListItem key={item.id}>
                <Card
                  className={styles.cardContainer}
                >
                  <div className={styles.firstLine}>
                    <div className={styles.tags}>
                      {item.knowledges && (<Tag>{item.knowledges.join(' > ')}</Tag>)}
                      {item.typeName && <Tag>{item.typeName}</Tag>}
                      {item.levelName && <Tag color={colors[item.level - 1]}>{item.levelName}</Tag>}
                    </div>
                    <div className={styles.rightIcon}>
                      <Icon className={editDisabled ? styles.disabledIcon : styles.icon} type="edit" onClick={!editDisabled ? () => this.handleToEdit(item.id) : null} />
                      <Divider type="vertical" />
                      {delDisabled ? (
                        <Icon className={styles.disabledIcon} type="close" />
                      ) : (
                          <Popconfirm title="确认删除该试题吗？" onConfirm={() => this.handleDeleteQuestion(item.id, delDisabled)}>
                            <Icon className={styles.icon} type="close" />
                          </Popconfirm>)}
                    </div>
                  </div>
                  {this.renderQuestionItem({ label: '试题题干：', content: item.stem })}
                  {item.arrOptions.map((row, i) => (
                    <div key={i} className={styles.questionsItem}>
                      <div className={styles.label} style={{ marginLeft: '4em' }}><span>选项{letters[i]}：</span></div>
                      <div className={styles.content}><span>{row.desc}</span></div>
                    </div>
                  ))}
                  {this.renderQuestionItem({ label: '正确答案：', content: item.arrAnswer.map((item, i) => letters[item]).join('、') })}
                  {this.renderQuestionItem({ label: '试题解析：', content: item.des, isLast: true })}
                </Card>
              </ListItem>
            )
          }}
        >
        </List>
      </div>
    )
  }
}
