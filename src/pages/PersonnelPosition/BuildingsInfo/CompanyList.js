import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, List, Card, Button, Input, Spin, Col, Row, Select, Cascader } from 'antd';
// import { routerRedux } from 'dva/router';
import { AuthLink } from '@/utils/customAuth';
import InfiniteScroll from 'react-infinite-scroller';

import Ellipsis from '@/components/Ellipsis';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';

import styles from './BuildingsInfo.less';

const FormItem = Form.Item;
const Option = Select.Option;

// 默认页面显示数量
// const pageSize = 18;

// 默认表单值
const defaultFormData = {
  companyName: undefined,
  dangerLevel: undefined,
  industryCategory: undefined,
  companyType: undefined,
  companyStatus: undefined,
};
//面包屑
const breadcrumbList = [
  {
    title: '首页',
    name: '首页',
    href: '/',
  },
  {
    title: '人员定位',
    name: '人员定位',
  },
  {
    title: '建筑物信息',
    name: '建筑物信息',
  },
];

/* 获取无数据 */
const getEmptyData = () => {
  return <span style={{ color: 'rgba(0,0,0,0.45)' }}>暂无数据</span>;
};

// 获取根节点
const getRootChild = () => document.querySelector('#root>div');

@connect()
export default class CompanyList extends PureComponent {
  /* 挂载后 */
  componentDidMount() {}

  /* 渲染form表单 */
  renderForm() {
    const {
      form: { getFieldDecorator },
      // user: {
      //   currentUser: { permissionCodes: codes },
      // },
    } = this.props;

    return (
      <Card>
        <Form className={styles.form}>
          <Row gutter={30}>
            <Col span={8}>
              <FormItem>
                {getFieldDecorator('companyName', {
                  initialValue: defaultFormData.companyName,
                  getValueFromEvent: e => e.target.value.trim(),
                })(<Input placeholder="请输入企业名称" />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem style={{ margin: '0', padding: '4px 0' }}>
                {getFieldDecorator({
                  initialValue: defaultFormData.industryCategory,
                })(
                  <Cascader
                    // options={industryCategories}
                    fieldNames={{
                      value: 'type_id',
                      label: 'gs_type_name',
                      children: 'children',
                    }}
                    allowClear
                    changeOnSelect
                    notFoundContent
                    placeholder="请选择行业类别"
                    getPopupContainer={getRootChild}
                  />
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem style={{ margin: '0', padding: '4px 0' }}>
                <Button
                  type="primary"
                  onClick={this.handleClickToQuery}
                  style={{ marginRight: '16px' }}
                >
                  查询
                </Button>
                <Button onClick={this.handleClickToReset} style={{ marginRight: '16px' }}>
                  重置
                </Button>
                <Button onClick={this.handleClickToReset} style={{ marginRight: '16px' }}>
                  新增
                </Button>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Card>
    );
  }

  /* 渲染列表 */
  renderList() {
    const list = [];
    return (
      <div className={styles.cardList} style={{ marginTop: '24px' }}>
        <List
          rowKey="id"
          grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
          dataSource={list || []}
          renderItem={item => (
            <List.Item key={item.id}>
              <Card
                title={item.name}
                className={styles.card}
                actions={[
                  <AuthLink to={`/fire-control/maintenance-company/detail/${item.id}`}>
                    查看
                  </AuthLink>,
                  <AuthLink to={`/fire-control/maintenance-company/edit/${item.id}`}>
                    编辑
                  </AuthLink>,
                ]}
                // extra={
                //   <Button
                //     onClick={() => {
                //       this.handleShowDeleteConfirm(item.id);
                //     }}
                //     shape="circle"
                //     style={{ border: 'none', fontSize: '20px' }}
                //   >
                //     <Icon type="close" />
                //   </Button>
                // }
              >
                <Row>
                  <Col span={16} style={{ cursor: 'pointer' }}>
                    <Ellipsis tooltip lines={1} className={styles.ellipsisText}>
                      重大危险源等级：
                      {item.practicalAddress || getEmptyData()}
                    </Ellipsis>
                    <Ellipsis tooltip lines={1} className={styles.ellipsisText}>
                      属地安监机构：
                      {item.principalName || getEmptyData()}
                    </Ellipsis>
                    <p>
                      行业类别：
                      {item.principalPhone || getEmptyData()}
                    </p>
                    <Ellipsis tooltip lines={1} className={styles.ellipsisText}>
                      安全负责人：
                      {item.parentUnitName || getEmptyData()}
                    </Ellipsis>
                    <Ellipsis tooltip lines={1} className={styles.ellipsisText}>
                      联系电话：
                      {item.parentUnitName || getEmptyData()}
                    </Ellipsis>
                  </Col>
                  <Col span={8} style={{ cursor: 'pointer' }}>
                    <span className={styles.quantity}>{item.serviceCompanyCount}</span>
                  </Col>
                </Row>
              </Card>
            </List.Item>
          )}
        />
      </div>
    );
  }

  render() {
    const { loading } = this.props;

    return (
      <PageHeaderLayout
        title="维保单位管理"
        breadcrumbList={breadcrumbList}
        content={<div>单位总数： </div>}
      >
        {this.renderForm()}
        <InfiniteScroll
          initialLoad={false}
          pageStart={0}
          loadMore={() => {
            // 防止多次加载
            !loading && this.handleLoadMore();
          }}
          // hasMore={!isLast}
          loader={
            <div className="loader" key={0}>
              {loading && (
                <div style={{ paddingTop: '50px', textAlign: 'center' }}>
                  <Spin />
                </div>
              )}
            </div>
          }
        >
          {this.renderList()}
        </InfiniteScroll>
      </PageHeaderLayout>
    );
  }
}
