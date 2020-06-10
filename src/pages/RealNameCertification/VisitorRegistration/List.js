import React, { PureComponent } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Button, Card, Empty, Input, Table, message } from 'antd';
import '@ant-design/compatible/assets/index.css';
import { AuthButton, AuthA } from '@/utils/customAuth';
import ToolBar from '@/components/ToolBar';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import CompanyModal from '../../BaseInfo/Company/CompanyModal';
import { BREADCRUMBLIST, ROUTER, SEARCH_FIELDS, getTableColumns, EditModal } from './utils';
import codes from '@/utils/codes';

// 权限
const {
  realNameCertification: {
    visitorRegistration: { add: addCode, record: recordCode },
  },
} = codes;

@connect(({ user, learning, visitorRegistration, loading }) => ({
  user,
  learning,
  visitorRegistration,
  loading: loading.models.visitorRegistration,
}))
export default class TableList extends PureComponent {
  constructor(props) {
    super(props);
    this.pageNum = 1;
    this.pageSize = 10;
    this.state = {
      formData: {},
      modalTitle: '', // 弹窗标题
      modalStatus: '', // 弹窗状态
      modalVisible: false, // 弹窗是否可见
      detail: {}, // 详情
      visible: false,
      company: {},
      cardOptions: [],
    };
  }

  componentDidMount () {
    const {
      dispatch,
      user: {
        isCompany,
        currentUser: { companyId, companyName },
      },
      learning: { searchInfo },
    } = this.props;
    if (isCompany) {
      this.setState({ company: { id: companyId, name: companyName } }, () => {
        this.fetchList(1, 10, { companyId });
      });
    } else if (searchInfo && searchInfo.companyId) {
      this.setState({ company: { id: searchInfo.companyId, name: searchInfo.companyName } }, () => {
        this.fetchList(1, 10, { companyId: searchInfo.companyId });
      });
    } else {
      dispatch({ type: 'learning/saveSearchInfo' });
    }
  }

  setFormReference = toobar => {
    this.form = toobar && toobar.props && toobar.props.form;
  };

  fetchList = (pageNum = 1, pageSize = 10, params = {}) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'visitorRegistration/fetchHasVisitorList',
      payload: {
        ...params,
        pageSize,
        pageNum,
      },
    });
  };

  handleSearch = () => {
    const values = this.form.getFieldsValue();
    this.fetchList(1, this.pageSize, { ...values });
  };

  handleReset = () => {
    this.form.resetFields();
    this.fetchList(1, this.pageSize);
  };

  handleAdd = () => {
    router.push(`${ROUTER}/add`);
  };

  handlePageChange = (pageNum, pageSize) => {
    const values = this.form.getFieldsValue();
    this.pageNum = pageNum;
    this.pageSize = pageSize;
    this.fetchList(pageNum, pageSize, { ...values });
  };

  handleDelete = id => {
    const { dispatch } = this.props;
    const { company } = this.state;
    dispatch({
      type: 'visitorRegistration/fetchCancelCard',
      payload: { id: id },
      callback: (success, msg) => {
        if (success) {
          message.success(`退卡成功`);
          this.fetchList(1, 10, { companyId: company.id });
        } else {
          message.error(msg || `退卡失败`);
        }
      },
    });
  };

  // 打开新建访客登记弹窗
  handleShowModal = (status, text = {}) => {
    const {
      dispatch,
      user: {
        currentUser: { companyId },
      },
    } = this.props;
    const { company } = this.state;
    this.setState({
      modalVisible: true,
      modalStatus: status,
      modalTitle: status === 'add' && '访客登记',
      detail: { ...text },
    });
    // dispatch({
    //   type: 'visitorRegistration/fetchCardList',
    //   payload: { pageNum: 1, pageSize: 200, companyId: company.id || companyId, status: 1 },
    // });
    dispatch({
      type: 'visitorRegistration/fetchCardOptions',
      payload: { companyId: company.id || companyId },
      callback: (list) => {
        this.setState({ cardOptions: list || [] })
      },
    });
  };

  // 提交
  handleModalAdd = formData => {
    const { dispatch } = this.props;
    const { company } = this.state;

    dispatch({
      type: 'visitorRegistration/fetchVisitorAdd',
      payload: { ...formData },
      callback: response => {
        if (response && response.code === 200) {
          this.handleModalClose();
          this.fetchList(1, 10, { companyId: company.id });
          message.success('新建成功！');
        } else message.error(response.msg);
      },
    });
  };

  // 关闭弹窗
  handleModalClose = () => {
    this.setState({ modalVisible: false });
  };

  // 跳转到访客卡列表
  hanldleCardAdd = () => {
    router.push(`/personnel-management/tag-card/visitor-card-add`);
  };

  handleFocus = () => {
    const { dispatch } = this.props;
    this.setState({ visible: true });
    dispatch({
      type: 'learning/fetchCompanies',
      payload: {
        pageSize: 10,
        pageNum: 1,
      },
    });
  };

  fetchCompany = ({ payload }) => {
    const { dispatch } = this.props;
    dispatch({ type: 'learning/fetchCompanies', payload });
  };

  handleClose = () => {
    this.setState({ visible: false });
  };

  handleSelect = company => {
    const { dispatch } = this.props;
    this.fetchList(1, 10, { companyId: company.id });
    // 保存企业选择框数据
    dispatch({
      type: 'learning/saveSearchInfo',
      payload: {
        companyId: company.id,
        companyName: company.name,
      },
    });
    this.setState({ company, visible: false });
  };

  // 渲染企业模态框
  renderModal () {
    const {
      learning: { modal },
      loading,
    } = this.props;
    const { visible } = this.state;
    return (
      <CompanyModal
        loading={loading}
        visible={visible}
        modal={modal}
        fetch={this.fetchCompany}
        onSelect={this.handleSelect}
        onClose={this.handleClose}
      />
    );
  }

  render () {
    const {
      loading,
      user: {
        currentUser: { companyId, unitType },
      },
      visitorRegistration: {
        hasRegistrationData: {
          list = [],
          pagination: { total, pageNum, pageSize },
        },
        // cardData: { list: cardList = [] },
      },
    } = this.props;
    const { company, cardOptions } = this.state;

    const breadcrumbList = Array.from(BREADCRUMBLIST);
    breadcrumbList.push({ title: '列表', name: '列表' });

    const columns = getTableColumns(this.handleDelete, unitType);

    const modalData = {
      ...this.state,
      unitType,
      cardList: cardOptions,
      companyId: companyId || company.id,
      handleModalClose: this.handleModalClose,
      handleModalAdd: this.handleModalAdd,
      handleModalEdit: this.handleModalEdit,
      hanldleCardAdd: this.hanldleCardAdd,
      list,
    };

    return (
      <PageHeaderLayout
        title={BREADCRUMBLIST[BREADCRUMBLIST.length - 1].title}
        breadcrumbList={breadcrumbList}
        content={
          unitType !== 4 && (
            <div>
              <Input
                style={{ width: '300px' }}
                placeholder={'请选择单位'}
                value={company.name}
                disabled
              />
              <Button type="primary" style={{ marginLeft: '5px' }} onClick={this.handleFocus}>
                选择单位
              </Button>
            </div>
          )
        }
      >
        {company && company.id ? (
          <div>
            <Card style={{ marginBottom: 15 }}>
              <ToolBar
                fields={SEARCH_FIELDS}
                searchable={false}
                resetable={false}
                wrappedComponentRef={this.setFormReference}
              />
              <div style={{ textAlign: 'right' }}>
                <Button style={{ marginRight: '10px' }} type="primary" onClick={this.handleSearch}>
                  查询
                </Button>
                <Button style={{ marginRight: '10px' }} onClick={this.handleReset}>
                  重置
                </Button>
              </div>
            </Card>
            <Card
              title="已登记卡列表"
              extra={
                <div>
                  <AuthButton
                    code={addCode}
                    type="primary"
                    style={{ marginRight: '10px' }}
                    onClick={() => {
                      this.handleShowModal('add');
                    }}
                  >
                    访客登记
                  </AuthButton>
                  <AuthA
                    code={recordCode}
                    // href={`#${ROUTER}/record/${company.id}`}
                    onClick={e => window.open(`${window.publicPath}#${ROUTER}/record/${company.id}`)}
                  >
                    访客登记记录
                  </AuthA>
                </div>
              }
            >
              {list.length ? (
                <Table
                  rowKey="id"
                  bordered
                  loading={loading}
                  columns={columns}
                  dataSource={list}
                  pagination={{
                    current: pageNum,
                    pageSize,
                    total,
                    showQuickJumper: true,
                    showSizeChanger: true,
                    showTotal: t => `共 ${t} 条记录`,
                    // pageSizeOptions: ['5', '10', '15', '20'],
                    onChange: this.handlePageChange,
                    onShowSizeChange: (num, size) => {
                      this.handlePageChange(1, size);
                    },
                  }}
                />
              ) : (
                  <Empty />
                )}
            </Card>
          </div>
        ) : (
            <div style={{ textAlign: 'center' }}>{'请先选择单位'}</div>
          )}
        {unitType !== 4 && this.renderModal()}
        <EditModal {...modalData} />
      </PageHeaderLayout>
    );
  }
}
