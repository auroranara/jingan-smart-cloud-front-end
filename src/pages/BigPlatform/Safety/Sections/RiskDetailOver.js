import React, { PureComponent } from 'react';
import classNames from 'classnames';
import rotate from '../Animate.less';
import styles from '../Government.less';
import CompanyRisk from '../Components/CompanyRisk';

class RiskDetailOver extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    // const {} = this.state;
    const { visible, goBack, hiddenDangerListByDate } = this.props;
    const stylesRiskDetail = classNames(styles.sectionWrapper, rotate.flip, {
      [rotate.in]: visible,
      [rotate.out]: !visible,
    });
    return (
      <section
        className={stylesRiskDetail}
        style={{ position: 'absolute', top: 0, left: '6px', width: 'calc(100% - 12px)' }}
      >
        <div className={styles.sectionWrapperIn}>
          <div className={styles.sectionTitle}>
            <span className={styles.titleBlock} />
            已超期隐患详情
          </div>
          <div
            className={styles.backBtn}
            onClick={() => {
              goBack('overHd');
            }}
          />
          <div className={styles.sectionMain}>
            <div className={styles.sectionContent}>
              <div className={styles.scrollContainer} id="hiddenDanger">
                <CompanyRisk hiddenDangerListByDate={hiddenDangerListByDate} />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default RiskDetailOver;
