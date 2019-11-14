import React, { Fragment } from 'react';
import Link from 'umi/link';
import moment from 'moment';
import {
  DatePicker,
  Input,
  message,
  Popconfirm,
  Select,
  Divider,
  Upload,
  Button,
  Icon,
} from 'antd';

import styles1 from '@/pages/SafetyKnowledgeBase/MSDS/MList.less';
import styles from './styles.less';

const { Option } = Select;

const DATE_FORMAT = 'YYYY-MM-DD';
export const PAGE_SIZE = 10;
export const ROUTER = '/emergency-management/emergency-process'; // modify
export const LIST_URL = `${ROUTER}/list`;
export const LIST = [
  // modify
  {
    id: '1',
    companyName: '无锡晶安智慧科技有限公司',
    projectName: '火灾应急演练方案',
    drillName: '火灾应急演练',
    drillType: '火灾事故演练>>一般民用建筑火灾演练',
    drillTime: [moment(1552924800000), moment(1572417056000)],
    drillLocation: '新吴区汉江路5号',
    accidentName: '火灾',
    accidentType: '火灾事故',
    drillOrgnization: '新吴区交警大队',
    drillMan: '张三，李四',
    fileList: [],
  },
];

export const BREADCRUMBLIST = [
  // modify
  { title: '首页', name: '首页', href: '/' },
  { title: '应急管理', name: '应急管理' },
  { title: '应急演练过程', name: '应急演练过程', href: LIST_URL },
];

export const SEARCH_FIELDS = [
  // modify
  {
    id: 'id1',
    label: '方案名称：',
    render: () => <Input placeholder="请输入" allowClear />,
    transform: v => v.trim(),
  },
  {
    id: 'id2',
    label: '演练类型：',
    render: () => (
      <Select placeholder="请选择" allowClear>
        {[].map((r, i) => (
          <Option key={i}>{r}</Option>
        ))}
      </Select>
    ),
  },
  {
    id: 'code',
    label: '事故名称：',
    render: () => <Input placeholder="请输入" allowClear />,
    transform: v => v.trim(),
  },
  {
    id: 'companyName',
    label: '单位名称：',
    render: () => <Input placeholder="请输入" allowClear />,
    transform: v => v.trim(),
  },
  {
    id: 'id3',
    label: '模拟事故类型：',
    render: () => (
      <Select placeholder="请选择" allowClear>
        {[].map((r, i) => (
          <Option key={i}>{r}</Option>
        ))}
      </Select>
    ),
  },
];

export const TABLE_COLUMNS = [
  // modify
  {
    title: '单位名称',
    dataIndex: 'companyName',
    key: 'companyName',
  },
  {
    title: '方案名称',
    dataIndex: 'projectName',
    key: 'projectName',
  },
  {
    title: '演练信息',
    dataIndex: 'drillInfo',
    key: 'drillInfo',
    render(_, row) {
      const { drillName, drillType, drillTime, drillLocation } = row;
      return (
        <div className={styles.multi}>
          <div>
            演练名称：
            {drillName}
          </div>
          <div>
            演练类型：
            {drillType}
          </div>
          <div>
            起止时间：
            {`${moment(drillTime[0]).format('YYYY-MM-DD')}~${moment(drillTime[1]).format(
              'YYYY-MM-DD'
            )}`}
          </div>
          <div>
            演练地点：
            {drillLocation}
          </div>
        </div>
      );
    },
  },
  {
    title: '事故信息',
    dataIndex: 'accidentInfo',
    key: 'accidentInfo',
    render(_, row) {
      const { accidentName, accidentType } = row;
      return (
        <div className={styles.multi}>
          <div>
            事故名称：
            {accidentName}
          </div>
          <div>
            模拟事故类型：
            {accidentType}
          </div>
        </div>
      );
    },
  },
  {
    title: '演练过程描述',
    dataIndex: 'publishInfo',
    key: 'publishInfo',
  },
  {
    title: '操作',
    dataIndex: 'id',
    key: 'id',
    align: 'center',
    render(id) {
      return (
        <Fragment>
          <Link to={`${ROUTER}/view/${id}`}>查看</Link>
          <Divider type="vertical" />
          <Link to={`${ROUTER}/edit/${id}`}>编辑</Link>
          <Divider type="vertical" />
          <Popconfirm
            title="确定删除当前项目？"
            onConfirm={e => message.success('删除成功')}
            okText="确定"
            cancelText="取消"
          >
            <a>删除</a>
          </Popconfirm>
        </Fragment>
      );
    },
  },
];

export const EDIT_FORMITEMS = [
  // modify
  { name: 'companyName', label: '单位名称' },
  { name: 'projectName', label: '方案名称' },
  { name: 'drillName', label: '演练名称' },
  { name: 'drillType', label: '演练类型', type: 'component', component: <span /> },
  { name: 'drillTime', label: '演练起止日期', type: 'rangepicker' },
  { name: 'drillLocation', label: '演练地点' },
  { name: 'accidentName', label: '事故名称' },
  { name: 'accidentType', label: '模拟事故类型', type: 'select' },
  { name: 'drillOrgnization', label: '演练机构', type: 'text' },
  { name: 'drillMan', label: '演练人员', type: 'text' },
  {
    name: 'fileList',
    label: '演练过程描述',
    type: 'component',
    component: (
      <Upload name="files" action="/acloud_new/v2/uploadFile" fileList={[]} multiple>
        <Button type="dashed" style={{ width: '96px', height: '96px' }}>
          <Icon type="plus" style={{ fontSize: '32px' }} />
          <div style={{ marginTop: '8px' }}>点击上传</div>
        </Button>
      </Upload>
    ),
  },
];
