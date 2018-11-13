import React, { Fragment } from 'react';
import { Row, Col } from 'antd';
import { connect } from 'dva';
import styles from './Company.less';
import Timer from './Components/Timer';
const { projectName } = global.PROJECT_CONFIG;
class CompanyLayout extends React.PureComponent {
  render() {
    return (
      <div className={styles.main}>
        <header className={styles.mainHeader}>
          <span>{projectName}</span>
          <div className={styles.subHeader}>
            <Timer />
          </div>
        </header>
      </div>
    );
  }
}

export default CompanyLayout;
