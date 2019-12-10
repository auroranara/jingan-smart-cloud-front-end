import React, { Component, Fragment } from 'react';
import { Spin, Button, message } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import CustomForm from '@/jingan-components/CustomForm';
import CompanySelect from '@/jingan-components/CompanySelect';
import InputOrSpan from '@/jingan-components/InputOrSpan';
import SelectOrSpan from '@/jingan-components/SelectOrSpan';
import DatePickerOrSpan from '@/jingan-components/DatePickerOrSpan';
import RadioOrSpan from '@/jingan-components/RadioOrSpan';
import CustomUpload from '@/jingan-components/CustomUpload';
import Text from '@/jingan-components/Text';
import { connect } from 'dva';
import { kebabCase, trimEnd } from 'lodash';
import { bind, debounce } from 'lodash-decorators';
import router from 'umi/router';
import locales from '@/locales/zh-CN';
import styles from './index.less';

const SPAN = { span: 24 };
const LABEL_COL = { span: 6 };

@connect((state, { route: { name, code } }) => {
  const { breadcrumbList } = code.split('.').reduce((result, item, index, list) => {
    const key = `${result.key}.${item}`;
    const title = locales[key];
    result.key = key;
    result.breadcrumbList.push({
      title,
      name: title,
      href: index === list.length - 2 ? `${trimEnd(result.breadcrumbList[result.breadcrumbList.length - 1].href, '/')}/${kebabCase(item)}` : undefined,
    });
    return result;
  }, {
    breadcrumbList: [
      { title: '首页', name: '首页', href: '/' },
    ],
    key: 'menu',
  });
  const namespace = code.replace(/.*\.(.*)\..*/, '$1');
  const {
    user: {
      currentUser: {
        unitType,
        unitId,
        permissionCodes,
      },
    },
    [namespace]: {
      detail,
    },
    loading: {
      effects: {
        [`${namespace}/getDetail`]: loading,
      },
    },
  } = state;
  return {
    unitId: +unitType === 4 ? unitId : undefined,
    detail,
    loading,
    breadcrumbList,
    isNotDetail: name !== 'detail',
    isEdit: name === 'edit',
    hasEditAuthority: permissionCodes.includes(code.replace(name, 'edit')),
  };
}, (dispatch, { match: { params: { id } }, route: { name, code, path }, error=true }) => {
  const namespace = code.replace(/.*\.(.*)\..*/, '$1');
  return {
    getDetail(payload, callback) {
      if (id) {
        dispatch({
          type: `${namespace}/getDetail`,
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
        type: `${namespace}/save`,
        payload: {
          detail: {},
        },
      });
    },
    handler(payload, callback) {
      dispatch({
        type: id ? `${namespace}/edit` : `${namespace}/add`,
        payload: {
          id,
          ...payload,
        },
        callback: (success, data) => {
          if (success) {
            message.success(`${id ? '编辑' : '新增'}成功！`);
            router.push(path.replace(new RegExp(`${name}.*`), 'list'));
          } else if (error) {
            message.error(`${id ? '编辑' : '新增'}失败，请稍后重试或联系管理人员！`);
          }
          callback && callback(success, data);
        },
      });
    },
    goBack() {
      router.goBack();
      window.scrollTo(0, 0);
    },
    goToEdit() {
      router.push(path.replace(new RegExp(`${name}.*`), `edit/${id}`));
      window.scrollTo(0, 0);
    },
  };
})
export default class ThreeInOnePage extends Component {
  state = {
    initialValues: {},
    submitting: false,
  }

  componentDidMount() {
    const { getDetail, setDetail, initialize } = this.props;
    setDetail();
    getDetail(undefined, (success, data) => {
      if (success) {
        this.setState({
          initialValues: initialize ? initialize(data) : data,
        });
      }
    });
  }

  setFormReference = form => {
    this.form = form;
  }

  @bind()
  @debounce(300)
  refresh() {
    this.forceUpdate();
  }

  // 返回按钮点击事件
  handleBackButtonClick = () => {
    this.props.goBack();
  }

  // 提交按钮点击事件
  handleSubmitButtonClick = () => {
    const {
      unitId,
      handler,
      transform,
    } = this.props;
    const { validateFieldsAndScroll } = this.form;
    validateFieldsAndScroll((errors, values) => {
      if (!errors) {
        const payload = transform ? transform({ unitId, ...values }) : values;
        this.setState({
          submitting: true,
        });
        handler(payload, (success) => {
          if (!success) {
            this.setState({
              submitting: false,
            });
          }
        });
      }
    });
  }

  // 编辑按钮点击事件
  handleEditButtonClick = () => {
    this.props.goToEdit();
  }

  renderItem = (values, item, index) => {
    if (Array.isArray(item)) {
      return {
        key: `${index}`,
        fields: item.map((item, index) => this.renderItem(values, item, index)).filter(v => v),
      };
    } else {
      const { isEdit, isNotDetail } = this.props;
      const { initialValues } = this.state;
      const { id, label, required, options, span=SPAN, labelCol=LABEL_COL, component, props, hidden, refreshEnable } = item;
      const isHidden = typeof hidden === 'function' ? hidden(values) : hidden;
      return !isHidden && {
        id,
        label,
        span,
        labelCol,
        render: () => {
          if (component === 'Input') {
            return <InputOrSpan className={styles.item} placeholder={`请输入${label}`} type={isNotDetail || 'span'} onChange={refreshEnable ? this.refresh : undefined} {...props} />;
          } else if (component === 'Select') {
            return <SelectOrSpan className={styles.item} placeholder={`请选择${label}`} type={isNotDetail || 'span'} onChange={refreshEnable ? this.refresh : undefined} allowClear={!required} {...props} />;
          } else if (component === 'CompanySelect') {
            return <CompanySelect className={styles.item} placeholder={`请选择${label}`} disabled={isEdit} type={isNotDetail || 'span'} onChange={refreshEnable ? this.refresh : undefined} {...props} />;
          } else if (component === 'DatePicker') {
            return <DatePickerOrSpan className={styles.item} placeholder={`请选择${label}`} type={isNotDetail || 'span'} allowClear={!required} onChange={refreshEnable ? this.refresh : undefined} {...props} />;
          } else if (component === 'RangePicker') {
            return <DatePickerOrSpan className={styles.item} placeholder={['开始时间', '结束时间']} type={isNotDetail ? 'RangePicker' : 'span'} allowClear={!required} onChange={refreshEnable ? this.refresh : undefined} {...props} />;
          } else if (component === 'TextArea') {
            return <InputOrSpan className={styles.item} placeholder={`请输入${label}`} type={isNotDetail ? 'TextArea' : 'span'} autosize={{ minRows: 3 }} onChange={refreshEnable ? this.refresh : undefined} {...props} />;
          } else if (component === 'CustomUpload') {
            return <CustomUpload type={isNotDetail || 'span'} onChange={refreshEnable ? this.refresh : undefined} {...props}  />;
          } else if (component === 'Radio') {
            return <RadioOrSpan type={isNotDetail || 'span'} onChange={refreshEnable ? this.refresh : undefined} {...props} />;
          } else if (component === 'Text') {
            return <Text {...props} />;
          } else {
            return <component className={styles.item} type={isNotDetail || 'span'} onChange={refreshEnable ? this.refresh : undefined} {...props} />;
          }
        },
        options: isNotDetail && required ? (options ? {
          ...options,
          initialValue: initialValues[id],
        } : {
          initialValue: initialValues[id],
          rules: [
            {
              type: ['CompanySelect', 'DatePicker'].includes(component) ? 'object' : undefined,
              required: true,
              whitespace: ['Input', 'TextArea'].includes(component) ? true : undefined,
              message: `${label}不能为空`,
              transform: component === 'RangePicker' ? value => value && value[0] && value[1] : undefined,
              ...(component === 'CustomUpload' && {
                type: 'array',
                min: 1,
                transform: value => value && value.filter(({ status }) => status === 'done'),
              }),
            },
          ],
        }) : {
          initialValue: initialValues[id],
        },
      };
    }
  }

  render() {
    const {
      breadcrumbList,
      loading=false,
      fields,
      editEnable=true,
      isNotDetail,
      hasEditAuthority,
      detail={},
      unitId,
    } = this.props;
    const { initialValues ,submitting } = this.state;
    const showEdit = typeof editEnable === 'function' ? editEnable(detail) : editEnable;
    const values = { unitId, ...initialValues, ...(this.form && this.form.getFieldsValue()) };
    let Fields = fields.map((item, index) => this.renderItem(values, item, index)).filter(v => v);
    if (!Fields[0].fields) {
      Fields = [{
        key: '0',
        fields: Fields,
      }];
    }

    return (
      <PageHeaderLayout
        title={breadcrumbList[breadcrumbList.length - 1].title}
        breadcrumbList={breadcrumbList}
      >
        <Spin spinning={loading}>
          <CustomForm
            mode="multiple"
            fields={Fields}
            searchable={false}
            resetable={false}
            action={(
              <Fragment>
                <Button onClick={this.handleBackButtonClick}>返回</Button>
                {isNotDetail ? (
                  <Button type="primary" onClick={this.handleSubmitButtonClick} loading={submitting}>提交</Button>
                ) : showEdit && (
                  <Button type="primary" onClick={this.handleEditButtonClick} disabled={!hasEditAuthority}>编辑</Button>
                )}
              </Fragment>
            )}
            ref={this.setFormReference}
          />
        </Spin>
      </PageHeaderLayout>
    );
  }
}
