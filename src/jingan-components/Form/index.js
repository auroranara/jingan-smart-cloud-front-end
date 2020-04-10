import React, { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import { Form, Button, Card, Row, Col } from 'antd';
import { Icon as LegacyIcon } from '@ant-design/compatible';
import FooterToolbar from '@/components/FooterToolbar';
import useMediaQuery from 'use-media-antd-query';
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
import InputNumber from './InputNumber';
import classNames from 'classnames';
import styles from './index.less';

const COL = {
  xxl: 6,
  xl: 8,
  lg: 12,
  md: 12,
  sm: 12,
  xs: 24,
};
const COL2 = {
  span: 24,
};
const SIZE_MAPPER = {
  xxl: 'xl',
  xl: 'lg',
  lg: 'md',
  md: 'sm',
};
const GET_SPAN = (col, size) => {
  if (col) {
    if (col.span) {
      return col.span;
    } else if (col[size]) {
      return col[size];
    } else if (SIZE_MAPPER[size]) {
      return GET_SPAN(col, SIZE_MAPPER[size]);
    }
  }
  return 24;
};
const GET_OFFSET = (expand, spanList, operationSpan) => {
  if (expand) {
    const restSpan = spanList.reduce((result, span) => {
      return result >= span ? result - span : 24 - span;
    }, 24);
    return restSpan >= operationSpan ? restSpan - operationSpan : 24 - operationSpan;
  } else {
    let rest = 24 - operationSpan;
    for (const span of spanList) {
      if (rest >= span) {
        rest = rest - span;
      } else {
        return rest;
      }
    }
    return rest;
  }
};
const GET_GRID = (fields, payload, gridSize, operationSpan, expandable, expand) => {
  const { spanList, length } = fields.reduce(
    (result, { hide, col = COL }) => {
      const hidden = hide ? hide(payload) : false;
      const span = GET_SPAN(col, gridSize);
      if (!expandable || expand) {
        if (!hidden) {
          result.spanList.push(span);
        }
        result.length += 1;
      } else {
        if (!hidden) {
          result.total += span;
          if (result.total <= 24) {
            result.spanList.push(span);
          }
        }
        if (result.total <= 24) {
          result.length += 1;
        }
      }
      return result;
    },
    {
      spanList: [],
      length: 0,
      total: operationSpan,
    }
  );
  return {
    length,
    offset: GET_OFFSET(expand, spanList, operationSpan),
    gridSize,
  };
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
  InputNumber,
};

/**
 * 1.字段发生变化时，其他字段的显示隐藏
 * 2.字段发生变化时，其他字段值的变化
 */

const FormIndex = forwardRef(
  (
    {
      className,
      fields,
      mode,
      expandable = true,
      operation,
      operationCol = !mode ? COL : COL2,
      onSearch,
      onReset,
      onValuesChange,
      params,
      hasEditAuthority,
      editPath,
      listPath,
      onSubmit,
      onFinish,
      submitting,
      showOperation = true,
      ...rest
    },
    ref
  ) => {
    const [form] = Form.useForm();
    const [expand, setExpand] = useState(false);
    const windowSize = useMediaQuery();
    const [grid, setGrid] = useState({
      length: Infinity,
      offset: 0,
      gridSize: windowSize,
    });
    let list = Array.isArray(fields)
      ? fields[0].fields
        ? fields
        : [
            {
              fields,
            },
          ]
      : [];
    list = !mode ? list.slice(0, 1) : list;
    useImperativeHandle(ref, () => form);
    useEffect(
      () => {
        if (!mode) {
          const fields = (list[0] && list[0].fields) || [];
          const values = form.getFieldsValue();
          const payload = { ...params, ...values };
          const operationSpan = GET_SPAN(operationCol, windowSize);
          const grid = GET_GRID(fields, payload, windowSize, operationSpan, expandable, expand);
          setGrid(grid);
        }
      },
      [windowSize, expand]
    );
    const dependencies = list.reduce((result, { fields }) => {
      return fields.reduce((result, { name, component }) => {
        if (component === 'Upload') {
          result.push(name);
        }
        return result;
      }, result);
    }, []);
    return (
      <Form
        className={classNames(styles.form, className)}
        onValuesChange={
          !mode
            ? (changedValues, values) => {
                const fields = (list[0] && list[0].fields) || [];
                const dependency = Object.keys(changedValues)[0];
                if (
                  fields.some(
                    ({ dependencies }) => dependencies && dependencies.includes(dependency)
                  )
                ) {
                  const payload = { ...params, ...values };
                  const operationSpan = GET_SPAN(operationCol, windowSize);
                  const grid = GET_GRID(
                    fields,
                    payload,
                    windowSize,
                    operationSpan,
                    expandable,
                    expand
                  );
                  setGrid(grid);
                }
                onValuesChange && onValuesChange(changedValues, values);
              }
            : onValuesChange
        }
        onFinish={values => {
          onSearch && onSearch(values);
          onSubmit && onSubmit(values);
          onFinish && onFinish(values);
        }}
        form={form}
        scrollToFirstError
        {...rest}
      >
        {list.map(({ key, title, fields, className, ...rest }, index) => {
          return (
            <Card
              className={classNames(styles.card, mode && styles.modeCard, className)}
              key={key || title || index}
              title={title}
              {...rest}
            >
              <Row gutter={24}>
                {fields.map(
                  (
                    {
                      key,
                      name,
                      label,
                      component,
                      props,
                      enableDefaultRules,
                      rules,
                      col = !mode ? COL : COL2,
                      hide,
                      render,
                      dependencies,
                      onChange,
                      ...rest
                    },
                    index
                  ) => {
                    const Component = componentReference[component] || component;
                    const properties =
                      typeof props === 'function' ? props({ mode, ...params }) : props;
                    return index < grid.length ? (
                      (hide || typeof props === 'function') &&
                      dependencies &&
                      dependencies.length ? (
                        <Form.Item
                          key={key || name}
                          noStyle
                          shouldUpdate={(prevValues, values) =>
                            dependencies.some(
                              dependency => prevValues[dependency] !== values[dependency]
                            )
                          }
                        >
                          {({ getFieldsValue }) => {
                            const values = getFieldsValue();
                            const hidden = hide && hide({ mode, ...params, ...values });
                            const properties =
                              typeof props === 'function'
                                ? props({ mode, ...params, ...values })
                                : props;
                            return !hidden ? (
                              <Col
                                {...col}
                                {...!mode && {
                                  span: GET_SPAN(col, grid.gridSize),
                                  xxl: undefined,
                                  xl: undefined,
                                  lg: undefined,
                                  md: undefined,
                                  sm: undefined,
                                  xs: undefined,
                                }}
                              >
                                <Form.Item
                                  name={name}
                                  label={label}
                                  rules={
                                    mode !== 'detail'
                                      ? enableDefaultRules && Component.getRules
                                        ? Component.getRules({ label, ...properties }).concat(
                                            rules || []
                                          )
                                        : rules
                                      : undefined
                                  }
                                  dependencies={dependencies}
                                  {...rest}
                                >
                                  <Component
                                    mode={mode}
                                    onChange={
                                      onChange
                                        ? (...args) => {
                                            const values = onChange(...args);
                                            if (values) {
                                              form.setFieldsValue(values);
                                            }
                                          }
                                        : undefined
                                    }
                                    {...properties}
                                  />
                                </Form.Item>
                              </Col>
                            ) : null;
                          }}
                        </Form.Item>
                      ) : !hide || !hide({ mode, ...params }) ? (
                        <Col
                          key={key || name}
                          {...col}
                          {...!mode && {
                            span: GET_SPAN(col, grid.gridSize),
                            xxl: undefined,
                            xl: undefined,
                            lg: undefined,
                            md: undefined,
                            sm: undefined,
                            xs: undefined,
                          }}
                        >
                          <Form.Item
                            name={name}
                            label={label}
                            rules={
                              mode !== 'detail'
                                ? enableDefaultRules && Component.getRules
                                  ? Component.getRules({ label, ...properties }).concat(rules || [])
                                  : rules
                                : undefined
                            }
                            dependencies={dependencies}
                            {...rest}
                          >
                            <Component
                              mode={mode}
                              onChange={
                                onChange
                                  ? (...args) => {
                                      const values = onChange(...args);
                                      if (values) {
                                        form.setFieldsValue(values);
                                      }
                                    }
                                  : undefined
                              }
                              {...properties}
                            />
                          </Form.Item>
                        </Col>
                      ) : null
                    ) : null;
                  }
                )}
                {!mode ? (
                  <Col
                    {...operationCol}
                    {...{
                      offset: grid.offset,
                      span: GET_SPAN(operationCol, grid.gridSize),
                      xxl: undefined,
                      xl: undefined,
                      lg: undefined,
                      md: undefined,
                      sm: undefined,
                      xs: undefined,
                    }}
                  >
                    <Form.Item>
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
                              const values = form.getFieldsValue();
                              onReset && onReset(values);
                            }}
                          >
                            重置
                          </Button>
                        </div>
                        {Array.isArray(operation) &&
                          operation.map((item, index) => {
                            return (
                              <div key={index} className={styles.operationWrapper}>
                                {item}
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
                    </Form.Item>
                  </Col>
                ) : (
                  showOperation &&
                  list.length === 1 && (
                    <Form.Item
                      noStyle
                      shouldUpdate={(prevValues, values) =>
                        dependencies.some(
                          dependency => prevValues[dependency] !== values[dependency]
                        )
                      }
                    >
                      {({ getFieldsValue }) => {
                        const values = getFieldsValue();
                        const uploading = dependencies.some(
                          dependency =>
                            values[dependency] &&
                            values[dependency].some(({ status }) => status !== 'done')
                        );
                        return (
                          <Col {...operationCol}>
                            <Form.Item
                              label={<span className={styles.hidden}>操作</span>}
                              colon={false}
                            >
                              <div
                                className={classNames(
                                  styles.operationContainer,
                                  styles.modeOperationContainer
                                )}
                              >
                                <div className={styles.operationWrapper}>
                                  {mode === 'detail' ? (
                                    <Button
                                      type="primary"
                                      href={`#${editPath}`}
                                      disabled={!hasEditAuthority}
                                    >
                                      编辑
                                    </Button>
                                  ) : (
                                    <Button
                                      type="primary"
                                      htmlType="submit"
                                      loading={submitting || uploading}
                                    >
                                      提交
                                    </Button>
                                  )}
                                </div>
                                <div className={styles.operationWrapper}>
                                  <Button href={`#${listPath}`}>返回</Button>
                                </div>
                                {Array.isArray(operation) &&
                                  operation.map((item, index) => {
                                    return (
                                      <div key={index} className={styles.operationWrapper}>
                                        {item}
                                      </div>
                                    );
                                  })}
                              </div>
                            </Form.Item>
                          </Col>
                        );
                      }}
                    </Form.Item>
                  )
                )}
              </Row>
            </Card>
          );
        })}
        {mode &&
          showOperation &&
          list.length > 1 && (
            <Form.Item
              noStyle
              shouldUpdate={(prevValues, values) =>
                dependencies.some(dependency => prevValues[dependency] !== values[dependency])
              }
            >
              {({ getFieldsValue }) => {
                const values = getFieldsValue();
                const uploading = dependencies.some(
                  dependency =>
                    values[dependency] && values[dependency].some(({ status }) => status !== 'done')
                );
                return (
                  <FooterToolbar>
                    <div className={styles.operationContainer}>
                      <div className={styles.operationWrapper}>
                        {mode === 'detail' ? (
                          <Button type="primary" href={`#${editPath}`} disabled={!hasEditAuthority}>
                            编辑
                          </Button>
                        ) : (
                          <Button
                            type="primary"
                            htmlType="submit"
                            loading={submitting || uploading}
                          >
                            提交
                          </Button>
                        )}
                      </div>
                      <div className={styles.operationWrapper}>
                        <Button href={`#${listPath}`}>返回</Button>
                      </div>
                      {Array.isArray(operation) &&
                        operation.map((item, index) => {
                          return (
                            <div key={index} className={styles.operationWrapper}>
                              {item}
                            </div>
                          );
                        })}
                    </div>
                  </FooterToolbar>
                );
              }}
            </Form.Item>
          )}
      </Form>
    );
  }
);

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
  InputNumber,
};
