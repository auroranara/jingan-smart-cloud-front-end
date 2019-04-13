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
  return <span style={{ color: 'rgba(255, 250, 250, 0.45)' }}>暂无数据</span>;
};

const { projectKey } = global.PROJECT_CONFIG;
const isVague = projectKey.indexOf('czey') >= 0 || projectKey.indexOf('test') >= 0;
function nameToVague(str) {
  let newStr = '';
  if (str && str.length === 1) return str;
  else if (str && str.length === 2) {
    newStr = str.substr(0, 1) + '*';
  } else if (str && str.length > 2) {
    newStr = str.substr(0, 1) + '*' + str.substr(-1);
  } else return str;
  return newStr;
}

function phoneToVague(str) {
  if (!str) return str;
  const newStr = str.substr(0, 3) + '****' + str.substr(-4);
  return newStr;
}

export default class DrawerHiddenDangerDetail extends PureComponent {
  render() {
    const SPANS = [6, 18];
    const { visible, onClose, data = [] } = this.props;
    return (
      <DrawerContainer
        zIndex={2000}
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
                    timeLine: { time: timeStamp, timeLineLabel, type: timeLineType },
                    level_name = null,
                    report_user_name = null,
                    desc = null,
                    rectify_user_name = null,
                    plan_rectify_time = null,
                    review_user_name = null,
                    report_source_name = null,
                    item_name = null,
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
                    rectify_company_name = null,
                    review_company_name = null,
                    operator_company_name = null,
                  },
                  index
                ) => {
                  const itemType = timeLineType || type;
                  const [stampDay, stampHour] = timeStamp ? timeStamp.split(' ') : [null, null];
                  const picture = files.reduce((acc, item) => {
                    if (/.jpg{1}$|.png{1}$/.test(item.web_url)) {
                      return [...acc, item.web_url];
                    } else return acc;
                  }, []);
                  if (!timeLine.time) {
                    return <TimelineItem key={index} label={timeLineLabel} spans={SPANS} />;
                  }
                  if (+itemType === 1 && index === 0) {
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
                            <Description className={styles.line} term="隐患来源">
                              {report_source_name || getEmptyData()}
                            </Description>
                            <Description className={styles.line} term="检查点位">
                              {item_name || getEmptyData()}
                            </Description>
                            <Description className={styles.line} term="隐患等级">
                              {level_name || getEmptyData()}
                            </Description>
                            <Description className={styles.line} term="检查人">
                              {isVague
                                ? nameToVague(report_user_name)
                                : report_user_name || getEmptyData()}
                            </Description>
                            <Description className={styles.line} term="隐患描述">
                              {desc || getEmptyData()}
                            </Description>
                            {/* <Description className={styles.line} term="指定整改单位">
                              {rectify_company_name || getEmptyData()}
                            </Description> */}
                            <Description className={styles.line} term="指定整改人">
                              {isVague
                                ? nameToVague(rectify_user_name)
                                : rectify_user_name || getEmptyData()}
                            </Description>
                            <Description className={styles.line} term="计划整改日期">
                              {plan_rectify_time
                                ? moment(+plan_rectify_time).format('YYYY-MM-DD')
                                : getEmptyData()}
                            </Description>
                            {/* <Description className={styles.line} term="指定复查单位">
                              {review_company_name || getEmptyData()}
                            </Description> */}
                            <Description className={styles.line} term="指定复查人">
                              {isVague
                                ? nameToVague(review_user_name)
                                : review_user_name || getEmptyData()}
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
                  } else if (+itemType === 2) {
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
                              {isVague
                                ? nameToVague(operator_name)
                                : operator_name || getEmptyData()}
                            </Description>
                            {/* <Description className={styles.line} term="整改单位">
                              {operator_company_name || getEmptyData()}
                            </Description> */}
                            <Description className={styles.line} term="实际整改日期">
                              {create_time_str || getEmptyData()}
                            </Description>
                            <Description className={styles.line} term="整改金额">
                              {money || 0}
                            </Description>
                            <Description className={styles.line} term="整改措施">
                              {operate_content || getEmptyData()}
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
                  } else if (+itemType === 3) {
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
                              {isVague
                                ? nameToVague(operator_name)
                                : operator_name || getEmptyData()}
                            </Description>
                            {/* <Description className={styles.line} term="复查单位">
                              {operator_company_name || getEmptyData()}
                            </Description>
                            <Description className={styles.line} term="指定整改单位">
                              {rectify_company_name || getEmptyData()}
                            </Description> */}
                            <Description className={styles.line} term="备注">
                              {remark || getEmptyData()}
                            </Description>
                            {/*
                              <Description className={styles.line} term="计划整改">
                              {plan_rectify_time
                                ? moment(+plan_rectify_time).format('YYYY-MM-DD')
                                : getEmptyData()}
                            </Description>
                           */}
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
                  } else
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
                              {isVague
                                ? nameToVague(operator_name)
                                : operator_name || getEmptyData()}
                            </Description>
                            <Description className={styles.line} term="备注">
                              {remark || getEmptyData()}
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
              )}
            </Timeline>
          </div>
        }
      />
    );
  }
}
