import React, { PureComponent } from 'react';
import { Spin, Card, Collapse } from 'antd';
import { connect } from 'dva';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import urls from '@/utils/urls';
import titles from '@/utils/titles';

import styles from './index.less';
const { Panel } = Collapse;

const { home: homeUrl, examinationPaper: { list: listUrl } } = urls;
const { home: homeTitle, examinationPaper: { list: listTitle, menu: menuTitle, preview: title } } = titles;
const backUrl = `${listUrl}?back`;

/* 面包屑 */
const breadcrumbList = [
  { title: homeTitle, name: homeTitle, href: homeUrl },
  { title: menuTitle, name: menuTitle },
  { title: listTitle, name: listTitle, href: backUrl },
  { title, name: title },
];
/* 选项签名 */
const signs = ['A', 'B', 'C', 'D'];
/* serial */
const serials = ['一', '二', '三'];

@connect(({ examinationPaper, user, loading }) => ({
  examinationPaper,
  user,
  loading: loading.models.examinationPaper,
}))
export default class App extends PureComponent {
  componentDidMount() {
    const { dispatch, match: { params: { id } } } = this.props;

    // 获取预览试卷
    dispatch({
      type: 'examinationPaper/fetchPreview',
      payload: { id },
    });
  }

  /**
   * 渲染题目
   */
  renderQuestions(questions) {
    return questions.map(({ id, levelName, arrOptions, stem, knowledgeNames }, index) => {
      return (
        <div key={id} className={styles.question}>
          <div className={styles.questionTitle}>{`${index+1}、${stem}（ ）`}</div>
          {arrOptions.map(({ id, desc }, index) => <div key={id} className={styles.questionOption}>{`${signs[index]}、${desc}`}</div>)}
          <div className={styles.questionInfo}>知识点分类：<span>{knowledgeNames.join(' > ')}</span><span style={{ marginLeft: 64 }}>{`难易程度：${levelName || '一般'}`}</span></div>
        </div>
      );
    });
  }

  render() {
    const { loading, examinationPaper: { preview: { singleQuestions=[], multiQuestions=[], judgeQuestions=[] } } } = this.props;

    return (
      <PageHeaderLayout title={title} breadcrumbList={breadcrumbList}>
        <Spin spinning={!!loading}>
          <Card bordered={false}>
            <Collapse className={styles.collapse} bordered={false} defaultActiveKey={['1', '2', '3']}>
              {[
                { questions: singleQuestions, label: '单项选择题', key: '1' },
                { questions: multiQuestions, label: '多项选择题', key: '2' },
                { questions: judgeQuestions, label: '判断题', key: '3' },
              ].filter(({ questions }) => questions.length > 0).map(({ questions, label, key }, index) => (
                <Panel header={`${serials[index]}、${label}（共 ${questions.length} 题）`} key={key}>
                  {this.renderQuestions(questions)}
                </Panel>
              ))}
            </Collapse>
          </Card>
        </Spin>
      </PageHeaderLayout>
    );
  }
}
