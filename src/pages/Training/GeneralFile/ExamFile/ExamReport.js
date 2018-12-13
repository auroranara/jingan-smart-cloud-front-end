import React, { PureComponent } from 'react';
import ReactEcharts from 'echarts-for-react';
import { Card, Row, Col, Button } from 'antd';
import { connect } from 'dva';
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
    // const {
    //   dispatch,
    //   match: {
    //     params: { id },
    //   },
    // } = this.props;
    // // 获取报告详情
    // dispatch({
    //   type: 'generalFile/fetchExamReport',
    //   payload: {
    //     examId: id,
    //   },
    // });
  }

  getOption = knowledgeReports => {
    const option = {
      radar: {
        radius: 170,
        tooltip: {},
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
          name: '预算 vs 开销（Budget vs spending）',
          type: 'radar',
          data: [
            {
              value: knowledgeReports.map(data => {
                return { value: data.rightPercent };
              }),
              name: '预算分配（Allocated Budget）',
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
        reportData: {
          shouldCount,
          actualCount,
          giveUpCount,
          maxScore,
          minScore,
          meanScore,
          passCount,
          noPassCount,
          passPercent,
          name,
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
                      人， 考试最高正确率：
                      {maxScore}({name.map(k => k.knowledgeName).join('、')}) %，最低正确率：
                      {minScore}({name.map(k => k.knowledgeName).join('、')}) %，平均正确率：
                      {meanScore}%
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
                      人，占比为：
                      {}
                      %，不合格人数：
                      {noPassCount}
                      人(
                      {name.map(k => k.knowledgeName).join('、')}
                      )，占比为：
                      {}%
                    </strong>
                    。
                  </p>
                  <p>
                    3、本次考试试题知识点分为：
                    <strong>
                      {knowledgeReports.map(k => k.knowledgeName).join(',')}， 共
                      {knowledgeReports.length}项
                    </strong>
                    ，其中
                    {knowledgeReports.map(item => {
                      const { knowledgeName, questionCount } = item;
                      return (
                        <span>
                          {knowledgeName}
                          比例为：
                          {questionCount}，
                        </span>
                      );
                    })}
                  </p>
                  <p>
                    4、本次考试题量：50道，其中，单项选择题：30道，多项选择题：15道，判断题：5道。考试总
                    时长：90分钟，最快完成答题用时：45分钟，最慢完成答题用时：87分钟。
                  </p>
                </div>
                <div className={styles.knowledge}>
                  <h3>二、知识点综合分析</h3>
                  <p>
                    <ReactEcharts
                      style={{ height: '450px' }}
                      option={this.getOption(knowledgeReports)}
                      notMerge={true}
                      lazyUpdate={true}
                    />
                  </p>
                  <p>
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
                  </p>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </PageHeaderLayout>
    );
  }
}
