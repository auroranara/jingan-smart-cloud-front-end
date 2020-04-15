import React, { useState, useRef } from 'react';
import { Modal, Button } from 'antd';
import Form, { Input } from '@/jingan-components/Form';
import { Table } from '@/jingan-components/View';
import { connect } from 'dva';
import { getModalPageSize, setModalPageSize } from '@/utils/utils';
import styles from './index.less';

const API = 'common/getPersonList';
const DEPARTMENT_FIELDNAMES = { key: 'id', value: 'name' };
const DEPARTMENT_MAPPER = {
  namespace: 'common',
  list: 'departmentList',
  getList: 'getDepartmentList',
};

const PersonModal = ({
  value,
  onChange,
  companyId,
  data: initialData,
  list,
  getList,
  labelInValue,
  multiple,
  placeholder = '请选择',
  disabled,
  separator = ',',
  empty,
  ellipsis,
  mode,
  title = '选择人员',
}) => {
  const [data, setData] = useState(initialData);
  const [modal, setModal] = useState({
    visible: false,
    initialValues: undefined,
    values: undefined,
    selectedList: [],
  });
  const form = useRef(null);
  const columns = [
    {
      dataIndex: 'username',
      title: '姓名',
    },
    {
      dataIndex: '工号',
      title: '工号',
    },
    {
      dataIndex: 'departmentName',
      title: '所属部门',
    },
    {
      dataIndex: '岗位',
      title: '岗位',
    },
  ];
  const fields = [
    {
      fields: [
        {
          name: 'username',
          label: '姓名',
          component: 'Input',
        },
        {
          name: 'includeChildDepartmentId',
          label: '所属部门',
          component: 'TreeSelect',
          props: {
            fieldNames: DEPARTMENT_FIELDNAMES,
            mapper: DEPARTMENT_MAPPER,
            params: {
              companyId,
            },
            allowClear: true,
            key: companyId,
          },
        },
      ],
      bordered: false,
      bodyStyle: {
        padding: 0,
      },
    },
  ];
  const values = labelInValue ? value : data;
  const label =
    values && (multiple ? values.map(({ label }) => label).join(separator) : values.label);
  return (
    <div>
      <Input
        className={styles.input}
        placeholder={placeholder}
        disabled={disabled}
        value={label}
        empty={empty}
        ellipsis={ellipsis}
        addonAfter={
          <Button
            className={styles.button}
            type="primary"
            onClick={() => {
              setModal(modal => ({
                ...modal,
                visible: true,
                values: undefined,
                initialValues: {},
              }));
              if (companyId) {
                getList();
              }
            }}
          >
            选择
          </Button>
        }
        allowClear
        mode={mode}
      />
      <Modal
        title={title}
        visible={modal.visible}
        footer={null}
        onCancel={() => {
          setModal(modal => ({
            ...modal,
            visible: false,
          }));
        }}
        zIndex={1009}
        width="60%"
      >
        <Form
          ref={form}
          className={styles.form}
          initialValues={modal.initialValues}
          fields={fields}
          onSearch={values => {
            setModal(modal => ({
              ...modal,
              values,
            }));
            const { username, includeChildDepartmentId } = values;
            getList({
              username: username && username.trim(),
              includeChildDepartmentId,
            });
          }}
          onReset={() => {
            setModal(modal => ({
              ...modal,
              values: undefined,
            }));
            getList();
          }}
          operation={[
            <Button
              type="primary"
              disabled={!modal.selectedList.length}
              onClick={() => {
                const value = modal.selectedList.map(({ id, username }) => ({
                  key: id,
                  value: id,
                  label: username,
                }));
                if (labelInValue) {
                  onChange && onChange(multiple ? value : value[0]);
                } else {
                  setData(multiple ? value : value[0]);
                  onChange && onChange(multiple ? value.map(({ key }) => key) : value[0].key);
                }
              }}
            >
              选择
            </Button>,
          ]}
        />
        <Table
          showCard={false}
          showAddButton={false}
          list={companyId ? list : undefined}
          columns={columns}
          bordered
          onChange={({ current, pageSize }) => {
            const {
              pagination: { pageSize: prevPageSize },
            } = list;
            const { username, includeChildDepartmentId } = modal.values || {};
            getList({
              username: username && username.trim(),
              includeChildDepartmentId,
              pageNum: pageSize !== prevPageSize ? 1 : current,
              pageSize,
            });
            modal.values ? form.current.setFieldsValue(modal.values) : form.current.resetFields();
            pageSize !== prevPageSize && setModalPageSize(pageSize);
          }}
        />
      </Modal>
    </div>
  );
};

PersonModal.getRules = ({ label, labelInValue, multiple }) => {
  return [
    {
      type: multiple ? 'array' : labelInValue ? 'object' : 'string',
      min: multiple ? 1 : undefined,
      required: true,
      message: `${label || ''}不能为空`,
    },
  ];
};

export default connect(
  ({
    common: { personList: list },
    loading: {
      effects: { [API]: loading },
    },
  }) => {
    return {
      list,
      loading,
    };
  },
  (dispatch, { companyId }) => ({
    getList(payload, callback) {
      dispatch({
        type: API,
        payload: {
          pageNum: 1,
          pageSize: getModalPageSize(),
          companyId,
          ...payload,
        },
        callback,
      });
    },
  }),
  (stateProps, dispatchProps, ownProps) => ({
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
  }),
  {
    areStatesEqual: () => false,
    areOwnPropsEqual: () => false,
    areStatePropsEqual: () => false,
    areMergedPropsEqual: (props, nextProps) => {
      return (
        props.value === nextProps.value &&
        props.list === nextProps.list &&
        props.loading === nextProps.loading &&
        props.mode === nextProps.mode &&
        props.companyId === nextProps.companyId
      );
    },
  }
)(PersonModal);
