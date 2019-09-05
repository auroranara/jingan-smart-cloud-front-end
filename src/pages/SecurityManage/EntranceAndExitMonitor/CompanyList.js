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
  Tooltip,
  message,
} from 'antd';
import { Link } from 'dva/router';
import debounce from 'lodash/debounce';
import InfiniteScroll from 'react-infinite-scroller';
import Ellipsis from '@/components/Ellipsis';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import codes from '@/utils/codes';
import styles from './companyList.less';
import codesMap from '@/utils/codes';
import { hasAuthority, AuthButton } from '@/utils/customAuth';
import BlackList from './images/blackList.png';
import MonitorIcon from './images/monitorIcon.png';
import CameraIcon from './images/cameraIcon.png';
import AlarmIcon from './images/alarmIcon.png';
import AlarmIconDis from './images/alarmIconDis.png';
import MonitorDis from './images/monitorDis.png';
import CameraDis from './images/cameraDis.png';
import BlackListDis from './images/blackListDis.png';

// 权限代码
const {
  securityManage: {
    entranceAndExitMonitor: { faceDatabaseView, cameraView, monitorPointView, alarmRecordView },
  },
} = codes;

const FormItem = Form.Item;
const { Option } = Select;

const title = '出入口监测';

//面包屑
const breadcrumbList = [
  {
    title: '首页',
    name: '首页',
    href: '/',
  },
  {
    title: '安防管理',
    name: '安防管理',
  },
  {
    title,
    name: '出入口监测',
  },
];

// 默认页面显示数量
const pageSize = 18;

// 默认表单值
const defaultFormData = {
  companyName: undefined,
};

/* 获取无数据 */
const getEmptyData = () => {
  return <span style={{ color: 'rgba(0,0,0,0.45)' }}>暂无数据</span>;
};

@connect(({ securityManage, hiddenDangerReport, user, loading }) => ({
  securityManage,
  hiddenDangerReport,
  user,
  loading: loading.models.securityManage,
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
    const {
      dispatch,
      user: {
        currentUser: { unitType, companyId },
      },
    } = this.props;
    // 获取监测单位列表
    dispatch({
      type: 'securityManage/fetchMonitorCompanyList',
      payload: {
        pageSize,
        pageNum: 1,
        companyId: +unitType === 4 ? companyId : undefined,
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
      user: {
        currentUser: { unitType, companyId: companyIdAuth },
      },
    } = this.props;
    const { company_id } = getFieldsValue();
    const payload = {
      companyId: company_id,
    };
    // 重新请求数据
    dispatch({
      type: 'securityManage/fetchMonitorCompanyList',
      payload: {
        companyId: +unitType === 4 ? companyIdAuth : undefined,
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
      user: {
        currentUser: { unitType, companyId },
      },
    } = this.props;
    // 清除筛选条件
    resetFields();
    // 修改表单数据
    this.formData = defaultFormData;
    // 重新请求数据
    dispatch({
      type: 'securityManage/fetchMonitorCompanyList',
      payload: {
        companyId: +unitType === 4 ? companyId : undefined,
        pageSize,
        pageNum: 1,
      },
    });
  };

  // 滚动加载
  handleLoadMore = () => {
    const {
      dispatch,
      securityManage: { isLast },
      user: {
        currentUser: { unitType, companyId },
      },
    } = this.props;
    if (isLast) {
      return;
    }
    const {
      securityManage: { pageNum },
    } = this.props;
    // 请求数据
    dispatch({
      type: 'securityManage/appendCompanyList',
      payload: {
        companyId: +unitType === 4 ? companyId : undefined,
        pageSize,
        pageNum: pageNum + 1,
        ...this.formData,
      },
    });
  };

  // 显示新增企业模态框
  handleClickAdd = () => {
    const {
      form: { setFieldsValue },
    } = this.props;
    this.setState({ modalVisible: true });
    setFieldsValue({
      companyId: undefined,
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
      user: {
        currentUser: { unitType, companyId: newCompanyId },
      },
    } = this.props;

    validateFieldsAndScroll((error, values) => {
      if (!error) {
        const { companyId } = values;

        const payload = { companyId: companyId.key };
        const success = () => {
          const msg = '添加成功';
          message.success(msg, 1, this.setState({ modalVisible: false }));
          // 获取监测单位列表
          dispatch({
            type: 'securityManage/fetchMonitorCompanyList',
            payload: {
              companyId: +unitType === 4 ? newCompanyId : undefined,
              pageSize,
              pageNum: 1,
            },
          });
        };
        const error = res => {
          const msg = '单位已存在，请勿重复添加';
          message.error(msg, 1, this.setState({ modalVisible: true }));
        };
        dispatch({
          type: 'securityManage/fetchMonitorSceneAdd',
          payload: {
            ...payload,
            monitorScene: 1,
            state: 1,
          },
          success,
          error,
        });
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
        currentUser: { permissionCodes: codes },
      },
    } = this.props;

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
            <AuthButton
              code={codesMap.securityManage.entranceAndExitMonitor.addCompany}
              codes={codes}
              type="primary"
              onClick={this.handleClickAdd}
            >
              添加单位
            </AuthButton>
          </FormItem>
        </Form>
      </Card>
    );
  }

  // 渲染列表
  renderList() {
    const {
      securityManage: {
        data: { list = [] },
      },
      user: {
        currentUser: { permissionCodes },
      },
    } = this.props;

    // 添加权限
    const faceAuth = hasAuthority(faceDatabaseView, permissionCodes);
    const cameraAuth = hasAuthority(cameraView, permissionCodes);
    const monitorAuth = hasAuthority(monitorPointView, permissionCodes);
    const alarmAuth = hasAuthority(alarmRecordView, permissionCodes);

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
              companyName,
              safetyName,
              safetyPhone,
              monitorDotNum,
              companyBasicInfo: {
                practicalProvinceLabel,
                practicalCityLabel,
                practicalDistrictLabel,
                practicalTownLabel,
                practicalAddress,
              },
              faceDataBaseId,
            } = item;
            const practicalAddressLabel =
              (practicalProvinceLabel || '') +
              (practicalCityLabel || '') +
              (practicalDistrictLabel || '') +
              (practicalTownLabel + '') +
              (practicalAddress || '');
            return (
              <List.Item key={companyId}>
                <Card
                  title={companyName}
                  className={styles.card}
                  actions={[
                    faceAuth ? (
                      <Link
                        to={`/security-manage/entrance-and-exit-monitor/face-database/${id}?faceDataBaseId=${faceDataBaseId}&&name=${companyName}&&companyId=${companyId}`}
                        target="_blank"
                      >
                        <Tooltip
                          placement="bottomLeft"
                          title="黑名单"
                          overlayClassName={styles.tooltipStyle}
                        >
                          <img src={BlackList} alt="" width="27" height="27" />
                        </Tooltip>
                      </Link>
                    ) : (
                      <span style={{ cursor: 'auto' }}>
                        <img src={BlackListDis} alt="" width="27" height="27" />
                      </span>
                    ),
                    cameraAuth ? (
                      <Link
                        to={`/security-manage/entrance-and-exit-monitor/face-recognition-camera/${id}?faceDataBaseId=${faceDataBaseId}&&companyId=${companyId}&&companyName=${companyName}`}
                        target="_blank"
                      >
                        <Tooltip
                          placement="bottomLeft"
                          title="人脸识别摄像机"
                          overlayClassName={styles.tooltipStyle}
                        >
                          <img src={CameraIcon} alt="" width="27" height="27" />
                        </Tooltip>
                      </Link>
                    ) : (
                      <span style={{ cursor: 'auto' }}>
                        <img src={CameraDis} alt="" width="27" height="27" />
                      </span>
                    ),
                    monitorAuth ? (
                      <Link
                        to={`/security-manage/entrance-and-exit-monitor/monitoring-points-list/${id}?companyName=${companyName}&&faceDataBaseId=${faceDataBaseId}`}
                        target="_blank"
                      >
                        <Tooltip
                          placement="bottomLeft"
                          title="监测点"
                          overlayClassName={styles.tooltipStyle}
                        >
                          <img src={MonitorIcon} alt="" width="27" height="27" />
                        </Tooltip>
                      </Link>
                    ) : (
                      <span style={{ cursor: 'auto' }}>
                        <img src={MonitorDis} alt="" width="27" height="27" />
                      </span>
                    ),
                    alarmAuth ? (
                      <Link
                        to={`/security-manage/entrance-and-exit-monitor/alarm-record/${companyId}`}
                        target="_blank"
                      >
                        <Tooltip
                          placement="bottomLeft"
                          title="报警历史记录"
                          overlayClassName={styles.tooltipStyle}
                        >
                          <img src={AlarmIcon} alt="" width="27" height="27" />
                        </Tooltip>
                      </Link>
                    ) : (
                      <span style={{ cursor: 'auto' }}>
                        <img src={AlarmIconDis} alt="" width="27" height="27" />
                      </span>
                    ),
                  ]}
                  // extra={
                  //   <AuthButton
                  //     code={codesMap.securityManage.entranceAndExitMonitor.view}
                  //     codes={codes}
                  //     onClick={() => {
                  //       this.handleShowDeleteConfirm();
                  //     }}
                  //     shape="circle"
                  //     style={{
                  //       border: 'none',
                  //       fontSize: '16px',
                  //       position: 'absolute',
                  //       right: '8px',
                  //       top: '12px',
                  //     }}
                  //   >
                  //     <Icon type="close" />
                  //   </AuthButton>
                  // }
                >
                  <Row>
                    <Col span={23}>
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
                      <p>
                        监测点数量：
                        {monitorDotNum || 0}
                      </p>
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
      securityManage: {
        data: { total },
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
    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
        content={
          <div>
            单位总数：
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
