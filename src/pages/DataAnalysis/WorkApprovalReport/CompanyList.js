import { PureComponent } from 'react';
import { Card, Button, Row, Col, Form, Input, List, Spin } from 'antd';
import { connect } from 'dva';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import InfiniteScroll from 'react-infinite-scroller';
import Ellipsis from 'components/Ellipsis';
import router from 'umi/router';
import { hasAuthority } from '@/utils/customAuth';
import codes from '@/utils/codes'
import styles from './CompanyList.less';

const title = '作业审批报表'
const breadcrumbList = [
  { title: '首页', name: '首页', href: '/' },
  { title: '数据分析', name: '数据分析' },
  { title, name: title },
]
const colWrapper = { lg: 8, md: 12, sm: 24, xs: 24 }
const formItemStyle = { style: { margin: '0', padding: '4px 0' } }
const PAGESIZE = 18;

const {
  dataAnalysis: {
    workApprovalReport: {
      workApprovalList: workApprovalListCode,
    },
  },
} = codes

@Form.create()
@connect(({ dataAnalysis, company, user, loading }) => ({
  dataAnalysis,
  company,
  user,
  loading: loading.models.company,
}))
export default class CompanyList extends PureComponent {


  componentDidMount() {
    const { user: { currentUser: { unitType, companyName, companyId } } } = this.props
    // 判断是否是企事业用户，是则直接进入作业列表
    if (unitType === 4) {
      router.push(`/data-analysis/work-approval-report/company/${companyId}/0?companyName=${companyName}`)
      return
    }
    this.handleQuery()
  }


  /**
   * 获取企业列表
   * @param {*} action
   */
  fetchCompanies(action) {
    const {
      dispatch,
    } = this.props
    dispatch({
      type: 'company/fetch',
      ...action,
    });
  }


  /**
   * 获取更多企业
   * @param {*} action
   */
  appendFetch(action) {
    const {
      dispatch,
    } = this.props
    dispatch({
      type: 'company/appendFetch',
      ...action,
    });
  }


  /**
   * 加载更多企业
   */
  handleLoadMore = () => {
    const {
      company: { isLast, pageNum },
      form: { getFieldsValue },
    } = this.props;
    if (isLast) {
      return;
    }

    // 请求数据
    this.appendFetch({
      payload: {
        pageNum: pageNum + 1,
        pageSize: PAGESIZE,
        eightJobCountFlag: '1',
        ...getFieldsValue(),
      },
    });
  }

  // 点击查询
  handleQuery = (pageNum = 1, pageSize = PAGESIZE) => {
    const {
      form: { getFieldsValue },
    } = this.props
    const values = getFieldsValue()
    this.fetchCompanies({
      payload: {
        pageNum,
        pageSize,
        eightJobCountFlag: '1',
        ...values,
      },
    })
  }

  // 点击重置
  handleReset = () => {
    const {
      form: { resetFields },
    } = this.props
    resetFields()
    this.handleQuery()
  }


  /**
   * 点击卡片
   */
  handleCardClick = (companyId, name) => {
    router.push(`/data-analysis/work-approval-report/company/${companyId}/0?companyName=${name}`)
  }

  /**
   * 渲染筛选栏
   */
  renderFilter = () => {
    const {
      form: { getFieldDecorator },
    } = this.props
    return (
      <Card>
        <Row gutter={16}>
          <Col {...colWrapper}>
            <Form.Item {...formItemStyle}>
              {getFieldDecorator('name')(
                <Input placeholder="单位名称" />
              )}
            </Form.Item>
          </Col>
          <Col {...colWrapper}>
            <Form.Item {...formItemStyle}>
              <Button style={{ marginRight: '10px' }} type="primary" onClick={() => this.handleQuery()}> 查询</Button>
              <Button onClick={this.handleReset}>重置</Button>
            </Form.Item>
          </Col>
        </Row>
      </Card>
    )
  }


  /**
   * 渲染列表
   */
  renderList = () => {
    const {
      company: { list },
      user: { currentUser: { permissionCodes } },
    } = this.props
    const viewListAuth = hasAuthority(workApprovalListCode, permissionCodes)
    return (
      <div className={styles.cardList} style={{ marginTop: '24px' }}>
        <List
          rowKey="id"
          dataSource={list}
          grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
          locale={{ emptyText: '暂无数据' }}
          renderItem={(item) => {
            const {
              id,
              name, // 公司名称
              practicalAddress = null, // 地址
              practicalProvinceLabel,
              practicalCityLabel,
              practicalDistrictLabel,
              practicalTownLabel,
              industryCategoryLabel,
              safetyName,
              safetyPhone,
            } = item
            const practicalAddressLabel =
              (practicalProvinceLabel || '') +
              (practicalCityLabel || '') +
              (practicalDistrictLabel || '') +
              (practicalTownLabel || '') +
              (practicalAddress || '');
            return (
              <List.Item key={id}>
                <Card title={name} className={styles.card} style={{ cursor: viewListAuth ? 'pointer' : 'inherit' }} onClick={() => viewListAuth ? this.handleCardClick(id, name) : null}>
                  <Ellipsis tooltip className={styles.ellipsisText} lines={1}>
                    地址：{practicalAddressLabel || '暂无信息'}
                  </Ellipsis>
                  <Ellipsis tooltip className={styles.ellipsisText} lines={1}>
                    行业类别：{industryCategoryLabel || '暂无信息'}
                  </Ellipsis>
                  <Ellipsis tooltip className={styles.ellipsisText} lines={1}>
                    安全管理员：{safetyName || '暂无信息'}
                  </Ellipsis>
                  <Ellipsis tooltip className={styles.ellipsisText} lines={1}>
                    联系电话：{safetyPhone || '暂无信息'}
                  </Ellipsis>
                </Card>
              </List.Item>
            )
          }
          }
        ></List>
      </div>
    )
  }

  render() {
    const {
      company: {
        data: {
          pagination: { total = 0 },
        },
        isLast,
      },
      loading,
    } = this.props;
    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
        content={`单位总数：${total}`}
      >
        {this.renderFilter()}
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
    )
  }
}
