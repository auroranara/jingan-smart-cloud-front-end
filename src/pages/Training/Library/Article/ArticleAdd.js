import React, { PureComponent } from 'react';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import BraftEditor from 'braft-editor'
import 'braft-editor/dist/index.css'
import { Card, Form, Row, Input, Col, Button } from 'antd';
import FooterToolbar from '@/components/FooterToolbar';

const FormItem = Form.Item
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

@Form.create()
export default class ArticleAdd extends PureComponent {

  state = {
    editorState: BraftEditor.createEditorState(null),
  }

  componentDidMount() {
    const htmlContent = '<p>啊是大</p><p>dawd</p>'
    this.setState({
      editorState: BraftEditor.createEditorState(htmlContent),
    })
  }

  handleEditorChange = (editorState) => {
    this.setState({ editorState })
  }

  submitContent = async () => {
    const { editorState } = this.state
    // 在编辑器获得焦点时按下ctrl+s会执行此方法
    // 编辑器内容提交到服务端之前，可直接调用editorState.toHTML()来获取HTML格式的内容
    const htmlContent = editorState.toHTML()
    console.log('editorState', editorState);
    console.log('htmlContent', htmlContent);

  }

  render() {
    const {
      location: {
        pathname,
      },
      form: { getFieldDecorator },
    } = this.props
    const { editorState } = this.state
    const libraryType = pathname.split('/')[3]
    const breadcrumbList = [
      { title: '首页', name: '首页', href: '/' },
      { title: '培训', name: '培训' },
      { title: '题库', name: '题库', href: `/training/library/${libraryType}/list` },
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
                  {getFieldDecorator('title')(
                    <Input placeholder="文章标题" />
                  )}
                </FormItem>
              </Col>
              <Col span={7}>
                <FormItem>
                  {getFieldDecorator('author')(
                    <Input placeholder="文章作者" />
                  )}
                </FormItem>
              </Col>
            </Row>
          </Form>
          <BraftEditor
            value={editorState}
            onChange={this.handleEditorChange}
            onSave={this.submitContent}
          />
        </Card>
        <FooterToolbar>
          <Button type="primary">提交</Button>
        </FooterToolbar>
      </PageHeaderLayout>
    )
  }
}
