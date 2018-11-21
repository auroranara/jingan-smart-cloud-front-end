import React, { PureComponent } from 'react';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import { Button, Card, Form, Col, Radio, Input } from 'antd';
import styles from './CoursewareAdd.less';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 14 },
};

// 课件类型
const coursewareTypes = [
  { value: 'video', label: '视频（mp4）' },
  { value: 'document', label: '文档（word/pdf/ppt）' },
]

@Form.create()
export default class CoursewareAdd extends PureComponent {

  state = {
    coursewareType: null,//课件类型
  }

  // 改变课件类型
  handleChangeType = (e) => {
    const {
      form: { setFieldsValue },
    } = this.props
    // TODO：清空上传课件
    // setFieldsValue({})
    this.setState({
      coursewareType: e.target.value,
    })
  }

  render() {
    const {
      form: { getFieldDecorator },
      location: { pathname },
    } = this.props
    const { coursewareType } = this.state
    const libraryType = pathname.split('/')[3]
    const breadcrumbList = [
      { title: '首页', name: '首页', href: '/' },
      { title: '培训', name: '培训' },
      { title: '题库', name: '题库', href: `/training/library/${libraryType}/list` },
      { title: '新增试题', name: '新增试题' },
    ]
    return (
      <PageHeaderLayout
        title="新增课件"
        breadcrumbList={breadcrumbList}
      >
        <Card className={styles.coursewareAdd}>
          <Form>
            <FormItem label="课件名称" {...formItemLayout}>
              {getFieldDecorator('name', {
                rules: [
                  { required: true, message: '请输入课件名称' },
                ],
              })(
                <Input />
              )}
            </FormItem>
            <FormItem label="知识点分类" {...formItemLayout}></FormItem>
            <FormItem label="课件类型" {...formItemLayout}>
              {getFieldDecorator('type', {
                rules: [
                  { required: true, message: '请选择课件类型' },
                ],
              })(
                <RadioGroup onChange={this.handleChangeType}>
                  {coursewareTypes.map((item, i) => (
                    <Radio key={i} value={item.value}>{item.label}</Radio>
                  ))}
                </RadioGroup>
              )}
            </FormItem>
            <FormItem label="课件封面" {...formItemLayout}></FormItem>
            <FormItem label="上传课件" {...formItemLayout}></FormItem>
            <FormItem label="详细内容" {...formItemLayout}></FormItem>
            <FormItem label="发布状态" {...formItemLayout}></FormItem>
          </Form>
        </Card>
      </PageHeaderLayout>
    )
  }
}
