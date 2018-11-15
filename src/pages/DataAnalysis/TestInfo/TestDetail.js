import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Button, Card } from 'antd';
import router from 'umi/router';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import DescriptionList from 'components/DescriptionList';

const { Description } = DescriptionList;
/* 获取无数据 */
const getEmptyData = () => {
  return <span style={{ color: 'rgba(0,0,0,0.45)' }}>暂无数据</span>;
};
const title = '消防测试记录详情';

const breadcrumbList = [
  { title: '首页', name: '首页', href: '/' },
  { title: '数据分析', name: '数据分析' },
  { title: '消防测试记录', name: '消防测试记录', href: '/data-analysis/test-info/list' },
  { title, name: title },
];
@connect(
  ({ fireTest, loading }) => ({
    fireTest,
    loading: loading.models.fireTest,
  }),
  dispatch => ({
    /* 获取测试火灾自动报警系统历史记录(web) */
    fetchDetail(action) {
      dispatch({
        type: 'fireTest/fetchDetail',
        ...action,
      });
    },
  })
)
export default class RepairRecordDetail extends PureComponent {
  /* 挂载后 */
  componentDidMount() {
    const {
      fetchDetail,
      match: { params },
    } = this.props;

    /* 获取测试详情信息(web) */
    fetchDetail({
      payload: { ...params },
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
      fireTest: {
        detail: {
          alarmStatus = '',
          code = '',
          // componentNo = '',
          // componentRegion = '',
          testPhone = '',
          failureCode = '',
          name = '',
          position = '',
          safetyName = '',
          safetyPhone = '',
          testCompanyName = '',
          testMan = '',
          testTime = '',
          type = '',
        },
      },
    } = this.props;
    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
        content={<span />}
        // extraContent={this.extraContent}
      >
        <Card title="服务单位">
          <DescriptionList col={1} style={{ marginBottom: 16 }}>
            <Description term="单位名称">{name || getEmptyData()}</Description>
            <Description term="安全负责人">{safetyName || getEmptyData()}</Description>
            <Description term="联系电话">{safetyPhone || getEmptyData()}</Description>
          </DescriptionList>
        </Card>
        <Card title="测试单位" style={{ marginTop: '10px' }}>
          <DescriptionList col={1} style={{ marginBottom: 16 }}>
            <Description term="测试单位">{testCompanyName || getEmptyData()}</Description>
            <Description term="测试时间">
              {testTime ? moment(testTime).format('YYYY-MM-DD HH:mm:ss') : getEmptyData()}
            </Description>
            <Description term="测试人员">{testMan || getEmptyData()}</Description>
            <Description term="联系电话">{testPhone || getEmptyData()}</Description>
          </DescriptionList>
        </Card>
        <Card title="测试详情" style={{ marginTop: '10px' }}>
          <DescriptionList col={1} style={{ marginBottom: 16 }}>
            <Description term="主机编号">{code || getEmptyData()}</Description>
            <Description term="回路故障号">{failureCode || getEmptyData()}</Description>
            <Description term="设施部件类型">{type || getEmptyData()}</Description>
            <Description term="具体位置">{position || getEmptyData()}</Description>
            <Description term="警情状态">{alarmStatus || getEmptyData()}</Description>
          </DescriptionList>
        </Card>
      </PageHeaderLayout>
    );
  }
}
