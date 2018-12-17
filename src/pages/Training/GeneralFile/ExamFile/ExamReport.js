import React, { PureComponent } from 'react';
import ReactEcharts from 'echarts-for-react';
import { Card, Row, Col, Button } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';

import styles from '../GeneralFile.less';

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

// 标题
const title = '综合分析报告';

//面包屑
const breadcrumbList = [
  {
    title: '首页',
    name: '首页',
    href: '/',
  },
  {
    title: '教育培训',
    name: '教育培训',
  },
  {
    title: '综合档案',
    name: '综合档案',
    href: '/training/generalFile/examFile/list',
  },
  {
    title,
    name: '综合分析报告',
  },
];

@connect(({ generalFile }) => ({
  generalFile,
}))
export default class ExamReport extends PureComponent {
  // 挂载后
  componentDidMount() {
    const {
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;
    // 获取报告详情
    dispatch({
      type: 'generalFile/fetchMultipleReport',
      payload: {
        examId: id,
      },
    });
  }

  getOption = knowledgeReports => {
    const option = {
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
              value: knowledgeReports.map(data => {
                return { value: data.rightPercent };
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
      generalFile: {
        multipleData: {
          shouldCount,
          actualCount,
          giveUpCount,
          examMaxScore,
          examMinScore,
          examMeanScore,
          passCount,
          noPassCount,
          percentOfPass,
          passPercent,
          noPassPercent,
          singleCount,
          multiCount,
          judgeCount,
          examMinUseTime,
          examMaxUseTime,
          examLimitTime,
          giveUpUsers = [],
          maxScoreUsers = [],
          minScoreUsers = [],
          noPassUsers = [],
          knowledgeReports = [],
        },
      },
    } = this.props;

    return (
      <PageHeaderLayout
        title="综合分析报告"
        breadcrumbList={breadcrumbList}
        content={<div />}
        extraContent={
          <Button className={styles.backBtn} onClick={this.reportDownload}>
            下载
          </Button>
        }
      >
        <Row gutter={16}>
          <Col>
            <Card>
              <div className={styles.detailFirst}>
                <div className={styles.detailTitle}>考试成绩综合分析报告</div>
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
                      人(
                      {giveUpUsers.length > 0 ? giveUpUsers.join('、') : ''}
                      )， 考试最高正确率：
                      {examMaxScore ? examMaxScore : 0}% (
                      {maxScoreUsers.length > 0 ? maxScoreUsers.join('、') : ''}) ，最低正确率：
                      {examMinScore ? examMinScore : 0}% (
                      {minScoreUsers.length > 0 ? minScoreUsers.join('、') : ''}) ，平均正确率：
                      {examMeanScore ? examMeanScore : 0}%
                    </strong>
                    。
                  </p>
                  <p>
                    2、本次考试试题设定合格率为
                    {percentOfPass}
                    %，本次实际参加考试人数：
                    {actualCount}
                    人，
                    <strong>
                      合格人数：
                      {passCount}
                      人，占比为：
                      {passPercent}
                      %，不合格人数：
                      {noPassCount}
                      人(
                      {noPassUsers.length > 0 ? noPassUsers.join('、') : ''}) ，占比为：
                      {noPassPercent}%
                    </strong>
                    。
                  </p>
                  <p>
                    3、本次考试试题知识点分为：
                    <strong>
                      {knowledgeReports.map(k => k.knowledgeName).join(',')}， 共
                      {knowledgeReports.length}项
                    </strong>
                    。 其中
                    {knowledgeReports.map(item => {
                      const { knowledgeId, knowledgeName, questionCount } = item;
                      const total = knowledgeReports
                        .map(t => t.questionCount)
                        .reduce(function(prev, curr) {
                          return prev + curr;
                        });
                      return (
                        <span key={knowledgeId}>
                          {knowledgeName}
                          比例为：
                          {((questionCount / total) * 100).toFixed(2)}
                          %。
                        </span>
                      );
                    })}
                  </p>
                  <p>
                    4、本次考试题量：
                    {singleCount + multiCount + judgeCount} 道，其中，单项选择题：
                    {singleCount}
                    道，多项选择题：
                    {multiCount}
                    道，判断题：
                    {judgeCount}
                    道。考试总时长： {moment(examLimitTime).format('mm分钟')}
                    ，最快完成答题用时：
                    {examMinUseTime ? moment(examMinUseTime).format('mm分钟') : '00分钟'}
                    ，最慢完成答题用时：
                    {examMaxUseTime ? moment(examMaxUseTime).format('mm分钟') : '00分钟'}。
                  </p>
                </div>
                <div className={styles.knowledge}>
                  <h3>二、知识点综合分析</h3>
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
      </PageHeaderLayout>
    );
  }
}
