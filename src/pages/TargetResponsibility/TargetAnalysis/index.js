import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';

// import router from 'umi/router';
import { Icon, Select, Col, Radio, Row } from 'antd';
import { BREADCRUMBLIST, DepartNumIcon, DepartPie, DepartLine, IndexChartsLine } from './utils';
import styles from './index.less'

@connect(({ targetResponsibility, user, loading }) => ({
    targetResponsibility,
    user,
    loading: loading.models.targetResponsibility,
}))
export default class TableList extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            type: '1',
            typeIndex: '1',
        };
        this.pageNum = 1;
        this.pageSize = 10;
    }

    componentDidMount() {
    }

    renderFirstContent() {
        return (
            <div className={styles.firstSection}>
                <div className={styles.itemLeft}>
                    <div className={styles.imgLeft} style={{ backgroundImage: `url(${DepartNumIcon})` }}></div>
                    <div className={styles.valueRight}>
                        <div className={styles.name}>考核部门数</div>
                        <div className={styles.value}>{'10'}</div>
                    </div>
                </div>
                <div className={styles.itemRight}>
                    <div className={styles.section}>
                        <div className={styles.name}>本月目标达成率</div>
                        <div className={styles.value}>90%</div>
                        <div className={styles.label}>
                            <span className={styles.icon}><Icon type="caret-up" style={{ color: 'rgb(46,186,7)' }} /></span>
                            <span className={styles.number}>26%</span>
                            <span className={styles.write}>同比上月</span>
                        </div>
                    </div>
                    <div className={styles.section}>
                        <div className={styles.name}>本季度目标达成率</div>
                        <div className={styles.value}>100%</div>
                        <div className={styles.label}>
                            <span className={styles.icon}><Icon type="caret-up" style={{ color: 'rgb(46,186,7)' }} /></span>
                            <span className={styles.number}>0%</span>
                            <span className={styles.write}>同比上季度</span>
                        </div>
                    </div>
                    <div className={styles.section}>
                        <div className={styles.name}>本年目标达成率</div>
                        <div className={styles.value}>90%</div>
                        <div className={styles.label}>
                            <span className={styles.icon}><Icon type="caret-down" style={{ color: 'rgb(254,80,0)' }} /></span>
                            <span style={{ color: 'rgb(254,80,0)' }}>16%</span>
                            <span className={styles.write}>同比去年</span>
                        </div>
                    </div>
                </div>
            </div>
        );

    }

    // 切换时间选择
    handleRadioChange = e => {
        const mode = e.target.value;
        this.setState({ type: mode });
    };

    renderSecondContent() {
        const { type } = this.state;
        return (
            <div className={styles.secondSection}>
                <div className={styles.itemLeft}>
                    <div className={styles.top}>部门目标达成率</div>
                    <div className={styles.bottom}>
                        <div className={styles.echarts}>
                            <DepartPie data={[50, 120]} />
                        </div>
                        <div className={styles.label}>
                            <div className={styles.labelFirst}>
                                <div className={styles.number}>2</div>
                                <div className={styles.title}>达成目标的部门</div>
                            </div>
                            <div className={styles.labelSecond}>
                                <div className={styles.number}>1</div>
                                <div className={styles.title}>未达成目标的部门</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.itemRight}>
                    <div className={styles.top}>
                        <span className={styles.label}>各单位部门指标达成情况</span>
                        <span className={styles.select}>
                            <Select placeholder='请选择' style={{ width: 150, marginRight: 10 }} />
                            <Select placeholder='请选择' style={{ width: 150 }} />
                        </span>
                    </div>
                    <div className={styles.middle}>
                        <Radio.Group onChange={this.handleRadioChange} value={type} style={{ marginBottom: 8 }}>
                            <Radio.Button value="1">月度</Radio.Button>
                            <Radio.Button value="2">季度</Radio.Button>
                            <Radio.Button value="3">年度</Radio.Button>
                        </Radio.Group>
                    </div>
                    <div className={styles.bottom}>
                        <DepartLine
                            dataGoal={[16, 35, 10, 20, 40, 38, 12]}
                            dataReal={[3, 12, 10, 20, 15, 20, 15]}
                            xData={['本单位', '生产管理部门', '采购部', '设备部', '质量管理部', '计划仓储部', '安全管理部']}
                        />
                    </div>
                </div>
            </div>
        );

    }

    handleIndexChange = e => {
        const mode = e.target.value;
        this.setState({ typeIndex: mode });
    };

    renderThirdContent() {
        const { typeIndex } = this.state;

        const indexList = [...Array(30).keys()].map(i => ({
            id: i,
            num: '1',
            departName: '生产部门',
            rate: '100%',
        }));

        return (
            <div className={styles.thirdSection}>
                <div className={styles.itemLeft}>
                    <div className={styles.top}>各指标变化趋势</div>
                    <div className={styles.selectArea}>
                        <Radio.Group onChange={this.handleIndexChange} value={typeIndex} style={{ marginBottom: 8 }}>
                            <Radio.Button value="1">月度</Radio.Button>
                            <Radio.Button value="2">季度</Radio.Button>
                            <Radio.Button value="3">年度</Radio.Button>
                        </Radio.Group>
                        <span className={styles.select}>
                            <Select placeholder='请选择' style={{ width: 150, marginRight: 10 }} />
                            <Select placeholder='请选择' style={{ width: 150 }} />
                        </span>
                    </div>
                    <div className={styles.middle}>
                        <span>目标值：<span style={{ fontWeight: 'bold' }}>11</span></span>
                        <span style={{ marginLeft: 15 }}>平均值：<span style={{ fontWeight: 'bold' }}>11</span></span>
                    </div>
                    <div className={styles.echarts}>
                        <IndexChartsLine data={[5, 20, 35, 48, 62, 68, 72]} />
                    </div>
                </div>
                <div className={styles.itemRight}>
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
                            {indexList.map(({ id, num, departName, rate }) => {
                                return (
                                    <Row key={id} className={styles.row}>
                                        <Col span={7}>
                                            <p className={styles.tableTitle}>{num}</p>
                                        </Col>
                                        <Col span={10}>
                                            <p className={styles.tableTitle}>{departName}</p>
                                        </Col>
                                        <Col span={7}>
                                            <p className={styles.tableTitle}>{rate}</p>
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

    render() {

        return (
            <PageHeaderLayout
                title={BREADCRUMBLIST[BREADCRUMBLIST.length - 1].title}
                breadcrumbList={BREADCRUMBLIST}
            >
                <div className={styles.container}>
                    <div className={styles.firstContent}>{this.renderFirstContent()}</div>
                    <div className={styles.secondContent}>{this.renderSecondContent()}</div>
                    <div className={styles.thirdContent}>{this.renderThirdContent()}</div>
                </div>
            </PageHeaderLayout>
        );
    }
}
