import React, { PureComponent } from 'react';
import { Form, Icon as LegacyIcon } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { List, Card, Button, Input, message, BackTop, Spin, Col, Row, Select, Modal } from 'antd';
// import router from 'umi/router';
import { connect } from 'dva';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
// import InfiniteScroll from 'react-infinite-scroller';
import moment from 'moment';
import QRCode from 'qrcode.react';

import styles from './index.less';
// import Ellipsis from '@/components/Ellipsis';
import codesMap from '@/utils/codes';
import Qrcode from './qrcode.png';
import { hasAuthority, AuthButton, AuthLink } from '@/utils/customAuth';

const { confirm } = Modal;
const FormItem = Form.Item;
const { Option } = Select;

// 默认页面显示数量
const pageSize = 18;

// 默认表单值
const defaultFormData = {
  objectTitle: undefined,
  riskLevel: undefined,
  checkStatus: undefined,
  hasHiddenDanger: undefined,
  l: undefined,
  e: undefined,
  c: undefined,
  riskValue: undefined,
};

// 获取无数据
const getEmptyData = () => {
  return <span style={{ color: 'rgba(0,0,0,0.45)' }}>暂无数据</span>;
};

// 获取root下的div
const getRootChild = () => document.querySelector('#root>div');

const breadcrumbList = [
  { title: '首页', name: '首页', href: '/' },
  { title: '风险管控', name: '风险管控' },
  {
    title: '企业网格点管理',
    name: '企业网格点管理',
    href: '/risk-control/grid-point-manage/index',
  },
  { title: '单位网格点', name: '单位网格点' },
];

@connect(({ riskPointManage, user, loading }) => ({
  user,
  riskPointManage,
  loading: loading.models.riskPointManage,
}))
@Form.create()
export default class GridPointList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showImg: false, // 二维码是否可见
      qrCode: '', // 当前二维码
    };
  }

  /**
   * 挂载后
   */
  componentDidMount() {
    const {
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;
    dispatch({
      type: 'riskPointManage/fetchGridList',
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
    const data = getFieldsValue();
    // 修改表单数据
    this.formData = data;
    dispatch({
      type: 'riskPointManage/fetchGridList',
      payload: {
        pageSize,
        pageNum: 1,
        ...data,
        companyId: id,
      },
    });
  };

  // 重置
  handleClickToReset = () => {
    const {
      form: { resetFields },
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;
    // 清除筛选条件
    resetFields();
    // 修改表单数据
    this.formData = defaultFormData;
    dispatch({
      type: 'riskPointManage/fetchGridList',
      payload: {
        pageSize,
        pageNum: 1,
        companyId: id,
      },
    });
  };

  // 查看二维码
  handleShowModal = qrCode => {
    this.setState({ showImg: true, qrCode: qrCode });
  };

  handleCloseImg = () => {
    this.setState({ showImg: false });
  };

  handleShowDeleteConfirm = id => {
    const {
      dispatch,
      location: {
        query: { companyId },
      },
    } = this.props;
    confirm({
      title: '提示信息',
      content: '是否删除该网格点',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        dispatch({
          type: 'riskPointManage/fetchGridPointDelete',
          payload: {
            ids: id,
          },
          success: () => {
            dispatch({
              type: 'riskPointManage/fetchGridList',
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
      },
    });
  };
  /* 渲染form表单 */
  renderForm() {
    const {
      form: { getFieldDecorator },
      riskPointManage: {
        checkStatusList,
        // GridListData: { list = [] },
      },
      user: {
        currentUser: { permissionCodes: codes },
      },
      match: {
        params: { id },
      },
      location: {
        query: { companyName },
      },
    } = this.props;
    return (
      <Card>
        <Form layout="inline">
          <FormItem>
            {getFieldDecorator('objectTitle', {
              initialValue: defaultFormData.objectTitle,
              getValueFromEvent: e => e.target.value.trim(),
            })(<Input placeholder="请输入检查点名称" />)}
          </FormItem>
          <FormItem>
            {getFieldDecorator('checkStatus', {
              initialValue: defaultFormData.checkStatus,
            })(
              <Select
                placeholder="检查状态"
                getPopupContainer={getRootChild}
                allowClear
                dropdownStyle={{ zIndex: 50 }}
                style={{ width: 180 }}
              >
                {checkStatusList.map(({ key, value }) => (
                  <Option value={key} key={key}>
                    {value}
                  </Option>
                ))}
              </Select>
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
          <FormItem style={{ float: 'right' }}>
            <AuthButton
              code={codesMap.riskControl.gridPointManage.add}
              codes={codes}
              type="primary"
              href={`#/risk-control/grid-point-manage/grid-point-add?companyId=${id}&companyName=${companyName}`}
            >
              新增
            </AuthButton>
          </FormItem>
        </Form>
      </Card>
    );
  }

  /* 渲染列表 */
  renderList() {
    const {
      user: {
        currentUser: { permissionCodes: codes },
      },
      riskPointManage: {
        GridListData: { list = [] },
      },
      match: {
        params: { id: companyId },
      },
      location: {
        query: { companyName },
      },
    } = this.props;

    return (
      <div className={styles.cardList} style={{ margin: '24px 0 0 0' }}>
        <List
          rowKey="itemId"
          grid={{ gutter: 24, column: 3, lg: 3, md: 2, sm: 1, xs: 1 }}
          dataSource={list}
          renderItem={item => {
            const {
              itemId,
              objectTitle,
              checkStatusDesc,
              locationCode,
              lastCheckDate,
              qrCode,
            } = item;
            return (
              <List.Item key={itemId}>
                <Card
                  title={objectTitle}
                  className={styles.card}
                  actions={[
                    <AuthLink
                      code={codesMap.riskControl.gridPointManage.edit}
                      codes={codes}
                      to={`/risk-control/grid-point-manage/grid-point-edit/${itemId}?companyId=${companyId}&companyName=${companyName}`}
                      target="_blank"
                    >
                      编辑
                    </AuthLink>,
                    <AuthLink
                      code={codesMap.riskControl.gridPointManage.detailView}
                      codes={codes}
                      to={`/risk-control/grid-point-manage/grid-point-detail/${itemId}?companyId=${companyId}&companyName=${companyName}`}
                      target="_blank"
                    >
                      查看
                    </AuthLink>,
                  ]}
                  extra={
                    <AuthButton
                      code={codesMap.riskControl.gridPointManage.delete}
                      codes={codes}
                      onClick={() => {
                        this.handleShowDeleteConfirm(itemId);
                      }}
                      shape="circle"
                      style={{
                        border: 'none',
                        fontSize: '16px',
                        position: 'absolute',
                        right: '8px',
                        top: '12px',
                      }}
                    >
                      <LegacyIcon type="close" />
                    </AuthButton>
                  }
                >
                  <Row>
                    <Col span={18}>
                      <p>
                        位置编号：
                        {locationCode || getEmptyData()}
                      </p>
                      <p>
                        检查状态：
                        {checkStatusDesc || getEmptyData()}
                      </p>
                      <p>
                        上次检查时间：
                        {lastCheckDate
                          ? moment(lastCheckDate).format('YYYY-MM-DD HH:mm:ss')
                          : '未检查'}
                      </p>
                    </Col>
                    <Col
                      span={6}
                      onClick={() => {
                        if (hasAuthority(codesMap.riskControl.riskPointManage.view, codes))
                          this.handleShowModal(qrCode);
                        else message.warn('您没有权限访问对应页面');
                      }}
                      style={{ cursor: 'pointer', padding: '7px 4px', textAlign: 'center' }}
                    >
                      <span>
                        <img src={Qrcode} alt="" width={45} height={45} />
                        <p>查看二维码</p>
                      </span>
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

  // 渲染页面
  render() {
    const {
      // loading,
      // riskPointManage: { isLast },
      location: {
        query: { companyName },
      },
    } = this.props;

    const { showImg, qrCode } = this.state;

    return (
      <PageHeaderLayout
        className={styles.header}
        title="单位网格点"
        breadcrumbList={breadcrumbList}
        content={
          <div>
            <span>{companyName}</span>
            {/* <span style={{ paddingLeft: 15 }}>
              网格点总数：
            </span> */}
          </div>
        }
      >
        <BackTop />
        {this.renderForm()}
        {this.renderList()}
        <div
          className={styles.magnify}
          style={{ display: showImg ? 'block' : 'none', position: 'absolute' }}
          onClick={this.handleCloseImg}
        >
          <LegacyIcon type="close" onClick={this.handleCloseImg} className={styles.iconClose} />
          <QRCode
            className={styles.qrcode}
            size={200}
            value={qrCode}
            onClick={e => e.stopPropagation()}
          />
        </div>
      </PageHeaderLayout>
    );
  }
}
