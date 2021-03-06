import React from 'react';
import moment from 'moment';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Checkbox, DatePicker, Input, InputNumber, Modal, Switch } from 'antd';

// 封装的modal下带form的组件，需要传入的值查看props中传入的值

const DATE_FORMAT = 'YYYY-MM-DD';

const FormItem = Form.Item;

const OPERATION_CHINESE = { add: '新增', update: '编辑' };

// 处理数字比较麻烦，所以可以将数字都手动转成字符串，不论后台传数字还是字符串都可以操作，最后传给后台的是字符串
function ModalForm(props) {
  const {
    form,
    modalVisible = true,
    handleAdd, // 处理添加
    handleUpdate, // 处理编辑
    hideModal, // 改变modal的可见性
    items, // 传入的formItem配置数组
    operation = 'add', // 当前操作类型，这关系到modal上title的显示，是新增还是编辑
    title = '', // 当前modal的title显示的一部分
    // colSpan = [6, 15], // formItem的col配置
    initialValues = {}, // 每个formItem的初始值，也可以在items中传入，当需要改变form中的值时，在这里传入对应的对象
    ...restProps
  } = props;
  // 解构中传入null时，initialValus认为传值了，所以并不会是{}
  // console.log('initialValues in ModalForm', initialValues);
  let initVals = initialValues || {};

  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      console.log('err in ModalForm', err, fieldsValue);
      if (err) return;
      form.resetFields();
      // 将fieldsValue做处理，如字符串去掉两边空白，将DatePicker的对象转成对应的日期字符串
      const values = handleFieldsValue(fieldsValue);
      if (operation === 'update') handleUpdate(values);
      else handleAdd(values);
      hideModal();
    });
  };

  const formItems = items.map((item, index) => {
    // 每个formItem都是个对象，需要设置label(标签),name(字段名),options(初始配置),type(formItem中的组件类型，当前只有Input和Checkbox，默认Input)
    // disabled默认是false，即可修改的，手动设为true(或其他真值)，则为只读
    const { type = 'input', disabled, placeholder = '', label, name, labelCol={ span: 6 }, wrapperCol={ span: 15 }, options } = item;
    // console.log('disabled in ModalForm-columns-item', disabled);
    let initialValue = initVals[name];

    // 若是checkbox等需要接收布尔值的组件，则将初始值转为布尔值
    if (type === 'checkbox')
      initialValue = !!+initialValue;

    // 由于都提交的时候设置了whitespace=true来判断是否是空格，所以默认field value都是字符串，当初始值时数字时，提交时也是数字会校验错误
    // 所以把所有数字都转为字符串，当然也可以校验时把type设为number，这里是为了防止传过来的值变成了字符串而不是数字
    if (typeof initialValue === 'number')
      initialValue = initialValue.toString();
    if (isDateProp(name) && initialValue !== undefined && initialValue !== null)
      initialValue = moment(initialValue, DATE_FORMAT);
    let newOptions = options;
    if (initialValue !== undefined && initialValue !== null)
      newOptions = { ...options, initialValue };
    return (
      <FormItem
        key={index}
        label={label}
        labelCol={labelCol}
        wrapperCol={wrapperCol}
      >
        {form.getFieldDecorator(name, newOptions)(getComByType(type, !!disabled, placeholder))}
      </FormItem>
    );
  });

  // Modal中的destroyOnClose不加的话，当对话框中有内容时，下次再调用这个对话框时，内容还会在，所以直接销毁，来防止之前的内容污染后续内容
  return (
    <Modal
      destroyOnClose
      title={`${OPERATION_CHINESE[operation]}${title}`}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => hideModal()}
      {...restProps}
    >
      <Form>{formItems}</Form>
    </Modal>
  );
}

function getComByType(type='input', disabled=false, placeholder='') {
  // const inputType = type.slice(6, -1) || 'text'; // input的类型
  switch(type) {
    case 'checkbox':
      return <Checkbox disabled={disabled}>{placeholder}</Checkbox>;
    case 'switch':
      return <Switch disabled={disabled} />;
    case 'date-picker':
      return <DatePicker disabled={disabled} />;
    case 'inputNumber':
      return <InputNumber disabled={disabled} />;
    default:
      return <Input disabled={disabled} placeholder={placeholder} />;
  }
}

// 返回含有'date'或'time'的属性名数组
// function getDateProps(values) {
//   return Object.keys(values).filter(k => values[k] !== undefined && values[k] !== null && isDateProp(k));
// }

function isDateProp(property) {
  const np = property.toLowerCase();
  return np.includes('date') || np.includes('time');
}

function handleFieldsValue(fieldsValue) {
  const values = { ...fieldsValue };
  // 获取fieldsValue包含date和time(并过滤掉值为undefined)的属性名数组
  for (const k of Object.keys(fieldsValue)) {
    const val = fieldsValue[k];
    if (typeof val === 'string')
      values[k] = val.trim();
    if (typeof val === 'boolean')
      values[k] = val ? 1 : 0;
    if (isDateProp(k) && val !== undefined && val !== null && val.format)
      values[k] = val.format(DATE_FORMAT);
  }

  return values;
}

export default Form.create()(ModalForm);
