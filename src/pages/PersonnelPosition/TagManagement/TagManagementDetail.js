import React, { PureComponent, Fragment } from 'react';
import { Form, Button, Card, Row, Col } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import router from 'umi/router';
import { connect } from 'dva';

const FormItem = Form.Item;

const title = "标签详情"
const breadcrumbList = [
  { title: '首页', name: '首页', href: '/' },
  { title: '人员定位', name: '人员定位' },
  { title: '标签管理', name: '标签管理', href: '/personnel-position/tag-management/list' },
  { title, name: title },
]

const rowStyle = {
  marginBottom: '24px',
  lineHeight: '1.5',
}

@Form.create()
@connect(({ personnelPosition }) => ({
  personnelPosition,
}))
export default class TagManagementDetail extends PureComponent {

  state = {
    newSysName: '',
  }

  componentDidMount() {
    const {
      dispatch,
      location: { query: { id } },
    } = this.props
    dispatch({
      type: 'personnelPosition/fetchTagDetail',
      payload: {
        pageNum: 1,
        pageSize: 0,
        cardId: id,
      },
      callback: (detail) => {
        // 获取系统配置列表
        dispatch({
          type: 'personnelPosition/fetchSystemConfiguration',
          payload: { pageNum: 1, pageSize: 0, companyId: detail.companyId },
          callback: (list = []) => {
            if (list.length === 0) {
              this.setState({ newSysName: '' })
              return
            }
            const newSysName = this.generateSysName(detail.sysId, list)
            this.setState({ newSysName })
          },
        })
      },
    })
  }

  // 根据系统id获取系统名称
  generateSysName = (id, list) => {
    const [item] = list.filter(item => item.id === id)
    return item.sysName || '暂无数据'
  }

  renderRow = (label, content) => {
    return (
      <Row style={rowStyle}>
        <Col span={24} style={{ textAlign: 'center', color: 'rgba(0,0,0,0.85)' }}>{label}：{content}</Col>
      </Row>
    )
  }

  render() {
    const {
      personnelPosition: {
        tag: {
          detail: {
            code,
            sysId,
            sysName,
            userName,
            phoneNumber,
            type,        // 分类 0 普通卡 1 临时卡
          } = {},
        },
        systemConfiguration: { sysList = [] },
      },
    } = this.props
    const { newSysName } = this.state
    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
      >
        <Card>
          {this.renderRow('标签号', code)}
          {this.renderRow('所属系统', newSysName)}
          {this.renderRow('标签分类', +type === 0 ? '普通卡' : '临时卡')}
          {+type === 0 && (
            <Fragment>
              {this.renderRow('持卡人', userName || '暂无数据')}
              {this.renderRow('联系方式', phoneNumber || '暂无数据')}
            </Fragment>
          )}
          {/* <div style={{ marginTop: '24px', textAlign: 'center' }}>
            <Button onClick={() => { router.push('/personnel-position/tag-management/list') }}>返回</Button>
          </div> */}
        </Card>
      </PageHeaderLayout>
    )
  }
}
