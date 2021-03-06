import React, { PureComponent, Fragment } from 'react';
import { Timeline, Tooltip } from 'antd';
import moment from 'moment';
import Ellipsis from 'components/Ellipsis';
import SwitchHead from '../components/SwitchHead';
import Slider from '../components/Slider';
import TimelineItem from '../components/TimelineItem';
import DrawerContainer from '../components/DrawerContainer';
import DescriptionList from '@/components/DescriptionList';
import ImgSlider from '../components/ImgSlider';
import styles from './DrawerHiddenDangerDetail.less';

const SPANS = [6, 18];
const { Description } = DescriptionList;
/* 获取无数据 */
const getEmptyData = () => {
  return <span style={{ color: 'rgba(255, 250, 250, 0.45)' }}>暂无数据</span>;
};

export default class DrawerHiddenDangerDetail extends PureComponent {
  state = { index: 0 };

  handleLeftClick = () => {
    const { fetchDangerDetail, hiddenDangerIds } = this.props;
    const { index } = this.state;
    fetchDangerDetail(hiddenDangerIds[index - 1]);
    this.setState(({ index }) => ({ index: index - 1 }));
  };

  handleRightClick = () => {
    const { fetchDangerDetail, hiddenDangerIds } = this.props;
    const { index } = this.state;
    fetchDangerDetail(hiddenDangerIds[index + 1]);
    this.setState(({ index }) => ({ index: index + 1 }));
  };

  render() {
    const { index } = this.state;
    const { visible, onClose, data = [], hiddenDangerIds = [], handleParentChange } = this.props;
    const originLength = data.filter(item => item.timeLine.type).length;
    const length = hiddenDangerIds.length;
    const cards = (
      <div className={styles.drawerHiddenDangerDetail} style={{ height: '100%', flex: 1 }}>
        <Timeline>
          {data.map(
            (
              {
                timeLine,
                timeLine: { time: timeStamp, timeLineLabel, type: timeLineType },
                level_name = null,
                report_user_name = null,
                allCheckPersonNames = null,
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
              const isLast = originLength - 1 === index;
              const className = isLast ? styles.last : styles.line;
              const labelStyle = isLast
                ? { color: '#0ff', borderColor: '#0ff' }
                : { color: '#0296B2', borderColor: '#0296B2' };
              const timeStyle = isLast ? { color: '#fff' } : { color: '#8198B4' };
              const containerStyle = { borderColor: isLast ? '#0ff' : '#0296B2' };
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
                    labelStyle={labelStyle}
                    timeStyle={timeStyle}
                    containerStyle={containerStyle}
                  >
                    <div className={styles.contentContainer}>
                      <Tooltip
                        placement={'bottomLeft'}
                        title={desc || ''}
                        overlayClassName={styles.tooltipOverlay}
                        className={styles.tooltip}
                      >
                        <div>{desc || ''}</div>
                      </Tooltip>
                      <DescriptionList className={styles.lineList} col={1}>
                        <Description className={className} term="">
                          {/* <Ellipsis
                                lines={1}
                                // title={
                                //   '维保公司维保公司维保公司维保公司维保公司维保公司维保公司维保公司维保公司维保公司维保公司维保公司'
                                // }
                                tooltip
                                overlayClassName={styles.tooltipOverlay}
                              >
                                '维保公司维保公司维保公司维保公司维保公司维保公司维保公司维保公司维保公司维保公司维保公司维保公司'
                              </Ellipsis> */}
                        </Description>
                        <Description className={className} term="隐患等级">
                          {level_name || getEmptyData()}
                        </Description>
                        {/* <Description className={className} term="隐患来源">
                              {report_source_name || getEmptyData()}
                            </Description>
                            <Description className={className} term="检查点位">
                              {item_name || getEmptyData()}
                            </Description> */}
                        <Description className={className} term="检查人">
                          {allCheckPersonNames || getEmptyData()}
                        </Description>
                        {/* <Description className={className} term="指定整改单位">
                              {rectify_company_name || getEmptyData()}
                            </Description> */}
                        <Description className={className} term="指定整改人">
                          {rectify_user_name || getEmptyData()}
                        </Description>
                        <Description className={className} term="计划整改日期">
                          {plan_rectify_time
                            ? moment(+plan_rectify_time).format('YYYY-MM-DD')
                            : getEmptyData()}
                        </Description>
                        {/* <Description className={className} term="指定复查单位">
                              {review_company_name || getEmptyData()}
                            </Description> */}
                        <Description className={className} term="指定复查人">
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
              } else if (+itemType === 2) {
                return (
                  <TimelineItem
                    key={index}
                    label={timeLineLabel}
                    spans={SPANS}
                    day={stampDay}
                    hour={stampHour}
                    labelStyle={labelStyle}
                    timeStyle={timeStyle}
                    containerStyle={containerStyle}
                  >
                    <div className={styles.contentContainer}>
                      <DescriptionList className={styles.lineList} col={1}>
                        <Description className={className} term="整改人">
                          {operator_name || getEmptyData()}
                        </Description>
                        {/* <Description className={className} term="整改单位">
                              {operator_company_name || getEmptyData()}
                            </Description> */}
                        {/* <Description className={className} term="实际整改日期">
                              {create_time_str || getEmptyData()}
                            </Description> */}
                        <Description className={className} term="整改金额">
                          ￥{money || 0}
                        </Description>
                        <Description className={className} term="整改措施">
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
                    labelStyle={labelStyle}
                    timeStyle={timeStyle}
                    containerStyle={containerStyle}
                  >
                    <div className={styles.contentContainer}>
                      <DescriptionList className={styles.lineList} col={1}>
                        <Description className={className} term="复查人">
                          {operator_name || getEmptyData()}
                        </Description>
                        {/* <Description className={className} term="复查单位">
                              {operator_company_name || getEmptyData()}
                            </Description>
                            <Description className={className} term="指定整改单位">
                              {rectify_company_name || getEmptyData()}
                            </Description> */}
                        <Description className={className} term="备注">
                          {remark || getEmptyData()}
                        </Description>

                        <Description className={className} term="计划整改日期">
                          {plan_rectify_time
                            ? moment(+plan_rectify_time).format('YYYY-MM-DD')
                            : getEmptyData()}
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
              } else
                return (
                  <TimelineItem
                    key={index}
                    label={timeLineLabel}
                    spans={SPANS}
                    day={stampDay}
                    hour={stampHour}
                    labelStyle={labelStyle}
                    timeStyle={timeStyle}
                    containerStyle={containerStyle}
                  >
                    <div className={styles.contentContainer}>
                      <DescriptionList className={styles.lineList} col={1}>
                        <Description className={className} term="复查人">
                          {operator_name || getEmptyData()}
                        </Description>
                        <Description className={className} term="备注">
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
    );

    const left =
      length === 1 || !length ? (
        <Fragment>{cards}</Fragment>
      ) : (
        <Fragment>
          <SwitchHead
            index={index}
            title={'隐患'}
            lastIndex={length - 1}
            handleLeftClick={this.handleLeftClick}
            handleRightClick={this.handleRightClick}
          />
          <div className={styles.sliderContainer}>
            <Slider index={index} length={length} size={1}>
              {/* <div className={styles.drawerHiddenDangerDetail} style={{ height: '100%', flex: 1 }}> */}
              {new Array(length).fill(cards)}
              {/* </div> */}
            </Slider>
          </div>
        </Fragment>
      );

    return (
      <DrawerContainer
        zIndex={2000}
        title="隐患详情"
        visible={visible}
        onClose={() => {
          setTimeout(() => {
            this.setState({ index: 0 });
            handleParentChange && handleParentChange({ hiddenDangerIds: [] });
          }, 200);
          onClose();
        }}
        width={535}
        destroyOnClose={true}
        left={<div className={styles.drawerHiddenDangerDetail}>{left}</div>}
      />
    );
  }
}
