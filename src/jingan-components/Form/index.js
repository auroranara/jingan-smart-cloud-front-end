import React from 'react';
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

const FormIndex = ({ fields, ...rest }) => {
  console.log(rest.initialValues);
  return (
    <Form {...rest}>
      {Array.isArray(fields) &&
        fields.map(({ key, name, label, component, props, enableDefaultRules, rules, ...rest }) => {
          let ruleList;
          const Component = componentReference[component] || component;
          if (enableDefaultRules && typeof Component.getRules === 'function') {
            ruleList = Component.getRules({ label }).concat(rules || []);
          }
          return (
            <Form.Item
              key={key || name}
              name={key || name}
              label={label}
              rules={ruleList || rules}
              {...rest}
            >
              <Component {...props} />
            </Form.Item>
          );
        })}
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default FormIndex;

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
