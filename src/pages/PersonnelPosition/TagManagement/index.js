import { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Card, Spin, List, message, Form, Row, Col, Input } from 'antd';
import InfiniteScroll from 'react-infinite-scroller';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import Ellipsis from 'components/Ellipsis';
import codes from '@/utils/codes';
import { hasAuthority } from '@/utils/customAuth';
import router from 'umi/router';
import styles from './index.less';

const FormItem = Form.Item;

const title = "标签管理"
const breadcrumbList = [
  { name: '首页', title: '首页', href: '/' },
  { name: '人员定位', title: '人员定位' },
  { name: title, title },
]
const defaultPageSize = 10;
const {
  personnelPosition: {
    tag: { list: viewTagsCode },
  },
} = codes

@Form.create()
@connect(({ personnelPosition, user, loading }) => ({
  personnelPosition,
  user,
  loading: loading.effects['personnelPosition/fetchTagCompanies'],
}))
export default class TagManagement extends PureComponent {

  componentDidMount() {
    this.fetchTagCompanies({ payload: { pageNum: 1, pageSize: defaultPageSize } })
  }

  // 获取企业信标列表
  fetchTagCompanies = (actions) => {
    const { dispatch } = this.props
    dispatch({
      type: 'personnelPosition/fetchTagCompanies',
      ...actions,
    })
  }

  // 点击查询
  handleQuery = () => {
    const { form: { getFieldValue } } = this.props
    const name = getFieldValue('name')
    this.fetchTagCompanies({
      payload: { pageNum: 1, pageSize: defaultPageSize, name },
    })
  }

  // 点击重置
  handleReset = () => {
    const { form: { resetFields } } = this.props
    resetFields()
    this.handleQuery()
  }

  handleLoadMore = () => {
    const {
      personnelPosition: {
        tag: { companyPagination: { pageNum, pageSize } },
      },
    } = this.props
    this.fetchTagCompanies({ payload: { pageNum: pageNum + 1, pageSize } })
  }

  // 查看企业的标签列表
  handleViewTag = (companyId, auth) => {
    if (auth) {
      router.push(`/personnel-position/tag-management/company/${companyId}`)
      return
    }
    message.warning('您没有权限访问对应页面')
  }

  render() {
    const {
      loading,
      form: { getFieldDecorator },
      personnelPosition: {
        tag: {
          companyList,// 标签企业列表
          companyIsLast: isLast,
        },
      },
      user: { currentUser: { permissionCodes } },
    } = this.props
    const viewTagsAuth = hasAuthority(viewTagsCode, permissionCodes)
    return (
      <PageHeaderLayout title={title} breadcrumbList={breadcrumbList}>
        {/* 筛选栏 */}
        <Card>
          <Form>
            <Row gutter={16}>
              <Col lg={8} md={12} sm={24} xs={24}>
                <FormItem style={{ margin: '0', padding: '4px 0' }}>
                  {getFieldDecorator('name')(
                    <Input placeholder="请输入单位名称" />
                  )}
                </FormItem>
              </Col>
              <Col lg={8} md={12} sm={24} xs={24}>
                <FormItem style={{ margin: '0', padding: '4px 0' }}>
                  <Button type="primary" onClick={this.handleQuery}>查询</Button>
                  <Button style={{ marginLeft: '10px' }} onClick={this.handleReset}>重置</Button>
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Card>
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
          <div className={styles.tagCompanyList}>
            <List
              rowKey="id"
              grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
              dataSource={companyList}
              renderItem={item => {
                const {
                  id,
                  name, // 公司名称
                  principalName = null,
                  principalPhone = null,
                  practicalAddress = null, // 地址
                  accessCardCount,
                  company_id,
                } = item
                return (
                  <List.Item key={id}>
                    <Card title={name} className={styles.card}>
                      <Ellipsis tooltip className={styles.ellipsis} lines={1}>
                        主要负责人：{principalName || '暂无信息'}
                      </Ellipsis>
                      <Ellipsis tooltip className={styles.ellipsis} lines={1}>
                        联系电话：{principalPhone || '暂无信息'}
                      </Ellipsis>
                      <div className={styles.lsEllipsis}>
                        <Ellipsis tooltip lines={1}>
                          地址：{practicalAddress || '暂无信息'}
                        </Ellipsis>
                      </div>
                      <div className={styles.countContainer} onClick={() => this.handleViewTag(company_id, viewTagsAuth)}>
                        <div className={styles.count}>{accessCardCount}</div>
                        <p className={styles.text}>标签数</p>
                      </div>
                    </Card>
                  </List.Item>
                )
              }}
            ></List>
          </div>
        </InfiniteScroll>
      </PageHeaderLayout>
    )
  }
}
