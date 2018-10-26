import React, { PureComponent } from 'react';
// import moment from 'moment';
import { connect } from 'dva';
import { Button, Card, Form, Divider } from 'antd';
import router from 'umi/router';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
// import styles from './RepairRecordDetail.less'

const FormItem = Form.Item;
const title = '消防测试记录详情';
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 3 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 21 },
  },
  style: {
    marginBottom: '0px',
  },
};
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
        extraContent={this.extraContent}
      >
        <Card title="主体单位">
          <Form>
            <FormItem label="单位名称" {...formItemLayout}>
              <span>无锡市晶安智慧科技有限公司</span>
            </FormItem>
            <FormItem label="安全负责人" {...formItemLayout}>
              <span>张三</span>
            </FormItem>
            <FormItem label="联系电话" {...formItemLayout}>
              <span>18122965537</span>
            </FormItem>
          </Form>
        </Card>
        <Card title="测试单位" style={{ marginTop: '10px' }}>
          <Form>
            <FormItem label="测试单位" {...formItemLayout}>
              <span>常熟消防维保工程有限公司</span>
            </FormItem>
            <FormItem label="测试时间" {...formItemLayout}>
              <span>2018-05-10 12:00:00</span>
            </FormItem>
            <FormItem label="测试人员" {...formItemLayout}>
              <span>张三</span>
            </FormItem>
            <FormItem label="联系电话" {...formItemLayout}>
              <span>13912345678</span>
            </FormItem>
          </Form>
        </Card>
        <Card title="测试详情" style={{ marginTop: '10px' }}>
          <Form>
            <FormItem label="主机编号" {...formItemLayout}>
              <span>ZXY-001</span>
            </FormItem>
            <FormItem label="回路故障号" {...formItemLayout}>
              <span>2号回路001号</span>
            </FormItem>
            <FormItem label="设施部件类型" {...formItemLayout}>
              <span>点型光电感烟火灾探测器</span>
            </FormItem>
            <FormItem label="具体位置" {...formItemLayout}>
              <span>A建筑物2层东大厅</span>
            </FormItem>
            <FormItem label="警情状态" {...formItemLayout}>
              <span>火警</span>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderLayout>
    );
  }
}
