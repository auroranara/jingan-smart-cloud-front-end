import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Tabs, DatePicker, Icon, Progress, Form } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import Ellipsis from '@/components/Ellipsis';
import { routerRedux } from 'dva/router';
import styles from './WorkbenchList.less';

import {
  Pie,
  RiskPointPie,
  DangerPie,
  DangerWorkLine,
  LearningLine,
  ExamPassPie,
  AlarmRateLine,
} from './components/Components';

import {
  TabList,
  SpecialEquipmentList,
  executeList,
  ProductWork,
  RiskPoint,
  CurrentDanger,
  Materical,
  Technonlogy,
  MajorDanger,
  AlarmIcon,
  NormalIcon,
  Manoeuvre,
  DateIcon,
  Location,
  Execute,
  Money,
  AlarmTime,
  FininshRate,
  getHistoryUrl,
  getRealUrl,
  getValueDate,
} from './utils';

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

// 标题
const title = '工作台';

//面包屑
const breadcrumbList = [
  {
    title: '首页',
    name: '首页',
    href: '/',
  },
  {
    title,
    name: '工作台',
  },
];

// 重大危险源实时监测tab
function TabCardMonitor(props) {
  const { list, handlePageChange, handleOtherPageChange } = props;
  const { id, icon1, icon2, icon3, name1, name2, name3 } = list;
  return (
    <div className={styles.tabContentMonitor}>
      <div className={styles.tabTop}>
        <div
          className={styles.iconOne}
          style={{ backgroundImage: `url(${icon1})` }}
          onClick={() => handlePageChange(id)}
        />
        <div
          className={styles.iconTwo}
          style={{ backgroundImage: `url(${icon2})` }}
          onClick={() => handleOtherPageChange(id)}
        />
      </div>
      <div className={styles.tabBottom}>
        <div className={styles.bottomItemOne}>
          <div className={styles.left} style={{ backgroundImage: `url(${icon3})` }} />
          <div className={styles.right}>
            <div className={styles.name}>{name1}</div>
            <div className={styles.value}>5</div>
          </div>
        </div>
        <div className={styles.bottomItemTwo}>
          <div className={styles.itemTwoContent}>
            <div className={styles.left} style={{ backgroundImage: `url(${AlarmIcon})` }} />
            <div className={styles.right}>
              <div className={styles.name}>{name2}</div>
              <div className={styles.value}>1</div>
            </div>
          </div>
          <div className={styles.itemTwoContent}>
            <div className={styles.left} style={{ backgroundImage: `url(${NormalIcon})` }} />
            <div className={styles.right}>
              <div className={styles.name}>{name3}</div>
              <div className={styles.value}>4</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 重大危险源历史统计tab
function TabCardTotal(props) {
  return (
    <div className={styles.tabContentTotal}>
      <div className={styles.top}>
        <div className={styles.left}>
          <div className={styles.label}>
            <span className={styles.title}>报警率</span>
            <span className={styles.rate}>
              <Icon type="caret-down" style={{ lineHeight: '40px' }} /> 10% 同比上周
            </span>
          </div>
          <div className={styles.labelNum}>
            <span className={styles.number}>10%</span>
          </div>
          <div className={styles.labelLine}>
            <AlarmRateLine />
          </div>
        </div>
        <div className={styles.right}>
          <div className={styles.label}>
            <span className={styles.title}>报警次数</span>
            <span className={styles.rate}>
              <Icon type="caret-down" style={{ lineHeight: '40px' }} /> 10% 同比上周
            </span>
          </div>
          <div className={styles.labelNum}>
            <span className={styles.img} style={{ backgroundImage: `url(${AlarmTime})` }} />
            <span className={styles.number}>10</span>
          </div>
          <div className={styles.labelProgress}>
            <Progress percent={80} showInfo={false} />
          </div>
        </div>
      </div>
      <div className={styles.bottom}>
        <div className={styles.left}>
          <div className={styles.label}>
            <span className={styles.title}>产生工单</span>
            <span className={styles.rate}>
              <Icon type="caret-down" style={{ lineHeight: '40px' }} /> 10% 同比上周
            </span>
          </div>
          <div className={styles.labelNum}>
            <span className={styles.img} style={{ backgroundImage: `url(${ProductWork})` }} />
            <span className={styles.number}>5</span>
          </div>
          <div className={styles.labelProgress}>
            <Progress percent={20} showInfo={false} strokeColor="#808bc6" />
          </div>
        </div>
        <div className={styles.right}>
          <div className={styles.label}>
            <span className={styles.title}>工单完成率</span>
            <span className={styles.rate}>
              <Icon type="caret-down" style={{ lineHeight: '40px' }} /> 0.8% 同比上周
            </span>
          </div>
          <div className={styles.labelNum}>
            <span className={styles.img} style={{ backgroundImage: `url(${FininshRate})` }} />
            <span className={styles.number}>66%</span>
          </div>
          <div className={styles.labelProgress}>
            <Progress percent={66} strokeColor="#7dc856" showInfo={false} />
          </div>
        </div>
      </div>
    </div>
  );
}

@connect(({ loading }) => ({}))
@Form.create()
export default class WorkbenchList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { tabValue: '1', tabValueOther: '1' };
  }

  // 挂载后
  componentDidMount() {}

  handleTabChange = type => {
    this.setState({ tabValue: type });
  };

  handlePageChange = id => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push(getRealUrl(id)));
  };

  handleOtherPageChange = id => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push(getHistoryUrl(id)));
  };

  handleTabChangeOther = type => {
    this.setState({ tabValueOther: type });
  };

  handleDateChange = status => {
    const {
      form: { setFieldsValue },
    } = this.props;
    setFieldsValue({
      dateRange: getValueDate(status),
    });
  };

  renderContentFirst() {
    return (
      <div className={styles.firstContent}>
        {[
          {
            icon: RiskPoint,
            name: '风险点(个)',
            value: 45,
          },
          {
            icon: CurrentDanger,
            name: '当前隐患(个)',
            value: 5,
          },
          {
            icon: Materical,
            name: '物料(种)',
            value: 23,
          },
          {
            icon: Technonlogy,
            name: '高危工艺(套)',
            value: 8,
          },
          {
            icon: MajorDanger,
            name: '重大危险源(个)',
            value: 12,
          },
        ].map(({ icon, name, value }) => (
          <div className={styles.firstItem} key={name}>
            <div className={styles.firstLeft} style={{ backgroundImage: `url(${icon})` }} />
            <div className={styles.firstRight}>
              <div className={styles.firstName}>{name}</div>
              <div className={styles.firstValue}>{value}</div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  renderContentSecond() {
    const remindList = [...Array(30).keys()].map(i => ({
      id: i,
      status: '报警',
      name: '可燃气体浓度',
      area: '5楼实验室',
      date: '2019.10.10  12:10:10',
      content: '当前可燃气体浓度为111%LEL，达到报警级别，超过报警阈值30%（报警阈值为80）',
    }));

    return (
      <div className={styles.secondContent}>
        <div className={styles.secondLeft}>
          <div className={styles.titleLeft}>工作提醒</div>
          <div className={styles.contentLeft}>
            {remindList.map(({ id, status, name, area, date, content }) => (
              <div key={id} className={styles.listStyle}>
                <div style={{ fontSize: '14px', paddingBottom: 10 }}>
                  <span>【{status}】</span>
                  <span>{name}</span>
                </div>
                <div style={{ fontSize: '13px', paddingBottom: 6 }}>
                  <span>
                    区域位置：
                    {area}
                  </span>
                  <span>{date}</span>
                </div>
                <div style={{ fontSize: '13px', paddingBottom: 12, color: '#949494' }}>
                  {content}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.secondRight}>
          <div className={styles.titleRight}>到期统计</div>
          <div className={styles.contentRight}>
            {SpecialEquipmentList.map(
              ({
                id,
                icon,
                name,
                total,
                percentNumOne,
                percentNumTwo,
                percentNumThree,
                dataOne,
                dataTwo,
                dataThree,
                color,
                colorOne,
              }) => (
                <div className={styles.itemRight} key={id}>
                  <div className={styles.itemOne}>
                    <div
                      className={styles.itemOneLeft}
                      style={{ backgroundImage: `url(${icon})` }}
                    />
                    <div className={styles.itemOneRight}>
                      <div className={styles.itemOneName}>{name}</div>
                      <div className={styles.itemOneValue}>
                        数量总计：
                        {total}个
                      </div>
                    </div>
                  </div>
                  <div className={styles.itemTwo}>
                    <div className={styles.itemTwoLeft}>
                      <div className={styles.itemTwoName}>已过期</div>
                      <div className={styles.itemTwoValue}>{percentNumOne}</div>
                    </div>
                    <div className={styles.itemTwoRight}>
                      <Pie data={dataOne} color={colorOne} />
                    </div>
                  </div>
                  <div className={styles.itemThree}>
                    <div className={styles.itemThreeLeft}>
                      <div className={styles.itemThreeName}>即将到期</div>
                      <div className={styles.itemThreeValue}>{percentNumTwo}</div>
                    </div>
                    <div className={styles.itemThreeRight}>
                      <Pie data={dataTwo} color={color} />
                    </div>
                  </div>
                  <div className={styles.itemFour}>
                    <div className={styles.itemFourLeft}>
                      <div className={styles.itemFourName}>正常</div>
                      <div className={styles.itemFourValue}>{percentNumThree}</div>
                    </div>
                    <div className={styles.itemFourRight}>
                      <Pie data={dataThree} color={color} />
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    );
  }

  renderContainerThird() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { tabValue } = this.state;
    return (
      <div className={styles.thirdContent}>
        <div className={styles.leftItem}>
          <div className={styles.titleLeft}>重大危险源实时监测</div>
          <div className={styles.contentLeft}>
            <Tabs activeKey={tabValue} onChange={this.handleTabChange}>
              <TabPane tab="储罐区" key="1">
                <TabCardMonitor
                  list={TabList[0]}
                  handlePageChange={this.handlePageChange}
                  handleOtherPageChange={this.handleOtherPageChange}
                />
              </TabPane>
              <TabPane tab="储罐" key="2">
                <TabCardMonitor
                  list={TabList[1]}
                  handlePageChange={this.handlePageChange}
                  handleOtherPageChange={this.handleOtherPageChange}
                />
              </TabPane>
              <TabPane tab="库区" key="3">
                <TabCardMonitor
                  list={TabList[2]}
                  handlePageChange={this.handlePageChange}
                  handleOtherPageChange={this.handleOtherPageChange}
                />
              </TabPane>
              <TabPane tab="库房" key="4">
                <TabCardMonitor
                  list={TabList[3]}
                  handlePageChange={this.handlePageChange}
                  handleOtherPageChange={this.handleOtherPageChange}
                />
              </TabPane>
              <TabPane tab="高危工艺" key="5">
                <TabCardMonitor
                  list={TabList[4]}
                  handlePageChange={this.handlePageChange}
                  handleOtherPageChange={this.handleOtherPageChange}
                />
              </TabPane>
              <TabPane tab="生产装置" key="6">
                <TabCardMonitor
                  list={TabList[5]}
                  handlePageChange={this.handlePageChange}
                  handleOtherPageChange={this.handleOtherPageChange}
                />
              </TabPane>
              <TabPane tab="气柜" key="7">
                <TabCardMonitor
                  list={TabList[6]}
                  handlePageChange={this.handlePageChange}
                  handleOtherPageChange={this.handleOtherPageChange}
                />
              </TabPane>
              {/* <TabPane tab="视频监测" key="8">
                <TabCardMonitor />
              </TabPane> */}
            </Tabs>
          </div>
        </div>
        <div className={styles.rightItem}>
          <div className={styles.titleRight}>重大危险源历史统计</div>
          <div className={styles.contentRight}>
            <div className={styles.topNav}>
              <div className={styles.label} onClick={() => this.handleDateChange(1)}>
                本周
              </div>
              <div className={styles.label} onClick={() => this.handleDateChange(2)}>
                本月
              </div>
              <div className={styles.label} onClick={() => this.handleDateChange(3)}>
                本季度
              </div>
              <div className={styles.label} onClick={() => this.handleDateChange(4)}>
                今年
              </div>
              <div className={styles.date}>
                {getFieldDecorator('dateRange')(<RangePicker format="YYYY-MM-DD " />)}
              </div>
            </div>
            <div className={styles.bottom}>
              <TabCardTotal />
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderContainerFourth() {
    return (
      <div className={styles.fourthContent}>
        <div className={styles.left}>
          <div className={styles.top}>风险点检查情况</div>
          <div className={styles.bottom}>
            <div className={styles.echarts}>
              <RiskPointPie data={[60, 20, 20]} num={[27, 9, 9]} />
            </div>
          </div>
        </div>
        <div className={styles.middle}>
          <div className={styles.top}>当前隐患情况</div>
          <div className={styles.bottom}>
            <div className={styles.echarts}>
              <DangerPie data={[50, 120]} />
            </div>
            <div className={styles.label}>
              <div className={styles.labelFirst}>
                <div className={styles.number}>2</div>
                <div className={styles.title}>整改超时</div>
              </div>
              <div className={styles.labelSecond}>
                <div className={styles.number}>1</div>
                <div className={styles.title}>已整改待复查</div>
              </div>
              <div className={styles.labelThird}>
                <div className={styles.number}>30</div>
                <div className={styles.title}>已关闭</div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.right}>
          <div className={styles.top}>危险作业情况</div>
          <div className={styles.bottom}>
            <div className={styles.label}>
              <div className={styles.num}>
                <span style={{ fontSize: '26px', paddingRight: '20px' }}>210</span>{' '}
                <span>总计</span>
              </div>
              <div className={styles.date}>
                <RangePicker />
              </div>
            </div>
            <div className={styles.echarts}>
              <DangerWorkLine
                data={[16, 35, 10, 20, 40, 38, 12]}
                xData={['12-01', '12-02', '12-03', '12-04', '12-05', '12-06', '12-07']}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderContainerFifth() {
    const { tabValueOther } = this.state;
    const operations = <RangePicker />;
    return (
      <div className={styles.fifthContent}>
        <div className={styles.left}>
          <div className={styles.top}>学习情况</div>
          <div className={styles.bottom}>
            <Tabs tabBarExtraContent={operations}>
              <TabPane tab="学习总人数" key="1">
                <div className={styles.echarts}>
                  <LearningLine data={[5, 20, 35, 48, 62, 68, 72]} />
                </div>
              </TabPane>
              <TabPane tab="人均学习时长" key="2">
                <div className={styles.echarts}>
                  <LearningLine data={[5, 8, 10, 14, 16, 17, 18]} />
                </div>
              </TabPane>
            </Tabs>
          </div>
        </div>
        <div className={styles.middle}>
          <div className={styles.top}>考试情况</div>
          <div className={styles.bottom}>
            <Tabs activeKey={tabValueOther} onChange={this.handleTabChangeOther}>
              <TabPane tab="考试人次" key="1">
                <div className={styles.echarts}>
                  <DangerWorkLine
                    data={[150, 130, 150, 160, 180]}
                    xData={['试卷A', '试卷B', '试卷C', '试卷D', '试卷E']}
                    otherType
                  />
                </div>
              </TabPane>
              <TabPane tab="考试通过情况" key="2">
                <div className={styles.echarts}>
                  <ExamPassPie data={[80, 20]} />
                </div>
              </TabPane>
            </Tabs>
          </div>
        </div>
        <div className={styles.right}>
          <div className={styles.top}>应急演练</div>
          <div className={styles.bottom}>
            <div className={styles.divier} />
            {executeList.map(({ id, executeName, content, status, date, money, area }) => (
              <div className={styles.label} key={id}>
                <div className={styles.labelTitle}>{executeName}</div>
                <div className={styles.labelA}>
                  <span
                    className={styles.itemIcon}
                    style={{ backgroundImage: `url(${Manoeuvre})` }}
                  />
                  <span className={styles.itemTitle}>{content}</span>
                </div>
                <div className={styles.labelB}>
                  <div className={styles.bLeft}>
                    <span
                      className={styles.itemIcon}
                      style={{ backgroundImage: `url(${Execute})` }}
                    />
                    <span className={styles.itemTitle}>{status}</span>
                  </div>
                  <div className={styles.bRight}>
                    <span
                      className={styles.itemIcon}
                      style={{ backgroundImage: `url(${DateIcon})` }}
                    />
                    <span className={styles.itemTitle}>{date}</span>
                  </div>
                </div>
                <div className={styles.labelC}>
                  <div className={styles.cLeft}>
                    <span
                      className={styles.itemIcon}
                      style={{ backgroundImage: `url(${Money})` }}
                    />
                    <span className={styles.itemTitle}>{money}</span>
                  </div>
                  <div className={styles.cRight}>
                    <span
                      className={styles.itemIcon}
                      style={{ backgroundImage: `url(${Location})` }}
                    />
                    <Ellipsis lines={1} tooltip>
                      <span className={styles.itemTitle}>{area}</span>
                    </Ellipsis>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <PageHeaderLayout
        breadcrumbList={breadcrumbList}
        content={
          <div className={styles.topWrite}>
            安全承诺公告：生产装置
            <span className={styles.writeRed}> 4</span> 套，其中运行{' '}
            <span className={styles.writeRed}> 4 </span>
            套，停产 <span className={styles.writeRed}> 0 </span>
            套，检修 <span className={styles.writeRed}> 0</span> 套, 特殊、一级、二级动火作业各{' '}
            <span className={styles.writeRed}> 0</span>、{' '}
            <span className={styles.writeRed}> 0</span>、{' '}
            <span className={styles.writeRed}> 0</span>
            处, 进入受限空间作业 <span className={styles.writeRed}> 0</span> 处, 是否处于试生产{' '}
            <span className={styles.writeRed}> 否</span>, 是否处于开停车状态{' '}
            <span className={styles.writeRed}> 否 </span>, 罐区、仓库等重大危险源是否处于安全状态{' '}
            <span className={styles.writeRed}> 是</span>。
            今天我公司已进行安全风险研判，各项安全风险防控措施已落实到位，我承诺所有生产装置处于安全运行状态，罐区、仓库等重大危险源安全风险得到有效管控。
            主要负责人：刘军 。 2019年09月26日
          </div>
        }
      >
        <div className={styles.container}>
          <div className={styles.containerFirst}>{this.renderContentFirst()}</div>
          <div className={styles.containerSecond}>{this.renderContentSecond()}</div>
          <div className={styles.containerThird}>{this.renderContainerThird()}</div>
          <div className={styles.containerFourth}>{this.renderContainerFourth()}</div>
          <div className={styles.containerFifth}>{this.renderContainerFifth()}</div>
        </div>
      </PageHeaderLayout>
    );
  }
}
