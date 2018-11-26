import React, { PureComponent, Fragment } from 'react';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import { Button, Card, Form, Row, Col, Radio, Input, TreeSelect, Upload, Icon, message } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import { getToken } from '@/utils/authority';
import styles from './CoursewareAdd.less';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const TreeNode = TreeSelect.TreeNode;
const { TextArea } = Input;

// 上传文件地址
const uploadUrl = '/acloud_new/v2/uploadFile';

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 14 },
};

// 课件类型
const coursewareTypes = [
  { value: '2', label: '视频（mp4）' },
  { value: '3', label: '文档（word/pdf/ppt）' },
]

@Form.create()
@connect(({ resourceManagement }) => ({
  resourceManagement,
}))
export default class CoursewareAdd extends PureComponent {

  state = {
    title: '新增课件',
    coverLoading: false, // 课件封面loading
    fileList: [
      /*  {
         uid: '1',
         url: 'http://data.jingan-china.cn/hello/gsafe/courseWare/181122-141031-U9UK.png',
         name: '1',
         status: 'done',
       }, */
    ],
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
      this.setState({ title: '编辑课件' })
      dispatch({
        type: 'resourceManagement/fetchCourseWareDetail',
        payload: {
          id,
        },
        callback: ({ name, webVideoCover, videoCover, webFileUrl, fileUrl }) => {
          setFieldsValue({
            videoCover: { webUrl: webVideoCover[0], dbUrl: videoCover },
            fileUrl: { webUrl: webFileUrl[0], dbUrl: fileUrl },
          })
          this.setState({
            fileList: [
              {
                uid: '1',
                url: webFileUrl[0],
                name,
                status: 'done',
              },
            ],
          })
        },
      })
    }
  }

  // 改变课件类型
  handleChangeType = (e) => {
    const {
      form: { resetFields },
    } = this.props
    // TODO：清空上传课件
    resetFields(['videoCover', 'fileUrl'])
    this.setState({ fileList: [] })
  }

  // 上传课件封面之前的回调
  handleBeforeCoverLoad = (file) => {
    const { coverLoading } = this.state
    if (coverLoading) return false
  }

  // 点击提交
  handleSubmit = () => {
    const {
      dispatch,
      match: {
        params: { id },
      },
      form: { validateFields },
    } = this.props
    const success = () => {
      message.success(id ? '编辑成功' : '新增成功')
      router.push('/training/library/courseware/list')
    }
    const error = () => {
      message.error(id ? '编辑失败' : '新增失败')
    }
    validateFields((errors, values) => {
      if (!errors) {
        const { videoCover, fileUrl, ...others } = values
        const payload = {
          videoCover: values.type === '2' ? videoCover.dbUrl : null,
          fileUrl: fileUrl.dbUrl,
          ...others,
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
            payload: { id, ...payload },
            success,
            error,
          })
        }
      }
    })
  }

  // 处理上传课件封面
  handleCoverChange = ({ file, fileList }) => {
    const { form: { setFieldsValue, resetFields } } = this.props
    const error = () => {
      message.error('上传失败')
      resetFields(['videoCover'])
    }
    if (file.status === 'uploading') {
      this.setState({ coverLoading: true });
    } else if (file.status === 'done') {
      if (file.response && file.response.code === 200) {
        const {
          data: {
            list: [result],
          },
        } = file.response
        setFieldsValue({ videoCover: { webUrl: result.webUrl, dbUrl: result.dbUrl } })
      } else {
        error()
      }
      this.setState({ coverLoading: false });
    } else if (file.status === 'removed') {
      resetFields(['videoCover'])
    } else {
      error()
    }
  }

  // 处理上传课件
  handleFileChange = ({ file, fileList }) => {
    const {
      form: { setFieldsValue, resetFields },
    } = this.props
    let newList = fileList.slice(-1);
    if (file.status === 'uploading') {
      this.setState({ loading: true });
    } else if (file.status === 'done') {
      if (file.response && file.response.code === 200) {
        const {
          data: {
            list: [result],
          },
        } = file.response
        newList[0].url = result.webUrl
        setFieldsValue({ fileUrl: { dbUrl: result.dbUrl, webUrl: result.webUrl } })
      } else {
        message.error('上传失败')
        resetFields(['fileUrl'])
      }
      this.setState({ loading: false });
    } else if (file.status === 'removed') {
      resetFields(['fileUrl'])
    }
    this.setState({ fileList: newList });
  }

  // 上传课件（视频）之前的回调
  handleBeforeVideoLoad = (file) => {
    const isLt500M = file.size / 1024 / 1024 <= 500;
    if (!isLt500M) {
      message.error('请上传不超过500M的视频');
    }
    return isLt500M
  }

  // 上传课件（文档）之前的回调
  handleBeforeWordLoad = (file) => {
    const sizeLimit = file.size / 1024 / 1024 <= 10;
    if (!sizeLimit) {
      message.error('请上传不超过10M的文档');
    }
    return sizeLimit
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

  render() {
    const {
      form: { getFieldDecorator, getFieldValue },
      match: {
        params: { id },
      },
      resourceManagement: {
        knowledgeTree,
        courseWare: {
          detail,
        },
      },
    } = this.props
    const { title, coverLoading, fileList } = this.state
    const breadcrumbList = [
      { title: '首页', name: '首页', href: '/' },
      { title: '培训', name: '培训' },
      { title: '题库', name: '题库', href: `/training/library/courseware/list` },
      { title, name: title },
    ]
    // 课件封面地址
    const videoCover = getFieldValue('videoCover')
    // 课件类型值 默认'2' 视频
    const type = getFieldValue('type') || '2'
    const uploadButton = (
      <div>
        <Icon type={coverLoading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">上传</div>
      </div>
    );
    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
      >
        <Card className={styles.coursewareAdd}>
          <Form>
            <FormItem label="课件名称" {...formItemLayout}>
              {getFieldDecorator('name', {
                initialValue: id ? detail.name : undefined,
                rules: [
                  { required: true, message: '请输入课件名称' },
                ],
              })(
                <Input />
              )}
            </FormItem>
            <FormItem label="知识点分类" {...formItemLayout}>
              {getFieldDecorator('knowledgeId', {
                initialValue: id ? detail.knowledgeId : undefined,
                rules: [
                  { required: true, message: '请选择知识点分类' },
                ],
              })(
                <TreeSelect placeholder="知识点分类">
                  {this.renderTreeNodes(knowledgeTree)}
                </TreeSelect>
              )}
            </FormItem>
            <FormItem label="课件类型" {...formItemLayout}>
              {getFieldDecorator('type', {
                initialValue: id ? detail.type : '2',
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
            {type === '2' && (
              <FormItem label="课件封面" {...formItemLayout}>
                {getFieldDecorator('videoCover', {
                  rules: [
                    { required: true, message: '请上传课件封面', type: 'object' },
                  ],
                })(
                  <Fragment>
                    <Upload
                      name="files"
                      accept=".jpg,.png" // 接收的文件格式
                      headers={{ 'JA-Token': getToken() }}
                      data={{ folder: 'courseWare' }} // 附带的参数
                      listType="picture-card"
                      showUploadList={false}
                      action={uploadUrl}  // 上传地址
                      onChange={this.handleCoverChange}
                      beforeUpload={this.handleBeforeCoverLoad}
                    >
                      {videoCover && videoCover.webUrl ? <img className={styles.coverImage} src={videoCover.webUrl} alt="课件封面" /> : uploadButton}
                    </Upload>
                  </Fragment>
                )}
              </FormItem>
            )}
            <FormItem label="上传课件" {...formItemLayout}>
              {getFieldDecorator('fileUrl', {
                rules: [
                  { required: true, message: '请上传课件', type: 'object' },
                ],
              })(
                <Fragment>
                  <Upload
                    name="files"
                    accept={type === '2' ? ".mp4" : ".ppt,.pdf,.doc,.docx"}
                    headers={{ 'JA-Token': getToken() }}
                    data={{ folder: 'courseWare' }} // 附带的参数
                    action={uploadUrl}  // 上传地址
                    onChange={this.handleFileChange}
                    beforeUpload={type === '2' ? this.handleBeforeVideoLoad : this.handleBeforeWordLoad}
                    fileList={fileList}>
                    <Button type="primary">
                      <Icon type="upload" /> 浏览
                        </Button>
                  </Upload>
                </Fragment>
              )}
            </FormItem>
            <FormItem label="详细内容" {...formItemLayout}>
              {getFieldDecorator('content', {
                initialValue: id ? detail.content : undefined,
                rules: [
                  { required: true, message: '请输入详细内容' },
                ],
              })(
                <TextArea rows={4} />
              )}
            </FormItem>
            <FormItem label="发布状态" {...formItemLayout}>
              {getFieldDecorator('status', {
                initialValue: id ? detail.status : '1',
                rules: [
                  { required: true, message: '请选择发布状态' },
                ],
              })(
                <Radio.Group buttonStyle="solid">
                  <Radio.Button value="0">未发布</Radio.Button>
                  <Radio.Button value="1">发 布</Radio.Button>
                </Radio.Group>
              )}
            </FormItem>
          </Form>
          <div style={{ textAlign: 'center' }}>
            <Button style={{ marginRight: '24px' }}>返回</Button>
            <Button type="primary" onClick={this.handleSubmit}>提交</Button>
          </div>
        </Card>
      </PageHeaderLayout>
    )
  }
}
