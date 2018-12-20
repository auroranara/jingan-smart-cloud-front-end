import React, { PureComponent } from 'react';
import { Carousel } from 'antd';
import Section from '@/components/Section';
import HiddenDanger from '../HiddenDanger';
import RiskCard from '../../Components/RiskCard';

import styles from './index.less';

/**
 * description: 巡查点位详情
 * author: sunkai
 * date: 2018年12月13日
 */
export default class InspectionPoint extends PureComponent {
  render() {
    const {
      onClose,
      data: {
        data=[],
        hiddenData=[],
      }={},
    } = this.props;

    return (
      <Section
        isScroll
        closable
        title="巡查点位详情"
        onClose={onClose}
        skip
      >
        <div className={styles.title}>风险点详情</div>
        {data.length > 0 ? (
          <Carousel className={styles.carousel}>
            {data.map(item => (
              <RiskCard
                key={item.id}
                data={item}
              />
            ))}
          </Carousel>
        ) : <div style={{ textAlign: 'center' }}>暂无风险信息</div>}
        <div className={styles.title}>隐患详情 ({hiddenData.length})</div>
        {hiddenData.length > 0 ? (
          <div className={styles.content}>
            {hiddenData.map(({
              _id,
              _report_user_name,
              _report_time,
              _rectify_user_name,
              _plan_rectify_time,
              _review_user_name,
              business_type,
              _desc,
              path,
              _real_rectify_time,
              _review_time,
              object_title,
              hiddenStatus,
              typeName,
              risk_level,
            }) => (
              <HiddenDanger
                key={_id}
                data={{
                  report_user_name: _report_user_name,
                  report_time: _report_time,
                  rectify_user_name: _rectify_user_name,
                  real_rectify_time: _real_rectify_time,
                  plan_rectify_time: _plan_rectify_time,
                  review_user_name: _review_user_name,
                  review_time: _review_time,
                  source_type_name: typeName,
                  companyBuildingItem: { object_title, risk_level },
                  desc: _desc,
                  business_type,
                  status: hiddenStatus,
                  hiddenDangerRecordDto: [{ fileWebUrl: path }],
                }}
                isSourceShow
              />
            ))}
          </div>
        ) : <div style={{ textAlign: 'center' }}>暂无隐患</div>}
      </Section>
    );
  }
}
