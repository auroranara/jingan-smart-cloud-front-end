import React, { Component, Fragment } from 'react';
import { Card, Divider } from 'antd';
import CustomUpload from '@/jingan-components/CustomUpload';
import classNames from 'classnames';
import styles from './index.less';

export default class TransportCompanyInfo extends Component {
  render() {
    const { className, style, value } = this.props;

    return (
      <div className={classNames(className, styles.container)} style={style}>
        {value ? (
          <Fragment>
            <div className={styles.companyName}>
              {+value.ownerType ? value.ownerCompanyName : '本单位'}
            </div>
            <Card className={styles.card}>
              <div className={styles.fieldWrapper}>
                <div className={styles.fieldName}>驾驶员：</div>
                <div className={styles.fieldValue}>{value.driver}</div>
              </div>
              <div className={styles.fieldWrapper}>
                <div className={styles.fieldName}>联系方式：</div>
                <div className={styles.fieldValue}>{value.driverTel}</div>
              </div>
              <div className={styles.fieldWrapper}>
                <div className={styles.fieldName}>证照附件：</div>
                <div className={styles.fieldValue}>
                  <CustomUpload style={{ padding: 0 }} value={value.driverPhotoList} type="span" />
                </div>
              </div>
              {value.supercargo && (
                <Fragment>
                  <Divider className={styles.divider} dashed />
                  <div className={styles.fieldWrapper}>
                    <div className={styles.fieldName}>押运员：</div>
                    <div className={styles.fieldValue}>{value.supercargo}</div>
                  </div>
                  <div className={styles.fieldWrapper}>
                    <div className={styles.fieldName}>联系方式：</div>
                    <div className={styles.fieldValue}>{value.supercargoTel}</div>
                  </div>
                  <div className={styles.fieldWrapper}>
                    <div className={styles.fieldName}>证照附件：</div>
                    <div className={styles.fieldValue}>
                      <CustomUpload
                        style={{ padding: 0 }}
                        value={value.supercargoPhotoList}
                        type="span"
                      />
                    </div>
                  </div>
                </Fragment>
              )}
            </Card>
          </Fragment>
        ) : (
          <span className={styles.empty}>请先选择承运车辆</span>
        )}
      </div>
    );
  }
}
