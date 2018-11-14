import React, { PureComponent } from 'react';
import { Button, Card, Form, Row, Col, Input, Select, Icon, Radio, Checkbox } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import styles from './QuestionsAdd.less';

const RadioGroup = Radio.Group;
const TextArea = Input.TextArea
const Option = Select.Option
const CheckboxGroup = Checkbox.Group;
// 试题类型
const questionsTypes = [
  { value: 'single', label: '单选题' },
  { value: 'multiple', label: '多选题' },
  { value: 'judge', label: '判断题' },
]

const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const formItemLayout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 21 },
};

@Form.create()
export default class QuestionsAdd extends PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      optionsHelp: '',
    }
  }

  // 点击选择试题类型
  handleSelectType = async (value) => {
    const {
      form: { setFieldsValue },
    } = this.props
    if (value === 'judge') {
      // 如果是判断题(必须先getFieldDecorator绑定再使用setFieldsValue)
      await setFieldsValue({
        keys: [0, 1],
      })
      setFieldsValue({
        answer: null,
        options: ['正确', '错误'],
      })
      return
    }
    setFieldsValue({
      answer: null,
    })
  }

  // 点击添加子选项
  handleAddOption = () => {
    const {
      form: { getFieldValue, setFieldsValue, validateFields },
    } = this.props
    const keys = getFieldValue('keys')
    // 校验试题类型是否选择
    validateFields(['type'], (errors, value) => {
      if (!errors) {
        if (keys.length >= 26) {
          return;
        }
        let nextKeys = keys.concat(keys.length)
        setFieldsValue({ keys: nextKeys })
      }
    })
  }

  // 点击移除子选项
  handleRemoveOption = (i) => {
    const {
      form: {
        setFieldsValue, getFieldsValue,
      },
    } = this.props
    const { type, answer, keys, options } = getFieldsValue()
    options.splice(i, 1)
    const newKeys = keys.slice(0, -1)
    const ans = Array.isArray(answer) ? answer : [answer]
    // 如果删除的子选项包含在正确答案里，就在答案中去除
    if (ans.includes(i)) {
      setFieldsValue({
        options: options,
        keys: newKeys,
        answer: type === 'multiple' ? ans.filter(item => item < i) : null,
      })
      return
    }
    setFieldsValue({
      options: options,
      keys: newKeys,
    })
  }

  // 点击提交
  handleSubmit = () => {
    const {
      form: { validateFields },
    } = this.props
    validateFields((errors, values) => {
      if (!errors) {
        console.log('提交', values);
      }
    })

  }

  // 判断选项数组是否有空内容
  hasEmpty = (arr) => {
    if (!arr || !arr.isArray(arr)) return false
    const realArr = arr.filter(Boolean)
    if (realArr.length !== arr.length) return false
    return true
  }

  // 渲染正确答案
  renderAnswer = () => {
    const {
      form: { getFieldDecorator, getFieldsValue },
    } = this.props
    const { type, keys } = getFieldsValue()
    if (type === 'single' || type === 'judge') {
      return (
        getFieldDecorator('answer', {
          rules: [
            { required: true, message: '请选择正确答案' },
          ],
        })(<RadioGroup name="answer">
          {keys && keys.map((item, index) => (
            <Radio key={index} value={index}>选项{letters[index]}</Radio>
          ))}
        </RadioGroup>)
      )
    } else if (type === 'multiple') {
      return (
        getFieldDecorator('answer', {
          rules: [
            { required: true, type: 'array', message: '请选择正确答案' },
          ],
        })(
          <CheckboxGroup options={keys && keys.map((item, index) => { return { label: `选项${letters[index]}`, value: index } })} />
        )
      )
    } else return null
  }

  render() {
    const {
      location: { pathname },
      form: { getFieldDecorator, getFieldValue },
    } = this.props
    const libraryType = pathname.split('/')[3]
    const breadcrumbList = [
      { title: '首页', name: '首页', href: '/' },
      { title: '培训', name: '培训' },
      { title: '题库', name: '题库', href: `/training/library/${libraryType}/list` },
      { title: '新增试题', name: '新增试题' },
    ]
    getFieldDecorator('keys', { initialValue: [] });
    const keys = getFieldValue('keys')
    const type = getFieldValue('type')
    return (
      <PageHeaderLayout
        title="新增试题"
        breadcrumbList={breadcrumbList}
      >
        <Card title="试题信息" className={styles.questionsAdd}>
          <Form>
            <Row>
              <Form.Item label="试题类型" {...formItemLayout}>
                {getFieldDecorator('type', {
                  validateTrigger: 'onBlur',
                  rules: [
                    { required: true, whitespace: true, message: '请选择试题类型' },
                  ],
                })(
                  <Select onChange={this.handleSelectType} placeholder="请选择" style={{ width: '350px' }}>
                    {questionsTypes.map(({ value, label }) => (
                      <Option key={value} value={value}>{label}</Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Row>
            <Row>
              <Form.Item label="试题题干"  {...formItemLayout}>
                {getFieldDecorator('title', {
                  validateTrigger: 'onBlur',
                  rules: [
                    { required: true, whitespace: true, message: '请输入题干' },
                  ],
                })(
                  <TextArea rows={2} />
                )}
              </Form.Item>
            </Row>
            <Row>
              <Button disabled={type === 'judge'} onClick={this.handleAddOption}>请添加子选项</Button>
            </Row>
            <Row>
              <Form.Item label="选项内容"  {...formItemLayout} required>
                <div className={styles.optionsContainer}>
                  {keys && keys.map((item, index) => (
                    <Form.Item key={index}>
                      <span>选项{letters[index]}</span>
                      {getFieldDecorator(`options[${index}]`, {
                        validateTrigger: 'onBlur',
                        rules: [
                          { required: true, whitespace: true, message: '请输入子选项内容' },
                        ],
                      })(
                        <Input style={{ width: '60%', marginRight: 8, marginLeft: 8 }} />
                      )}
                      <Icon
                        className={type !== 'judge' ? styles.deleteButton : styles.disabledDeleteButton}
                        type="close"
                        theme="outlined"
                        onClick={type !== 'judge' ? () => this.handleRemoveOption(index) : null}
                      />
                    </Form.Item>
                  ))}
                </div>
              </Form.Item>
            </Row>
            <Row>
              <Form.Item label="正确答案"  {...formItemLayout}>
                {this.renderAnswer()}
              </Form.Item>
            </Row>
            <Row>
              <Form.Item label="试题解析" {...formItemLayout}>
                {getFieldDecorator('Analysis')(
                  <TextArea rows={4} />
                )}
              </Form.Item>
            </Row>
            <div style={{ textAlign: 'center' }}>
              <Button style={{ marginRight: '24px' }}>
                返回
              </Button>
              <Button type="primary" onClick={this.handleSubmit} /* loading={} */>
                确定
              </Button>
            </div>
          </Form>
        </Card>
      </PageHeaderLayout>
    )
  }
}
