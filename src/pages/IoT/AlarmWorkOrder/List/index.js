import React, { Component, Fragment } from 'react';
import { Input } from 'antd';
import SelectOrSpan from '@/jingan-components/SelectOrSpan';
import DatePickerOrSpan from '@/jingan-components/DatePickerOrSpan';
import MonitorTypeSelect from '@/jingan-components/MonitorTypeSelect';
import TablePage from '@/templates/TablePage';
import MajorHazardSelect from '../../components/MajorHazardSelect';
import MonitorObjectSelect from '../../components/MonitorObjectSelect';
import moment from 'moment';
import classNames from 'classnames';
import router from 'umi/router';
import styles from './index.less';

export const DEFAULT_FORMAT = 'YYYY-MM-DD HH:mm:ss';
export const STATUSES = [
  { key: '2', value: '待处理' },
  { key: '0', value: '处理中' },
  { key: '1', value: '已处理' },
];
const TRANSFORM = data => {
  const {
    range: [startTime, endTime] = [],
    majorHazard: [dangerSource, dangerSourceId] = [],
    monitorObject: [targetType, targetId] = [],
    status,
    ...rest
  } = data || {};
  return {
    ...rest,
    queryCreateStartDate: startTime && startTime.startOf('day').format(DEFAULT_FORMAT),
    queryCreateEndDate: endTime && endTime.endOf('day').format(DEFAULT_FORMAT),
    dangerSource,
    dangerSourceId: dangerSourceId && dangerSourceId.key,
    targetType,
    targetId: targetId && targetId.key,
    status: status && status.length > 0 ? status.join(',') : undefined,
  };
};

export default class AlarmWorkOrderList extends Component {
  getFields = ({ unitId }) => [
    ...(!unitId
      ? [
          {
            id: 'companyName',
            label: '单位名称',
            transform: value => value.trim(),
            render: ({ handleSearch }) => (
              <Input placeholder="请输入单位名称" onPressEnter={handleSearch} maxLength={50} />
            ),
          },
        ]
      : []),
    {
      id: 'reportType',
      label: '监测类型',
      render: () => <MonitorTypeSelect allowClear />,
    },
    {
      id: 'deviceName',
      label: '设备名称/主机编号',
      transform: value => value.trim(),
      render: ({ handleSearch }) => (
        <Input placeholder="请输入监测设备名称" onPressEnter={handleSearch} maxLength={50} />
      ),
    },
    {
      id: 'areaLocation',
      label: '报警区域位置',
      transform: value => value.trim(),
      render: ({ handleSearch }) => (
        <Input placeholder="请输入报警区域位置" onPressEnter={handleSearch} maxLength={50} />
      ),
    },
    {
      id: 'range',
      label: '工单创建时间',
      options: { initialValue: [] },
      // span: {
      //   xl: 16,
      //   sm: 24,
      //   xs: 24,
      // },
      render: () => (
        <DatePickerOrSpan
          placeholder={['开始时间', '结束时间']}
          allowClear
          type="RangePicker"
          style={{ width: '100%' }}
        />
      ),
    },
    {
      id: 'status',
      label: '处理状态',
      render: () => (
        <SelectOrSpan mode="multiple" placeholder="请选择处理状态" list={STATUSES} allowClear />
      ),
    },
    {
      id: 'majorHazard',
      label: '重大危险源',
      render: () => <MajorHazardSelect />,
    },
    {
      id: 'monitorObject',
      label: '监测对象',
      render: () => <MonitorObjectSelect />,
    },
  ];

  // getAction = ({
  //   renderExportButton,
  // }) => (
  //   <Fragment>
  //     {renderExportButton()}
  //   </Fragment>
  // )

  getColumns = ({
    unitId,
    list,
    renderDetailButton2,
    renderMonitorTrendButton,
    renderDetailButton3,
  }) => [
    ...(!unitId
      ? [
          {
            title: '单位名称',
            dataIndex: 'companyName',
            align: 'center',
          },
        ]
      : []),
    {
      title: '监测类型',
      dataIndex: 'reportTypeName',
      align: 'center',
    },
    {
      title: '监测对象类型',
      dataIndex: 'typeName',
      align: 'center',
    },
    {
      title: '监测对象',
      dataIndex: 'targetName',
      align: 'center',
    },
    {
      title: '设备',
      dataIndex: 'deviceName',
      render: (_, { reportType, deviceName, unitTypeName, loopNumber, partNumber }) => (
        <div className={styles.multiple}>
          {+reportType === 1 ? (
            <Fragment>
              <div className={styles.line}>
                消防主机编号：
                <span className={styles.value}>{deviceName}</span>
              </div>
              <div className={styles.line}>
                部件类型：
                <span className={styles.value}>{unitTypeName}</span>
              </div>
              <div className={styles.line}>
                回路号：
                <span className={styles.value}>{`${loopNumber ? `${loopNumber}回路` : ''}${
                  partNumber ? `${partNumber}号` : ''
                }`}</span>
              </div>
            </Fragment>
          ) : (
            <div className={styles.line}>
              监测设备名称：
              <span className={styles.value}>{deviceName}</span>
            </div>
          )}
        </div>
      ),
      align: 'center',
    },
    {
      title: '区域位置',
      dataIndex: 'areaLocation',
      align: 'center',
    },
    {
      title: '工单创建时间',
      dataIndex: 'createDate',
      render: time => time && moment(time).format(DEFAULT_FORMAT),
      align: 'center',
    },
    {
      title: '处理状态',
      dataIndex: 'status',
      render: value => <SelectOrSpan list={STATUSES} value={`${value}`} type="span" />,
      align: 'center',
    },
    {
      title: '工单结束时间',
      dataIndex: 'endDate',
      render: time => time && moment(time).format(DEFAULT_FORMAT),
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: 'id',
      width: 132,
      fixed: list && list.length ? 'right' : undefined,
      render: (id, { reportType, deviceId }) => (
        <Fragment>
          <div>{renderDetailButton2(id)}</div>
          {+reportType !== 1 && <div>{renderMonitorTrendButton(deviceId)}</div>}
        </Fragment>
      ),
      align: 'center',
    },
    {
      title: '消息通知',
      dataIndex: 'msgCount',
      width: 132,
      fixed: list && list.length ? 'right' : undefined,
      render: (value, data) => (
        <span>
          已发送
          {renderDetailButton3(data)}
        </span>
      ),
      align: 'center',
    },
  ];

  handleClick = ({
    target: {
      dataset: { id },
    },
  }) => {
    const {
      route: { path, name },
    } = this.props;
    router.push(path.replace(new RegExp(`${name}.*`), `detail/${id}`));
  };

  render() {
    const {
      location: { query },
    } = this.props;
    const props = {
      fields: this.getFields,
      action: this.getAction,
      columns: this.getColumns,
      transform: TRANSFORM,
      initialValues:
        query.monitorObjectType || query.isMajorHazard || query.status
          ? {
              monitorObject: [
                query.monitorObjectType || undefined,
                query.monitorObject && query.monitorObjectName
                  ? { key: query.monitorObject, label: query.monitorObjectName }
                  : undefined,
              ],
              majorHazard: [
                query.isMajorHazard || undefined,
                query.majorHazardId && query.majorHazardName
                  ? { key: query.majorHazardId, label: query.majorHazardName }
                  : undefined,
              ],
              status: query.status ? query.status.split(',') : undefined,
            }
          : null,
      otherOperation: [
        {
          code: 'detail',
          name: '查看详情',
        },
        {
          code: 'monitorTrend',
          name: '查看监测趋势',
        },
        {
          code: 'detail',
          name({ msgCount }) {
            return `${msgCount || 0}条`;
          },
          disabled({ msgCount }) {
            return !+msgCount;
          },
        },
      ],
      ...this.props,
    };

    return <TablePage {...props} />;
  }
}
