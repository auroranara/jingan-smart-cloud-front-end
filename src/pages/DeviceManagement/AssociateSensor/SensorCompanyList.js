import { Component, Fragment } from 'react';
import { Card, Form, Row, Col, Input, Select, Button, List, Spin, Modal } from 'antd';
import { connect } from 'dva';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import InfiniteScroll from 'react-infinite-scroller';
import Ellipsis from 'components/Ellipsis';
import CompanyModal from '@/pages/BaseInfo/Company/CompanyModal';
import codes from '@/utils/codes';
import { hasAuthority, AuthIcon } from '@/utils/customAuth';
import router from 'umi/router';
import styles from './SensorCompanyList.less';
import { message } from 'antd';
import iconWater from '@/assets/water-syatem.png'

const FormItem = Form.Item;

const title = '设备关联传感';
const breadcrumbList = [
  { title: '首页', name: '首页', href: '/' },
  { title: '设备管理', name: '设备管理' },
  { title, name: title },
]
const colWrapper = { lg: 8, md: 12, sm: 24, xs: 24 }
const formItemStyle = { style: { margin: '0', padding: '4px 0' } }
const defaultPageSize = 10;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};
const itemStyles = { style: { width: 'calc(70%)', marginRight: '10px' } }
const {
  deviceManagement: {
    associateSensor: {
      waterSystem: waterSystemCode,
      addCompany: addCompanyCode,
    },
  },
} = codes

@Form.create()
@connect(({ sensor, resourceManagement, user, loading }) => ({
  sensor,
  resourceManagement,
  user,
  loading: false,
  companyLoading: loading.effects['resourceManagement/fetchCompanyList'],
}))
export default class SensorCompanyList extends Component {

  state = {
    addModalVisible: false, // 新增单位弹窗可见
    companyModalVisible: false, // 选择企业弹窗
    company: undefined,          // 新增单位时选择的单位信息
  }

  componentDidMount() {
    const { dispatch } = this.props
    this.fetchSensorCompanies({ payload: { pageNum: 1, pageSize: defaultPageSize } })
    // 获取设备类型列表
    dispatch({ type: 'sensor/fetchDeviceTypes' })
  }

  /**
   * 获取传感器企业列表
   */
  fetchSensorCompanies = actions => {
    const { dispatch } = this.props
    dispatch({ type: 'sensor/fetchSensorCompanies', ...actions })
  }

  // 获取单位列表
  fetchCompanyList = actions => {
    const { dispatch } = this.props;
    dispatch({ type: 'resourceManagement/fetchCompanyList', ...actions });
  };

  handleQuery = (pageNum = 1, pageSize = defaultPageSize) => {
    const { form: { getFieldsValue } } = this.props
    const { searchCompanyName: companyName } = getFieldsValue()
    this.fetchSensorCompanies({ payload: { companyName, pageNum, pageSize } })
  }

  handleSelectCompany = company => {
    const { form: { setFieldsValue } } = this.props
    setFieldsValue({ companyId: company.id })
    this.setState({ company, companyModalVisible: false })
  }

  //点击选择企业
  handleViewCompanyModal = () => {
    this.fetchCompanyList({
      payload: { pageNum: 1, pageSize: defaultPageSize },
      callback: () => {
        this.setState({ companyModalVisible: true });
      },
    });
  };

  // 新增企业及企业下设备
  addSensorCompany = () => {
    const {
      dispatch,
      form: { validateFields },
    } = this.props
    validateFields((err, { searchCompanyName, ...values }) => {
      if (!err) {
        dispatch({
          type: 'sensor/addSensorCompany',
          payload: { ...values },
          success: () => {
            message.success('新增单位成功！')
            this.setState({ addModalVisible: false })
            this.handleQuery()
          },
          error: () => { message.error('新增单位失败！') },
        })
      }
    })
  }

  handleReset = () => {
    const { form: { resetFields } } = this.props
    resetFields()
    this.handleQuery(1, defaultPageSize)
  }

  /**
   * 渲染筛选栏
   */
  renderFilter = () => {
    const {
      form: { getFieldDecorator },
      user: { currentUser: { permissionCodes } },
    } = this.props
    const addCompanyAuth = hasAuthority(addCompanyCode, permissionCodes)

    return (
      <Card>
        <Form>
          <Row gutter={16}>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                {getFieldDecorator('searchCompanyName')(
                  <Input placeholder="请输入单位名称" />
                )}
              </FormItem>
            </Col>
            {/* <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
              {getFieldDecorator()(
                <Select placeholder="请选择监测类型">
                  {}
                </Select>
              )}
              </FormItem>
            </Col> */}
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                <Button style={{ marginRight: '10px' }} type="primary" onClick={() => this.handleQuery()}>查询</Button>
                <Button style={{ marginRight: '10px' }} onClick={this.handleReset}>重置</Button>
                <Button type="primary" disabled={!addCompanyAuth} onClick={() => { this.setState({ addModalVisible: true, company: undefined }) }}>新增单位</Button>
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
      loading,
      sensor: {
        sensorCompany: {
          list = [],
          pagination: { pageNum, pageSize },
          isLast,
        },
      },
    } = this.props
    return (
      <InfiniteScroll
        initialLoad={false}
        pageStart={0}
        loadMore={() => {
          // 防止多次加载
          !loading && this.handleQuery(pageNum + 1, pageSize);
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
        <div className={styles.sensorCompanyList}>
          <List
            rowKey="id"
            grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
            dataSource={list}
            renderItem={item => {
              const {
                id,
                name, // 公司名称
                principal_name = null,
                principal_phone = null,
                practical_address = null, // 地址
                industryCategoryLabel = null,
              } = item
              return (
                <List.Item
                  key={id}
                // actions={[

                // ]}
                >
                  <Card title={name} className={styles.card}>
                    <Ellipsis tooltip className={styles.ellipsis} lines={1}>
                      地址：{practical_address || '暂无信息'}
                    </Ellipsis>
                    <Ellipsis tooltip className={styles.ellipsis} lines={1}>
                      行业类别：{industryCategoryLabel || '暂无信息'}
                    </Ellipsis>
                    <Ellipsis tooltip className={styles.lsEllipsis} lines={1}>
                      主要负责人：{`${principal_name} ${principal_phone}`}
                    </Ellipsis>
                    <div className={styles.iconContainer}>
                      <AuthIcon
                        key={'water'}
                        title={'水系统'}
                        url={iconWater}
                        // darkUrl={ICONS_URL[`${icon}-d`]}
                        code={waterSystemCode}
                        // to={{
                        //   pathname: `/data-analysis/IOT-abnormal-data/${icon}/${id}`,
                        //   num: iconNums[icon],
                        // }}
                        to={`/device-management/associate-sensor/company/${id}/water-system`}
                        style={{
                          width: 30,
                          height: 30,
                          marginRight: 15,
                          backgroundSize: '100% 100%',
                        }}
                      />
                    </div>
                    {/* <div className={styles.countContainer}>
                    <div className={styles.count}>{accessCardCount}</div>
                    <p className={styles.text}>标签数</p>
                  </div> */}
                  </Card>
                </List.Item>
              )
            }}
          />
        </div>
      </InfiniteScroll>
    )
  }


  /**
   * 渲染新增单位弹窗
   */
  renderAddModal = () => {
    const {
      form: { getFieldDecorator },
      sensor: { deviceTypes = [] },
    } = this.props
    const { addModalVisible, company = {} } = this.state
    return (
      <Modal
        title="新增单位"
        width={700}
        visible={addModalVisible}
        destroyOnClose={true}
        onCancel={() => { this.setState({ addModalVisible: false }) }}
        onOk={this.addSensorCompany}
      >
        <Form>
          <FormItem label="单位名称" {...formItemLayout}>
            {getFieldDecorator('companyId', {
              rules: [{ required: true, message: '请选择单位' }],
            })(
              <Fragment>
                <Input value={company.name} disabled placeholder="请输入" {...itemStyles} />
                <Button type="primary" onClick={this.handleViewCompanyModal}>选择单位</Button>
              </Fragment>
            )}
          </FormItem>
          <FormItem label="设备名称" {...formItemLayout}>
            {getFieldDecorator('deviceName', {
              rules: [{ required: true, message: '请输入设备名称' }],
            })(
              <Input placeholder="请输入" {...itemStyles} />
            )}
          </FormItem>
          <FormItem label="设备类型" {...formItemLayout}>
            {getFieldDecorator('deviceType', {
              rules: [{ required: true, message: '请选择设备类型' }],
            })(
              <Select placeholder="请输入" {...itemStyles}>
                {deviceTypes.map(({ type, typeDesc }, i) => (<Select.Option key={i} value={type}>{typeDesc}</Select.Option>))}
              </Select>
            )}
          </FormItem>
          <FormItem label="所在区域" {...formItemLayout}>
            {getFieldDecorator('area', {
              rules: [{ required: true, message: '请输入所在区域' }],
            })(
              <Input placeholder="请输入" {...itemStyles} />
            )}
          </FormItem>
          <FormItem label="所在位置" {...formItemLayout}>
            {getFieldDecorator('location', {
              rules: [{ required: true, message: '请输入所在位置' }],
            })(
              <Input placeholder="请输入" {...itemStyles} />
            )}
          </FormItem>
        </Form>
      </Modal>
    )
  }

  render() {
    const {
      companyLoading,
      resourceManagement: { companyList },
      sensor: {
        sensorCompany: { pagination: { total } },
      },
    } = this.props
    const { companyModalVisible } = this.state
    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
        content={`单位总数：${total}`}
      >
        {this.renderFilter()}
        {this.renderList()}
        {this.renderAddModal()}
        {/* 选择企业弹窗 */}
        <CompanyModal
          title="选择单位"
          loading={companyLoading}
          visible={companyModalVisible}
          modal={companyList}
          fetch={this.fetchCompanyList}
          onSelect={this.handleSelectCompany}
          onClose={() => { this.setState({ companyModalVisible: false }) }}
        />
      </PageHeaderLayout>
    )
  }
}
