import React from 'react';
import moment from 'moment';
import styles1 from '@/pages/SafetyKnowledgeBase/MSDS/MList.less';

export const PAGE_SIZE = 20;
export const ROUTER = '/safety-risk-control/promise'; // modify
export const LIST_URL = `${ROUTER}/list`;
export const LIST = [
  // modify
  {
    index: 1,
    id: '1',
    name: '晶安智慧科技有限公司',
    total: '4',
    run: '4',
    stop: '0',
    checking: '0',
    specialWork: '1',
    levelOne: '1',
    levelTwo: '1',
    limitedSpace: '0',
    pilot: 1,
    driving: 0,
    safe: 0,
    submitter: '小李子',
    submitTime: moment(),
  },
];

export const BREADCRUMBLIST = [
  // modify
  { title: '首页', name: '首页', href: '/' },
  { title: '安全风险管控', name: '安全风险管控' },
  { title: '风险研判与承诺公告', name: '风险研判与承诺公告', href: LIST_URL },
];

const DEVICES = ['总：', '运行：', '停产：', '检修：'];
const SPECIAL = ['特种作业：', '一级动火作业：', '二级动火作业：', '进入受限空间作业：'];
const PILOT = ['否', '是'];
const DRIVING = ['否', '是'];

export const TABLE_COLUMNS = [
  {
    title: '单位名称',
    dataIndex: 'companyName',
    key: 'companyName',
    align: 'center',
    width: 280,
  },
  {
    title: '生产装置',
    dataIndex: 'devices',
    key: 'devices',
    align: 'center',
    width: 200,
    render: (val, row) => {
      const { allContent } = row;
      return (
        <span>
          {[
            allContent.split(',')[0],
            allContent.split(',')[1],
            allContent.split(',')[2],
            allContent.split(',')[3],
          ].map((n, i) => (
            <p key={i} className={styles1.p}>
              {DEVICES[i]}
              {n}套
            </p>
          ))}
        </span>
      );
    },
  },
  {
    title: '特种作业',
    dataIndex: 'special',
    key: 'special',
    align: 'center',
    width: 200,
    render: (val, row) => {
      const { allContent } = row;
      return (
        <span>
          {[
            allContent.split(',')[4],
            allContent.split(',')[5],
            allContent.split(',')[6],
            allContent.split(',')[7],
          ].map((n, i) => (
            <p key={i} className={styles1.p}>
              {SPECIAL[i]}
              {n}处
            </p>
          ))}
        </span>
      );
    },
  },
  {
    title: '处于试生产',
    dataIndex: 'pilot',
    key: 'pilot',
    align: 'center',
    width: 160,
    render: (val, row) => {
      const { allContent } = row;
      return <span>{PILOT[allContent.split(',')[8]]}</span>;
    },
  },
  {
    title: '处于开停车状态',
    dataIndex: 'driving',
    key: 'driving',
    align: 'center',
    width: 160,
    render: (val, row) => {
      const { allContent } = row;
      return <span>{DRIVING[allContent.split(',')[9]]}</span>;
    },
  },
  {
    title: '提交信息',
    dataIndex: 'submit',
    key: 'submit',
    align: 'center',
    width: 180,
    render: (val, row) => {
      const { allContent, createTime } = row;
      console.log('createTime', createTime);

      return (
        <div>
          <p>
            提交者：
            {`${allContent.split(',')[11]}`}
          </p>
          <p>
            提交时间：
            {createTime && moment(+createTime).format('YYYY-MM-DD')}
          </p>
        </div>
      );
    },
  },
];

const PROMISE =
  '今天我公司已进行安全风险研判，各项安全风险防控措施已落实到位，我承诺所有生产装置处于安全运行状态，罐区、仓库等重大危险源安全风险得到有效管控。';

export const EDIT_FORMITEMS = [
  // modify
  { name: 'total', label: '生产装置', placeholder: '请输入数量', required: true },
  { name: 'run', label: '其中运行', placeholder: '请输入数量', required: true },
  { name: 'stop', label: '停产', placeholder: '请输入数量', required: true },
  { name: 'checking', label: '检修', placeholder: '请输入数量', required: true },
  { name: 'levelTwo', label: '二级动火作业', placeholder: '请输入数量', required: true },
  { name: 'levelOne', label: '一级动火作业', placeholder: '请输入数量', required: true },
  { name: 'specialWork', label: '特殊动火作业', placeholder: '请输入数量', required: true },
  { name: 'limitedSpace', label: '进入受限空间作业', placeholder: '请输入数量', required: true },
  { name: 'ground', label: '动土作业', placeholder: '请输入数量', required: true },
  { name: 'short', label: '短路作业', placeholder: '请输入数量', required: true },
  { name: 'breaker', label: '断路作业', placeholder: '请输入数量', required: true },
  { name: 'wall', label: '盲板抽堵', placeholder: '请输入数量', required: true },
  { name: 'electricity', label: '临时用电', placeholder: '请输入数量', required: true },
  { name: 'other', label: '其他作业', placeholder: '请输入数量', required: true },
  { name: 'pilot', label: '是否处于试生产', type: 'radio', options: PILOT, required: true },
  { name: 'driving', label: '是否处于开停车状态', type: 'radio', options: DRIVING, required: true },
  {
    name: 'safe',
    label: '罐区、仓库等重大危险源是否处于安全状态',
    type: 'radio',
    options: DRIVING,
    required: true,
    formExtraStyle: 'formExtraStyle',
  },
  { name: 'promise', label: '安全承诺', type: 'component', component: PROMISE },
  { name: 'submitter', label: '主要负责人', required: true },
];
