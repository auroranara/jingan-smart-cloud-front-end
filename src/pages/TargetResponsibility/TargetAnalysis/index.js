import React, { PureComponent } from 'react';
import { connect } from 'dva';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import router from 'umi/router';
import moment from 'moment';
import { Select, Radio, Col, Row, Table, DatePicker, Empty } from 'antd';
import { BREADCRUMBLIST, DepartPie, ReachList, COLOUMNS } from './utils';
import styles from './index.less';

@connect(({ targetResponsibility, department, user, loading }) => ({
  targetResponsibility,
  user,
  department,
  loading: loading.models.targetResponsibility,
}))
export default class TableList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false, // 控制日期(年份)面板是否打开
      yearDateVal: '',
      radioType: '1', // 默认为 图标
      indexVal: undefined,
      indexReachVal: undefined,
    };
    this.pageNum = 1;
    this.pageSize = 10;
  }

  componentDidMount() {
    const {
      match: {
        params: { id },
      },
    } = this.props;
    this.fetchYearGoal(id);
  }

  // 年度目标达成率排名
  fetchYearGoal = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'targetResponsibility/fetchYearGoal',
      payload: {
        companyId: id,
      },
    });
  };

  // 弹出日历和关闭日历的回调
  handleOpenChange = s => {
    if (s) {
      this.setState({ isOpen: true });
    } else {
      this.setState({ isOpen: false });
    }
  };

  // 日历面板切换的回调
  handlePanelChange = v => {
    this.setState({ yearDateVal: v, isOpen: false });
  };

  // 清空日期选择框
  clearDateValue = () => {
    this.setState({ yearDateVal: undefined });
  };

  handleDisabledDate = time => {
    return time && time < moment().endOf('day');
  };

  handleRadioBtn = e => {
    this.setState({ radioType: e.target.value });
  };

  // 跳转到目标责任制定实施
  hanldeLink = () => {
    router.push('/target-responsibility/target-setting/index');
  };

  handleIndexChange = val => {
    this.setState({ indexVal: val });
  };

  handleIndexReachChange = val => {
    this.setState({ indexReachVal: val });
  };

  // 渲染图表
  renderPicContent() {
    const {
      targetResponsibility: {
        yearGoalData: { list: indexList = [] },
      },
    } = this.props;

    return (
      <div className={styles.sectionChart}>
        <div className={styles.left}>
          <div className={styles.itemTop}>
            <div className={styles.headline}>单位目标达成情况</div>
            <div className={styles.echarts}>
              <DepartPie data={[2, 4]} partPassRate={'20%'} />
            </div>
          </div>

          <div className={styles.itemBottom}>
            <div className={styles.headline}>部门目标达成情况</div>
            <div className={styles.label}>
              <div className={styles.labelFirst}>
                <div className={styles.number}>{3}</div>
                <div className={styles.title}>达成目标的部门</div>
              </div>
              <div className={styles.labelSecond}>
                <div className={styles.number}>{3}</div>
                <div className={styles.title}>未达成目标的部门</div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.right}>
          <div className={styles.top}>年度目标达成率排名</div>
          <div className={styles.table}>
            <div className={styles.title}>
              <Col span={7}>
                <p className={styles.tableTitle}>排名</p>
              </Col>
              <Col span={10}>
                <p className={styles.tableTitle}>部门</p>
              </Col>
              <Col span={7}>
                <p className={styles.tableTitle}>目标达成率</p>
              </Col>
            </div>
            <div className={styles.dataCard}>
              {indexList.map(({ partName, goalValue }, index) => {
                return (
                  <Row key={index} className={styles.row}>
                    <Col span={7}>
                      <p className={styles.tableTitle}>{index + 1}</p>
                    </Col>
                    <Col span={10}>
                      <p className={styles.tableTitle}>{partName}</p>
                    </Col>
                    <Col span={7}>
                      <p className={styles.tableTitle}>{goalValue}</p>
                    </Col>
                  </Row>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 渲染列表
  renderTableContent() {
    const { indexVal, indexReachVal } = this.state;

    const list = [
      {
        id: 1,
        duty: '单位',
        index: '火灾及重特大安全事故 ',
        desc: '0起/年',
        isReach: '1',
      },
    ];

    return (
      <div className={styles.sectionTable}>
        <div className={styles.selectArea}>
          <Select
            placeholder="全部指标"
            value={indexVal}
            style={{ width: 240, marginRight: 10 }}
            onChange={this.handleIndexChange}
          >
            {[].map(({ id, targetName }) => (
              <Select.Option key={id} value={id}>
                {targetName}
              </Select.Option>
            ))}
          </Select>
          <Select
            placeholder="请选择指标达成情况"
            value={indexReachVal}
            style={{ width: 250 }}
            onChange={this.handleIndexReachChange}
          >
            {ReachList.map(({ key, value }) => (
              <Select.Option key={key} value={key}>
                {value}
              </Select.Option>
            ))}
          </Select>
        </div>
        <div className={styles.table}>
          {list.length > 0 ? (
            <Table rowKey="id" columns={COLOUMNS} dataSource={list} bordered pagination={false} />
          ) : (
            <Empty />
          )}
        </div>
      </div>
    );
  }

  render() {
    const { isOpen, yearDateVal, radioType } = this.state;

    return (
      <PageHeaderLayout
        title={BREADCRUMBLIST[BREADCRUMBLIST.length - 1].title}
        breadcrumbList={BREADCRUMBLIST}
      >
        <div className={styles.container}>
          <div className={styles.selectArea}>
            <span>
              <DatePicker
                placeholder="请选择"
                disabledDate={this.handleDisabledDate}
                style={{ width: 300, marginBottom: 10 }}
                open={isOpen}
                value={yearDateVal}
                onOpenChange={s => this.handleOpenChange(s)}
                onChange={this.clearDateValue}
                onPanelChange={v => this.handlePanelChange(v)}
                format="YYYY年"
                mode="year"
              />
            </span>
            <span className={styles.radioBtn}>
              <Radio.Group
                defaultValue={radioType}
                buttonStyle="solid"
                onChange={this.handleRadioBtn}
              >
                <Radio.Button value="1">图表</Radio.Button>
                <Radio.Button value="2">列表</Radio.Button>
              </Radio.Group>
            </span>
            <div className={styles.reminder}>
              如果指标的考核结果未填写，则算未达标，请查看列表中指标未达标原因，到
              <span className={styles.extrude} onClick={this.hanldeLink}>
                目标责任制定实施
              </span>
              下完善考核结果
            </div>
          </div>

          {+radioType === 1 && <div className={styles.content}>{this.renderPicContent()}</div>}
          {+radioType === 2 && <div className={styles.content}>{this.renderTableContent()}</div>}
        </div>
      </PageHeaderLayout>
    );
  }
}
