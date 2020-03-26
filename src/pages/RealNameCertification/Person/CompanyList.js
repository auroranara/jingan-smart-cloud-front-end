import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import {
  List,
  Card,
  Button,
  Modal,
  BackTop,
  Spin,
  Col,
  Row,
  Select,
  Input,
  AutoComplete,
} from 'antd';
import { Link } from 'dva/router';
import debounce from 'lodash/debounce';
import InfiniteScroll from 'react-infinite-scroller';
import Ellipsis from '@/components/Ellipsis';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import codes from '@/utils/codes';
import styles from './CompanyList.less';
import { AuthButton } from '@/utils/customAuth';
import router from 'umi/router';

const {
  realNameCertification: {
    personnelManagement: { add: addCode },
  },
} = codes;

const FormItem = Form.Item;
const { Option } = Select;

const title = '人员管理';
const defaultPageSize = 18;

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
    name: '人员管理',
  },
];
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 },
};

// 无数据
const getEmptyData = () => {
  return <span style={{ color: 'rgba(0,0,0,0.45)' }}>暂无数据</span>;
};

@connect(({ realNameCertification, hiddenDangerReport, user, loading }) => ({
  realNameCertification,
  hiddenDangerReport,
  user,
  loading: loading.effects['realNameCertification/fetchCompanyList'],
}))
@Form.create()
export default class CompanyList extends PureComponent {
  constructor(props) {
    super(props);
    this.onUnitChange = debounce(this.onUnitChange, 800);
    this.state = {
      modalVisible: false, // 企业模态框是否可见
      scrollPage: 1,
    };
  }

  componentDidMount() {
    const {
      user: {
        isCompany,
        currentUser: { companyId },
      },
    } = this.props;
    if (isCompany) {
      router.replace(`/real-name-certification/personnel-management/person-list/${companyId}`);
      return;
    }
    this.handleQuery();
  }

  // 查询列表
  handleQuery = (payload = { pageNum: 1, pageSize: defaultPageSize }) => {
    const {
      dispatch,
      form: { getFieldsValue },
    } = this.props;
    const values = getFieldsValue();
    dispatch({
      type: 'realNameCertification/fetchCompanyList',
      payload: { ...payload, ...values },
    });
  };

  handleLoadMore = () => {
    const {
      realNameCertification: {
        company: {
          pagination: { pageNum, pageSize },
          isLast,
        },
      },
    } = this.props;
    if (isLast) return;
    this.handleQuery({ pageNum: pageNum + 1, pageSize });
  };

  handleReset = () => {
    const {
      form: { resetFields },
    } = this.props;
    resetFields();
    this.handleQuery();
  };

  // 单位下拉框输入
  onUnitChange = value => {
    // 根据输入值获取列表
    this.fetchUnitList({ unitName: value && value.trim() });
  };

  // 获取筛选用单位列表
  fetchUnitList = (payload = {}) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'hiddenDangerReport/fetchUnitListFuzzy',
      payload: {
        ...payload,
        pageNum: 1,
        pageSize: 18,
      },
    });
  };

  // 单位下拉框失焦
  handleUnitIdBlur = value => {
    const {
      form: { setFieldsValue },
    } = this.props;
    // 根据value判断是否是手动输入
    if (value && value.key === value.label) {
      this.onUnitChange.cancel();
      setFieldsValue({
        companyId: undefined,
      });
      this.fetchUnitList();
    }
  };

  // 提交新增
  handleSubmit = () => {
    const {
      form: { validateFields },
    } = this.props;
    validateFields((err, values) => {
      if (err) return;
      const { companyId } = values;
      if (companyId && companyId.key && companyId.key !== companyId.label) {
        router.push({
          pathname: '/real-name-certification/personnel-management/add',
          query: { companyId: companyId.key },
        });
      } else this.handleUnitIdBlur(companyId);
    });
  };

  // 打开新增人员modal
  handleViewAdd = () => {
    this.setState({ modalVisible: true });
    // 获取模糊搜索单位列表
    this.fetchUnitList();
  };

  // 渲染筛选栏
  renderFilter = () => {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Card>
        <Form>
          <Row gutter={16}>
            <Col lg={8} md={12} sm={24} xs={24}>
              <FormItem style={{ margin: '0', padding: '4px 0' }}>
                {getFieldDecorator('companyName')(<Input placeholder="单位名称" />)}
              </FormItem>
            </Col>
            <Col lg={8} md={12} sm={24} xs={24}>
              <FormItem style={{ margin: '0', padding: '4px 0' }}>
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
                <AuthButton code={addCode} type="primary" onClick={this.handleViewAdd}>
                  新增单位人员
                </AuthButton>
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
      realNameCertification: {
        company: { list = [] },
      },
    } = this.props;
    // const list = [
    //   {
    //     companyId: '123',
    //     companyName: '常熟市鑫博伟针纺织有限公司',
    //     phone: '13815208877',
    //     name: '张三',
    //     num: '20',
    //     address: '常熟市朝阳区北京路1号',
    //   },
    // ];
    return (
      <div className={styles.cardList} style={{ marginTop: '24px' }}>
        <List
          rowKey="companyId"
          grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
          dataSource={list}
          renderItem={item => {
            const {
              companyId,
              count = 0,
              companyMessage: {
                name,
                safetyName,
                safetyPhone,
                practicalProvinceLabel,
                practicalCityLabel,
                practicalDistrictLabel,
                practicalTownLabel,
                practicalAddress,
              },
            } = item;
            const practicalAddressLabel =
              (practicalProvinceLabel || '') +
              (practicalCityLabel || '') +
              (practicalDistrictLabel || '') +
              (practicalTownLabel + '') +
              (practicalAddress || '');
            return (
              <List.Item key={companyId}>
                <Card title={name} className={styles.card}>
                  <Row>
                    <Col span={16}>
                      <Ellipsis tooltip lines={1} className={styles.ellipsisText}>
                        地址：
                        {practicalAddressLabel.replace('null', '') || getEmptyData()}
                      </Ellipsis>
                      <Ellipsis tooltip lines={1} className={styles.ellipsisText}>
                        安全负责人：
                        {safetyName || getEmptyData()}
                      </Ellipsis>
                      <p>
                        联系电话：
                        {safetyPhone || getEmptyData()}
                      </p>
                    </Col>

                    <Col span={8} style={{ cursor: 'pointer' }}>
                      <Link
                        to={`/real-name-certification/personnel-management/person-list/${companyId}?companyName=${name}`}
                        target="_blank"
                      >
                        <span className={styles.quantity}>{count}</span>
                      </Link>
                    </Col>
                  </Row>
                </Card>
              </List.Item>
            );
          }}
        />
      </div>
    );
  };

  render() {
    const {
      loading,
      form: { getFieldDecorator },
      hiddenDangerReport: { unitIdes },
      realNameCertification: {
        company: {
          isLast,
          pagination: { total },
        },
      },
    } = this.props;
    const { modalVisible } = this.state;
    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
        content={
          <div>
            <span>
              单位总数：
              {total}
            </span>
            {/* <span style={{ paddingLeft: 20 }}>
              人员总数:
              <span style={{ paddingLeft: 8 }}>{0}</span>
            </span> */}
          </div>
        }
      >
        <BackTop />
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
        <Modal
          title="添加单位"
          visible={modalVisible}
          onCancel={() => {
            this.setState({ modalVisible: false });
          }}
          onOk={this.handleSubmit}
        >
          <Form>
            <FormItem {...formItemLayout} label="单位名称">
              {getFieldDecorator('companyId', {
                rules: [
                  {
                    required: true,
                    transform: value => value && value.label,
                    message: '请选择单位名称',
                  },
                ],
              })(
                <AutoComplete
                  allowClear
                  mode="combobox"
                  labelInValue
                  optionLabelProp="children"
                  placeholder="请选择"
                  notFoundContent={loading ? <Spin size="small" /> : '暂无数据'}
                  onSearch={this.onUnitChange}
                  onBlur={this.handleUnitIdBlur}
                  filterOption={false}
                >
                  {unitIdes.map(({ id, name }) => (
                    <Option value={id} key={id}>
                      {name}
                    </Option>
                  ))}
                </AutoComplete>
              )}
            </FormItem>
          </Form>
        </Modal>
      </PageHeaderLayout>
    );
  }
}
