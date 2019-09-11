import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form,
  List,
  Card,
  Button,
  Modal,
  BackTop,
  Spin,
  Col,
  Row,
  Select,
  AutoComplete,
  message,
} from 'antd';
import { Link } from 'dva/router';
import debounce from 'lodash/debounce';
import InfiniteScroll from 'react-infinite-scroller';
import Ellipsis from '@/components/Ellipsis';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import codes from '@/utils/codes';
import { routerRedux } from 'dva/router';
import styles from './CompanyList.less';
import { hasAuthority } from '@/utils/customAuth';

// 权限代码
const {
  personnelManagement: {
    vehicleInfo: { view: viewCode, addCompany: addCode },
  },
} = codes;

const FormItem = Form.Item;
const { Option } = Select;

const title = '车辆基本信息';

//面包屑
const breadcrumbList = [
  {
    title: '首页',
    name: '首页',
    href: '/',
  },
  {
    title: '人员在岗在位管理',
    name: '人员在岗在位管理',
  },
  {
    title,
    name: '车辆基本信息',
  },
];

// 默认页面显示数量
const pageSize = 18;

// 默认表单值
const defaultFormData = {
  companyName: undefined,
};

// 获取无数据
const getEmptyData = () => {
  return <span style={{ color: 'rgba(0,0,0,0.45)' }}>暂无数据</span>;
};

@connect(({ personnelInfo, hiddenDangerReport, user, loading }) => ({
  personnelInfo,
  hiddenDangerReport,
  user,
  loading: loading.models.personnelInfo,
}))
@Form.create()
export default class CompanyList extends PureComponent {
  constructor(props) {
    super(props);
    this.formData = defaultFormData;
    this.handleUnitIdChange = debounce(this.handleUnitIdChange, 800);
    this.state = {
      modalVisible: false, // 企业模态框是否可见
    };
  }

  // 挂载后
  componentDidMount() {
    const { dispatch } = this.props;
    // 获取单位列表
    dispatch({
      type: 'personnelInfo/fetchVehicleCompanyList',
      payload: {
        pageSize,
        pageNum: 1,
      },
    });

    // 获取模糊搜索单位列表
    dispatch({
      type: 'hiddenDangerReport/fetchUnitListFuzzy',
    });
  }

  // 查询
  handleClickToQuery = () => {
    const {
      form: { getFieldsValue },
      dispatch,
    } = this.props;
    const { company_id } = getFieldsValue();
    const payload = {
      companyId: company_id,
    };
    // 重新请求数据
    dispatch({
      type: 'personnelInfo/fetchVehicleCompanyList',
      payload: {
        pageSize,
        pageNum: 1,
        ...payload,
      },
    });
  };

  // 重置
  handleClickToReset = () => {
    const {
      dispatch,
      form: { resetFields },
    } = this.props;
    // 清除筛选条件
    resetFields();
    // 重新请求数据
    dispatch({
      type: 'personnelInfo/fetchVehicleCompanyList',
      payload: {
        pageSize,
        pageNum: 1,
      },
    });
    // 获取模糊搜索单位列表
    dispatch({
      type: 'hiddenDangerReport/fetchUnitListFuzzy',
    });
  };

  // 滚动加载
  handleLoadMore = () => {
    const {
      dispatch,
      personnelInfo: { isLast },
    } = this.props;
    if (isLast) {
      return;
    }
    const {
      personnelInfo: { pageNum },
    } = this.props;
    // 请求数据
    dispatch({
      type: 'personnelInfo/appendVehicleCompanyList',
      payload: {
        pageSize,
        pageNum: pageNum + 1,
        ...this.formData,
      },
    });
  };

  // 显示新增企业模态框
  handleClickAdd = () => {
    const {
      dispatch,
      form: { setFieldsValue },
    } = this.props;
    this.setState({ modalVisible: true });
    setFieldsValue({
      companyId: undefined,
    });
    // 获取模糊搜索单位列表
    dispatch({
      type: 'hiddenDangerReport/fetchUnitListFuzzy',
    });
  };

  // 单位下拉框输入
  handleUnitIdChange = value => {
    const { dispatch } = this.props;

    // 根据输入值获取列表
    dispatch({
      type: 'hiddenDangerReport/fetchUnitListFuzzy',
      payload: {
        unitName: value && value.trim(),
        pageNum: 1,
        pageSize: 10,
      },
    });
  };

  // 单位下拉框失焦
  handleUnitIdBlur = value => {
    const {
      dispatch,
      form: { setFieldsValue },
    } = this.props;
    // 根据value判断是否是手动输入
    if (value && value.key === value.label) {
      this.handleUnitIdChange.cancel();
      setFieldsValue({
        companyId: undefined,
      });
      dispatch({
        type: 'hiddenDangerReport/fetchUnitListFuzzy',
        payload: {
          pageNum: 1,
          pageSize: 18,
        },
      });
    }
  };

  // 关闭新增企业模态框
  handleCloseModal = () => {
    this.setState({ modalVisible: false });
  };

  // 提交
  handleSubmit = () => {
    const {
      form: { validateFieldsAndScroll },
      dispatch,
    } = this.props;

    validateFieldsAndScroll((error, values) => {
      if (!error) {
        const { companyId } = values;
        dispatch(
          routerRedux.push(
            `/personnel-management/vehicle-info/vehicle-add?companyId=${companyId.key}`
          )
        );
      }
    });
  };

  // 渲染form表单
  renderForm() {
    const {
      loading,
      form: { getFieldDecorator },
      hiddenDangerReport: { unitIdes },
      user: {
        currentUser: { permissionCodes },
      },
    } = this.props;

    // 添加权限
    const addAuth = hasAuthority(addCode, permissionCodes);

    return (
      <Card>
        <Form layout="inline">
          <FormItem>
            {getFieldDecorator('company_id')(
              <AutoComplete
                allowClear
                mode="combobox"
                optionLabelProp="children"
                placeholder="请选择单位"
                notFoundContent={loading ? <Spin size="small" /> : '暂无数据'}
                onSearch={this.handleUnitIdChange}
                filterOption={false}
                style={{ width: '300px' }}
              >
                {unitIdes.map(({ id, name }) => (
                  <Option value={id} key={id}>
                    {name}
                  </Option>
                ))}
              </AutoComplete>
            )}
          </FormItem>
          <FormItem>
            <Button type="primary" onClick={this.handleClickToQuery}>
              查询
            </Button>
          </FormItem>
          <FormItem>
            <Button onClick={this.handleClickToReset}>重置</Button>
          </FormItem>
          <FormItem>
            <Button disabled={!addAuth} type="primary" onClick={this.handleClickAdd}>
              新增单位车辆
            </Button>
          </FormItem>
        </Form>
      </Card>
    );
  }

  // 渲染列表
  renderList() {
    const {
      personnelInfo: {
        vehicleData: { list = [] },
      },
      user: {
        currentUser: { permissionCodes },
      },
    } = this.props;

    // 添加权限
    const viewAuth = hasAuthority(viewCode, permissionCodes);

    return (
      <div className={styles.cardList} style={{ marginTop: '24px' }}>
        <List
          rowKey="id"
          grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
          dataSource={list}
          renderItem={item => {
            const {
              company_id,
              company_name,
              num,
              companyMessage: {
                practicalProvinceLabel,
                practicalCityLabel,
                practicalDistrictLabel,
                practicalTownLabel,
                practicalAddress,
                safetyName,
                safetyPhone,
                // name,
              },
            } = item;
            const practicalAddressLabel =
              (practicalProvinceLabel || '') +
              (practicalCityLabel || '') +
              (practicalDistrictLabel || '') +
              (practicalTownLabel + '') +
              (practicalAddress || '');
            return (
              <List.Item key={company_id}>
                <Card title={company_name} className={styles.card}>
                  <Row>
                    <Col span={18}>
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

                    {viewAuth ? (
                      <Col span={6} style={{ cursor: 'pointer' }}>
                        <Link
                          to={`/personnel-management/vehicle-info/vehicle-list/${company_id}`}
                          target="_blank"
                        >
                          <span className={styles.quantity}>{num}</span>
                        </Link>
                      </Col>
                    ) : (
                      <Col
                        span={6}
                        onClick={() => {
                          message.warn('您没有权限访问对应页面');
                        }}
                        style={{ cursor: 'pointer' }}
                      >
                        <span className={styles.quantity}>{num}</span>
                      </Col>
                    )}
                  </Row>
                </Card>
              </List.Item>
            );
          }}
        />
      </div>
    );
  }

  render() {
    const {
      loading,
      personnelInfo: {
        vehicleData: {
          list,
          pagination: { total },
        },
        isLast,
      },
      form: { getFieldDecorator },
      hiddenDangerReport: { unitIdes },
    } = this.props;

    const { modalVisible } = this.state;

    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 16 },
    };

    const carTotal = list.reduce((prev, cur) => {
      prev = prev + cur.num;
      return prev;
    }, 0);

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
            <span style={{ paddingLeft: 20 }}>
              车辆总数:
              <span style={{ paddingLeft: 8 }}>{carTotal}</span>
            </span>
          </div>
        }
      >
        <BackTop />
        {this.renderForm()}
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
          onCancel={this.handleCloseModal}
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
                  onSearch={this.handleUnitIdChange}
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
