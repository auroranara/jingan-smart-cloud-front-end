import React, { useEffect, useState } from 'react';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import { Card, Spin, Table, Empty } from 'antd';
import Form from '@/jingan-components/Form';
import { Link } from '@/jingan-components/View';
import { connect } from 'dva';
import classNames from 'classnames';
import locales from '@/locales/zh-CN';
import { getPageSize, setPageSize } from '@/utils/utils';
import styles from './index.less';

const PAGE_SIZE_OPTIONS = ['5', '10', '15', '20'];

const TablePage = props => {
  const {
    breadcrumbList,
    children,
    list: { list = [], pagination: { total = 0, pageNum = 1, pageSize = getPageSize() } = {} },
    loading,
    getList,
    fields,
    columns,
    formProps = {},
    tableProps = {},
    transform,
  } = props;
  const [values, setValues] = useState(undefined);
  useEffect(() => {
    getList({
      ...(transform ? transform({ ...values }) : values),
    });
  }, []);
  let columnList = columns || tableProps.columns;
  columnList = typeof columnList === 'function' ? columnList(props) : columnList;
  return (
    <PageHeaderLayout
      title={breadcrumbList[breadcrumbList.length - 1].title}
      breadcrumbList={breadcrumbList}
    >
      <Form
        onSearch={values => {
          setValues(values);
          getList({
            ...(transform ? transform({ ...values }) : values),
            pageSize,
          });
        }}
        onReset={() => {
          setValues(values);
          getList({
            ...(transform ? transform({ ...values }) : values),
            pageSize,
          });
        }}
        {...formProps}
        fields={fields || formProps.fields}
      />
      <Card className={styles.tableCard}>
        <Spin spinning={loading}>
          {list && list.length ? (
            <Table
              dataSource={list}
              rowKey="id"
              scroll={{
                x: true,
              }}
              {...tableProps}
              className={classNames(styles.table, tableProps.className)}
              columns={columnList}
              pagination={{
                total,
                current: pageNum,
                pageSize,
                pageSizeOptions: PAGE_SIZE_OPTIONS,
                showTotal: total => `共 ${total} 条记录`,
                showQuickJumper: true,
                showSizeChanger: true,
                ...tableProps.pagination,
              }}
              onChange={({ current, pageSize: nextPageSize }) => {
                getList({
                  ...(transform ? transform({ ...values }) : values),
                  pageNum: pageSize !== nextPageSize ? 1 : current,
                  pageSize: nextPageSize,
                });
                // 这里缺了还原values的操作，以后有空加上
                pageSize !== nextPageSize && setPageSize(nextPageSize);
              }}
            />
          ) : (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          )}
        </Spin>
      </Card>
      {children}
    </PageHeaderLayout>
  );
};

export default connect(
  (state, { route: { name, code }, mapper, breadcrumbList: b, operation }) => {
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
      hasAddAuthority: permissionCodes.includes(code.replace(/[^\.]+$/, 'add')),
      hasEditAuthority: permissionCodes.includes(code.replace(/[^\.]+$/, 'edit')),
      hasDetailAuthority: permissionCodes.includes(code.replace(/[^\.]+$/, 'detail')),
      hasDeleteAuthority: permissionCodes.includes(code.replace(/[^\.]+$/, 'delete')),
      hasExportAuthority: permissionCodes.includes(code.replace(/[^\.]+$/, 'export')),
      ...(operation &&
        operation.reduce((result, { code: codeName }) => {
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
          }
          return result;
        }, {})),
    };
  },
  (dispatch, { route: { code }, mapper }) => {
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
