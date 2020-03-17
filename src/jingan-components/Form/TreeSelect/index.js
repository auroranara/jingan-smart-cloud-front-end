import React, { Component } from 'react';
import { TreeSelect, Spin } from 'antd';
import Ellipsis from '@/components/Ellipsis';
import EmptyText from '@/jingan-components/View/EmptyText';
import { connect } from 'dva';
import classNames from 'classnames';
import styles from './index.less';
const { TreeNode } = TreeSelect;

const FIELDNAMES = {
  key: 'key',
  value: 'value',
  children: 'children',
  disabled: 'disabled',
  disableCheckbox: 'disableCheckbox',
  selectable: 'selectable',
  checkable: 'checkable',
};

@connect(
  (state, { mapper }) => {
    const { namespace, list, getList } = mapper || {};
    return {
      list: namespace && list ? state[namespace][list] : [],
      loading: namespace && getList ? state.loading.effects[`${namespace}/${getList}`] : false,
    };
  },
  null,
  (stateProps, { dispatch }, { mapper, params, ...ownProps }) => {
    const { namespace, getList } = mapper || {};
    return {
      ...stateProps,
      ...ownProps,
      getList:
        namespace && getList
          ? (payload, callback) => {
              dispatch({
                type: `${namespace}/${getList}`,
                payload: {
                  ...params,
                  ...payload,
                },
                callback,
              });
            }
          : undefined,
    };
  }
)
export default class FormTreeSelect extends Component {
  componentDidMount() {
    const { getList } = this.props;
    getList && getList();
  }

  shouldComponentUpdate(nextProps) {
    return (
      nextProps.value !== this.props.value ||
      nextProps.list !== this.props.list ||
      nextProps.loading !== this.props.loading ||
      nextProps.mode !== this.props.mode
    );
  }

  getValueByKey = (list, key) => {
    const { fieldNames } = this.props;
    const { key: k, value: v, children: c } = { ...FIELDNAMES, ...fieldNames };
    for (let i = 0; i < list.length; i++) {
      if (list[i][k] === key) {
        return list[i][v];
      } else if (list[i][c]) {
        const value = this.getValueByKey(list[i][c], key);
        if (value) {
          return value;
        }
      }
    }
    return;
  };

  renderTreeNodes = list => {
    const { fieldNames } = this.props;
    const { key: k, value: v, children: c } = { ...FIELDNAMES, ...fieldNames };
    return list.map(item => (
      <TreeNode
        key={item[k]}
        value={item[k]}
        title={item[v]}
        children={item[c] && item[c].length ? this.renderTreeNodes(item[c]) : undefined}
        data={item}
      />
    ));
  };

  render() {
    const {
      className,
      value,
      mode = 'add',
      fieldNames,
      list = [],
      loading = false,
      placeholder = '请选择',
      treeNodeFilterProp = 'children',
      emtpy = <EmptyText />,
      ellipsis = true,
      ...restProps
    } = this.props;

    if (mode !== 'detail') {
      return (
        <TreeSelect
          className={classNames(styles.container, className)}
          placeholder={placeholder}
          value={value}
          notFoundContent={loading ? <Spin size="small" /> : undefined}
          treeNodeFilterProp={treeNodeFilterProp}
          {...restProps}
        >
          {this.renderTreeNodes(list || [])}
        </TreeSelect>
      );
    } else {
      const label = this.getValueByKey(list || [], value);
      return label ? (
        ellipsis ? (
          <Ellipsis lines={1} tooltip {...ellipsis}>
            {label}
          </Ellipsis>
        ) : (
          <span>{label}</span>
        )
      ) : (
        emtpy
      );
    }
  }
}
