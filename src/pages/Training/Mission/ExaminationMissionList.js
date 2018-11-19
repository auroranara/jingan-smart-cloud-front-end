import React, { PureComponent } from 'react';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import { Card, List, Button, Form, Col, Row, Input, Select } from 'antd';
import Ellipsis from '@/components/Ellipsis';
import { connect } from 'dva';
import router from 'umi/router';
import { AuthLink, AuthButton, AuthSpan } from '@/utils/customAuth';
import moment from 'moment';
import styles from './ExaminationMissionList.less'

import logoExpired from '../../../assets/mission-expired.png';// 已过期
import logoNotStarted from '../../../assets/mission-not-started.png'; // 未开始
import logoProcessing from '../../../assets/mission-processing.png'; // 进行中

const FormItem = Form.Item;
const { Option } = Select;

const status = [
  { value: '1', label: '未开始' },
  { value: '2', label: '进行中' },
  { value: '3', label: '已结束' },
]
const breadcrumbList = [
  { title: '首页', name: '首页', href: '/' },
  { title: '培训', name: '培训' },
  { title: '考试任务', name: '考试任务' },
]

const colLayout = {
  xl: 8, md: 12, sm: 24, xs: 24,
}

/* 暂无数据 */
const getEmptyData = () => (<span style={{ color: 'rgba(0,0,0,0.45)' }}>暂无数据</span>)

@Form.create()
@connect(({ examinationMission }) => ({
  examinationMission,
}))
export default class ExaminationMissionList extends PureComponent {

  componentDidMount() {
    const {
      dispatch,
    } = this.props
    dispatch({
      type: 'examinationMission/fetchExamination',
      payload: {
        pageNum: 1,
        pageSize: 10,
      },
    })
  }

  // 点击新增
  handleToAdd = () => {
    router.push('/training/mission/add')
  }

  render() {
    const {
      form: { getFieldDecorator },
      examinationMission: {
        list,
      },
    } = this.props
    return (
      <PageHeaderLayout
        title="考试任务"
        breadcrumbList={breadcrumbList}
      >
        <Card className={styles.missionListCard}>
          <Form>
            <Row gutter={20}>
              <Col {...colLayout}>
                <FormItem>
                  {getFieldDecorator('name')(
                    <Input placeholder="请输入考试名称" />
                  )}
                </FormItem>
              </Col>
              <Col {...colLayout}>
                <FormItem>
                  {getFieldDecorator('status')(
                    <Select placeholder="任务状态" >
                      {status.map(({ value, label }) => (
                        <Option key={value} value={value}>{label}</Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col {...colLayout}>
                <FormItem>
                  <Button style={{ marginRight: '10px' }} type="primary">查询</Button>
                  <Button style={{ marginRight: '10px' }}>重置</Button>
                  <Button type="primary" onClick={this.handleToAdd}>新增</Button>
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Card>

        <List
          className={styles.missionList}
          style={{ marginTop: '20px' }}
          grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
          dataSource={list}
          renderItem={item => (
            <List.Item>
              <Card
                actions={[
                  <AuthLink
                    code={'training.mission.view'}
                    to={'/training/mission/view'}
                  >
                    查看
                </AuthLink>,
                  <AuthLink
                    code={'training.mission.edit'}
                    to={'/training/mission/edit'}
                  >
                    编辑
                </AuthLink>,
                ]}
                title={(<Ellipsis tooltip lines={1}>{item.name}</Ellipsis>)}>
                <Row>
                  <Col span={24}>
                    <Ellipsis className={styles.ellipsisText} tooltip lines={1}>
                      考试规则：{item.arrRuleTypeName.join('/')}
                    </Ellipsis>
                  </Col>
                  <Col span={24}>
                    <Ellipsis className={styles.ellipsisText} tooltip lines={1}>
                      考试时长：{item.examLimit}分钟
                    </Ellipsis>
                  </Col>
                  <Col span={24}>
                    <Ellipsis className={styles.ellipsisText} tooltip lines={1}>
                      合格率：{item.percentOfPass}%
                    </Ellipsis>
                  </Col>
                  <Col span={24}>
                    <Ellipsis className={styles.ellipsisText} tooltip lines={1}>
                      考试期限：{moment(item.startTime).format('YYYY-MM-DD HH:mm')} 至 {moment(item.endTime).format('YYYY-MM-DD HH:mm')}
                    </Ellipsis>
                  </Col>
                </Row>
                <div
                  className={styles.statusLogo}
                  style={{
                    background: `url(${(item.status === '1' && logoNotStarted) || (item.status === '2' && logoProcessing) || (item.status === '3' && logoExpired)})`,
                    backgroundSize: '100% 100%',
                  }}
                ></div>
              </Card>
            </List.Item>
          )}
        />

      </PageHeaderLayout>
    )
  }
}
