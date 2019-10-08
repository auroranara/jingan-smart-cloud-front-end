import React, { PureComponent, Fragment } from 'react';
import { Form, Button, Row, Col, Card } from 'antd';
import classNames from 'classnames';
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

// 默认容器所占格数
const DEFAULT_SPAN = {
  xl: 8,
  md: 12,
  sm: 24,
  xs: 24,
};
// 默认多重容器格数
const DEFAULT_MULTIPLE_BUTTON_WRAPPER_SPAN = {
  sm: 24,
  xs: 24,
};
// 默认容器间隔
const DEFAULT_GUTTER = 24;
// 默认内容样式
const DEFAULT_STYLE = {
  margin: 0,
  padding: '4px 0',
};

@Form.create({
  onValuesChange({ refresh }, changedValues) {
    refresh && refresh(changedValues);
  },
})
export default class CustomForm extends PureComponent {
  getTransformedData = (fields, values) => {
    return fields && fields.reduce((result, { id, transform, fields }) => {
      if (fields) {
        result = {
          ...result,
          ...this.getTransformedData(fields, values),
        };
      } else if (values[id] && transform) {
        result[id] = transform(values[id]);
      }
      return result;
    }, {});
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
        const transformedData = this.getTransformedData(fields, values);
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
    resetFields();
    const values = getFieldsValue();
    if (onReset) {
      onReset(values);
    }
  };

  renderFields = (fields) => {
    const { form: { getFieldDecorator } } = this.props;

    return fields && fields.map(({
      id,
      span=DEFAULT_SPAN,
      options,
      render,
      style,
      ...restProps
    }) => (
      <Col
        key={id}
        {...(typeof span === 'number' ? { span } : span)}
      >
        <FormItem
          style={{ ...DEFAULT_STYLE, ...style }}
          {...restProps}
        >
          {getFieldDecorator(id, options)(render(this))}
        </FormItem>
      </Col>
    ));
  }

  renderButtons = () => {
    const {
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
      buttonWrapperSpan=DEFAULT_SPAN,
      // 按钮容器类名
      buttonWrapperClassName,
      // 按钮容器样式
      buttonWrapperStyle,
      // 模式
      mode,
    } = this.props;
    const span = mode === 'multiple' ? DEFAULT_MULTIPLE_BUTTON_WRAPPER_SPAN : buttonWrapperSpan;

    return (
      <Col {...(typeof span === 'number' ? { span } : span)}>
        <FormItem className={classNames(styles.buttonWrapper, buttonWrapperClassName)} style={{ textAlign: mode === 'multiple' ? 'center': undefined, ...DEFAULT_STYLE, ...buttonWrapperStyle }}>
          {/* 搜索按钮 */}
          {searchable && (
            <Button type="primary" {...searchProps} onClick={this.handleSearch}>
              {searchText || '查询'}
            </Button>
          )}
          {/* 重置按钮 */}
          {resetable && (
            <Button type="default" {...resetProps} onClick={this.handleReset}>
              {resetText || '重置'}
            </Button>
          )}
          {/* 其他按钮 */}
          {action}
        </FormItem>
      </Col>
    );
  }

  /**
   * 渲染
   */
  render() {
    const {
      // 类名
      className,
      // 输入控件
      fields,
      // 容器的间隔，具体见Row组件
      gutter=DEFAULT_GUTTER,
      // 模式
      mode,
    } = this.props;

    return (
      <Form className={classNames(styles.form, className)}>
        {mode === 'multiple' ? (
          <Fragment>
            {fields.map(({ key, title, fields: list }) => (
              <Card className={styles.card} title={title} bordered={false} key={key || title}>
                <Row gutter={gutter}>
                  {this.renderFields(list)}
                  {fields.length === 1 && this.renderButtons()}
                </Row>
              </Card>
            ))}
            {fields.length > 1 && (
              <Card className={styles.card} bordered={false}>
                <Row gutter={gutter}>
                  {this.renderButtons()}
                </Row>
              </Card>
            )}
          </Fragment>
        ) : (
          <Row gutter={gutter}>
            {this.renderFields(fields)}
            {this.renderButtons()}
          </Row>
        )}
      </Form>
    );
  }
}
