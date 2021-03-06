import React, { PureComponent } from 'react';
import DrawerContainer from '../components/DrawerContainer'
import Ellipsis from '@/components/Ellipsis';
import { Spin } from 'antd';
import moment from 'moment';
import styles from './DrawerOfHiddenDanger.less'

import dfcIcon from '../images/dfc.png';
import wcqIcon from '../images/wcq.png';
import ycqIcon from '../images/ycq.png';
import noPhotoIcon from '../images/noPhoto.png';
import safety from '@/assets/safety.png';
import fireControl from '@/assets/fire-control.png';
import environment from '@/assets/environment.png';
import hygiene from '@/assets/hygiene.png';
// import isEmptyImg from '../images/noHiddenDanger.png';

const isEmptyImg = 'http://data.jingan-china.cn/v2/chem/screen/noHiddenDanger.png';
/**
 * 根据status获取对应的标记
 */
const getIconByStatus = status => {
  switch (+status) {
    case 3:
      return {
        color: 'white',
        badge: dfcIcon,
        icon: 'http://data.jingan-china.cn/v2/big-platform/safety/com/description_blue.png',
      };
    case 1:
    case 2:
      return {
        color: 'white',
        badge: wcqIcon,
        icon: 'http://data.jingan-china.cn/v2/big-platform/safety/com/description_blue.png',
      };
    case 7:
      return {
        color: '#FF6464',
        badge: ycqIcon,
        icon: 'http://data.jingan-china.cn/v2/big-platform/safety/com/description_red.png',
      };
    default:
      return {
        color: 'white',
        icon: 'http://data.jingan-china.cn/v2/big-platform/safety/com/description_blue.png',
      };
  }
};

// 根据业务分类获取对应图标
const getIconByBusinessType = function (businessType) {
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

// 根据风险等级获取文本
const getLabelByLevel = function (level) {
  switch (+level) {
    case 1:
      return '红色';
    case 2:
      return '橙色';
    case 3:
      return '黄色';
    case 4:
      return '蓝色';
    default:
      return '';
  }
};

const HiddenDangerRecord = ({ data }) => {
  const {
    id,
    status,
    desc,
    report_user_name,
    report_time,
    rectify_user_name,
    plan_rectify_time,
    real_rectify_time,
    review_user_name,
    real_review_user_name = null,
    hiddenDangerRecordDto,
    business_type,
    review_time,
    name,  // 隐患来源
    source_type_name,
    risk_level_name, // 风险点等级名称
    source_type,     // 隐患来源 2:监督点
    risk_level,     // 风险点等级 未评级为null
    item_name,
    report_source_name,  // 来源
  } = data;
  // TODO:如果hiddenDangerRecordDto第一个元素的web_url不是图片
  let [{ fileWebUrl = '' } = {}] = hiddenDangerRecordDto || [];
  fileWebUrl = fileWebUrl ? fileWebUrl.split(',')[0] : '';
  const { badge, icon, color } = getIconByStatus(status);
  // 来源
  // const source = source_type_name === '风险点上报' ? `${getLabelByLevel(risk_level)}风险点${name ? `（${name}）` : ''}` : source_type_name;
  const isYCQ = +status === 7; // 已超期
  const isDFC = +status === 3  // 待复查
  const isYGB = +status === 4; // 已关闭
  const rectify_time = isDFC || isYGB ? real_rectify_time : plan_rectify_time;
  return (
    <div className={styles.hiddenDangerRecord} key={id}>
      {/* 右上角图 */}
      {/* <div
        className={styles.hiddenDangerRecordBadge}
        style={{ backgroundImage: badge && `url(${badge})` }}
      /> */}
      <div className={styles.photo} style={{ backgroundImage: `url(${noPhotoIcon})` }}>
        <div style={{ position: 'relative', width: '100%', textAlign: 'center' }}>
          <img
            src={fileWebUrl && fileWebUrl.split(',')[0]}
            alt=""
            style={{ display: 'block', width: '100%', margin: '0 auto' }}
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
      <div className={styles.content}>
        <div className={styles.title} style={{ backgroundImage: `url(${getIconByBusinessType(business_type)})` }}>
          <Ellipsis lines={2} tooltip>
            <span style={{ color }}>{desc || '暂无隐患描述'}</span>
          </Ellipsis>
        </div>
        <div className={styles.line}>
          <span>
            上<span style={{ opacity: '0' }}>隐藏</span>
            报：
          </span>
          <Ellipsis lines={1} tooltip>
            <span style={{ marginRight: '16px' }}>{report_user_name}</span>
            {moment(+report_time).format('YYYY-MM-DD')}
          </Ellipsis>
        </div>
        <div className={styles.line}>
          <span>{(isDFC || isYGB) ? '实际整改：' : '计划整改：'}</span>
          <Ellipsis lines={1} tooltip>
            <span style={{ marginRight: '16px' }}>{rectify_user_name}</span>
            <span style={{ color: isYCQ ? '#FF6464' : undefined }}>
              {moment(+rectify_time).format('YYYY-MM-DD')}
            </span>
          </Ellipsis>
        </div>
        {(isDFC || isYGB) && (
          <div className={styles.line}>
            <span>
              复<span style={{ opacity: '0' }}>隐藏</span>
              查：
            </span>
            <Ellipsis lines={1} tooltip>
              <span style={{ marginRight: '16px' }}>{isYGB ? real_review_user_name : review_user_name}</span>
              {!isDFC && <span>{moment(+review_time).format('YYYY-MM-DD')}</span>}
            </Ellipsis>
          </div>
        )}
        <div className={styles.line}>
          <span>
            来<span style={{ opacity: '0' }}>隐藏</span>
            源：
          </span>
          {/* 先判断隐患来源是不是2（网格点），如果是2 直接显示 监督点上报 ，不是2 再判断有没有评级 是这样吗 */}
          <Ellipsis lines={1} tooltip>
            <span>{report_source_name || '暂无数据'}</span>
            {/* <span>{+source_type === 2 ? '监督点上报' : risk_level ? `${risk_level_name}色风险点` : '风险点'}</span> */}
            {/* <span>{`（${name}）`}</span> */}
          </Ellipsis>
        </div>
        <div className={styles.line}>
          <span>检查点位：</span>
          <Ellipsis lines={1} tooltip><span>{item_name}</span></Ellipsis>
        </div>
      </div>
    </div>
  );
};

export default class DrawerOfHiddenDanger extends PureComponent {


  render() {
    const {
      loading,
      visible,
      onClose,
      title,
      data: {
        hiddenDangerRecords,
      },
    } = this.props
    return (
      <DrawerContainer
        title={title}
        visible={visible}
        placement="left"
        destroyOnClose
        onClose={onClose}
        closable={true}
        width={530}
        left={(
          <Spin wrapperClassName={styles.drawerOfHiddenDanger} spinning={loading}>
            {hiddenDangerRecords.length > 0 ? (
              hiddenDangerRecords.map(item => {
                const { id } = item;
                return <HiddenDangerRecord key={id} data={item} />;
              })
            ) : (
                <div className={styles.exptyContainer}>
                  <div
                    style={{
                      backgroundImage: `url(${isEmptyImg})`,
                      backgroundSize: '100% 100%',
                      backgroundPosition: 'center center',
                      backgroundRepeat: 'noRepeat',
                      width: '250px',
                      height: '250px',
                    }}
                  ></div>
                </div>
              )}
          </Spin>
        )}
      />
    )
  }
}
