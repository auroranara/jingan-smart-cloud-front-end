import React, { PureComponent } from 'react';
import { Avatar, Tooltip } from 'antd';
import classNames from 'classnames';
import styles from '../Government.less';
import Ellipsis from '../../../../components/Ellipsis';
import safety from '@/assets/safety.png';
import fireControl from '@/assets/fire-control.png';
import environment from '@/assets/environment.png';
import hygiene from '@/assets/hygiene.png';
import ygbIcon from '@/assets/closed.png';

/* 图片地址前缀 */
const iconPrefix = 'http://data.jingan-china.cn/v2/big-platform/safety/com/';
const descriptionBlueIcon = `${iconPrefix}description_blue.png`;
const descriptionRedIcon = `${iconPrefix}description_red.png`;
const ycqIcon = `${iconPrefix}ycq.png`;
const wcqIcon = `${iconPrefix}wcq.png`;
const dfcIcon = `${iconPrefix}dfc.png`;

// 字段名
const defaultFieldNames = {
  id: 'id',
  description: 'description',
  sbr: 'sbr',
  sbsj: 'sbsj',
  zgr: 'zgr',
  zgsj: 'zgsj',
  fcr: 'fcr',
  status: 'status',
  background: 'background',
  businessType: 'businessType',
  fcsj: 'fcsj',
};
// 根据业务分类获取对应图标
const getIconByBusinessType = function(businessType) {
  switch (+businessType) {
    case 1:
      return safety;
    case 2:
      return fireControl;
    case 3:
      return environment;
    case 4:
      return hygiene;
    default:
      return safety;
  }
};
// 获取图章
const getSeal = status => {
  switch (+status) {
    case 1:
    case 2:
      return wcqIcon;
    case 3:
      return dfcIcon;
    case 4:
      return ygbIcon;
    case 7:
      return ycqIcon;
    default:
      return '';
  }
};
class CompanyRisk extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    const {
      hiddenDangerListByDate: { ycq = [], wcq = [], dfc = [], ygb = [] },
    } = this.props;
    const {
      id,
      description,
      sbr,
      sbsj,
      zgr,
      fcr,
      status,
      background,
      businessType,
      fcsj,
    } = defaultFieldNames;
    const newList = [...ycq, ...wcq, ...dfc, ...ygb];
    return (
      <div>
        {newList.length !== 0 ? (
          newList.map(item => (
            <div
              key={item[id]}
              style={{
                position: 'relative',
                marginBottom: '12px',
                boxShadow: '3px 3px 3px #000',
                background: `rgba(1, 21, 57, 0.9) url(${getSeal(
                  item[status]
                )}) no-repeat right bottom / 120px`,
              }}
            >
              <div style={{ display: 'flex', padding: '12px 0' }}>
                <Avatar
                  style={{ margin: '0 10px', borderRadius: 0 }}
                  // src={+item[status] === 7 ? descriptionRedIcon : descriptionBlueIcon}
                  src={getIconByBusinessType(item[businessType])}
                  size="small"
                />
                {/* <div className={styles.riskDetailItemTitleAvatar} style={{ backgroundImage: `url(${getIconByBusinessType(data[businessType])})` }} /> */}
                <Tooltip placement="bottom" title={item[description] || '暂无信息'}>
                  <Ellipsis
                    lines={1}
                    // tooltip
                    className={styles.riskDescription}
                    style={{
                      flex: 1,
                      color: +item[status] === 7 ? '#ff4848' : '#fff',
                      lineHeight: '24px',
                    }}
                  >
                    {item[description] || '暂无信息'}
                  </Ellipsis>
                </Tooltip>
              </div>
              <div style={{ display: 'flex', padding: '0 0 10px 6px' }}>
                <div
                  className={styles.riskImg}
                  style={{
                    flex: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '180px',
                    backgroundColor: '#021C42',
                    overflow: 'hidden',
                  }}
                >
                  <div style={{ position: 'relative', width: '100%' }}>
                    <img
                      src={item[background]}
                      alt=""
                      style={{ display: 'block', width: '100%' }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 0,
                        backgroundColor: 'rgba(0, 168, 255, 0.3)',
                      }}
                    />
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    className={styles.riskMsg}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      lineHeight: '24px',
                    }}
                  >
                    <span style={{ color: '#00A8FF' }}>
                      上<span style={{ opacity: 0 }}>啊啊</span>
                      报：
                    </span>
                    <Ellipsis lines={1} style={{ flex: 1, color: '#fff' }} tooltip>
                      <span style={{ marginRight: '20px' }}>{item[sbr]}</span>
                      {item[sbsj]}
                    </Ellipsis>
                  </div>
                  <div
                    className={styles.riskMsg}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      lineHeight: '24px',
                    }}
                  >
                    <span style={{ color: '#00A8FF' }}>
                      {+item.status === 3 || +item.status === 4 ? '实际' : '计划'}
                      整改：
                    </span>
                    <Ellipsis lines={1} style={{ flex: 1, color: '#fff', lineHeight: 1 }} tooltip>
                      <span style={{ marginRight: '20px' }}>{item[zgr]}</span>
                      <span style={{ color: item.status === 7 ? 'rgb(255, 72, 72)' : '#fff' }}>
                        {+item.status === 3 ? item.real_zgsj : item.plan_zgsj}
                      </span>
                    </Ellipsis>
                  </div>
                  {(+item[status] === 3 || +item.status === 4) && (
                    <div
                      className={styles.riskMsg}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        lineHeight: '24px',
                      }}
                    >
                      <span style={{ color: '#00A8FF' }}>
                        复<span style={{ opacity: 0 }}>啊啊</span>
                        查：
                      </span>
                      <Ellipsis lines={1} style={{ flex: 1, color: '#fff' }} tooltip>
                        <span style={{ marginRight: '20px' }}>{item[fcr]}</span>
                        {+item.status === 4 && item[fcsj]}
                      </Ellipsis>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div style={{ textAlign: 'center', color: '#fff' }}>暂无隐患</div>
        )}
      </div>
    );
  }
}

export default CompanyRisk;
