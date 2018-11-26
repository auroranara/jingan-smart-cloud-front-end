import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Button, Card, Spin } from 'antd';
import router from 'umi/router';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import DescriptionList from 'components/DescriptionList';

const { Description } = DescriptionList;
/* 获取无数据 */
const getEmptyData = () => {
  return <span style={{ color: 'rgba(0,0,0,0.45)' }}>暂无数据</span>;
};
const title = '查看考试任务';

const breadcrumbList = [
  { title: '首页', name: '首页', href: '/' },
  { title: '培训', name: '培训' },
  { title: '考试任务', name: '考试任务', href: '/training/mission/list' },
  { title, name: title },
];
@connect(({ examinationMission, loading }) => ({
  examinationMission,
  loading: loading.models.examinationMission,
}))
export default class RepairRecordDetail extends PureComponent {
  /* 挂载后 */
  componentDidMount() {
    const {
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;
    dispatch({
      type: 'examinationMission/fetchDetail',
      payload: {
        id,
      },
    });
  }

  handleToBack = () => {
    router.push('/data-analysis/test-info/list');
  };

  extraContent = (
    <Button style={{ width: '120px', height: '36px' }} onClick={this.handleToBack}>
      返回
    </Button>
  );

  render() {
    const {
      examinationMission: {
        detail: {
          name,
          paperName,
          arrRuleTypeName,
          examLimit,
          percentOfPass,
          students,
          startTime,
          endTime,
        },
      },
      loading,
    } = this.props;
    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
        content={<span />}
        // extraContent={this.extraContent}
      >
        <Spin spinning={loading}>
          <Card style={{ paddingLeft: '3%', paddingRight: '3%' }}>
            <DescriptionList col={1}>
              <Description term="考试名称">{name || getEmptyData()}</Description>
              <Description term="考试规则">
                {arrRuleTypeName.join(' , ') || getEmptyData()}
              </Description>
              <Description term="考试时长">{`${examLimit} 分钟` || getEmptyData()}</Description>
              <Description term="合格率">{`${percentOfPass}%` || getEmptyData()}</Description>
              <Description term="考试期限">
                {`${moment(startTime).format('YYYY-MM-DD HH:mm:ss')} ~ ${moment(endTime).format(
                  'YYYY-MM-DD HH:mm:ss'
                )}` || getEmptyData()}
              </Description>
              <Description term="试卷">{paperName || getEmptyData()}</Description>
              <Description term="考试人员">
                {students.map(s => s.name).join(' , ') || getEmptyData()}
              </Description>
            </DescriptionList>
          </Card>
        </Spin>
      </PageHeaderLayout>
    );
  }
}
