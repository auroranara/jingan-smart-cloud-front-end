import React, { PureComponent } from 'react';
import router from 'umi/router';
import { connect } from 'dva';
import { Select } from 'antd';

import styles from './GridSelect.less';

const FONT_SIZE = 16;
const { Option } = Select;

@connect(({ gridSelect }) => ({ grid: gridSelect }))
export default class GridSelect extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;

    dispatch({ type: 'gridSelect/fetchGrids' });
  }

  onChange = value => {
    const { urlBase } = this.props;

    // 选择的值与之前相同时，不做处理
    // if (value === formerValue)
    //   return;

    router.push(`${urlBase}/${value}`);
    location.reload();
  };

  render() {
    const { grid: { grids }, gridId } = this.props;

    // 对data进行处理，data不为数组或为空数组则赋为含有一个暂无信息元素的数组
    const list = grids.length ? grids : [{ title: '暂无信息' }];

    return (
      <div className={styles.container}>
        {list.length > 1 ? (
          <Select
            style={{ width: 300, fontSize: FONT_SIZE }}
            value={gridId}
            dropdownClassName={styles.dropdown}
            treeDefaultExpandAll
            onChange={this.onChange}
          >
            {grids.map(({ title, value }) => <Option value={value} key={value}>{title}</Option>)}
          </Select>
        ) : list[0].title}
      </div>
    );
  }
}
