import React, { PureComponent } from 'react';
import classNames from 'classnames';
import rotate from '../Animate.less';
import styles from '../Government.less';

class CompanyIn extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    const {
      visible,
      goBack,
      goCompany,
      searchAllCompany: { dataUnimportantCompany = [], dataImportant = [] },
    } = this.props;
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
            单位统计
          </div>
          <div
            className={styles.backBtn}
            onClick={() => {
              goBack();
            }}
          />
          <div className={styles.sectionMain}>
            <div className={styles.sectionContent} style={{ height: '50%' }}>
              <div className={styles.tableTitleWrapper}>
                <span className={styles.tableTitle}>
                  {' '}
                  重点单位（
                  {dataImportant.length}）
                </span>
              </div>
              <div className={styles.scrollContainer}>
                {dataImportant.map((item, index) => {
                  return (
                    <div
                      className={styles.scrollCol1}
                      key={item.id}
                      onClick={() => {
                        goCompany(item.id);
                      }}
                    >
                      <span className={styles.scrollOrder}>{index + 1}</span>
                      {item.name}
                      {/* <Ellipsis
                                lines={1}
                                style={{ maxWidth: '72%', margin: '0 auto' }}
                                tooltip
                              >
                                {item.name}
                              </Ellipsis> */}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className={styles.sectionContent} style={{ height: '50%' }}>
              <div className={styles.tableTitleWrapper}>
                <span className={styles.tableTitle}>
                  {' '}
                  非重点单位（
                  {dataUnimportantCompany.length}）
                </span>
              </div>
              <div className={styles.scrollContainer}>
                {dataUnimportantCompany.map((item, index) => {
                  return (
                    <div
                      className={styles.scrollCol1}
                      key={item.id}
                      onClick={() => {
                        goCompany(item.id);
                      }}
                    >
                      <span className={styles.scrollOrder}>{index + 1}</span>
                      {item.name}
                      {/* <Tooltip
                                placement="bottom"
                                style={{
                                  maxWidth: '72%',
                                  margin: '0 auto',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                }}
                                title={item.name}
                              >
                                {item.name}
                              </Tooltip> */}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default CompanyIn;
