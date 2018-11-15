import React, { PureComponent } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Card, Button, Input, List, Row, Col } from 'antd';

import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import Subject from './components/Subject';
import Answer from './components/Answer';
import SubjectCategory from './components/SubjectCategory';
import styles from './Result.less';
import EditIcon from './imgs/edit.png';

const COL_STYLE = { backgroundColor: '#FFF' };
const BTN_STYLE = { width: 120, height: 30, lineHeight: '30px' };

const breadcrumbList = [
  { title: '首页', name: '首页', href: '/' },
  { title: '教育培训', name: '教育培训' },
  { title: '我的考试', name: '我的考试' },
];

const choices = ["经验管理阶段", "现代化管理阶段", "科学管理阶段", "人治管理阶段"];

export default class ExamList extends PureComponent {
  state = { val: '', vals: [] };

  onSingleChange = v => {
    this.setState({ val: v });
  };

  onMultiChange = vals => {
    this.setState({ vals });
  };

  render() {
    const { val, vals } = this.state;

    return (
      <PageHeaderLayout
        title="我的考试"
        // breadcrumbList={breadcrumbList}
        // content={}
      >
        <Row>
          <Col span={6} style={COL_STYLE}>
            <div className={styles.head}>
              <span className={styles.rect} />
              答题卡
            </div>
          </Col>
          <Col span={18}>
            <div className={styles.container}>
              <div className={styles.head}>
                <img src={EditIcon} alt="编辑" className={styles.editIcon} />
                试卷内容
              </div>
              <SubjectCategory title="单项选择题" quantity="30">
                <Subject question="企业管理的发展阶段" choices={choices} onChange={this.onSingleChange} value={val} />
              </SubjectCategory>
              <Answer answer={['A', 'B']} />
              <div className={styles.btnContainer}>
                <div className={styles.innerBtnContainer}>
                  <Button type="primary" style={{...BTN_STYLE, marginRight: 15}}>上一题</Button>
                  <Button type="primary" style={BTN_STYLE}>下一题</Button>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </PageHeaderLayout>
    );
  }
}
