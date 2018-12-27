import React, { PureComponent } from 'react';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import { Card, List, Button, Form, Col, Row, Input, Select, Spin, Popconfirm, message } from 'antd';
import moment from 'moment';
import Ellipsis from '@/components/Ellipsis';
import { connect } from 'dva';
import router from 'umi/router';
import InfiniteScroll from 'react-infinite-scroller';
import { AuthLink, AuthA } from '@/utils/customAuth';
import styles from './ExaminationMissionList.less';
import CompanyModal from '../../BaseInfo/Company/CompanyModal';

import logoExpired from '../../../assets/mission-expired.png'; // 已过期
import logoNotStarted from '../../../assets/mission-not-started.png'; // 未开始
import logoProcessing from '../../../assets/mission-processing.png'; // 进行中

const FormItem = Form.Item;
const { Option } = Select;

const status = [
  { value: '1', label: '未开始' },
  { value: '2', label: '进行中' },
  { value: '3', label: '已过期' },
];
const breadcrumbList = [
  { title: '首页', name: '首页', href: '/' },
  { title: '教育培训', name: '教育培训' },
  { title: '考试任务', name: '考试任务' },
];

const colLayout = {
  xl: 8,
  md: 12,
  sm: 24,
  xs: 24,
};

const companyPageSize = 10;

const PAGE_SIZE = 18;

/* 暂无数据 */
// const getEmptyData = () => <span style={{ color: 'rgba(0,0,0,0.45)' }}>暂无数据</span>;

@Form.create()
@connect(({ examinationMission, user, knowledgeTree, loading }) => ({
  examinationMission,
  user,
  knowledgeTree,
  companyLoading: loading.models.knowledgeTree,
  initLoading: loading.effects['examinationMission/fetchExamination'],
  loading: loading.effects['examinationMission/appendExamination'],
}))
export default class ExaminationMissionList extends PureComponent {
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
      examinationMission: { searchInfo },
      form: { setFieldsValue },
    } = this.props;
    this.companyId = companyId;
    if (searchInfo && searchInfo.companyId) {
      this.companyId = searchInfo.companyId;
      this.companyName = searchInfo.companyName;
    }
    const payload = { pageSize: companyPageSize, pageNum: 1 };
    if (!companyId) this.fetchCompany({ payload });
    setTimeout(() => {
      searchInfo && setFieldsValue({ name: searchInfo.name, statusQuery: searchInfo.statusQuery });
    }, 100);
    this.getExamList();
  }

  fetchCompany = ({ payload }) => {
    const { dispatch } = this.props;
    dispatch({ type: 'knowledgeTree/fetchCompanies', payload });
  };

  getExamList = values => {
    const {
      dispatch,
      examinationMission: { searchInfo },
    } = this.props;
    const data = searchInfo || {};
    dispatch({
      type: 'examinationMission/fetchExamination',
      payload: {
        pageNum: 1,
        pageSize: PAGE_SIZE,
        companyId: this.companyId,
        ...data,
      },
    });
  };

  // 点击新增
  handleToAdd = () => {
    router.push(`/training/mission/add`);
  };

  handleSearch = () => {
    const {
      dispatch,
      form: { getFieldsValue },
      examinationMission: { searchInfo },
    } = this.props;
    const values = getFieldsValue();
    dispatch({
      type: 'examinationMission/fetchExamination',
      payload: {
        pageNum: 1,
        pageSize: PAGE_SIZE,
        companyId: this.companyId,
        ...values,
      },
    });
    dispatch({
      type: 'examinationMission/saveSearchInfo',
      payload: {
        ...searchInfo,
        ...values,
      },
    });
  };

  handleReset = () => {
    const {
      dispatch,
      examinationMission: { searchInfo },
      form: { resetFields },
    } = this.props;
    // 清空筛选数据
    resetFields();
    dispatch({
      type: 'examinationMission/fetchExamination',
      payload: {
        pageNum: 1,
        pageSize: PAGE_SIZE,
        companyId: this.companyId,
      },
    });
    dispatch({
      type: 'examinationMission/saveSearchInfo',
      payload: {
        ...searchInfo,
        name: undefined,
        statusQuery: undefined,
      },
    });
  };

  handleClose = () => {
    this.setState({ visible: false });
  };

  handleSelect = item => {
    const {
      dispatch,
      user: {
        currentUser: { id: userId },
      },
    } = this.props;
    const { id, name } = item;
    this.companyId = id;
    this.companyName = name;
    this.handleReset();
    dispatch({
      type: 'examinationMission/saveSearchInfo',
      payload: {
        companyId: id,
        companyName: name,
      },
    });
    // 将选中的企业id保存在session中以备不时之需
    sessionStorage.setItem(`examination_mission_list_company_${userId}`, JSON.stringify({ id }));
    this.handleClose();
  };

  renderModal() {
    const {
      knowledgeTree: { educationCompanies },
      companyLoading,
    } = this.props;
    const { visible } = this.state;
    return (
      <CompanyModal
        loading={companyLoading}
        visible={visible}
        modal={educationCompanies}
        fetch={this.fetchCompany}
        onSelect={this.handleSelect}
        onClose={this.handleClose}
      />
    );
  }

  handleLoadMore = () => {
    const {
      dispatch,
      examinationMission: {
        mission: {
          pagination: { pageSize, pageNum },
        },
      },
      form: { getFieldsValue },
    } = this.props;
    const formData = getFieldsValue();
    // 创建分页信息
    const pagination = { pageNum: pageNum + 1, pageSize };
    // 获取列表
    dispatch({
      type: 'examinationMission/appendExamination',
      payload: {
        ...pagination,
        companyId: this.companyId,
        ...formData,
      },
    });
  };

  handleDelete = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'examinationMission/delete',
      payload: {
        id,
      },
      success: () => {
        message.success('删除成功');
      },
      error: res => {
        message.error(res.msg);
      },
    });
  };

  renderList = () => {
    const {
      examinationMission: {
        mission: { list },
      },
    } = this.props;
    return (
      <List
        className={styles.missionList}
        style={{ marginTop: '20px' }}
        grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
        dataSource={list}
        renderItem={item => (
          <List.Item>
            <Card
              actions={[
                <AuthLink code={'training.mission.view'} to={`/training/mission/view/${item.id}`}>
                  查看
                </AuthLink>,
                <AuthLink
                  code={+item.status === 1 ? 'training.mission.edit' : 'training.mission.fuck'}
                  to={`/training/mission/edit/${item.id}`}
                >
                  编辑
                </AuthLink>,
                <Popconfirm
                  title="确定要删除此考试任务？"
                  placement="top"
                  okText="确定"
                  cancelText="取消"
                  onConfirm={() => {
                    this.handleDelete(item.id);
                  }}
                >
                  <AuthA
                    code={+item.status === 1 ? 'training.mission.delete' : 'training.mission.fuck'}
                    // to={`/training/mission/edit/${item.id}`}
                    // onClick={() => {}}
                  >
                    删除
                  </AuthA>
                </Popconfirm>,
              ]}
              title={
                <Ellipsis tooltip lines={1}>
                  {item.name}
                </Ellipsis>
              }
            >
              <Row>
                <Col span={24}>
                  <Ellipsis className={styles.ellipsisText} tooltip lines={1}>
                    考试规则：
                    {item.arrRuleTypeName.join('/')}
                  </Ellipsis>
                </Col>
                <Col span={24}>
                  <Ellipsis className={styles.ellipsisText} tooltip lines={1}>
                    考试时长：
                    {item.examLimit}
                    分钟
                  </Ellipsis>
                </Col>
                <Col span={24}>
                  <Ellipsis className={styles.ellipsisText} tooltip lines={1}>
                    合格率：
                    {item.percentOfPass}%
                  </Ellipsis>
                </Col>
                <Col span={24}>
                  <Ellipsis className={styles.ellipsisText} tooltip lines={1}>
                    考试期限：
                    {moment(item.startTime).format('YYYY-MM-DD HH:mm')} 至
                    {moment(item.endTime).format('YYYY-MM-DD HH:mm')}
                  </Ellipsis>
                </Col>
              </Row>
              <div
                className={styles.statusLogo}
                style={{
                  background: `url(${(item.status === '1' && logoNotStarted) ||
                    (item.status === '2' && logoProcessing) ||
                    (item.status === '3' && logoExpired)}) no-repeat center center`,
                  backgroundSize: '100% 100%',
                }}
              />
            </Card>
          </List.Item>
        )}
      />
    );
  };

  render() {
    const {
      form: { getFieldDecorator },
      examinationMission: {
        mission: {
          pagination: { total, pageNum, pageSize },
        },
      },
      user: {
        currentUser: { companyId, permissionCodes },
      },
      loading,
    } = this.props;

    // 是否有新增权限
    const hasAddAuthority = permissionCodes.includes('training.mission.add');

    return (
      <PageHeaderLayout
        title="考试任务"
        breadcrumbList={breadcrumbList}
        content={
          !companyId && (
            <div>
              <Input
                disabled
                style={{ width: '300px' }}
                placeholder={'请选择单位'}
                value={this.companyName}
              />
              <Button
                type="primary"
                style={{ marginLeft: '5px' }}
                onClick={() => {
                  this.setState({ visible: true });
                  const payload = { pageSize: companyPageSize, pageNum: 1 };
                  this.fetchCompany({ payload });
                }}
              >
                选择单位
              </Button>
              {this.companyId && (
                <div style={{ marginTop: '8px' }}>
                  考试任务总数：
                  {total}
                </div>
              )}
            </div>
          )
        }
      >
        {this.companyId ? (
          <div>
            <Card className={styles.missionListCard}>
              <Form>
                <Row gutter={20}>
                  <Col {...colLayout}>
                    <FormItem>
                      {getFieldDecorator('name')(<Input placeholder="请输入考试名称" />)}
                    </FormItem>
                  </Col>
                  <Col {...colLayout}>
                    <FormItem>
                      {getFieldDecorator('statusQuery')(
                        <Select placeholder="任务状态">
                          {status.map(({ value, label }) => (
                            <Option key={value} value={value}>
                              {label}
                            </Option>
                          ))}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col {...colLayout}>
                    <FormItem>
                      <Button
                        style={{ marginRight: '10px' }}
                        type="primary"
                        onClick={this.handleSearch}
                      >
                        查询
                      </Button>
                      <Button style={{ marginRight: '10px' }} onClick={this.handleReset}>
                        重置
                      </Button>
                      <Button type="primary" onClick={this.handleToAdd} disabled={!hasAddAuthority}>
                        新增
                      </Button>
                    </FormItem>
                  </Col>
                </Row>
              </Form>
            </Card>

            <InfiniteScroll
              initialLoad={false}
              loadMore={() => {
                // 防止多次加载
                !loading && this.handleLoadMore();
              }}
              hasMore={pageNum * pageSize < total}
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
              {/* 列表 */ this.renderList()}
            </InfiniteScroll>
          </div>
        ) : (
          <Card>
            <div style={{ textAlign: 'center' }}>请先选择单位</div>
          </Card>
        )}

        {!companyId && this.renderModal()}
      </PageHeaderLayout>
    );
  }
}
