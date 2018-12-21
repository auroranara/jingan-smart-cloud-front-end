import React, { PureComponent } from 'react';
import { Form, Button, Row, Col } from 'antd';
// 引入样式文件
import styles from './index.less';

const { Item: FormItem } = Form;

// fields参数的格式
// const fields = [{
//   id: 'name', // 字段名
//   label: undefined, // 字段中文
//   span: 8, // 控件所占格数，可以为数字，也可以为对象，具体见Col组件
//   options: {
//     rules: [{
//       required: true,
//       whitespace: true,
//       message: `请输入${fieldList.name}`,
//     }],
//   }, // 用于getFieldDecorator设置的参数
//   render(onSearch, onReset) {
//     return (
//       <Input placeholder={fieldList.name} />
//     );
//   }, // 渲染的实际控件
//   transform(value) {
//     return value.trim();
//   }, // 点击搜索时会根据这个函数对获取的对应表单值进行转换，如去除两边空格等操作都可以在这里实现
//   labelCol: 3,
//   wrapperCol: 9,
// }];

// 默认按钮容器所占格数
const defaultButtonSpan = {
  xl: 8,
  md: 12,
  sm: 24,
  xs: 24,
};
// 默认输入控件容器所占格数
const defaultInputSpan = {
  xl: 8,
  md: 12,
  sm: 24,
  xs: 24,
};
// 默认容器间隔
const defaultGutter = 24;
// 默认样式
const defaultStyle = { margin: '0', padding: '4px 0' };

/**
 * description: 将输入框、下拉框、按钮等控件放在一起的控件栏
 * author: sunkai
 * date: 2018年12月20日
 */
@Form.create()
class ToolBar extends PureComponent {
  // 组件内仓库
  state = {

  }

  /**
   * 挂载后
   */
  componentDidMount() {

  }

  /**
   * 更新后
   * 内部逻辑：当values发生变化时，根据values设置表单值
   */
  componentDidUpdate({ values: prevValues }) {
    const { values, form: { setFieldsValue } } = this.props;
    if (values !== prevValues) {
      setFieldsValue(values);
    }
  }

  /**
   * 销毁前
   */
  componentWillUnmount() {

  }

  /**
   * 搜索按钮点击事件
   * 内部逻辑：根据验证规则验证，通过后调用父组件传入的onSearch函数并将表单值作为参数传入
   */
  handleSearch = () => {
    const {
      fields,
      onSearch,
      form: { validateFieldsAndScroll, setFieldsValue },
    } = this.props;
    validateFieldsAndScroll((errors, values) => {
      if (!errors) {
        const transformedData = {};
        fields.forEach(field => {
          if (values[field.id] && field.transform) {
            transformedData[field.id] = field.transform(values[field.id]);
          }
        });
        setFieldsValue(transformedData);
        if (onSearch) {
          onSearch({
            ...values,
            ...transformedData,
          });
        }
      }
    });
  };

  /**
   * 重置按钮点击事件
   * 内部逻辑：调用父组件传入的onReset函数并将表单值作为参数传入，重置表单值
   */
  handleReset = () => {
    const {
      onReset,
      form: { resetFields, getFieldsValue },
    } = this.props;
    const values = getFieldsValue();
    resetFields();
    if (onReset) {
      onReset(values);
    }
  };

  /**
   * 渲染
   */
  render() {
    const {
      // 通过Form.create()生成的参数，无需父组件传入
      form: { getFieldDecorator },
      // 输入控件
      fields,
      // 搜索按钮的参数，具体见Button组件
      searchProps,
      // 搜索按钮的文本
      searchText,
      // 重置按钮的参数，具体见Button组件
      resetProps,
      // 重置按钮的文本
      resetText,
      // 放在按钮容器中的控件，一般为其他按钮，如添加按钮等
      action,
      // 是否显示搜索按钮
      searchable=true,
      // 是否显示重置按钮
      resetable=true,
      // 按钮容器占位格数，具体见Col组件
      buttonSpan=defaultButtonSpan,
      // 容器的间隔，具体见Row组件
      gutter=defaultGutter,
      // 按钮容器样式
      buttonStyle,
    } = this.props;

    return (
      <Form className={styles.form}>
        <Row gutter={gutter}>
          {/* 控件 */}
          {fields && fields.map(({
            id,
            label,
            span=defaultInputSpan,
            options,
            render,
            labelCol,
            wrapperCol,
            style,
          }) => (
            <Col
              key={id}
              {...(typeof span === 'number' ? { span } : span)}
            >
              <FormItem
                label={label}
                style={{ ...defaultStyle, ...style }}
                labelCol={labelCol}
                wrapperCol={wrapperCol}
              >
                {getFieldDecorator(id, options)(render(this.handleSearch, this.handleReset))}
              </FormItem>
            </Col>
          ))}
          {/* 按钮 */}
          <Col {...buttonSpan}>
            <FormItem style={{ ...defaultStyle, ...buttonStyle }}>
              {/* 搜索按钮 */}
              {searchable && (
                <Button type="primary" style={{ marginRight: '16px' }} {...searchProps} onClick={this.handleSearch}>
                  {searchText || '查询'}
                </Button>
              )}
              {/* 重置按钮 */}
              {resetable && (
                <Button type="default" style={{ marginRight: '16px' }} {...resetProps} onClick={this.handleReset}>
                  {resetText || '重置'}
                </Button>
              )}
              {/* 其他按钮 */}
              {action}
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default ToolBar;
