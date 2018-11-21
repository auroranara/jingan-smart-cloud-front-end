import React, { PureComponent } from 'react';
import { Card, Spin, Button, Input } from 'antd';
import { connect } from 'dva';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import EditableTree from './Components/EditableTree';
import CompanyModal from '../../BaseInfo/Company/CompanyModal';

const breadcrumbList = [
  { title: '首页', name: '首页', href: '/' },
  { title: '教育培训', name: '教育培训' },
  { title: '知识体系管理', name: '知识体系管理' },
];
// const companyId = 'UDy_hk40R0GHFhpchPpEtg';
const PAGE_SIZE = 10;
@connect(({ knowledgeTree, loading, user }) => ({
  knowledgeTree,
  loading: loading.models.knowledgeTree,
  user,
}))
export default class KnowledgeSys extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  componentDidMount() {
    const {
      user: {
        currentUser: { companyId },
      },
    } = this.props;
    this.companyId = companyId;
    const payload = { pageSize: PAGE_SIZE, pageNum: 1 };
    if (!companyId) this.fetchCompany({ payload });
    this.getTreeData();
  }

  componentWillUnmount() {}

  fetchCompany = ({ payload }) => {
    const { dispatch } = this.props;
    dispatch({ type: 'knowledgeTree/fetchCompanies', payload });
  };

  renderModal() {
    const {
      knowledgeTree: { educationCompanies },
      loading,
    } = this.props;
    const { visible } = this.state;
    return (
      <CompanyModal
        loading={loading}
        visible={visible}
        modal={educationCompanies}
        fetch={this.fetchCompany}
        onSelect={this.handleSelect}
        onClose={this.handleClose}
      />
    );
  }

  handleClose = () => {
    this.setState({ visible: false });
  };

  handleSelect = item => {
    // const { setFieldsValue } = this.props.form;
    const { id, name } = item;
    this.companyId = id;
    this.companyName = name;
    this.getTreeData();
    this.handleClose();
  };

  getTreeData = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'knowledgeTree/fetchTree',
      payload: {
        companyId: this.companyId,
      },
    });
  };

  editableTreeRef = ref => {
    this.treeRef = ref;
  };

  handleAdd = addInfo => {
    const { dispatch } = this.props;
    dispatch({
      type: 'knowledgeTree/knowledgeTreeAdd',
      payload: {
        ...addInfo,
        companyId: this.companyId,
      },
      success: () => {
        this.getTreeData();
      },
    });
  };

  handleEidt = eidtInfo => {
    const { dispatch } = this.props;
    dispatch({
      type: 'knowledgeTree/edit',
      payload: {
        ...eidtInfo,
      },
      success: () => {
        this.getTreeData();
      },
    });
  };

  handleDelete = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'knowledgeTree/deleteTree',
      payload: {
        id,
      },
      success: () => {
        this.getTreeData();
      },
    });
  };

  handleDrag = info => {
    const { dispatch } = this.props;
    dispatch({
      type: 'knowledgeTree/sort',
      payload: {
        ...info,
      },
      success: () => {
        this.getTreeData();
      },
    });
  };

  render() {
    const {
      dispatch,
      knowledgeTree: { knowledgeTree },
      loading,
    } = this.props;
    const {
      user: {
        currentUser: { companyId },
      },
    } = this.props;
    return (
      <PageHeaderLayout
        title="知识体系管理"
        breadcrumbList={breadcrumbList}
        content={
          !companyId && (
            <Input
              onClick={() => {
                this.setState({ visible: true });
              }}
              style={{ width: '300px', cursor: 'pointer' }}
              placeholder={'请选择企业'}
              value={this.companyName}
            />
          )
        }
      >
        <Card
          title="知识体系分类"
          extra={
            <a
              onClick={() => {
                this.treeRef.handleAdd();
              }}
            >
              添加分类
            </a>
          }
        >
          <Spin spinning={loading}>
            <EditableTree
              onRef={this.editableTreeRef}
              dispatch={dispatch}
              handleAdd={this.handleAdd}
              handleEidt={this.handleEidt}
              handleDelete={this.handleDelete}
              handleDrag={this.handleDrag}
              handleParentChange={newState => {
                this.setState(newState);
              }}
              treeData={knowledgeTree}
            />
          </Spin>
        </Card>
        {!companyId && this.renderModal()}
      </PageHeaderLayout>
    );
  }
}
