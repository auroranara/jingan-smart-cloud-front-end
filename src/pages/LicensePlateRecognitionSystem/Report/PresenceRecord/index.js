import React, { Component } from 'react';
import { Input } from 'antd';
import TablePage from '@/templates/TablePage';
import SelectOrSpan from '@/jingan-components/SelectOrSpan';
import DatePickerOrSpan from '@/jingan-components/DatePickerOrSpan';
import ImagePreview from '@/jingan-components/ImagePreview';
import Company from '../../Company';
import { connect } from 'dva';
import moment from 'moment';
import { VEHICLE_TYPES } from '../../VehicleManagement/List';
import { DIRECTIONS } from '../../ChannelManagement/List';
import styles from './index.less';

export const BREADCRUMB_LIST = [
  { title: '首页', name: '首页', href: '/' },
  { title: '人员在岗在位管理', name: '人员在岗在位管理' },
  { title: '车牌识别系统', name: '车牌识别系统' },
  { title: '报表查询', name: '报表查询' },
];
const DEFAULT_FORMAT = 'YYYY-MM-DD HH:mm:ss';
const MAPPER = {
  namespace: 'licensePlateRecognitionSystem',
  list: 'presenceRecordList',
  getList: 'getPresenceRecordList',
  exportList: 'exportPresenceRecordList',
};
const COMPANY_MAPPER = {
  namespace: 'licensePlateRecognitionSystem',
  list: 'companyList',
  getList: 'getCompanyList',
};

@connect(({ user }) => ({
  user,
}))
export default class PresenceRecord extends Component {
  state = {
    images: null,
  };

  empty = true;

  empty2 = true;

  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextProps.match.params.unitId !== this.props.match.params.unitId || nextState !== this.state
    );
  }

  getRangeFromEvent = range => {
    const empty = !(range && range.length);
    const result = this.empty && !empty ? [range[0].startOf('day'), range[1].endOf('day')] : range;
    this.empty = empty;
    return result;
  };

  getRangeFromEvent2 = range => {
    const empty = !(range && range.length);
    const result = this.empty2 && !empty ? [range[0].startOf('day'), range[1].endOf('day')] : range;
    this.empty2 = empty;
    return result;
  };

  transform = ({
    unitId,
    range: [inTimeStart, inTimeEnd] = [],
    range2: [outTimeStart, outTimeEnd] = [],
    ...props
  }) => ({
    companyId: unitId,
    inTimeStart: inTimeStart && inTimeStart.format(DEFAULT_FORMAT),
    inTimeEnd: inTimeEnd && inTimeEnd.format(DEFAULT_FORMAT),
    outTimeStart: outTimeStart && outTimeStart.format(DEFAULT_FORMAT),
    outTimeEnd: outTimeEnd && outTimeEnd.format(DEFAULT_FORMAT),
    ...props,
  });

  getBreadcrumbList = ({ isUnit }) =>
    BREADCRUMB_LIST.concat(
      [
        !isUnit && {
          title: '单位出入场记录',
          name: '单位出入场记录',
          href: this.props.route.path.replace(/\/:[^\/]*/g, ''),
        },
        { title: '出入场记录', name: '出入场记录' },
      ].filter(v => v)
    );

  getContent = ({ list: { pagination: { total } = {} } = {} }) => (
    <span>
      总数：
      {total || 0}
    </span>
  );

  getFields = () => [
    // {
    //   id: 'name',
    //   transform: v => v.trim(),
    //   render: ({ onSearch }) => (
    //     <Input placeholder="请输入所属单位" maxLength={50} onPressEnter={onSearch} />
    //   ),
    // },
    {
      label: '车牌号',
      id: 'carNumber',
      transform: v => v.trim(),
      render: ({ onSearch }) => (
        <Input placeholder="请输入车牌号" maxLength={50} onPressEnter={onSearch} />
      ),
    },
    {
      label: '车辆类型',
      id: 'carType',
      render: () => <SelectOrSpan placeholder="请选择车辆类型" list={VEHICLE_TYPES} allowClear />,
    },
    {
      label: '通道名称',
      id: 'queryGateName',
      transform: v => v.trim(),
      render: ({ onSearch }) => (
        <Input placeholder="请输入通道名称" maxLength={50} onPressEnter={onSearch} />
      ),
    },
    {
      label: '入场时间',
      id: 'range',
      render: () => (
        <DatePickerOrSpan
          placeholder={['开始时间', '结束时间']}
          format={DEFAULT_FORMAT}
          showTime
          allowClear
          type="RangePicker"
          style={{ width: '100%' }}
        />
      ),
      options: {
        initialValue: [],
        getValueFromEvent: this.getRangeFromEvent,
      },
    },
    {
      label: '出场时间',
      id: 'range2',
      render: () => (
        <DatePickerOrSpan
          placeholder={['开始时间', '结束时间']}
          format={DEFAULT_FORMAT}
          showTime
          allowClear
          type="RangePicker"
          style={{ width: '100%' }}
        />
      ),
      options: {
        initialValue: [],
        getValueFromEvent: this.getRangeFromEvent2,
      },
    },
  ];

  // getAction = ({ renderExportButton }) => renderExportButton({ name: '导出报表' });

  getColumns = () => [
    {
      title: '车牌号',
      dataIndex: 'carNumber',
      align: 'center',
    },
    {
      title: '车辆类型',
      dataIndex: 'carType',
      align: 'center',
      render: value => <SelectOrSpan list={VEHICLE_TYPES} value={`${value}`} type="span" />,
    },
    {
      title: '车场名称',
      dataIndex: 'parkName',
      align: 'center',
    },
    {
      title: '出入时间',
      dataIndex: '出入时间',
      align: 'center',
      render: (value, { inOutRecordList: [{ inTime }, { outTime }] }) => (
        <div className={styles.lineWrapper}>
          <div>{inTime ? moment(inTime).format(DEFAULT_FORMAT) : '——'}</div>
          <div>{outTime ? moment(outTime).format(DEFAULT_FORMAT) : '——'}</div>
        </div>
      ),
    },
    {
      title: '通道名称',
      dataIndex: '通道名称',
      align: 'center',
      render: (value, { inOutRecordList: [{ gateInName }, { gateOutName }] }) => (
        <div className={styles.lineWrapper}>
          <div>{gateInName || '——'}</div>
          <div>{gateOutName || '——'}</div>
        </div>
      ),
    },
    {
      title: '通道方向',
      dataIndex: '通道方向',
      align: 'center',
      render: (value, { inOutRecordList: [{ recordType: r1 }, { recordType: r2 }] }) => (
        <div className={styles.lineWrapper}>
          <div>
            {r1 >= 0 ? <SelectOrSpan list={DIRECTIONS} value={`${r1}`} type="span" /> : '——'}
          </div>
          <div>
            {r2 >= 0 ? <SelectOrSpan list={DIRECTIONS} value={`${r2}`} type="span" /> : '——'}
          </div>
        </div>
      ),
    },
    {
      title: '图片',
      dataIndex: '图片',
      align: 'center',
      render: (value, { inOutRecordList: [{ picInfoList: p1 }, { picInfoList: p2 }] }) => (
        <div className={styles.lineWrapper}>
          <div>
            {p1 && p1.length ? (
              <img
                className={styles.img}
                src={`${p1[0].webUrl}`}
                alt=""
                onClick={() =>
                  this.setState({ images: [`${p1[0].webUrl}`] })
                }
              />
            ) : (
              '——'
            )}
          </div>
          <div>
            {p2 && p2.length ? (
              <img
                className={styles.img}
                src={`${p2[0].webUrl}`}
                alt=""
                onClick={() =>
                  this.setState({ images: [`${p2[0].webUrl}`] })
                }
              />
            ) : (
              '——'
            )}
          </div>
        </div>
      ),
    },
  ];

  render() {
    const {
      user: { currentUser: { unitType } = {} },
      match: {
        params: { unitId },
      },
      route,
      location,
      match,
    } = this.props;
    const { images } = this.state;
    const props = {
      route,
      location,
      match,
    };

    return unitType === 4 || unitId ? (
      <TablePage
        key={unitId}
        breadcrumbList={this.getBreadcrumbList}
        content={this.getContent}
        fields={this.getFields}
        action={this.getAction}
        columns={this.getColumns}
        transform={this.transform}
        mapper={MAPPER}
        showTotal={false}
        withUnitId
        {...props}
      >
        <ImagePreview images={images} hidden />
      </TablePage>
    ) : (
      <Company
        breadcrumbList={BREADCRUMB_LIST.concat({
          title: '单位出入场记录',
          name: '单位出入场记录',
        })}
        addEnable={false}
        MAPPER={COMPANY_MAPPER}
        {...props}
      />
    );
  }
}
