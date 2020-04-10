import React, { useEffect, useImperativeHandle, useRef } from 'react';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import { Spin } from 'antd';
import Form from '@/jingan-components/Form';
import { connect } from 'dva';
import router from 'umi/router';
import locales from '@/locales/zh-CN';
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
    unitId,
    formRef,
    hasEditAuthority,
    editPath,
    listPath,
    getDetail,
    initialize,
    handler,
    transform,
    loading,
    submitting,
    labelCol,
    wrapperCol,
    initialValues,
  } = props;
  const form = useRef(null);
  useImperativeHandle(formRef, () => form.current);
  useEffect(
    () => {
      if (id) {
        getDetail(undefined, (success, data) => {
          if (success) {
            form.current.setFieldsValue(initialize ? initialize(data) : data);
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
            unitId,
          }}
          hasEditAuthority={hasEditAuthority}
          editPath={editPath}
          listPath={listPath}
          onSubmit={values => {
            handler(
              {
                ...(transform
                  ? transform({
                      isUnit,
                      unitId,
                      ...values,
                    })
                  : values),
              },
              success => {
                if (success) {
                  router.push(listPath);
                }
              }
            );
          }}
          submitting={submitting}
          labelCol={labelCol}
          wrapperCol={wrapperCol}
          initialValues={initialValues}
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
        currentUser: { unitType, unitId, permissionCodes },
      },
      [namespace]: { [d]: detail },
      loading: {
        effects: {
          [`${namespace}/${gd}`]: loading,
          [`${namespace}/${a}`]: adding,
          [`${namespace}/${e}`]: editing,
        },
      },
    } = state;
    const isUnit = +unitType === 4;
    const listPath = pathname.replace(new RegExp(`${name}.*`), 'list');
    if (b) {
      breadcrumbList =
        typeof b === 'function'
          ? b({
              isUnit,
              unitId,
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
      unitId,
      breadcrumbList,
      detail: detail || {},
      loading: loading || false,
      submitting: adding || editing || false,
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
  }
)(FormPage);
