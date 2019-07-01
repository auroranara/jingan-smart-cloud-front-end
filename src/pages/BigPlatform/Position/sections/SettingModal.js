import React, { Fragment, PureComponent } from 'react';
import { Button, Form, Input, Modal, Radio } from 'antd';

import styles from './SettingModal.less';

const BTN_STYLE = { color: '#FFF', borderColor: '#0FF' };

const { Item: FormItem } = Form;
const { Group: RadioGroup } = Radio;
const MAX = 12;
const DEFAULT_TITLE = '晶安人员定位监控系统';

@Form.create()
export default class SettingModal extends PureComponent {
  state = { value: '' };

  handleChange = e => {
    this.setState({ value: e.target.value.slice(0, MAX) });
  };

  handleSubmit = () => {
    const {
      handleOk,
      form: { validateFieldsAndScroll },
    } = this.props;

    validateFieldsAndScroll((error, values) => {
      const { value } = this.state;
      if (!error) {
        const newValues = { ...values };
        if (values.title)
          newValues.title = value;
        else
          newValues.title = DEFAULT_TITLE;
        handleOk(newValues);
      }
    });
  };

  render() {
    const {
      visible,
      // handleOk,
      handleCancel,
      form: { getFieldDecorator },
    }  = this.props;
    const { value } = this.state;
    const title = <Fragment><span className={styles.rect} />默认选项设置</Fragment>;
    const btn = <Button type="ghost" style={BTN_STYLE} onClick={this.handleSubmit}>保存</Button>;

    return (
      <Modal
        className={styles.modal}
        centered
        width={700}
        title={title}
        visible={visible}
        onCancel={handleCancel}
        footer={btn}
        >
          <Form>
            <FormItem label="标题名称显示">
              {getFieldDecorator('title', { initialValue: 0 })(
                <RadioGroup>
                  <Radio value={0}>
                    {DEFAULT_TITLE}
                  </Radio>
                  <Radio value={1}>
                    <Input value={value} placeholder="请输入自定义平台名" onChange={this.handleChange} />
                  </Radio>
                </RadioGroup>
              )}
            </FormItem>
            <FormItem label="区域中显示信标位置标记">
              {getFieldDecorator('beacon', { initialValue: 1 })(
                <RadioGroup>
                  <Radio value={1}>是</Radio>
                  <Radio value={0}>否</Radio>
                </RadioGroup>
              )}
            </FormItem>
          </Form>
      </Modal>
    );
  };
}
