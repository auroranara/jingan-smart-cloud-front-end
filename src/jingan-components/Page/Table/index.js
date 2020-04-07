import React, { useEffect, useState, useImperativeHandle, useRef } from 'react';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import { Button, Popconfirm } from 'antd';
import Form from '@/jingan-components/Form';
import { Link, Table } from '@/jingan-components/View';
import { connect } from 'dva';
import locales from '@/locales/zh-CN';
import { kebabCase } from 'lodash';
import { getPageSize, setPageSize } from '@/utils/utils';
import styles from './index.less';

const TablePage = props => {
  const {
    breadcrumbList,
    children,
    list,
    loading,
    getList,
    fields,
    columns,
    transform,
    isUnit,
    unitId,
    formOperation,
    tableAction,
    tableOperation,
    formRef,
    tableRef,
    showAddButton = true,
    showExportButton,
  } = props;
  const [values, setValues] = useState(undefined);
  const form = useRef(null);
  useImperativeHandle(formRef, () => form.current);
  const reload = () => {
    const { pagination: { pageSize = getPageSize() } = {} } = list;
    getList({
      ...(transform
        ? transform({
            isUnit,
            unitId,
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
            unitId,
            ...values,
          })
        : values),
    });
  }, []);
  const columnList =
    typeof columns === 'function'
      ? columns({
          isUnit,
          unitId,
          ...(tableOperation || []).reduce(
            (result, { code: codeName, children, onClick, to }) => {
              const upperName = codeName.includes('.')
                ? codeName
                    .split('.')
                    .slice(-2)
                    .map(v => `${v[0].toUpperCase()}${v.slice(1)}`)
                    .join('')
                : `${codeName[0].toUpperCase()}${codeName.slice(1)}`;
              result[`render${upperName}Button`] = data => (
                <Link
                  to={
                    !onClick ? (to ? to(data) : `${props.editPath}/${data.id || data}`) : undefined
                  }
                  onClick={onClick ? () => onClick(data) : undefined}
                  disabled={!props[`has${upperName}Authority`]}
                >
                  {children}
                </Link>
              );
              return result;
            },
            {
              renderEditButton: data => (
                <Link
                  to={`${props.editPath}/${data.id || data}`}
                  disabled={!props.hasEditAuthority}
                >
                  编辑
                </Link>
              ),
              renderDetailButton: data => (
                <Link
                  to={`${props.detailPath}/${data.id || data}`}
                  disabled={!props.hasDetailAuthority}
                >
                  查看
                </Link>
              ),
              renderDeleteButton: data => (
                <Popconfirm
                  title="您确定要删除吗?"
                  onConfirm={() =>
                    props.delete(data, success => {
                      if (success) {
                        reload();
                      }
                    })
                  }
                  disabled={!props.hasDeleteAuthority}
                >
                  <Link to="/">删除</Link>
                </Popconfirm>
              ),
            }
          ),
        })
      : columns;
  return (
    <PageHeaderLayout
      title={breadcrumbList[breadcrumbList.length - 1].title}
      breadcrumbList={breadcrumbList}
    >
      <Form
        ref={form}
        fields={fields}
        params={{
          isUnit,
          unitId,
        }}
        onSearch={values => {
          const {
            pagination: { pageSize },
          } = list;
          setValues(values);
          getList({
            ...(transform
              ? transform({
                  isUnit,
                  unitId,
                  ...values,
                })
              : values),
            pageSize,
          });
        }}
        onReset={values => {
          const {
            pagination: { pageSize },
          } = list;
          setValues(values);
          getList({
            ...(transform
              ? transform({
                  isUnit,
                  unitId,
                  ...values,
                })
              : values),
            pageSize,
          });
        }}
      />
      <Table
        list={list}
        loading={loading}
        columns={columnList}
        onChange={({ current, pageSize }) => {
          const {
            pagination: { pageSize: prevPageSize },
          } = list;
          getList({
            ...(transform
              ? transform({
                  isUnit,
                  unitId,
                  ...values,
                })
              : values),
            pageNum: pageSize !== prevPageSize ? 1 : current,
            pageSize,
          });
          // values ? form.current.setFieldsValue(values) : form.current.resetFields();
          pageSize !== prevPageSize && setPageSize(pageSize);
        }}
        operation={(tableAction || []).reduce((result, { code: codeName, ...rest }) => {
          const upperName = codeName.includes('.')
            ? codeName
                .split('.')
                .slice(-2)
                .map(v => `${v[0].toUpperCase()}${v.slice(1)}`)
                .join('')
            : `${codeName[0].toUpperCase()}${codeName.slice(1)}`;
          result.push(<Button disabled={!props[`has${upperName}Authority`]} {...rest} />);
          return result;
        }, [])}
        onReload={reload}
        showAddButton={showAddButton}
        showExportButton={showExportButton}
        addPath={props.addPath}
        hasAddAuthority={props.hasAddAuthority}
      />
      {children}
    </PageHeaderLayout>
  );
};

export default connect(
  (
    state,
    {
      route: { name, code },
      location: { pathname },
      mapper,
      breadcrumbList: b,
      formOperation,
      tableAction,
      tableOperation,
    }
  ) => {
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
      ({ breadcrumbList } = code
        .split('.')
        .slice(0, -1)
        .reduce(
          (result, item) => {
            const key = `${result.key}.${item}`;
            const title = locales[key];
            result.key = key;
            result.breadcrumbList.push({
              title,
              name: title,
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
      list: list || {},
      loading: loading || deleting || exporting || false,
      ...[
        { code: 'add' },
        { code: 'edit' },
        { code: 'detail' },
        { code: 'delete' },
        { code: 'export' },
      ]
        .concat(formOperation || [])
        .concat(tableAction || [])
        .concat(tableOperation || [])
        .reduce((result, { code: codeName }) => {
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
  (dispatch, { route: { code }, mapper, params }) => {
    const {
      namespace = code.split('.').slice(-2)[0],
      getList: gl = 'getList',
      delete: d = 'delete',
      export: e = 'export',
    } = mapper || {};
    return {
      getList(payload, callback) {
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
      delete(payload, callback) {
        dispatch({
          type: `${namespace}/${d}`,
          payload,
          callback,
        });
      },
      export(payload, callback) {
        dispatch({
          type: `${namespace}/${e}`,
          payload,
          callback,
        });
      },
    };
  }
)(TablePage);
