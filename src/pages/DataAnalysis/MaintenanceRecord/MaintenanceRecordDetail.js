import React, { PureComponent } from 'react';
import { connect } from 'dva';
// import moment from 'moment';

import { Form, Card, Col, Row } from 'antd';
import { routerRedux } from 'dva/router';
import DescriptionList from '@/components/DescriptionList';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';

import Lightbox from 'react-images';
import styles from './MaintenanceRecord.less';

const { Description } = DescriptionList;

/* 标题*/
const title = '维保记录详情';

/* 面包屑*/
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
    title: '维保记录',
    name: '维保记录',
    href: '/data-analysis/maintenance-record/list',
  },
  {
    title,
    name: '维保记录详情',
  },
];

/* 表单标签 */
const fieldLabels = {
  maintenanceUnits: '维保单位',
  maintenanceTime: '维保时间',
  maintenancePerson: '维保人员',
  maintenancePhone: '联系电话',
  serviceUnit: '服务单位',
  unitAddress: '单位地址',
  safetyPerson: '安全负责人',
  servicePhone: '联系电话',
  maintenanceContent: '维保内容',
  syntheticalMark: '综合评分',
  syntheticalEvaluation: '综合评价',
  rectifyOpinions: '整改意见',
  attachmentContent: '附件内容',
};

/* 获取无数据 */
const getEmptyData = () => {
  return <span style={{ color: 'rgba(0,0,0,0.45)' }}>暂无数据</span>;
};

// 维保内容列表
function ContentCard(props) {
  const { content, statusName } = props;
  return (
    <Row style={{ fontSize: '15px' }}>
      <Col span={4}>
        <p style={{ borderBottom: '1px solid #ccc' }}>{content ? content : getEmptyData()}</p>
      </Col>
      <Col span={20}>
        <p style={{ borderBottom: '1px solid #ccc' }}>
          系统状态：
          {statusName ? statusName : getEmptyData()}
        </p>
      </Col>
    </Row>
  );
}

@connect(({ maintenanceRecord, loading }) => ({
  maintenanceRecord,
  loading: loading.models.maintenanceRecord,
}))
@Form.create()
export default class MaintenanceRecordDetail extends PureComponent {
  state = {
    magIndex: 0,
    showImg: false,
    visible: false,
    imgUrl: [], // 附件图片列表
    currentImage: 0, // 展示附件大图下标
  };

  /* 挂载后 */
  componentDidMount() {
    const {
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;

    // 获取记录详情
    dispatch({
      type: 'maintenanceRecord/fetchRecordDetail',
      payload: {
        id,
      },
    });
  }

  // 跳转到列表页面
  goToList = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push(`/data-analysis/maintenance-record/list`));
  };

  // 查看图片
  handleClickImg = (i, files) => {
    const newFiles = files.map(({ webUrl }) => {
      return {
        src: webUrl,
      };
    });
    this.setState({
      visible: true,
      imgUrl: newFiles,
      currentImage: i,
    });
  };

  // 关闭查看图片弹窗
  handleModalClose = () => {
    this.setState({
      visible: false,
    });
  };

  // 图片的点击翻入上一页
  gotoPrevious = () => {
    let { currentImage } = this.state;
    if (currentImage <= 0) return;
    this.setState({ currentImage: --currentImage });
  };

  // 图片的点击翻入下一页
  gotoNext = () => {
    let { currentImage, imgUrl } = this.state;
    if (currentImage >= imgUrl.length - 1) return;
    this.setState({ currentImage: ++currentImage });
  };

  // 图片点击下方缩略图
  handleClickThumbnail = i => {
    const { currentImage } = this.state;
    if (currentImage === i) return;
    this.setState({ currentImage: i });
  };

  /* 渲染维保单位信息*/
  renderUnitInfo() {
    const {
      maintenanceRecord: { detail },
    } = this.props;

    return (
      <Card title="维保单位信息" className={styles.card} bordered={false}>
        <DescriptionList col={1}>
          <Description term={fieldLabels.maintenanceUnits}>
            {detail.checkCompanyName || getEmptyData()}
          </Description>
          <Description term={fieldLabels.maintenanceTime}>{detail.checkDate}</Description>
          <Description term={fieldLabels.maintenancePerson}>
            {detail.checkUsers
              ? detail.checkUsers.map(v => v.userName).join('  ,  ')
              : getEmptyData()}
          </Description>
          <Description term={fieldLabels.maintenancePhone}>
            {detail.checkUsers
              ? detail.checkUsers.map(v => v.phoneNumber).join('  ,  ')
              : getEmptyData()}
          </Description>
        </DescriptionList>
      </Card>
    );
  }

  /* 渲染服务单位信息*/
  renderServiceUnitInfo() {
    const {
      maintenanceRecord: { detail },
    } = this.props;

    return (
      <Card title="服务单位信息" className={styles.card} bordered={false}>
        <DescriptionList col={1}>
          <Description term={fieldLabels.serviceUnit}>
            {detail.bcheckCompanyName || getEmptyData()}
          </Description>
          <Description term={fieldLabels.unitAddress}>
            {detail.address || getEmptyData()}
          </Description>
          <Description term={fieldLabels.safetyPerson}>
            {detail.safetyName || getEmptyData()}
          </Description>
          <Description term={fieldLabels.servicePhone}>
            {detail.safetyPhone || getEmptyData()}
          </Description>
        </DescriptionList>
      </Card>
    );
  }

  /* 渲染维保服务详情*/
  renderUnitDetail() {
    const {
      maintenanceRecord: {
        detail,
        detail: { items = [], files = [] },
      },
    } = this.props;

    const { visible, imgUrl, currentImage } = this.state;

    const imgs = files.map(({ webUrl }, i) => (
      <div
        key={i}
        className={styles.imgSection}
        style={{
          backgroundImage: `url(${webUrl})`,
          backgroundSize: 'cover',
        }}
        onClick={() => this.handleClickImg(i, files)}
      />
    ));

    return (
      <Card title="维保服务详情" className={styles.card} bordered={false}>
        <DescriptionList col={1}>
          <Description term={fieldLabels.maintenanceContent}>
            {items.map((item, index) => {
              const { id, content, statusName } = item;
              return (
                <ContentCard key={id} index={index + 1} content={content} statusName={statusName} />
              );
            })}
          </Description>
          <Description term={fieldLabels.syntheticalMark}>
            {detail.score + ' 分 ' || getEmptyData()}
          </Description>
          <Description term={fieldLabels.syntheticalEvaluation}>
            {detail.evaluate || getEmptyData()}
          </Description>
          <Description term={fieldLabels.rectifyOpinions}>
            {detail.opinion || getEmptyData()}
          </Description>
          <Description term={fieldLabels.attachmentContent} style={{ width: '100%' }}>
            {imgs}
          </Description>
        </DescriptionList>

        <Lightbox
          images={imgUrl}
          isOpen={visible}
          currentImage={currentImage}
          onClickPrev={this.gotoPrevious}
          onClickNext={this.gotoNext}
          onClose={this.handleModalClose}
          showThumbnails
          onClickThumbnail={this.handleClickThumbnail}
          imageCountSeparator="/"
        />
      </Card>
    );
  }

  render() {
    return (
      <PageHeaderLayout title={title} breadcrumbList={breadcrumbList}>
        {this.renderUnitInfo()}
        {this.renderServiceUnitInfo()}
        {this.renderUnitDetail()}
      </PageHeaderLayout>
    );
  }
}
