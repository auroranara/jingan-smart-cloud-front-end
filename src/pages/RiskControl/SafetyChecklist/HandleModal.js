import { Form } from '@ant-design/compatible';
import { Modal, Input, Select } from 'antd';
import CompanySelect from '@/jingan-components/CompanySelect';

const FormItem = Form.Item;

const formWrapper = {
  labelCol: { span: 6 },
  wrapperCol: { span: 15 },
}
// 风险分析方法字典
const analysisFunDict = [
  { value: 'LEC法', label: '1' },
  { value: 'LS法', label: '2' },
];

// 新增/编辑弹窗
const HandleModal = Form.create()(props => {
  const {
    form: { getFieldDecorator, validateFields },
    visible,
    onOk,
    onCancel,
    detail,
    isDetail = false,
    title,
  } = props;
  const objectId = detail ? detail.objectId : undefined;
  const handleOk = () => {
    validateFields((err, values) => {
      if (err) return;
      onOk(values)
    })
  }
  return (
    <Modal
      title={detail && detail.objectId ? `编辑${title}` : `新增${title}`}
      visible={visible}
      width={800}
      onOk={handleOk}
      onCancel={onCancel}
      destroyOnClose
    >
      <Form>
        <FormItem label="单位名称" {...formWrapper}>
          {getFieldDecorator('company', {
            rules: [
              {
                required: true,
                message: '单位名称不能为空',
                transform: value => value && value.label,
              },
            ],
            initialValue: objectId ? detail.companyId : undefined,
          })(
            <CompanySelect type={isDetail ? 'span' : 'select'} />
          )}
        </FormItem>
        <FormItem label="编号" {...formWrapper}>
          {getFieldDecorator('code', {
            rules: [{ required: true, message: '请输入编号' }],
            initialValue: objectId ? detail.code : undefined,
            getValueFromEvent: e => e.target.value.trim(),
          })(
            <Input placeholder="请输入" />
          )}
        </FormItem>
        <FormItem label="风险点" {...formWrapper}>

        </FormItem>
        <FormItem label="风险分析方法" {...formWrapper}>
          {getFieldDecorator('analysisFun')(
            <Select allowClear placeholder="请选择">
              {analysisFunDict.map(({ value, label }) => (
                <Select.Option key={value} value={value}>{label}</Select.Option>
              ))}
            </Select>
          )}
        </FormItem>
        <FormItem label="装置/设备/设施" {...formWrapper}>
          {getFieldDecorator('activityName', {
            initialValue: objectId ? detail.code : undefined,
            getValueFromEvent: e => e.target.value.trim(),
          })(
            <Input placeholder="请输入" />
          )}
        </FormItem>
      </Form>
    </Modal>
  )
})

export default HandleModal;
