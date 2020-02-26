import React, { Component } from 'react';
import { Input } from 'antd';
import TablePage from '@/templates/TablePage';
import SelectOrSpan from '@/jingan-components/SelectOrSpan';
import DatePickerOrSpan from '@/jingan-components/DatePickerOrSpan';
import ImagePreview from '@/jingan-components/ImagePreview';
import Company from '../../Company';
import { connect } from 'dva';
import moment from 'moment';
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
  list: 'abnormalRecordList',
  getList: 'getAbnormalRecordList',
  exportList: 'exportAbnormalRecordList',
};
const COMPANY_MAPPER = {
  namespace: 'licensePlateRecognitionSystem',
  list: 'companyList',
  getList: 'getCompanyList',
};

@connect(({ user }) => ({
  user,
}))
export default class AbnormalRecord extends Component {
  state = {
    images: null,
  };

  empty = true;

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

  transform = ({ unitId, range: [openTimeStart, openTimeEnd] = [], ...props }) => ({
    companyId: unitId,
    openTimeStart: openTimeStart && openTimeStart.format(DEFAULT_FORMAT),
    openTimeEnd: openTimeEnd && openTimeEnd.format(DEFAULT_FORMAT),
    ...props,
  });

  getBreadcrumbList = ({ isUnit }) =>
    BREADCRUMB_LIST.concat(
      [
        !isUnit && {
          title: '单位异常抬杆记录',
          name: '单位异常抬杆记录',
          href: this.props.route.path.replace(/\/:[^\/]*/g, ''),
        },
        { title: '异常抬杆记录', name: '异常抬杆记录' },
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
      id: 'parkName',
      transform: v => v.trim(),
      render: ({ onSearch }) => (
        <Input placeholder="请输入车场名称" maxLength={50} onPressEnter={onSearch} />
      ),
    },
    {
      id: 'gateName',
      transform: v => v.trim(),
      render: ({ onSearch }) => (
        <Input placeholder="请输入通道名称" maxLength={50} onPressEnter={onSearch} />
      ),
    },
    {
      id: 'ioState',
      render: () => <SelectOrSpan placeholder="请选择通道方向" list={DIRECTIONS} allowClear />,
    },
    {
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
        getValueFromEvent: this.getRangeFromEvent,
      },
    },
  ];

  // getAction = ({ renderExportButton }) => renderExportButton({ name: '导出报表' });

  getColumns = () => [
    {
      title: '车场名称',
      dataIndex: 'parkName',
      align: 'center',
    },
    {
      title: '通道名称',
      dataIndex: 'gateName',
      align: 'center',
    },
    {
      title: '通道方向',
      dataIndex: 'ioState',
      align: 'center',
      render: value => <SelectOrSpan list={DIRECTIONS} value={`${value}`} type="span" />,
    },
    {
      title: '开闸时间',
      dataIndex: 'openTime',
      align: 'center',
      render: value => value && moment(value).format(DEFAULT_FORMAT),
    },
    {
      title: '开闸原因',
      dataIndex: 'reason',
      align: 'center',
    },
    {
      title: '图片',
      dataIndex: '图片',
      align: 'center',
      render: (value, { picInfoList }) =>
        picInfoList && picInfoList.length ? (
          <img
            className={styles.img}
            src={`data:image/png;base64,${picInfoList[0].content}`}
            alt=""
            onClick={() =>
              this.setState({ images: [`data:image/png;base64,${picInfoList[0].content}`] })
            }
          />
        ) : (
          '——'
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
        mapper={MAPPER}
        showTotal={false}
        withUnitId
        {...props}
      >
        <ImagePreview images={images} />
      </TablePage>
    ) : (
      <Company
        breadcrumbList={BREADCRUMB_LIST.concat({
          title: '单位异常抬杆记录',
          name: '单位异常抬杆记录',
        })}
        addEnable={false}
        mapper={COMPANY_MAPPER}
        {...props}
      />
    );
  }
}
