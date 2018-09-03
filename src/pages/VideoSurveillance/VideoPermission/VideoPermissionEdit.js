import React, { PureComponent, Fragment } from 'react';
import { Card, Select, Button, Row, Col, Table, message, Spin } from 'antd'
import { connect } from 'dva';
import PageHeaderLayout from '../../layouts/PageHeaderLayout.js';
import AsyncTreeModal from 'components/AsyncTreeModal'
import styles from './VideoPermissionList.less'
import debounce from 'lodash/debounce';
import _ from 'lodash';

const Option = Select.Option

@connect(({ video, loading, user }) => ({
  video,
  user,
  optionsLoading: loading.effects['video/fetchCompanyOptions'],
}))
export default class VideoPermissionEdit extends PureComponent {
  constructor(props) {
    super(props)
    this.handleSearch = debounce(this.handleSearch, 800)
  }
  state = {
    visible: false,
    confirmLoading: false,
    tree: [],
    checkedKeys: {
      checked: [],
      halfChecked: [],
    },
    type: 'company',
    departmentId: '',
    selectedCompanyId: '',
    expandedKeys: [],
    expandedId: '',
    buttonPermission: true,
    autoExpandParent: true,
  }

  componentDidMount() {
    const { dispatch, match: { params: { companyId }, path } } = this.props

    if (companyId) {
      // 获取企业信息
      dispatch({
        type: 'video/fetchCompanyDetail',
        payload: { id: companyId },
      })
      // 获取部门树
      dispatch({
        type: 'video/fetchDepartmentList',
        payload: { companyId },
      })
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props
    dispatch({
      type: 'video/saveDepartmentTree',
      payload: [],
    })
    dispatch({
      type: 'video/saveCompanyOptions',
      payload: [],
    })
  }

  // 打开企业设置权限弹窗
  handleSetPermission = () => {
    const { dispatch, match: { params: { companyId } } } = this.props
    const { selectedCompanyId } = this.state
    const buttonPermission = this.checkButtonPermission('company')

    const success = (list) => {
      const temp = list.map(item => {
        return { ...item, parentIds: '0' }
      })
      // checkedStatus 0不选 1半选 2选中
      const checked = [...list].filter(item => item.checkedStatus === 2).map(item => item.id)
      const halfChecked = [...list].filter(item => item.checkedStatus === 1).map(item => item.id)
      this.setState({
        tree: temp,
        visible: true,
        checkedKeys: { checked, halfChecked },
        type: 'company',
        departmentId: null,
        expandedKeys: halfChecked,
        buttonPermission,
      })
    }
    const error = (msg) => {
      message.error(msg)
    }
    if (companyId) {
      // 编辑企业权限
      dispatch({
        type: 'video/fetchVideoTree',
        payload: { cId: companyId },
        success,
        error,
      })
    } else if (selectedCompanyId) {
      // 新增企业权限
      dispatch({
        type: 'video/fetchVideoTree',
        payload: { cId: selectedCompanyId },
        success,
        error,
      })
    } else {
      message.error('请选择单位！')
    }
  }

  // 打开设置部门权限弹窗
  handleDepPermission = (departmentId) => {
    const { dispatch, match: { params: { companyId } } } = this.props
    const { selectedCompanyId } = this.state
    const buttonPermission = this.checkButtonPermission('department')
    dispatch({
      type: 'video/fetchVideoTree',
      payload: { dId: departmentId, cId: companyId || selectedCompanyId },
      success: (list) => {
        const temp = list.map(item => {
          return { ...item, parentIds: '0' }
        })
        // checkedStatus 0不选 1半选 2选中
        const checked = [...list].filter(item => item.checkedStatus === 2).map(item => item.id)
        const halfChecked = [...list].filter(item => item.checkedStatus === 1).map(item => item.id)
        this.setState({
          tree: temp,
          visible: true,
          checkedKeys: { checked, halfChecked },
          type: 'department',
          departmentId,
          expandedKeys: halfChecked,
          buttonPermission,
        })
      },
      error: (msg) => {
        message.error(msg)
      },
    })
  }

  // 保存state,接收一个对象
  saveParentStates = (params) => {
    this.setState({
      ...params,
    })
  }

  // 企业下拉查询
  handleSearch = value => {
    const { dispatch } = this.props
    dispatch({
      type: 'video/fetchCompanyOptions',
      payload: {
        name: value,
        eye: 0,
      },
    })
  }

  handleSelect = value => {
    const { dispatch } = this.props
    dispatch({
      type: 'video/saveDepartmentTree',
      payload: [],
    })
    this.setState({ selectedCompanyId: value }, () => {
      dispatch({
        type: 'video/fetchDepartmentList',
        payload: { companyId: value },
      })
    })
  }

  handleClose = () => {
    this.setState({
      visible: false,
    })
  }

  // 返回弹窗确定按钮的disabled状态
  checkButtonPermission = (type) => {
    const {
      user: {
        currentUser: { unitType, departmentId } = {},
      },
    } = this.props
    if (unitType && unitType === 3) {
      // 运营账号
      return true
    } else {
      // 如果是企业账号
      return type !== 'company' && !departmentId
    }
  }

  // 提交时如果是勾选就不上传子节点id了
  getCheckedIdsWithoutChildren = (list, { checked, halfChecked }) => {
    if (list && list.length) {
      return list.map((item) => {
        if (checked.includes(item.id) && item.disabled !== 1) {
          return item.id;
        } else if (halfChecked.includes(item.id) || item.disabled !== 0) {
          return this.getCheckedIdsWithoutChildren(item.children, { checked, halfChecked });
        } else {
          return [];
        }
      });
    }
    return [];
  }

  // 保存权限配置
  doSavePermission = (checkedKeys) => {
    const { dispatch, match: { params: { companyId } } } = this.props
    const { type, departmentId, selectedCompanyId, tree } = this.state
    this.setState({
      confirmLoading: true,
    });
    const ids = _.flattenDeep(this.getCheckedIdsWithoutChildren(tree, checkedKeys));
    const checkedIds = ids.join(',')

    const data = type === 'company' ? { checkedIds, linkType: 1, linkId: companyId || selectedCompanyId } : { checkedIds, linkType: 2, linkId: departmentId }

    dispatch({
      type: 'video/bindVodeoPermission',
      payload: data,
      callback: (res) => {
        if (res && res.code === 200) {
          message.success('设置权限成功！')
          this.setState({
            visible: false,
            confirmLoading: false,
          });
        } else {
          message.error('设置权限失败！')
          this.setState({
            confirmLoading: false,
          })
        }
      },
    })
  }

  // 点击树节点加载子节点
  handleLoadData = (data, callback) => {
    const { dispatch, match: { params: { companyId } } } = this.props
    const { id } = data;
    const { departmentId, checkedKeys, selectedCompanyId, expandedId, expandedKeys } = this.state

    this.setState({
      loading: true,
    });
    // 调用接口获取当前节点的子元素
    dispatch({
      type: 'video/fetchVideoTree',
      payload: { parentId: id, cId: companyId || selectedCompanyId, dId: departmentId },
      success: list => {
        const tempList = list.map((item) => {
          return data.parentIds ? { ...item, parentIds: `${data.parentIds}','${id}` } : { ...item, parentIds: `${id}` }
        });
        const checked = tempList.filter(item => item.checkedStatus === 2).map(item => item.id)
        const halfChecked = tempList.filter(item => item.checkedStatus === 1).map(item => item.id)
        // callback必须调用
        callback(tempList);
        data.children = tempList; // eslint-disable-line
        // const expand = tempList.filter(item => item.checkedStatus === 2 && !item.isVideo).map(item => item.id)
        this.setState({
          tree: [...this.state.tree],
          loading: false,
          checkedKeys: {
            checked: [...new Set([...checkedKeys.checked, ...checked])],
            halfChecked: [...new Set([...checkedKeys.halfChecked, ...halfChecked])],
          },
          expandedKeys: expandedId ? [...new Set([...expandedKeys, expandedId])] : [...expandedKeys, ...halfChecked],
          // expandedKeys: [...checkedKeys.halfChecked, ...halfChecked],
          expandedId: '',
        });
      },
    })
  }

  // 渲染企业信息
  renderCompany = () => {
    const {
      optionsLoading,
      video: { permission: { companyDetail, companyOptions } },
      match: { params: { companyId } },
      user: { currentUser: { departmentId } = {} },
    } = this.props

    const options = (companyOptions.length && companyOptions.map(d => <Option key={d.id}>{d.name}</Option>)) || [];
    return (
      <Card title="单位信息">
        <Row>
          <Col span={9}>
            {companyId ? (
              <div>单位名称：{companyDetail.name}</div>
            ) : (
                <Select
                  showSearch
                  placeholder="请选择单位"
                  notFoundContent={optionsLoading ? <Spin size="small" /> : '暂无数据'}
                  onSearch={this.handleSearch}
                  onSelect={this.handleSelect}
                  defaultActiveFirstOption={false}
                  showArrow={false}
                  filterOption={false}
                  style={{ width: '100%' }}
                >
                  {options}
                </Select>
              )}
          </Col>
          <Col span={4} offset={1}>
            <Button disabled={!!departmentId} onClick={() => this.handleSetPermission()} type="primary">设置视频权限</Button>
          </Col>
        </Row>
      </Card>
    )
  }

  // 渲染部门信息
  renderDepartment = () => {
    const { video: { permission: { departmentTree } } } = this.props
    const columns = [
      {
        title: '部门名称',
        dataIndex: 'name',
        key: 'name',
        width: '50%',
      },
      {
        title: '部门人数',
        dataIndex: 'allUserCount',
        key: 'allUserCount',
        width: '20%',
        align: 'center',
      },
      {
        title: '视频权限',
        key: '视频权限',
        align: 'center',
        render: (val, rows) => (
          <Fragment>
            <a onClick={() => this.handleDepPermission(rows.id)}>设置</a>
          </Fragment>
        ),
      },
    ]
    return (
      <Card style={{ marginTop: '20px' }} title="部门信息">
        {departmentTree && departmentTree.length ? (
          <Table
            rowKey="id"
            columns={columns}
            dataSource={departmentTree}
            pagination={false}
            defaultExpandAllRows={true}
          ></Table>) : (
            <div style={{ textAlign: 'center' }}>暂无数据</div>
          )}
      </Card>
    )
  }

  render() {
    const { match: { params: { companyId } } } = this.props
    const { visible, confirmLoading, tree, checkedKeys, expandedKeys, buttonPermission, autoExpandParent } = this.state

    const title = companyId ? "编辑视频权限" : "新增视频权限"

    const breadcrumbList = [
      {
        title: '首页',
        name: '首页',
        href: '/',
      },
      {
        title: '视频监控',
        name: '视频监控',
      },
      {
        title: '视频权限',
        name: '视频权限',
        href: '/video-surveillance/video-permission/list',
      },
      {
        title,
        name: title,
      },
    ]

    return (
      <PageHeaderLayout title={title} breadcrumbList={breadcrumbList}>
        {this.renderCompany()}
        {this.renderDepartment()}
        <AsyncTreeModal
          visible={visible}
          confirmLoading={confirmLoading}
          // loading={loading}
          title="设置视频权限"
          onCancel={this.handleClose}
          onOk={this.doSavePermission}
          buttonPermission={buttonPermission}
          saveParentStates={this.saveParentStates}
          autoExpandParent={autoExpandParent}
          tree={{
            dataSource: tree,
            checkable: true,
            checkedKeys: checkedKeys,
            loadData: this.handleLoadData,
            expandedKeys: expandedKeys,
            fieldNames: {
              id: 'id',
              title: 'name',
            },
          }}
        />
      </PageHeaderLayout>
    )
  }
}
