import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import { Spin } from 'antd';
import Form from '@/jingan-components/Form';
import { connect } from 'dva';
import router from 'umi/router';
import locales from '@/locales/zh-CN';
import { isEqual } from 'lodash';
// import styles from './index.less';

const FormPage = props => {
  const {
    match: {
      params: { id },
    },
    breadcrumbList,
    mode,
    fields,
    isUnit,
    isOperation,
    unitId,
    unitType,
    currentUser,
    formRef,
    hasEditAuthority,
    editPath,
    listPath,
    getDetail,
    initialize,
    handler,
    transform,
    loading,
    labelCol,
    wrapperCol,
    initialValues,
    detail,
    showEditButton,
    params,
  } = props;
  const form = useRef(null);
  useImperativeHandle(formRef, () => form.current);
  const [values, setValues] = useState(initialValues);
  // 是否正在提交
  const [submitting, setSubmitting] = useState(false);
  useEffect(
    () => {
      if (id) {
        getDetail(undefined, (success, data) => {
          if (success) {
            setValues(initialize ? initialize(data) : data);
          }
        });
      }
      window.scrollTo(0, 0);
    },
    [id, mode]
  );
  return (
    <PageHeaderLayout
      title={breadcrumbList[breadcrumbList.length - 1].title}
      breadcrumbList={breadcrumbList}
    >
      <Spin spinning={loading}>
        <Form
          ref={form}
          mode={mode}
          fields={fields}
          params={{
            isUnit,
            isOperation,
            unitId,
            unitType,
            currentUser,
            ...detail,
            ...(detail && initialize && initialize(detail)),
            ...params,
          }}
          hasEditAuthority={hasEditAuthority}
          editPath={editPath}
          listPath={listPath}
          onSubmit={values => {
            setSubmitting(true);
            handler(
              {
                ...(transform
                  ? transform({
                      isUnit,
                      isOperation,
                      unitId,
                      unitType,
                      currentUser,
                      mode,
                      ...values,
                    })
                  : values),
              },
              success => {
                if (success) {
                  setTimeout(() => {
                    if (mode !== 'add') {
                      window.close();
                    }
                    router.push(listPath);
                  }, 1000);
                } else {
                  setSubmitting(false);
                }
              }
            );
          }}
          submitting={submitting}
          labelCol={labelCol}
          wrapperCol={wrapperCol}
          initialValues={values}
          showEditButton={showEditButton}
        />
      </Spin>
    </PageHeaderLayout>
  );
};

export default connect(
  (
    state,
    {
      route: { name, code },
      location: { pathname },
      match: {
        params: { id },
      },
      mapper,
      breadcrumbList: b,
      loading: loading2,
    }
  ) => {
    const {
      namespace = code.split('.').slice(-2)[0],
      detail: d = 'detail',
      getDetail: gd = 'getDetail',
      add: a = 'add',
      edit: e = 'edit',
    } = mapper || {};
    let breadcrumbList;
    const {
      user: {
        currentUser,
        currentUser: { unitType, unitId, permissionCodes },
      },
      [namespace]: { [d]: detail },
      loading: {
        effects: { [`${namespace}/${gd}`]: loading },
      },
    } = state;
    const isUnit = +unitType === 4;
    const isOperation = +unitType === 3;
    const listPath = pathname.replace(new RegExp(`${name}.*`), 'list');
    if (b) {
      breadcrumbList =
        typeof b === 'function'
          ? b({
              isUnit,
              isOperation,
              unitId,
              unitType,
              title:
                locales[
                  `menu.${code
                    .split('.')
                    .slice(0, -1)
                    .join('.')}.${name}`
                ],
            })
          : b;
    } else {
      ({ breadcrumbList } = code.split('.').reduce(
        (result, item, index, list) => {
          const key = `${result.key}.${item}`;
          const title = locales[key];
          result.key = key;
          result.breadcrumbList.push({
            title,
            name: title,
            href: index === list.length - 2 ? listPath : undefined,
          });
          return result;
        },
        {
          breadcrumbList: [{ title: '首页', name: '首页', href: '/' }],
          key: 'menu',
        }
      ));
    }
    return {
      isUnit,
      isOperation,
      unitId,
      unitType,
      currentUser,
      breadcrumbList,
      detail: name !== 'add' && detail ? detail : undefined,
      loading: loading || loading2 || false,
      mode: name,
      hasEditAuthority: permissionCodes.includes(code.replace(/[^\.]+$/, 'edit')),
      editPath: pathname.replace(new RegExp(`${name}.*`), `edit/${id}`),
      listPath,
    };
  },
  (
    dispatch,
    {
      route: { code },
      match: {
        params: { id },
      },
      mapper,
    }
  ) => {
    const {
      namespace = code.split('.').slice(-2)[0],
      getDetail: gd = 'getDetail',
      add: a = 'add',
      edit: e = 'edit',
    } = mapper || {};
    return {
      getDetail(payload, callback) {
        dispatch({
          type: `${namespace}/${gd}`,
          payload: {
            id,
            ...payload,
          },
          callback,
        });
      },
      handler(payload, callback) {
        dispatch({
          type: id ? `${namespace}/${e}` : `${namespace}/${a}`,
          payload: {
            id,
            ...payload,
          },
          callback,
        });
      },
    };
  },
  (stateProps, dispatchProps, ownProps) => ({
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
  }),
  {
    areStatesEqual: () => false,
    areOwnPropsEqual: () => false,
    areStatePropsEqual: () => false,
    areMergedPropsEqual: (props, nextProps) => {
      return (
        props.detail === nextProps.detail &&
        props.loading === nextProps.loading &&
        props.mode === nextProps.mode &&
        props.children === nextProps.children &&
        props.hack === nextProps.hack &&
        isEqual(props.params, nextProps.params)
      );
    },
  }
)(FormPage);
