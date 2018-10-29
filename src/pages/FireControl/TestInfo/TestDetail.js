import React, { PureComponent } from 'react';
// import moment from 'moment';
import { connect } from 'dva';
import { Button, Card, Form, Divider } from 'antd';
import router from 'umi/router';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import DescriptionList from 'components/DescriptionList';
// import styles from './RepairRecordDetail.less'

const { Description } = DescriptionList;
/* 获取无数据 */
const getEmptyData = () => {
  return <span style={{ color: 'rgba(0,0,0,0.45)' }}>暂无数据</span>;
};
const title = '消防测试记录详情';

/* const applyRepairInfo=[
  {label:'工单编号',key:''},
  {label:'报修单位',key:''},
  {label:'报修时间',key:''},
  {label:'报修人员',key:''},
  {label:'联系电话',key:''},
  {label:'系统类型',key:''},
  {label:'设备名称',key:''},
  {label:'详细位置',key:''},
  {label:'故障描述',key:''},
  {label:'照片',key:''},
] */
export default class RepairRecordDetail extends PureComponent {
  /* renderFormItems = () => {
    const repairRecordDetail={

    }
    return applyRepairInfo.map(item=>(
      <FormItem label="工单编号" {...formItemLayout}>
      <span>{}</span>
    </FormItem>
    ))
  } */

  handleToBack = () => {
    router.push('/fire-control/test-info/list');
  };

  extraContent = (
    <Button style={{ width: '120px', height: '36px' }} onClick={this.handleToBack}>
      返回
    </Button>
  );

  render() {
    const breadcrumbList = [
      { title: '首页', name: '首页', href: '/' },
      { title: '数据分析', name: '数据分析' },
      { title: '消防测试记录', name: '消防测试记录', href: '/fire-control/test-info/list' },
      { title, name: title },
    ];
    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
        content={<span />}
        // extraContent={this.extraContent}
      >
        <Card title="主体单位">
          <DescriptionList col={1} style={{ marginBottom: 16 }}>
            <Description term="单位名称">
              {'无锡市晶安智慧科技有限公司' || getEmptyData()}
            </Description>
            <Description term="安全负责人">{'张三' || getEmptyData()}</Description>
            <Description term="联系电话">{'18122965537' || getEmptyData()}</Description>
          </DescriptionList>
        </Card>
        <Card title="测试单位" style={{ marginTop: '10px' }}>
          <DescriptionList col={1} style={{ marginBottom: 16 }}>
            <Description term="测试单位">
              {'常熟消防维保工程有限公司' || getEmptyData()}
            </Description>
            <Description term="测试时间">{'2018-05-10 12:00:00' || getEmptyData()}</Description>
            <Description term="测试人员">{'张三' || getEmptyData()}</Description>
            <Description term="联系电话">{'13912345678' || getEmptyData()}</Description>
          </DescriptionList>
        </Card>
        <Card title="测试详情" style={{ marginTop: '10px' }}>
          <DescriptionList col={1} style={{ marginBottom: 16 }}>
            <Description term="主机编号">{'ZXY-001' || getEmptyData()}</Description>
            <Description term="回路故障号">{'2号回路001号' || getEmptyData()}</Description>
            <Description term="设施部件类型">
              {'点型光电感烟火灾探测器' || getEmptyData()}
            </Description>
            <Description term="具体位置">{'A建筑物2层东大厅' || getEmptyData()}</Description>
            <Description term="警情状态">{'火警' || getEmptyData()}</Description>
          </DescriptionList>
        </Card>
      </PageHeaderLayout>
    );
  }
}
