import React, { useState, useEffect, useRef } from 'react';
import { Modal, Button, Select } from 'antd';
import Form from '@/jingan-components/Form';
import { EmptyText, Table } from '@/jingan-components/View';
import Ellipsis from '@/components/Ellipsis';
import { connect } from 'dva';
import isEqual from 'lodash/isEqual';
import styles from './index.less';

const COL = {
  xxl: 8,
  xl: 8,
  lg: 12,
  md: 12,
  sm: 24,
  xs: 24,
};
const PRESETS = {
  personListByCompany: {
    mapper: {
      namespace: 'common',
      list: 'personListByCompany',
      getList: 'getPersonListByCompany',
    },
    fieldNames: {
      key: 'id',
      value: 'userName',
    },
    fields: [
      {
        name: 'userName',
        label: '姓名',
        component: 'Input',
        props: {
          allowClear: true,
        },
        col: COL,
      },
      {
        name: 'departmentId',
        label: '所属部门',
        component: 'TreeSelect',
        props({ companyId }) {
          return {
            preset: 'departmentTreeByCompany',
            params: {
              companyId,
            },
            allowClear: true,
          };
        },
        col: COL,
      },
    ],
    columns: [
      {
        dataIndex: 'userName',
        title: '姓名',
        render: value => value || <EmptyText />,
      },
      {
        dataIndex: '工号',
        title: '工号',
        render: value => value || <EmptyText />,
      },
      {
        dataIndex: 'departmentName',
        title: '所属部门',
        render: value => value || <EmptyText />,
      },
      {
        dataIndex: '岗位',
        title: '岗位',
        render: value => value || <EmptyText />,
      },
    ],
    transform({ userName, departmentId }) {
      return {
        userName: userName && userName.trim(),
        departmentId,
      };
    },
    operationCol: COL,
  },
};

const SelectModalSelect = ({
  mode,
  value,
  onChange,
  list,
  loading,
  getList,
  fieldNames,
  fields,
  columns,
  multiple,
  separator = '、',
  title,
  operationCol,
  allowClear = false,
  params,
  transform,
  empty,
  ellipsis = true,
}) => {
  const { key: k, value: v } = fieldNames;
  const form = useRef(null);
  const [prevParams, setPrevParams] = useState(params);
  const [modal, setModal] = useState({
    visible: false,
    values: undefined,
    selectedRows: [],
  });
  const { visible, values, selectedRows } = modal;
  // 当params发生变化时，重置value
  useEffect(
    () => {
      if (!isEqual(params, prevParams)) {
        setPrevParams(params);
        if (value && (!multiple || value.length)) {
          onChange && onChange();
        }
      }
    },
    [params]
  );
  if (mode !== 'detail') {
    const onSearch = values => {
      setModal(modal => ({
        ...modal,
        values,
      }));
      getList && getList(transform(values));
    };
    return (
      <div className={styles.container}>
        <Select
          className={styles.select}
          placeholder="请选择"
          value={
            value
              ? multiple
                ? value.map(item => ({
                    key: item[k],
                    value: item[k],
                    label: item[v],
                  }))
                : {
                    key: value[k],
                    value: value[k],
                    label: value[v],
                  }
              : undefined
          }
          onChange={nextValue => {
            onChange &&
              onChange(
                nextValue && value.filter(item => nextValue.some(item2 => item[k] === item2.key))
              );
          }}
          mode={multiple ? 'multiple' : undefined}
          labelInValue
          allowClear={allowClear}
          open={false}
          showArrow={false}
          showSearch={false}
        />
        <Button
          className={styles.button}
          type="primary"
          onClick={() => {
            setModal({
              visible: true,
              values: undefined,
              selectedRows: value ? (multiple ? value : [value]) : [],
            });
            getList && getList();
          }}
        >
          选择
        </Button>
        <Modal
          title={title}
          visible={visible}
          onCancel={() =>
            setModal(modal => ({
              ...modal,
              visible: false,
            }))
          }
          width="60%"
          zIndex={1009}
          footer={null}
          destroyOnClose
        >
          <Form
            ref={form}
            fields={fields}
            onSearch={onSearch}
            onReset={onSearch}
            operation={[
              <Button
                type="primary"
                disabled={!selectedRows.length}
                onClick={() => {
                  onChange && onChange(multiple ? selectedRows : selectedRows[0]);
                  setModal(modal => ({
                    ...modal,
                    visible: false,
                  }));
                }}
              >
                选择
              </Button>,
            ]}
            params={params}
            showCard={false}
            expandable={false}
            operationCol={operationCol}
          />
          <Table
            columns={columns}
            rowKey={k}
            list={list}
            loading={loading}
            onChange={({ current, pageSize }) => {
              const {
                pagination: { pageSize: prevPageSize },
              } = list;
              getList &&
                getList({
                  pageNum: pageSize !== prevPageSize ? 1 : current,
                  pageSize,
                  ...transform(values || {}),
                });
              form.current.setFieldsValue(
                values ||
                  fields.reduce((result, { name }) => ({ ...result, [name]: undefined }), {})
              );
            }}
            rowSelection={{
              fixed: true,
              type: multiple ? 'checkbox' : 'radio',
              selectedRowKeys: selectedRows.map(item => item[k]),
              onSelect(record, selected) {
                setModal(modal => ({
                  ...modal,
                  selectedRows: multiple
                    ? selected
                      ? modal.selectedRows.concat(record)
                      : modal.selectedRows.filter(item => item[k] !== record[k])
                    : [record],
                }));
              },
              onSelectAll(selected, selectedRows, changeRows) {
                setModal(modal => ({
                  ...modal,
                  selectedRows: selected
                    ? modal.selectedRows
                        .filter(item => changeRows.every(record => item[k] !== record[k]))
                        .concat(changeRows)
                    : modal.selectedRows.filter(item =>
                        changeRows.every(record => item[k] !== record[k])
                      ),
                }));
              },
            }}
            showCard={false}
          />
        </Modal>
      </div>
    );
  } else {
    const label = value && (multiple ? value.map(item => item[v]).join(separator) : value[v]);
    return label ? (
      ellipsis ? (
        <Ellipsis lines={1} tooltip {...ellipsis}>
          {label}
        </Ellipsis>
      ) : (
        <span>{label}</span>
      )
    ) : empty === undefined ? (
      <EmptyText />
    ) : (
      empty
    );
  }
};

SelectModalSelect.getRules = ({ label, multiple }) => {
  return [
    {
      type: multiple ? 'array' : 'object',
      min: multiple ? 1 : undefined,
      required: true,
      message: `${label || ''}不能为空`,
    },
  ];
};

export default connect(
  state => state,
  null,
  (stateProps, { dispatch }, { mapper, preset, params, ...ownProps }) => {
    const { mapper: presetMapper, ...presetProps } = PRESETS[preset] || {};
    const { namespace, list, getList } = mapper || presetMapper || {};
    const valid = !params || Object.values(params).every(v => v);
    const type = `${namespace}/${getList}`;
    return {
      ...presetProps,
      ...ownProps,
      params,
      list: valid ? stateProps[namespace][list] : undefined,
      loading: stateProps.loading.effects[type] || false,
      getList: valid
        ? (payload, callback) => {
            dispatch({
              type,
              payload: {
                pageNum: 1,
                pageSize: 10,
                ...params,
                ...payload,
              },
              callback,
            });
          }
        : undefined,
    };
  },
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
        isEqual(props.params, nextProps.params)
      );
    },
  }
)(SelectModalSelect);
