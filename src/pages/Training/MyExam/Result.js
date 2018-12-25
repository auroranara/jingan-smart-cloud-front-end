import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
// import router from 'umi/router';
import { Affix, Row, Col } from 'antd';

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

// const COL_STYLE = { backgroundColor: '#FFF' };
// const BTN_STYLE = { width: 120, height: 30, lineHeight: '30px' };

// const choices = ["经验管理阶段", "现代化管理阶段", "科学管理阶段", "人治管理阶段"];
// const analysis = Array(50).fill('答案解析').join();

const NO_DATA = '暂无信息';
const KEYS = ['singleQuestionIndex', 'multiQuestionIndex', 'judgeQuestionIndex'];
const KEY_CN = {
  singleQuestionIndex: '单项选择题',
  multiQuestionIndex: '多项选择题',
  judgeQuestionIndex: '判断题',
};
// const TYPE_MAP = { singleQuestionIndex: 'single', multiQuestionIndex: 'multi', judgeQuestionIndex: 'judge' };
// const TYPE_MAP = { 1: 'single', 2: 'multi', 3: 'judge' };
const CATEGORIES = ['singleQuestions', 'multiQuestions', 'judgeQuestions'];
const CATEGORIES_MAP = {
  singleQuestions: '单项选择题',
  multiQuestions: '多项选择题',
  judgeQuestions: '判断题',
};

@connect(({ myExam, user, loading }) => ({ myExam, user, loading: loading.models.myExam }))
export default class ExamResult extends PureComponent {
  state = {
    // index: 0,
    spreadStates: [],
  };

  componentDidMount() {
    const {
      match: {
        params: { id },
      },
      dispatch,
    } = this.props;
    dispatch({
      type: 'myExam/fetchSide',
      payload: id,
      callback: side => {
        const categories = KEYS.map(k => ({
          title: KEY_CN[k],
          size: Array.isArray(side[k]) ? side[k].length : 0,
        })).filter(item => item.size);
        this.setState({ spreadStates: [...Array(categories.length).keys()].map(i => !i) });
      },
    });
    dispatch({
      type: 'myExam/fetchPaper',
      payload: id,
    });
  }

  onIndexChange = i => {
    // this.setState({ index: i });
    const rect = document.querySelector(`#my-exam-result-${i}`).getBoundingClientRect();
    // console.log(rect);
    const top = rect.top;
    // console.log(i, top);
    window.scrollBy(0, top - 80);
  };

  handleSpreadClick = i => {
    this.setState(({ spreadStates }) => ({
      spreadStates: spreadStates.map((s, index) => (i === index ? !s : s)),
    }));
  };

  render() {
    const {
      // loading,
      myExam: { side, paper },
      location: {
        query: {
          examId,
          id,
          name,
          startTime,
          endTime,
          examLimit,
          percentOfPass,
          studentId,
          companyId,
        },
      },
      // user: { currentUser: { userName, userTypeName } },
    } = this.props;
    console.log(' this.props', this.props);

    const {
      // index,
      spreadStates,
    } = this.state;

    const breadcrumbList = [
      { title: '首页', name: '首页', href: '/' },
      { title: '教育培训', name: '教育培训' },
      {
        title: examId ? '我的档案' : id ? '考试详情' : studentId ? '人员档案' : '我的考试',
        name: examId ? '我的档案' : id ? '考试详情' : studentId ? '人员档案' : '我的考试',
        href: examId
          ? '/training/myFile/myFileList'
          : id
            ? `/training/generalFile/examDetailList/${id}?id=${id}&&name=${name}&&startTime=${startTime}&&endTime=${endTime}&&examLimit=${examLimit}&&percentOfPass=${percentOfPass}`
            : studentId
              ? `/training/generalFile/myFile/myFileList?studentId=${studentId}&&companyId=${companyId}`
              : '/training/my-exam/list',
      },
      { title: '考试分析', name: '考试分析' },
    ];

    const { paperName, score, passStatus, useTime, studentName, studentTypeName } = paper;

    let count = 0;
    const list = concatAll(side, KEYS);
    const colors = list.map(({ status }) => (Number.parseInt(status, 10) ? 'green' : 'red'));
    const categories = KEYS.map(k => ({
      title: KEY_CN[k],
      size: Array.isArray(side[k]) ? side[k].length : 0,
    })).filter(item => item.size);

    // console.log('paper', paper);

    return (
      <PageHeaderLayout
        title="考试分析"
        breadcrumbList={breadcrumbList}
        content={paperName || NO_DATA}
      >
        <Row>
          <Col span={6}>
            <Affix offsetTop={90}>
              <div className={styles.head}>
                <span className={styles.rect} />
                答题卡
              </div>
              <div className={styles.side}>
                <PersonCard
                  src={personIcon}
                  name={studentName || NO_DATA}
                  desc={studentTypeName || NO_DATA}
                />
                <Flag color="green">正确题目</Flag>
                <Flag color="red">错误题目</Flag>
                <Accuracy status={Number.parseInt(passStatus, 10)}>{score || 0}</Accuracy>
                <MultiSubSide
                  colors={colors}
                  categories={categories}
                  states={spreadStates}
                  handleClick={this.onIndexChange}
                  handleSpreadClick={this.handleSpreadClick}
                />
              </div>
            </Affix>
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

                if (!Array.isArray(cList) || !cList.length) return null;

                return (
                  <SubjectCategory
                    key={c}
                    index={i}
                    title={CATEGORIES_MAP[c]}
                    quantity={cList.length}
                  >
                    {cList.map(item => {
                      const { id, stem, arrAnswer, arrTestAnswer, arrOptions, des } = item;
                      const choices = arrOptions.map(({ desc }) => desc);
                      return (
                        <Fragment key={id}>
                          <Subject
                            id={`my-exam-result-${count}`}
                            index={count++}
                            type="analysis"
                            question={stem}
                            choices={choices}
                          />
                          <Answer answer={[arrAnswer, arrTestAnswer]} analysis={des} />
                        </Fragment>
                      );
                    })}
                  </SubjectCategory>
                );
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
