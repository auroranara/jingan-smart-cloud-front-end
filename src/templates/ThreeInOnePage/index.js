import React, { Component, Fragment } from 'react';
import { Spin, Button, message } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import CustomForm from '@/jingan-components/CustomForm';
import { connect } from 'dva';
import { kebabCase, trimEnd } from 'lodash';
import router from 'umi/router';
import locales from '@/locales/zh-CN';
import styles from './index.less';

@connect((state, { code, route: { name } }) => {
  let temp = code.split('.');
  const { breadcrumbList } = temp.reduce((result, item) => {
    const key = `${result.key}.${item}`;
    const title = locales[key];
    result.key = key;
    result.breadcrumbList.push({
      title,
      name: title,
      href: `${trimEnd(result.breadcrumbList[result.breadcrumbList.length - 1].href)}/${kebabCase(item)}`,
    });
    return key;
  }, {
    breadcrumbList: [
      { title: '首页', name: '首页', href: '/' },
    ],
    key: 'menu',
  });
  temp = temp.slice(0, -1);
  const prefix = temp.join('.');
  const title = locales[`menu.${prefix}.${name}`];
  const namespace = temp[temp.length - 1];
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
      effectes: {
        [`${namespace}/getDetail`]: loading,
      },
    },
  } = state;
  return {
    companyId: +unitType === 4 ? unitId : undefined,
    detail,
    loading,
    title,
    breadcrumbList: breadcrumbList.concat({ title, name: title }),
    isNotDetail: name !== 'detail',
    hasEditAuthority: permissionCodes.includes(`${prefix}.edit`),
  };
}, (dispatch, { code, match: { params: { id } }, error=true }) => {
  const namespace = code.replace(/.*\.(.*)\.list$/, '$1');
  const prefix = code.split('.').map(v => kebabCase(v)).join('/');
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
            router.push(`${prefix}/list`);
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
      router.push(`${prefix}/edit/${id}`);
      window.scrollTo(0, 0);
    },
  };
})
export default class ThreeInOnePage extends Component {
  state = {
    submitting: false,
  }

  componentDidMount() {
    const { getDetail, setDetail, initialize } = this.props;
    setDetail();
    getDetail(undefined, (success, data) => {
      if (success) {
        const initialValues = initialize ? initialize(data) : data;
        this.form && this.form.setFieldsValue(initialValues);
        setTimeout(() => {
          this.form && this.form.setFieldsValue(initialValues);
        }); // 确保关联字段显示
      }
    });
  }

  setFormReference = form => {
    this.form = form;
  }

  // 返回按钮点击事件
  handleBackButtonClick = () => {
    this.props.goBack();
  }

  // 提交按钮点击事件
  handleSubmitButtonClick = () => {
    const {
      companyId,
      handler,
      transform,
    } = this.props;
    const { validateFieldsAndScroll } = this.form;
    validateFieldsAndScroll((errors, values) => {
      if (!errors) {
        const payload = transform ? transform(values) : values;
        this.setState({
          submitting: true,
        });
        handler({
          ...payload,
          companyId: companyId || values.company.key,
        }, (success) => {
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

  render() {
    const {
      title,
      breadcrumbList,
      loading=false,
      fields,
      editEnable=true,
      isNotDetail,
      hasEditAuthority,
      detail={},
    } = this.props;
    const { submitting } = this.state;
    const showEdit = typeof editEnable === 'function' ? editEnable(detail) : editEnable;

    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
      >
        <Spin spinning={loading}>
          <CustomForm
            mode="multiple"
            fields={fields}
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
