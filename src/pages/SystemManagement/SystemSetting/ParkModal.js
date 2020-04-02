import React, { Component } from 'react';
import { Button, message, Modal, Input } from 'antd';
import AsyncSelect from '@/jingan-components/AsyncSelect';
import CustomForm from '@/jingan-components/CustomForm';
import SwitchOrSpan from '@/jingan-components/SwitchOrSpan';
import { isNumber } from '@/utils/utils';
import { connect } from 'dva';

const STATUSES = [{ key: '1', value: '启用' }, { key: '0', value: '停用' }];
const SPAN = { span: 24 };
const LABEL_COL = { span: 6 };

// const MAPPER = {
//   namespace: 'licensePlateRecognitionSystem',
//   detail: 'parkDetail',
//   getDetail: 'getParkDetail',
//   add: 'addPark',
//   edit: 'editPark',
// };
const FIELDNAMES = {
  key: 'id',
  value: 'userName',
};
const MAPPER2 = {
  namespace: 'common',
  list: 'personList',
  getList: 'getPersonList',
};

@connect(
  ({ user }) => ({
    user,
  }),
  dispatch => ({
    testLink (payload, callback) {
      dispatch({
        type: 'licensePlateRecognitionSystem/testLink',
        payload,
        callback: (success, data) => {
          if (success) {
            message.success('连接成功！');
          } else {
            message.error('连接失败！');
          }
          callback && callback(success, data);
        },
      });
    },
    editPark (payload, callback) {
      dispatch({
        type: 'licensePlateRecognitionSystem/editPark',
        payload,
        callback: (success, data) => {
          if (success) {
            message.success('操作成功！');
          } else {
            message.error('操作失败！');
          }
          callback && callback(success, data);
        },
      });
    },
  })
)
export default class Park extends Component {

  getSnapshotBeforeUpdate (preProps, preState) {
    return preProps.visible !== this.props.visible && this.props.visible;
  }

  componentDidUpdate (preProps, preState, snapshot) {
    if (snapshot) {
      const { detail } = this.props;
      const values = detail && detail.id ? this.initialize(detail) : {};
      console.log('values', values);
      setTimeout(() => {
        this.form && this.form.setFieldsValue(values)
      }, 0);
    }
  }

  handleSubmit = () => {
    const { onOk, detail, editPark } = this.props;
    this.form && this.form.validateFields((err, values) => {
      if (err || !detail.id) return;
      const payload = values ? this.transform(values) : values;
      editPark({ ...payload, id: detail.id }, onOk);
    })
  }

  handleClick = () => {
    const values = this.form && this.form.getFieldsValue();
    this.props.testLink(values);
  };

  initialize = ({
    parkId,
    parkName,
    managerId,
    managerName,
    managerPhone,
    parkStatus,
    dbUrl,
    dbUserName,
    dbPassword,
  }) => ({
    parkId: parkId || undefined,
    parkName: parkName || undefined,
    manager: managerId ? { key: managerId, label: managerName } : undefined,
    managerPhone: managerPhone || undefined,
    parkStatus: isNumber(parkStatus) ? `${parkStatus}` : undefined,
    dbUrl: dbUrl || undefined,
    dbUserName: dbUserName || undefined,
    dbPassword: dbPassword || undefined,
  });

  transform = ({ manager, test, ...payload }) => {
    return {
      companyId: this.props.location.query.companyId,
      managerId: manager && manager.key ? manager.key : '',
      ...payload,
    };
  };

  setFormReference = form => {
    this.form = form;
  };

  render () {
    const {
      title = '车场设置',
      visible,
      onCancel,
      user: { currentUser: { unitType } },
      location: { query: { companyId } },
    } = this.props;

    const fields = [
      {
        id: 'parkId',
        label: '车场ID',
        span: SPAN,
        labelCol: LABEL_COL,
        render: () => <Input disabled />,
      },
      {
        id: 'parkName',
        label: '车场名称',
        span: SPAN,
        labelCol: LABEL_COL,
        options: { rules: [{ required: true, message: '车场名称不能为空' }] },
        render: () => <Input placeholder="请输入车场名称" />,
      },
      {
        id: 'manager',
        label: '车场联系人',
        span: SPAN,
        labelCol: LABEL_COL,
        render: () => (
          <AsyncSelect
            placeholder="请选择车场联系人"
            onSelect={this.handleManagerSelect}
            fieldNames={FIELDNAMES}
            mapper={MAPPER2}
            params={{ unitId: companyId }}
          />
        ),
      },
      {
        id: 'managerPhone',
        label: '联系电话',
        span: SPAN,
        labelCol: LABEL_COL,
        render: () => <Input placeholder="请输入联系电话" />,
      },
      {
        id: 'parkStatus',
        label: '车场状态',
        span: SPAN,
        labelCol: LABEL_COL,
        options: {
          initialValue: STATUSES[0].key,
          rules: [{ required: true, message: '车场状态不能为空' }],
        },
        render: () => (
          <SwitchOrSpan
            list={STATUSES}
          />
        ),
      },
      ...(unitType === 3
        ? [
          {
            id: 'dbUrl',
            label: '数据库连接地址',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => <Input placeholder="请输入数据库连接地址" />,
          },
          {
            id: 'dbUserName',
            label: '数据库用户名',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => <Input placeholder="请输入数据库用户名" />,
          },
          {
            id: 'dbPassword',
            label: '数据库密码',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => <Input.Password placeholder="请输入数据库密码" />,
          },
          {
            id: 'test',
            label: '测试连接',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => (<Button type="primary" onClick={this.handleClick}>测试</Button>),
          },
        ]
        : []),
    ];
    return (
      <Modal
        width={700}
        title={title}
        visible={visible}
        onCancel={onCancel}
        onOk={this.handleSubmit}
        destroyOnClose
      >
        <CustomForm
          fields={fields}
          searchable={false}
          resetable={false}
          ref={this.setFormReference}
        />
      </Modal>
    )
  }
}
