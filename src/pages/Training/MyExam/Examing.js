import React, { PureComponent } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Button, Col, message, Row } from 'antd';

import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import PersonCard from './components/PersonCard';
import Flag from './components/Flag';
import MultiSubSide from './components/MultiSubSide';
import Clock from './components/Clock';
import Subject from './components/Subject';
import styles from './Result.less';
import { concatAll } from './utils';
import editIcon from './imgs/edit.png';
import personIcon from './imgs/person.png';

const NO_DATA = '暂无信息';
const COL_STYLE = { backgroundColor: '#FFF' };
const BTN_STYLE = { width: 120, height: 30, lineHeight: '30px' };
const SUBMIT_STYLE = { width: '100%', marginTop: 15, fontSize: 18 };
const KEYS = ['singleQuestionIndex', 'multiQuestionIndex', 'judgeQuestionIndex'];
const KEY_CN = { singleQuestionIndex: '单项选择题', multiQuestionIndex: '多项选择题', judgeQuestionIndex: '判断题' };
// const TYPE_MAP = { singleQuestionIndex: 'single', multiQuestionIndex: 'multi', judgeQuestionIndex: 'judge' };
const TYPE_MAP = { 1: 'single', 2: 'multi', 3: 'judge' };

const breadcrumbList = [
  { title: '首页', name: '首页', href: '/' },
  { title: '教育培训', name: '教育培训' },
  { title: '我的考试', name: '我的考试', href: '/training/my-exam/list' },
  { title: '正在考试', name: '正在考试' },
];

// const choices = ["经验管理阶段", "现代化管理阶段", "科学管理阶段", "人治管理阶段"];

@connect(({ myExam, loading }) => ({ myExam, loading: loading.models.myExam }))
export default class Examing extends PureComponent {
  state = { value: [], index: 0 };

  componentDidMount() {
    this.fetchSide(true);
  }

  list = [];

  fetchSide = (initial=false) => {
    const { match: { params: { id } }, dispatch } = this.props;
    dispatch({
      type: 'myExam/fetchSide',
      payload: id,
      callback: data => {
        this.list = concatAll(data, KEYS);

        const list = this.list;
        // console.log('list', list);
        if (initial && list.length)
          this.fetchQuestion(0);
      },
    });
  };

  onChoiceChange = v => {
    this.setState({ value: v });
  };

  // index改变时保存，直接点击左边序号时也要保存当前的题目的值
  onIndexChange = i => {
    this.setState({ index: i });
    this.fetchQuestion(i);
    this.fetchSide();
  };

  fetchQuestion = (index) => {
    const { match: { params: { id } }, dispatch } = this.props;

    dispatch({
      type: 'myExam/fetchQuestion',
      payload: { paperId: id,  questionId: this.list[index].questionId },
      callback: question => {
        let { arrTestAnswer, hasTime } = question;
        if (hasTime <= 0)
          return;
        if (Array.isArray(arrTestAnswer))
          this.setState({ value: arrTestAnswer });
      },
    });
  }

  handleSaveChoice = (prevOrNext) => {
    const { match: { params: { id } }, dispatch, myExam: { question } } = this.props;
    const { value, index } = this.state;
    const nextIndex = prevOrNext === 'prev' ? index - 1 : index + 1;
    // console.log('value', value);
    // 当前题目已经选了选项时，保存到服务器，没有选择时不进行操作
    if (value.length)
      dispatch({
        type: 'myExam/putAnswer',
        payload: { paperId: id,  questionId: this.list[index].questionId, arrTestAnswer: value.map(i => question.arrOptions[i].id) },
        callback: (code, msg) => {
          if (code === 200) {
            this.setState({ value: [] });
            this.onIndexChange(nextIndex);
          }
          else
            message.warn(msg);
        },
      });
    else
      this.onIndexChange(nextIndex);
  };

  handlePrev = () => {
    this.handleSaveChoice('prev');
  };

  handleNext = () => {
    this.handleSaveChoice('next');
  };

  render() {
    const { myExam: { side, question }, loading } = this.props;
    const { value, index } = this.state;
    const list = this.list;
    const isFirst = !index;
    const isLast = index === list.length - 1;
    // const categories = [{ title: '单项选择题', size: 20 }, { title: '多项选择题', size: 20 }, { title: '判断题', size: 20 }];
    const categories = KEYS.map(k => ({ title: KEY_CN[k], size: Array.isArray(side[k]) ? side[k].length : 0 })).filter(item => item.size);
    // console.log('question', question);
    const choices = Array.isArray(question.arrOptions) ? question.arrOptions.map(({ desc }) => desc) : [];
    const colors = list.map(({ status }) => status === '0' ? 'white' : 'blue');

    return (
      <PageHeaderLayout
        title="正在考试"
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
              <Flag color="blue">已答题目</Flag>
              <Flag color="white">未答题目</Flag>
              <Button type="primary" style={SUBMIT_STYLE}>交<span className={styles.backspace} />卷</Button>
              <MultiSubSide
                categories={categories}
                handleClick={this.onIndexChange}
                colors={colors}
              />
            </div>
          </Col>
          <Col span={18}>
            <div className={styles.container}>
              <div className={styles.head}>
                <img src={editIcon} alt="编辑" className={styles.editIcon} />
                试卷内容
                <Clock counting startTime={Date.now()} time={Date.now()} limit={6000} />
              </div>
              <Subject
                index={index}
                value={value}
                question={question.stem || NO_DATA}
                choices={choices}
                type={list.length ? TYPE_MAP[question.type] : undefined}
                onChange={this.onChoiceChange}
              />
              <div className={styles.btnContainer}>
                <div className={styles.innerBtnContainer}>
                  <Button
                    type="primary"
                    disabled={isFirst || loading}
                    style={{...BTN_STYLE, marginRight: 15}}
                    onClick={this.handlePrev}
                  >
                    上一题
                  </Button>
                  <Button
                    type="primary"
                    disabled={isLast || loading}
                    style={BTN_STYLE}
                    onClick={this.handleNext}
                  >
                    下一题
                  </Button>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </PageHeaderLayout>
    );
  }
}
