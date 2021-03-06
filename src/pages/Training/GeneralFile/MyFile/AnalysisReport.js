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
export default class AnalysisReport extends PureComponent {
  /**
   * 挂载后
   */
  componentDidMount() {
    const {
      dispatch,
      match: {
        params: { id },
      },
      location: {
        query: { studentId },
      },
    } = this.props;
    dispatch({
      type: 'myFile/fetchExamReport',
      payload: {
        examId: id,
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
        indicator: knowledgeReports.map(k => {
          return { name: k.knowledgeName, max: 100 };
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

  // 下载
  reportDownload = () => {};

  render() {
    const {
      myFile: {
        analysisData: {
          studentName,
          shouldCount,
          actualCount,
          giveUpCount,
          maxScore,
          minScore,
          meanScore,
          myScore,
          myRanking,
          myPassStatus,
          passCount,
          noPassCount,
          passPercent,
          knowledgeReports = [],
        },
      },
    } = this.props;

    return (
      <Row gutter={16} id="reportIframe">
        <Col>
          <Card>
            <div className={styles.detailFirst}>
              <div className={styles.detailTitle}>考试成绩综合分析报告</div>
            </div>
            <div className={styles.detailSecond}>
              <span>
                考生：
                {studentName}
              </span>
            </div>
            <div className={styles.detailMain}>
              <div className={styles.grade}>
                <h3>一、考试成绩分析</h3>
                <p>
                  1、本次考试
                  <strong>
                    计划参加考试人数：
                    {shouldCount}
                    人，实际考试人数：
                    {actualCount}
                    人，缺考人数：
                    {giveUpCount}
                    人， 考试最高正确率：
                    {maxScore === null ? '无' : `${maxScore}%`}
                    ，最低正确率：
                    {minScore === null ? '无' : `${minScore}%`}
                    ，平均正确率：
                    {meanScore === null ? '无' : `${meanScore}%`} ，我的正确率为：
                    {myScore === null ? '无' : `${myScore}%`}
                  </strong>
                  。
                </p>
                <p>
                  2、本次考试试题设定合格率为
                  {passPercent}
                  %，本次实际参加考试人数：
                  {actualCount}
                  人，
                  <strong>
                    合格人数：
                    {passCount}
                    人，不合格人数：
                    {noPassCount}
                    人，我的成绩：
                    {myPassStatus === '1' ? '合格' : myPassStatus === '-1' ? '弃考' : '不合格'}
                    {myPassStatus !== '-1' && (
                      <span>
                        ，排名为：第
                        {myRanking}名
                      </span>
                    )}
                  </strong>
                  。
                </p>
                <p>
                  3、考试知识点分为：
                  <strong>
                    {knowledgeReports.map(k => k.knowledgeName).join(',')}， 共
                    {knowledgeReports.length}项
                  </strong>
                  。我的知识点考试正确率：
                  {knowledgeReports.map(item => {
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
                        {rightPercent}
                        %。
                      </span>
                    );
                  })}
                </p>
              </div>
              <div className={styles.knowledge}>
                <h3>二、知识点综合分析</h3>

                {knowledgeReports.length > 2 && (
                  <ReactEcharts
                    style={{ height: '450px', textIndent: 0 }}
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
