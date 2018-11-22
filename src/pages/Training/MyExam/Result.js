import React, { PureComponent, Fragment } from 'react';
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
import { concatAll } from './utils';
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

const NO_DATA = '暂无信息';
const KEYS = ['singleQuestionIndex', 'multiQuestionIndex', 'judgeQuestionIndex'];
const KEY_CN = { singleQuestionIndex: '单项选择题', multiQuestionIndex: '多项选择题', judgeQuestionIndex: '判断题' };
// const TYPE_MAP = { singleQuestionIndex: 'single', multiQuestionIndex: 'multi', judgeQuestionIndex: 'judge' };
const TYPE_MAP = { 1: 'single', 2: 'multi', 3: 'judge' };
const CATEGORIES = ['singleQuestions', 'multiQuestions', 'judgeQuestions'];
const CATEGORIES_MAP = { singleQuestions: '单项选择题', multiQuestions: '多项选择题', judgeQuestions: '判断题' };

@connect(({ myExam, user, loading }) => ({ myExam, user, loading: loading.models.myExam }))
export default class ExamResult extends PureComponent {
  state = { index: 0 };

  componentDidMount() {
    const { match: { params: { id } }, dispatch } = this.props;
    dispatch({
      type: 'myExam/fetchSide',
      payload: id,
    });
    dispatch({
      type: 'myExam/fetchPaper',
      payload: id,
    });
  }

  onIndexChange = i => {
    this.setState({ index: i });
  };

  render() {
    const {
      loading,
      myExam: {
        side,
        paper,
      },
      user: { currentUser: { userName, userTypeName } },
    } = this.props;
    const { index } = this.state;
    const { score, passStatus, useTime, studentName, studentTypeName } = paper;

    let count = 0;
    const list = concatAll(side, KEYS);
    const categories = KEYS.map(k => ({ title: KEY_CN[k], size: Array.isArray(side[k]) ? side[k].length : 0 })).filter(item => item.size);
    const colors = list.map(({ status }) => Number.parseInt(status, 10) ? 'green' : 'red');

    // console.log('paper', paper);

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
              <PersonCard src={personIcon} name={studentName || NO_DATA} desc={studentTypeName || NO_DATA} />
              <Flag color="green">正确题目</Flag>
              <Flag color="red">错误题目</Flag>
              <Accuracy status={Number.parseInt(passStatus, 10)}>{score}</Accuracy>
              <MultiSubSide
                colors={colors}
                handleClick={this.onIndexChange}
                categories={categories}
              />
            </div>
          </Col>
          <Col span={18}>
            <div className={styles.container}>
              <div className={styles.head}>
                <img src={editIcon} alt="编辑" className={styles.editIcon} />
                试卷内容
                <Clock restTime={useTime} />
              </div>
              {CATEGORIES.map((c, i) => {
                const cList = paper[c];

                if (!Array.isArray(cList) || !cList.length)
                  return null;

                return (
                  <SubjectCategory key={c} index={i} title={CATEGORIES_MAP[c]} quantity={cList.length}>
                    {cList.map(item => {
                      const { id, stem, arrAnswer, arrTestAnswer, arrOptions, desc } = item;
                      const choices = arrOptions.map(({ desc }) => desc);
                      return (
                        <Fragment key={id}>
                          <Subject index={count++} type="analysis" question={stem} choices={choices} />
                          <Answer answer={[arrAnswer, arrTestAnswer]} analysis={desc} />
                        </Fragment>
                      );
                    })}
                  </SubjectCategory>
                )
              })}
              {/* <SubjectCategory title="单项选择题" quantity="30">
                <Subject type="analysis" question="企业管理的发展阶段" choices={choices} />
                <Answer answer={['A', 'B']} analysis={analysis} />
              </SubjectCategory> */}
              {/* <div className={styles.btnContainer}>
                <div className={styles.innerBtnContainer}>
                  <Button type="primary" style={{...BTN_STYLE, marginRight: 15}}>上一题</Button>
                  <Button type="primary" style={BTN_STYLE}>下一题</Button>
                </div>
              </div> */}
            </div>
          </Col>
        </Row>
      </PageHeaderLayout>
    );
  }
}
