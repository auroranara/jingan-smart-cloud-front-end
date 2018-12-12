import React, { PureComponent } from 'react';
import ReactEcharts from 'echarts-for-react';
import { Card, Row, Col, Button } from 'antd';
import { connect } from 'dva';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';

import styles from './MyFile.less';

function KnowledgeList(props) {
  const { content } = props;
  return (
    <Row style={{ fontSize: '15px' }}>
      <p style={{ margin: 'auto' }}>{content ? content : null()}</p>
    </Row>
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
    title: '我的档案',
    name: '我的档案',
    href: '/training/myFile/myFileList',
  },
  {
    title,
    name: '综合分析报告',
  },
];

@connect(({ myFile }) => ({
  myFile,
}))
export default class MyAnalysis extends PureComponent {
  /**
   * 挂载后
   */
  componentDidMount() {}

  getOption = () => {
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
        indicator: [
          { name: '销售（sales）', max: 100 },
          { name: '管理（Administration）', max: 100 },
          { name: '信息技术（Information Techology）', max: 100 },
          { name: '客服（Customer Support）', max: 100 },
          { name: '研发（Development）', max: 100 },
          { name: '市场（Marketing）', max: 100 },
        ],
      },
      series: [
        {
          name: '预算 vs 开销（Budget vs spending）',
          type: 'radar',
          data: [
            {
              value: [50, 60, 30, 40, 50, 20],
              name: '预算分配（Allocated Budget）',
            },
          ],
        },
      ],
    };
    return option;
  };

  // 下载
  synthesisDownLoad = () => {};
  render() {
    const items = [
      {
        content: '1、岗前技能培训：总共10题，答对6题，正确率60%；',
      },
      {
        content: '1、岗前技能培训：总共10题，答对6题，正确率60%；',
      },
      {
        content: '1、岗前技能培训：总共10题，答对6题，正确率60%；',
      },
      {
        content: '1、岗前技能培训：总共10题，答对6题，正确率60%；',
      },
    ];

    return (
      <PageHeaderLayout
        title="综合分析报告"
        breadcrumbList={breadcrumbList}
        content={<div />}
        extraContent={
          <Button className={styles.backBtn} onClick={this.synthesisDownLoad}>
            下载
          </Button>
        }
      >
        <Row gutter={16}>
          <Col>
            <Card>
              <div className={styles.detailFirst}>
                <div className={styles.detailTitle}>综合分析报告</div>
              </div>
              <div className={styles.detailSecond}>
                <span>考生：张三</span>
              </div>
              <div className={styles.detailMain}>
                <div className={styles.grade}>
                  <h4>一、学习成绩分析</h4>
                  <p>
                    1、
                    <strong>
                      文章阅读 30 篇，阅读次数57次，学习时长为：40 小时 36分钟 ；课件学习 12
                      课，学习次数 6 次 ，学习时长为：50 小时 40分钟；练题时长为：35小时47分钟
                    </strong>
                    。
                  </p>
                  <p>
                    2、参加考试共计：5次，其中，应考 5次，缺考 0
                    次，合格：4次，不合格1次；最好一次成绩正确率为：89%，最差一次正确率为：47%，平均正确率为：67%；
                  </p>
                  <p>
                    3、所有考试中知识点分为：
                    <strong>
                      岗前技能培训、岗位专业知识、业务技能、综合技能、综合素质， 共5项，
                    </strong>
                    我的知识点考试正确率：岗前技能培训共10题，答对6题，正确率为：60%；岗位专业知识共10题，答对5题，正确率50%；业务技能共10题，答对7题，正确率为：70%；综合技能共10题，答对8题，正确率为：80%；综合素质共10题，答对8题，正确率为：80%
                    。
                  </p>
                  <p>
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
                  </p>
                </div>
                <div className={styles.knowledge}>
                  <h4>二、知识点综合分析</h4>
                  <p>
                    <ReactEcharts
                      style={{ height: '450px' }}
                      option={this.getOption()}
                      notMerge={true}
                      lazyUpdate={true}
                    />
                  </p>
                  <p>
                    {items.map((item, index) => {
                      const { id, content } = item;
                      return <KnowledgeList key={id} index={index + 1} content={content} />;
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
