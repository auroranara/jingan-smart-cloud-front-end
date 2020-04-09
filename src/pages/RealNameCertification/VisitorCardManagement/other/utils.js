import React, { Fragment } from 'react';
// import Link from 'umi/link';
// import moment from 'moment';
import { Form } from '@ant-design/compatible';
import { Input, Divider, Select, Modal } from 'antd';

import { isCompanyUser } from '@/pages/RoleAuthorization/Role/utils';
import codes from '@/utils/codes';
import { AuthPopConfirm, AuthA } from '@/utils/customAuth';

// 权限
const {
  personnelManagement: {
    tagCardManagement: { visitorCardEdit: editCode, visitorCardDelete: deleteCode },
  },
} = codes;

export const PAGE_SIZE = 20;
export const ROUTER = '/personnel-management/tag-card'; // modify
export const TAG_URL = `${ROUTER}/index`;
export const LIST_URL = `${ROUTER}/visitor-card-list`;

export const BREADCRUMBLIST = [
  // modify
  { title: '首页', name: '首页', href: '/' },
  { title: '标签卡管理', name: '标签卡管理', href: TAG_URL },
  { title: '访客卡管理', name: '访客卡管理', href: LIST_URL },
];

const useStatus = [{ key: '0', value: '已使用' }, { key: '1', value: '未使用' }];

export function getSearchFields(unitType) {
  const fields = [
    {
      id: 'companyName',
      label: '单位名称',
      render: () => <Input placeholder="请输入" allowClear />,
      transform: v => v.trim(),
    },
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
      id: 'status',
      label: '使用状态',
      render: () => (
        <Select placeholder="请选择使用状态" allowClear>
          {useStatus.map(({ key, value }) => (
            <Select.Option key={key} value={key}>
              {value}
            </Select.Option>
          ))}
        </Select>
      ),
    },
  ];

  if (isCompanyUser(+unitType)) fields.shift();

  return fields;
}

export function getTableColumns(handleConfirmDelete, handleEditModal, unitType, handlRecordPage) {
  const columns = [
    {
      title: '单位名称',
      dataIndex: 'companyName',
      key: 'companyName',
    },
    {
      title: '卡名称',
      dataIndex: 'cardName',
      key: 'cardName',
    },
    {
      title: 'IC卡号',
      dataIndex: 'icNumber',
      key: 'icNumber',
    },
    {
      title: 'SN卡号',
      dataIndex: 'snNumber',
      key: 'snNumber',
    },
    {
      title: '使用次数',
      dataIndex: 'useCount',
      key: 'useCount',
      render: (val, row) => (
        <span
          style={{ color: val !== 0 && '#1890ff', cursor: val !== 0 && 'pointer' }}
          onClick={() => val !== 0 && handlRecordPage(row.companyId, row.snNumber)}
        >
          {val}
        </span>
      ),
    },
    {
      title: '使用状态',
      dataIndex: 'status',
      key: 'status',
      render: val => (val === '0' ? '已使用' : '未使用'),
    },
    {
      title: '操作',
      dataIndex: 'reason',
      key: 'reason',
      render: (val, row) => (
        <Fragment>
          <AuthA code={editCode} onClick={() => handleEditModal(row)} target="_blank">
            编辑
          </AuthA>
          <Divider type="vertical" />
          <AuthPopConfirm
            code={deleteCode}
            title="删除卡后会导致该卡历史定位记录也被删除，是否继续？"
            onConfirm={e => handleConfirmDelete(row.id)}
            okText="确定"
            cancelText="取消"
          >
            删除
          </AuthPopConfirm>
        </Fragment>
      ),
    },
  ];

  if (isCompanyUser(+unitType)) columns.shift();
  return columns;
}

export const EditModal = Form.create()(props => {
  const {
    form: { getFieldDecorator, validateFields, resetFields },
    editDetail,
    editVisible,
    handleModalClose,
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
      const { cardName } = fieldsValue;
      const payload = {
        cardName,
      };
      if (err) return;
      resetFields();
      return handleModalEdit({
        ...payload,
        id: editDetail.id,
        companyId: editDetail.companyId,
      });
    });
  };

  const handleClose = () => {
    resetFields();
    handleModalClose();
  };

  return (
    <Modal title={'编辑'} visible={editVisible} onCancel={handleClose} onOk={onConfirm}>
      <Form>
        <Form.Item {...formItemCol} label="卡名称：">
          {getFieldDecorator('cardName', {
            getValueFromEvent: e => e.target.value.trim(),
            initialValue: editDetail.cardName,
            rules: [{ required: true, message: '请输入卡名称' }],
          })(<Input placeholder="请输入" />)}
        </Form.Item>
      </Form>
    </Modal>
  );
});
