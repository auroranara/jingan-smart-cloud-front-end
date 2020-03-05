import React, { PureComponent } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, Row, Col, Checkbox } from 'antd';
import styles from './InlineForm.less';

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

const defaultButtonSpan = {
  xl: 8,
  md: 12,
  sm: 24,
};
const defaultInputSpan = {
  lg: 8,
  md: 12,
  sm: 24,
};

@Form.create()
export default class InlineForm extends PureComponent {
  /**
   * 组件挂载以后修改值可以通过修改values来实现
   */
  componentDidUpdate({ values: prevValues }) {
    const {
      values,
      form: { setFieldsValue },
    } = this.props;
    if (values !== prevValues) {
      setFieldsValue(values);
    }
  }

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
      form: { getFieldDecorator },
      hideSearch,
      hideReset,
      buttonSpan = defaultButtonSpan,
      gutter = { md: 16 },
      layout = 'vertical',
      bindPoint,
      onChangeCheckBox,
      checked = false,
      butonStyles = {},
    } = this.props;

    return (
      <Form layout={layout} className={styles.inlineForm}>
        <Row gutter={gutter}>
          {fields &&
            fields.map(field => {
              const { inputSpan = defaultInputSpan } = field;
              return (
                <Col key={field.id} {...inputSpan}>
                  <FormItem
                    label={field.label}
                    labelCol={field.labelCol}
                    wrapperCol={field.wrapperCol}
                    style={{ margin: '0', padding: '4px 0' }}
                  >
                    {getFieldDecorator(field.id, field.options)(field.render(this.handleSearch))}
                  </FormItem>
                </Col>
              );
            })}
          <Col {...buttonSpan} style={{ width: '65%', ...butonStyles }}>
            <FormItem style={{ margin: '0', padding: '4px 0' }}>
              {!hideSearch && (
                <Button
                  type={searchType || 'primary'}
                  onClick={this.handleSearch}
                  style={{ marginRight: '16px' }}
                >
                  {searchText || '查询'}
                </Button>
              )}
              {!hideReset && (
                <Button
                  type={resetType || 'default'}
                  onClick={this.handleReset}
                  style={{ marginRight: '16px' }}
                >
                  {resetText || '重置'}
                </Button>
              )}
              {action}
              {bindPoint && (
                <Checkbox
                  onChange={onChangeCheckBox}
                  checked={checked}
                  style={{ marginLeft: '4%' }}
                >
                  仅显示未绑定的标签
                </Checkbox>
              )}
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }
}
