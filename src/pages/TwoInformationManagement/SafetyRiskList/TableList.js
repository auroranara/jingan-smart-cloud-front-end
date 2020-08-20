import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Form, Icon as LegacyIcon } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import {
  Button,
  Card,
  Table,
  Upload,
  Modal,
  message,
  Divider,
  Transfer,
  Input,
  Select,
} from 'antd';
import { getToken } from 'utils/authority';
import ToolBar from '@/components/ToolBar';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import styles1 from '@/pages/SafetyKnowledgeBase/MSDS/MList.less';
import { AuthA, AuthPopConfirm } from '@/utils/customAuth';
import codes from '@/utils/codes';
import {
  BREADCRUMBLIST,
  ROUTER,
  TABLE_COLUMNS as COLUMNS,
  DetailModal,
} from './utils';
import debounce from 'lodash/debounce';
import { lecSettings } from '@/pages/RiskControl/SafetyChecklist/config.js';
import { stringify } from 'qs';

// 权限
const {
  twoInformManagement: {
    safetyRiskList: { view: viewAuth, delete: deleteAuth, import: importAuth, export: exportAuth },
  },
} = codes;
const { riskLevelList } = lecSettings;
const url =
  'http://data.jingan-china.cn/v2/chem/file1/%E5%AE%89%E5%85%A8%E9%A3%8E%E9%99%A9%E5%88%86%E7%BA%A7%E7%AE%A1%E6%8E%A7%E6%B8%85%E5%8D%95.xls';

@connect(({ twoInformManagement, fourColorImage, user, electronicInspection, loading }) => ({
  twoInformManagement,
  fourColorImage,
  user,
  electronicInspection,
  loading: loading.models.twoInformManagement,
}))
@Form.create()
export default class TableList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      formData: {},
      modalVisible: false, // 导入弹框是否可见
      fileList: [], // 导入的数据列表
      importLoading: false, // 导入状态
      detailVisible: false, // 清单弹框是否可见
      currentPage: 1,
      detailId: '', // 查看清单ID
      personModalVisible: false, // 选择责任人弹窗可见
      historyModalVisible: false, // 历史记录弹窗可见
      targetKeys: [], // 责任人穿梭框-右侧key数组
      selectedKeys: [], // 责任人穿梭框已选择key数组
      personList: [], // 责任人列表
      info: {}, // 详情
      data: { // 列表数据
        list: [],
        pagination: {
          pageNum: 1,
          pageSize: 10,
          total: 0,
        },
      },
      history: {
        list: [],
        pagination: {
          pageNum: 1,
          pageSize: 10,
          total: 0,
        },
      },
      areaList: [],
    };
    this.pageNum = 1;
    this.pageSize = 10;
    this.fetchPersonDebounce = debounce(this.fetchReevaluatorList, 300);
  }

  componentDidMount () {
    this.fetchList();
    this.fetchAreaList();
  }

  // 获取风险分区列表
  fetchList = (pageNum = 1, pageSize = 10, params = {}) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'twoInformManagement/fetchSafetyListNew',
      payload: {
        ...params,
        pageSize,
        pageNum,
        historyType: 1, // 1 最新 0 历史
      },
      callback: data => {
        this.setState({ data });
      },
    });
  };

  // 获取历史记录
  fetchHistory = (pageNum = 1, pageSize = 10) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'twoInformManagement/fetchSafetyListNew',
      payload: {
        pageSize,
        pageNum,
        historyType: 0, // 1 最新 0 历史
      },
      callback: data => {
        this.setState({ history: data });
      },
    });
  }

  // 获取清单列表
  fetchSafetyList = (pageNum = 1, pageSize = 10, params = {}) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'twoInformManagement/fetchSafetyList',
      payload: {
        ...params,
        pageSize,
        pageNum,
      },
    });
  };

  // 获取区域列表
  fetchAreaList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'twoInformManagement/fetchAreaList',
      payload: { pageNum: 1, pageSize: 0 },
      callback: list => { this.setState({ areaList: list }) },
    });
  }

  // 获取负责人员列表
  fetchReevaluatorList = (
    payload = {},
    callback = data => {
      this.setState({
        personList: data.list.map(item => ({
          key: item.studentId,
          title: item.name,
        })),
      });
    },
  ) => {
    const { dispatch, user: { isCompany, currentUser } } = this.props;
    const { info } = this.state;
    const comId = isCompany ? currentUser.companyId : info && info.companyId ? info.companyId : undefined;
    dispatch({
      type: 'electronicInspection/fetchPersonList',
      payload: {
        pageNum: 1,
        pageSize: 0,
        companyId: payload.companyId || comId,
        ...payload,
      },
      callback,
    });
  }

  // 查询
  handleSearch = values => {
    this.setState({ formData: { ...values } });
    this.fetchList(1, this.pageSize, { ...values });
  };

  // 重置
  handleReset = () => {
    this.setState({ formData: {} });
    this.fetchList(1, this.pageSize);
  };

  // 删除
  handleDeleteClick = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'twoInformManagement/fetchSafetyDel',
      payload: { areaId: id },
      callback: res => {
        if (res && res.code === 200) {
          this.fetchList();
          message.success(res.data);
        } else message.success(res.msg);
      },
    });
  };

  handleAdd = () => {
    router.push(`${ROUTER}/add`);
  };

  // 分页变动
  handlePageChange = (pageNum, pageSize) => {
    const { formData } = this.state;
    this.pageNum = pageNum;
    this.pageSize = pageSize;
    this.fetchList(pageNum, pageSize, { ...formData });
  };

  // 导入
  handleImportShow = (id, companyId) => {
    this.setState({ modalVisible: true, areaId: id, companyId });
  };

  handleImportChange = info => {
    const fileList = info.fileList.slice(-1);
    this.setState({ fileList });
    if (info.file.status === 'uploading') {
      this.setState({ importLoading: true });
    }
    if (info.file.status === 'removed') {
      message.success('删除成功');
      return;
    }
    if (info.file.response) {
      if (info.file.response.code && info.file.response.code === 200) {
        if (info.file.response.data.faultNum === 0) {
          message.success('导入成功');
        } else if (info.file.response.data.faultNum > 0) {
          message.error('导入失败！' + info.file.response.data.message);
        }
        if (info.file.response.data) {
          this.setState({
            importLoading: false,
          });
        }
      } else {
        this.setState({
          importLoading: false,
        });
      }
    }
  };

  handleImportClose = () => {
    this.setState({ modalVisible: false, fileList: [] });
  };

  // 导出
  handleExportShow = (id, companyId) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'twoInformManagement/fetchSafetyExport',
      payload: { areaId: id },
    });
  };

  // 显示清单弹框
  handleDetailModal = id => {
    this.setState({ detailVisible: true, detailId: id });
    this.fetchSafetyList(1, this.pageSize, { areaId: id });
  };

  handleTableData = (list = [], indexBase) => {
    return list.map((item, index) => {
      return {
        ...item,
        index: indexBase + index + 1,
      };
    });
  };

  handleDetailPageChange = (pageNum, pageSize) => {
    const { detailId } = this.state;
    this.pageNum = pageNum;
    this.pageSize = pageSize;
    this.fetchSafetyList(pageNum, pageSize, { areaId: detailId });
  };

  handleDetailClose = () => {
    this.setState({ detailVisible: false });
  };

  // 打开选择责任人弹窗
  handleViewPersonModal = row => {
    this.fetchReevaluatorList({ pageSize: 100, companyId: row.companyId });
    this.setState({
      personModalVisible: true,
      info: row,
      selectedKeys: [], targetKeys: row.principal ? row.principal.split(',') : [],
    });
  }

  // 穿梭框两栏间转移
  handleChange = (nextTargetKeys, direction, moveKeys) => {
    this.setState({ targetKeys: nextTargetKeys });
  };

  // 穿梭框选择
  handleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    this.setState({ selectedKeys: [...sourceSelectedKeys, ...targetSelectedKeys] });
  };

  // 穿梭框搜索
  // key: item.studentId,
  // title: item.name,
  onPersonSearch = (dir, value) => {
    if (dir === 'right') return;
    this.fetchPersonDebounce(
      { name: value },
      data => {
        const { targetKeys, personList } = this.state;
        const targetItems = personList.filter(item => targetKeys.includes(item.key));
        const newItems = data.list.reduce((pre, item) => {
          return targetKeys.includes(item.studentId) ? pre : [...pre, { key: item.studentId, title: item.name }];
        }, targetItems);
        this.setState({ personList: newItems });
      },
    );
  }

  // 选择责任人弹窗点击确认
  submitPerson = () => {
    const { dispatch } = this.props;
    const { targetKeys, formData, info } = this.state;
    dispatch({
      type: 'twoInformManagement/editPrincipal',
      payload: {
        id: info.id,
        principal: Array.isArray(targetKeys) && targetKeys.length ? targetKeys.join(',') : '',
      },
      callback: (success, res) => {
        if (success) {
          message.success('操作成功');
          this.setState({ personModalVisible: false });
          this.fetchList(1, this.pageSize, { ...formData });
        } else {
          message.error(res.msg || '操作失败');
        }
      },
    });
  }

  // 点击历史记录
  handleViewHistory = () => {
    this.fetchHistory();
    this.setState({ historyModalVisible: true });
  }

  // 点击来源分析
  jumpViewSourceAnalysis = ({ type, code }) => {
    const query = { code };
    let path = '';
    if (+type === 1) { // scl
      path = '/risk-control/safety-checklist/list';
    } else if (+type === 2) { // jha
      path = '/risk-control/operation-hazards/list';
    }
    window.open(`${window.publicPath}#${path}?${stringify(query)}`);
  }

  render () {
    const {
      loading = false,
      user: { currentUser: { unitType } },
    } = this.props;

    const {
      fileList,
      modalVisible,
      // currentPage,
      areaId,
      companyId,
      // detailVisible,
      importLoading,
      personModalVisible,
      targetKeys,
      selectedKeys,
      personList,
      data: {
        list = [],
        pagination: { pageNum, pageSize, total },
      },
      historyModalVisible,
      history,
      areaList,
    } = this.state;

    const uploadExportButton = <LegacyIcon type={importLoading ? 'loading' : 'upload'} />;

    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 16 },
    };

    const extraColumns = [
      // {
      //   title: '附件',
      //   dataIndex: 'file',
      //   key: 'file',
      //   align: 'center',
      //   render: (val, text) => {
      //     return (
      //       <AuthA code={viewAuth} onClick={() => this.handleDetailModal(text.id)}>
      //         查看清单
      //       </AuthA>
      //     );
      //   },
      // },
      {
        title: '来源分析',
        key: 'source',
        align: 'left',
        fixed: 'right',
        width: 200,
        render: (val, { code, type, safeCheckId }) => (
          <div onClick={() => this.jumpViewSourceAnalysis({ type, code })}>
            <a>{(+type === 1 && 'SCL') || (+type === 2 && 'JHA') || ''}</a><br />
            <a>编号：{code}</a>
          </div>
        ),
      },
      {
        title: '操作',
        key: 'operation',
        align: 'center',
        fixed: 'right',
        width: 150,
        render: (val, row) => (
          <Fragment>
            <a onClick={() => this.handleViewPersonModal(row)}>编辑责任人</a>
          </Fragment>
        ),
      },
      // {
      //   title: '操作',
      //   dataIndex: 'operation',
      //   key: 'operation',
      //   align: 'center',
      //   render: (val, text) => {
      //     return (
      //       <Fragment>
      //         <AuthA
      //           code={importAuth}
      //           onClick={() => this.handleImportShow(text.id, text.companyId)}
      //         >
      //           导入数据
      //         </AuthA>
      //         <Divider type="vertical" />
      //         <AuthPopConfirm
      //           code={deleteAuth}
      //           title="确定删除当前该内容吗？"
      //           onConfirm={() => this.handleDeleteClick(text.id)}
      //           okText="确定"
      //           cancelText="取消"
      //         >
      //           删除
      //         </AuthPopConfirm>
      //         <Divider type="vertical" />
      //         <AuthA
      //           code={exportAuth}
      //           onClick={() => this.handleExportShow(text.id, text.companyId)}
      //         >
      //           导出数据
      //         </AuthA>
      //       </Fragment>
      //     );
      //   },
      // },
    ];

    const breadcrumbList = Array.from(BREADCRUMBLIST);
    breadcrumbList.push({ title: '列表', name: '列表' });

    const toolBarAction = (
      // <Button type="primary" style={{ marginTop: '8px' }}>
      //   <a href={url}>下载模板</a>
      // </Button>
      <Fragment>
        <Button style={{ marginTop: '8px' }} type="primary" onClick={this.handleViewHistory}>历史记录</Button>
      </Fragment>
    );
    const FIELDS = [
      {
        id: 'areaId',
        label: '区域名称',
        render: () => (
          <Select placeholder="请选择" allowClear>
            {areaList.map(({ id, areaName }) => (
              <Select.Option key={id} value={id}>{areaName}</Select.Option>
            ))}
          </Select>
        ),
      },
      {
        id: 'objectTitle',
        label: '风险点名称',
        render: () => <Input placeholder="请输入" allowClear />,
      },
      {
        id: 'companyName',
        label: '单位名称：',
        render: () => <Input placeholder="请输入" allowClear />,
        transform: v => v.trim(),
      },
      {
        id: 'dangerLevel',
        label: '风险等级',
        render: () => (
          <Select placeholder="请选择" allowClear>
            {riskLevelList.map(({ level, colorName }) => (
              <Select.Option key={level} value={level}>{colorName.slice(0, 1)}</Select.Option>
            ))}
          </Select>
        ),
      },
      {
        id: 'controlHierarchy',
        label: '管控层级',
        render: () => (
          <Select placeholder="请选择" allowClear dropdownMatchSelectWidth={false}>
            {riskLevelList.map(({ level, controllevel, color }) => (
              <Select.Option key={level} value={level}>
                <span style={{ border: `0px solid ${color}`, borderLeftWidth: '2px', paddingLeft: '1em', lineHeight: '1em', display: 'inline-block' }}>{controllevel}</span>
              </Select.Option>
            ))}
          </Select>
        ),
      },
    ];

    return (
      <PageHeaderLayout
        title={BREADCRUMBLIST[BREADCRUMBLIST.length - 1].title}
        breadcrumbList={breadcrumbList}
      >
        <Card style={{ marginBottom: 15 }}>
          <ToolBar
            fields={unitType === 4 ? FIELDS.filter(item => item.id !== 'companyName') : FIELDS}
            action={toolBarAction}
            onSearch={this.handleSearch}
            onReset={this.handleReset}
          />
        </Card>
        <div className={styles1.container}>
          {list.length > 0 ? (
            <Table
              bordered
              rowKey="id"
              loading={loading}
              columns={
                unitType === 4
                  ? [...COLUMNS.slice(1, COLUMNS.length), ...extraColumns]
                  : [...COLUMNS, ...extraColumns]
              }
              dataSource={list}
              scroll={{ x: 'max-content' }}
              pagination={{
                current: pageNum,
                pageSize,
                total,
                showQuickJumper: true,
                showSizeChanger: true,
                // pageSizeOptions: ['5', '10', '15', '20'],
                onChange: this.handlePageChange,
                onShowSizeChange: (num, size) => {
                  this.handlePageChange(1, size);
                },
              }}
            />
          ) : (
              <Card bordered={false} style={{ textAlign: 'center' }}>
                <span>暂无数据</span>
              </Card>
            )}
        </div>
        <Modal
          title="导入"
          visible={modalVisible}
          closable={false}
          footer={[
            <Button disabled={importLoading} onClick={this.handleImportClose}>
              返回
            </Button>,
          ]}
        >
          <Form>
            <Form.Item {...formItemLayout} label="导入数据">
              <Upload
                name="file"
                accept=".xls"
                headers={{ 'JA-Token': getToken() }}
                action={`/acloud_new/v2/ci/doubleBill/importSafetyControl/${areaId}/${companyId}`} // 上传地址
                fileList={fileList}
                onChange={this.handleImportChange}
              >
                <Button disabled={importLoading}>
                  {uploadExportButton}
                  点击
                </Button>
              </Upload>
            </Form.Item>
          </Form>
        </Modal>
        <Modal
          width={750}
          title="选择责任人"
          visible={personModalVisible}
          onOk={this.submitPerson}
          onCancel={() => { this.setState({ personModalVisible: false }) }}
        >
          <Transfer
            dataSource={personList}
            titles={['待选择', '已选择']}
            targetKeys={targetKeys}
            selectedKeys={selectedKeys}
            onChange={this.handleChange}
            onSelectChange={this.handleSelectChange}
            render={item => item.title}
            listStyle={{
              width: 300,
              height: 400,
            }}
            showSearch
            onSearch={this.onPersonSearch}
            filterOption={(inputValue, option) => option.title.indexOf(inputValue) > -1}
          />
        </Modal>
        <Modal
          width={900}
          title="历史记录"
          visible={historyModalVisible}
          closable={false}
          footer={[
            <Button onClick={() => this.setState({ historyModalVisible: false })}>
              关闭
            </Button>,
          ]}
        >
          {list.length > 0 ? (
            <Table
              bordered
              rowKey="id"
              loading={loading}
              columns={
                unitType === 4
                  ? [...COLUMNS.slice(1, COLUMNS.length), ...extraColumns.slice(0, extraColumns.length - 1)]
                  : [...COLUMNS, ...extraColumns.slice(0, extraColumns.length - 1)]
              }
              dataSource={history.list}
              scroll={{ x: 'max-content' }}
              pagination={{
                current: history.pagination.pageNum,
                pageSize: history.pagination.pageSize,
                total: history.pagination.total,
                showQuickJumper: true,
                showSizeChanger: true,
                onChange: this.fetchHistory,
                onShowSizeChange: (num, size) => {
                  this.fetchHistory(1, size);
                },
              }}
            />
          ) : (
              <div bordered={false} style={{ textAlign: 'center' }}>
                <span>暂无数据</span>
              </div>
            )}
        </Modal>
      </PageHeaderLayout>
    );
  }
}
