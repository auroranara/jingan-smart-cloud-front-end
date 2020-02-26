import React, { Component, Fragment } from 'react';
import { Spin, Button, message } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import CustomForm from '@/jingan-components/CustomForm';
import CompanySelect from '@/jingan-components/CompanySelect';
import InputOrSpan from '@/jingan-components/InputOrSpan';
import SelectOrSpan from '@/jingan-components/SelectOrSpan';
import DatePickerOrSpan from '@/jingan-components/DatePickerOrSpan';
import RadioOrSpan from '@/jingan-components/RadioOrSpan';
import SwitchOrSpan from '@/jingan-components/SwitchOrSpan';
import CustomUpload from '@/jingan-components/CustomUpload';
import Text from '@/jingan-components/Text';
import { connect } from 'dva';
import router from 'umi/router';
import classNames from 'classnames';
import locales from '@/locales/zh-CN';
import styles from './index.less';

const SPAN = { span: 24 };
const LABEL_COL = { span: 6 };
const STYLE = {
  marginBottom: undefined,
  padding: undefined,
};

@connect(
  (
    state,
    {
      route: { name, code },
      location: { pathname },
      match: {
        params: { unitId: unitId1 },
      },
      mapper,
      breadcrumbList: b,
    }
  ) => {
    const { namespace: n, detail: d, getDetail: gd } = mapper || {};
    let breadcrumbList;
    const namespace = n || code.replace(/.*\.(.*)\..*/, '$1');
    const {
      user: {
        currentUser: { unitType, unitId: unitId2, permissionCodes },
      },
      [namespace]: { [d || 'detail']: detail },
      loading: {
        effects: { [`${namespace}/${gd || 'getDetail'}`]: loading },
      },
    } = state;
    const isUnit = +unitType === 4;
    const unitId = isUnit ? unitId2 : unitId1;
    if (b) {
      breadcrumbList =
        typeof b === 'function' ? b({ isUnit, unitId, title: locales[`menu.${code}`] }) : b;
    } else {
      breadcrumbList = code.split('.').reduce(
        (result, item, index, list) => {
          const key = `${result.key}.${item}`;
          const title = locales[key];
          result.key = key;
          result.breadcrumbList.push({
            title,
            name: title,
            href:
              index === list.length - 2
                ? pathname.replace(new RegExp(`${name}.*`), 'list')
                : undefined,
          });
          return result;
        },
        {
          breadcrumbList: [{ title: '首页', name: '首页', href: '/' }],
          key: 'menu',
        }
      ).breadcrumbList;
    }
    return {
      unitId,
      detail,
      loading,
      breadcrumbList,
      isAdd: name === 'add',
      isNotDetail: name !== 'detail',
      isEdit: name === 'edit',
      isDetail: name === 'detail',
      hasEditAuthority: permissionCodes.includes(code.replace(name, 'edit')),
    };
  },
  (
    dispatch,
    {
      match: {
        params: { id },
      },
      route: { name, code },
      location: { pathname },
      error = true,
      mapper,
    }
  ) => {
    const { namespace: n, detail: d, getDetail: gd, edit: e, add: a, save: s } = mapper || {};
    const namespace = n || code.replace(/.*\.(.*)\..*/, '$1');
    return {
      getDetail(payload, callback, hack) {
        if (id || hack) {
          dispatch({
            type: `${namespace}/${gd || 'getDetail'}`,
            payload: {
              id,
              ...payload,
            },
            callback: (success, data) => {
              if (!success && error) {
                message.error('获取详情失败，请稍后重试或联系管理人员！');
              }
              callback && callback(success, data);
            },
          });
        }
      },
      setDetail() {
        dispatch({
          type: `${namespace}/${s || 'save'}`,
          payload: {
            [d || 'detail']: {},
          },
        });
      },
      handler(payload, callback) {
        dispatch({
          type: id ? `${namespace}/${e || 'edit'}` : `${namespace}/${a || 'add'}`,
          payload: {
            id,
            ...payload,
          },
          callback: (success, data) => {
            if (success) {
              message.success(`${id ? '编辑' : '新增'}成功！`);
              router.push(pathname.replace(new RegExp(`${name}.*`), 'list'));
            } else if (error) {
              message.error(
                `${id ? '编辑' : '新增'}失败，${error === 1 ? data : '请稍后重试或联系管理人员'}！`
              );
            }
            callback && callback(success, data);
          },
        });
      },
      goBack() {
        router.push(pathname.replace(new RegExp(`${name}.*`), 'list'));
        // router.goBack();
        // window.scrollTo(0, 0);
      },
      goToEdit() {
        router.push(pathname.replace(new RegExp(`${name}.*`), `edit/${id}`));
        window.scrollTo(0, 0);
      },
    };
  },
  null,
  { withRef: true }
)
export default class ThreeInOnePage extends Component {
  state = {
    initialValues: {},
    submitting: false,
  };

  componentDidMount() {
    const { getDetail, setDetail, initialize, hack } = this.props;
    setDetail();
    getDetail(
      undefined,
      (success, data) => {
        if (success) {
          this.setState(
            {
              initialValues: initialize ? initialize(data) : data,
            },
            this.refresh
          );
        }
      },
      hack
    );
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextProps.detail !== this.props.detail ||
      nextProps.loading !== this.props.loading ||
      nextState !== this.state
    );
  }

  setFormReference = form => {
    this.form = form;
  };

  refresh = () => {
    setTimeout(() => {
      this.forceUpdate();
    });
  };

  generateChangeCallback = (refreshEnable, props, callback) => {
    if (refreshEnable && props && props.onChange) {
      return (...args) => {
        (callback || this.refresh)(...args);
        props.onChange(...args);
      };
    } else if (refreshEnable) {
      return callback || this.refresh;
    } else if (props && props.onChange) {
      return props.onChange;
    }
  };

  // 返回按钮点击事件
  handleBackButtonClick = () => {
    this.props.goBack();
  };

  // 提交按钮点击事件
  handleSubmitButtonClick = () => {
    const { unitId, handler, transform } = this.props;
    const { validateFieldsAndScroll } = this.form;
    validateFieldsAndScroll((errors, values) => {
      if (!errors) {
        const payload = transform ? transform({ unitId, ...values }) : values;
        this.setState({
          submitting: true,
        });
        handler(payload, success => {
          if (!success) {
            this.setState({
              submitting: false,
            });
          }
        });
      }
    });
  };

  // 编辑按钮点击事件
  handleEditButtonClick = () => {
    this.props.goToEdit();
  };

  handleCompanyChange = company => {
    if (!company || company.key !== company.label) {
      this.refresh();
    }
  };

  renderItem = item => {
    if (item.fields) {
      return {
        ...item,
        fields: item.fields.map(this.renderItem),
      };
    } else {
      const { isAdd, isEdit, isNotDetail, layout } = this.props;
      const { initialValues } = this.state;
      const {
        id,
        label,
        required,
        options,
        span = SPAN,
        labelCol = LABEL_COL,
        component,
        props,
        refreshEnable,
      } = item;
      return {
        id,
        label,
        span,
        style: isNotDetail && layout === 'vertical' ? STYLE : undefined,
        labelCol: layout !== 'vertical' ? labelCol : undefined,
        render: () => {
          const itemClassName = classNames(
            isNotDetail && layout !== 'vertical' ? styles.item : styles.verticalItem,
            props && props.className
          );
          if (component === 'Input') {
            return (
              <InputOrSpan
                placeholder={`请输入${label}`}
                {...props}
                type={isNotDetail ? props && props.type : 'span'}
                className={itemClassName}
                onChange={this.generateChangeCallback(refreshEnable, props)}
              />
            );
          } else if (component === 'Select') {
            return (
              <SelectOrSpan
                placeholder={`请选择${label}`}
                type={isNotDetail || 'span'}
                allowClear={!required}
                {...props}
                className={itemClassName}
                onChange={this.generateChangeCallback(refreshEnable, props)}
              />
            );
          } else if (component === 'CompanySelect') {
            return (
              <CompanySelect
                placeholder={`请选择${label}`}
                disabled={isEdit}
                type={isNotDetail || 'span'}
                {...props}
                className={itemClassName}
                onChange={this.generateChangeCallback(
                  refreshEnable,
                  props,
                  this.handleCompanyChange
                )}
              />
            );
          } else if (component === 'DatePicker') {
            return (
              <DatePickerOrSpan
                placeholder={`请选择${label}`}
                type={isNotDetail || 'span'}
                allowClear={!required}
                {...props}
                className={itemClassName}
                onChange={this.generateChangeCallback(refreshEnable, props)}
              />
            );
          } else if (component === 'RangePicker') {
            return (
              <DatePickerOrSpan
                placeholder={['开始时间', '结束时间']}
                type={isNotDetail ? 'RangePicker' : 'span'}
                allowClear={!required}
                {...props}
                className={itemClassName}
                onChange={this.generateChangeCallback(refreshEnable, props)}
              />
            );
          } else if (component === 'TextArea') {
            return (
              <InputOrSpan
                placeholder={`请输入${label}`}
                type={isNotDetail ? 'TextArea' : 'span'}
                autosize={{ minRows: 3, maxRows: 10 }}
                {...props}
                className={itemClassName}
                onChange={this.generateChangeCallback(refreshEnable, props)}
              />
            );
          } else if (component === 'CustomUpload') {
            return (
              <CustomUpload
                type={isNotDetail || 'span'}
                {...props}
                onChange={this.generateChangeCallback(true, props)}
              />
            );
          } else if (component === 'Radio') {
            return (
              <RadioOrSpan
                type={isNotDetail || 'span'}
                {...props}
                onChange={this.generateChangeCallback(refreshEnable, props)}
              />
            );
          } else if (component === 'Switch') {
            return (
              <SwitchOrSpan
                type={isNotDetail || 'span'}
                {...props}
                onChange={this.generateChangeCallback(refreshEnable, props)}
              />
            );
          } else if (component === 'Text') {
            return <Text {...props} />;
          } else {
            const DefaultComponent = component;
            return (
              <DefaultComponent
                type={isNotDetail || 'span'}
                {...props}
                className={itemClassName}
                onChange={this.generateChangeCallback(refreshEnable, props)}
              />
            );
          }
        },
        options: {
          rules:
            isNotDetail && required
              ? [
                  {
                    type: ['CompanySelect', 'DatePicker'].includes(component)
                      ? 'object'
                      : undefined,
                    required: true,
                    whitespace: ['Input', 'TextArea'].includes(component) ? true : undefined,
                    message: `${label}不能为空`,
                    transform:
                      component === 'RangePicker'
                        ? value => value && value[0] && value[1]
                        : undefined,
                    ...(component === 'CustomUpload' && {
                      type: 'array',
                      min: 1,
                      // transform: value => value && value.filter(({ status }) => status === 'done'),
                    }),
                  },
                ]
              : undefined,
          ...options,
          initialValue:
            isAdd && options && options.hasOwnProperty('initialValue')
              ? options.initialValue
              : initialValues[id],
        },
      };
    }
  };

  render() {
    const {
      breadcrumbList,
      loading = false,
      fields,
      editEnable = true,
      isNotDetail,
      isAdd,
      isEdit,
      isDetail,
      hasEditAuthority,
      detail = {},
      unitId,
      getLoading,
      layout,
    } = this.props;
    const { submitting } = this.state;
    const showEdit = typeof editEnable === 'function' ? editEnable(detail) : editEnable;
    const values = {
      unitId,
      isAdd,
      isEdit,
      isDetail,
      ...(this.form && this.form.getFieldsValue()),
    }; // 这里有问题，但是不知道怎么解决
    let Fields = typeof fields === 'function' ? fields(values) : fields;
    const callback = (result, { id, component, fields }) => {
      if (fields) {
        return fields.reduce(callback, result);
      }
      if (component === 'CustomUpload') {
        result = result || (values[id] || []).some(({ status }) => status === 'uploading');
      }
      return result;
    };
    const uploading = Fields.reduce(callback, false);
    Fields = Fields.map(this.renderItem);
    if (!Fields[0].fields) {
      Fields = [
        {
          key: '0',
          fields: Fields,
        },
      ];
    }

    return (
      <PageHeaderLayout
        title={breadcrumbList[breadcrumbList.length - 1].title}
        breadcrumbList={breadcrumbList}
      >
        <Spin spinning={loading}>
          <CustomForm
            mode="multiple"
            layout={isNotDetail ? layout : undefined}
            fields={Fields}
            searchable={false}
            resetable={false}
            action={
              <Fragment>
                <Button onClick={this.handleBackButtonClick}>返回</Button>
                {isNotDetail ? (
                  <Button
                    type="primary"
                    onClick={this.handleSubmitButtonClick}
                    loading={submitting || uploading || (getLoading && getLoading(values))}
                  >
                    提交
                  </Button>
                ) : (
                  showEdit && (
                    <Button
                      type="primary"
                      onClick={this.handleEditButtonClick}
                      disabled={!hasEditAuthority}
                      loading={submitting || uploading || (getLoading && getLoading(values))}
                    >
                      编辑
                    </Button>
                  )
                )}
              </Fragment>
            }
            ref={this.setFormReference}
          />
        </Spin>
      </PageHeaderLayout>
    );
  }
}
