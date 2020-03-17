import React, { Component } from 'react';
import { Modal, Form, Input, Radio, DatePicker } from 'antd';
import moment from 'moment';
import { MINUTE_FORMAT, APPROVAL_OPINIONS } from '../../../config';
import styles from './index.less';

@Form.create()
export default class ApproveModal extends Component {
  componentDidMount() {
    const {
      form: { setFieldsValue },
    } = this.props;
    setFieldsValue({
      approveTime: moment(),
    });
  }

  componentDidUpdate({ visible: prevVisible }) {
    const { visible } = this.props;
    if (visible && !prevVisible) {
      const {
        form: { setFieldsValue },
      } = this.props;
      setFieldsValue({
        approveTime: moment(),
      });
    }
  }

  handleOk = () => {
    const {
      form: { validateFieldsAndScroll },
    } = this.props;
    validateFieldsAndScroll((error, values) => {
      if (!error) {
        const { onOk } = this.props;
        const { approveTime } = values;
        onOk &&
          onOk({
            ...values,
            approveTime: approveTime && approveTime.format('YYYY/MM/DD HH:mm:00'),
          });
      }
    });
  };

  handleAfterClose = () => {
    const {
      form: { resetFields },
    } = this.props;
    resetFields();
  };

  render() {
    const {
      visible,
      onCancel,
      form: { getFieldDecorator },
    } = this.props;
    const fields = [
      {
        key: 'approveUser',
        label: '审批人',
        component: <Input className={styles.formItem} placeholder="请输入" maxLength={100} />,
        options: {
          rules: [{ required: true, message: '审批人不能为空', whitespace: true }],
        },
      },
      {
        key: 'approveTime',
        label: '审批时间',
        component: (
          <DatePicker
            className={styles.formItem}
            placeholder="请选择"
            format={MINUTE_FORMAT}
            showTime={{
              format: 'HH:mm',
            }}
            allowClear={false}
          />
        ),
        options: {
          rules: [{ type: 'object', required: true, message: '审批时间不能为空' }],
        },
      },
      {
        key: 'approveStatus',
        label: '审批意见',
        component: (
          <Radio.Group>
            {APPROVAL_OPINIONS.map(({ key, value }) => (
              <Radio key={key} value={key}>
                {value}
              </Radio>
            ))}
          </Radio.Group>
        ),
        options: {
          rules: [{ required: true, message: '审批意见不能为空' }],
        },
      },
    ];

    return (
      <Modal
        title="预审批"
        visible={visible}
        onOk={this.handleOk}
        onCancel={onCancel}
        afterClose={this.handleAfterClose}
        zIndex={1009}
      >
        <Form className={styles.form}>
          {fields.map(({ key, label, component, options }) => (
            <Form.Item key={key} label={label} labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
              {getFieldDecorator(key, options)(component)}
            </Form.Item>
          ))}
        </Form>
      </Modal>
    );
  }
}
