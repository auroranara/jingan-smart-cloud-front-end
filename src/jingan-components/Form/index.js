import React, { useState, forwardRef, useImperativeHandle, useEffect, Fragment } from 'react';
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
import PersonModal from './PersonModal';
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
// 获取当前栅格大小下所占格数
const GET_SPAN = (col, size) => {
  if (col) {
    if (col[size]) {
      return col[size];
    } else if (SIZE_MAPPER[size]) {
      return GET_SPAN(col, SIZE_MAPPER[size]);
    } else if (col.span) {
      return col.span;
    }
  }
  return 24;
};
// 获取控制显示的变量
const GET_GRID = (fields, operationCol, payload, size, expand) => {
  return (fields || []).concat(expand ? { col: operationCol } : []).reduce(
    (result, { hide, col = COL }) => {
      const hidden = hide ? hide(payload) : false;
      const span = GET_SPAN(col, size);
      if (!hidden) {
        if (result.offset >= span) {
          result.offset -= span;
        } else {
          if (expand) {
            result.offset = 24 - span;
          }
          result.multiLine = true;
        }
      }
      if (expand || !result.multiLine) {
        result.length += 1;
      }
      return result;
    },
    {
      length: 0,
      offset: expand ? 24 : 24 - GET_SPAN(operationCol, size),
      multiLine: false,
    }
  );
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
  PersonModal,
};

const FormIndex = forwardRef((props, ref) => {
  const {
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
    initialValues,
    dependencies: globalDependencies,
    showCard = true,
    ...rest
  } = props;
  // 创建form的引用
  const [form] = Form.useForm();
  // 将form的引用暴露到父组件
  useImperativeHandle(ref, () => form);
  // 创建初始值的保存
  const [prevInitialValues, setPrevInitialValues] = useState(initialValues);
  // 初始值发生变化时重置form组件（为了和3.0保持统一）
  useEffect(
    () => {
      // 暂时直接比较，以后再来考虑字段比较
      if (initialValues !== prevInitialValues) {
        setPrevInitialValues(initialValues);
        form.resetFields();
      }
    },
    [initialValues]
  );
  // 创建是否展开的变量
  const [expand, setExpand] = useState(!mode && expandable ? false : true);
  // 获取当前栅格大小
  const size = useMediaQuery();
  // 对fields做统一化处理
  const list = (Array.isArray(fields) && fields[0] && fields[0].fields
    ? fields
    : [
        {
          fields: Array.isArray(fields) ? fields : [],
        },
      ]
  ).slice(0, !mode ? 1 : undefined);
  // 获取所有依赖字段（包括上传）和上传相关字段
  const { dependencies, uploadDependencies } = list.reduce(
    (result, { fields }) => {
      return fields.reduce((result, { name, component, dependencies }) => {
        if (component === 'Upload') {
          result.dependencies.push(name);
          result.uploadDependencies.push(name);
        } else if (dependencies) {
          result.dependencies = result.dependencies.concat(dependencies);
        }
        return result;
      }, result);
    },
    {
      dependencies: globalDependencies || [],
      uploadDependencies: [],
    }
  );
  return (
    <Form
      className={classNames(styles.form, className)}
      onFinish={onSearch || onSubmit || onFinish}
      form={form}
      scrollToFirstError
      initialValues={initialValues}
      {...rest}
    >
      <Form.Item
        noStyle
        shouldUpdate={(prevValues, values) =>
          dependencies.some(dependency => prevValues[dependency] !== values[dependency])
        }
      >
        {({ getFieldsValue }) => {
          const values = getFieldsValue();
          const payload = { mode, ...params, ...values };
          const uploading = uploadDependencies.some(
            dependency =>
              values[dependency] && values[dependency].some(({ status }) => status !== 'done')
          );
          const { length = Infinity, offset = 0, multiLine = false } = !mode
            ? GET_GRID(list[0].fields, operationCol, payload, size, expand)
            : {};
          const toolbar =
            showOperation &&
            (!mode ? (
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
                {expandable &&
                  multiLine && (
                    <div className={styles.operationWrapper}>
                      <span
                        className={styles.expandButton}
                        onClick={() => {
                          setExpand(expand => !expand);
                        }}
                      >
                        {expand ? '收起' : '展开'}
                        <LegacyIcon
                          className={classNames(styles.expandButtonIcon, expand && styles.expanded)}
                          type="down"
                        />
                      </span>
                    </div>
                  )}
              </div>
            ) : (
              <div className={classNames(styles.operationContainer, styles.modeOperationContainer)}>
                <div className={styles.operationWrapper}>
                  {mode === 'detail' ? (
                    <Button type="primary" href={`#${editPath}`} disabled={!hasEditAuthority}>
                      编辑
                    </Button>
                  ) : (
                    <Button type="primary" htmlType="submit" loading={submitting || uploading}>
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
            ));
          return (
            <Fragment>
              {list.map(({ key, title, fields, className, ...rest }, index) => {
                const item = (
                  <Row key={key || title || index} gutter={24}>
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
                          onChange,
                          ...rest
                        },
                        index
                      ) => {
                        const Component = componentReference[component] || component;
                        const hidden = hide && hide(payload);
                        const properties = typeof props === 'function' ? props(payload) : props;
                        return !hidden && index < length ? (
                          <Col key={key || name} {...col}>
                            <Form.Item
                              name={name || key}
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
                      }
                    )}
                    {showOperation &&
                      list.length === 1 &&
                      (!mode ? (
                        <Col {...operationCol} offset={offset}>
                          <Form.Item>{toolbar}</Form.Item>
                        </Col>
                      ) : (
                        <Col {...operationCol}>
                          <Form.Item
                            label={<span className={styles.hidden}>操作</span>}
                            colon={false}
                          >
                            {toolbar}
                          </Form.Item>
                        </Col>
                      ))}
                  </Row>
                );
                return showCard ? (
                  <Card
                    className={classNames(styles.card, mode && styles.modeCard, className)}
                    key={key || title || index}
                    title={title}
                    {...rest}
                  >
                    {item}
                  </Card>
                ) : (
                  item
                );
              })}
              {showOperation && list.length > 1 && <FooterToolbar>{toolbar}</FooterToolbar>}
            </Fragment>
          );
        }}
      </Form.Item>
    </Form>
  );
});

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
  PersonModal,
};
