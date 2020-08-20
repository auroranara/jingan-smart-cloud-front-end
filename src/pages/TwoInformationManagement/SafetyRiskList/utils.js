import React from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
// import moment from 'moment';
import { Input, Modal, Table } from 'antd';
import Ellipsis from '@/components/Ellipsis';
import moment from 'moment';
import { lecSettings } from '@/pages/RiskControl/SafetyChecklist/config.js';

export const PAGE_SIZE = 1;
export const ROUTER = '/two-information-management'; // modify
export const LIST_URL = `${ROUTER}/safety-risk-list/list`;

const WIDTH = 60;
const { riskLevelList } = lecSettings;

export const LIST = [
  // modify
  {
    companyName: '无锡晶安智慧科技有限公司',
    id: '1',
    riskPointName: '预防事故设施',
    area: '场所/环节/部位',
    dangerFactor: '危险因素',
    result: '后果',
  },
];

export const BREADCRUMBLIST = [
  // modify
  { title: '首页', name: '首页', href: '/' },
  { title: '两单信息管理', name: '两单信息管理' },
  { title: '安全风险分级管控清单', name: '安全风险分级管控清单', href: LIST_URL },
];

// const dangerLevelList = [
//   {
//     key: '1',
//     value: '红',
//   },
//   {
//     key: '2',
//     value: '橙',
//   },
//   {
//     key: '3',
//     value: '黄',
//   },
//   {
//     key: '4',
//     value: '蓝',
//   },
// ];

export const TABLE_COLUMNS = [
  {
    title: '单位名称',
    dataIndex: 'companyName',
    key: 'companyName',
    align: 'center',
    width: 200,
    render: value => (<Ellipsis tooltip lines={1}>{value}</Ellipsis>),
  },
  {
    title: '区域名称',
    dataIndex: 'areaName',
    key: 'areaName',
    align: 'center',
    width: 150,
  },
  {
    title: '风险点',
    key: 'riskPoint',
    align: 'left',
    width: 200,
    render: (val, { objectTitle, itemCode, riskPointType }) => (
      <div>
        <p>名称：{objectTitle}</p>
        <p>编号：{itemCode}</p>
        <p>类型：{(+riskPointType === 1 && '设备设施') || (+riskPointType === 2 && '作业活动') || ''}</p>
      </div>
    ),
  },
  {
    title: '主要危险因素（人、物、作业环境、管理）',
    dataIndex: 'dangerFactor',
    key: 'dangerFactor',
    align: 'center',
    width: 200,
    render: value => (<Ellipsis tooltip lines={1}>{value}</Ellipsis>),
  },
  {
    title: '可能发生的事故类型及后果',
    dataIndex: 'consequenceName',
    key: 'consequenceName',
    align: 'center',
    width: 150,
  },
  {
    title: '风险等级',
    dataIndex: 'dangerLevel',
    key: 'dangerLevel',
    align: 'center',
    width: 160,
    render: (val) => {
      const target = riskLevelList.find(item => item.level === val);
      return target ? (
        <span style={{ color: target.color }}>{target.colorName.slice(0, 1)}</span>
      ) : '';
    },
  },
  {
    title: '辨识分级时间',
    dataIndex: 'checkDate',
    key: 'checkDate',
    align: 'center',
    width: 150,
    render: val => val ? moment(val).format('YYYY-MM-DD') : '',
  },
  {
    title: '风险管控措施',
    dataIndex: 'dangerMeasure',
    key: 'dangerMeasure',
    align: 'center',
    width: 150,
    render: value => (<Ellipsis tooltip lines={1}>{value}</Ellipsis>),
  },
  {
    title: '管控层级',
    dataIndex: 'controlHierarchy',
    key: 'controlHierarchy',
    align: 'center',
    width: 150,
    render: (val) => (riskLevelList.find(item => item.level === val) || {}).controllevel,
  },
  {
    title: '管控责任人',
    dataIndex: 'principalName',
    key: 'principalName',
    align: 'center',
    width: 150,
    render: val => Array.isArray(val) ? val.join('，') : val,
  },
  // {
  //   title: '风险分区',
  //   dataIndex: 'zoneName',
  //   key: 'zoneName',
  //   align: 'center',
  // },
  // {
  //   title: '经办人',
  //   dataIndex: 'zoneChargerName',
  //   key: 'zoneChargerName',
  //   align: 'center',
  //   render: val => (
  //     <Ellipsis tooltip length={40} style={{ overflow: 'visible' }}>
  //       {val}
  //     </Ellipsis>
  //   ),
  // },
  // {
  //   title: '电话',
  //   dataIndex: 'phoneNumber',
  //   key: 'phoneNumber',
  //   align: 'center',
  // },
];

const columnsDetail = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    align: 'center',
    width: 80,
  },
  {
    title: '风险点',
    dataIndex: 'name',
    key: 'name',
    align: 'center',
  },
  {
    title: '所在位置',
    dataIndex: 'space',
    key: 'space',
    align: 'center',
  },
  {
    title: '存在的主要危险（有害）因素',
    dataIndex: 'dangerFactor',
    key: 'dangerFactor',
    align: 'center',
  },
  {
    title: '可能导致事故类别',
    dataIndex: 'consequence',
    key: 'consequence',
    align: 'center',
  },
  {
    title: 'L',
    dataIndex: 'l',
    key: 'l',
    align: 'center',
    width: WIDTH,
  },
  {
    title: 'E',
    dataIndex: 'e',
    key: 'e',
    align: 'center',
    width: WIDTH,
  },
  {
    title: 'C',
    dataIndex: 'c',
    key: 'c',
    align: 'center',
    width: WIDTH,
  },
  {
    title: 'D',
    dataIndex: 'd',
    key: 'd',
    align: 'center',
    width: WIDTH,
  },
  {
    title: '风险等级/风险色度',
    dataIndex: 'dangerLevel',
    key: 'dangerLevel',
    align: 'center',
  },
  {
    title: '辨识分级时间',
    dataIndex: 'checkDate',
    key: 'checkDate',
    align: 'center',
    render: val => <span>{val === null ? '' : moment(+val).format('YYYY年MM月DD日')}</span>,
  },
  {
    title: '采取的主要管控措施',
    dataIndex: 'dangerMeasure',
    key: 'dangerMeasure',
    align: 'center',
    render: val => (
      <Ellipsis tooltip length={40} style={{ overflow: 'visible' }}>
        {val}
      </Ellipsis>
    ),
  },
  {
    title: '责任部门',
    dataIndex: 'department',
    key: 'department',
    align: 'center',
  },
  {
    title: '责任人',
    dataIndex: 'principal',
    key: 'principal ',
    align: 'center',
  },
];

export const DetailModal = Form.create()(props => {
  const {
    detailVisible,
    currentPage,
    modalTitle,
    list = [],
    pagination: { pageNum, pageSize, total },
    handleDetailClose,
    handleTableData,
    handleDetailPageChange,
  } = props;

  const indexBase = (currentPage - 1) * 10;

  return (
    <Modal
      width={1000}
      title={modalTitle}
      visible={detailVisible}
      footer={null}
      onCancel={handleDetailClose}
    >
      {list.length > 0 ? (
        <Table
          bordered
          rowKey="id"
          dataSource={handleTableData(list, indexBase)}
          scroll={{ x: 2000 }}
          columns={columnsDetail}
          pagination={{
            current: pageNum,
            pageSize,
            total,
            showQuickJumper: true,
            showSizeChanger: true,
            // pageSizeOptions: ['5', '10', '15', '20'],
            onChange: handleDetailPageChange,
            onShowSizeChange: (num, size) => {
              handleDetailPageChange(1, size);
            },
          }}
        />
      ) : (
          <div style={{ textAlign: 'center' }}>暂无数据</div>
        )}
    </Modal>
  );
});

export const EDIT_FORMITEMS = [
  // modify
  { name: 'companyName', label: '单位名称', required: false },
  {
    name: 'name',
    label: '作业/设备名称',
    required: false,
  },
  { name: 'riskClassifyName', label: '风险分类', required: false },
  { name: 'dangerFactor', label: '主要危险因素', type: 'text', required: false },
  { name: 'consequenceName', label: '易导致后果（风险）', type: 'text', required: false },
  { name: 'l', label: '时间发生的可能性（L)', required: false },
  { name: 'e', label: ' 频繁程度（E)', required: false },
  { name: 'c', label: '后果（C)', required: false },
  { name: 'd', label: '计算风险值（D)', required: false },
  { name: 'dangerLevelName', label: '风险等级', required: false },
  { name: 'dangerMeasure', label: '风险管控措施', type: 'text' },
  { name: 'consequenceMeasure', label: '应急处置措施', type: 'text', required: false },
];
