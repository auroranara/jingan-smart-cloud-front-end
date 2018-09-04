import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, List, Card, Button, Icon, Input, message, Spin, Col } from 'antd';
import { Link, routerRedux } from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout.js';
import Ellipsis from 'components/Ellipsis';
import styles from './VideoPermissionList.less'
import VisibilitySensor from 'react-visibility-sensor';
import { hasAuthority } from 'utils/customAuth';
import codes from '../../../utils/codes';
import { AuthLink } from '../../../utils/customAuth';

const FormItem = Form.Item
const ListItem = List.Item

const title = "视频权限"
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
]


// 获取无数据
const getEmptyData = () => {
  return <span style={{ color: 'rgba(0,0,0,0.45)' }}>暂无数据</span>;
};

@connect(
  ({ video, loading, user }) => ({
    video,
    user,
    loading: loading.models.video,
  })
)

@Form.create()
export default class VideoPermissionList extends PureComponent {

  componentDidMount() {
    const {
      dispatch,
      video: { permission: { pagination: { pageSize } } },
    } = this.props
    dispatch({
      type: 'video/fetchCompanyList',
      payload: {
        pageNum: 1,
        pageSize,
      },
    })
  }

  // 搜索企业
  handleSearch = () => {
    const {
      dispatch,
      video: { permission: { pagination: { pageSize } } },
      form: { getFieldValue },
    } = this.props
    const name = getFieldValue('name')
    dispatch({
      type: 'video/fetchCompanyList',
      payload: {
        pageNum: 1,
        pageSize,
        name,
      },
    })
  }

  // 重置筛选
  handleReset = () => {
    const {
      dispatch,
      video: { permission: { pagination: { pageSize } } },
      form: { resetFields },
    } = this.props
    resetFields()
    dispatch({
      type: 'video/fetchCompanyList',
      payload: {
        pageNum: 1,
        pageSize,
      },
    })
  }

  // 下拉加载企业列表
  handleLoadMore = flag => {
    const {
      dispatch,
      video: { permission: { isLast, pagination: { pageNum, pageSize } } },
    } = this.props;
    if (!flag || isLast) {
      return;
    }
    // 请求数据
    dispatch({
      type: 'video/fetchCompanyListByScorll',
      payload: {
        pageNum: pageNum + 1,
        pageSize,
      },
    })

  }

  // 跳转到增加视频权限页面
  handleToAdd = () => {
    const { dispatch } = this.props
    dispatch(routerRedux.push('/video-surveillance/video-permission/add'))
  }

  // 跳转到编辑视频权限页面
  handleToEdit = companyId => {
    const { dispatch } = this.props
    dispatch(routerRedux.push(`/video-surveillance/video-permission/edit/${companyId}`))
  }

  handleDelete() { }

  // 搜索栏
  renderQuery() {
    const { form: { getFieldDecorator },
      user: { currentUser: { unitType } = {} },
    } = this.props
    return (unitType && unitType === 3) ? (
      <Card>
        <Form layout="inline">
          <FormItem label="所属单位：">
            {getFieldDecorator('name', {
              getValueFromEvent: e => e.target.value.replace(/\s+/g, ''),
            })(<Input style={{ width: '300px' }} placeholder="请输入"></Input>)}
          </FormItem>
          <FormItem>
            <Button type="primary" onClick={this.handleSearch}>查询</Button>
          </FormItem>
          <FormItem>
            <Button onClick={this.handleReset}>重置</Button>
          </FormItem>
          <FormItem style={{ float: 'right' }}>
            <Button onClick={this.handleToAdd} type="primary">新增</Button>
          </FormItem>
        </Form >
      </Card>
    ) : null
  }

  renderList() {
    const {
      loading,
      video: { permission: { list } },
      user: { currentUser: { permissionCodes } },
    } = this.props

    const { videoSurveillance: { videoPermission: { edit } } } = codes

    return (
      <div className={styles.cardList} style={{ marginTop: '24px' }}>
        <List
          rowKey="id"
          loading={loading}
          grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
          dataSource={list}
          renderItem={item => {
            const {
              id,
              name,
              practicalAddress,
              industryCategoryLabel,
              safetyName,
              safetyPhone,
              practicalProvinceLabel,
              practicalCityLabel,
              practicalDistrictLabel,
              practicalTownLabel,
            } = item;
            const practicalAddressLabel =
              (practicalProvinceLabel || '') +
              (practicalCityLabel || '') +
              (practicalDistrictLabel || '') +
              (practicalTownLabel || '') +
              (practicalAddress || '');
            return (
              <ListItem key={id}>
                <Card
                  title={name}
                  className={styles.card}
                  actions={[
                    (<AuthLink
                      code={edit}
                      to={`/video-surveillance/video-permission/edit/${item.id}`}
                    >
                      编辑</AuthLink>),
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
                      地址：{practicalAddressLabel || getEmptyData()}
                    </Ellipsis>
                    <Ellipsis tooltip lines={1} className={styles.ellipsisText}>
                      行业类别：{industryCategoryLabel || getEmptyData()}
                    </Ellipsis>
                    <Ellipsis tooltip lines={1} className={styles.ellipsisText}>
                      负责人：{safetyName || getEmptyData()}
                    </Ellipsis>
                    <Ellipsis tooltip lines={1} className={styles.ellipsisText}>
                      联系电话：{safetyPhone || getEmptyData()}
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
    const { video: { permission: { list } } } = this.props
    return (
      <PageHeaderLayout title={title} breadcrumbList={breadcrumbList}>
        {this.renderQuery()}
        {this.renderList()}
        {list && list.length !== 0 && <VisibilitySensor onChange={this.handleLoadMore} style={{}} />}
        {/* {loading && (
          <div style={{ paddingTop: '50px', textAlign: 'center' }}>
            <Spin />
          </div>
        )} */}
      </PageHeaderLayout>
    )
  }
}
