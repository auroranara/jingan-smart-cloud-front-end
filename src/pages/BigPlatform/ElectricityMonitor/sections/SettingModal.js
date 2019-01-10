import React, { Fragment, PureComponent } from 'react';
import { Button, Checkbox, Form, Input, Modal, Radio } from 'antd';

import styles from './SettingModal.less';

const BTN_STYLE = { color: '#FFF', borderColor: '#0FF' };

const { Item: FormItem } = Form;
const { Group: RadioGroup } = Radio;
const { Group: CheckboxGroup } = Checkbox;

@Form.create()
export default class SettingModal extends PureComponent {
  render() {
    const {
      visible,
      handleOk,
      handleCancel,
      form: { getFieldDecorator },
    }  = this.props;
    const title = <Fragment><span className={styles.rect} />默认选项设置</Fragment>;
    const btn = <Button type="ghost" style={BTN_STYLE} onClick={handleOk}>保存</Button>;

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
                  <Radio value={0}>晶安智慧消防维保平台</Radio>
                  <Radio value={1}><Input placeholder="请输入自定义平台名" /></Radio>
                </RadioGroup>
              )}
            </FormItem>
            <FormItem label="地图类型">
              {getFieldDecorator('map', { initialValue: 0 })(
                <RadioGroup>
                  <Radio value={0}>普通地图</Radio>
                  <Radio value={1}>卫星地图</Radio>
                </RadioGroup>
              )}
            </FormItem>
            <FormItem label="地图主题">
              {getFieldDecorator('theme', { initialValue: 0 })(
                <RadioGroup>
                  <Radio value={0}>标准</Radio>
                  <Radio value={1}>静蓝</Radio>
                </RadioGroup>
              )}
            </FormItem>
            <FormItem label="地图视角">
              {getFieldDecorator('angle', { initialValue: 0 })(
                <RadioGroup>
                  <Radio value={0}>2D</Radio>
                  <Radio value={1}>3D(倾斜60°)</Radio>
                </RadioGroup>
              )}
            </FormItem>
            <FormItem label="消息提醒">
              {getFieldDecorator('message', { initialValue: [0] })(
                <CheckboxGroup>
                  <Checkbox value={0}>预警提示</Checkbox>
                  <Checkbox value={1}>告警提示</Checkbox>
                </CheckboxGroup>
              )}
            </FormItem>
            <FormItem label="短信及电话通知规则">
              {getFieldDecorator('phone', { initialValue: [0] })(
                <CheckboxGroup>
                  <Checkbox value={0}>预警时APP消息提醒</Checkbox>
                  <Checkbox value={1}>告警时短信提醒</Checkbox>
                  <Checkbox value={2}>告警时系统自动拨打电话提醒</Checkbox>
                </CheckboxGroup>
              )}
            </FormItem>
          </Form>
      </Modal>
    );
  };
}
