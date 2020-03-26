import React, { Component } from 'react';
import { Form } from 'antd';
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

  render() {
    // const {  }  = this.props;
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

    return <div>123</div>;
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
