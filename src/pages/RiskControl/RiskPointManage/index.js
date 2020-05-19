import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import {
  List, Card, Button, // Icon,
  Input, // Modal,
  message, BackTop, Spin, Col, Row, Select,
} from 'antd';
import { Link } from 'dva/router';
import InfiniteScroll from 'react-infinite-scroller';

import Ellipsis from '@/components/Ellipsis';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import styles from './index.less';
import codesMap from '@/utils/codes';
import { hasAuthority } from '@/utils/customAuth';
import router from 'umi/router';

const FormItem = Form.Item;
const { Option } = Select;

//面包屑
const breadcrumbList = [
  {
    title: '首页',
    name: '首页',
    href: '/',
  },
  {
    title: '风险管控',
    name: '风险管控',
  },
  {
    title: '风险点管理',
    name: '风险点管理',
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

/* 获取root下的div */
const getRootChild = () => document.querySelector('#root>div');

@connect(({ riskPointManage, user, loading }) => ({
  riskPointManage,
  user,
  loading: loading.models.riskPointManage,
}))
@Form.create()
export default class RiskPointManage extends PureComponent {
  constructor(props) {
    super(props);
    this.formData = defaultFormData;
  }
  // 生命周期函数
  componentDidMount () {
    const { dispatch, user: { isCompany, currentUser } } = this.props;
    if (isCompany) {
      router.replace(`/risk-control/risk-point-manage/risk-point-List/${currentUser.companyId}?companyId=${currentUser.companyId}&&companyName=${currentUser.companyName}`);
      return;
    }
    // 获取单位列表
    dispatch({
      type: 'riskPointManage/fetchCompanyList',
      payload: {
        pageSize,
        pageNum: 1,
      },
    });
  }

  // 跳转到风险点列表
  // goToRiskPointList = (id, name) => {
  //   const { dispatch } = this.props;
  //   dispatch(
  //     routerRedux.push(
  //       `/risk-control/risk-point-manage/risk-point-List/${id}?companyId=${id}&&companyName=${name}`
  //     )
  //   );
  // };

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

  // 渲染form表单
  renderForm () {
    const {
      form: { getFieldDecorator },
      riskPointManage: { statusList },
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
            {getFieldDecorator('companyCode', {
              initialValue: defaultFormData.companyCode,
              getValueFromEvent: e => e.target.value.trim(),
            })(<Input placeholder="请输入单位编号" />)}
          </FormItem>
          <FormItem>
            {getFieldDecorator('companyStatus', {
              initialValue: defaultFormData.companyStatus,
            })(
              <Select
                placeholder="是否启用"
                getPopupContainer={getRootChild}
                allowClear
                dropdownStyle={{ zIndex: 50 }}
                style={{ width: 200 }}
              >
                {statusList.map(({ key, value }) => (
                  <Option value={key} key={key}>
                    {value}
                  </Option>
                ))}
              </Select>
            )}
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
  renderList () {
    const {
      riskPointManage: { list },
      user: {
        currentUser: { permissionCodes: codes },
      },
    } = this.props;

    // const list = [
    //   {
    //     company_id: 'luwc6t1xgd42fmt3',
    //     company_name: '消息',
    //     createDate: 1558503343350,
    //     id: 'luwc6t1xgd42fmt3',
    //     name: '消息',
    //     practicalAddress: '天津市111',
    //     count: 3,
    //   },
    // ];

    return (
      <div className={styles.cardList} style={{ marginTop: '24px' }}>
        <List
          rowKey="id"
          grid={{ gutter: 24, column: 3, lg: 3, md: 2, sm: 1, xs: 1 }}
          dataSource={list}
          renderItem={item => {
            const {
              companyId,
              companyName,
              practicalAddress,
              safetyName,
              safetyPhone,
              pointCount,
              companyStatus,
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
                <Card title={companyName} className={styles.card}>
                  <Row>
                    <Col span={16}>
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

                    {hasAuthority(codesMap.riskControl.riskPointManage.view, codes) ? (
                      <Col span={8} style={{ cursor: 'pointer' }}>
                        <Link
                          to={`/risk-control/risk-point-manage/risk-point-List/${companyId}?companyId=${companyId}&&companyName=${companyName}`}
                          target="_blank"
                        >
                          <span className={styles.quantity}>{pointCount}</span>
                        </Link>
                      </Col>
                    ) : (
                        <Col
                          span={8}
                          onClick={() => {
                            message.warn('您没有权限访问对应页面');
                          }}
                          style={{ cursor: 'pointer' }}
                        >
                          <span className={styles.quantity}>{pointCount}</span>
                        </Col>
                      )}

                    {companyStatus === '2' && <div className={styles.status}>禁用</div>}
                  </Row>
                </Card>
              </List.Item>
            );
          }}
        />
      </div>
    );
  }

  render () {
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
        title="风险点管理"
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
