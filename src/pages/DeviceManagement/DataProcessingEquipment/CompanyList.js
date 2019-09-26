import { PureComponent, Fragment } from 'react';
import { Card, Button, Form, Input, Row, Col, Select, Spin, List, Table } from 'antd';
import { connect } from 'dva';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
// import InfiniteScroll from 'react-infinite-scroller';
import { AuthButton, AuthA, AuthLink } from '@/utils/customAuth';
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
  tableLoading: loading.effects['device/fetchCompaniesForPage'],
}))
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

  // 获取列表
  fetchList = actions => {
    const { dispatch } = this.props;
    dispatch({
      type: 'device/fetchCompaniesForPage',
      ...actions,
    })
  }

  /**
   * 点击查询，获取列表
   */
  handleQuery = (pageNum = 1, pageSize = 10) => {
    const {
      form: { getFieldsValue },
    } = this.props
    const values = getFieldsValue()
    this.fetchList({ payload: { pageNum, pageSize, ...values } })
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

  renderTable = () => {
    const {
      tableLoading,
      device: {
        company: {
          list = [],
          pagination: { total, pageNum, pageSize },
        },
      },
    } = this.props
    const columns = [
      {
        title: '单位名称',
        dataIndex: 'companyName',
        align: 'center',
        width: 400,
      },
      {
        title: '数据处理设备',
        dataIndex: 'equipmentTypeList',
        align: 'center',
        width: 700,
        render: (val, row) => (
          <div className={styles.typeContainer}>
            {val.length ? val.map(({ id, logoWebUrl, name, count }) => (
              <div key={id} className={styles.iconContainer}>
                <div className={styles.imgContainer}>
                  <img src={logoWebUrl} alt="" />
                  <div>{name}</div>
                </div>
                <div className={styles.num}>{count}</div>
              </div>
            )) : null}
          </div>
        ),
      },
      {
        title: '操作',
        key: '操作',
        align: 'center',
        fixed: 'right',
        width: 150,
        render: (val, row) => (
          <AuthLink code={editTypeCode} to={`/device-management/data-processing/edit/${row.companyId}`}>编辑</AuthLink>
        ),
      },
    ]
    return (
      <Card style={{ marginTop: '24px' }}>
        {list && list.length > 0 ? (
          <Table
            rowKey="id"
            loading={tableLoading}
            columns={columns}
            dataSource={list}
            bordered
            scroll={{ x: 'max-content' }}
            pagination={{
              current: pageNum,
              pageSize,
              total,
              showQuickJumper: true,
              showSizeChanger: true,
              pageSizeOptions: ['5', '10', '15', '20'],
              onChange: this.handleQuery,
              onShowSizeChange: (num, size) => {
                this.handleQuery(1, size);
              },
            }}
          />
        ) : (
            <div style={{ width: '100%', textAlign: 'center' }}><span>暂无数据</span></div>
          )}

      </Card>
    )
  }

  render() {
    const {
      tableLoading,
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
        {this.renderTable()}
      </PageHeaderLayout>
    )
  }
}
