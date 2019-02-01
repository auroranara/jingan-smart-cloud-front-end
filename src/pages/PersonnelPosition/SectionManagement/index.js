import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Form, Row, Col, Input, Button, List, Spin, message } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import Ellipsis from 'components/Ellipsis';
import InfiniteScroll from 'react-infinite-scroller';
import router from 'umi/router';
import codes from '@/utils/codes';
import { hasAuthority } from '@/utils/customAuth';
import styles from './index.less';

const FormItem = Form.Item;

// 权限代码
const {
  personnelPosition: {
    sectionManagement: { list: sectionCode },
  },
} = codes;

const title = '区域管理';
const breadcrumbList = [
  { title: '首页', name: '首页', href: '/' },
  { title: '人员定位', name: '人员定位' },
  { title, name: title },
];
const defaultPageSize = 18;

@Form.create()
@connect(({ personnelPosition, user, loading }) => ({
  personnelPosition,
  user,
  loading: loading.effects['personnelPosition/fetchAreaCompanys'],
}))
export default class SectionManagement extends PureComponent {
  componentDidMount() {
    this.fetchCompanyList({
      payload: {
        pageNum: 1,
        pageSize: defaultPageSize,
      },
    });
  }

  // 获取区域单位列表
  fetchCompanyList = actions => {
    const { dispatch } = this.props;
    dispatch({
      type: 'personnelPosition/fetchAreaCompanys',
      ...actions,
    });
  };

  handleLoadMore = () => {
    const {
      personnelPosition: {
        sectionManagement: {
          pagination: { pageNum, pageSize },
        },
      },
      form: { getFieldValue },
    } = this.props;
    const name = getFieldValue('name');
    this.fetchCompanyList({
      payload: { pageNum: pageNum + 1, pageSize, name },
    });
  };

  // 点击查询
  handleQuery = () => {
    const {
      form: { getFieldValue },
    } = this.props;
    const name = getFieldValue('name');
    this.fetchCompanyList({
      payload: { pageNum: 1, pageSize: defaultPageSize, companyName: name },
    });
  };

  // 点击重置
  handleReset = () => {
    const {
      form: { resetFields },
    } = this.props;
    resetFields(['name']);
    this.handleQuery();
  };

  // 点击查看区域列表
  handleViewSections = ({ id }) => {
    const {
      user: {
        currentUser: { permissionCodes },
      },
    } = this.props;
    // 查看区域权限
    const viewAuth = hasAuthority(sectionCode, permissionCodes);
    if (viewAuth) {
      router.push(`/personnel-position/section-management/company/${id}`);
      return;
    }
    message.warning('您没有权限访问该页面！');
  };

  render() {
    const {
      loading,
      form: { getFieldDecorator },
      personnelPosition: {
        sectionManagement: {
          list = [], // 区域单位列表
          isLast,
        },
      },
    } = this.props;

    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
        content={`单位总数：${list.length}`}
      >
        {/* 筛选栏 */}
        <Card>
          <Form>
            <Row gutter={16}>
              <Col lg={8} md={12} sm={24} xs={24}>
                <FormItem style={{ margin: '0', padding: '4px 0' }}>
                  {getFieldDecorator('name')(<Input placeholder="请输入单位名称" />)}
                </FormItem>
              </Col>
              <Col lg={8} md={12} sm={24} xs={24}>
                <FormItem style={{ margin: '0', padding: '4px 0' }}>
                  <Button type="primary" onClick={this.handleQuery}>
                    查询
                  </Button>
                  <Button style={{ marginLeft: '10px' }} onClick={this.handleReset}>
                    重置
                  </Button>
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Card>
        {/* 区域单位列表 */}
        <InfiniteScroll
          initialLoad={false}
          pageStart={0}
          loadMore={() => {
            // 防止多次加载
            !loading && this.handleLoadMore();
          }}
          hasMore={!isLast}
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
          <div className={styles.sectionManagementList}>
            <List
              rowKey="id"
              grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
              dataSource={list}
              renderItem={item => {
                const {
                  id,
                  name, // 公司名称
                  principal_name = null,
                  principal_phone = null,
                  practical_address = null, // 地址
                  area_num = 0, // 区域数
                } = item;
                return (
                  <List.Item key={id}>
                    <Card title={name} className={styles.card}>
                      <Ellipsis tooltip className={styles.ellipsis} lines={1}>
                        主要负责人：
                        {principal_name || '暂无信息'}
                      </Ellipsis>
                      <Ellipsis tooltip className={styles.ellipsis} lines={1}>
                        联系电话：
                        {principal_phone || '暂无信息'}
                      </Ellipsis>
                      <div className={styles.lsEllipsis}>
                        <Ellipsis tooltip lines={1}>
                          地址：
                          {practical_address || '暂无信息'}
                        </Ellipsis>
                      </div>
                      <div
                        className={styles.countContainer}
                        onClick={() => this.handleViewSections(item)}
                      >
                        <div className={styles.count}>{area_num}</div>
                        <p className={styles.text}>区域数</p>
                      </div>
                    </Card>
                  </List.Item>
                );
              }}
            />
          </div>
        </InfiniteScroll>
      </PageHeaderLayout>
    );
  }
}
