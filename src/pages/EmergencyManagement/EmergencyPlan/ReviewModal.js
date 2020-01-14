import { Component, Fragment } from 'react';
import {
  Modal,
  Input,
  Form,
  Upload,
  Radio,
  Button,
  Icon,
  message,
} from 'antd';
import { getToken } from '@/utils/authority';

// 上传文件地址
const uploadAction = '/acloud_new/v2/uploadFile';
const FormItem = Form.Item;
const FormLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 15 },
}
// 审核状态选项
const STATUSES = [
  { key: '2', label: '通过' },
  { key: '3', label: '不通过' },
]

@Form.create()
export default class ReviewModal extends Component {

  state = {
    fileList: [],
    fileUploading: false,
  }

  getValueFromEvent = e => e.target.value.trim()

  handleSubmit = () => {
    const {
      form: { validateFields },
      onOk,
    } = this.props;
    validateFields((err, values) => {
      if (err) return;
      const { fileList } = this.state;
      const payload = {
        ...values,
        otherFile: fileList && fileList.length ? JSON.stringify(fileList) : undefined,
      }
      onOk && onOk(payload);
    })
  }
  // 监听上传改变
  handleUploadChange = ({ file, fileList }) => {
    if (file.status === 'uploading') {
      this.setState({ fileUploading: true, fileList })
    } else if (file.status === 'done') {
      if (file.response && file.response.code === 200) {
        const result = file.response.data.list[0]
        const list = fileList.map((item, index) => {
          if (index === fileList.length - 1) {
            return {
              ...result,
              uid: item.uid,
              url: result.webUrl,
              name: result.fileName,
            }
          } else return item
        })
        this.setState({
          fileUploading: false,
          fileList: list,
        })
      } else {
        message.error('上传失败！');
        this.setState({
          fileList: fileList.filter(item => {
            return !item.response || item.response.code !== 200;
          }),
        });
      }
      this.setState({
        fileUploading: false,
      });
    } else if (file.status === 'removed') {
      // 删除
      this.setState({
        fileList: fileList.filter(item => {
          return item.status !== 'removed';
        }),
        fileUploading: false,
      });
    } else {
      message.error('上传失败')
      this.setState({ fileUploading: false })
    }
  }

  render () {
    const {
      form: { getFieldDecorator },
      visible,
      title = '审核提示',
      onOk,
      onCancel,
      width = 600,
      ...resProps
    } = this.props;
    const { fileList, fileUploading } = this.state;
    return (
      <Modal
        visible={visible}
        title={title}
        onOk={this.handleSubmit}
        onCancel={onCancel}
        width={width}
        {...resProps}
      >
        <Form >
          <FormItem label="审核意见" {...FormLayout}>
            {getFieldDecorator('status', {
              rules: [{ required: true, message: '请选择审核意见' }],
            })(
              <Radio.Group>
                {STATUSES.slice().map(({ key, label }) => (
                  <Radio key={key} value={key}>{label}</Radio>
                ))}
              </Radio.Group>
            )}
          </FormItem>
          <FormItem label="一级审批人" {...FormLayout}>
            {getFieldDecorator('firstApproveBy', {
              rules: [{ required: true, message: '请输入一级审批人' }],
              getValueFromEvent: this.getValueFromEvent,
            })(
              <Input placeholder="请输入" />
            )}
          </FormItem>
          <FormItem label="二级审批人" {...FormLayout}>
            {getFieldDecorator('secondApproveBy', {
              getValueFromEvent: this.getValueFromEvent,
            })(
              <Input placeholder="请输入" />
            )}
          </FormItem>
          <FormItem label="三级审批人" {...FormLayout}>
            {getFieldDecorator('threeApproveBy', {
              getValueFromEvent: this.getValueFromEvent,
            })(
              <Input placeholder="请输入" />
            )}
          </FormItem>
          <FormItem label="附件" {...FormLayout}>
            {getFieldDecorator('otherFile')(
              <Fragment>
                <Upload
                  name="files"
                  headers={{ 'JA-Token': getToken() }}
                  accept="image/*" // 接收的文件格式
                  data={{ folder: 'securityManageInfo' }} // 附带的参数
                  action={uploadAction} // 上传地址
                  onChange={this.handleUploadChange}
                  fileList={fileList}
                >
                  <Button type="primary">
                    <Icon type={fileUploading ? 'loading' : "upload"} />
                    点击上传
                </Button>
                </Upload>
              </Fragment>
            )}
          </FormItem>
        </Form>
      </Modal>
    )
  }
};
