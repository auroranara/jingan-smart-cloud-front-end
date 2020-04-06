import React from 'react';
import { Input, Modal, Select, DatePicker } from 'antd';
import { AuthPopConfirm } from '@/utils/customAuth';
import codes from '@/utils/codes';
import { Form } from '@ant-design/compatible';
import moment from 'moment';

const { TextArea } = Input;
const { RangePicker } = DatePicker;
// 权限
const {
  realNameCertification: {
    visitorRegistration: { cancelCard: cancelCardCode },
  },
} = codes;

export const PAGE_SIZE = 20;
export const ROUTER = 'real-name-certification/visitor-registration'; // modify
export const LIST_URL = `${ROUTER}/list`;

export const BREADCRUMBLIST = [
  // modify
  { title: '首页', name: '首页', href: '/' },
  { title: '实名制认证系统', name: '实名制认证系统' },
  { title: '访客登记', name: '访客登记', href: LIST_URL },
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
    id: 'phone',
    label: '手机号',
    render: () => <Input placeholder="请输入" allowClear />,
    transform: v => v.trim(),
  },
  {
    id: 'name',
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
      dataIndex: 'user',
      key: 'user',
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '登记时间',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: '卡名称',
      dataIndex: 'name',
      key: 'name',
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
          title="您确定现在要退卡"
          code={cancelCardCode}
          onConfirm={() => this.handleConfirmDelete(row.id)}
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
    detail,
    unitType,
    // companyId: unitId,
    modalTitle,
    modalVisible,
    modalStatus,
    handleModalClose,
    handleModalAdd,
    handleModalEdit,
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
      const { targetName, checkFrequency, companyId } = fieldsValue;
      const payload = {
        targetName,
        checkFrequency,
        // companyId: unitType === 4 ? unitId : companyId.key,
      };
      if (err) return;
      resetFields();
      return (
        (modalStatus === 'add' && handleModalAdd(payload)) ||
        (modalStatus === 'edit' && handleModalEdit({ ...payload, id: detail.id }))
      );
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
        {unitType !== 4 && (
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
        )}
        <Form.Item {...formItemCol} label="手机号：">
          {getFieldDecorator('phone', {
            getValueFromEvent: e => e.target.value.trim(),
            rules: [{ required: true, message: '请输入手机号' }],
          })(<Input {...itemStyles} placeholder="请输入" />)}
        </Form.Item>
        <Form.Item {...formItemCol} label="选择卡：">
          {getFieldDecorator('card')(
            <Select {...itemStyles} placeholder="请选择" allowClear>
              {[].map(({ key, value }) => (
                <Select.Option key={key} value={key}>
                  {value}
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
    id: 'ic',
    label: 'IC卡号',
    render: () => <Input placeholder="请输入" allowClear />,
    transform: v => v.trim(),
  },
  {
    id: 'sn',
    label: 'SN卡号',
    render: () => <Input placeholder="请输入" allowClear />,
    transform: v => v.trim(),
  },
  {
    id: 'user',
    label: '使用人',
    render: () => <Input placeholder="请输入" allowClear />,
    transform: v => v.trim(),
  },
  {
    id: 'opration',
    label: '操作人',
    render: () => <Input placeholder="请输入" allowClear />,
    transform: v => v.trim(),
  },
  {
    id: 'phone',
    label: '手机号',
    render: () => <Input placeholder="请输入" allowClear />,
    transform: v => v.trim(),
  },
  {
    id: 'time',
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
      dataIndex: 'user',
      key: 'user',
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '卡名称',
      dataIndex: 'cardName',
      key: 'cardName',
    },
    {
      title: 'IC卡号/SN卡号',
      dataIndex: 'cardNo',
      key: 'cardNo',
    },
    {
      title: '登记时间',
      dataIndex: 'resTime',
      key: 'resTime',
    },
    {
      title: '退卡时间',
      dataIndex: 'cancelTime',
      key: 'cancelTime',
    },
    {
      title: '备注',
      dataIndex: 'note',
      key: 'note',
    },
  ];
  return columns;
}
