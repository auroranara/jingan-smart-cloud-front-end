import React from 'react';
import moment from 'moment';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Input, Select, Modal, message, Tag } from 'antd';
import { AuthA } from '@/utils/customAuth';
import codesMap from '@/utils/codes';

// const { MonthPicker } = DatePicker;

const { Option } = Select;

export const PAGE_SIZE = 20;
export const ROUTER = '/target-responsibility/target-setting'; // modify
export const LIST_URL = `${ROUTER}/index`;
export const BREADCRUMBLIST = [
  // modify
  { title: '首页', name: '首页', href: '/' },
  { title: '目标责任管理', name: '目标责任管理' },
  { title: '目标责任制定实施', name: '目标责任制定实施', href: LIST_URL },
];

export const SEARCH_FIELDS = [
  // modify
  {
    id: 'companyName',
    label: '单位名称',
    render: () => <Input placeholder="请输入" allowClear />,
    transform: v => v.trim(),
  },
  {
    id: 'goalYear',
    label: '目标年份',
    render: () => <Input placeholder="请输入" allowClear />,
    transform(value) {
      return value.trim();
    },
  },
  {
    id: 'dutyMajor',
    label: '责任主体',
    render: () => (
      <Select placeholder="请选择" allowClear>
        {['单位', '部门', '个人'].map((r, i) => (
          <Option key={i + 1}>{r}</Option>
        ))}
      </Select>
    ),
  },
];

export const LIST = [
  // modify
  {
    companyName: '无锡晶安智慧科技有限公司',
    id: '1',
    goalYear: '2019年',
    dutyMajor: '单位：本单位',
    safeProductGoalValueList: [
      {
        id: '1',
        name: '工伤事故次数',
        value: '1',
      },
      {
        id: '2',
        name: '重复事故次数',
        value: '0',
      },
      {
        id: '3',
        name: '死亡率',
        value: '0.01%',
      },
      {
        id: '4',
        name: '职业病危害区域合格率',
        value: '99%',
      },
    ],
  },
];

const dutyType = {
  1: '单位',
  2: '部门',
  3: '个人',
};

export const TABLE_COLUMNS = [
  // modify
  {
    title: '单位名称',
    dataIndex: 'companyName',
    key: 'companyName',
    align: 'center',
    width: 280,
  },
  {
    title: '目标年份',
    dataIndex: 'goalYear',
    key: 'goalYear',
    align: 'center',
  },
  {
    title: '责任主体',
    dataIndex: 'dutyMajor',
    key: 'dutyMajor',
    align: 'center',
    render: (val, text) => {
      return (
        <span>
          {text.name || '本公司'}
          <Tag color="blue" style={{ marginLeft: 6 }}>
            {dutyType[val.substr(0, 1)]}
          </Tag>
        </span>
      );
    },
  },
  {
    title: '安全生产目标数值',
    dataIndex: 'safeProductGoalNumberList',
    key: 'safeProductGoalNumberList',
    align: 'center',
    render: val => {
      return val ? val.map((item, index) => <div key={index}>{item}</div>) : [];
    },
  },
  {
    title: '实际完成情况',
    dataIndex: 'performance',
    key: 'performance',
    align: 'center',
    render: (val, text) => {
      const { safeProductGoalNumberList } = text;
      return safeProductGoalNumberList ? (
        <AuthA
          code={codesMap.targetResponsibility.targetSetting.result}
          href={`#${ROUTER}/check-detail/${text.id}`}
        >
          填写考核结果
        </AuthA>
      ) : (
        <AuthA
          code={codesMap.targetResponsibility.targetSetting.result}
          onClick={() => message.warning('禁止进入考核页面,请先添加安全生产目标数值')}
        >
          填写考核结果
        </AuthA>
      );
    },
  },
];

const getFrequency = {
  1: '月',
  2: '季度',
  3: '年',
};

const getQuarter = {
  1: '一季度',
  2: '二季度',
  3: '三季度',
  4: '四季度',
};

export const DETAIL_COLUMNS = [
  {
    title: '指标',
    dataIndex: 'targetName',
    key: 'targetName',
    align: 'center',
    width: 280,
  },
  {
    title: '考核频次',
    dataIndex: 'checkFrequency',
    key: 'checkFrequency',
    align: 'center',
    render: val => getFrequency[val],
  },
  {
    title: '目标值',
    dataIndex: 'safeProductGoalNumber',
    key: 'safeProductGoalNumber',
    align: 'center',
    render: val => {
      return (
        <span>
          {+val.substr(0, 1) === 1 ? '≥' : '≤'} {val.substr(1)}
        </span>
      );
    },
  },
  {
    title: '实际值',
    dataIndex: 'actualValueList',
    key: 'actualValueList',
    align: 'center',
    render: (val, text) => {
      const { checkFrequency } = text;
      return val && val.length > 0
        ? val.map((item, index) => {
            const { actualValue, examtime } = item;
            return (
              (+checkFrequency === 1 && (
                <div key={index}>
                  {moment(examtime).format('M月')}：{actualValue}
                </div>
              )) ||
              (+checkFrequency === 2 && (
                <div key={index}>
                  {getQuarter[examtime.substr(5, 6)]}：{actualValue}
                </div>
              )) ||
              (+checkFrequency === 3 && (
                <div key={index}>
                  {examtime}
                  年： {actualValue}
                </div>
              ))
            );
          })
        : '';
    },
  },
  {
    title: '平均值',
    dataIndex: 'avgValue',
    key: 'avgValue',
    align: 'center',
    render: (val, text) => {
      const { checkFrequency } = text;
      return (
        (+checkFrequency === 1 && <span>{Math.floor(val * 100) / 100} /月</span>) ||
        (+checkFrequency === 2 && <span>{Math.floor(val * 100) / 100} /季度</span>) ||
        (+checkFrequency === 3 && <span>{Math.floor(val * 100) / 100} /年</span>)
      );
    },
  },
];

const quarterList = [
  {
    key: '1',
    value: '一季度',
  },
  {
    key: '2',
    value: '二季度',
  },
  {
    key: '3',
    value: '三季度',
  },
  {
    key: '4',
    value: '四季度',
  },
];

const monthList = [...Array(12).keys()].map(index => ({
  key: index + 1,
  value: index + 1 + '月',
}));

export const ExamModal = Form.create()(props => {
  const {
    form: { getFieldDecorator, validateFields, resetFields },
    modalVisible,
    // isopen,
    // time,
    handleModalClose,
    handleModalAdd,
    // handlePanelChange,
    // handleOpenChange,
    // clearDateValue,
    currentId,
    list,
  } = props;

  const curList = list.find(item => item.targetId === currentId);

  const { checkFrequency, targetId, goalYear, goalDutyId } = curList || {};
  const formItemCol = {
    labelCol: {
      span: 5,
    },
    wrapperCol: {
      span: 15,
    },
  };

  const onConfirm = () => {
    validateFields((err, fieldsValue) => {
      if (err) return;
      resetFields();
      return handleModalAdd({ targetId, goalDutyId, goalYear, fieldsValue });
    });
  };

  const handleClose = () => {
    resetFields();
    handleModalClose();
  };

  return (
    <Modal title={'考核结果'} visible={modalVisible} onCancel={handleClose} onOk={onConfirm}>
      <Form>
        <Form.Item {...formItemCol} label="考核频次：">
          <span>{getFrequency[checkFrequency]}</span>
        </Form.Item>
        {checkFrequency === '1' && (
          <Form.Item {...formItemCol} label="考核时间段:">
            {getFieldDecorator('monthTime', {
              // initialValue: time ? time : undefined,
              rules: [{ required: true, message: '请选择考核时间段' }],
            })(
              <Select placeholder="请选择" allowClear>
                {monthList.map(({ key, value }) => (
                  <Option key={key} value={key}>
                    {value}
                  </Option>
                ))}
              </Select>
            )}
          </Form.Item>
        )}
        {checkFrequency === '2' && (
          <Form.Item {...formItemCol} label="考核时间段:">
            {getFieldDecorator('quarter', {
              rules: [{ required: true, message: '请选择考核时间段' }],
            })(
              <Select placeholder="请选择" allowClear>
                {quarterList.map(({ key, value }) => (
                  <Option key={key} value={key}>
                    {value}
                  </Option>
                ))}
              </Select>
            )}
          </Form.Item>
        )}
        {checkFrequency === '3' && (
          <Form.Item {...formItemCol} label="考核时间段:">
            <Input value={goalYear} disabled placeholder="请选择" />
          </Form.Item>
        )}
        {/* {checkFrequency === '3' && (
          <Form.Item {...formItemCol} label="考核时间段:">
            {getFieldDecorator('yearTime', {
              initialValue: time ? time : undefined,
              rules: [{ required: true, message: '请选择考核时间段' }],
            })(
              <DatePicker
                placeholder="请选择"
                open={isopen}
                onOpenChange={s => handleOpenChange(s)}
                onChange={clearDateValue}
                onPanelChange={v => handlePanelChange(v)}
                format="YYYY"
                mode="year"
              />
            )}
          </Form.Item> */}
        <Form.Item {...formItemCol} label="实际值:">
          {getFieldDecorator('actualValue', {
            rules: [
              { required: true, message: '请输入实际值' },
              { pattern: /^[0-9]+\.?[0-9]*$/, message: '请输入数字' },
            ],
            getValueFromEvent: e => e.target.value.trim(),
          })(<Input placeholder="请输入" />)}
        </Form.Item>
      </Form>
    </Modal>
  );
});
