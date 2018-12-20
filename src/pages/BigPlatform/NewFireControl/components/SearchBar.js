import React from 'react';
import { Col, Input, Row } from 'antd';

import styles from './SearchBar.less';

const { Search } = Input;

export default function SearchBar(props) {
  const {
    placeholder="请输入单位名称",
    hideSearch,
    extra,
    children,
    searchStyle,
    onSearch,
    // onChange,
    // value,
    ...restProps
  } = props;

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
      <div className={styles.cardsContainer}>
        {children}
      </div>
    </div>
  );
}
