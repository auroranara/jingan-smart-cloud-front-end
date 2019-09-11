import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form,
  List,
  Card,
  Button,
  BackTop,
  Spin,
  Col,
  Row,
  Input,
  Popconfirm,
  Select,
  message,
} from 'antd';
import { Link } from 'dva/router';
import InfiniteScroll from 'react-infinite-scroller';
import { routerRedux } from 'dva/router';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import codes from '@/utils/codes';
import Ellipsis from '@/components/Ellipsis';
import styles from './VehicleList.less';
import { hasAuthority } from '@/utils/customAuth';
import pic from '../PersonnelInfo/pic.png';

const { Option } = Select;
const FormItem = Form.Item;

const title = '车辆基本信息';

// 权限代码
const {
  personnelManagement: {
    vehicleInfo: { add: addCode, edit: editCode, detail: detailCode, delete: deleteCode },
  },
} = codes;

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
    title: '企业列表',
    name: '企业列表',
    href: '/personnel-management/vehicle-info/company-list',
  },
  {
    title,
    name: '车辆基本信息',
  },
];

// 默认页面显示数量
const pageSize = 18;

const stateList = {
  1: '正常',
  2: '停用',
};

/* 获取无数据 */
const getEmptyData = () => {
  return <span style={{ color: 'rgba(0,0,0,0.45)' }}>暂无数据</span>;
};

@connect(({ personnelInfo, user, loading }) => ({
  personnelInfo,
  user,
  loading: loading.models.personnelInfo,
}))
@Form.create()
export default class VehicleList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false, // 企业模态框是否可见
    };
  }

  // 挂载后
  componentDidMount() {
    const {
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;
    // 获取单位列表
    dispatch({
      type: 'personnelInfo/fetchVehicleInfoList',
      payload: {
        companyId: id,
        pageSize,
        pageNum: 1,
      },
    });
  }

  // 查询
  handleClickToQuery = () => {
    const {
      form: { getFieldsValue },
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;
    const { carCompany, number, state } = getFieldsValue();
    const payload = {
      carCompany,
      number,
      state,
    };
    // 重新请求数据
    dispatch({
      type: 'personnelInfo/fetchVehicleInfoList',
      payload: {
        companyId: id,
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
      match: {
        params: { id },
      },
    } = this.props;
    // 清除筛选条件
    resetFields();
    // 重新请求数据
    dispatch({
      type: 'personnelInfo/fetchVehicleInfoList',
      payload: {
        companyId: id,
        pageSize,
        pageNum: 1,
      },
    });
  };

  // 滚动加载
  handleLoadMore = () => {
    const {
      dispatch,
      personnelInfo: { isLast, pageNum },
      match: {
        params: { id },
      },
    } = this.props;
    if (isLast) {
      return;
    }
    // 请求数据
    dispatch({
      type: 'personnelInfo/appendVehicleInfoList',
      payload: {
        companyId: id,
        pageSize,
        pageNum: pageNum + 1,
        ...this.formData,
      },
    });
  };

  // 新增
  handleClickAdd = () => {
    const {
      match: {
        params: { id },
      },
      dispatch,
    } = this.props;
    dispatch(routerRedux.push(`/personnel-management/vehicle-info/vehicle-add?listId=${id}`));
  };

  // 删除
  handleCardDelete = id => {
    const {
      dispatch,
      match: {
        params: { id: companyId },
      },
    } = this.props;
    dispatch({
      type: 'personnelInfo/fetchVehicleInfoDelete',
      payload: { ids: id },
      success: () => {
        // 获取列表
        dispatch({
          type: 'personnelInfo/fetchVehicleInfoList',
          payload: {
            pageSize,
            pageNum: 1,
            companyId,
          },
        });
        message.success('删除成功！');
      },
      error: () => {
        message.error('删除失败!');
      },
    });
  };

  // 渲染form表单
  renderForm() {
    const {
      form: { getFieldDecorator },
      user: {
        currentUser: { permissionCodes },
      },
      personnelInfo: { vehicleType },
    } = this.props;

    // 添加权限
    const addAuth = hasAuthority(addCode, permissionCodes);

    return (
      <Card className={styles.formCard}>
        <Form>
          <Row gutter={30}>
            <Col span={8}>
              <FormItem>
                {getFieldDecorator('carCompany')(<Input placeholder="请输入所属单位" />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem>
                {getFieldDecorator('number')(<Input placeholder="请输入车牌号" />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem>
                {getFieldDecorator('state')(
                  <Select placeholder="请选择状态" allowClear>
                    {vehicleType.map(({ key, value }) => (
                      <Option value={key} key={key}>
                        {value}
                      </Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem>
                <Button type="primary" onClick={this.handleClickToQuery}>
                  查询
                </Button>
                <Button onClick={this.handleClickToReset} style={{ marginLeft: '15px' }}>
                  重置
                </Button>
                <Button
                  disabled={!addAuth}
                  type="primary"
                  onClick={this.handleClickAdd}
                  style={{ marginLeft: '15px' }}
                >
                  新增车辆
                </Button>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Card>
    );
  }

  // 渲染列表
  renderList() {
    const {
      personnelInfo: {
        vehicleInfoData: { list = [] },
      },
      user: {
        currentUser: { permissionCodes },
      },
    } = this.props;

    const deleteAuth = hasAuthority(deleteCode, permissionCodes);
    const editAuth = hasAuthority(editCode, permissionCodes);
    const detailAuth = hasAuthority(detailCode, permissionCodes);

    return (
      <div className={styles.cardList} style={{ marginTop: '24px' }}>
        <List
          rowKey="id"
          grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
          dataSource={list}
          renderItem={item => {
            const {
              id,
              number,
              companyId,
              brand,
              model,
              driver,
              driverTel,
              state,
              photoDetails,
            } = item;
            return (
              <List.Item key={id}>
                <Card
                  className={styles.card}
                  actions={[
                    <Link
                      disabled={!detailAuth}
                      to={`/personnel-management/vehicle-info/vehicle-detail/${id}?listId=${companyId}`}
                      target="_blank"
                    >
                      查看
                    </Link>,
                    <Link
                      disabled={!editAuth}
                      to={`/personnel-management/vehicle-info/vehicle-edit/${id}?listId=${companyId}`}
                      target="_blank"
                    >
                      编辑
                    </Link>,
                    deleteAuth ? (
                      <Popconfirm
                        title="删除数据将无法恢复，是否继续？"
                        onConfirm={() => this.handleCardDelete(id)}
                      >
                        <span>删除</span>
                      </Popconfirm>
                    ) : (
                      <span style={{ color: '#bbb', cursor: 'auto' }}>删除</span>
                    ),
                  ]}
                >
                  <Row>
                    <Col span={10}>
                      <div
                        className={styles.imgConatiner}
                        style={{
                          background:
                            photoDetails.length > 0
                              ? `url(${photoDetails.map(
                                  item => item.webUrl
                                )}) center center / 100% 100% no-repeat`
                              : `url(${pic}) center center / 100% 100% no-repeat`,
                        }}
                      />
                    </Col>
                    <Col span={13}>
                      <div className={styles.cardTitle}>
                        <span className={styles.title}>
                          <Ellipsis tooltip length={9}>
                            {number}
                          </Ellipsis>
                        </span>
                        <span className={styles.titleLabel}>
                          {stateList[state] || getEmptyData()}
                        </span>
                      </div>
                      <div className={styles.line}>
                        <Ellipsis tooltip lines={1}>
                          品牌：
                          {brand || getEmptyData()}
                        </Ellipsis>
                      </div>
                      <div className={styles.line}>
                        <Ellipsis tooltip lines={1}>
                          型号：
                          {model || getEmptyData()}
                        </Ellipsis>
                      </div>
                      <div className={styles.line}>
                        <Ellipsis tooltip lines={1}>
                          驾驶员：
                          {driver || getEmptyData()}
                        </Ellipsis>
                      </div>
                      <div className={styles.line}>
                        <Ellipsis tooltip lines={1}>
                          联系电话：
                          {driverTel || getEmptyData()}
                        </Ellipsis>
                      </div>
                    </Col>
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
        vehicleInfoData: {
          pagination: { total },
        },
        isLast,
      },
    } = this.props;

    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
        content={
          <div>
            车辆总数：
            {total}
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
      </PageHeaderLayout>
    );
  }
}
