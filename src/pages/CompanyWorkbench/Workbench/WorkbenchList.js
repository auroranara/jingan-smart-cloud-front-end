import React, { PureComponent, Fragment } from 'react';
// import { connect } from 'dva';
import { Card, Button, Input, Select, Table, message } from 'antd';
// import { Link } from 'dva/router';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
// import Ellipsis from '@/components/Ellipsis';

import RiskPoint from './image/riskPoint.png';
import CurrentDanger from './image/currentDanger.png';
import Materical from './image/materical.png';
import Technonlogy from './image/technonlogy.png';
import MajorDanger from './image/majorDanger.png';

import styles from './WorkbenchList.less';
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

// @connect(({ loading }) => ({}))
export default class WorkbenchList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // 挂载后
  componentDidMount() {}

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
          <div className={styles.item} key={name}>
            <div className={styles.left} style={{ backgroundImage: `url(${icon})` }} />
            <div className={styles.right}>
              <div className={styles.name}>{name}</div>
              <div className={styles.value}>{value}</div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  renderContentSecond() {
    const list = [...Array(10).keys()].map(i => ({
      id: i,
      status: '报警',
      name: '可燃气体浓度',
      area: '5楼实验室',
      date: '2019.10.10  12:10:10',
      content: '当前可燃气体浓度为111%LEL，达到报警级别，超过报警阈值30%（报警阈值为80）',
    }));
    return (
      <div className={styles.secondContent}>
        <div className={styles.leftItem}>
          <div className={styles.titleLeft}>工作提醒</div>
          <div className={styles.contentLeft}>
            {list.map(({ id, status, name, area, date, content }) => (
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
        <div className={styles.rightItem}>
          <div className={styles.titleRight}>到期统计</div>
          <div className={styles.contentRight}>
            <div className={styles.navLayout}>
              <div className={styles.oneNav}>
                <div className={styles.icon}>
                  <div className={styles.left} />
                  <div className={styles.right}>
                    <div className={styles.name}>{name}</div>
                    <div className={styles.value}>
                      数量总计：
                      {100}个
                    </div>
                  </div>
                </div>
                <div className={styles.pieOne} />
                <div className={styles.pieTwo} />
                <div className={styles.pieThree} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderContainerThird() {
    return (
      <div className={styles.thirdContent}>
        <div className={styles.leftItem}>
          <div className={styles.titleLeft}>重大危险源实时监测</div>
          <div className={styles.contentLeft} />
        </div>
        <div className={styles.rightItem}>
          <div className={styles.titleRight}>重大危险源历史统计</div>
          <div className={styles.contentRight} />
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
            主要负责人：刘军 2019年09月26日
          </div>
        }
      >
        <div className={styles.container}>
          <div className={styles.containerFirst}>{this.renderContentFirst()}</div>
          <div className={styles.containerSecond}>{this.renderContentSecond()}</div>
          <div className={styles.containerThird}>{this.renderContainerThird()}</div>
          <div className={styles.containerFourth}>4</div>
          <div className={styles.containerFifth}>5</div>
        </div>
      </PageHeaderLayout>
    );
  }
}
