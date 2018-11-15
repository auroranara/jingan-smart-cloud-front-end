import React, { PureComponent } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Button, Card, Form, Row, Col, Input, Select, Icon, Radio, Checkbox, TreeSelect, message } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import styles from './QuestionsAdd.less';

const RadioGroup = Radio.Group;
const TextArea = Input.TextArea
const Option = Select.Option
const CheckboxGroup = Checkbox.Group;
const TreeNode = TreeSelect.TreeNode;
// 试题类型
const questionsTypes = [
  { value: '1', label: '单选题' },
  { value: '2', label: '多选题' },
  { value: '3', label: '判断题' },
]

// 难易程度
const levels = [
  { value: '1', label: '简单' },
  { value: '2', label: '一般' },
  { value: '3', label: '较难' },
]

const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const formItemLayout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 21 },
};
const smallerItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};
const colWrapper = {
  xl: 12, md: 12, sm: 24, xs: 24,
};

@Form.create()
@connect(({ resourceManagement, loading }) => ({
  resourceManagement,
  // treeLoading: loading.effects['resourceManagement/'],
}))
export default class QuestionsAdd extends PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      optionsHelp: '',
    }
  }

  componentDidMount() {
    const { dispatch } = this.props
    // 获取知识点树
    dispatch({ type: 'resourceManagement/fetchKnowledgeTree' })
  }

  // 点击选择试题类型
  handleSelectType = async (value) => {
    const {
      form: { setFieldsValue },
    } = this.props
    if (value === '3') {
      // 如果是判断题(必须先getFieldDecorator绑定再使用setFieldsValue)
      await setFieldsValue({
        keys: [0, 1],
      })
      setFieldsValue({
        arrAnswer: null,
        arrOptions: ['正确', '错误'],
      })
      return
    }
    setFieldsValue({
      arrAnswer: null,
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
    const { type, arrAnswer, keys, arrOptions } = getFieldsValue()
    arrOptions.splice(i, 1)
    const newKeys = keys.slice(0, -1)
    const ans = Array.isArray(arrAnswer) ? arrAnswer : [arrAnswer]
    // 如果删除的子选项包含在正确答案里，就在答案中去除
    if (ans.includes(i)) {
      setFieldsValue({
        arrOptions,
        keys: newKeys,
        arrAnswer: type === '2' ? ans.filter(item => item < i) : null,
      })
      return
    }
    setFieldsValue({
      arrOptions,
      keys: newKeys,
    })
  }

  // 渲染树节点
  renderTreeNodes = (data) => {
    return data.map(item => {
      if (item.children && Array.isArray(item.children)) {
        return (
          <TreeNode value={item.id} title={item.name} key={item.id}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        )
      } else return (
        <TreeNode value={item.id} title={item.name} key={item.id}>
        </TreeNode>
      )
    })
  }

  // 点击提交
  handleSubmit = () => {
    const {
      form: { validateFields },
      dispatch,
    } = this.props
    validateFields((errors, values) => {
      if (!errors) {
        const { arrOptions, arrAnswer, keys, ...others } = values
        const newAnswers = Array.isArray(arrAnswer) ? arrAnswer : [arrAnswer]
        const newOptions = arrOptions.map(item => {
          return { desc: item }
        })
        // console.log('value', { ...others, arrAnswer: newAnswers, arrOptions: newOptions });

        dispatch({
          type: 'resourceManagement/addQuestion',
          payload: { ...others, arrAnswer: newAnswers, arrOptions: newOptions },
          success: () => {
            message.success('新增试题成功！')
            router.push('/training/library/questions/list')
          },
          error: () => {
            message.error('新增试题失败')
          },
        })
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
    if (type === '1' || type === '3') {
      return (
        getFieldDecorator('arrAnswer', {
          rules: [
            { required: true, message: '请选择正确答案' },
          ],
        })(<RadioGroup name="arrAnswer">
          {keys && keys.map((item, index) => (
            <Radio key={index} value={index}>选项{letters[index]}</Radio>
          ))}
        </RadioGroup>)
      )
    } else if (type === '2') {
      return (
        getFieldDecorator('arrAnswer', {
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
      resourceManagement: {
        knowledgeTree,
      },
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
              <Col {...colWrapper}>
                <Form.Item label="试题类型" {...smallerItemLayout}>
                  {getFieldDecorator('type', {
                    validateTrigger: 'onBlur',
                    rules: [
                      { required: true, message: '请选择试题类型' },
                    ],
                  })(
                    <Select onChange={this.handleSelectType} placeholder="请选择">
                      {questionsTypes.map(({ value, label }) => (
                        <Option key={value} value={value}>{label}</Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              {/* <Col {...colWrapper}>
                <Form.Item label="试题类型" {...smallerItemLayout}>
                  {getFieldDecorator('classification', {
                    rules: [
                      { required: true, message: '请选择试题类型' },
                    ],
                  })(
                    <Select placeholder="请选择">
                      {[{ value: 'normal', label: '普通题' }].map(({ value, label }) => (
                        <Option key={value} value={value}>{label}</Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col> */}
              <Col {...colWrapper}>
                <Form.Item label="知识点分类" {...smallerItemLayout}>
                  {getFieldDecorator('knowledgeId', {
                    rules: [
                      { required: true, message: '请选择知识点分类' },
                    ],
                  })(
                    <TreeSelect placeholder="请选择">
                      {this.renderTreeNodes(knowledgeTree)}
                    </TreeSelect>
                  )}
                </Form.Item>
              </Col>
              <Col {...colWrapper}>
                <Form.Item label="难易程度" {...smallerItemLayout}>
                  {getFieldDecorator('level', {
                    rules: [
                      { required: true, message: '请选择难易程度' },
                    ],
                  })(
                    <Select placeholder="请选择">
                      {levels.map(({ value, label }) => (
                        <Option value={value} key={value}>{label}</Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Form.Item label="试题题干"  {...formItemLayout}>
                {getFieldDecorator('stem', {
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
              <Button disabled={type === '3'} onClick={this.handleAddOption}>请添加子选项</Button>
            </Row>
            <Row>
              <Form.Item label="选项内容"  {...formItemLayout} required>
                <div className={styles.optionsContainer}>
                  {keys && keys.map((item, index) => (
                    <Form.Item key={index}>
                      <span>选项{letters[index]}</span>
                      {getFieldDecorator(`arrOptions[${index}]`, {
                        validateTrigger: 'onBlur',
                        rules: [
                          { required: true, whitespace: true, message: '请输入子选项内容' },
                        ],
                      })(
                        <Input style={{ width: '60%', marginRight: 8, marginLeft: 8 }} />
                      )}
                      <Icon
                        className={type !== '3' ? styles.deleteButton : styles.disabledDeleteButton}
                        type="close"
                        theme="outlined"
                        onClick={type !== '3' ? () => this.handleRemoveOption(index) : null}
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
                {getFieldDecorator('des')(
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
