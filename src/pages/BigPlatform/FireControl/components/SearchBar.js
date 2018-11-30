import React, { PureComponent } from 'react';
import { Col, Input, Row } from 'antd';

import styles from './SearchBar.less';

const { Search } = Input;

export default class SearchBar extends PureComponent {
  handleSearch = value => {
    console.log(value);
  };

  render() {
    const { placeholder="请输入单位名称", hideSearch, extra, children, ...restProps } = this.props;

    return (
      <div className={styles.container} {...restProps}>
        {!hideSearch && (
          <Row style={{ marginBottom: 12 }}>
            <Col span={extra ? 18 : 24}>
              <Search
                placeholder={placeholder}
                onSearch={this.handleSearch}
                enterButton
              />
            </Col>
            <Col span={extra ? 6 : 0} style={{ position: 'relative' }}>
              {extra}
            </Col>
          </Row>
        )}
        <div className={styles.cardsContainer}>
          {children}
        </div>
      </div>
    );
  }
}
