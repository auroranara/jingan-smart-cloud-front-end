import React, { PureComponent } from 'react';
import classNames from 'classnames';
import rotate from '../Animate.less';
import styles from '../Government.less';

class FullStaff extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    const { visible, goBack, fulltimeWorker, listData = [] } = this.props;
    const stylesVisible = classNames(styles.sectionWrapper, rotate.flip, {
      [rotate.in]: visible,
      [rotate.out]: !visible,
    });
    return (
      <section
        className={stylesVisible}
        style={{ position: 'absolute', top: 0, left: '6px', width: 'calc(100% - 12px)' }}
      >
        <div className={styles.sectionWrapperIn}>
          <div className={styles.sectionTitle}>
            <span className={styles.titleBlock} />
            监管人员
          </div>
          <div
            className={styles.backBtn}
            onClick={() => {
              goBack();
            }}
          />
          <div className={styles.sectionMain}>
            <div className={styles.sectionContent}>
              <div className={styles.tableTitleWrapper}>
                <span className={styles.tableTitle}>
                  {' '}
                  监管人员（
                  {fulltimeWorker}）
                </span>
              </div>
              <div className={styles.scrollContainer}>
                <table className={styles.scrollTable}>
                  <thead>
                    <tr>
                      <th />
                      <th style={{ width: '26%' }}>姓名</th>
                      <th style={{ width: '35%' }}>电话</th>
                      <th>管辖社区</th>
                    </tr>
                  </thead>
                  <tbody>
                    {listData.map((item, index) => {
                      return (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{item.user_name}</td>
                          <td>{item.phone_number}</td>
                          <td>{item.gridName ? item.gridName.split(',').join('/') : ''}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default FullStaff;
