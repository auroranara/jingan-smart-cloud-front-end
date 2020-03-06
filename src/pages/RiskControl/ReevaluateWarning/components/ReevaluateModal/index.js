import React, { PureComponent } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Modal, message, Spin } from 'antd';
// import CustomForm from '@/jingan-components/CustomForm';
import InputOrSpan from '@/jingan-components/InputOrSpan';
// import SelectOrSpan from '@/jingan-components/SelectOrSpan';
import CustomUpload from '@/jingan-components/CustomUpload';
import PersonSelect from '@/pages/RiskControl/ReevaluateWarning/components/PersonSelect';
import { connect } from 'dva';
import styles from './index.less';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19 },
};

@connect(({ reevaluateWarning, loading }) => ({
  reevaluateWarning,
  loading: loading.effects['reevaluateWarning/reevaluate'],
}))
@Form.create()
export default class ReevaluateModal extends PureComponent {

  // 获取复评人员列表
  fetchReevaluatorList = (pageNum = 1, pageSize = 10) => {
    const { dispatch, data } = this.props;
    dispatch({
      type: 'reevaluateWarning/getReevaluatorList',
      payload: {
        pageNum,
        pageSize,
        unitId: data ? data.companyId : null,
      },
    });
  }

  // 复评
  reevaluate = (payload, callback) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'reevaluateWarning/reevaluate',
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
  }

  setFormReference = form => {
    this.form = form;
  };

  handleOk = () => {
    this.props.form.validateFieldsAndScroll((error, values) => {
      if (!error) {
        const {
          data: { id, zoneId },
        } = this.props;
        const { reviewPerson, ...resValues } = values;
        this.reevaluate(
          {
            id,
            zoneId,
            reviewPerson: reviewPerson.join(','),
            ...resValues,
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

  // 选择复评人
  handleSelectPerson = (keys, rows) => {
    this.props.form.setFieldsValue({ reviewPerson: keys })
  }

  render () {
    const {
      visible,
      onClose,
      loading = false,
      reevaluateWarning: { reviewer },
      form: { getFieldDecorator, getFieldsValue },
    } = this.props;
    const { file } = (getFieldsValue()) || {};
    const uploading = (file || []).some(({ status }) => status === 'uploading');

    // const fields = [
    //   {
    //     id: 'reviewPerson',
    //     label: '复评人员',
    //     span: 24,
    //     render: () => (
    //       <PersonSelect
    //         data={reviewer}
    //         onOk={this.handleSelectPerson}
    //         fetch={this.fetchReevaluatorList}
    //       />
    //     ),
    //     options: {
    //       rules: [
    //         {
    //           required: true,
    //           message: `复评人员不能为空`,
    //         },
    //       ],
    //     },
    //   },
    //   {
    //     id: 'reviewCycle',
    //     label: '复评周期',
    //     span: 24,
    //     render: () => <InputOrSpan placeholder="请选择复评周期" addonAfter="月" />,
    //     options: {
    //       getValueFromEvent: e => `${+e.target.value.replace(/^\D*(\d*).*$/, '$1') || ''}`,
    //       rules: [
    //         {
    //           required: true,
    //           message: `复评周期不能为空`,
    //         },
    //       ],
    //     },
    //   },
    //   {
    //     id: 'otherFileList',
    //     label: (
    //       <span>
    //         附<span className={styles.hide}>隐藏</span>件
    //       </span>
    //     ),
    //     span: 24,
    //     render: () => <CustomUpload onChange={this.handleUploadChange} />,
    //     options: {
    //       rules: [
    //         {
    //           required: true,
    //           type: 'array',
    //           min: 1,
    //           message: `附件不能为空`,
    //         },
    //       ],
    //     },
    //   },
    // ];

    return (
      <Modal
        width={600}
        title="复评信息"
        visible={visible}
        onCancel={onClose}
        onOk={this.handleOk}
        okText="提交"
        confirmLoading={loading || uploading}
      >
        <Spin spinning={loading}>
          {/* <CustomForm
            fields={fields}
            searchable={false}
            resetable={false}
            wrappedComponentRef={this.setFormReference}
          /> */}
          <Form>
            <FormItem {...formItemLayout} label="复评人员">
              {getFieldDecorator('reviewPerson', {
                rules: [
                  {
                    required: true,
                    message: `复评人员不能为空`,
                  },
                ],
              })(
                <PersonSelect
                  data={reviewer}
                  onOk={this.handleSelectPerson}
                  fetch={this.fetchReevaluatorList}
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="复评周期">
              {getFieldDecorator('reviewCycle', {
                getValueFromEvent: e => `${+e.target.value.replace(/^\D*(\d*).*$/, '$1') || ''}`,
                rules: [
                  {
                    required: true,
                    message: `复评周期不能为空`,
                  },
                ],
              })(
                <InputOrSpan placeholder="请选择复评周期" addonAfter="月" />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label={(
              <span>
                附<span className={styles.hide}>隐藏</span>件
            </span>
            )}>
              {getFieldDecorator('otherFileList', {
                rules: [
                  {
                    required: true,
                    type: 'array',
                    min: 1,
                    message: `附件不能为空`,
                  },
                ],
              })(
                <CustomUpload onChange={this.handleUploadChange} />
              )}
            </FormItem>
          </Form>
        </Spin>
      </Modal>
    );
  }
}
