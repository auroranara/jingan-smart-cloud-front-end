import { PureComponent } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Card, Button, Col, Row, Input, List, Spin, message } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import Ellipsis from 'components/Ellipsis';
import InfiniteScroll from 'react-infinite-scroller';
import codes from '@/utils/codes';
import { Link } from 'dva/router';
import { hasAuthority } from '@/utils/customAuth';
import { connect } from 'dva';
import router from 'umi/router';
import styles from './MapManagementList.less';

const FormItem = Form.Item;

const title = '地图管理';
const breadcrumbList = [
  { name: '首页', title: '首页', href: '/' },
  { name: '人员定位', title: '人员定位' },
  { name: title, title },
];
const defaultPageSize = 10;
const {
  personnelPosition: {
    map: { companyMap: companyMapCode },
  },
} = codes;

@Form.create()
@connect(({ personnelPosition, user, loading }) => ({
  personnelPosition,
  user,
  loading: loading.effects['personnelPosition/fetchMapCompanies'],
}))
export default class MapManagementList extends PureComponent {
  componentDidMount() {
    // 获取地图单位列表
    this.fetchMapCompanies({ payload: { pageNum: 1, pageSize: defaultPageSize } });
  }

  // 获取地图单位列表
  fetchMapCompanies = actions => {
    const { dispatch } = this.props;
    dispatch({
      type: 'personnelPosition/fetchMapCompanies',
      ...actions,
    });
  };

  // 点击查询
  handleQuery = () => {
    const {
      form: { getFieldValue },
    } = this.props;
    const name = getFieldValue('name') || null;
    this.fetchMapCompanies({ payload: { pageNum: 1, pageSize: defaultPageSize, name } });
  };

  // 点击重置
  handleReset = () => {
    const {
      form: { resetFields },
    } = this.props;
    resetFields();
    this.handleQuery();
  };

  // 点击跳转到地图列表
  handleViewBeacons = ({ id }) => {
    router.push(`/personnel-position/map-management/company-map/${id}`);
  };

  // 加载更多地图单位数据
  handleLoadMore = () => {
    const {
      form: { getFieldValue },
      personnelPosition: {
        map: {
          pagination: { pageNum, pageSize },
        },
      },
    } = this.props;
    const name = getFieldValue('name');
    this.fetchMapCompanies({ payload: { pageNum: pageNum + 1, pageSize, name } });
  };

  render() {
    const {
      loading,
      form: { getFieldDecorator },
      user: {
        currentUser: { permissionCodes },
      },
      personnelPosition: {
        map: {
          mapCompanies = [], // 地图单位列表
          pagination: { pageNum, pageSize, total },
          isLast,
        },
      },
    } = this.props;
    const viewAuth = hasAuthority(companyMapCode, permissionCodes);

    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
        content={
          <span>
            单位总数：
            {total}
          </span>
        }
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
                  <Button style={{ marginRight: '10px' }} type="primary" onClick={this.handleQuery}>
                    查询
                  </Button>
                  <Button onClick={this.handleReset}>重置</Button>
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Card>
        {/* 信标单位列表 */}
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
          <div className={styles.mapManagement}>
            <List
              rowKey="id"
              grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
              dataSource={mapCompanies}
              renderItem={item => {
                const {
                  id,
                  name, // 公司名称
                  principalName = null,
                  principalPhone = null,
                  practicalAddress = null, // 地址
                  mapCount = 0, // 地图数
                } = item;
                return (
                  <List.Item key={id}>
                    <Card title={name} className={styles.card}>
                      <Ellipsis tooltip className={styles.ellipsis} lines={1}>
                        主要负责人：
                        {principalName || '暂无信息'}
                      </Ellipsis>
                      <Ellipsis tooltip className={styles.ellipsis} lines={1}>
                        联系电话：
                        {principalPhone || '暂无信息'}
                      </Ellipsis>
                      <Ellipsis tooltip className={styles.ellipsis} lines={1}>
                        地址：
                        {practicalAddress || '暂无信息'}
                      </Ellipsis>

                      {viewAuth ? (
                        <div className={styles.countContainer}>
                          <Link
                            to={`/personnel-position/map-management/company-map/${id}`}
                            target="_blank"
                          >
                            <div className={styles.count}>{mapCount}</div>
                            <p className={styles.text}>地图数</p>
                          </Link>
                        </div>
                      ) : (
                        <div
                          className={styles.countContainer}
                          onClick={() => {
                            message.warn('您没有权限访问对应页面');
                          }}
                        >
                          <div className={styles.count}>{mapCount}</div>
                          <p className={styles.text}>地图数</p>
                        </div>
                      )}

                      {/* <div className={styles.countContainer} onClick={viewAuth ? () => this.handleViewBeacons(item) : null}>
                        <div className={styles.count}>{mapCount}</div>
                        <p className={styles.text}>地图数</p>
                      </div> */}
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
