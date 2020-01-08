import React, { Component, Fragment } from 'react';
import InputOrSpan from '@/jingan-components/InputOrSpan';
import SelectOrSpan from '@/jingan-components/SelectOrSpan';
import MonitorEquipmentBindModal from '@/jingan-components/MonitorEquipmentBindModal';
import TablePage from '@/templates/TablePage';
import styles from './index.less';

export const CHOICES = [{ key: '1', value: '是' }, { key: '0', value: '否' }];
export const STATUSES = [
  { key: '0', value: '正常' },
  { key: '1', value: '维检' },
  { key: '2', value: '报废' },
];

export default class PipelineList extends Component {
  state = {
    type: undefined,
    visible: false,
    data: undefined,
  };

  setPageReference = page => {
    this.page = page && page.getWrappedInstance();
  };

  getFields = ({ unitId }) => [
    {
      id: 'name',
      label: '管道名称',
      render: ({ handleSearch }) => (
        <InputOrSpan placeholder="请输入管道名称" maxLength={50} onPressEnter={handleSearch} />
      ),
    },
    {
      id: 'number',
      label: '管道编号',
      render: ({ handleSearch }) => (
        <InputOrSpan placeholder="请输入管道编号" maxLength={50} onPressEnter={handleSearch} />
      ),
    },
    {
      id: 'isPress',
      label: '是否压力管道',
      render: () => <SelectOrSpan placeholder="请选择是否压力管道" list={CHOICES} allowClear />,
    },
    {
      id: 'medium',
      label: '存储介质',
      render: ({ handleSearch }) => (
        <InputOrSpan placeholder="请输入存储介质" maxLength={50} onPressEnter={handleSearch} />
      ),
    },
    {
      id: 'cas',
      label: 'CAS号',
      render: ({ handleSearch }) => (
        <InputOrSpan placeholder="请输入CAS号" maxLength={50} onPressEnter={handleSearch} />
      ),
    },
    ...(!unitId
      ? [
          {
            id: 'companyName',
            label: '单位名称',
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
    renderDetailButton2: renderBindedButton,
    renderEditButton2: renderUnbindButton,
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
      render: (_, { unifiedCode, number, name }) => (
        <div className={styles.multi}>
          <div className={styles.line}>
            <span>统一编码：</span>
            <span>{unifiedCode}</span>
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
      render: (_, { medium, cas, seriesNumber, status, type }) => (
        <div className={styles.multi}>
          <div className={styles.line}>
            <span>介质名称：</span>
            <span>{medium.chineName}</span>
          </div>
          <div className={styles.line}>
            <span>CAS号：</span>
            <span>{cas}</span>
          </div>
          <div className={styles.line}>
            <span>危险化学品目录序号：</span>
            <span>{seriesNumber}</span>
          </div>
          <div className={styles.line}>
            <span>介质状态：</span>
            <span>{status}</span>
          </div>
          <div className={styles.line}>
            <span>介质类别：</span>
            <span>{type}</span>
          </div>
        </div>
      ),
    },
    {
      title: '压力管道/危化品管道',
      dataIndex: '压力管道/危化品管道',
      align: 'center',
      render: (_, { isPress, isRisk }) => `${+isPress ? '是' : '否'}/${+isRisk ? '是' : '否'}`,
    },
    {
      title: '目前状态',
      dataIndex: 'status',
      align: 'center',
      render: value => <SelectOrSpan type="span" value={value} list={STATUSES} />,
    },
    {
      title: '已绑监测设备',
      dataIndex: '已绑监测设备',
      align: 'center',
      width: 102,
      fixed: list && list.length > 0 ? 'right' : false,
      render: (_, data) => renderBindedButton(data),
    },
    {
      title: '操作',
      dataIndex: '操作',
      align: 'center',
      width: 102,
      fixed: list && list.length > 0 ? 'right' : false,
      render: (_, data) => (
        <div className={styles.buttonContainer}>
          <div>{renderUnbindButton(data)}</div>
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
      fields: this.getFields,
      action: this.getAction,
      columns: this.getColumns,
      otherOperation: [
        {
          code: 'detail',
          name: ({ monitorEquipmentCount }) => +monitorEquipmentCount || 0,
          disabled: ({ monitorEquipmentCount }) => !+monitorEquipmentCount,
          onClick: this.handleBindedButtonClick,
        },
        {
          code: 'edit',
          name: '绑定监测设备',
          onClick: this.handleUnbindButtonClick,
        },
      ],
      ref: this.setPageReference,
      ...this.props,
    };

    return <TablePage {...props}>{this.renderModal()}</TablePage>;
  }
}
