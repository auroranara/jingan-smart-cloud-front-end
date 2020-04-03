import React, { Fragment, useState } from 'react';
import { Form, Button, Card, Row, Col } from 'antd';
import { Icon as LegacyIcon } from '@ant-design/compatible';
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
import classNames from 'classnames';
import styles from './index.less';

const COL = {
  xl: 8,
  md: 12,
  sm: 24,
  xs: 24,
};

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

const FormIndex = ({
  fields,
  mode,
  expandable,
  operation,
  operationCol,
  onFinish,
  onSearch,
  onReset,
  forwardRef,
  ...rest
}) => {
  const [form] = Form.useForm();
  const [expand, setExpand] = useState(false);
  // console.log(form && form.getFieldsValue());
  return (
    <Form
      onFinish={
        mode
          ? onFinish
          : values => {
              onSearch && onSearch(values);
              onFinish && onFinish(values);
            }
      }
      form={form}
      // ref={forwardRef}
      {...rest}
    >
      {Array.isArray(fields) &&
        (fields[0].fields
          ? fields
          : [
              {
                fields: mode
                  ? fields
                  : fields.concat({
                      key: '操作',
                      render() {
                        return (
                          <div className={styles.operationContainer}>
                            <div className={styles.operationWrapper}>
                              <Button type="primary" htmlType="submit">
                                查询
                              </Button>
                            </div>
                            <div className={styles.operationWrapper}>
                              <Button
                                onClick={() => {
                                  form.resetFields();
                                  onReset && onReset();
                                }}
                              >
                                重置
                              </Button>
                            </div>
                            {Array.isArray(operation) &&
                              operation.map(({ key, children, ...rest }) => {
                                return (
                                  <div key={key || children} className={styles.operationWrapper}>
                                    <Button children={children} {...rest} />
                                  </div>
                                );
                              })}
                            {expandable && (
                              <div className={styles.operationWrapper}>
                                <span
                                  className={styles.expandButton}
                                  onClick={() => {
                                    setExpand(expand => !expand);
                                  }}
                                >
                                  {expand ? '收起' : '展开'}
                                  <LegacyIcon
                                    className={classNames(
                                      styles.expandButtonIcon,
                                      expand && styles.expanded
                                    )}
                                    type="down"
                                  />
                                </span>
                              </div>
                            )}
                          </div>
                        );
                      },
                      col: operationCol,
                    }),
              },
            ]
        ).map(({ key, title, fields, className, ...rest }, index) => {
          return (
            <Card
              className={classNames(styles.card, className)}
              key={key || title || index}
              title={title}
              {...rest}
            >
              <Row gutter={24}>
                {fields.map(
                  ({
                    key,
                    name,
                    label,
                    component,
                    props,
                    enableDefaultRules,
                    rules,
                    col = COL,
                    shouldUpdate = true,
                    hide,
                    render,
                    ...rest
                  }) => {
                    let children;
                    let ruleList;
                    if (typeof render === 'function') {
                      children = render();
                    } else {
                      const Component = componentReference[component] || component;
                      children = <Component {...props} />;
                      if (enableDefaultRules && typeof Component.getRules === 'function') {
                        ruleList = Component.getRules({ label, ...props }).concat(rules || []);
                      }
                    }
                    return hide ? (
                      <Form.Item noStyle shouldUpdate={shouldUpdate}>
                        {() => {
                          return hide({ expand }) ? null : (
                            <Col key={key || name} {...col}>
                              <Form.Item
                                name={name}
                                label={label}
                                rules={ruleList || rules}
                                {...rest}
                              >
                                {children}
                              </Form.Item>
                            </Col>
                          );
                        }}
                      </Form.Item>
                    ) : (
                      <Col key={key || name} {...col}>
                        <Form.Item name={name} label={label} rules={ruleList || rules} {...rest}>
                          {children}
                        </Form.Item>
                      </Col>
                    );
                  }
                )}
              </Row>
            </Card>
          );
        })}
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
