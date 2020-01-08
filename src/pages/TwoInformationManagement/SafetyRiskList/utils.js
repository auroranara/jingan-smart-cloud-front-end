import React from 'react';
// import moment from 'moment';
import { Input, Form, Modal, Table } from 'antd';
import Ellipsis from '@/components/Ellipsis';
import moment from 'moment';

export const PAGE_SIZE = 1;
export const ROUTER = '/two-information-management'; // modify
export const LIST_URL = `${ROUTER}/safety-risk-list/list`;

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

export const SEARCH_FIELDS = [
  {
    id: 'companyName',
    label: '单位名称：',
    render: () => <Input placeholder="请输入" allowClear />,
    transform: v => v.trim(),
  },
  {
    id: 'zoneName',
    label: '风险分区',
    render: () => <Input placeholder="请输入" allowClear />,
  },
];

export const TABLE_COLUMNS = [
  {
    title: '单位名称',
    dataIndex: 'companyName',
    key: 'companyName',
    align: 'center',
    render: val => (
      <Ellipsis tooltip length={15} style={{ overflow: 'visible' }}>
        {val}
      </Ellipsis>
    ),
  },
  {
    title: '风险分区',
    dataIndex: 'zoneName',
    key: 'zoneName',
    align: 'center',
  },
  {
    title: '经办人',
    dataIndex: 'zoneChargerName',
    key: 'zoneChargerName',
    align: 'center',
    render: val => (
      <Ellipsis tooltip length={40} style={{ overflow: 'visible' }}>
        {val}
      </Ellipsis>
    ),
  },
  {
    title: '上传时间',
    dataIndex: 'createTime',
    key: 'createTime',
    align: 'center',
    render: val => <span>{moment(+val).format('YYYY年MM月DD日')}</span>,
  },
];

const columnsDetail = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    align: 'center',
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
    title: 'L',
    dataIndex: 'l',
    key: 'l',
    align: 'center',
  },
  {
    title: 'E',
    dataIndex: 'e',
    key: 'e',
    align: 'center',
  },
  {
    title: 'C',
    dataIndex: 'c',
    key: 'c',
    align: 'center',
  },
  {
    title: 'D',
    dataIndex: 'd',
    key: 'd',
    align: 'center',
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
    render: val => <span>{moment(+val).format('YYYY年MM月DD日')}</span>,
  },
  {
    title: '采取的主要管控措施',
    dataIndex: 'dangerMeasure',
    key: 'dangerMeasure',
    align: 'center',
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
      width={1200}
      title={modalTitle}
      visible={detailVisible}
      footer={null}
      onCancel={handleDetailClose}
    >
      <Table
        bordered
        rowKey="id"
        dataSource={handleTableData(list, indexBase)}
        scroll={{ x: 'max-content' }}
        columns={columnsDetail}
        pagination={{
          current: pageNum,
          pageSize,
          total,
          showQuickJumper: true,
          showSizeChanger: true,
          pageSizeOptions: ['5', '10', '15', '20'],
          onChange: handleDetailPageChange,
          onShowSizeChange: (num, size) => {
            handleDetailPageChange(1, size);
          },
        }}
      />
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
