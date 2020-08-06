import React, { useEffect, useState, useImperativeHandle, useRef } from 'react';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import { Button, Popconfirm } from 'antd';
import Form from '@/jingan-components/Form';
import { Link, Table } from '@/jingan-components/View';
import { connect } from 'dva';
import locales from '@/locales/zh-CN';
import { kebabCase } from 'lodash';
import { getPageSize, setPageSize } from '@/utils/utils';
// import styles from './index.less';

const TablePage = props => {
  const {
    breadcrumbList,
    content,
    children,
    list,
    loading,
    getList,
    fields,
    columns,
    transform,
    isUnit,
    isOperation,
    unitId,
    unitType,
    currentUser,
    formRef,
    tableRef,
    showAddButton = true,
    showExportButton,
    initialValues,
    codes,
    banner,
    operation,
  } = props;
  const [values, setValues] = useState(initialValues);
  const form = useRef(null);
  useImperativeHandle(formRef, () => form.current);
  const reload = () => {
    const { pagination: { pageSize = getPageSize() } = {} } = list || {};
    getList({
      ...(transform
        ? transform({
          isUnit,
          isOperation,
          unitId,
          unitType,
          currentUser,
          ...values,
        })
        : values),
      pageSize,
    });
  };
  useImperativeHandle(tableRef, () => ({
    reload,
  }));
  useEffect(() => {
    getList({
      ...(transform
        ? transform({
          isUnit,
          isOperation,
          unitId,
          unitType,
          currentUser,
          ...values,
        })
        : values),
    });
  }, []);
  const columnList =
    typeof columns === 'function'
      ? columns({
        isUnit,
        isOperation,
        unitId,
        unitType,
        currentUser,
        list,
        renderEditButton: (data, { children, disabled, ...rest } = {}) => (
          <Link
            to={`${props.editPath}/${data.id || data}`}
            disabled={!props.hasEditAuthority || disabled}
            target="_blank"
            {...rest}
          >
            {children || '编辑'}
          </Link>
        ),
        renderDetailButton: (data, { children, disabled, ...rest } = {}) => (
          <Link
            to={`${props.detailPath}/${data.id || data}`}
            disabled={!props.hasDetailAuthority || disabled}
            target="_blank"
            {...rest}
          >
            {children || '查看'}
          </Link>
        ),
        renderDeleteButton: (data, { children, disabled, ...rest } = {}) => (
          <Popconfirm
            title="您确定要删除吗?"
            placement="topRight"
            onConfirm={() =>
              props.delete(data, success => {
                if (success) {
                  reload();
                }
              })
            }
            disabled={!props.hasDeleteAuthority || disabled}
          >
            <Link to="/" disabled={!props.hasDeleteAuthority || disabled} {...rest}>
              {children || '删除'}
            </Link>
          </Popconfirm>
        ),
        ...(codes || []).reduce((result, codeName) => {
          const upperName = codeName.includes('.')
            ? codeName
              .split('.')
              .slice(-2)
              .map(v => `${v[0].toUpperCase()}${v.slice(1)}`)
              .join('')
            : `${codeName[0].toUpperCase()}${codeName.slice(1)}`;
          result[`render${upperName}Button`] = (
            data,
            { children, disabled, onClick, to, popconfirm, ...rest } = {}
          ) => {
            const realDisabled = !props[`has${upperName}Authority`] || disabled;
            const link = (
              <Link
                to={
                  !onClick
                    ? typeof to === 'function'
                      ? to(data, props[`${codeName}Path`])
                      : `${to || props[`${codeName}Path`]}/${data.id || data}`
                    : '/'
                }
                onClick={onClick}
                disabled={realDisabled}
                {...rest}
              >
                {children}
              </Link>
            );
            return popconfirm ? (
              <Popconfirm
                placement="topRight"
                onConfirm={() =>
                  props[codeName](data, success => {
                    if (success) {
                      reload();
                    }
                  })
                }
                disabled={realDisabled}
                {...popconfirm}
              >
                {link}
              </Popconfirm>
            ) : (
                link
              );
          };
          return result;
        }, {}),
      })
      : columns;
  return (
    <PageHeaderLayout
      title={breadcrumbList[breadcrumbList.length - 1].title}
      breadcrumbList={breadcrumbList}
      content={typeof content === 'function' ? content({ list }) : content}
    >
      <Form
        ref={form}
        fields={fields}
        params={{
          isUnit,
          isOperation,
          unitId,
          unitType,
          currentUser,
        }}
        onSearch={values => {
          const { pagination: { pageSize = getPageSize() } = {} } = list || {};
          setValues(values);
          getList({
            ...(transform
              ? transform({
                isUnit,
                isOperation,
                unitId,
                unitType,
                currentUser,
                ...values,
              })
              : values),
            pageSize,
          });
        }}
        onReset={values => {
          const { pagination: { pageSize = getPageSize() } = {} } = list || {};
          setValues(values);
          getList({
            ...(transform
              ? transform({
                isUnit,
                isOperation,
                unitId,
                unitType,
                currentUser,
                ...values,
              })
              : values),
            pageSize,
          });
        }}
        initialValues={initialValues}
      />
      <Table
        list={list}
        loading={loading}
        columns={columnList}
        onChange={({ current, pageSize }, _, sorter) => {
          const { pagination: { pageSize: prevPageSize } = {} } = list || {};
          getList({
            ...(transform
              ? transform({
                isUnit,
                isOperation,
                unitId,
                unitType,
                currentUser,
                sorter,
                ...values,
              })
              : values),
            pageNum: pageSize !== prevPageSize || sorter.field ? 1 : current,
            pageSize,
          });
          values ? form.current.setFieldsValue(values) : form.current.resetFields();
          pageSize !== prevPageSize && setPageSize(pageSize);
        }}
        onReload={reload}
        showAddButton={showAddButton}
        showExportButton={showExportButton}
        addPath={props.addPath}
        hasAddAuthority={props.hasAddAuthority}
        banner={typeof banner === 'function' ? banner({ list }) : banner}
        operation={operation}
      />
      {children}
    </PageHeaderLayout>
  );
};

export default connect(
  (state, { route: { name, code }, location: { pathname }, mapper, breadcrumbList: b, codes }) => {
    const {
      namespace = code.split('.').slice(-2)[0],
      list: l = 'list',
      getList: gl = 'getList',
      delete: d = 'delete',
      export: e = 'export',
    } = mapper || {};
    let breadcrumbList;
    const {
      user: {
        currentUser,
        currentUser: { unitType, unitId, permissionCodes },
      },
      [namespace]: { [l]: list },
      loading: {
        effects: {
          [`${namespace}/${gl}`]: loading,
          [`${namespace}/${d}`]: deleting,
          [`${namespace}/${e}`]: exporting,
        },
      },
    } = state;
    const isUnit = +unitType === 4;
    const isOperation = +unitType === 3;
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
      let count = 0;
      const codeList = code.split('.');
      ({ breadcrumbList } = codeList.slice(0, -1).reduce(
        (result, item, index) => {
          const key = `${result.key}.${item}`;
          const title = locales[key];
          result.key = key;
          let href, other;
          if (item === 'list') {
            count += 1;
            href = pathname
              .split('list')
              .slice(0, count)
              .join('list');
          }
          if (index === codeList.length - 2 && codeList[codeList.length - 1] !== 'list') {
            href = pathname.replace(new RegExp(`${name}.*`), 'list');
            const title = locales[`${key}.${codeList[codeList.length - 1]}`];
            other = {
              title,
              name: title,
            };
          }
          result.breadcrumbList.push({
            title,
            name: title,
            href,
          });
          if (other) {
            result.breadcrumbList.push(other);
          }
          return result;
        },
        {
          breadcrumbList: [{ title: '首页', name: '首页', href: '/' }],
          key: 'menu',
        }
      ));
    }
    const codesLoading = (codes || []).reduce((result, codeName) => {
      return result || state.loading.effects[`${namespace}/${codeName}`];
    }, false);
    return {
      isUnit,
      isOperation,
      unitId,
      unitType,
      currentUser,
      breadcrumbList,
      list,
      loading: loading || deleting || exporting || codesLoading || false,
      ...['add', 'edit', 'detail', 'delete', 'export']
        .concat(codes || [])
        .reduce((result, codeName) => {
          if (codeName.includes('.')) {
            result[
              `has${codeName
                .split('.')
                .slice(-2)
                .map(v => `${v[0].toUpperCase()}${v.slice(1)}`)
                .join('')}Authority`
            ] = permissionCodes.includes(codeName);
          } else {
            result[
              `has${codeName[0].toUpperCase()}${codeName.slice(1)}Authority`
            ] = permissionCodes.includes(code.replace(/[^\.]+$/, codeName));
            result[`${codeName}Path`] = pathname.replace(
              new RegExp(`${name}.*`),
              kebabCase(codeName)
            );
          }
          return result;
        }, {}),
    };
  },
  (dispatch, { route: { code }, match: { params }, mapper, codes }) => {
    const {
      namespace = code.split('.').slice(-2)[0],
      getList: gl = 'getList',
      delete: d = 'delete',
      export: e = 'export',
    } = mapper || {};
    return {
      getList (payload, callback) {
        dispatch({
          type: `${namespace}/${gl}`,
          payload: {
            pageNum: 1,
            pageSize: getPageSize(),
            ...params,
            ...payload,
          },
          callback,
        });
      },
      delete (payload, callback) {
        dispatch({
          type: `${namespace}/${d}`,
          payload,
          callback,
        });
      },
      export (payload, callback) {
        dispatch({
          type: `${namespace}/${e}`,
          payload,
          callback,
        });
      },
      ...(codes || []).reduce((result, codeName) => {
        result[codeName] = (payload, callback) => {
          dispatch({
            type: `${namespace}/${codeName}`,
            payload,
            callback,
          });
        };
        return result;
      }, {}),
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
        props.list === nextProps.list &&
        props.loading === nextProps.loading &&
        props.children === nextProps.children
      );
    },
  }
)(TablePage);
