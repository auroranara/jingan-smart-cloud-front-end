import { PureComponent } from 'react';
import { Card, Button, Form, Input, Row, Col, Select, Spin, List } from 'antd';
import { connect } from 'dva';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import InfiniteScroll from 'react-infinite-scroller';
import { AuthButton } from '@/utils/customAuth';
import codes from '@/utils/codes';
import router from 'umi/router';
import styles from './CompanyList.less';

const FormItem = Form.Item;

const title = '单位数据处理设备'
const breadcrumbList = [
  { title: '首页', name: '首页', href: '/' },
  { title: '设备管理', name: '设备管理' },
  { title, name: title },
];
const colWrapper = { lg: 8, md: 12, sm: 24, xs: 24 }
const formItemStyle = { style: { margin: '0', padding: '4px 0' } }
const {
  deviceManagement: {
    dataProcessing: {
      addEquipmentType: addTypeCode,
      editEquipmentType: editTypeCode,
    },
  },
} = codes

@Form.create()
@connect(({ device, loading }) => ({
  device,
  loading: loading.effects['device/fetchCompaniesForPage'],
}),
  dispatch => ({
    // 获取列表数据
    fetchList(actions) {
      dispatch({
        type: 'device/fetchCompaniesForPage',
        ...actions,
      })
    },
    dispatch,
  })
)
export default class CompanyList extends PureComponent {

  // 获取数据处理设备类型列表
  componentDidMount() {
    this.handleQuery()
    this.fetchAllDeviceTypes()
  }

  /**
 * 获取所有处理设备类型
 */
  fetchAllDeviceTypes = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'device/fetchAllDeviceTypes', payload: { type: 1 } });
  }

  /**
   * 点击查询，获取列表
   */
  handleQuery = (pageNum = 1, pageSize = 10) => {
    const { fetchList } = this.props
    fetchList({ payload: { pageNum, pageSize } })
  }


  /**
   * 加载更多列表数据
   */
  handleLoadMore = () => {
    const {
      device: {
        company: { pageNum, isLast, pageSize },
      },
      form: { getFieldsValue },
    } = this.props
    if (isLast) return
    const values = getFieldsValue()
    this.fetchList({ payload: { pageNum: pageNum + 1, pageSize, ...values } })
  }

  /**
   * 点击重置筛选栏
   */
  handleReset = () => {
    const { form: { resetFields } } = this.props
    resetFields()
    this.handleQuery()
  }

  jumpToAddType = () => {
    router.push('/device-management/data-processing/add')
  }

  /**
   * 渲染筛选栏
   */
  renderFilter = () => {
    const {
      form: { getFieldDecorator },
      device: {
        monitoringType,
        deviceType: { list: deviceTypeList }, // 设备类型列表
      },
    } = this.props
    return (
      <Card>
        <Form>
          <Row gutter={16}>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                {getFieldDecorator('companyName')(
                  <Input placeholder="单位名称" />
                )}
              </FormItem>
            </Col>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                {getFieldDecorator('equipmentType')(
                  <Select placeholder="设备类型">
                    {deviceTypeList.map(({ id, name }) => (
                      <Select.Option key={id} value={id}>{name}</Select.Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                <Button onClick={() => this.handleQuery()} style={{ marginRight: '10px' }} type="primary">查询</Button>
                <Button onClick={this.handleReset} style={{ marginRight: '10px' }}>重置</Button>
                <AuthButton onClick={this.jumpToAddType} code={addTypeCode} type="primary">新增设备类型</AuthButton>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Card>
    )
  }


  /**
   * 渲染列表
   */
  renderList = () => {
    const {
      device: {
        company: { list = [] },
      },
    } = this.props
    return (
      <div className={styles.cardList} style={{ marginTop: '24px' }}>
        <List
          rowKey="id"
          grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
          dataSource={list}
          renderItem={this.renderCard}
        />
      </div>
    )
  }

  renderCard = item => {
    const {
      id,

    } = item
    return (
      <List.Item key={id}>
        <Card title={name} className={styles.card}>

        </Card>
      </List.Item>
    )
  }

  render() {
    const {
      loading,
      device: {
        company: {
          isLast,
        },
      },
    } = this.props
    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
        content={`单位总数：0`}
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
