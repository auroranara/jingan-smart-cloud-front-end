import React, { PureComponent } from 'react';
import { TreeSelect } from 'antd';
import classNames from 'classnames';
import styles from './index.less';

const { TreeNode } = TreeSelect;
const DEFAULT_FIELD_NAMES = {
  key: 'key',
  value: 'value',
  children: 'children',
};
const renderTreeNodes = (data, fieldNames) => {
  const { key, value, children } = { ...DEFAULT_FIELD_NAMES, ...fieldNames };
  const treeNodeRenderer = data => (data || []).map(({ [key]: k, [value]: v, [children]: c }) => c ? (
    <TreeNode title={v} key={k} value={k}>
      {treeNodeRenderer(c)}
    </TreeNode>
  ) : (
    <TreeNode title={v} key={k} value={k} />
  ));
  return treeNodeRenderer(data);
};

export default class CustomTreeSelect extends PureComponent {
  render() {
    const {
      data,
      fieldNames,
      children,
      dropdownClassName,
      ...restProps
    } = this.props;

    return (
      <TreeSelect
        placeholder="请选择"
        allowClear
        dropdownClassName={classNames(styles.treeSelectDropDown, dropdownClassName)}
        {...restProps}
      >
        {children || renderTreeNodes(data, fieldNames)}
      </TreeSelect>
    );
  }
};
