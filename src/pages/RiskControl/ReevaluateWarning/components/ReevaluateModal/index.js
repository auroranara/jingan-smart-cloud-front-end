import React, { Component } from 'react';
import { Modal, message, Spin } from 'antd';
import CustomForm from '@/jingan-components/CustomForm';
import InputOrSpan from '@/jingan-components/InputOrSpan';
import SelectOrSpan from '@/jingan-components/SelectOrSpan';
import CustomUpload from '@/jingan-components/CustomUpload';
import { connect } from 'dva';
import styles from './index.less';

const API = 'reevaluateWarning/getReevaluatorList';
const API2 = 'reevaluateWarning/reevaluate';

@connect(
  ({ reevaluateWarning: { reevaluatorList }, loading }) => ({
    reevaluatorList,
    loading: loading.effects[API2],
  }),
  dispatch => ({
    getReevaluatorList(payload, callback) {
      dispatch({
        type: API,
        payload,
        callback: (success, data) => {
          if (!success) {
            message.error('获取复评人员失败，请稍后重试！');
          }
          callback && callback(success, data);
        },
      });
    },
    reevaluate(payload, callback) {
      dispatch({
        type: API2,
        payload,
        callback: (success, data) => {
          if (success) {
            message.success('提交成功！');
          } else {
            message.error('提交失败，请稍后重试！');
          }
          callback && callback(success, data);
        },
      });
    },
  })
)
export default class ReevaluateModal extends Component {
  componentDidMount() {
    const { getReevaluatorList } = this.props;
    getReevaluatorList();
  }

  componentDidUpdate({ visible: prevVisible }) {
    const { visible } = this.props;
    if (!prevVisible && visible) {
      this.form && this.form.resetFields();
    }
  }

  shouldComonentUpdate(nextProps) {
    return (
      nextProps.reevaluatorList !== this.props.reevaluatorList ||
      nextProps.loading !== this.props.loading ||
      nextProps.visible !== this.props.visible
    );
  }

  setFormReference = form => {
    this.form = form;
  };

  handleOk = () => {
    this.form.validateFieldsAndScroll((error, values) => {
      if (!error) {
        const {
          data: { id },
          reevaluate,
        } = this.props;
        console.log(values);
        reevaluate(
          {
            id,
            ...values,
          },
          success => {
            if (success) {
              const { onSubmit } = this.props;
              onSubmit && onSubmit();
            }
          }
        );
      }
    });
  };

  handleUploadChange = () => {
    this.forceUpdate();
  };

  render() {
    const { visible, onClose, reevaluatorList, loading = false } = this.props;
    const { file } = (this.form && this.form.getFieldsValue()) || {};
    const uploading = (file || []).some(({ status }) => status === 'uploading');

    const fields = [
      {
        id: 'a',
        label: '复评人员',
        span: 24,
        render: () => (
          <SelectOrSpan list={reevaluatorList} placeholder="请选择复评人员" mode="tags" />
        ),
        options: {
          rules: [
            {
              required: true,
              message: `复评人员不能为空`,
            },
          ],
        },
      },
      {
        id: 'b',
        label: '复评周期',
        span: 24,
        render: () => <InputOrSpan placeholder="请选择复评周期" addonAfter="月" />,
        options: {
          getValueFromEvent: e => `${+e.target.value.replace(/^\D*(\d*).*$/, '$1') || ''}`,
          rules: [
            {
              required: true,
              message: `复评周期不能为空`,
            },
          ],
        },
      },
      {
        id: 'file',
        label: (
          <span>
            附<span className={styles.hide}>隐藏</span>件
          </span>
        ),
        span: 24,
        render: () => <CustomUpload onChange={this.handleUploadChange} />,
        options: {
          rules: [
            {
              required: true,
              type: 'array',
              min: 1,
              message: `附件不能为空`,
            },
          ],
        },
      },
    ];

    return (
      <Modal
        title="复评信息"
        zIndex={1009}
        visible={visible}
        onCancel={onClose}
        onOk={this.handleOk}
        okText="提交"
        confirmLoading={loading || uploading}
      >
        <Spin spinning={loading}>
          <CustomForm
            fields={fields}
            searchable={false}
            resetable={false}
            ref={this.setFormReference}
          />
        </Spin>
      </Modal>
    );
  }
}
