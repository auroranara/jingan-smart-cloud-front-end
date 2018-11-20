import React, { PureComponent } from 'react';
import { List, Card, Button, Row, Icon, Form, Input, Select, Col, Divider, Popconfirm, Tag, Spin } from 'antd';
import router from 'umi/router';
import { connect } from 'dva';
import styles from './QuestionsList.less';

const Option = Select.Option
const FormItem = Form.Item
const ListItem = List.Item
const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

// 筛选栏grid配置
const colWrapper = {
  xl: 8, md: 12, sm: 24, xs: 24,
}

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
  loading: loading.effects['resourceManagement/appendQuestions'],
}))
export default class QuestionsList extends PureComponent {

  componentDidMount() {
    const {
      dispatch,
      unitType,
      companyId,
    } = this.props
    // 获取试题列表
    dispatch({
      type: 'resourceManagement/fetchQuestions',
      payload: {
        pageNum: 1,
        pageSize: 5,
        companyId: unitType === 2 ? companyId : null,
      },
    })
  }

  // 点击新增
  handleAddQuestions = () => {
    router.push('/training/library/questions/add')
  }

  // 点击查询按钮
  handleQuery = () => {
    const {
      dispatch,
      knowledgeId,
      unitType,
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
        companyId: unitType === 2 ? companyId : null,
        ...values,
      },
    })
  }

  // 加载更多试题
  handleLoadMore = () => {
    const {
      dispatch,
      knowledgeId,
      unitType,
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
        companyId: unitType === 2 ? companyId : null,
        ...values,
      },
    })
  }

  // 点击重置按钮
  handleReset = () => {
    const {
      dispatch,
      unitType,
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
        pageSize: 5,
        knowledgeId,
        companyId: unitType === 2 ? companyId : null,
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

  // 渲染筛选
  renderFilter = () => {
    const {
      form: { getFieldDecorator },
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
            <Button onClick={this.handleAddQuestions} type="primary">新增</Button>
          </FormItem>
        </Col>
      </Form>
    )
  }

  render() {
    const {
      initLoading,
      loading,
      resourceManagement: {
        questions: {
          list,
          isLast,
        },
      },
    } = this.props
    return (
      <div className={styles.questionsList}>
        <Row>
          {this.renderFilter()}
        </Row>
        <List
          loading={initLoading}
          loadMore={(
            <div style={{ textAlign: 'center', marginTop: 12, height: 32, lineHeight: '32px' }}>
              {!isLast && !initLoading && !loading ? (<Button onClick={this.handleLoadMore}>加载更多</Button>) : (
                (list && list.length > 0 && loading && <Spin spinning={loading} />)
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
                      {item.typeName && <Tag>{item.typeName}</Tag>}
                      {item.levelName && <Tag color={colors[item.level - 1]}>{item.levelName}</Tag>}
                    </div>
                    <div className={styles.rightIcon}>
                      <Icon className={styles.icon} type="edit" onClick={() => { router.push(`/training/library/questions/edit/${item.id}`) }} />
                      <Divider type="vertical" />
                      <Popconfirm title="确认删除该试题吗？" onConfirm={() => { console.log('delete') }}>
                        <Icon className={styles.icon} type="close" />
                      </Popconfirm>
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
