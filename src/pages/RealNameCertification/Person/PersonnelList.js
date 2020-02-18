import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Form,
  Card,
  Button,
  Modal,
  BackTop,
  Spin,
  Col,
  Row,
  Select,
  message,
  Table,
  Divider,
  Input,
} from 'antd';
import { Link } from 'dva/router';
import Ellipsis from '@/components/Ellipsis';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import codes from '@/utils/codes';
import { hasAuthority } from '@/utils/customAuth';
import router from 'umi/router';
import { stringify } from 'qs';

const FormItem = Form.Item;
const { Option } = Select;

const title = '人员列表';
const defaultPageSize = 18;
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
    title: '人员管理',
    name: '人员管理',
    href: '/real-name-certification/personnel-management/company-list',
  },
  {
    title,
    name: title,
  },
];
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 },
};

// @connect(({ personnelInfo, hiddenDangerReport, user, loading }) => ({
//   personnelInfo,
//   hiddenDangerReport,
//   user,
//   formLoading: loading.models.personnelInfo,
// }))
@Form.create()
export default class PersonnelList extends PureComponent {

  // componentDidMount() {

  // }

  // 查询列表
  handleQuery = (pageNum = 1, pageSize = defaultPageSize) => {
    const { from: { getFieldsValue } } = this.props;
    const values = getFieldsValue();
    console.log('query', values);
  }


  // 渲染筛选栏
  renderFilter = () => {
    const {
      formLoading: loading,
      form: { getFieldDecorator },
      match: { params: { companyId } },
    } = this.props;
    return (
      <Card>
        <Form>
          <Row gutter={16}>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                {getFieldDecorator('personType')(
                  <Select placeholder="人员类型">
                    {['员工', '外协人员', '临时人员'].map(item => (
                      <Option key={item} value={item}>{item}</Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                {getFieldDecorator('name')(
                  <Input placeholder="姓名" />
                )}
              </FormItem>
            </Col>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                {getFieldDecorator('telephone')(
                  <Input placeholder="电话" />
                )}
              </FormItem>
            </Col>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                {getFieldDecorator('duty')(
                  <Input placeholder="职务" />
                )}
              </FormItem>
            </Col>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                {getFieldDecorator('icnumber')(
                  <Input placeholder="IC卡号" />
                )}
              </FormItem>
            </Col>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                <Button style={{ marginRight: '10px' }} type="primary" onClick={() => this.handleQuery()}>
                  查询
                </Button>
                <Button style={{ marginRight: '10px' }} onClick={this.handleReset}>
                  重置
                </Button>
                <Button type="primary" onClick={() => { router.push(`/real-name-certification/personnel-management/add?${stringify({ companyId })}`) }}>
                  新增人员
                </Button>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Card>
    )
  }

  // 渲染列表
  renderList = () => {
    const pageNum = 1, pageSize = 10, total = 1;
    const list = [
      {
        id: '001',
        companyId: '123',
        companyName: '常熟市鑫博伟针纺织有限公司',
        telephone: '13815208877',
        name: '张三',
        sex: '男',
        remark: '',
        duty: '员工',
        icnumber: '1919E11F0009',
      },
    ];
    const columns = [
      {
        title: '姓名',
        dataIndex: 'name',
        align: 'center',
        width: 200,
      },
      {
        title: '性别',
        dataIndex: 'sex',
        align: 'center',
        width: 150,
      },
      {
        title: '电话',
        dataIndex: 'telephone',
        align: 'center',
        width: 200,
      },
      {
        title: '职务',
        dataIndex: 'duty',
        align: 'center',
        width: 150,
      },
      {
        title: 'IC卡号',
        dataIndex: 'icnumber',
        align: 'center',
        width: 200,
      },
      {
        title: '操作',
        key: '操作',
        align: 'center',
        width: 200,
        fixed: 'right',
        render: (val, record) => (
          <Fragment>
            <a>编辑</a>
            <Divider type="vertical" />
            <a>删除</a>
          </Fragment>
        ),
      },
    ];
    return (
      <Card style={{ marginTop: '24px' }}>
        <Table
          rowKey="id"
          // loading={loading}
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
    )
  }

  render() {

    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
        content={
          <div>
            <span>
              单位总数：
              {0}
            </span>
            <span style={{ paddingLeft: 20 }}>
              人员总数:
              <span style={{ paddingLeft: 8 }}>{0}</span>
            </span>
            <Button type="primary" style={{ float: 'right' }}>批量导入照片</Button>
            <Button type="primary" style={{ float: 'right', marginRight: '10px' }}>批量导入</Button>
          </div>
        }
      >
        <BackTop />
        {this.renderFilter()}
        {/* <InfiniteScroll
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
        </InfiniteScroll> */}
        {this.renderList()}
      </PageHeaderLayout>
    )
  }
}