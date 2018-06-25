import React, { PureComponent } from 'react';
import { Form, Button } from 'antd';

const FormItem = Form.Item;

// const fields = [{
//   label: undefined,
//   id: 'name',
//   options: {
//     rules: [{
//       required: true,
//       whitespace: true,
//       message: `请输入${fieldList.name}`,
//     }],
//   },
//   render() {
//     return (
//       <Input placeholder={fieldList.name} />
//     );
//   },
//   transform(value) {
//     return value.trim();
//   },
// }];

@Form.create()
export default class InlineForm extends PureComponent {
  /* 查询按钮点击事件 */
  handleSearch = () => {
    const {
      fields,
      onSearch,
      form: { validateFieldsAndScroll, setFieldsValue },
    } = this.props;
    validateFieldsAndScroll((errors, values) => {
      if (!errors) {
        const transformData = {};
        fields.forEach(field => {
          if (values[field.id] && field.transform) {
            transformData[field.id] = field.transform(values[field.id]);
          }
        });
        setFieldsValue(transformData);
        if (onSearch) {
          onSearch({
            ...values,
            ...transformData,
          });
        }
      }
    });
  };

  /* 重置按钮点击事件 */
  handleReset = () => {
    const {
      onReset,
      form: { resetFields, getFieldsValue },
    } = this.props;
    resetFields();
    if (onReset) {
      onReset(getFieldsValue());
    }
  };

  render() {
    const {
      fields,
      searchText,
      searchType,
      resetText,
      resetType,
      action,
      extra,
      form: { getFieldDecorator },
    } = this.props;

    return (
      <Form layout="inline" className="clearfix">
        {fields &&
          fields.map(field => (
            <FormItem label={field.label} key={field.id}>
              {getFieldDecorator(field.id, field.options)(field.render())}
            </FormItem>
          ))}
        <FormItem>
          <Button type={searchType || 'primary'} onClick={this.handleSearch}>
            {searchText || '查询'}
          </Button>
        </FormItem>
        <FormItem>
          <Button type={resetType || 'default'} onClick={this.handleReset}>
            {resetText || '重置'}
          </Button>
        </FormItem>
        {action && <FormItem>{action}</FormItem>}
        {extra && <FormItem style={{ float: 'right', marginRight: '0' }}>{extra}</FormItem>}
      </Form>
    );
  }
}
