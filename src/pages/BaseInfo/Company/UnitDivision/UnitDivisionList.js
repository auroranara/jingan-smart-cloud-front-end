import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Icon as LegacyIcon } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { List, Card, Button, Input, BackTop, Spin, message, Modal } from 'antd';
import InfiniteScroll from 'react-infinite-scroller';

import Ellipsis from '@/components/Ellipsis';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';

import styles from './UnitDivisionList.less';
import codesMap from '@/utils/codes';
import { AuthLink, AuthButton } from '@/utils/customAuth';

const { confirm } = Modal;
const FormItem = Form.Item;

const {
  company: {
    division: { add: addCode, edit: editCode, detail: detailCode, delete: deleteCode },
  },
} = codesMap;

//面包屑
const breadcrumbList = [
  {
    title: '首页',
    name: '首页',
    href: '/',
  },
  {
    title: '一企一档',
    name: '一企一档',
  },
  {
    title: '单位管理',
    name: '单位管理',
    href: '/base-info/company/list',
  },
  {
    title: '单位分部',
    name: '单位分部',
  },
];

// 默认页面显示数量
const pageSize = 18;

// 默认表单值
const defaultFormData = {
  name: undefined,
  practicalAddress: undefined,
};

/* 获取无数据 */
const getEmptyData = () => {
  return <span style={{ color: 'rgba(0,0,0,0.45)' }}>暂无数据</span>;
};

@connect(({ unitDivision, user, loading }) => ({
  unitDivision,
  user,
  loading: loading.models.unitDivision,
}))
@Form.create()
export default class UnitDivisionList extends PureComponent {
  constructor(props) {
    super(props);
    this.formData = defaultFormData;
  }

  // 生命周期函数
  componentDidMount() {
    const {
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;
    // 获取单位列表
    dispatch({
      type: 'unitDivision/fetchDivisionList',
      payload: {
        unitId: id,
        pageSize,
        pageNum: 1,
      },
    });
  }

  /* 查询按钮点击事件 */
  handleClickToQuery = () => {
    const {
      form: { getFieldsValue },
      match: {
        params: { id },
      },
    } = this.props;
    const data = getFieldsValue();
    // 修改表单数据
    this.formData = data;
    // 重新请求数据
    this.props.dispatch({
      type: 'unitDivision/fetchDivisionList',
      payload: {
        unitId: id,
        pageSize,
        pageNum: 1,
        ...data,
      },
    });
  };

  /* 重置按钮点击事件 */
  handleClickToReset = () => {
    const {
      form: { resetFields },
      match: {
        params: { id },
      },
    } = this.props;
    // 清除筛选条件
    resetFields();
    // 修改表单数据
    this.formData = defaultFormData;
    // 重新请求数据
    this.props.dispatch({
      type: 'unitDivision/fetchDivisionList',
      payload: {
        unitId: id,
        pageSize,
        pageNum: 1,
      },
    });
  };

  /* 滚动加载 */
  handleLoadMore = () => {
    const {
      unitDivision: { isLast },
      match: {
        params: { id },
      },
    } = this.props;
    if (isLast) {
      return;
    }
    const {
      unitDivision: { pageNum },
    } = this.props;
    // 请求数据
    this.props.dispatch({
      type: 'unitDivision/appendfetch',
      payload: {
        pageSize,
        unitId: id,
        pageNum: pageNum + 1,
        ...this.formData,
      },
    });
  };

  /* 删除 */
  handleShowDeleteConfirm = id => {
    const {
      dispatch,
      match: {
        params: { id: companyId },
      },
    } = this.props;
    confirm({
      title: '提示信息',
      content: '是否删除该分部信息',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        dispatch({
          type: 'unitDivision/removeDivision',
          payload: {
            id,
          },
          success: () => {
            dispatch({
              type: 'unitDivision/fetchDivisionList',
              payload: {
                unitId: companyId,
                pageSize,
                pageNum: 1,
              },
            });
            message.success('删除成功！');
          },
          error: () => {
            message.error('删除失败');
          },
        });
      },
    });
  };

  /* 渲染form表单 */
  renderForm() {
    const {
      form: { getFieldDecorator },
      match: {
        params: { id },
      },
    } = this.props;
    return (
      <Card>
        <Form layout="inline">
          <FormItem>
            {getFieldDecorator('name', {
              initialValue: defaultFormData.name,
              getValueFromEvent: e => e.target.value.trim(),
            })(<Input placeholder="请输入分部名称" />)}
          </FormItem>
          <FormItem>
            {getFieldDecorator('address', {
              initialValue: defaultFormData.address,
              getValueFromEvent: e => e.target.value.trim(),
            })(<Input placeholder="请输入分部地址" />)}
          </FormItem>

          <FormItem>
            <Button type="primary" onClick={this.handleClickToQuery}>
              查询
            </Button>
          </FormItem>
          <FormItem>
            <Button onClick={this.handleClickToReset}>重置</Button>
          </FormItem>
          <FormItem style={{ float: 'right' }}>
            <AuthButton
              code={addCode}
              type="primary"
              href={`#/base-info/company/division/add?companyId=${id}`}
            >
              新增
            </AuthButton>
          </FormItem>
        </Form>
      </Card>
    );
  }

  /* 渲染列表 */
  renderList() {
    const {
      unitDivision: { list },
      match: {
        params: { id: companyId },
      },
    } = this.props;

    return (
      <div className={styles.cardList} style={{ marginTop: '24px' }}>
        <List
          rowKey="id"
          grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
          dataSource={list}
          renderItem={item => {
            const { id, name, unitId, address, chargeName, phone } = item;
            return (
              <List.Item key={id}>
                <Card
                  title={name}
                  className={styles.card}
                  actions={[
                    <AuthLink
                      code={detailCode}
                      to={`/base-info/company/division/detail/${id}?companyId=${companyId}`}
                    >
                      查看
                    </AuthLink>,
                    <AuthLink
                      code={editCode}
                      to={`/base-info/company/division/edit/${id}?unitId=${unitId}&&companyId=${companyId}`}
                    >
                      编辑
                    </AuthLink>,
                  ]}
                  extra={
                    <AuthButton
                      code={deleteCode}
                      onClick={() => {
                        this.handleShowDeleteConfirm(id);
                      }}
                      shape="circle"
                      style={{
                        border: 'none',
                        fontSize: '16px',
                      }}
                    >
                      <LegacyIcon type="close" />
                    </AuthButton>
                  }
                >
                  <Ellipsis tooltip lines={1} className={styles.ellipsisText}>
                    地址：
                    {address || getEmptyData()}
                  </Ellipsis>
                  <Ellipsis tooltip lines={1} className={styles.ellipsisText}>
                    负责人：
                    {chargeName || getEmptyData()}
                  </Ellipsis>
                  <p>
                    联系电话：
                    {phone || getEmptyData()}
                  </p>
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
      unitDivision: {
        data: {
          pagination: { total },
        },
        isLast,
      },
    } = this.props;

    return (
      <PageHeaderLayout
        title="单位分部"
        breadcrumbList={breadcrumbList}
        content={
          <div>
            <span>
              分部总数：
              {total}
            </span>
            <p style={{ paddingTop: 10 }}>
              一家单位里有多个分部，可以建立单位分部，比如：XXX医院，有城中院区，洋湖院区，可以在这里创建{' '}
            </p>
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
