import React from 'react';
import { Input, Modal, Select, DatePicker, Tag } from 'antd';
import { AuthPopConfirm } from '@/utils/customAuth';
import codes from '@/utils/codes';
import { Form } from '@ant-design/compatible';
import moment from 'moment';
import Ellipsis from '@/components/Ellipsis';

const { TextArea } = Input;
const { RangePicker } = DatePicker;
// 权限
const {
  realNameCertification: {
    visitorRegistration: { cancelCard: cancelCardCode },
  },
} = codes;

export const PAGE_SIZE = 20;
export const ROUTER = '/real-name-certification/visitor-registration'; // modify
export const LIST_URL = `${ROUTER}/list`;

export const BREADCRUMBLIST = [
  // modify
  { title: '首页', name: '首页', href: '/' },
  { title: '实名制认证系统', name: '实名制认证系统' },
  { title: '访客登记', name: '访客登记', href: LIST_URL },
];

export const BREADCRUMBLIST_OTHER = [
  { title: '首页', name: '首页', href: '/' },
  { title: '访客登记', name: '访客登记', href: LIST_URL },
  { title: '访客登记记录', name: '访客登记记录' },
];

export const SEARCH_FIELDS = [
  // modify
  {
    id: 'user',
    label: '使用人',
    render: () => <Input placeholder="请输入" allowClear />,
    transform: v => v.trim(),
  },
  {
    id: 'telephone',
    label: '手机号',
    render: () => <Input placeholder="请输入" allowClear />,
    transform: v => v.trim(),
  },
  {
    id: 'cardName',
    label: '卡名称',
    render: () => <Input placeholder="请输入" allowClear />,
    transform: v => v.trim(),
  },
];

export function getTableColumns(handleConfirmDelete, unitType) {
  const columns = [
    // modify
    {
      title: '使用人',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '手机号码',
      dataIndex: 'telephone',
      key: 'telephone',
    },
    {
      title: '登记时间',
      dataIndex: 'registrationDate',
      key: 'registrationDate',
      render: v => moment(v).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '卡名称',
      dataIndex: 'cardName',
      key: 'cardName',
    },
    {
      title: '来访事由',
      dataIndex: 'reason',
      key: 'reason',
    },
    {
      title: '操作',
      dataIndex: 'reason',
      key: 'reason',
      render: (val, row) => (
        <AuthPopConfirm
          title="您确定现在要退卡?"
          code={cancelCardCode}
          onConfirm={() => handleConfirmDelete(row.id)}
        >
          退卡
        </AuthPopConfirm>
      ),
    },
  ];
  return columns;
}

export const EditModal = Form.create()(props => {
  const {
    form: { getFieldDecorator, validateFields, resetFields },
    // unitType,
    companyId: unitId,
    modalTitle,
    cardList,
    modalVisible,
    modalStatus,
    handleModalClose,
    handleModalAdd,
    hanldleCardAdd,
  } = props;

  const formItemCol = {
    labelCol: {
      span: 5,
    },
    wrapperCol: {
      span: 19,
    },
  };

  const onConfirm = () => {
    validateFields((err, fieldsValue) => {
      const { name, telephone, labelId, reason, note } = fieldsValue;
      const payload = {
        name,
        telephone,
        labelId,
        reason,
        note,
        companyId: unitId,
      };
      if (err) return;
      resetFields();
      return modalStatus === 'add' && handleModalAdd(payload);
    });
  };

  const handleClose = () => {
    resetFields();
    handleModalClose();
  };

  const itemStyles = { style: { width: '75%', marginRight: '10px' } };

  return (
    <Modal title={modalTitle} visible={modalVisible} onCancel={handleClose} onOk={onConfirm}>
      <Form>
        <Form.Item {...formItemCol} label="姓名:">
          {getFieldDecorator('name', {
            getValueFromEvent: e => e.target.value.trim(),
            rules: [
              {
                required: true,
                message: '请输入姓名',
              },
            ],
          })(<Input {...itemStyles} placeholder="请输入" />)}
        </Form.Item>
        <Form.Item {...formItemCol} label="手机号：">
          {getFieldDecorator('telephone', {
            getValueFromEvent: e => e.target.value.trim(),
            rules: [{ required: true, message: '请输入手机号' }],
          })(<Input {...itemStyles} placeholder="请输入" />)}
        </Form.Item>
        <Form.Item {...formItemCol} label="选择卡：">
          {getFieldDecorator('labelId')(
            <Select {...itemStyles} placeholder="请选择" allowClear>
              {cardList.map(({ id, cardName }) => (
                <Select.Option key={id} value={id}>
                  {cardName}
                </Select.Option>
              ))}
            </Select>
          )}
          <span>
            <a onClick={hanldleCardAdd}>新增临时卡</a>
          </span>
        </Form.Item>
        <Form.Item {...formItemCol} label="来访事由：">
          {getFieldDecorator('reason')(<TextArea {...itemStyles} placeholder="请输入" rows={3} />)}
        </Form.Item>
        <Form.Item {...formItemCol} label="备注：">
          {getFieldDecorator('note')(<TextArea {...itemStyles} placeholder="请输入" rows={3} />)}
        </Form.Item>
      </Form>
    </Modal>
  );
});

export const RECORD_FIELDS = [
  {
    id: 'cardName',
    label: '卡名称',
    render: () => <Input placeholder="请输入" allowClear />,
    transform: v => v.trim(),
  },
  {
    id: 'icNumber',
    label: 'IC卡号',
    render: () => <Input placeholder="请输入" allowClear />,
    transform: v => v.trim(),
  },
  {
    id: 'snNumber',
    label: 'SN卡号',
    render: () => <Input placeholder="请输入" allowClear />,
    transform: v => v.trim(),
  },
  {
    id: 'name',
    label: '使用人',
    render: () => <Input placeholder="请输入" allowClear />,
    transform: v => v.trim(),
  },
  {
    id: 'operationPerson',
    label: '操作人',
    render: () => <Input placeholder="请输入" allowClear />,
    transform: v => v.trim(),
  },
  {
    id: 'telephone',
    label: '手机号',
    render: () => <Input placeholder="请输入" allowClear />,
    transform: v => v.trim(),
  },
  {
    id: 'registrationDate',
    label: '创建时间',
    render: () => (
      <RangePicker
        showTime={{
          hideDisabledOptions: true,
          defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')],
        }}
        format="YYYY-MM-DD HH:mm:ss"
      />
    ),
  },
];

export function getRecordColumns() {
  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
    },
    {
      title: '使用人',
      dataIndex: 'name',
      key: 'name',
      width: 150,
    },
    {
      title: '手机号',
      dataIndex: 'telephone',
      key: 'telephone',
      width: 150,
    },
    {
      title: '卡名称',
      dataIndex: 'cardName',
      key: 'cardName',
      width: 150,
    },
    {
      title: 'IC卡号/SN卡号',
      dataIndex: 'cardNo',
      key: 'cardNo',
      width: 250,
      render: (val, row) => {
        return (
          <div>
            <p>
              {row.icNumber}
              <Tag color="blue" style={{ marginLeft: 6 }}>
                IC卡
              </Tag>
            </p>
            <p>
              {row.snNumber}
              <Tag color="blue" style={{ marginLeft: 6 }}>
                SN卡
              </Tag>
            </p>
          </div>
        );
      },
    },
    {
      title: '登记时间',
      dataIndex: 'registrationDate',
      key: 'registrationDate',
      width: 200,
      render: v => moment(v).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '退卡时间',
      dataIndex: 'returnDate',
      key: 'returnDate',
      width: 200,
      render: v => moment(v).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '用卡时长（时）',
      dataIndex: 'useCount',
      key: 'useCount',
      width: 150,
    },
    {
      title: '操作人',
      dataIndex: 'operationPerson',
      key: 'operationPerson',
      width: 200,
    },
    {
      title: '联系方式',
      dataIndex: 'operationPhone',
      key: 'operationPhone',
      width: 150,
    },
    {
      title: '来访事由',
      dataIndex: 'reason',
      key: 'reason',
      width: 200,
      render: val => (
        <Ellipsis tooltip length={15} style={{ overflow: 'visible' }}>
          {val}
        </Ellipsis>
      ),
    },
    {
      title: '备注',
      dataIndex: 'note',
      key: 'note',
      width: 200,
      render: val => (
        <Ellipsis tooltip length={15} style={{ overflow: 'visible' }}>
          {val}
        </Ellipsis>
      ),
    },
  ];
  return columns;
}
