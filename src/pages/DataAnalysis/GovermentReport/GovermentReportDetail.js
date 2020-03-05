import React, { PureComponent, Fragment } from 'react';
import { Icon as LegacyIcon } from '@ant-design/compatible';
import { Card, Spin, Table } from 'antd';
import { connect } from 'dva';
import Lightbox from 'react-images';
import Link from 'umi/link';
import moment from 'moment';
import Ellipsis from '@/components/Ellipsis';
import DescriptionList from '@/components/DescriptionList';

import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import hiddenIcon from '@/assets/hiddenIcon.png';
import router from 'umi/router';

import styles from './GovermentReport.less';
const title = '政府监督报表详情';

const { Description } = DescriptionList;

/* 面包屑 */
const breadcrumbList = [
  {
    title: '首页',
    name: '首页',
    href: '/',
  },
  {
    title: '数据分析',
    name: '数据分析',
  },
  {
    title: '政府监督报表',
    name: '政府监督报表',
    href: '/data-analysis/goverment-report/list',
  },
  {
    title,
    name: '政府监督报表详情',
  },
];
/* 头部标签列表 */
const tabList = [
  {
    key: '1',
    tab: '详情',
  },
];

/**
 * 政府监督报表详情
 */
@connect(({ maintenanceReport, user, loading }) => ({
  maintenanceReport,
  user,
  loading: loading.models.maintenanceReport,
}))
export default class App extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tab: '1',
      i: '0',
      images: null,
      currentImage: 0,
    };
  }

  /**
   * 挂载后
   */
  componentDidMount() {
    const {
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;

    // 获取详情
    dispatch({
      type: 'maintenanceReport/fetchAllCheckDetail',
      payload: {
        checkId: id,
      },
    });
  }

  /**
   * 切换头部标签
   */
  handleTabChange = tab => {
    this.setState({ tab });
  };

  /**
   * 切换图片
   */
  handleSwitchImage = currentImage => {
    this.setState({
      currentImage,
    });
  };

  /**
   * 切换上一张图片
   */
  handlePrevImage = () => {
    this.setState(({ currentImage }) => ({
      currentImage: currentImage - 1,
    }));
  };

  /**
   * 切换下一张图片
   */
  handleNextImage = () => {
    this.setState(({ currentImage }) => ({
      currentImage: currentImage + 1,
    }));
  };

  /**
   * 关闭图片详情
   */
  handleClose = () => {
    this.setState({
      images: null,
    });
  };

  /**
   * 图片详情
   */
  renderImageDetail() {
    const { images, currentImage } = this.state;
    return (
      images &&
      images.length > 0 && (
        <Lightbox
          images={images}
          isOpen={true}
          currentImage={currentImage}
          onClickPrev={this.handlePrevImage}
          onClickNext={this.handleNextImage}
          onClose={this.handleClose}
          onClickThumbnail={this.handleSwitchImage}
          showThumbnails
        />
      )
    );
  }

  /**
   * 其它
   */
  renderOther = () => {
    const {
      maintenanceReport: {
        detail: {
          paths=[],
        }={},
      },
    } = this.props;
    const images = paths.map(({ webUrl }) => ({ key: webUrl, src: webUrl }));

    return images && images.length > 0 && (
      <Card
        className={styles.card}
        title="其它"
        bordered={false}
      >
        <DescriptionList col={1}>
          <Description className={styles.description} term="现场照片">
            <div className={styles.sitePhotoWrapper}>
              {images.map(({ key, src }, index) => (
                <div
                  key={key}
                  className={styles.sitePhoto}
                  style={{
                    backgroundImage: `url(${src})`,
                  }}
                  onClick={() => {
                    this.setState({ images, currentImage: index });
                  }}
                />
              ))}
            </div>
          </Description>
        </DescriptionList>
      </Card>
    );
  }

  /**
   * 渲染函数
   */
  render() {
    const {
      maintenanceReport: {
        detail: { list = [] },
      },
      user: {
        currentUser: { unitType },
      },
      match: {
        params: { id },
      },
      location: {
        query: {
          checkResultName,
          object_title,
          check_date,
          check_user_names,
          companyName,
          itemTypeName,
        },
      },
      loading,
    } = this.props;
    const { tab, i } = this.state;
    /* 当前账号是否是企业 */
    const isCompany = unitType === 4;

    // const newList = [];
    // list.forEach(element => {
    //   element.list.forEach((detail, index) => {
    //     const item = { ...detail, ...element, rowSpan: index === 0 ? element.list.length : 0 };
    //     newList.push(item);
    //   });
    // });

    const renderContent = (value, row, index) => {
      const obj = {
        children: value,
        props: {},
      };
      obj.props.rowSpan = row.rowSpan;
      return obj;
    };

    const columns = [
      {
        title: '检查项',
        dataIndex: 'object_title',
        key: 'object_title',
        render: renderContent,
      },
      {
        title: '业务分类',
        dataIndex: 'businessTypeName',
        key: 'businessTypeName',
        render: renderContent,
      },
      {
        title: '检查内容',
        dataIndex: 'flow_name',
        key: 'flow_name',
        width: 280,
        render: val => {
          return (
            <div>
              <Ellipsis tooltip length={14} style={{ overflow: 'visible' }}>
                {val}
              </Ellipsis>
            </div>
          );
        },
      },
      {
        title: '检查结果',
        dataIndex: 'conclusion_name',
        key: 'conclusion_name',
      },
      {
        title: '相关隐患',
        dataIndex: 'statusName',
        render: (text, val) => {
          return (
            <div>
              <Link
                to={`/data-analysis/goverment-report/govermentCheckDetail/${
                  val._id
                  }?checkId=${id}&&companyGovName=${companyName}&&object_title=${encodeURIComponent(
                    object_title
                  )}&&itemTypeName=${itemTypeName}&&check_user_names=${check_user_names}&&check_date=${check_date}&&checkResultName=${checkResultName}`}
              >
                <span style={{ color: '#40a9ff' }}> {val.statusName} </span>
              </Link>
            </div>
          );
        },
      },
    ];
    return (
      <PageHeaderLayout
        title={
          <Fragment>
            {!isCompany && <div>{`单位名称：${companyName}`}</div>}
            <div className={styles.content}>{`检查人：${check_user_names}`}</div>
            <div className={styles.content}>{`检查时间：${check_date}`}</div>
          </Fragment>
        }
        logo={<img alt="" src={hiddenIcon} />}
        action={
          <div>
            <div className={styles.textSecondary}>状态</div>
            <div className={styles.heading}>{checkResultName}</div>
          </div>
        }
        tabList={tabList}
        tabActiveKey={tab}
        onTabChange={this.handleTabChange}
        breadcrumbList={breadcrumbList}
      >
        <Spin spinning={!!loading}>
          {/* <Card title="检查内容" className={styles.card}>
            <Table
              className={styles.table}
              dataSource={newList}
              columns={columns}
              rowKey={'detail_id'}
              scroll={{
                x: true,
              }}
              pagination={false}
            />
          </Card> */}
          {list.length > 0 ? list.map(({ checkDate, dangerCount, objectCount, pointName, resultList = [], dangerId = null }, i) => {
            const newList = [];
            resultList.forEach(element => {
              element.list.forEach((detail, index) => {
                const item = { ...detail, ...element, rowSpan: index === 0 ? element.list.length : 0 };
                newList.push(item);
              });
            });
            // 是否随手拍
            const isSSP = pointName === '随手拍'
            return isSSP ? (
              <Card style={{ marginBottom: '24px' }} key={i}>
                <span className={styles.title}>点位名称：{pointName}</span>
                <span className={styles.titleDesc}>上报隐患{dangerCount}条</span>
                <span className={styles.titleDesc}>检查时间：{moment(checkDate).format('MM-DD HH:mm')}</span>
                <LegacyIcon
                  onClick={() => {
                    router.push(`/data-analysis/goverment-report/govermentCheckDetail/${
                      dangerId
                      }?checkId=${id}&&companyGovName=${companyName}&&object_title=${encodeURIComponent(
                        object_title
                      )}&&itemTypeName=${itemTypeName}&&check_user_names=${check_user_names}&&check_date=${check_date}&&checkResultName=${checkResultName}`)
                  }}
                  style={{ cursor: 'pointer', fontSize: '16px', float: 'right' }}
                  type="right"
                />
              </Card>
            ) : (
                <Card style={{ marginBottom: '24px' }} key={i} title={
                  <Fragment>
                    <span>点位名称：{pointName}</span>
                    <span className={styles.titleDesc}>共检查{objectCount}项，上报隐患{dangerCount}条</span>
                    <span className={styles.titleDesc}>检查时间：{moment(checkDate).format('MM-DD HH:mm')}</span>
                  </Fragment>
                }>
                  <Table
                    className={styles.table}
                    dataSource={newList}
                    columns={columns}
                    rowKey="detail_id"
                    scroll={{
                      x: true,
                    }}
                    pagination={false}
                  />
                </Card>
              );
          }) : <div style={{ textAlign: 'center' }}>暂无数据</div>}
          {this.renderOther()}
          {this.renderImageDetail()}
        </Spin>
      </PageHeaderLayout>
    );
  }
}
