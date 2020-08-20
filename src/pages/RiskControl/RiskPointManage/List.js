import React, { PureComponent, Fragment } from 'react';
import {
  Spin,
  Button,
  message,
  Modal,
  Card,
  Table,
  Pagination,
  Divider,
  Input,
  Select,
  Row,
  Col,
  TreeSelect,
} from 'antd';
import { Form, Icon as LegacyIcon } from '@ant-design/compatible';
import router from 'umi/router';
import { connect } from 'dva';
import moment from 'moment';
import QRCode from 'qrcode.react';

import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import styles from './CheckContent.less';
// import CheckContent from './CheckContent';
import codesMap from '@/utils/codes';
import { AuthButton, hasAuthority, AuthA, AuthPopConfirm, AuthLink } from '@/utils/customAuth';
import ImportModal from '@/components/ImportModal';
import { NO_DATA } from '@/pages/FacilityManagement/ProductionFacility/List';
import { listPageCol } from '@/utils';

// 默认页面显示数量
const pageSize = 10;

const breadcrumbList = [
  { title: '首页', name: '首页', href: '/' },
  { title: '风险管控', name: '风险管控' },
  { title: '风险点管理', name: '风险点管理' },
];
const riskColors = ['#FC1F02', '#ED7E11', '#fbca18', '#1E60FF'];
const FormItem = Form.Item;
const { Option } = Select;
const { TreeNode: TreeSelectNode } = TreeSelect;

const getRootChild = () => document.querySelector('#root>div');
const defaultFormData = {
  objectTitle: undefined,
  riskPointType: undefined,
  areaName: undefined,
  departmentId: undefined,
  companyName: undefined,
};
const ReviewStatusList = ['未到期', '即将到期', '已过期'];
const ReviewColors = [undefined, 'rgb(250, 173, 20)', 'rgb(245, 34, 45)'];

export const treeData = data => {
  return data.map(item => {
    if (item.children) {
      return (
        <TreeSelectNode title={item.name || item.text} key={item.id} value={item.id}>
          {treeData(item.children)}
        </TreeSelectNode>
      );
    }
    return <TreeSelectNode title={item.name || item.text} key={item.id} value={item.id} />;
  });
};

@connect(({ riskPointManage, user, account, loading }) => ({
  user,
  riskPointManage,
  account,
  loading: loading.models.riskPointManage,
}))
@Form.create()
export default class riskPointList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      activeKey: null,
      visible: false,
      importLoading: false, // 是否上传中
      showImg: false,
      qrCode: '',
    };
  }

  /**
   * 挂载后
   */
  componentDidMount() {
    const {
      match: {
        params: { type = 'all' },
      },
    } = this.props;
    this.setState({ activeKey: type });
    this.getRiskList(type);
  }

  // 获取列表
  getRiskList = (key, payload) => {
    const {
      match: {
        params: { type: paramsType },
      },
      dispatch,
    } = this.props;
    const type = key || paramsType;
    dispatch({
      type: 'riskPointManage/fetchRiskList',
      payload: {
        pageSize,
        pageNum: 1,
        realCheckCycle: type === 'all' ? undefined : type,
        ...payload,
      },
    });

    dispatch({
      type: 'riskPointManage/fetchRiskCount',
      payload: {
        ...payload,
      },
    });

    // dispatch({
    //   type: 'riskPointManage/fetchLecDict',
    // });
  };

  /**
   * 切换tab
   */
  handleTabChange = key => {
    this.setState({ activeKey: key }, () => {
      router.replace(`/risk-control/risk-point-manage/list/${key}`);
    });
    this.getRiskList(key);
  };

  // handleImportChange = info => {
  //   const res = info.file.response;
  //   if (info.file.status === 'uploading') {
  //     this.setState({ importLoading: true });
  //   }
  //   if (info.file.status === 'done' && res) {
  //     if (res.code && res.code === 200) {
  //       message.success(res.msg);
  //       this.getRiskList();
  //     } else {
  //       res && res.data && res.data.errorMessage && res.data.errorMessage.length > 0
  //         ? Modal.error({
  //           title: '错误信息',
  //           content: res.data.errorMessage,
  //           okText: '确定',
  //         }) : message.error(res.msg);
  //     }
  //     this.setState({ importLoading: false });
  //   } else this.setState({ importLoading: false });
  // }

  // handleBeforeUpload = file => {
  //   const { importLoading } = this.state;
  //   const isExcel = /xls/.test(file.name);
  //   if (importLoading) {
  //     message.error('尚未上传结束');
  //   }
  //   if (!isExcel) {
  //     message.error('上传失败，请上传.xls格式');
  //   }
  //   return !importLoading || isExcel;
  // }

  handleDelete = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'riskPointManage/fetchRiskPointDelete',
      payload: {
        ids: id,
      },
      success: () => {
        message.success('删除成功！');
        this.getRiskList();
      },
      error: msg => {
        message.error('删除失败!');
      },
    });
  };

  handleTableChange = (pageNum, pageSize) => {
    this.getRiskList(undefined, { pageNum, pageSize });
  };

  handleClickToQuery = () => {
    const {
      form: { getFieldsValue },
      match: {
        params: { type = 'all' },
      },
    } = this.props;
    const data = getFieldsValue();
    // 修改表单数据
    this.formData = data;
    this.getRiskList(type, data);
  };

  handleClickToReset = () => {
    const {
      form: { resetFields },
    } = this.props;
    resetFields();
    this.formData = defaultFormData;
    this.getRiskList();
  };

  handleShowCode = qrCode => {
    this.setState({ showImg: true, qrCode: qrCode });
  };

  handleCloseCode = () => {
    this.setState({ showImg: false });
  };

  renderForm = () => {
    const {
      form: { getFieldDecorator },
      account: { departments },
      user: {
        currentUser: { unitType },
      },
    } = this.props;
    const treeList = treeData(departments);

    return (
      <Card>
        <Form layout="horizon" className={styles.form}>
          <Row gutter={24}>
            <Col {...listPageCol}>
              <FormItem>
                {getFieldDecorator('objectTitle', {
                  initialValue: defaultFormData.objectTitle,
                  getValueFromEvent: e => e.target.value.trim(),
                })(<Input placeholder="请输入风险点名称" />)}
              </FormItem>
            </Col>
            <Col {...listPageCol}>
              <FormItem>
                {getFieldDecorator('riskPointType', {
                  initialValue: defaultFormData.riskPointType,
                })(
                  <Select
                    placeholder="风险点类型"
                    getPopupContainer={getRootChild}
                    allowClear
                    dropdownStyle={{ zIndex: 50 }}
                  >
                    <Option value={1}>设备设施</Option>
                    <Option value={2}>作业活动</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            {/* <FormItem>
            {getFieldDecorator('riskLevel', {
              initialValue: defaultFormData.riskLevel,
            })(
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
          </FormItem> */}
            <Col {...listPageCol}>
              <FormItem>
                {getFieldDecorator('areaName', {
                  initialValue: defaultFormData.areaName,
                  getValueFromEvent: e => e.target.value.trim(),
                })(<Input placeholder="请输入所属区域" />)}
              </FormItem>
            </Col>

            {/* <Col {...listPageCol}>
              <FormItem>
                {getFieldDecorator('departmentId')(
                  <TreeSelect
                    allowClear
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    placeholder="请选择所属部门"
                  >
                    {treeList}
                  </TreeSelect>
                )}
              </FormItem>
            </Col> */}

            {unitType !== 4 && (
              <Col {...listPageCol}>
                <FormItem>
                  {getFieldDecorator('companyName', {
                    initialValue: defaultFormData.companyName,
                    getValueFromEvent: e => e.target.value.trim(),
                  })(<Input placeholder="请输入单位名称" />)}
                </FormItem>
              </Col>
            )}

            <Col {...listPageCol}>
              <FormItem>
                <Button type="primary" onClick={this.handleClickToQuery}>
                  查询
                </Button>
                {/* </FormItem>
            <FormItem> */}
                <Button onClick={this.handleClickToReset} style={{ marginLeft: 10 }}>
                  重置
                </Button>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Card>
    );
  };

  // 渲染页面
  render() {
    const {
      loading,
      riskPointManage: {
        riskPointData: {
          list: riskPointList,
          pagination: { total, pageNum, pageSize },
        },
        riskCountData: { list = [] },
        lecData,
        equipmentTypeList = [],
      },
      user: {
        currentUser: { permissionCodes: codes, unitType },
      },
    } = this.props;

    const { activeKey, importLoading, showImg, qrCode } = this.state;

    const count = list.map(item => item.pointCount);
    const importAuth = hasAuthority(codesMap.riskControl.riskPointManage.import, codes);
    const tabList = [
      {
        key: 'all',
        tab: `全部(${count[0] || 0})`,
      },
      {
        key: 'every_day',
        tab: `日检查点(${count[1] || 0})`,
      },
      {
        key: 'every_week',
        tab: `周检查点(${count[2] || 0})`,
      },
      {
        key: 'every_month',
        tab: `月检查点(${count[3] || 0})`,
      },
      {
        key: 'every_quarter',
        tab: `季度检查点(${count[4] || 0})`,
      },
      {
        key: 'every_half_year',
        tab: `半年检查点(${count[5] || 0})`,
      },
      {
        key: 'every_year',
        tab: `年检查点(${count[6] || 0})`,
      },
    ];

    const columns = [
      {
        title: '单位名称',
        dataIndex: 'companyName',
        key: 'companyName',
        width: 250,
      },
      {
        title: '风险点名称',
        dataIndex: 'objectTitle',
        key: 'objectTitle',
        width: 200,
      },
      {
        title: '风险点编号',
        dataIndex: 'itemCode',
        key: 'itemCode',
        width: 200,
        render: val => val || NO_DATA,
      },
      {
        title: '风险点类型',
        dataIndex: 'riskPointType',
        key: 'riskPointType',
        render: val => (val ? (+val === 1 ? '设备设施' : '作业活动') : NO_DATA),
        width: 200,
      },
      {
        title: '详情信息',
        dataIndex: 'companyName',
        key: 'companyName',
        width: 250,
        render: (
          val,
          { riskPointType, equipmentType, equipmentName, workName, workContent, workFrequency }
        ) => {
          if (!riskPointType) return NO_DATA;
          return +riskPointType === 1 ? (
            <div>
              <div>
                设备类型：
                {(equipmentTypeList.find(item => item.key === +equipmentType) || {}).value ||
                  NO_DATA}
              </div>
              <div>
                设备名称：
                {equipmentName || NO_DATA}
              </div>
            </div>
          ) : (
            <div>
              <div>
                作业活动名称：
                {workName || NO_DATA}
              </div>
              <div>
                作业活动内容：
                {workContent || NO_DATA}
              </div>
              <div>
                活动频率：
                {workFrequency || NO_DATA}
              </div>
            </div>
          );
        },
      },
      {
        title: '所属区域',
        dataIndex: 'areaName',
        key: 'areaName',
        render: val => val || NO_DATA,
      },
      {
        title: '复评信息',
        dataIndex: 'reviewCycle',
        key: 'reviewCycle',
        render: (val, { reviewTime, reviewStatus }) => (
          <div>
            <div>
              复评周期(月)：
              {val || NO_DATA}
            </div>
            <div>
              应复评时间：
              {reviewTime ? (
                <span style={{ color: ReviewColors[reviewStatus - 1] }}>
                  {moment(reviewTime).format('YYYY-MM-DD')}
                </span>
              ) : (
                NO_DATA
              )}
            </div>
            <div>
              预警状态：
              {reviewStatus ? (
                <span style={{ color: ReviewColors[reviewStatus - 1] }}>
                  {ReviewStatusList[reviewStatus - 1]}
                </span>
              ) : (
                NO_DATA
              )}
            </div>
          </div>
        ),
      },
      {
        title: '风险等级',
        dataIndex: 'riskLevelDesc',
        key: 'riskLevelDesc',
        render: (val, { riskLevel }) => (
          <span style={{ color: riskLevel ? riskColors[riskLevel - 1] : undefined }}>
            {val || NO_DATA}
          </span>
        ),
      },
      {
        title: '管控责任人',
        dataIndex: 'header',
        key: 'header',
        render: val => val || NO_DATA,
      },
      {
        title: '分析评估来源',
        dataIndex: 'safeCheck',
        key: 'safeCheck',
        width: 200,
        render: val => {
          if (val) {
            const { code, type, riskAnalyze } = val || {};
            return (
              <div>
                <div>{+type === 1 ? 'SCL分析' : 'JHA分析'}</div>
                <div>
                  编号：
                  {code}
                </div>
                <div>{+riskAnalyze === 1 ? 'LEC评价法' : 'LS评价法'}</div>
              </div>
            );
          } else {
            return NO_DATA;
          }
        },
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        fixed: 'right',
        // align: 'center',
        width: 300,
        render: (data, record) => (
          <span>
            <AuthLink
              code={codesMap.riskControl.riskPointManage.riskCardView}
              codes={codes}
              // to={`/risk-control/risk-point-manage/risk-card-list/${record.itemId}`}
              target="_blank"
            >
              {record.safeCheck ? '复评' : '评估'}
            </AuthLink>
            <Divider type="vertical" />
            <AuthLink
              code={codesMap.riskControl.riskPointManage.riskCardView}
              codes={codes}
              to={`/risk-control/risk-point-manage/risk-card-list/${record.itemId}`}
              target="_blank"
            >
              风险告知卡
            </AuthLink>
            {!!record.qrCode && (
              <Fragment>
                <Divider type="vertical" />
                <AuthA
                  code={codesMap.riskControl.riskPointManage.view}
                  onClick={e => this.handleShowCode(record.qrCode)}
                >
                  二维码
                </AuthA>
              </Fragment>
            )}
            <Divider type="vertical" />
            {/* <AuthLink
              code={codesMap.riskControl.riskPointManage.view}
              codes={codes}
              to={`/risk-control/risk-point-manage/detail/${record.itemId}`}
            >
              查看
            </AuthLink>
            <Divider type="vertical" />*/}
            <AuthLink
              code={codesMap.riskControl.riskPointManage.edit}
              codes={codes}
              to={`/risk-control/risk-point-manage/edit/${record.itemId}?type=${activeKey}`}
            >
              编辑
            </AuthLink>
            <Divider type="vertical" />
            <AuthPopConfirm
              code={codesMap.riskControl.riskPointManage.delete}
              title="确认要删除该风险点吗？"
              onConfirm={() => this.handleDelete(record.itemId)}
            >
              删除
            </AuthPopConfirm>
          </span>
        ),
      },
    ];

    return (
      <PageHeaderLayout
        className={styles.header}
        title="风险点管理"
        breadcrumbList={breadcrumbList}
        content={
          <div style={{ position: 'relative' }}>
            {/* <span>{companyName}</span>
            <span style={{ paddingLeft: 15 }}>
              风险点总数：
              {count[0]}
            </span> */}
            <div style={{ position: 'absolute', right: '-8px', top: '20px', zIndex: 99 }}>
              <AuthButton
                code={codesMap.riskControl.riskPointManage.add}
                codes={codes}
                type="primary"
                href={`#/risk-control/risk-point-manage/add?type=${activeKey}`}
                className={styles.mr10}
              >
                新增
              </AuthButton>
              <Button
                href="http://data.jingan-china.cn/import/excel/风险点.xls"
                target="_blank"
                className={styles.mr10}
              >
                模板下载
              </Button>
              <ImportModal
                action={companyId => `/acloud_new/v2/pointManage/importRiskPoint/${companyId}`}
                onUploadSuccess={this.getRiskList}
                code={codesMap.riskControl.riskPointManage.import}
                // showCompanySelect={false}
              />
            </div>
          </div>
        }
        tabList={tabList}
        tabActiveKey={activeKey}
        onTabChange={this.handleTabChange}
      >
        {this.renderForm()}
        {riskPointList && riskPointList.length ? (
          <Card style={{ marginTop: '24px' }}>
            <Table
              rowKey="itemId"
              className={styles.table}
              loading={!!loading}
              columns={unitType === 4 ? columns.slice(1, columns.length) : columns}
              dataSource={riskPointList}
              pagination={false}
              // scroll={{ x: 'max-content' }}
              scroll={{ x: true }}
            />
            <Pagination
              style={{ marginTop: '20px', float: 'right' }}
              // showTotal={false}
              showQuickJumper
              showSizeChanger
              // pageSizeOptions={['5', '10', '15', '20']}
              pageSize={pageSize}
              current={pageNum}
              total={total}
              onChange={this.handleTableChange}
              onShowSizeChange={this.handleTableChange}
              // showTotal={total => `共 ${total} 条`}
            />
          </Card>
        ) : (
          <Spin spinning={!!loading}>
            <Card style={{ marginTop: '20px', textAlign: 'center' }}>
              <span>暂无数据</span>
            </Card>
          </Spin>
        )}
        <div
          className={styles.magnify}
          onClick={this.handleCloseImg}
          style={{ display: showImg ? 'block' : 'none', pointerEvents: 'auto' }}
        >
          <LegacyIcon type="close" onClick={this.handleCloseCode} className={styles.iconClose} />
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
