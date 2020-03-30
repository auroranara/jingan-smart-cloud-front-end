import React, { Component, Fragment } from 'react';
import InputOrSpan from '@/jingan-components/InputOrSpan';
import SelectOrSpan from '@/jingan-components/SelectOrSpan';
import MonitorEquipmentBindModal from '@/jingan-components/MonitorEquipmentBindModal';
import TablePage from '@/templates/TablePage';
import { RISKY_CATEGORIES } from '../components/MediumModal';
import styles from './index.less';

export const CHOICES = [{ key: '1', value: '是' }, { key: '0', value: '否' }];
export const STATUSES = [
  { key: '0', value: '正常' },
  { key: '1', value: '维检' },
  { key: '2', value: '报废' },
];
export const MATERIAL_STATUSES = [
  { key: '1', value: '固态' },
  { key: '2', value: '液态' },
  { key: '3', value: '气态' },
  { key: '4', value: '等离子态' },
];
const DEFAULT_SPAN = {
  md: 12,
  sm: 24,
  xs: 24,
};

export default class PipelineList extends Component {
  state = {
    type: undefined,
    visible: false,
    data: undefined,
  };

  setPageReference = page => {
    this.page = page && page.getWrappedInstance();
  };

  getContent = ({ list: { pagination: { total, companyCount } = {} } = {} }) => {
    return (
      <div>
        <span className={styles.contentItem}>
          单位数量：
          {companyCount || 0}
        </span>
        <span>
          管道总数：
          {total || 0}
        </span>
      </div>
    );
  };

  getFields = ({ unitId }) => [
    {
      id: 'nameOrNumberKeywords',
      label: '管道',
      span: DEFAULT_SPAN,
      transform: value => value.trim(),
      render: ({ handleSearch }) => (
        <InputOrSpan
          placeholder="请输入管道名称或管道编号"
          maxLength={100}
          onPressEnter={handleSearch}
        />
      ),
    },
    {
      id: 'chineNameOrCasNoKeywords',
      label: '存储介质',
      span: DEFAULT_SPAN,
      transform: value => value.trim(),
      render: ({ handleSearch }) => (
        <InputOrSpan
          placeholder="请输入存储介质或CAS号"
          maxLength={100}
          onPressEnter={handleSearch}
        />
      ),
    },
    {
      id: 'pressure',
      label: '是否压力管道',
      span: DEFAULT_SPAN,
      render: () => <SelectOrSpan placeholder="请选择是否压力管道" list={CHOICES} allowClear />,
    },
    ...(!unitId
      ? [
          {
            id: 'companyName',
            label: '单位名称',
            span: DEFAULT_SPAN,
            transform: value => value.trim(),
            render: ({ handleSearch }) => (
              <InputOrSpan
                placeholder="请输入单位名称"
                onPressEnter={handleSearch}
                maxLength={50}
              />
            ),
          },
        ]
      : []),
  ];

  getAction = ({ renderAddButton }) => <Fragment>{renderAddButton()}</Fragment>;

  getColumns = ({
    unitId,
    list,
    renderDetailButton,
    renderEditButton,
    renderDeleteButton,
    renderBindButton,
    renderUnbindButton,
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
      title: '基本信息',
      dataIndex: '基本信息',
      align: 'center',
      render: (_, { code, number, name }) => (
        <div className={styles.multi}>
          <div className={styles.line}>
            <span>统一编码：</span>
            <span>{code}</span>
          </div>
          <div className={styles.line}>
            <span>管道编号：</span>
            <span>{number}</span>
          </div>
          <div className={styles.line}>
            <span>管道名称：</span>
            <span>{name}</span>
          </div>
        </div>
      ),
    },
    {
      title: '输送介质',
      dataIndex: '输送介质',
      align: 'center',
      render: (_, { chineName, casNo, dangerChemcataSn, materialForm, riskCateg }) => (
        <div className={styles.multi}>
          <div className={styles.line}>
            <span>介质名称：</span>
            <span>{chineName}</span>
          </div>
          <div className={styles.line}>
            <span>CAS号：</span>
            <span>{casNo}</span>
          </div>
          <div className={styles.line}>
            <span>危险化学品目录序号：</span>
            <span>{dangerChemcataSn}</span>
          </div>
          <div className={styles.line}>
            <span>介质状态：</span>
            <span>
              <SelectOrSpan list={MATERIAL_STATUSES} value={`${materialForm}`} type="span" />
            </span>
          </div>
          <div className={styles.line}>
            <span>危险性类别：</span>
            <span>
              <SelectOrSpan list={RISKY_CATEGORIES} value={`${riskCateg}`} type="span" />
            </span>
          </div>
        </div>
      ),
    },
    {
      title: '压力管道',
      dataIndex: 'pressure',
      align: 'center',
      render: value => (+value ? '是' : '否'),
    },
    {
      title: '构成重大危险源',
      dataIndex: 'dangerSource',
      align: 'center',
      render: value => (+value ? '是' : '否'),
    },
    {
      title: '目前状态',
      dataIndex: 'status',
      align: 'center',
      render: value => <SelectOrSpan type="span" value={value} list={STATUSES} />,
    },
    {
      title: '监测设备',
      dataIndex: '监测设备',
      align: 'center',
      width: 102,
      fixed: list && list.length > 0 ? 'right' : false,
      render: (_, data) => (
        <div className={styles.buttonContainer}>
          <div>{renderUnbindButton(data)}</div>
          <div>{renderBindButton(data)}</div>
        </div>
      ),
    },
    {
      title: '操作',
      dataIndex: '操作',
      align: 'center',
      width: 102,
      fixed: list && list.length > 0 ? 'right' : false,
      render: (_, data) => (
        <div className={styles.buttonContainer}>
          <div>{renderDetailButton(data)}</div>
          <div>{renderEditButton(data)}</div>
          <div>{renderDeleteButton(data)}</div>
        </div>
      ),
    },
  ];

  handleBindedButtonClick = data => {
    this.setState({
      type: 1,
      visible: true,
      data,
    });
  };

  handleUnbindButtonClick = data => {
    this.setState({
      type: 0,
      visible: true,
      data,
    });
  };

  handleClose = flag => {
    this.setState({
      visible: false,
    });
    if (flag) {
      this.page.reload();
    }
  };

  renderModal() {
    const { type, visible, data } = this.state;

    return (
      <MonitorEquipmentBindModal
        type={type}
        visible={visible}
        data={data}
        onClose={this.handleClose}
      />
    );
  }

  render() {
    const props = {
      content: this.getContent,
      fields: this.getFields,
      action: this.getAction,
      columns: this.getColumns,
      otherOperation: [
        {
          code: 'unbind',
          name: ({ monitorEquipmentCount }) => +monitorEquipmentCount || 0,
          disabled: ({ monitorEquipmentCount }) => !+monitorEquipmentCount,
          onClick: this.handleBindedButtonClick,
        },
        {
          code: 'bind',
          name: '绑定监测设备',
          onClick: this.handleUnbindButtonClick,
        },
      ],
      ref: this.setPageReference,
      showTotal: false,
      ...this.props,
    };

    return <TablePage {...props}>{this.renderModal()}</TablePage>;
  }
}
