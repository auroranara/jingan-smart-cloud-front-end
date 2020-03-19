import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Card, Button, BackTop, Col, Row, Select, Table, Input, DatePicker } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
// import codes from '@/utils/codes';
// import { hasAuthority } from '@/utils/customAuth';
// import router from 'umi/router';
import moment from 'moment';
import ImagePreview from '@/jingan-components/ImagePreview';
import CompanyModal from '@/pages/BaseInfo/Company/CompanyModal';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;

const title = '识别记录';
const defaultPageSize = 10;
const colWrapper = { lg: 8, md: 12, sm: 24, xs: 24 };
const formItemStyle = { style: { margin: '0', padding: '4px 0' } };

//面包屑
const breadcrumbList = [
  {
    title: '首页',
    name: '首页',
    href: '/',
  },
  {
    title: '实名制认证系统',
    name: '实名制认证系统',
  },
  {
    title,
    name: title,
  },
];
const tabList = [{ key: 1, tab: '比对成功' }, { key: 2, tab: '比对失败' }];

@connect(({ realNameCertification, user, resourceManagement, loading }) => ({
  realNameCertification,
  resourceManagement,
  user,
  loading: loading.effects['realNameCertification/fetchIdentificationRecord'],
  companyLoading: loading.effects['resourceManagement/fetchCompanyList'],
}))
@Form.create()
export default class IdentificationRecord extends PureComponent {
  state = {
    tabActiveKey: '1', // 当前标签key
    images: [],
    currentImage: 0,
    company: {}, // 选中的单位
    visible: false, // 选择单位弹窗可见
  };

  componentDidMount () {
    const {
      user: { isCompany, currentUser: { companyId, companyName } },
      realNameCertification: { idenSearchInfo: searchInfo = {} },
    } = this.props;
    if (isCompany) {
      this.setState({ company: { id: companyId, name: companyName } }, () => {
        this.handleQuery();
      })
    } else if (searchInfo.company && searchInfo.company.id) {
      // 如果redux中保存了单位
      this.setState({ company: searchInfo.company }, () => { this.handleQuery() })
    } else {
      this.handleViewCompanyModal()
    }
  }

  // 查询列表
  handleQuery = (pageNum = 1, pageSize = defaultPageSize) => {
    const {
      dispatch,
      form: { getFieldsValue },
    } = this.props;
    const { tabActiveKey, company } = this.state;
    const values = getFieldsValue();
    // console.log('values', values);
    const { time, ...resValues } = values;
    dispatch({
      type: 'realNameCertification/fetchIdentificationRecord',
      payload: {
        ...resValues,
        pageNum,
        pageSize,
        type: tabActiveKey,
        // startTime: time && time.length ? time[0].unix() * 1000 : undefined,
        // endTime: time && time.length ? time[1].unix() * 1000 : undefined,
        startTime: time ? time[0].format('YYYY-MM-DD HH:mm:ss') : undefined,
        endTime: time ? time[1].format('YYYY-MM-DD HH:mm:ss') : undefined,
        companyId: company.id,
      },
    });
  };

  // 点击重置
  handleReset = () => {
    const {
      form: { resetFields },
    } = this.props;
    resetFields();
    this.handleQuery();
  };

  // 获取单位列表
  fetchCompanyList = action => {
    const { dispatch } = this.props;
    dispatch({ type: 'resourceManagement/fetchCompanyList', ...action });
  };

  /* tab列表点击变化 */
  handleTabChange = key => {
    this.setState({ tabActiveKey: key }, () => {
      this.handleQuery();
    });
  };

  // 选择单位
  handleSelectCompany = company => {
    const { dispatch } = this.props;
    this.setState({ company, visible: false }, () => {
      this.handleQuery();
    });
    dispatch({
      type: 'realNameCertification/saveIdenSearchInfo',
      payload: { company },
    })
  }

  // 点击打开选择单位
  handleViewCompanyModal = company => {
    this.fetchCompanyList({
      payload: { pageNum: 1, pageSize: defaultPageSize },
      callback: () => {
        this.setState({ visible: true });
      },
    });
  }

  // 渲染筛选栏
  renderFilter = () => {
    const { tabActiveKey } = this.state;
    const {
      form: { getFieldDecorator },
      realNameCertification: {
        storageLocationDict, // 存储位置字典
        deviceTypeDict, // 设备类型字典
        identificationDict, // 识别模式字典
        livingBodyDict, // 活体判断字典
        validateDict, // 有效期判断字典
        accessDict, // 准入时间判断字典
      },
    } = this.props;
    return (
      <Card>
        <Form>
          <Row gutter={16}>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                {getFieldDecorator('personName')(<Input placeholder="姓名" />)}
              </FormItem>
            </Col>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                {getFieldDecorator('personGuid')(<Input placeholder="GUID" />)}
              </FormItem>
            </Col>
            {/* <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                {getFieldDecorator('deviceName')(
                  <Input placeholder="设备名称" />
                )}
              </FormItem>
            </Col> */}
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                {getFieldDecorator('deviceKey')(<Input placeholder="序列号" />)}
              </FormItem>
            </Col>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                {getFieldDecorator('type')(
                  <Select placeholder="储存位置" allowClear>
                    {storageLocationDict.map(({ key, label }) => (
                      <Select.Option key={key} value={key}>
                        {label}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                {getFieldDecorator('deviceType')(
                  <Select placeholder="设备类型" allowClear>
                    {deviceTypeDict.map(({ key, label }) => (
                      <Select.Option key={key} value={key}>
                        {label}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                {getFieldDecorator('recMode')(
                  <Select placeholder="识别模式" allowClear>
                    {identificationDict.map(({ key, label }) => (
                      <Select.Option key={key} value={key}>
                        {label}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                {getFieldDecorator('time')(
                  <RangePicker
                    style={{ width: '100%' }}
                    showTime={{
                      format: 'HH:mm:ss',
                      defaultValue: [moment('0:0:0', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
                    }}
                    format="YYYY-MM-DD HH:mm:ss"
                    placeholder={['创建开始时间', '创建结束时间']}
                  />
                )}
              </FormItem>
            </Col>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                {getFieldDecorator('aliveType')(
                  <Select placeholder="活体判断" allowClear>
                    {livingBodyDict.map(({ key, label }) => (
                      <Select.Option key={key} value={key}>
                        {label}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
            {tabActiveKey === '1' && (
              <Col {...colWrapper}>
                <FormItem {...formItemStyle}>
                  {getFieldDecorator('permissionTimeType')(
                    <Select placeholder="有效期判断" allowClear>
                      {validateDict.map(({ key, label }) => (
                        <Select.Option key={key} value={key}>
                          {label}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
            )}
            {tabActiveKey === '1' && (
              <Col {...colWrapper}>
                <FormItem {...formItemStyle}>
                  {getFieldDecorator('passTimeType')(
                    <Select placeholder="准入时间判断" allowClear>
                      {accessDict.map(({ key, label }) => (
                        <Select.Option key={key} value={key}>
                          {label}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
            )}
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                <Button
                  style={{ marginRight: '10px' }}
                  type="primary"
                  onClick={() => this.handleQuery()}
                >
                  查询
                </Button>
                <Button style={{ marginRight: '10px' }} onClick={this.handleReset}>
                  重置
                </Button>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Card>
    );
  };

  // 渲染列表
  renderList = () => {
    const {
      loading,
      realNameCertification: {
        identification: {
          list,
          pagination: { pageNum = 1, pageSize = 10, total = 0 },
        },
        livingBodyDict,
        deviceTypeDict,
        identificationDict,
        validateDict,
        accessDict,
      },
    } = this.props;
    const columns = [
      {
        title: '姓名',
        dataIndex: 'personName',
        align: 'center',
        width: 150,
      },
      {
        title: '识别时间',
        dataIndex: 'createTime',
        align: 'center',
        width: 200,
        render: val => (val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : ''),
      },
      {
        title: '抓拍照片',
        dataIndex: 'photoUrl',
        align: 'center',
        width: 180,
        render: val =>
          val ? (
            <img
              onClick={() => {
                this.setState({ images: [val] });
              }}
              style={{ width: '50px', height: '50px', objectFit: 'contain', cursor: 'pointer' }}
              src={val}
              alt="照片"
            />
          ) : null,
      },
      {
        title: '人员编号(GUID)',
        dataIndex: 'personGuid',
        align: 'center',
        width: 200,
      },
      // {
      //   title: '设备名称',
      //   dataIndex: 'deviceName',
      //   align: 'center',
      //   width: 200,
      // },
      {
        title: '设备类型',
        dataIndex: 'deviceType',
        align: 'center',
        width: 180,
        render: val => {
          const target = deviceTypeDict.find(item => +item.key === +val);
          return target ? target.label : '';
        },
      },
      {
        title: '设备序列号',
        dataIndex: 'deviceKey',
        align: 'center',
        width: 200,
      },
      {
        title: '识别模式',
        dataIndex: 'recMode',
        align: 'center',
        width: 200,
        render: val => {
          const target = identificationDict.find(item => +item.key === +val);
          return target ? target.label : '';
        },
      },
      {
        title: '活体',
        dataIndex: 'aliveType',
        align: 'center',
        width: 200,
        render: val => {
          const target = livingBodyDict.find(item => +item.key === +val);
          return target ? (
            <span style={{ color: target.color || 'inherit' }}>{target.label}</span>
          ) : (
              ''
            );
        },
      },
      {
        title: '人员权限',
        dataIndex: 'type',
        align: 'center',
        width: 150,
        render: val => (+val === 1 ? '已授权' : '未授权'),
      },
      {
        title: '有效期',
        dataIndex: 'permissionTimeType',
        align: 'center',
        width: 150,
        render: val => {
          const target = validateDict.find(item => +item.key === +val);
          return target ? (
            <span style={{ color: target.color || 'inherit' }}>{target.label}</span>
          ) : (
              ''
            );
        },
      },
      {
        title: '准入时间',
        dataIndex: 'passTimeType',
        align: 'center',
        width: 150,
        render: val => {
          const target = accessDict.find(item => +item.key === +val);
          return target ? (
            <span style={{ color: target.color || 'inherit' }}>{target.label}</span>
          ) : (
              ''
            );
        },
      },
    ];
    return list && list.length ? (
      <Card style={{ marginTop: '24px' }}>
        <Table
          rowKey="id"
          loading={loading}
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
      </Card>
    ) : (
        <div style={{ marginTop: '16px', textAlign: 'center' }}>暂无数据</div>
      );
  };

  render () {
    const {
      companyLoading,
      resourceManagement: { companyList },
      user: { isCompany },
    } = this.props;
    const { tabActiveKey, images, currentImage, visible, company } = this.state;
    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
        tabList={tabList}
        tabActiveKey={tabActiveKey}
        onTabChange={this.handleTabChange}
        content={!isCompany && (
          <div>
            <Input
              disabled
              style={{ width: '300px' }}
              placeholder={'请选择单位'}
              value={company.name}
            />
            <Button type="primary" style={{ marginLeft: '5px' }} onClick={this.handleViewCompanyModal}>
              选择单位
              </Button>
          </div>
        )}
      >
        {company && company.id ? (
          <div>
            {this.renderFilter()}
            {this.renderList()}
          </div>
        ) : (<div style={{ textAlign: 'center' }}>请先选择单位</div>)}
        {/* 图片查看 */}
        <ImagePreview images={images} currentImage={currentImage} />
        <CompanyModal
          title="选择单位"
          loading={companyLoading}
          visible={visible}
          modal={companyList}
          fetch={this.fetchCompanyList}
          onSelect={this.handleSelectCompany}
          onClose={() => { this.setState({ visible: false }) }}
        />
      </PageHeaderLayout>
    );
  }
}
