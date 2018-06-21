import React from 'react';
import { Checkbox, Form, Input, Modal } from 'antd';

const FormItem = Form.Item;

const OPERATION_CHINESE = { add: '新增', update: '编辑' };

function ModalForm(props) {
  const {
    form,
    modalVisible = true,
    handleAdd,
    handleUpdate,
    handleModalVisible,
    items,
    operation = 'add',
    title = '',
    colSpan = [5, 15],
    initialValues = {},
  } = props;
  // 解构中传入null时，initialValus认为传值了，所以并不会是{}
  const initVals = initialValues || {};
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      if (operation === 'update') handleUpdate(fieldsValue);
      else handleAdd(fieldsValue);
    });
  };

  const formItems = items.map(item => {
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
      {formItems}
    </Modal>
  );
}

export default Form.create()(ModalForm);
