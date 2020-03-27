import React, { Component } from 'react';
import { Form, Button } from 'antd';
import Input from './Input';
import Select from './Select';
import DatePicker from './DatePicker';
import RangePicker from './RangePicker';
import Password from './Password';
import TextArea from './TextArea';
import TreeSelect from './TreeSelect';
import Upload from './Upload';
import Radio from './Radio';
import Map from './Map';
import AMap from './AMap';
import styles from './index.less';

const componentReference = {
  Input,
  Select,
  DatePicker,
  RangePicker,
  Password,
  TextArea,
  TreeSelect,
  Upload,
  Radio,
  Map,
  AMap,
};

/**
 * 1.字段发生变化时，其他字段的显示隐藏
 * 2.字段发生变化时，其他字段值的变化
 */

export default class FormForm extends Component {
  static Input = Input;
  static Select = Select;
  static DatePicker = DatePicker;
  static RangePicker = RangePicker;
  static Password = Password;
  static TextArea = TextArea;
  static TreeSelect = TreeSelect;
  static Upload = Upload;
  static Radio = Radio;
  static Map = Map;
  static AMap = AMap;

  formRef = React.createRef();

  handleFinish = values => {
    console.log(values);
  };

  handleValuesChange = (changedValues, allValues) => {
    console.log(changedValues);
    console.log(allValues);
  };

  render() {
    const { fields, ...rest } = this.props;
    const list = typeof fields === 'function' ? fields() : fields;

    return (
      <Form
        ref={this.formRef}
        onFinish={this.handleFinish}
        onValuesChange={this.handleValuesChange}
        {...rest}
      >
        {Array.isArray(list) &&
          list.map(
            ({
              key,
              name,
              label,
              component,
              props,
              enableDefaultRules,
              render,
              rules,
              ...rest
            }) => {
              let children, ruleList;
              if (typeof render === 'function') {
                children = render();
              } else {
                const Component = componentReference[component] || component;
                children = <Component {...props} />;
                if (enableDefaultRules && typeof Component.getRules === 'function') {
                  ruleList = Component.getRules({ label }).concat(rules || []);
                }
              }
              return (
                <Form.Item
                  key={key || name}
                  name={key || name}
                  label={label}
                  rules={ruleList || rules}
                  {...rest}
                >
                  {children}
                </Form.Item>
              );
            }
          )}
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

export {
  Input,
  Select,
  DatePicker,
  RangePicker,
  Password,
  TextArea,
  TreeSelect,
  Upload,
  Radio,
  Map,
  AMap,
};
