import React, { PureComponent } from 'react';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import BraftEditor from 'braft-editor'
import 'braft-editor/dist/index.css'
import { connect } from 'dva';
import router from 'umi/router';
import debounce from 'lodash/debounce';
import { Card, Form, Row, Input, Col, Button, TreeSelect, Radio, message } from 'antd';
import FooterToolbar from '@/components/FooterToolbar';

const FormItem = Form.Item
const TreeNode = TreeSelect.TreeNode;

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

@Form.create()
@connect(({ resourceManagement }) => ({
  resourceManagement,
}))
export default class ArticleAdd extends PureComponent {

  constructor() {
    super()
    this.state = {
      editorState: BraftEditor.createEditorState(null),
    }
  }

  componentDidMount() {
    const {
      dispatch,
      match: {
        params: { id },
      },
      form: { setFieldsValue },
    } = this.props

    // 获取知识点树
    dispatch({ type: 'resourceManagement/fetchKnowledgeTree' })
    // 如果编辑
    if (id) {
      dispatch({
        type: 'resourceManagement/fetchArticleDetail',
        payload: {
          type: '1', // type 1文章
          id,
        },
        callback: (detail) => {
          setFieldsValue({ content: BraftEditor.createEditorState(detail.content) })
        },
      })
    }
  }

  // 监听富文本变化
  handleEditorChange = (editorState) => {
    this.setState({ editorState })
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

  // ctrl+s保存
  /* saveContent = async () => {
    const { editorState } = this.state
    // 在编辑器获得焦点时按下ctrl+s会执行此方法
    // 编辑器内容提交到服务端之前，可直接调用editorState.toHTML()来获取HTML格式的内容
    const htmlContent = editorState.toHTML()

  } */

  // 文章内容验证规则
  contentValidator = (rule, value, callback) => {
    const data = value.toHTML().replace(/\<(\/)?\w\>/g, '')
    if (!data || data === '') {
      callback('请输入文章内容')
    } else callback()
  }

  // 点击提交
  handleSubmit = () => {
    const {
      dispatch,
      location: { pathname },
      form: { validateFields },
      match: {
        params: { id },
      },
    } = this.props
    const libraryType = pathname.split('/')[3]
    const success = () => {
      message.success(id ? '编辑成功' : '新增成功')
      router.push(`/training/library/${libraryType}/list`)
    }
    const error = () => {
      message.error(id ? '编辑失败' : '新增失败')
    }

    validateFields((errors, values) => {
      if (!errors) {
        const { content, ...others } = values
        const payload = {
          content: content.toHTML(),
          ...others,
          type: '1',
        }
        // 如果新增
        if (!id) {
          dispatch({
            type: 'resourceManagement/addArticlesOrCourseWare',
            payload,
            success,
            error,
          })
        } else {
          dispatch({
            type: 'resourceManagement/editArticlesOrCourseWare',
            payload: { ...payload, id },
            success,
            error,
          })
        }
      }
    })
  }

  render() {
    const {
      match: {
        params: { id },
      },
      form: { getFieldDecorator },
      resourceManagement: {
        knowledgeTree,
        article: {
          detail: {
            status,
            name,
            content,
            knowledgeId,
          },
        },
      },
    } = this.props
    // const { editorState } = this.state
    const breadcrumbList = [
      { title: '首页', name: '首页', href: '/' },
      { title: '培训', name: '培训' },
      { title: '题库', name: '题库', href: `/training/library/article/list` },
      { title: '新增文章', name: '新增文章' },
    ]

    return (
      <PageHeaderLayout
        title="新增文章"
        breadcrumbList={breadcrumbList}
      >
        <Card>
          <Form>
            <Row gutter={12}>
              <Col span={14}>
                <FormItem>
                  {getFieldDecorator('name', {
                    validateTrigger: 'onBlur',
                    initialValue: id ? name : undefined,
                    rules: [
                      { required: true, message: '请输入文章标题' },
                    ],
                  })(
                    <Input placeholder="文章标题" />
                  )}
                </FormItem>
              </Col>
              <Col span={7}>
                <FormItem>
                  {getFieldDecorator('knowledgeId', {
                    initialValue: id ? knowledgeId : undefined,
                    rules: [
                      { required: true, message: '请选择知识点分类' },
                    ],
                  })(
                    <TreeSelect placeholder="知识点分类">
                      {this.renderTreeNodes(knowledgeTree)}
                    </TreeSelect>
                  )}
                </FormItem>
              </Col>
              <Col span={7}>
                <FormItem>
                  {getFieldDecorator('status', {
                    initialValue: id ? status : '1',
                  })(
                    <Radio.Group buttonStyle="solid">
                      <Radio.Button value="0">未发布</Radio.Button>
                      <Radio.Button value="1">发 布</Radio.Button>
                    </Radio.Group>
                  )}
                </FormItem>
              </Col>
              <Col span={24}>
                <FormItem>
                  {getFieldDecorator('content', {
                    initialValue: id ? BraftEditor.createEditorState(content) : undefined,
                    validateTrigger: 'onBlur',
                    rules: [
                      { validator: this.contentValidator },
                    ],
                  })(
                    <BraftEditor
                      // value={editorState}
                      onChange={this.handleEditorChange}
                    // onSave={this.saveContent}
                    />
                  )}
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Card>
        <FooterToolbar>
          <Button onClick={this.handleSubmit} type="primary">提交</Button>
        </FooterToolbar>
      </PageHeaderLayout>
    )
  }
}
