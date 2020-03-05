import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { List, Card, Button, Input, BackTop, Spin, Col, Row, message } from 'antd';
import { routerRedux } from 'dva/router';
import InfiniteScroll from 'react-infinite-scroller';

import Ellipsis from '@/components/Ellipsis';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';

import styles from './CompanyList.less';
import { hasAuthority } from '@/utils/customAuth';
import codes from '@/utils/codes';

const FormItem = Form.Item;

// 权限
const {
  targetResponsibility: {
    targetAnalysis: { view: viewAuth },
  },
} = codes;

//面包屑
const breadcrumbList = [
  {
    title: '首页',
    name: '首页',
    href: '/',
  },
  {
    title: '目标责任管理',
    name: '目标责任管理',
  },
  {
    title: '目标责任分析报表',
    name: '目标责任分析报表',
  },
];

// 默认页面显示数量
const pageSize = 18;

// 默认表单值
const defaultFormData = {
  companyName: undefined,
  companyCode: undefined,
  companyStatus: undefined,
};

/* 获取无数据 */
const getEmptyData = () => {
  return <span style={{ color: 'rgba(0,0,0,0.45)' }}>暂无数据</span>;
};

@connect(({ riskPointManage, user, loading }) => ({
  riskPointManage,
  user,
  loading: loading.models.riskPointManage,
}))
@Form.create()
export default class CompanyList extends PureComponent {
  constructor(props) {
    super(props);
    this.formData = defaultFormData;
  }
  // 生命周期函数
  componentDidMount() {
    const { dispatch } = this.props;
    // 获取单位列表
    dispatch({
      type: 'riskPointManage/fetchCompanyList',
      payload: {
        pageSize,
        pageNum: 1,
      },
    });
  }

  // 查询
  handleClickToQuery = () => {
    const {
      form: { getFieldsValue },
      dispatch,
    } = this.props;
    const data = getFieldsValue();
    // 修改表单数据
    this.formData = data;
    // 重新请求数据
    dispatch({
      type: 'riskPointManage/fetchCompanyList',
      payload: {
        pageSize,
        pageNum: 1,
        ...data,
      },
    });
  };

  // 重置
  handleClickToReset = () => {
    const {
      form: { resetFields },
    } = this.props;
    // 清除筛选条件
    resetFields();
    // 修改表单数据
    this.formData = defaultFormData;
    // 重新请求数据
    this.props.dispatch({
      type: 'riskPointManage/fetchCompanyList',
      payload: {
        pageSize,
        pageNum: 1,
      },
    });
  };

  // 滚动加载
  handleLoadMore = () => {
    const {
      riskPointManage: { isLast },
    } = this.props;
    if (isLast) {
      return;
    }
    const {
      riskPointManage: { pageNum },
    } = this.props;
    // 请求数据
    this.props.dispatch({
      type: 'riskPointManage/appendCompanyList',
      payload: {
        pageSize,
        pageNum: pageNum + 1,
        ...this.formData,
      },
    });
  };

  onCardClick = companyId => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push(`/target-responsibility/target-analysis/index/${companyId}`));
  };

  // 渲染form表单
  renderForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;

    return (
      <Card>
        <Form layout="inline">
          <FormItem>
            {getFieldDecorator('companyName', {
              initialValue: defaultFormData.companyName,
              getValueFromEvent: e => e.target.value.trim(),
            })(<Input placeholder="请输入单位名称" />)}
          </FormItem>
          <FormItem>
            <Button type="primary" onClick={this.handleClickToQuery}>
              查询
            </Button>
          </FormItem>
          <FormItem>
            <Button onClick={this.handleClickToReset}>重置</Button>
          </FormItem>
        </Form>
      </Card>
    );
  }

  // 渲染列表
  renderList() {
    const {
      riskPointManage: { list },
      user: {
        currentUser: { permissionCodes, permissionCodes: codes },
      },
    } = this.props;

    const viewCode = hasAuthority(viewAuth, permissionCodes);

    return (
      <div className={styles.cardList} style={{ marginTop: '24px' }}>
        <List
          rowKey="id"
          grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
          dataSource={list}
          renderItem={item => {
            const {
              companyId,
              companyName,
              practicalAddress,
              safetyName,
              safetyPhone,
              practicalProvince,
              practicalCity,
              practicalDistrict,
              practicalTown,
            } = item;
            const practicalAddressLabel =
              (practicalProvince || '') +
              (practicalCity || '') +
              (practicalDistrict || '') +
              (practicalTown + '') +
              (practicalAddress || '');
            return (
              <List.Item key={companyId}>
                <Card
                  title={companyName}
                  className={viewCode ? styles.card : ''}
                  onClick={
                    viewCode
                      ? () => this.onCardClick(companyId)
                      : () => message.warning('没有访问权限！')
                  }
                >
                  <Row>
                    <Col span={22}>
                      <Ellipsis tooltip lines={1} className={styles.ellipsisText}>
                        安全管理员：
                        {safetyName || getEmptyData()}
                      </Ellipsis>
                      <p>
                        电话：
                        {safetyPhone || getEmptyData()}
                      </p>
                      <Ellipsis tooltip lines={1} className={styles.ellipsisText}>
                        地址：
                        {practicalAddressLabel.replace('null', '') || getEmptyData()}
                      </Ellipsis>
                    </Col>
                  </Row>
                </Card>
              </List.Item>
            );
          }}
        />
      </div>
    );
  }

  render() {
    const {
      loading,
      riskPointManage: {
        data: {
          pagination: { total },
        },
        isLast,
      },
    } = this.props;

    return (
      <PageHeaderLayout
        title="目标责任分析报表"
        breadcrumbList={breadcrumbList}
        content={
          <div>
            单位总数：
            {total}
          </div>
        }
      >
        <BackTop />
        {this.renderForm()}
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
          {this.renderList()}
        </InfiniteScroll>
      </PageHeaderLayout>
    );
  }
}
