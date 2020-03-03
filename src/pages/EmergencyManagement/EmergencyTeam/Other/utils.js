import React, { Fragment } from 'react';
// import Link from 'umi/link';
import { Input, Divider, Select, Form, Modal } from 'antd';

import { isCompanyUser } from '@/pages/RoleAuthorization/Role/utils';
import codes from '@/utils/codes';
import { phoneReg } from '@/utils/validate';
import { AuthPopConfirm, AuthLink, AuthA, AuthSpan } from '@/utils/customAuth';
import styles from '../List/index.less';

const { Option } = Select;

// 权限
const {
  emergencyManagement: {
    emergencyTeam: {
      view: viewCode,
      edit: editCode,
      delete: deleteCode,
      teamPersonList: perosnListCode,
      editTeamPerson: editPerCode,
      deleteTeamPerson: delPerCode,
    },
  },
} = codes;

const teamType = [
  { key: '1', value: '公司' },
  { key: '2', value: '工厂-车间' },
  { key: '3', value: '工序-班组' },
];

export const getLevel = {
  1: '公司',
  2: '工厂-车间',
  3: '工序-班组',
};

const personSexList = [{ key: '1', value: '男' }, { key: '2', value: '女' }];

export const getSex = {
  1: '男',
  2: '女',
};

export { teamType };

export const ROUTER = '/emergency-management/emergency-team'; // modify
export const LIST_URL = `${ROUTER}/list`;

export const BREADCRUMBLIST = [
  // modify
  { title: '首页', name: '首页', href: '/' },
  { title: '应急管理', name: '应急管理' },
  { title: '应急队伍管理', name: '应急队伍管理', href: LIST_URL },
];

export function getSearchFields(unitType) {
  const fields = [
    {
      id: 'treamLevel',
      label: '队伍级别',
      render: () => (
        <Select placeholder="请选择" allowClear>
          {teamType.map(({ key, value }) => (
            <Option key={key} value={key}>
              {value}
            </Option>
          ))}
        </Select>
      ),
    },
    {
      id: 'companyName',
      label: '单位名称',
      render: () => <Input placeholder="请输入" allowClear />,
      transform: v => v.trim(),
    },
  ];

  if (isCompanyUser(+unitType)) fields.pop();
  return fields;
}

export function getTableColumns(handleConfirmDelete, unitType, handlePesonListClick) {
  const columns = [
    {
      title: '单位名称',
      dataIndex: 'companyName',
      key: 'companyName',
      align: 'center',
      width: 250,
    },
    {
      title: '队伍名称',
      dataIndex: 'treamName',
      key: 'treamName',
      align: 'center',
    },
    {
      title: '队伍级别',
      dataIndex: 'treamLevel',
      key: 'treamLevel',
      align: 'center',
      render: val => getLevel[val],
    },
    {
      title: '队伍负责人',
      dataIndex: 'charger',
      key: 'charger',
      align: 'center',
      width: 180,
      render: (val, row) => {
        const { treamHead, areaCode, telNumber, headPartName, headPhone } = row;

        const isPhone = areaCode || telNumber;
        const isAreaCode = areaCode !== 'null' ? areaCode : '';
        const isTelPhone = telNumber !== 'null' ? telNumber : '';

        return (
          <div className={styles.multi}>
            <div className={styles.item}>
              <span className={styles.label}>姓名:</span>
              <span>{treamHead}</span>
            </div>
            <div className={styles.item}>
              <span className={styles.label}>部门:</span>
              <span>{headPartName}</span>
            </div>
            <div className={styles.item}>
              <span className={styles.label}>手机:</span>
              <span>{headPhone}</span>
            </div>
            <div className={styles.item}>
              <span className={styles.label}>固定电话:</span>
              <span>{isPhone ? isAreaCode + '-' + isTelPhone : '-'}</span>
            </div>
          </div>
        );
      },
    },
    {
      title: '队伍描述',
      dataIndex: 'treamDescription',
      key: 'treamDescription',
      align: 'center',
    },
    {
      title: '队伍人员',
      dataIndex: 'personNumber',
      key: 'personNumber',
      align: 'center',
      render: (val, row) => {
        return (
          <AuthSpan
            code={perosnListCode}
            className={styles.personNum}
            onClick={() => handlePesonListClick(row.id)}
          >
            {val}
          </AuthSpan>
        );
      },
    },
    {
      title: '操作',
      dataIndex: 'id',
      key: 'id',
      width: 180,
      align: 'center',
      fixed: 'right',
      render(id) {
        return (
          <Fragment>
            <AuthLink code={viewCode} to={`${ROUTER}/detail/${id}`} target="_blank">
              查看
            </AuthLink>
            <Divider type="vertical" />
            <AuthLink
              code={editCode}
              to={`${ROUTER}/edit/${id}`}
              target="_blank"
              style={{ marginLeft: 8 }}
            >
              编辑
            </AuthLink>
            <Divider type="vertical" />
            <AuthPopConfirm
              code={deleteCode}
              title="确定删除当前项目？"
              onConfirm={e => handleConfirmDelete(id)}
              okText="确定"
              cancelText="取消"
            >
              删除
            </AuthPopConfirm>
          </Fragment>
        );
      },
    },
  ];

  if (isCompanyUser(+unitType)) columns.shift();
  return columns;
}

export function handleDetails(values, deletedProps = ['companyName']) {
  const { companyId, companyName } = values;
  // console.log('values', values);

  return {
    ...values,
    companyId: { key: companyId, label: companyName },
  };
}

export const BREADCRUMBLISTPER = [
  // modify
  { title: '首页', name: '首页', href: '/' },
  { title: '应急管理', name: '应急管理' },
  { title: '应急队伍管理', name: '应急队伍管理', href: LIST_URL },
  { title: '队伍人员', name: '队伍人员' },
];

export function getPersonColumns(handleConfirmDelete, handleShowModal) {
  const columns = [
    {
      title: '人员工号',
      dataIndex: 'perCode',
      key: 'perCode',
      align: 'center',
    },
    {
      title: '人员名称',
      dataIndex: 'perName',
      key: 'perName',
      align: 'center',
    },
    {
      title: '人员性别',
      dataIndex: 'perSex',
      key: 'perSex',
      align: 'center',
      render: val => getSex[val],
    },
    {
      title: '手机号码',
      dataIndex: 'phone',
      key: 'phone',
      align: 'center',
    },
    {
      title: '职位',
      dataIndex: 'position',
      key: 'position',
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      render: (val, row) => {
        return (
          <Fragment>
            <AuthA
              code={editPerCode}
              onClick={() => handleShowModal('edit', row)}
              target="_blank"
              style={{ marginLeft: 8 }}
            >
              编辑
            </AuthA>
            <Divider type="vertical" />
            <AuthPopConfirm
              code={delPerCode}
              title="确定删除当前项目？"
              onConfirm={e => handleConfirmDelete(row.id)}
              okText="确定"
              cancelText="取消"
            >
              删除
            </AuthPopConfirm>
          </Fragment>
        );
      },
    },
  ];
  return columns;
}

export const EditModal = Form.create()(props => {
  const {
    form: { getFieldDecorator, validateFields, resetFields },
    id,
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
      const payload = {
        treamId: id,
        ...fieldsValue,
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

  return (
    <Modal title={modalTitle} visible={modalVisible} onCancel={handleClose} onOk={onConfirm}>
      <Form>
        <Form.Item {...formItemCol} label="人员工号:">
          {getFieldDecorator('perCode', {
            getValueFromEvent: e => e.target.value.trim(),
            initialValue: modalStatus === 'edit' ? detail.perCode : undefined,
            rules: [{ required: true, message: '请输入人员工号' }],
          })(<Input placeholder="请输入" />)}
        </Form.Item>
        <Form.Item {...formItemCol} label="人员名称:">
          {getFieldDecorator('perName', {
            getValueFromEvent: e => e.target.value.trim(),
            initialValue: modalStatus === 'edit' ? detail.perName : undefined,
            rules: [{ required: true, message: '请输入人员名称' }],
          })(<Input placeholder="请输入" />)}
        </Form.Item>
        <Form.Item {...formItemCol} label="人员性别：">
          {getFieldDecorator('perSex', {
            initialValue: modalStatus === 'edit' ? detail.perSex : undefined,
            rules: [{ required: true, message: '请选择人员性别' }],
          })(
            <Select placeholder="请选择" allowClear>
              {personSexList.map(({ key, value }) => (
                <Option key={key} value={key}>
                  {value}
                </Option>
              ))}
            </Select>
          )}
        </Form.Item>
        <Form.Item {...formItemCol} label="手机号码:">
          {getFieldDecorator('phone', {
            getValueFromEvent: e => e.target.value.trim(),
            initialValue: modalStatus === 'edit' ? detail.phone : undefined,
            rules: [
              { required: true, message: '请输入手机号码' },
              { pattern: phoneReg, message: '手机号码格式不正确' },
            ],
          })(<Input placeholder="请输入" />)}
        </Form.Item>
        <Form.Item {...formItemCol} label="职位:">
          {getFieldDecorator('position', {
            getValueFromEvent: e => e.target.value.trim(),
            initialValue: modalStatus === 'edit' ? detail.position : undefined,
            rules: [{ required: true, message: '请输入职位' }],
          })(<Input placeholder="请输入" />)}
        </Form.Item>
      </Form>
    </Modal>
  );
});
