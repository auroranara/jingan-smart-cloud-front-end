import React from 'react';
// import Link from 'umi/link';
import Ellipsis from '@/components/Ellipsis';
import moment from 'moment';
import { Input, Form, Modal, Table } from 'antd';

export const PAGE_SIZE = 1;
export const ROUTER = '/two-information-management'; // modify
export const LIST_URL = `${ROUTER}/danger-factors-list/list`;

export const BREADCRUMBLIST = [
  // modify
  { title: '首页', name: '首页', href: '/' },
  { title: '两单信息管理', name: '两单信息管理' },
  { title: '危险（有害）因素排查辨识清单', name: '危险（有害）因素排查辨识清单', href: LIST_URL },
];

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
  // modify
  {
    title: '单位名称',
    dataIndex: 'companyName',
    key: 'companyName',
    align: 'center',
  },
  {
    title: '风险分区',
    dataIndex: 'zoneName',
    key: 'zoneName',
    align: 'center',
  },
  {
    title: '负责人',
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
    title: '时间',
    dataIndex: 'createTime',
    key: 'createTime',
    align: 'center',
    render: val => <span>{moment(+val).format('YYYY年MM月DD日')}</span>,
  },
];

const columnsDetail = [
  {
    title: '风险点名称',
    dataIndex: 'name',
    key: 'name',
    align: 'center',
    width: 160,
  },
  {
    title: '所在位置',
    dataIndex: 'space',
    key: 'space',
    align: 'center',
    width: 160,
  },
  {
    title: '存在的主要危险（有害）因素',
    dataIndex: 'dangerFactor',
    key: 'dangerFactor',
    align: 'center',
    width: 300,
    render: val => (
      <Ellipsis tooltip length={35} style={{ overflow: 'visible' }}>
        {val}
      </Ellipsis>
    ),
  },
  {
    title: '易发生的事故类型',
    dataIndex: 'consequence',
    key: 'consequence',
    align: 'center',
    width: 340,
    render: val => (
      <Ellipsis tooltip length={40} style={{ overflow: 'visible' }}>
        {val}
      </Ellipsis>
    ),
  },
  {
    title: '排查人员',
    dataIndex: 'checkPerson',
    key: 'checkPerson',
    align: 'center',
    width: 340,
  },
  {
    title: '负责人',
    dataIndex: 'principal',
    key: 'principal ',
    align: 'center',
    width: 340,
    render: val => (
      <Ellipsis tooltip length={40} style={{ overflow: 'visible' }}>
        {val}
      </Ellipsis>
    ),
  },
  {
    title: '时间',
    dataIndex: 'checkDate',
    key: 'checkDate',
    align: 'center',
    width: 340,
    render: val => <span>{moment(+val).format('YYYY年MM月DD日')}</span>,
  },
];
export const DetailModal = Form.create()(props => {
  const {
    detailVisible,
    currentPage,
    modalTitle,
    pagination: { pageNum, pageSize, total },
    list = [],
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
      ) : (
        <div style={{ textAlign: 'center' }}>暂无数据</div>
      )}
    </Modal>
  );
});

export const EDIT_FORMITEMS_COMPANY = [{ name: 'companyName', label: '单位名称', required: false }];

export const EDIT_FORMITEMS = [
  // modify
  { name: 'name', label: '风险点名称', required: false },
  { name: 'space', label: '场所/环节/部位', required: false },
  { name: 'dangerFactor', label: '主要危险因素', type: 'text', required: false },
  { name: 'consequenceName', label: '易导致后果（风险）', type: 'text', required: false },
];
