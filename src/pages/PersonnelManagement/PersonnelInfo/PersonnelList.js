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
import Ellipsis from '@/components/Ellipsis';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import codes from '@/utils/codes';
import styles from './PersonnelList.less';
import { hasAuthority } from '@/utils/customAuth';
import pic from './pic.png';

const { Option } = Select;
const FormItem = Form.Item;

// 权限代码
const {
  personnelManagement: {
    personnelInfo: { add: addCode, edit: editCode, detail: detailCode, delete: deleteCode },
  },
} = codes;

const sexList = {
  1: '男',
  2: '女',
};

const personList = {
  1: '员工',
  2: '外协人员',
  3: '临时人员',
};

const title = '人员基本信息';

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
    href: '/personnel-management/personnel-info/company-list',
  },
  {
    title,
    name: '人员基本信息',
  },
];

// 默认页面显示数量
const pageSize = 18;

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
export default class PersonnelList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // 挂载后
  componentDidMount() {
    const {
      dispatch,
      match: {
        params: { id: companyId },
      },
    } = this.props;
    // 获取人员列表
    dispatch({
      type: 'personnelInfo/fetchPersonInfoList',
      payload: {
        pageSize,
        pageNum: 1,
        companyId,
      },
    });
  }

  // 查询
  handleClickToQuery = () => {
    const {
      form: { getFieldsValue },
      dispatch,
      match: {
        params: { id: companyId },
      },
    } = this.props;
    const { personCompany, name, tel, duty, profession, personType } = getFieldsValue();
    const payload = {
      personCompany,
      name,
      tel,
      duty,
      profession,
      personType,
    };
    // 重新请求数据
    dispatch({
      type: 'personnelInfo/fetchPersonInfoList',
      payload: {
        companyId,
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
      match: {
        params: { id: companyId },
      },
      form: { resetFields },
    } = this.props;
    // 清除筛选条件
    resetFields();
    // 重新请求数据
    dispatch({
      type: 'personnelInfo/fetchPersonInfoList',
      payload: {
        companyId,
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
        params: { id: companyId },
      },
    } = this.props;
    if (isLast) {
      return;
    }
    // 请求数据
    dispatch({
      type: 'personnelInfo/appendPersonInfoList',
      payload: {
        companyId,
        pageSize,
        pageNum: pageNum + 1,
      },
    });
  };

  // 新增
  handleClickAdd = () => {
    const {
      match: {
        params: { id },
      },
      location: {
        query: { companyName },
      },
      dispatch,
    } = this.props;
    dispatch(
      routerRedux.push(
        `/personnel-management/personnel-info/personnel-add?listId=${id}&&companyName=${companyName}`
      )
    );
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
      type: 'personnelInfo/fetchPersonInfoDelete',
      payload: { ids: id },
      success: () => {
        // 获取列表
        dispatch({
          type: 'personnelInfo/fetchPersonInfoList',
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
      personnelInfo: { personnelTypeList },
    } = this.props;

    // 添加权限
    const addAuth = hasAuthority(addCode, permissionCodes);

    return (
      <Card className={styles.formCard}>
        <Form>
          <Row gutter={30}>
            {/* <Col span={8}>
              <FormItem>
                {getFieldDecorator('personCompany')(<Input placeholder="请输入所属单位" />)}
              </FormItem>
            </Col> */}
            <Col span={8}>
              <FormItem>{getFieldDecorator('name')(<Input placeholder="请输入姓名" />)}</FormItem>
            </Col>
            <Col span={8}>
              <FormItem>{getFieldDecorator('tel')(<Input placeholder="请输入电话" />)}</FormItem>
            </Col>
            <Col span={8}>
              <FormItem>{getFieldDecorator('duty')(<Input placeholder="请输入职务" />)}</FormItem>
            </Col>
            <Col span={8}>
              <FormItem>
                {getFieldDecorator('profession')(<Input placeholder="请输入工种" />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem>
                {getFieldDecorator('personType')(
                  <Select placeholder="请选择人员类型" allowClear>
                    {personnelTypeList.map(({ key, value }) => (
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
                  新增人员
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
        personnelInfoData: { list = [] },
      },
      user: {
        currentUser: { permissionCodes },
      },
      location: {
        query: { companyName },
      },
    } = this.props;

    const editAuth = hasAuthority(editCode, permissionCodes);
    const detailAuth = hasAuthority(detailCode, permissionCodes);
    const deleteAuth = hasAuthority(deleteCode, permissionCodes);

    return (
      <div className={styles.cardList} style={{ marginTop: '24px' }}>
        <List
          rowKey="id"
          grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
          dataSource={list}
          renderItem={item => {
            const {
              id,
              companyId,
              name,
              sex,
              tel,
              duty,
              personType,
              profession,
              photoDetails,
            } = item;
            return (
              <List.Item key={id}>
                <Card
                  className={styles.card}
                  actions={[
                    <Link
                      disabled={!editAuth}
                      to={`/personnel-management/personnel-info/personnel-detail/${id}?listId=${companyId}&&companyName=${companyName}`}
                      target="_blank"
                    >
                      查看
                    </Link>,
                    <Link
                      disabled={!detailAuth}
                      to={`/personnel-management/personnel-info/personnel-edit/${id}?listId=${companyId}&&companyName=${companyName}`}
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
                      <span style={{ color: 'rgba(0, 0, 0, 0.25)', cursor: 'default' }}>删除</span>
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
                        <span className={styles.title}>{name || getEmptyData()}</span>
                        <span className={styles.titleLabel}>
                          {personList[personType] || getEmptyData()}
                        </span>
                      </div>
                      <div className={styles.line}>
                        性别：
                        {sexList[sex] || getEmptyData()}
                      </div>
                      <div className={styles.line}>
                        电话：
                        {tel || getEmptyData()}
                      </div>
                      <div className={styles.line}>
                        <Ellipsis tooltip lines={1}>
                          单位：
                          {companyName || getEmptyData()}
                        </Ellipsis>
                      </div>
                      <div className={styles.line}>
                        职务：
                        {duty || getEmptyData()}
                      </div>
                      <div className={styles.line}>
                        工种：
                        {profession || getEmptyData()}
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
        personnelInfoData: {
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
            人员总数：
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
