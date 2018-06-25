import React from 'react';
import { Checkbox, Form, Input, Modal } from 'antd';

// 封装的modal下带form的组件，需要传入的值查看props中传入的值

const FormItem = Form.Item;

const OPERATION_CHINESE = { add: '新增', update: '编辑' };

function ModalForm(props) {
  const {
    form,
    modalVisible = true,
    handleAdd, // 处理添加
    handleUpdate, // 处理编辑
    handleModalVisible, // 改变modal的可见性
    items, // 传入的formItem配置数组
    operation = 'add', // 当前操作类型，这关系到modal上title的显示，是新增还是编辑
    title = '', // 当前modal的title显示的一部分
    colSpan = [5, 15], // formItem的col配置
    initialValues = {}, // 每个formItem的初始值，也可以在items中传入，当需要改变form中的值时，在这里传入对应的对象
  } = props;
  // 解构中传入null时，initialValus认为传值了，所以并不会是{}
  const initVals = initialValues || {};
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      if (operation === 'update') handleUpdate(fieldsValue);
      else handleAdd(fieldsValue);
      handleModalVisible();
    });
  };

  const formItems = items.map(item => {
    // 每个formItem都是个对象，需要设置label(标签),name(字段名),options(初始配置),type(formItem中的组件类型，当前只有Input和Checkbox，默认Input)
    const { type = 'input', placeholder = '', label, name, options } = item;
    const initialValue = initVals[name];
    let newOptions = options;
    if (initialValue !== undefined && initialValue !== null)
      newOptions = { ...options, initialValue };
    return (
      <FormItem
        key={label}
        label={label}
        labelCol={{ span: colSpan[0] }}
        wrapperCol={{ span: colSpan[1] }}
      >
        {type === 'checkbox'
          ? form.getFieldDecorator(name, newOptions)(<Checkbox />)
          : form.getFieldDecorator(name, newOptions)(<Input placeholder={placeholder} />)}
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
      onCancel={() => handleModalVisible()}
    >
      <Form>{formItems}</Form>
    </Modal>
  );
}

export default Form.create()(ModalForm);
