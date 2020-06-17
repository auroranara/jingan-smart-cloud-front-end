import React, { useState, useEffect, useRef, Fragment } from 'react';
import { Badge } from 'antd';
import Form from '@/jingan-components/Form';
import { Table, EmptyText } from '@/jingan-components/View';
import { connect } from 'dva';
import moment from 'moment';
import { isEqual } from 'lodash';
import { STATUSES, STATUS_MAPPER } from '@/pages/IoT/AlarmMessage';
import { getPageSize, setPageSize, isNumber, toFixed } from '@/utils/utils';
import styles from './index.less';

const API = 'gasMonitor/getHistoryList';
const API2 = 'gasMonitor/exportData';
const TRANSFORM = ({
  status,
  beMonitorTargetType,
  beMonitorTargetId,
  monitorEquipmentId,
} = {}) => ({
  ...STATUS_MAPPER[status],
  beMonitorTargetType,
  beMonitorTargetId,
  monitorEquipmentId,
});

export default connect(
  ({
    gasMonitor: { historyList: list },
    loading: {
      effects: { [API]: loading, [API2]: exporting },
    },
  }) => ({
    list,
    loading,
    exporting,
  }),
  (dispatch, { params }) => ({
    getList(payload, callback) {
      dispatch({
        type: API,
        payload: {
          pageNum: 1,
          pageSize: getPageSize(),
          statusType: -1,
          ...params,
          ...payload,
        },
        callback,
      });
    },
    exportData(payload, callback, fileName) {
      dispatch({
        type: API2,
        payload: {
          statusType: -1,
          ...params,
          ...payload,
        },
        callback,
        fileName,
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
        props.list === nextProps.list &&
        props.loading === nextProps.loading &&
        props.exporting === nextProps.exporting &&
        isEqual(props.params, nextProps.params)
      );
    },
  }
)(({ list, loading, getList, exporting, exportData, params, monitorTypeName }) => {
  const form = useRef(null);
  const [prevParams, setPrevParams] = useState(undefined);
  const [values, setValues] = useState(undefined);
  useEffect(
    () => {
      if (!isEqual(params, prevParams)) {
        setPrevParams(params);
        getList(TRANSFORM(values));
      }
    },
    [params]
  );
  const isSmoke = params && params.monitorEquipmentTypes === '413';
  const columns = [
    {
      title: '监测对象类型',
      dataIndex: 'beMonitorTargetTypeName',
      render: value => value || <EmptyText />,
    },
    {
      title: '监测对象名称',
      dataIndex: 'beMonitorTargetName',
      render: value => value || <EmptyText />,
    },
    {
      title: '监测设备名称',
      dataIndex: 'monitorEquipmentName',
      render: value => value || <EmptyText />,
    },
    {
      title: '监测设备位置',
      dataIndex: 'monitorEquipmentAreaLocation',
      render: value => value || <EmptyText />,
    },
    {
      title: '监测参数',
      dataIndex: 'paramDesc',
      render: value => value || <EmptyText />,
    },
    {
      title: '监测数值',
      dataIndex: 'monitorValue',
      render: (value, { fixType, paramUnit, statusType }) =>
        isNumber(value) ? (
          <Badge
            status={+statusType === -1 ? 'error' : 'success'}
            text={
              fixType !== 5 ? `${value}${paramUnit || ''}` : +statusType === -1 ? '火警' : '正常'
            }
          />
        ) : (
          <EmptyText />
        ),
    },
    {
      title: '报警原因',
      dataIndex: 'alarm',
      render: (
        _,
        { fixType, paramUnit, condition, warnLevel, limitValue, monitorValue, statusType }
      ) =>
        +statusType === -1 && +fixType !== 5 ? (
          `${condition === '>=' ? '超过' : '低于'}${+warnLevel === 1 ? '预警' : '告警'}值${toFixed(
            Math.abs(limitValue - monitorValue)
          )}${paramUnit}（${+warnLevel === 1 ? '预警' : '告警'}${
            condition === '>=' ? '上限' : '下限'
          }为${limitValue}${paramUnit}）`
        ) : (
          <EmptyText />
        ),
    },
    {
      title: '发生时间',
      dataIndex: 'happenTime',
      render: time => (time ? moment(time).format('YYYY-MM-DD HH:mm:ss') : <EmptyText />),
    },
  ];
  const fields = [
    ...(!isSmoke
      ? [
          {
            name: 'status',
            label: '异常状态等级',
            component: 'Select',
            props: {
              list: STATUSES.slice(0, 2),
              allowClear: true,
            },
          },
        ]
      : []),
    {
      name: 'beMonitorTargetType',
      label: '监测对象类型',
      component: 'Select',
      props: {
        mapper: {
          namespace: 'gasMonitor',
          list: 'monitorObjectTypeList',
          getList: 'getMonitorObjectTypeList',
        },
        fieldNames: {
          key: 'id',
          value: 'name',
        },
        params: {
          monitorEquipmentTypes: params && params.monitorEquipmentTypes,
        },
        allowClear: true,
      },
      onChange() {
        return {
          beMonitorTargetId: undefined,
          monitorEquipmentId: undefined,
        };
      },
    },
    {
      name: 'beMonitorTargetId',
      label: '监测对象',
      component: 'Select',
      dependencies: ['beMonitorTargetType'],
      props({ beMonitorTargetType }) {
        return {
          mapper: {
            namespace: 'gasMonitor',
            list: 'monitorObjectList',
            getList: 'getMonitorObjectList',
          },
          fieldNames: {
            key: 'id',
            value: 'name',
          },
          params: {
            type: beMonitorTargetType,
            companyId: beMonitorTargetType && params && params.companyId,
          },
          allowClear: true,
        };
      },
      onChange() {
        return {
          monitorEquipmentId: undefined,
        };
      },
    },
    {
      name: 'monitorEquipmentId',
      label: '监测设备',
      component: 'Select',
      dependencies: ['beMonitorTargetId'],
      props({ beMonitorTargetId }) {
        return {
          mapper: {
            namespace: 'gasMonitor',
            list: 'monitorPointList',
            getList: 'getMonitorPointList',
          },
          fieldNames: {
            key: 'id',
            value: 'name',
          },
          params: {
            targetId: beMonitorTargetId,
          },
          allowClear: true,
        };
      },
    },
  ];
  return (
    <Fragment>
      <div className={styles.formWrapper}>
        <Form
          ref={form}
          fields={fields}
          onSearch={values => {
            const { pagination: { pageSize = getPageSize() } = {} } = list || {};
            setValues(values);
            getList({
              ...TRANSFORM(values),
              pageSize,
            });
          }}
          onReset={values => {
            const { pagination: { pageSize = getPageSize() } = {} } = list || {};
            setValues(values);
            getList({
              ...TRANSFORM(values),
              pageSize,
            });
          }}
          showCard={false}
        />
      </div>
      <Table
        list={list}
        loading={loading || exporting || false}
        columns={columns}
        onChange={({ current, pageSize }) => {
          const { pagination: { pageSize: prevPageSize } = {} } = list || {};
          getList({
            ...TRANSFORM(values),
            pageNum: pageSize !== prevPageSize ? 1 : current,
            pageSize,
          });
          values ? form.current.setFieldsValue(values) : form.current.resetFields();
          pageSize !== prevPageSize && setPageSize(pageSize);
        }}
        onReload={() => {
          const { pagination: { pageNum = 1, pageSize = getPageSize() } = {} } = list || {};
          getList({
            ...TRANSFORM(values),
            pageNum,
            pageSize,
          });
          values ? form.current.setFieldsValue(values) : form.current.resetFields();
        }}
        onExport={(key, selectedRowKeys) => {
          if (key === '1') {
            exportData(
              {
                ...TRANSFORM(values),
                ids: selectedRowKeys.join(','),
              },
              undefined,
              monitorTypeName
            );
          } else if (key === '2') {
            exportData(TRANSFORM(values), undefined, monitorTypeName);
          } else if (key === '3') {
            exportData(undefined, undefined, monitorTypeName);
          }
          values ? form.current.setFieldsValue(values) : form.current.resetFields();
        }}
        showAddButton={false}
        showExportButton
        hasExportAuthority
        showCard={{
          bordered: false,
        }}
      />
    </Fragment>
  );
});
