import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';

import { Form, Card, Button, Icon, Col, Row } from 'antd';
import { routerRedux } from 'dva/router';
import DescriptionList from '@/components/DescriptionList';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';

import Slider from '../../BigPlatform/FireControl/components/Slider';
import styles from './MaintenanceRecord.less';

const { Description } = DescriptionList;

const ICON_STYLE = {
  position: 'absolute',
  fontSize: 25,
  color: '#fff',
};

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

  extraContent = (
    <Button className={styles.backBtn} onClick={() => this.goToList()}>
      返回
    </Button>
  );

  /* 跳转到列表页面*/
  goToList = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push(`/data-analysis/maintenance-record/list`));
  };

  // 显示图片
  handleClickImg = i => {
    this.setState({ showImg: true, magIndex: i });
  };

  // 图片左移点击事件
  handleLeft = indexProp => {
    this.setState(state => ({ [indexProp]: state[indexProp] - 1 }));
  };

  // 图片右移点击事件
  handleRight = indexProp => {
    this.setState(state => ({ [indexProp]: state[indexProp] + 1 }));
  };

  // 关闭图片
  handleCloseImg = () => {
    this.setState({ showImg: false });
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
          <Description term={fieldLabels.maintenanceTime}>
            {detail.checkDate
              ? moment(+detail.checkDate).format('YYYY-MM-DD HH:MM:SS')
              : getEmptyData()}
          </Description>
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

    const { magIndex, showImg } = this.state;
    const picLength = files.length;
    const isMagEnd = magIndex === picLength - 1;

    const imgs = files.map(
      ({ webUrl }, i) => (
        console.log(webUrl),
        (
          <div
            key={i}
            className={styles.imgSection}
            style={{
              backgroundImage: `url(${webUrl})`,
              backgroundSize: 'cover',
            }}
            onClick={() => this.handleClickImg(i)}
          />
        )
      )
    );

    const magImgs = files.map(({ webUrl }) => (
      <div className={styles.magImg} key={webUrl} style={{ backgroundImage: `url(${webUrl})` }} />
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
            {detail.score || getEmptyData()}
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

        <div className={styles.magnify} style={{ display: showImg ? 'block' : 'none' }}>
          <div className={styles.center}>
            <Slider index={magIndex} length={picLength} size={1}>
              {magImgs}
            </Slider>
          </div>
          <Icon
            type="close"
            onClick={this.handleCloseImg}
            style={{ right: 10, top: 10, cursor: 'pointer', ...ICON_STYLE }}
          />
          <Icon
            type="left"
            style={{
              left: 10,
              top: '50%',
              display: magIndex ? 'block' : 'none',
              cursor: magIndex ? 'pointer' : 'auto',

              ...ICON_STYLE,
            }}
            onClick={magIndex ? () => this.handleLeft('magIndex') : null}
          />
          <Icon
            type="right"
            style={{
              right: 10,
              top: '50%',
              display: isMagEnd ? 'none' : 'block',
              cursor: isMagEnd ? 'auto' : 'pointer',
              ...ICON_STYLE,
            }}
            onClick={isMagEnd ? null : () => this.handleRight('magIndex')}
          />
        </div>
      </Card>
    );
  }

  render() {
    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
        extraContent={this.extraContent}
      >
        {this.renderUnitInfo()}
        {this.renderServiceUnitInfo()}
        {this.renderUnitDetail()}
      </PageHeaderLayout>
    );
  }
}
