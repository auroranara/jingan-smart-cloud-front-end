import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Card, Button, Icon } from 'antd';
import { routerRedux } from 'dva/router';
import DescriptionList from '@/components/DescriptionList';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';

import Bg from './b2.jpg';
import electricityD from './electricity-d.png';
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
  componentDidMount() {}

  extraContent = (
    <Button style={{ width: '100px', height: '36px' }} onClick={() => this.goToList()}>
      返回
    </Button>
  );

  /* 跳转到列表页面*/
  goToList = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push(`/data-analysis/maintenance-record/list`));
  };

  // 显示图片
  handleClickImg = () => {
    this.setState({ showImg: true });
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
      maintenanceRecord: { detail: data },
    } = this.props;

    return (
      <Card title="维保单位信息" className={styles.card} bordered={false}>
        <DescriptionList col={1}>
          <Description term={fieldLabels.maintenanceUnits}>
            {data.maintenanceUnits || getEmptyData()}
          </Description>
          <Description term={fieldLabels.maintenanceTime}>
            {data.maintenanceTime || getEmptyData()}
          </Description>
          <Description term={fieldLabels.maintenancePerson}>
            {data.maintenancePerson || getEmptyData()}
          </Description>
          <Description term={fieldLabels.maintenancePhone}>
            {data.maintenancePhone || getEmptyData()}
          </Description>
        </DescriptionList>
      </Card>
    );
  }

  /* 渲染服务单位信息*/
  renderServiceUnitInfo() {
    const {
      maintenanceRecord: { detail: data },
    } = this.props;

    return (
      <Card title="服务单位信息" className={styles.card} bordered={false}>
        <DescriptionList col={1}>
          <Description term={fieldLabels.serviceUnit}>
            {data.serviceUnit || getEmptyData()}
          </Description>
          <Description term={fieldLabels.unitAddress}>
            {data.unitAddress || getEmptyData()}
          </Description>
          <Description term={fieldLabels.safetyPerson}>
            {data.safetyPerson || getEmptyData()}
          </Description>
          <Description term={fieldLabels.servicePhone}>
            {data.servicePhone || getEmptyData()}
          </Description>
        </DescriptionList>
      </Card>
    );
  }

  /* 渲染维保服务详情*/
  renderUnitDetail() {
    const {
      maintenanceRecord: { detail: data },
    } = this.props;

    const picture = [Bg, Bg, Bg, Bg];

    const { magIndex, showImg } = this.state;
    const picLength = picture.length;
    const isMagEnd = magIndex === picLength - 1;

    const imgs = picture.map(i => (
      <div
        key={i}
        className={styles.imgSection}
        onClick={() => this.handleClickImg(i)}
        style={{
          backgroundImage: `url(${Bg})`,
          backgroundSize: 'cover',
        }}
      />
    ));

    const magImgs = picture.map(i => (
      <div className={styles.magImg} key={i} style={{ backgroundImage: `url(${Bg})` }} />
    ));

    return (
      <Card title="维保服务详情" className={styles.card} bordered={false}>
        <DescriptionList col={1}>
          <Description term={fieldLabels.maintenanceContent} />
          <Description term={fieldLabels.syntheticalMark}>
            {data.syntheticalMark || getEmptyData()}
          </Description>
          <Description term={fieldLabels.syntheticalEvaluation}>
            {data.syntheticalEvaluation || getEmptyData()}
          </Description>
          <Description term={fieldLabels.rectifyOpinions}>
            {data.rectifyOpinions || getEmptyData()}
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
