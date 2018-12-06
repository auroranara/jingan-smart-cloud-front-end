import React, { PureComponent } from 'react';
import { Timeline } from 'antd';
import moment from 'moment';
import TimelineItem from '../components/TimelineItem';
import DrawerContainer from '../components/DrawerContainer';
import DescriptionList from '@/components/DescriptionList';
import ImgSlider from '../components/ImgSlider';
import styles from './DrawerHiddenDangerDetail.less';

const { Description } = DescriptionList;
/* 获取无数据 */
const getEmptyData = () => {
  return <span style={{ color: 'rgba(0,0,0,0.45)' }}>暂无数据</span>;
};

export default class DrawerHiddenDangerDetail extends PureComponent {
  render() {
    const SPANS = [6, 18];
    const { visible, onClose, data = [] } = this.props;
    return (
      <DrawerContainer
        title="隐患详情"
        visible={visible}
        onClose={onClose}
        width={470}
        destroyOnClose={true}
        left={
          <div className={styles.drawerHiddenDangerDetail}>
            <Timeline>
              {data.map(
                (
                  {
                    timeLine,
                    timeLine: { time: timeStamp, type: timeLineLabel },
                    level_name = null,
                    report_user_name = null,
                    desc = null,
                    rectify_user_name = null,
                    plan_rectify_time = null,
                    review_user_name = null,
                    // 2是整改，3是复查
                    type = null,
                    // 人
                    operator_name = null,
                    // 时间
                    create_time_str = null,
                    // 金额
                    money = null,
                    // 措施
                    operate_content = null,
                    // 图片
                    files = [],
                    // 备注
                    remark = null,
                  },
                  index
                ) => {
                  const [stampDay, stampHour] = timeStamp ? timeStamp.split(' ') : [null, null];
                  const picture = files.reduce((acc, item) => {
                    if (/.jpg{1}$|.png{1}$/.test(item.web_url)) {
                      return [...acc, item.web_url];
                    } else return acc;
                  }, []);
                  if (!timeLine.time) {
                    return <TimelineItem key={index} label={timeLineLabel} spans={SPANS} />;
                  }
                  if (index === 0) {
                    return (
                      <TimelineItem
                        key={index}
                        label={timeLineLabel}
                        spans={SPANS}
                        day={stampDay}
                        hour={stampHour}
                      >
                        <div className={styles.contentContainer}>
                          <DescriptionList className={styles.lineList} col={1}>
                            <Description className={styles.line} term="隐患等级">
                              {level_name || getEmptyData()}
                            </Description>
                            <Description className={styles.line} term="检查人">
                              {report_user_name || getEmptyData()}
                            </Description>
                            <Description className={styles.line} term="隐患描述">
                              {desc || getEmptyData()}
                            </Description>
                            <Description className={styles.line} term="指定整改人">
                              {rectify_user_name || getEmptyData()}
                            </Description>
                            <Description className={styles.line} term="计划整改日期">
                              {plan_rectify_time
                                ? moment(+plan_rectify_time).format('YYYY-MM-DD')
                                : getEmptyData()}
                            </Description>
                            <Description className={styles.line} term="指定复查人">
                              {review_user_name || getEmptyData()}
                            </Description>
                          </DescriptionList>
                          {picture &&
                            picture.length > 0 && (
                              <div className={styles.iamgeContainer}>
                                <ImgSlider picture={picture} />
                              </div>
                            )}
                        </div>
                      </TimelineItem>
                    );
                  }
                  if (+type === 2) {
                    return (
                      <TimelineItem
                        key={index}
                        label={timeLineLabel}
                        spans={SPANS}
                        day={stampDay}
                        hour={stampHour}
                      >
                        <div className={styles.contentContainer}>
                          <DescriptionList className={styles.lineList} col={1}>
                            <Description className={styles.line} term="整改人">
                              {operator_name || getEmptyData()}
                            </Description>
                            <Description className={styles.line} term="实际整改日期">
                              {create_time_str || getEmptyData()}
                            </Description>
                            <Description className={styles.line} term="整改金额">
                              {money || 0}
                            </Description>
                          </DescriptionList>
                          {picture &&
                            picture.length > 0 && (
                              <div className={styles.iamgeContainer}>
                                <ImgSlider picture={picture} />
                              </div>
                            )}
                        </div>
                      </TimelineItem>
                    );
                  } else if (+type === 3) {
                    return (
                      <TimelineItem
                        key={index}
                        label={timeLineLabel}
                        spans={SPANS}
                        day={stampDay}
                        hour={stampHour}
                      >
                        <div className={styles.contentContainer}>
                          <DescriptionList className={styles.lineList} col={1}>
                            <Description className={styles.line} term="复查人">
                              {operator_name || getEmptyData()}
                            </Description>
                            <Description className={styles.line} term="备注">
                              {remark || getEmptyData()}
                            </Description>
                            <Description className={styles.line} term="计划整改">
                              {create_time_str || getEmptyData()}
                            </Description>
                          </DescriptionList>
                          {picture &&
                            picture.length > 0 && (
                              <div className={styles.iamgeContainer}>
                                <ImgSlider picture={picture} />
                              </div>
                            )}
                        </div>
                      </TimelineItem>
                    );
                  }
                }
              )}
            </Timeline>
          </div>
        }
      />
    );
  }
}
