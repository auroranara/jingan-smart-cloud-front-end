import React, { PureComponent } from 'react';
import ReactEcharts from 'echarts-for-react';
import { Card, Row, Col } from 'antd';
import { connect } from 'dva';

import styles from './MyFile.less';

function KnowledgeList(props) {
  const { index, knowledgeName, questionCount, rightCount, rightPercent } = props;
  return (
    <p style={{ margin: 'auto' }}>
      {index}、{knowledgeName}
      :总共
      {questionCount}
      题，答对
      {rightCount}
      题，正确率
      {rightPercent}
      %；
    </p>
  );
}

@connect(({ myFile }) => ({
  myFile,
}))
export default class SynthesisReport extends PureComponent {
  /**
   * 挂载后
   */
  componentDidMount() {
    const {
      dispatch,
      location: {
        query: { studentId },
      },
    } = this.props;
    dispatch({
      type: 'myFile/fetchMySelfReport',
      payload: {
        studentId: studentId,
      },
    });
  }

  getOption = knowledgeReports => {
    const option = {
      tooltip: {
        formatter: params => {
          return (
            `${params.name}<br/>` +
            params.value
              .map((item, index) => {
                return `<span>${knowledgeReports[index].knowledgeName}：${item}%</span>`;
              })
              .join('<br/>')
          );
        },
      },
      radar: {
        radius: 170,
        name: {
          textStyle: {
            color: '#fff',
            backgroundColor: '#999',
            borderRadius: 3,
            padding: [3, 5],
          },
        },
        indicator: knowledgeReports.map(data => {
          return { name: data.knowledgeName, max: 100 };
        }),
      },
      series: [
        {
          name: '知识点综合分析图',
          type: 'radar',
          data: [
            {
              value: knowledgeReports.map(k => {
                return [k.rightPercent];
              }),
              name: '知识点综合分析图',
            },
          ],
        },
      ],
    };
    return option;
  };

  render() {
    const {
      myFile: {
        myselfData: {
          studentName,
          examCount,
          doExamCount,
          giveUpCount,
          passCount,
          noPassCount,
          maxScore,
          minScore,
          meanScore,
          knowledgeReports = [],
        },
      },
    } = this.props;

    return (
      <Row gutter={16} id="reportIframe">
        <Col>
          <Card>
            <div className={styles.detailFirst}>
              <div className={styles.detailTitle}>综合分析报告</div>
            </div>
            <div className={styles.detailSecond}>
              <span>
                考生：
                {studentName}
              </span>
            </div>
            <div className={styles.detailMain}>
              <div className={styles.grade}>
                <h4>一、学习成绩分析</h4>
                {/* <p>
                    1、
                    <strong>
                      文章阅读 30 篇，阅读次数57次，学习时长为：40 小时 36分钟 ；课件学习 12
                      课，学习次数 6 次 ，学习时长为：50 小时 40分钟；练题时长为：35小时47分钟
                    </strong>
                    。
                  </p> */}
                <p>
                  1、参加考试共计：
                  {examCount}
                  次，其中，已参加
                  {doExamCount}
                  次，缺考
                  {giveUpCount}
                  次，合格：
                  {passCount}
                  次，不合格
                  {noPassCount}
                  次；最好一次成绩正确率为：
                  {maxScore ? `${maxScore}%` : '无'}
                  ，最差一次正确率为：
                  {minScore ? `${minScore}%` : '无'}
                  ，平均正确率为：
                  {meanScore ? `${meanScore}%` : '无'}；
                </p>
                <p>
                  2、所有考试中知识点分为：
                  <strong>
                    {knowledgeReports.length > 0
                      ? knowledgeReports.map(k => k.knowledgeName).join(',')
                      : '无'}
                    ， 共{knowledgeReports.length}
                    项。
                  </strong>
                  我的知识点考试正确率：
                  {knowledgeReports.length > 0
                    ? knowledgeReports.map(item => {
                        const {
                          knowledgeId,
                          knowledgeName,
                          questionCount,
                          rightCount,
                          rightPercent,
                        } = item;
                        return (
                          <span key={knowledgeId}>
                            {knowledgeName}共{questionCount}
                            题，答对
                            {rightCount}题 ，正确率为：
                            {rightPercent}% 。
                          </span>
                        );
                      })
                    : '无。'}
                </p>
                {/* <p>
                    4、本次考试题量：
                    <strong>50道</strong>
                    ，其中，单项选择题：
                    <strong>30道</strong>， 多项选择题：
                    <strong>15道</strong>
                    ，判断题：
                    <strong>5道</strong>
                    。考试总 时长：
                    <strong>90分钟</strong>
                    ，最快完成答题用时：
                    <strong>45分钟</strong>
                    ，最慢完成答题用时：
                    <strong>87分钟</strong>。
                  </p> */}
              </div>
              <div className={styles.knowledge}>
                <h4>二、知识点综合分析</h4>
                {knowledgeReports.length > 2 && (
                  <ReactEcharts
                    style={{ height: '450px' }}
                    option={this.getOption(knowledgeReports)}
                    notMerge={true}
                    lazyUpdate={true}
                  />
                )}
                <span>
                  {knowledgeReports.map((item, index) => {
                    const {
                      knowledgeId,
                      knowledgeName,
                      questionCount,
                      rightCount,
                      rightPercent,
                    } = item;
                    return (
                      <KnowledgeList
                        key={knowledgeId}
                        index={index + 1}
                        knowledgeName={knowledgeName}
                        questionCount={questionCount}
                        rightCount={rightCount}
                        rightPercent={rightPercent}
                      />
                    );
                  })}
                </span>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    );
  }
}
