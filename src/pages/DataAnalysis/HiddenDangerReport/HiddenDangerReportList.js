import React, { PureComponent } from 'react';
import { Form } from 'antd';
import { connect } from 'dva';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import TagSelect from '@/components/TagSelect';

import styles from './HiddenDangerReportList.less';

/* 标题 */
const title = '隐患排查报表';
/* 面包屑 */
const breadcrumbList = [
  { title: '首页', name: '首页', href: '/' },
  { title: '数据分析', name: '数据分析' },
  { title, name: title },
];

/**
 * 隐患排查报表
 */
@connect(({hiddenDangerReport, loading}) => ({
  hiddenDangerReport,
  loading,
}))
@Form.create()
export default class App extends PureComponent {
  /* state */
  state = {

  }

  /**
   * 挂载后
   */
  componentDidMount() {
    const { dispatch } = this.props;
    console.log('mounted');

    // // 获取隐患列表
    // dispatch({
    //   type: 'hiddenDangerReport/fetchList',
    //   payload: {

    //   },
    // });
  }

  /**
   * 更新后
   */
  componentDidUpdate() {
    console.log('updated');
  }

  /**
   * 销毁前
   */
  componentWillUnmount() {
    console.log('unmount');
  }

  /**
   * 渲染函数
   */
  render() {
    const { hiddenDangerReport: { list: { list } } } = this.props;

    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
        content={<div>隐患总数：{list.length}</div>}
      >

      </PageHeaderLayout>
    );
  }
}
