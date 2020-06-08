import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { List, Card, Button, Input, Spin } from 'antd';
import router from 'umi/router';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import Ellipsis from '@/components/Ellipsis';
import styles from './GovernmentVideoPermissionList.less';
// import VisibilitySensor from 'react-visibility-sensor';
import InfiniteScroll from 'react-infinite-scroller';
// import { hasAuthority } from '@/utils/customAuth';
import codes from '@/utils/codes';
import { AuthLink, hasAuthority } from '@/utils/customAuth';

const FormItem = Form.Item;
const ListItem = List.Item;

const title = '政府视频权限';
const breadcrumbList = [
  {
    title: '首页',
    name: '首页',
    href: '/',
  },
  {
    title: '视频监控',
    name: '视频监控',
  },
  {
    title,
    name: title,
  },
];

// 获取无数据
const getEmptyData = () => {
  return <span style={{ color: 'rgba(0,0,0,0.45)' }}>暂无数据</span>;
};

@connect(({ video, loading, user }) => ({
  video,
  user,
  loading: loading.models.video,
}))
@Form.create()
export default class VideoPermissionList extends PureComponent {
  componentDidMount() {
    const {
      dispatch,
      video: {
        permission: {
          pagination: { pageSize },
        },
      },
    } = this.props;
    dispatch({
      type: 'video/fetchGovList',
      payload: {
        pageNum: 1,
        pageSize,
      },
    });
  }

  // 搜索企业
  handleSearch = () => {
    const {
      dispatch,
      video: {
        permission: {
          pagination: { pageSize },
        },
      },
      form: { getFieldValue },
    } = this.props;
    const name = getFieldValue('name');
    dispatch({
      type: 'video/fetchGovList',
      payload: {
        pageNum: 1,
        pageSize,
        name,
      },
    });
  };

  // 重置筛选
  handleReset = () => {
    const {
      dispatch,
      video: {
        permission: {
          pagination: { pageSize },
        },
      },
      form: { resetFields },
    } = this.props;
    resetFields();
    dispatch({
      type: 'video/fetchGovList',
      payload: {
        pageNum: 1,
        pageSize,
      },
    });
  };

  // 下拉加载企业列表
  handleLoadMore = () => {
    const {
      dispatch,
      video: {
        permission: {
          govIsLast,
          govPagination: { pageNum, pageSize },
        },
      },
    } = this.props;
    if (govIsLast) {
      return;
    }
    // 请求数据
    dispatch({
      type: 'video/fetchGovListByScorll',
      payload: {
        pageNum: pageNum + 1,
        pageSize,
      },
    });
  };

  // 跳转到增加视频权限页面
  handleToAdd = () => {
    router.push('/video-surveillance/government-video-permission/add');
  };

  // // 跳转到编辑视频权限页面
  // handleToEdit = companyId => {
  //   router.push(`/video-surveillance/government-video-permission/edit/${companyId}`);
  // };

  handleDelete() {}

  // 搜索栏
  renderQuery() {
    const {
      form: { getFieldDecorator },
      user: { currentUser: { unitType, permissionCodes } = {} },
    } = this.props;
    const {
      videoSurveillance: {
        governmentVideoPermission: { add },
      },
    } = codes;
    const hasAddAuthority = hasAuthority(add, permissionCodes);
    // return unitType && unitType === 3 ? (
    return (
      <Card>
        <Form layout="inline">
          <FormItem label="所属单位：">
            {getFieldDecorator('name', {
              getValueFromEvent: e => e.target.value.replace(/\s+/g, ''),
            })(<Input style={{ width: '300px' }} placeholder="请输入" />)}
          </FormItem>
          <FormItem>
            <Button type="primary" onClick={this.handleSearch}>
              查询
            </Button>
          </FormItem>
          <FormItem>
            <Button onClick={this.handleReset}>重置</Button>
          </FormItem>
          <FormItem style={{ float: 'right' }}>
            <Button onClick={this.handleToAdd} type="primary" disabled={!hasAddAuthority}>
              新增
            </Button>
          </FormItem>
        </Form>
      </Card>
    );
    // : null;
  }

  renderList() {
    const {
      loading,
      video: {
        permission: { govList },
      },
      // user: {
      //   currentUser: { permissionCodes },
      // },
    } = this.props;

    const {
      videoSurveillance: {
        governmentVideoPermission: { edit },
      },
    } = codes;

    return (
      <div className={styles.cardList} style={{ marginTop: '24px' }}>
        <List
          rowKey="id"
          loading={loading}
          grid={{ gutter: 24, column: 3, lg: 3, md: 2, sm: 1, xs: 1 }}
          dataSource={govList}
          renderItem={item => {
            const { address, departmentId, departmentName, userId, officePhoneJ } = item;
            return (
              <ListItem key={departmentId}>
                <Card
                  title={departmentName}
                  className={styles.card}
                  actions={[
                    <AuthLink
                      code={edit}
                      to={`/video-surveillance/government-video-permission/edit/${departmentId}?name=${departmentName}`}
                      target="_blank"
                    >
                      编辑
                    </AuthLink>,
                  ]}
                  /* extra={
                  <Button
                    onClick={() => { this.handleDelete() }}
                    shape="circle"
                    style={{ border: 'none', fontSize: '20px' }}
                  >
                    <Icon type="close" />
                  </Button>
                } */
                >
                  <div>
                    <Ellipsis tooltip lines={1} className={styles.ellipsisText}>
                      地址：
                      {address || getEmptyData()}
                    </Ellipsis>
                    {/* <Ellipsis tooltip lines={1} className={styles.ellipsisText}>
                      行业类别：
                      {industryCategoryLabel || getEmptyData()}
                    </Ellipsis> */}
                    <Ellipsis tooltip lines={1} className={styles.ellipsisText}>
                      机构负责人：
                      {userId || getEmptyData()}
                    </Ellipsis>
                    <Ellipsis tooltip lines={1} className={styles.ellipsisText}>
                      联系电话：
                      {officePhoneJ || getEmptyData()}
                    </Ellipsis>
                  </div>
                </Card>
              </ListItem>
            );
          }}
        />
      </div>
    );
  }

  render() {
    const {
      video: {
        permission: { govIsLast },
        govData: {
          pagination: { total },
        },
      },
      loading,
    } = this.props;
    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
        content={
          <div>
            单位总数：
            {total}
          </div>
        }
      >
        {this.renderQuery()}
        <InfiniteScroll
          initialLoad={false}
          pageStart={0}
          loadMore={() => {
            // 防止多次加载
            !loading && this.handleLoadMore();
          }}
          hasMore={!govIsLast}
          // loader={
          //   <div className="loader" key={0}>
          //     {loading && (
          //       <div style={{ paddingTop: '50px', textAlign: 'center' }}>
          //         <Spin />
          //       </div>
          //     )}
          //   </div>
          // }
        >
          {this.renderList()}
        </InfiniteScroll>
      </PageHeaderLayout>
    );
  }
}
