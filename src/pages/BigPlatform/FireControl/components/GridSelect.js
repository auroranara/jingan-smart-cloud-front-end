import React, { PureComponent } from 'react';
import router from 'umi/router';
import { TreeSelect } from 'antd';

import styles from './GridSelect.less';
// import { TREE_DATA } from './utils';

const FONT_SIZE = 18;

export default class GridSelect extends PureComponent {
  state = {
    // treeValue: TREE_DATA[0].key,
    treeValue: '',
  };

  componentDidMount() {
    const { dispatch, gridId } = this.props;
    const isIndex = !gridId;

    // 是首页则获取网格点数组后第一个，不是首页则将值设为传入的gridId
    !isIndex && this.setState({ treeValue: gridId });

    dispatch({
      type: 'bigFireControl/fetchGrids',
      callback: isIndex ? data => this.setState({ treeValue: data && data.length ? data[0].key : '' }) : null,
    });
  }

  onChange = value => {
    // console.log(value);
    const { treeValue: formerValue } = this.state;

    // 选择的值与之前相同时，不做处理
    if (value === formerValue)
      return;

    this.setState({ treeValue: value });
    router.push(`/big-platform/fire-control/government/${value}`);
    location.reload();
  };

  render() {
    const { data } = this.props;
    const { treeValue } = this.state;

    // 对data进行处理，data不为数组或为空数组则赋为含有一个暂无信息元素的数组
    const list = Array.isArray(data) && data.length ? data : [{ title: '暂无信息' }];

    return (
      <div className={styles.treeContainer}>
        {list.length > 0 ? (
          <TreeSelect
            style={{ width: 300, fontSize: FONT_SIZE }}
            value={treeValue}
            // dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            dropdownClassName={styles.dropdown}
            // treeData={TREE_DATA}
            treeData={list}
            treeDefaultExpandAll
            onChange={this.onChange}
          />
        ) : list[0].title}
      </div>
    );
  }
}
