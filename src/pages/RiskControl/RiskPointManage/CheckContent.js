import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form,
  List,
  Card,
  Button,
  Radio,
  Input,
  Modal,
  message,
  BackTop,
  Spin,
  Col,
  Row,
  Select,
  Tabs,
  Icon,
  Tooltip,
} from 'antd';
import InfiniteScroll from 'react-infinite-scroller';

import QRCode from 'qrcode.react';
import styles from './CheckContent.less';
import codesMap from '@/utils/codes';
import { hasAuthority, AuthButton, AuthLink, AuthSpan } from '@/utils/customAuth';

const { confirm } = Modal;
const TabPane = Tabs.TabPane;
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

// 检查状态
const getStatus = status => {
  switch (+status) {
    case 1:
      return '待检查';
    case 2:
      return '已检查';
    case 3:
      return '已超时';
    default:
      break;
  }
};
const getCount = i => {
  switch (+i) {
    case 1:
      return '红';
    case 2:
      return '橙';
    case 3:
      return '黄';
    case 4:
      return '蓝';
    default:
      break;
  }
};

const getCountStatus = i => {
  switch (i) {
    case '红':
      return '1';
    case '橙':
      return '2';
    case '黄':
      return '3';
    case '蓝':
      return '4';
    default:
      break;
  }
};

const getCheckCycle = s => {
  switch (s) {
    case 'every_day':
      return '日检查点';
    case 'every_week':
      return '周检查点';
    case 'every_month':
      return '月检查点';
    case 'every_quarter':
      return '季度检查点';
    case 'every_half_year':
      return '半年检查点';
    case 'every_year':
      return '年检查点';
    default:
      break;
  }
};

@connect(({ riskPointManage, user, loading }) => ({
  riskPointManage,
  user,
  loading: loading.models.riskPointManage,
}))
@Form.create()
export default class CheckContent extends PureComponent {
  constructor(props) {
    super(props);
    this.formData = defaultFormData;
  }

  state = {
    showImg: false, // 二维码是否可见
    qrCode: '', // 当前二维码
    riskVisible: false, // 风险评估模态框是否可见
    activeKey: null,
    riskAssessId: '', // 风险评估对应ItemId
  };

  // 生命周期函数
  componentDidMount() {
    this.setState({ activeKey: '1' });
  }

  // 查询按钮点击事件
  handleClickToQuery = () => {
    const {
      form: { getFieldsValue },
      dispatch,
      companyId,
      tabActiveKey,
    } = this.props;
    const data = getFieldsValue();
    // 修改表单数据
    this.formData = data;
    if (tabActiveKey === 'all') {
      dispatch({
        type: 'riskPointManage/fetchRiskList',
        payload: {
          pageSize,
          pageNum: 1,
          ...data,
          companyId,
        },
      });
    } else {
      // 重新请求数据
      dispatch({
        type: 'riskPointManage/fetchRiskList',
        payload: {
          pageSize,
          pageNum: 1,
          ...data,
          companyId,
          realCheckCycle: tabActiveKey,
        },
      });
    }
  };

  // 重置按钮点击事件
  handleClickToReset = () => {
    const {
      dispatch,
      form: { resetFields },
      companyId,
      tabActiveKey,
    } = this.props;
    // 清除筛选条件
    resetFields();
    // 修改表单数据
    this.formData = defaultFormData;
    // 重新请求数据
    if (tabActiveKey === 'all') {
      dispatch({
        type: 'riskPointManage/fetchRiskList',
        payload: {
          pageSize,
          pageNum: 1,
          companyId,
        },
      });
    } else {
      // 重新请求数据
      dispatch({
        type: 'riskPointManage/fetchRiskList',
        payload: {
          pageSize,
          pageNum: 1,
          companyId,
          realCheckCycle: tabActiveKey,
        },
      });
    }
  };

  // 滚动加载
  handleLoadMore = () => {
    const {
      riskPointManage: { isLast, pageNum },
      companyId,
      tabActiveKey,
      dispatch,
    } = this.props;
    if (isLast) {
      return;
    }
    // 请求数据
    if (tabActiveKey === 'all') {
      dispatch({
        type: 'riskPointManage/appendRiskList',
        payload: {
          companyId,
          pageSize,
          pageNum: pageNum + 1,
          ...this.formData,
        },
      });
    } else {
      // 重新请求数据
      dispatch({
        type: 'riskPointManage/appendRiskList',
        payload: {
          companyId,
          realCheckCycle: tabActiveKey,
          pageSize,
          pageNum: pageNum + 1,
          ...this.formData,
        },
      });
    }
  };

  // 查看二维码
  handleShowModal = qrCode => {
    this.setState({ showImg: true, qrCode: qrCode });
  };

  handleCloseImg = () => {
    this.setState({ showImg: false });
  };

  // 显示风险评估告知卡模态框
  handleRiskModal = id => {
    this.setState({ riskVisible: true, riskAssessId: id });
  };

  // 关闭风险评估告知卡模态框
  handleCloseModal = () => {
    this.setState({ riskVisible: false });
  };

  // 风险评估Tab切换
  handleTabs = key => {
    this.setState({ activeKey: key });
  };

  // 计算风险值
  handleRadioChange = (item, name) => {
    const {
      form: { getFieldValue, setFieldsValue },
      dispatch,
    } = this.props;
    const {
      target: { value },
    } = item;

    const l = getFieldValue('l') || 1;
    const e = getFieldValue('e') || 1;
    const c = getFieldValue('c') || 1;
    const riskValue = getFieldValue('riskValue') || 1;

    setFieldsValue({
      riskValue: ((l * e * c * value) / (getFieldValue(name) || 1)).toFixed(2),
    });

    if (riskValue !== null) {
      dispatch({
        type: 'riskPointManage/fetchCountLevel',
        payload: {
          levelValue: riskValue,
        },
      });
    }
  };

  // 风险评估保存
  handleRiskSubmit = e => {
    const {
      dispatch,
      form: { validateFields },
      companyId,
      tabActiveKey,
    } = this.props;

    const { riskAssessId } = this.state;

    const success = () => {
      message.success('保存成功');
      this.setState({ riskVisible: false }, () => {
        dispatch({
          type: 'riskPointManage/fetchRiskList',
          payload: {
            pageSize,
            pageNum: 1,
            companyId,
            realCheckCycle: tabActiveKey,
          },
        });
      });
    };
    const error = () => {
      message.error('保存失败');
    };
    validateFields((errors, values) => {
      if (!errors) {
        const { count, ...others } = values;
        console.log('values', values);
        const payload = {
          itemId: riskAssessId,
          level: getCountStatus(count),
          ...others,
        };
        dispatch({
          type: 'riskPointManage/fetchAssessLevel',
          payload,
          success,
          error,
        });
      }
    });
  };

  // 删除风险点
  handleShowDeleteConfirm = id => {
    const { dispatch, companyId, tabActiveKey } = this.props;
    confirm({
      title: '提示信息',
      content: '是否删除该风险点',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        dispatch({
          type: 'riskPointManage/fetchRiskPointDelete',
          payload: {
            ids: id,
          },
          success: () => {
            if (tabActiveKey === 'all') {
              dispatch({
                type: 'riskPointManage/fetchRiskList',
                payload: {
                  pageSize,
                  pageNum: 1,
                  companyId,
                },
              });
            } else {
              // 重新请求数据
              dispatch({
                type: 'riskPointManage/fetchRiskList',
                payload: {
                  pageSize,
                  pageNum: 1,
                  companyId,
                  realCheckCycle: tabActiveKey,
                },
              });
            }
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
      user: {
        currentUser: { permissionCodes: codes },
      },
      riskPointManage: { riskGradeList, checkStatusList, isDangerList },
      companyId,
      companyName,
    } = this.props;

    return (
      <Card>
        <Form layout="inline">
          <FormItem>
            {getFieldDecorator('objectTitle', {
              initialValue: defaultFormData.objectTitle,
              getValueFromEvent: e => e.target.value.trim(),
            })(<Input placeholder="请输入风险点名称" />)}
          </FormItem>
          <FormItem>
            {getFieldDecorator('riskLevel')(
              <Select
                placeholder="风险点等级"
                getPopupContainer={getRootChild}
                allowClear
                dropdownStyle={{ zIndex: 50 }}
                style={{ width: 180 }}
              >
                {riskGradeList.map(({ key, value }) => (
                  <Option value={key} key={key}>
                    {value}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('checkStatus')(
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
            {getFieldDecorator('hasHiddenDanger')(
              <Select
                placeholder="有无隐患"
                getPopupContainer={getRootChild}
                allowClear
                dropdownStyle={{ zIndex: 50 }}
                style={{ width: 180 }}
              >
                {isDangerList.map(({ key, value }) => (
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
              code={codesMap.riskControl.riskPointManage.add}
              codes={codes}
              type="primary"
              href={`#/risk-control/risk-point-manage/risk-point-add?companyId=${companyId}&companyName=${companyName}`}
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
      riskPointList: list = [],
      companyId,
      companyName,
      tabActiveKey,
    } = this.props;

    return (
      <div className={styles.cardList} style={{ margin: '24px 0 0 0' }}>
        <List
          rowKey="id"
          grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
          dataSource={list}
          renderItem={item => {
            const {
              id,
              itemId,
              objectTitle,
              checkStatus,
              locationCode,
              riskLevelDesc,
              riskLevelColor,
              qrCode,
              realCheckCycle,
            } = item;
            return (
              <List.Item key={id}>
                <Card
                  title={objectTitle}
                  className={styles.card}
                  actions={[
                    <AuthLink
                      code={codesMap.riskControl.riskPointManage.edit}
                      codes={codes}
                      to={`/risk-control/risk-point-manage/risk-point-edit/${itemId}?companyId=${companyId}&companyName=${companyName}`}
                    >
                      编辑
                    </AuthLink>,
                    <AuthSpan
                      code={codesMap.riskControl.riskPointManage.view}
                      codes={codes}
                      onClick={() => this.handleRiskModal(itemId)}
                    >
                      风险评估
                    </AuthSpan>,
                    <AuthLink
                      code={codesMap.riskControl.riskPointManage.view}
                      codes={codes}
                      to={`/risk-control/risk-point-manage/risk-card-list/${itemId}?companyName=${companyName}&companyId=${companyId}`}
                    >
                      风险告知卡
                    </AuthLink>,
                  ]}
                  extra={
                    <div>
                      {tabActiveKey === 'all' && (
                        <span style={{ border: '1px solid #b4aeae', padding: '2px' }}>
                          {getCheckCycle(realCheckCycle)}
                        </span>
                      )}
                      <AuthButton
                        code={codesMap.riskControl.riskPointManage.delete}
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
                        <Icon type="close" />
                      </AuthButton>
                    </div>
                  }
                >
                  <Row>
                    <Col span={16}>
                      <p>
                        RFID编号：
                        {locationCode || getEmptyData()}
                      </p>
                      <p>
                        风险等级：
                        <span>{riskLevelDesc || getEmptyData()}</span>
                        <span
                          style={{
                            marginLeft: 5,
                            backgroundColor: riskLevelColor,
                          }}
                        >
                          {riskLevelDesc && <span style={{ color: riskLevelColor }}>---</span>}
                        </span>
                      </p>
                      <p>
                        检查状态：
                        {getStatus(checkStatus) || getEmptyData()}
                      </p>
                    </Col>
                    <Col
                      span={8}
                      onClick={() => {
                        if (hasAuthority(codesMap.riskControl.riskPointManage.view, codes))
                          this.handleShowModal(qrCode);
                        else message.warn('您没有权限访问对应页面');
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      <span className={styles.quantity}>
                        点击查
                        <br />看<br />
                        二维码
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

  render() {
    const {
      loading,
      form: { getFieldDecorator },
      riskPointManage: { isLast, count, riskGrade = [] },
      lecData: { llist = [], elist = [], clist = [] },
    } = this.props;

    const { riskVisible, activeKey, showImg, qrCode } = this.state;

    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };

    return (
      <div>
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

        <div className={styles.magnify} style={{ display: showImg ? 'block' : 'none' }}>
          <QRCode className={styles.qrcode} size={200} value={qrCode} />
          <Icon type="close" onClick={this.handleCloseImg} className={styles.iconClose} />
        </div>

        <Modal
          title="风险评估"
          width={650}
          visible={riskVisible}
          onCancel={this.handleCloseModal}
          onOk={this.handleRiskSubmit}
          closable={false}
        >
          <Tabs onChange={this.handleTabs} type="card" className={styles.tabs}>
            <TabPane tab="LEC法" key="1">
              {activeKey === '1' && (
                <Form>
                  <FormItem {...formItemLayout} label="时间发生的可能性(L)">
                    {getFieldDecorator('l', {
                      initialValue: defaultFormData.l,
                    })(
                      <Radio.Group
                        onChange={e => {
                          this.handleRadioChange(e, 'l');
                        }}
                      >
                        {llist.map(({ value, desc }) => (
                          <Tooltip title={desc} placement="bottom">
                            <Radio value={value} key={value}>
                              {value}
                            </Radio>
                          </Tooltip>
                        ))}
                      </Radio.Group>
                    )}
                  </FormItem>
                  <FormItem {...formItemLayout} label="频繁程度(E)">
                    {getFieldDecorator('e', {
                      initialValue: defaultFormData.e,
                    })(
                      <Radio.Group
                        onChange={e => {
                          this.handleRadioChange(e, 'e');
                        }}
                      >
                        {elist.map(({ value, desc }) => (
                          <Tooltip title={desc} placement="bottom">
                            <Radio value={value} key={value}>
                              {value}
                            </Radio>
                          </Tooltip>
                        ))}
                      </Radio.Group>
                    )}
                  </FormItem>
                  <FormItem {...formItemLayout} label="后果(C)">
                    {getFieldDecorator('c', {
                      initialValue: defaultFormData.c,
                    })(
                      <Radio.Group
                        onChange={e => {
                          this.handleRadioChange(e, 'c');
                        }}
                      >
                        {clist.map(({ value, desc }) => (
                          <Tooltip title={desc} placement="bottom">
                            <Radio value={value} key={value}>
                              {value}
                            </Radio>
                          </Tooltip>
                        ))}
                      </Radio.Group>
                    )}
                  </FormItem>
                  <FormItem {...formItemLayout} label="计算风险值(D)">
                    {getFieldDecorator('riskValue')(<Input disabled style={{ width: 120 }} />)}
                  </FormItem>
                  <FormItem {...formItemLayout} label="对应风险等级">
                    {getFieldDecorator('count', {
                      initialValue: getCount(count) || '',
                    })(<Input disabled placeholder="计算中..." style={{ width: 180 }} />)}
                  </FormItem>
                </Form>
              )}
            </TabPane>
            {/* <TabPane tab="自定义" key="2">
              <FormItem {...formItemLayout} label="风险等级">
                {getFieldDecorator('count', {
                  initialValue: getCount(count),
                })(
                  <Select
                    placeholder="请选择风险等级"
                    getPopupContainer={getRootChild}
                    allowClear
                    style={{ width: 180 }}
                  >
                    {riskGrade.map(({ key, value }) => (
                      <Option value={key} key={key}>
                        {value}
                      </Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </TabPane> */}
          </Tabs>
          ,
        </Modal>
      </div>
    );
  }
}
