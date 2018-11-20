import React, { PureComponent } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Button, Row, Col } from 'antd';

import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import PersonCard from './components/PersonCard';
import Flag from './components/Flag';
import Accuracy from './components/Accuracy';
import MultiSubSide from './components/MultiSubSide';
import Clock from './components/Clock';
import Subject from './components/Subject';
import Answer from './components/Answer';
import SubjectCategory from './components/SubjectCategory';
import styles from './Result.less';
import editIcon from './imgs/edit.png';
import personIcon from './imgs/person.png';

const COL_STYLE = { backgroundColor: '#FFF' };
const BTN_STYLE = { width: 120, height: 30, lineHeight: '30px' };

const breadcrumbList = [
  { title: '首页', name: '首页', href: '/' },
  { title: '教育培训', name: '教育培训' },
  { title: '我的考试', name: '我的考试', href: '/training/my-exam/list' },
  { title: '考试分析', name: '考试分析' },
];

const choices = ["经验管理阶段", "现代化管理阶段", "科学管理阶段", "人治管理阶段"];
const analysis = Array(50).fill('答案解析').join();

export default class ExamList extends PureComponent {
  state = { val: 0, vals: [], index: 0 };

  onSingleChange = v => {
    this.setState({ val: v });
  };

  onMultiChange = vals => {
    this.setState({ vals });
  };

  onIndexChange = i => {
    this.setState({ index: i });
  };

  render() {
    const { val, vals, index } = this.state;
    const colors = [...Array(60).keys()].map(i => Math.random() > 0.5 ? 'red' : 'green');

    return (
      <PageHeaderLayout
        title="考试分析"
        breadcrumbList={breadcrumbList}
        // content={}
      >
        <Row>
          <Col span={6} style={COL_STYLE}>
            <div className={styles.head}>
              <span className={styles.rect} />
              答题卡
            </div>
            <div className={styles.side}>
              <PersonCard src={personIcon} name="张晓光" desc="企业安全员/企业安全负责人" />
              <Flag color="green">正确题目</Flag>
              <Flag color="red">错误题目</Flag>
              <Accuracy>50</Accuracy>
              <MultiSubSide
                colors={colors}
                handleClick={this.onIndexChange}
                categories={[{ title: '单项选择题', size: 20 }, { title: '多项选择题', size: 20 }, { title: '判断题', size: 20 }]}
              />
            </div>
          </Col>
          <Col span={18}>
            <div className={styles.container}>
              <div className={styles.head}>
                <img src={editIcon} alt="编辑" className={styles.editIcon} />
                试卷内容
                <Clock counting startTime={Date.now()} time={Date.now()} limit={120} />
              </div>
              <SubjectCategory title="单项选择题" quantity="30">
                <Subject question="企业管理的发展阶段" choices={choices} onChange={this.onSingleChange} value={val} />
              </SubjectCategory>
              <Answer answer={['A', 'B']} analysis={analysis} />
              <div className={styles.btnContainer}>
                <div className={styles.innerBtnContainer}>
                  <Button type="primary" style={{...BTN_STYLE, marginRight: 15}}>上一题</Button>
                  <Button type="primary" style={BTN_STYLE}>下一题</Button>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </PageHeaderLayout>
    );
  }
}
