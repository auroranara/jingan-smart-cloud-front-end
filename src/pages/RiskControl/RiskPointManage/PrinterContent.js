import React, { PureComponent, Fragment } from 'react';
import { Form } from 'antd';
import { connect } from 'dva';
import QRCode from 'qrcode.react';
import styles from './PrinterContent.less';

/**
 * 风险告知卡打印预览数据
 */
@connect(({ riskPointManage, user, loading }) => ({
  riskPointManage,
  user,
  loading: loading.models.riskPointManage,
}))
@Form.create()
export default class RiskCardPrinter extends PureComponent {
  /**
   * 挂载后
   */
  componentDidMount() {
    const {
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;

    // 获取列表
    dispatch({
      type: 'riskPointManage/fetchShowLetter',
      payload: {
        id,
      },
    });
  }

  /**
   * 渲染函数
   */
  render() {
    const {
      riskPointManage: { showLetterData = {} },
      location: {
        query: { isShowEwm },
      },
    } = this.props;

    const {
      companyInfo: { company_name, regulatoryClassifyName, headOfSecurity, headOfSecurityPhone },
      hdLetterInfo: {
        riskLevelName: { desc, color },
        pointName,
        areaName,
        qrCode,
        dangerFactor = '',
        preventMeasures = '',
        emergencyMeasures = '',
        accidentTypeName,
        pointCode,
      },
      localPictureUrlList = [],
      warningSignUrlList = [],
    } = showLetterData;

    const localUrl = localPictureUrlList.map(item => item.webUrl);
    return (
      <div id="riskCard">
        <div className={styles.mian} style={{ backgroundColor: `${color}` }}>
          <div className={styles.titleContainer}>
            <span>岗位风险告知卡</span>
            <span className={styles.level}>
              风险等级：
              {desc}
            </span>
          </div>

          <div className={styles.tableContainer}>
            <div className={styles.tableTitle}>
              <span className={styles.tableValue}>现场图片</span>
            </div>
            <div className={styles.loacalpicLabel}>
              <div className={styles.loacalpic} style={{ backgroundImage: `url(${localUrl})` }} />
            </div>
            <div className={styles.tableTitle}>
              <span className={styles.tableValue}>危险源基础信息</span>
            </div>
            <div className={styles.dangerInfoLabel}>
              {isShowEwm === 'false' ? (
                <Fragment>
                  <div className={styles.infoType}>
                    <div className={styles.infoName}>行业类别：</div>
                    <div className={styles.infoValue}>{regulatoryClassifyName}</div>
                  </div>
                  <div className={styles.info}>
                    <div className={styles.infoName}>风险点名称：</div>
                    <div className={styles.infoValue}>{pointName}</div>
                  </div>
                  <div className={styles.info}>
                    <div className={styles.infoName}>场所/环节/部位:</div>
                    <div className={styles.infoValue}>{areaName}</div>
                  </div>
                  <div className={styles.info}>
                    <div className={styles.infoName}>安全负责人:</div>
                    <div className={styles.infoValue}>{headOfSecurity}</div>
                  </div>
                  <div className={styles.info}>
                    <div className={styles.infoName}>联系方式:</div>
                    <div className={styles.infoValue}>{headOfSecurityPhone}</div>
                  </div>
                </Fragment>
              ) : (
                <Fragment>
                  <div className={styles.tabTop}>
                    <div className={styles.tabLeft}>
                      <div className={styles.infoType}>
                        <div className={styles.infoName}>行业类别：</div>
                        <div className={styles.infoValue}>{regulatoryClassifyName}</div>
                      </div>
                      <div className={styles.info}>
                        <div className={styles.infoName}>风险点名称：</div>
                        <div className={styles.infoValue}>{pointName}</div>
                      </div>
                      <div className={styles.info}>
                        <div className={styles.infoName}>场所/环节/部位:</div>
                        <div className={styles.infoValue}>{areaName}</div>
                      </div>
                    </div>
                    <div className={styles.tabRight}>
                      <QRCode className={styles.qrcode} size={100} value={qrCode || ''} />
                      <div className={styles.tabRightSpan}>隐患巡查点</div>
                    </div>
                  </div>
                  <div className={styles.tabLeft}>
                    <div className={styles.info}>
                      <div className={styles.infoName}>安全负责人:</div>
                      <div className={styles.infoValue}>{headOfSecurity}</div>
                    </div>
                    <div className={styles.info}>
                      <div className={styles.infoName}>联系方式:</div>
                      <div className={styles.infoValue}>{headOfSecurityPhone}</div>
                    </div>
                  </div>
                </Fragment>
              )}
            </div>
          </div>

          <div className={styles.mainDangerContainer}>
            <div className={styles.areaContainerTitle}>
              <span className={styles.titleValue}>主要危险因素</span>
            </div>
            <div className={styles.contentValue} style={{ minHeight: '50px' }}>
              {dangerFactor.replace(/<br\/>/g, ' \n ') || ''}
            </div>
          </div>

          <div className={styles.riskMangageContainer}>
            <div className={styles.areaContainerTitle}>
              <span className={styles.titleValue}>风险管控措施</span>
            </div>
            <div className={styles.contentValue} style={{ minHeight: '110px' }}>
              {preventMeasures.replace(/<br\/>/g, ' \n ') || ''}
            </div>
          </div>

          <div className={styles.emergencyContainer}>
            <div className={styles.areaContainerTitle}>
              <span className={styles.titleValue}>应急处置措施</span>
            </div>
            <div className={styles.contentValue} style={{ minHeight: '227px' }}>
              {emergencyMeasures.replace(/<br\/>/g, ' \n ') || ''}
            </div>
          </div>

          <div className={styles.riskResultContainer}>
            <div className={styles.left}>
              <div className={styles.areaContainerTitle}>
                <span className={styles.titleValue}>易导致后果（风险）</span>
              </div>
              <div className={styles.contentLeftValue}>{accidentTypeName}</div>
            </div>
            <div className={styles.right}>
              <div className={styles.areaContainerTitle}>
                <span className={styles.titleValue}>警示标志</span>
              </div>
              <div className={styles.contentRightValue}>
                {warningSignUrlList.map((item, index) => {
                  const { webUrl } = item;
                  return (
                    <div key={index} className={styles.signImg}>
                      <img src={webUrl} width="100%" height="100%" alt="" />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className={styles.companyInfoContainer}>
            <span>
              企业名称：
              {company_name}
            </span>
            <span className={styles.code}>
              编号:
              {pointCode}
            </span>
          </div>
        </div>
      </div>
    );
  }
}
