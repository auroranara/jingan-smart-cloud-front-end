import React, { PureComponent } from 'react';
import { Col, Input, Row } from 'antd';

import styles from './SearchBar.less';

const { Search } = Input;

export default class SearchBar extends PureComponent {
  // 滚动到选择的卡片处，默认不滚动
  componentDidMount() {
    const { selectedIndex } = this.props;
    if (!selectedIndex)
      return;

    const container = this.container;
    const target = container.children[selectedIndex];
    const top = target.offsetTop;
    container.scrollTo(0, top);
  }

  container = null;

  render() {
    const {
      placeholder="请输入单位名称",
      hideSearch,
      extra,
      children,
      searchStyle,
      onSearch,
      selectedIndex,
      // onChange,
      // value,
      ...restProps
    } = this.props;

    return (
      <div className={styles.container} {...restProps}>
        <Row style={{ marginBottom: 12, ...searchStyle }}>
          <Col span={extra ? 18 : 24}>
              {!hideSearch && (
                <Search
                  // value={value}
                  placeholder={placeholder}
                  onSearch={onSearch}
                  // onChange={onChange}
                  enterButton
                />
              )}
          </Col>
          <Col span={extra ? 6 : 0} style={{ position: 'relative', height: 32 }}>
            {extra}
          </Col>
        </Row>
        <div className={styles.cardsContainer} ref={node => this.container = node}>
          {children}
        </div>
      </div>
    );
  }
}
