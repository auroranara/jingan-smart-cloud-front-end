import React, { PureComponent } from 'react';
import { List, Card, Button, Row, Icon, Form, Input, Select, Col, Divider, Popconfirm, Tag } from 'antd';
import router from 'umi/router';
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
  { value: 'single', label: '单选题' },
  { value: 'multiple', label: '多选题' },
  { value: 'judge', label: '判断题' },
]
const degrees = [
  { value: 'easy', label: '简单' },
  { value: 'normal', label: '一般' },
  { value: 'harder', label: '较难' },
]
const data = [
  { id: '001', question: '为什么月亮是圆的？', answer: '阿萨大大', analysis: '就是圆的', options: ['正确', '错误'], type: '单选题', sort: '普通题', degree: '简单' },
  { id: '002', question: 'a+b=？', answer: '222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222', analysis: 'asdasdsaddddddddddddd', options: ['圆的', '三角', '正方形'], type: '单选题', sort: '普通题', degree: '简单' },
  { id: '003', question: '题目3', answer: 'werfe', analysis: '解析这道题', options: ['正确', '错误'], type: '单选题', sort: '普通题', degree: '简单' },
]

@Form.create()
export default class QuestionsList extends PureComponent {

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
            {getFieldDecorator('title')(
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
        <Col {...colWrapper}>
          <FormItem {...formWrapper}>
            {getFieldDecorator('sort')(
              <Select placeholder="试题分类">
                {[{ value: 'normal', label: '普通题' }].map(({ value, label }) => (
                  <Option key={value} value={value}>{label}</Option>
                ))}
              </Select>
            )}
          </FormItem>
        </Col>
        <Col {...colWrapper}>
          <FormItem {...formWrapper}>
            {getFieldDecorator('degree')(
              <Select placeholder="难易程度">
                {degrees.map(({ value, label }) => (
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
    return (
      <div className={styles.questionsList}>
        <Row>
          {this.renderFilter()}
        </Row>
        <List
          grid={{ gutter: 16, column: 1 }}
          dataSource={data}
          renderItem={item => {
            return (
              <ListItem key={item.id}>
                <Card
                  className={styles.cardContainer}
                >
                  <div className={styles.firstLine}>
                    <div className={styles.tags}>
                      {item.type && <Tag>{item.type}</Tag>}
                      {item.sort && <Tag>{item.sort}</Tag>}
                      {item.degree && <Tag color={"green"}>{item.degree}</Tag>}
                    </div>
                    <div className={styles.rightIcon}>
                      <Icon className={styles.icon} type="edit" onClick={() => { router.push(`/training/library/questions/edit/${item.id}`) }} />
                      <Divider type="vertical" />
                      <Popconfirm title="确认删除该试题吗？" onConfirm={() => { console.log('delete') }}>
                        <Icon className={styles.icon} type="close" />
                      </Popconfirm>
                    </div>
                  </div>
                  {this.renderQuestionItem({ label: '试题题干：', content: item.question })}
                  {item.options.map((row, i) => (
                    <div key={i} className={styles.questionsItem}>
                      <div className={styles.label} style={{ marginLeft: '4em' }}><span>选项{letters[i]}：</span></div>
                      <div className={styles.content}><span>{row}</span></div>
                    </div>
                  ))}
                  {this.renderQuestionItem({ label: '正确答案：', content: item.answer })}
                  {this.renderQuestionItem({ label: '试题解析：', content: item.analysis, isLast: true })}
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
