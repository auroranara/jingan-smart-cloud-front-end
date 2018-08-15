import React, { PureComponent, Fragment } from 'react';
import { Card, Select, Button, Row, Col, Table } from 'antd'
import { connect } from 'dva';
import PageHeaderLayout from '../../layouts/PageHeaderLayout.js';
import AsyncTreeModal from 'components/AsyncTreeModal'
import styles from './VideoPermissionList.less'

const Option = Select.Option

@connect(({ video }) => ({
  video,
}))
export default class VideoPermissionEdit extends PureComponent {
  state = {
    companyId: null,
    visible: false,
    confirmLoading: false,
    tree: [],
    checkedKeys: {
      checked: [],
      halfChecked: [],
    },
    type: 'company',
  }

  // 打开设置权限弹窗
  handleSetPermission = (type) => {
    const { dispatch } = this.props
    dispatch({
      type: 'video/fetchVideoTree',
      callback: (list) => {
        const temp = list.map(item => {
          return { ...item, parentIds: '0' }
        })
        // checkedStatus 0不选 1半选 2选中
        const checked = [...list].filter(item => item.checkedStatus === 1).map(item => item.id)
        const halfChecked = [...list].filter(item => item.checkedStatus === 1).map(item => item.id)
        this.setState({
          tree: temp,
          visible: true,
          checkedKeys: { checked, halfChecked },
          type,
        })
      },
    })
  }

  handleSearch = value => {

  }

  handleSelect = value => {
    this.setState({ companyId: value })
  }

  handleClose = () => {
    this.setState({
      visible: false,
    })
  }

  // 保存权限配置
  doSavePermission = (checkedKeys) => {
    const { dispatch, match: { params: { companyId } } } = this.props
    const { type } = this.state
    this.setState({
      confirmLoading: true,
    });
    const checkedIds = checkedKeys.checked.join(',')
    // const data=(type==='company'&&{checkedIds,linkType:1,linkId:companyId})||(type==='company'&&{checkedIds,linkType:2,linkId:})
    // dispatch({
    //   type: 'video/bindVodeoPermission',
    //   payload: {checkedIds,},
    // })


    // 这里应该调用接口将checkedKeys保存到数据库
    setTimeout(() => {
      console.log(checkedKeys);
      this.setState({
        visible: false,
        confirmLoading: false,
      });
    }, 1000);
  }

  // 点击树节点加载子节点
  handleLoadData = (data, callback) => {
    const { dispatch } = this.props
    const { id } = data;
    this.setState({
      loading: true,
    });
    // 调用接口获取当前节点的子元素
    dispatch({
      type: 'video/fetchVideoTree',
      payload: { parentId: id },
      callback: list => {
        const tempList = list.map((item) => {
          return data.parentIds ? { ...item, parentIds: `${data.parentIds}','${id}` } : { ...item, parentIds: `${id}` }
        });
        // callback必须调用
        callback(tempList);
        data.children = tempList; // eslint-disable-line
        const checked = [...this.state.tree].filter(item => item.checkedStatus === 1).map(item => item.id)
        const halfChecked = [...this.state.tree].filter(item => item.checkedStatus === 1).map(item => item.id)
        this.setState({
          tree: [...this.state.tree],
          loading: false,
          checkedKeys: {
            checked, halfChecked,
          },
        });
      },
    })
  }

  // 渲染企业信息
  renderCompany = () => {
    // const options = companyList.map(d => <Option key={d.value}>{d.text}</Option>);
    return (
      <Card title="单位信息">
        <Row>
          <Col span={9}>
            <Select
              showSearch
              placeholder="请选择单位"
              onSearch={this.handleSearch}
              onChange={this.handleSelect}
              defaultActiveFirstOption={false}
              showArrow={false}
              filterOption={false}
              style={{ width: '100%' }}
            >
              {/* {options} */}
            </Select>
          </Col>
          <Col span={4} offset={1}>
            <Button onClick={() => this.handleSetPermission('company')} type="primary">设置视频权限</Button>
          </Col>
        </Row>
      </Card>
    )
  }

  // 渲染部门信息
  renderDepartment = () => {
    const list = [
      {
        id: '123',
        name: 'test',
      },
    ]
    const columns = [
      {
        title: '部门名称',
        dataIndex: 'name',
        key: 'name',
        width: '50%',
      },
      // {
      //   title: '部门人数',
      //   dataIndex: 'allUserCount',
      //   key: 'allUserCount',
      //   width: '20%',
      //   align: 'center',
      // },
      {
        title: '视频权限',
        key: '视频权限',
        align: 'center',
        render: (val, rows) => (
          <Fragment>
            <a onClick={() => this.handleSetPermission('department')}>添加</a>
          </Fragment>
        ),
      },
    ]
    return (
      <Card style={{ marginTop: '20px' }} title="部门信息">
        {list && list.length ? (
          <Table
            rowKey="id"
            columns={columns}
            dataSource={list}
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
    const { visible, confirmLoading, tree, checkedKeys } = this.state

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
          tree={{
            dataSource: tree,
            checkable: true,
            checkedKeys: checkedKeys,
            loadData: this.handleLoadData,
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
