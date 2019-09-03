import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form,
  List,
  Card,
  Button,
  DatePicker,
  Modal,
  BackTop,
  Spin,
  Col,
  Row,
  message,
} from 'antd';
// import debounce from 'lodash/debounce';
import moment from 'moment';
import InfiniteScroll from 'react-infinite-scroller';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';

import styles from './CompanyList.less';

const FormItem = Form.Item;

const title = '报警历史记录';

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
    title: '出入口监测',
    name: '出入口监测',
    href: '/security-manage/entrance-and-exit-monitor/company-list',
  },
  {
    title,
    name: title,
  },
];

// 默认页面显示数量
const pageSize = 18;

// 默认表单值
const defaultFormData = {
  companyName: undefined,
};

@connect(({ securityManage, hiddenDangerReport, user, loading }) => ({
  securityManage,
  hiddenDangerReport,
  user,
  loading: loading.models.securityManage,
}))
@Form.create()
export default class AlarmRecord extends PureComponent {
  constructor(props) {
    super(props);
    this.formData = defaultFormData;
    this.state = {
      modalVisible: false, // 企业模态框是否可见
      modalList: {},
    };
  }

  // 挂载后
  componentDidMount() {
    const {
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;

    dispatch({
      type: 'securityManage/fetchAlarmRecordList',
      payload: {
        pageSize,
        pageNum: 1,
        companyId: id,
      },
    });
  }

  // 查询
  handleClickToQuery = () => {
    const {
      form: { getFieldsValue },
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;
    const { startDate, endDate } = getFieldsValue();
    const payload = {
      startDate: startDate ? moment(startDate).format('YYYY-MM-DD') : undefined,
      endDate: endDate ? moment(endDate).format('YYYY-MM-DD') : undefined,
    };

    // 重新请求数据
    dispatch({
      type: 'securityManage/fetchAlarmRecordList',
      payload: {
        companyId: id,
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
      match: {
        params: { id },
      },
    } = this.props;
    // 清除筛选条件
    resetFields();
    // 修改表单数据
    this.formData = defaultFormData;
    // 重新请求数据
    dispatch({
      type: 'securityManage/fetchAlarmRecordList',
      payload: {
        companyId: id,
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
      match: {
        params: { companyId },
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
      type: 'securityManage/fetchAlarmRecordMore',
      payload: {
        companyId,
        pageSize,
        pageNum: pageNum + 1,
        ...this.formData,
      },
    });
  };

  handleMoadlDetail = (id, faceId) => {
    const {
      securityManage: {
        AlarmData: { list = [] },
      },
    } = this.props;
    const filterList = list.find(item => item.id === id) || {};
    if (!faceId) {
      return message.error('无法匹配，人脸库无该信息！');
    }
    this.setState({ modalVisible: true, modalList: filterList });
  };

  handleCloseModal = () => {
    this.setState({ modalVisible: false, modalList: {} });
  };

  // 渲染form表单
  renderForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;

    return (
      <Card>
        <Form layout="inline">
          <FormItem label="开始时间">
            {getFieldDecorator('startDate')(
              <DatePicker
                // showTime
                showToday={false}
                format="YYYY-MM-DD"
                placeholder="请选择开始时间"
                style={{ width: 260 }}
              />
            )}
          </FormItem>
          <FormItem label="结束时间">
            {getFieldDecorator('endDate')(
              <DatePicker
                // showTime
                showToday={false}
                format="YYYY-MM-DD"
                placeholder="请选择结束时间"
                style={{ width: 260 }}
              />
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
        </Form>
      </Card>
    );
  }

  // 渲染列表
  renderList() {
    const {
      securityManage: {
        AlarmData: { list = [] },
      },
    } = this.props;

    return (
      <div className={styles.alarmCardList} style={{ marginTop: '24px' }}>
        <List
          rowKey="id"
          grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
          dataSource={list}
          renderItem={(item, index) => {
            const { id, faceId, time, picDetails } = item;
            const url = picDetails.map(item => item.webUrl).join('');
            return (
              <List.Item key={index}>
                <Card
                  className={styles.card}
                  actions={[
                    <span>
                      抓拍时间：
                      {moment(time).format('YYYY-MM-DD HH:mm:ss')}
                    </span>,
                  ]}
                  onClick={() => this.handleMoadlDetail(id, faceId)}
                >
                  <Row>
                    <Col span={24}>
                      <div
                        className={styles.imgConatiner}
                        style={{
                          background: `url(${url})`,
                          backgroundSize: '100% 100%',
                          backgroundRepeat: 'no-repeat',
                          backgroundPosition: 'center center',
                        }}
                      />
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
        isLast,
        AlarmData: { total },
      },
    } = this.props;

    const { modalVisible, modalList } = this.state;

    const { time, name, picDetails = [], faceInfo, similarity, thresholdValue } = modalList || {};

    const {
      provinceDetail,
      cityDetail,
      faceDetails = [],
      faceBirthday,
      faceType,
      identityCardType,
      identityCardNo,
    } = faceInfo || {};

    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
        content={
          <div>
            记录总数：
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
          title="记录详情"
          width={1000}
          visible={modalVisible}
          onCancel={this.handleCloseModal}
          onOk={this.handleRiskSubmit}
          footer={null}
        >
          <div className={styles.mainContent}>
            <div className={styles.imgContent}>
              <div
                className={styles.leftImg}
                style={{
                  background: `url(${picDetails
                    .map(item => item.webUrl)
                    .join('')}) center center / 100% 100% no-repeat `,
                }}
              />
              <div
                className={styles.midImg}
                style={{
                  background: `url(${faceDetails
                    .map(item => item.webUrl)
                    .join('')}) center center / 100% 100% no-repeat`,
                }}
              />
              <div
                className={styles.rightImg}
                style={{
                  background: `url(${faceDetails
                    .map(item => item.webUrl)
                    .join('')}) center center / 100% 100% no-repeat`,
                }}
              />
            </div>
            <div className={styles.itemContent}>
              <div className={styles.time}>
                抓拍时间：
                {moment(time).format('YYYY-MM-DD HH:mm:ss')}
              </div>
              <div className={styles.itemDetail}>
                <div className={styles.item}>
                  <div className={styles.itemLabel}>
                    姓名：
                    {name}
                  </div>
                  <div className={styles.itemLabel}>
                    性别：
                    {+faceType === 1 ? '男' : +faceType === 2 ? '女' : '暂无数据'}
                  </div>
                  <div className={styles.itemLabel}>
                    籍贯：
                    {provinceDetail + cityDetail || '暂无数据'}
                  </div>
                  <div className={styles.itemLabel}>
                    生日：
                    {faceBirthday === null ? '暂无数据' : moment(faceBirthday).format('YYYY-MM-DD')}
                  </div>
                </div>
              </div>
              <div className={styles.itemDetail}>
                <div className={styles.item}>
                  <div className={styles.itemLabel}>
                    证件类型：
                    {+identityCardType === 1
                      ? '军官证'
                      : +identityCardType === 2
                        ? '身份证'
                        : '未知'}
                  </div>
                  <div className={styles.itemLabel}>
                    证件号：
                    {identityCardNo || '暂无数据'}
                  </div>
                  <div className={styles.itemLabel}>人脸库：lmk识别</div>
                  <div className={styles.itemLabel}>
                    阈值：
                    {thresholdValue}
                  </div>
                </div>
              </div>
              <div className={styles.itemDetail}>
                <div className={styles.item}>
                  <span>
                    相似度：
                    {similarity}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      </PageHeaderLayout>
    );
  }
}
