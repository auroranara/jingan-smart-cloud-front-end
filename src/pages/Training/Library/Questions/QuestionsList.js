import React, { PureComponent } from 'react';
import { List, Card, Button, Row, Icon, Form, Input, Select, Col, Divider, Popconfirm, Tag } from 'antd';
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

const questionsTypes = [
  { value: '1', label: '单选题' },
  { value: '2', label: '多选题' },
  { value: '3', label: '判断题' },
]
const levels = [
  { value: '1', label: '简单' },
  { value: '2', label: '一般' },
  { value: '3', label: '较难' },
]

@Form.create()
@connect(({ resourceManagement, loading }) => ({
  resourceManagement,
  // treeLoading: loading.effects['resourceManagement/fetchKnowledgeTree'],
}))
export default class QuestionsList extends PureComponent {

  componentDidMount() {
    const { dispatch } = this.props
    // 获取试题列表
    dispatch({
      type: 'resourceManagement/fetchQuestions',
      payload: {
        pageNum: 1,
        pageSize: 10,
      },
    })
  }

  // 点击新增
  handleAddQuestions = () => {
    router.push('/training/library/questions/add')
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
            <Button style={{ marginRight: '10px' }} type="primary">查询</Button>
            <Button style={{ marginRight: '10px' }}>重置</Button>
            <Button onClick={this.handleAddQuestions} type="primary">新增</Button>
          </FormItem>
        </Col>
      </Form>
    )
  }

  render() {
    const {
      resourceManagement: {
        questions: {
          list,
        },
      },
    } = this.props
    return (
      <div className={styles.questionsList}>
        <Row>
          {this.renderFilter()}
        </Row>
        <List
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
                      {/* {item.sort && <Tag>{item.sort}</Tag>} */}
                      {item.levelName && <Tag color={"green"}>{item.levelName}</Tag>}
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
