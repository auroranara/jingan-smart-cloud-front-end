import React, { PureComponent } from 'react';
import { debounce } from 'lodash';
import { connect } from 'dva';
import router from 'umi/router';
import { Button, Col, message, Modal, Row } from 'antd';

import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import PersonCard from './components/PersonCard';
import Flag from './components/Flag';
import MultiSubSide from './components/MultiSubSide';
import Clock from './components/Clock';
import Subject from './components/Subject';
import styles from './Result.less';
import { concatAll, getNextSpreadStates } from './utils';
import editIcon from './imgs/edit.png';
import personIcon from './imgs/person.png';

const DELAY = 300;
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

const { confirm } = Modal;

// const choices = ["经验管理阶段", "现代化管理阶段", "科学管理阶段", "人治管理阶段"];

@connect(({ myExam, user, loading }) => ({ myExam, user, loading: loading.models.myExam }))
export default class Examing extends PureComponent {
  state = {
    value: [],
    index: 0,
    showIndex: 0,
    restTime: undefined,
    spreadStates: [], // 展开左边答题卡的题目列表
  };

  componentDidMount() {
    this.fetchSide(true);
    this.debouncedSaveChoice = debounce(this.saveChoice, DELAY);
  }

  list = [];
  categories = [];
  debouncedSaveChoice = null;

  fetchSide = (initial=false) => {
    const { match: { params: { id } }, dispatch } = this.props;
    dispatch({
      type: 'myExam/fetchSide',
      payload: id,
      callback: side => {
        this.list = concatAll(side, KEYS);
        this.categories = KEYS.map(k => ({ title: KEY_CN[k], size: Array.isArray(side[k]) ? side[k].length : 0 })).filter(item => item.size);

        const list = this.list;
        // console.log('list', list);
        if (initial && list.length) {
          this.fetchQuestion(0);
          this.setState({ spreadStates: [...Array(this.categories.length).keys()].map(i => !i) });
        }
      },
    });
  };

  onChoiceChange = v => {
    const { myExam: { question } } = this.props;
    const { index } = this.state;
    this.setState({ value: v });
    this.debouncedSaveChoice(index, v, question);
  };

  // 在点击选择项时就给后台发请求保存当前选择项，用debounce来防止疯狂点击，成功返回后再请求左边的题目列表，改变当前题目的保存状态
  saveChoice = (index, value, question) => {
    const { dispatch, match: { params: { id } } } = this.props;
    dispatch({
      type: 'myExam/putAnswer',
      payload: {
        paperId: id,
        questionId: this.list[index].questionId,
        arrTestAnswer: value.map(i => question.arrOptions[i].id),
      },
      callback: (code, msg) => {
        if (code === 200)
          this.fetchSide();
        else
          message.warn(msg);
      },
    });
  };

  // 保存当前题目的值，并获取序号为i的题目，不传i，只保存当前题目的值，不获取下一题
  handleSaveChoice = (i, callback, isSpreadStatesChange) => {
    const { match: { params: { id } }, dispatch, myExam: { question } } = this.props;
    const { value, index } = this.state;

    // 不需要做判断，未选择时，可能时未选择或者故意清空答案，所以未选答案时也传给后台
    dispatch({
      type: 'myExam/putAnswer',
      payload: { paperId: id,  questionId: this.list[index].questionId, arrTestAnswer: value.map(i => question.arrOptions[i].id) },
      callback: (code, msg) => {
        if (code === 200) {
          this.setState({ value: [] });
          this.handleIndexChange(i, isSpreadStatesChange);
          callback && callback();
        }
        else
          message.warn(msg);
      },
    });
  };

  // i为负数或不为数字类型时，默认不处理
  handleIndexChange = (i, isSpreadStatesChange) => {
    if (typeof i !== 'number' || i < 0)
      return;

    this.setState({ index: i });
    this.fetchQuestion(i, isSpreadStatesChange);
    this.fetchSide();
  };

  fetchQuestion = (index, isSpreadStatesChange) => {
    const { match: { params: { id } }, dispatch } = this.props;

    dispatch({
      type: 'myExam/fetchQuestion',
      payload: { paperId: id,  questionId: this.list[index].questionId },
      callback: (code, msg, question) => {
        if (code !== 200) {
          message.warn(msg);
          // msg包含以下字段时，跳转回列表页
          if (['开始', '结束', '交卷'].map(s => msg.includes(s)).some(b => b))
            this.backToList();
          return;
        }

        let { arrTestAnswer, hasTime } = question;
        if (hasTime <= 0) {
          this.handleStop();
          return;
        }

        this.setState({ showIndex: index, restTime: hasTime });
        isSpreadStatesChange && this.setState({ spreadStates: getNextSpreadStates(index, this.categories) });
        Array.isArray(arrTestAnswer) && this.setState({ value: arrTestAnswer });
      },
    });
  }

  handlePrev = () => {
    const { index } = this.state;
    this.handleSaveChoice(index - 1, null,  true);
  };

  handleNext = () => {
    const { index } = this.state;
    this.handleSaveChoice(index + 1, null, true);
  };

  backToList = () => {
    router.push('/training/my-exam/list');
  };

  // 交卷
  handInExam = () => {
    const { match: { params: { id } }, dispatch } = this.props;

    // 保存完当前题目的值之后再交卷
    this.handleSaveChoice(-1, () => {
      dispatch({
        type: 'myExam/handIn',
        payload: id,
        callback: (code, msg, data) => {
          if (code !== 200) {
            const isHanded = msg.includes('超时');
            message.warn(isHanded ? msg : `${msg}，请重新提交`);
            isHanded && this.backToList();
          }
          else {
            message.success('成功交卷！');
            // console.log(id, data);
            this.backToList();
          }
        },
      });
    });
  };

  handleClickHandIn = () => {
    const { index, value } = this.state;
    // 题目是否都已经答完，当前题目已经选择，且其他题目都已经做过，则点击提交按钮时，提示都已经做完
    const isAllAnswered = this.list.every((item, i) => i === index ? value.length : Number.parseInt(item.status, 10));

    confirm({
      title: '系统提示',
      content: `${isAllAnswered ? '您' : '您还有题目未答完，'}确定要交卷吗？`,
      onOk: () => {
        this.handInExam();
      },
      onCancel: () => {
        // console.log('Cancel');
      },
    });
  };

  handleStop = () => {
    Modal.info({
      title: '系统提示',
      content: '考试已结束，请交卷！',
      onOk: () => {
        this.backToList();
      },
    });
  };

  handleSpreadClick = i => {
    this.setState(({ spreadStates }) => ({ spreadStates: spreadStates.map((s, index) => i === index ? !s : s) }));
  };

  render() {
    const {
      loading,
      myExam: { side, question },
      user: { currentUser: { userName, userTypeName } },
    } = this.props;
    const { value, index, showIndex, restTime, spreadStates } = this.state;
    const list = this.list;
    const categories = this.categories;
    const isFirst = !index;
    const isLast = index === list.length - 1;
    const colors = list.map(({ status }) => status === '0' ? 'white' : 'blue');
    const choices = Array.isArray(question.arrOptions) ? question.arrOptions.map(({ desc }) => desc) : [];
    // const categories = [{ title: '单项选择题', size: 20 }, { title: '多项选择题', size: 20 }, { title: '判断题', size: 20 }];
    // const categories = KEYS.map(k => ({ title: KEY_CN[k], size: Array.isArray(side[k]) ? side[k].length : 0 })).filter(item => item.size);

    // console.log('user', userName, userTypeName);

    return (
      <PageHeaderLayout
        title="正在考试"
        breadcrumbList={breadcrumbList}
        content={question.paperName || NO_DATA}
      >
        <Row>
          <Col span={6} style={COL_STYLE}>
            <div className={styles.head}>
              <span className={styles.rect} />
              答题卡
            </div>
            <div className={styles.side1}>
              <PersonCard
                src={personIcon}
                name={userName || NO_DATA}
                desc={userTypeName || NO_DATA}
              />
              <Flag color="blue">已答题目</Flag>
              <Flag color="white">未答题目</Flag>
              <Button
                type="primary"
                disabled={loading}
                style={SUBMIT_STYLE}
                onClick={this.handleClickHandIn}
              >
                  交<span className={styles.backspace} />卷
              </Button>
              <MultiSubSide
                colors={colors}
                states={spreadStates}
                categories={categories}
                handleClick={this.handleSaveChoice}
                handleSpreadClick={this.handleSpreadClick}
              />
            </div>
          </Col>
          <Col span={18}>
            <div className={styles.container}>
              <div className={styles.head}>
                <img src={editIcon} alt="编辑" className={styles.editIcon} />
                试卷内容
                <Clock counting restTime={restTime} handleStop={this.handleStop} />
              </div>
              <Subject
                style={{ minHeight: 'calc(100vh - 510px)' }}
                index={showIndex}
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
