import React from 'react';
import { Input, Form, Modal, Select } from 'antd';

export const PAGE_SIZE = 1;
export const ROUTER = '/target-responsibility'; // modify
export const LIST_URL = `${ROUTER}/index-management/index`;

const { Option } = Select;

export const BREADCRUMBLIST = [
  // modify
  { title: '首页', name: '首页', href: '/' },
  { title: '目标责任管理 ', name: '目标责任管理 ' },
  { title: '安全生产指标管理', name: '安全生产指标管理', href: LIST_URL },
];

export const SEARCH_FIELDS = [
  {
    id: 'targetName',
    label: '指标名称',
    render: () => <Input placeholder="请输入" allowClear />,
  },
];

const getFrequency = {
  1: '月',
  2: '季度',
  3: '年',
};

export const TABLE_COLUMNS = [
  // modify
  {
    title: '指标',
    dataIndex: 'targetName',
    key: 'targetName',
    align: 'center',
    width: 300,
  },
  {
    title: '考核频次',
    dataIndex: 'checkFrequency',
    key: 'checkFrequency',
    align: 'center',
    width: 300,
    render: val => getFrequency[val],
  },
];

const frequencyList = [
  {
    key: '1',
    value: '月',
  },
  {
    key: '2',
    value: '季度',
  },
  {
    key: '3',
    value: '年',
  },
];

export const EditModal = Form.create()(props => {
  const {
    form: { getFieldDecorator, validateFields, resetFields },
    detail,
    modalTitle,
    modalVisible,
    modalStatus,
    handleModalClose,
    handleModalAdd,
    handleModalEdit,
  } = props;
  const formItemCol = {
    labelCol: {
      span: 5,
    },
    wrapperCol: {
      span: 15,
    },
  };
  const onConfirm = () => {
    validateFields((err, fieldsValue) => {
      if (err) return;
      resetFields();
      return (
        (modalStatus === 'add' && handleModalAdd(fieldsValue)) ||
        (modalStatus === 'edit' && handleModalEdit({ ...fieldsValue, id: detail.id }))
      );
    });
  };

  const handleClose = () => {
    resetFields();
    handleModalClose();
  };

  return (
    <Modal title={modalTitle} visible={modalVisible} onCancel={handleClose} onOk={onConfirm}>
      <Form>
        <Form.Item {...formItemCol} label="指标名称：">
          {getFieldDecorator('targetName', {
            getValueFromEvent: e => e.target.value.trim(),
            initialValue: modalStatus === 'edit' ? detail.targetName : undefined,
            rules: [{ required: true, message: '请输入指标名称' }],
          })(<Input placeholder="请输入" />)}
        </Form.Item>
        <Form.Item {...formItemCol} label="考核频次：">
          {getFieldDecorator('checkFrequency', {
            initialValue: modalStatus === 'edit' ? detail.checkFrequency : undefined,
            rules: [{ required: true, message: '请选择考核频次' }],
          })(
            <Select placeholder="请选择" allowClear>
              {frequencyList.map(({ key, value }) => (
                <Option key={key} value={key}>
                  {value}
                </Option>
              ))}
            </Select>
          )}
        </Form.Item>
      </Form>
    </Modal>
  );
});
