import React, { Fragment } from 'react';
import { Row, Col } from 'antd';
import { connect } from 'dva';
import styles from './Company.less';
import Timer from './Components/Timer';

class CompanyLayout extends React.PureComponent {

  render() {
    return (
      <div className={styles.main}>
        <header className={styles.mainHeader}>
          <span>晶安智慧安全云平台</span>
          <div className={styles.subHeader}><Timer /></div>
        </header>
      </div>
    );
  }
}

export default CompanyLayout;
