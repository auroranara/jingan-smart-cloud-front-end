import React, { PureComponent } from 'react';
import { Card, Form, Button, Select, DatePicker, TreeSelect, Radio, Table, Empty, Spin } from 'antd';
import Echarts from 'echarts-for-react';
import { connect } from 'dva';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import ToolBar from '@/components/ToolBar';
import { mapMutations } from '@/utils/utils';
import urls from '@/utils/urls';
import titles from '@/utils/titles';
import styles from './index.less';
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TreeNode } = TreeSelect;
const {
  home: homeUrl,
} = urls;
const {
  home: homeTitle,
  hiddenDangerCountReport: { list: title, menu: menuTitle },
} = titles;
/* 面包屑 */
const breadcrumbList = [
  { title: homeTitle, name: homeTitle, href: homeUrl },
  { title: menuTitle, name: menuTitle },
  { title, name: title },
];
/* 标签列表 */
const tabList = [{
  key: '1',
  tab: '按条件统计',
}, {
  key: '2',
  tab: '按年月日统计',
}, {
  key: '3',
  tab: '按隐患等级统计',
}];
// 获取日期类型对应的模式
const getDateTypeMode = (dateType=1) => {
  switch(+dateType) {
    case 2:
      return 'month';
    case 3:
      return 'year';
    default:
      return 'date';
  }
}
// 字段映射
const FIELDS_MAP = {
  countType: 'reportType',
  hiddenDangerStatus: 'status',
  createDate({ createDate, dateType }) {
    const dateTypeName = getDateTypeMode(dateType);
    const [start, end] = createDate || [];
    return { query_start_time: start && start.startOf(dateTypeName).format('YYYY/MM/DD HH:mm:ss'), query_end_time: end && end.startOf(dateTypeName).format('YYYY/MM/DD HH:mm:ss') };
  },
  planRectifyDate({ planRectifyDate }) {
    const [start, end] = planRectifyDate || [];
    return { plan_rectify_start_time: start && start.startOf('day').format('YYYY/MM/DD HH:mm:ss'), plan_rectify_end_time: end && end.startOf('day').format('YYYY/MM/DD HH:mm:ss') };
  },
  department: 'queryDepartmentId',
  hiddenDangerType: 'hiddenType',
  checkType: 'inspectionType',
  dateType: 'timeType',
};
// 获取映射后的字段
function getMappedFields(values) {
  return Object.entries(FIELDS_MAP).reduce((result, [key, value]) => {
    if (typeof value === 'function') {
      result = { ...result, ...value(values) };
    } else {
      result[value] = values[key];
    }
    return result;
  }, {});
}
// 日期格式
const DATE_FORMAT = 'YYYY-MM-DD';

@connect(({ hiddenDangerCountReport, user, loading }) => ({
  hiddenDangerCountReport,
  user,
  loading: loading.models.hiddenDangerCountReport,
}))
@Form.create()
export default class HiddenDangerCountReportList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tabActiveKey: '1',
      radioValue: '1',
    };
    this.exportButton = (
      <Button
        onClick={this.handleExport}
      >
        导出
      </Button>
    );
    mapMutations(this, {
      namespace: 'hiddenDangerCountReport',
      types: [
        'init',
        'fetchCountList',
        'exportReport',
      ],
    });
  }

  componentDidMount() {
    const {
      user: {
        currentUser: {
          companyId,
        },
      },
      location: {
        query: {
          companyId: companyId2,
        },
      },
    } = this.props;
    this.init({
      companyId: companyId2 || companyId || 'DccBRhlrSiu9gMV7fmvizw',
    }, () => {
      this.handleTabChange('1');
    });
  }

  getParams() {
    const {
      user: {
        currentUser: {
          companyId,
        },
      },
      location: {
        query: {
          companyId: companyId2,
        },
      },
    } = this.props;
    const { tabActiveKey } = this.state;
    const values = this.form.getFieldsValue();
    if (tabActiveKey === '2') {
      values.countType = '9';
    } else if (tabActiveKey === '3') {
      values.countType = '10';
    }
    const fields = getMappedFields(values);
    return { ...fields, company_id: companyId2 || companyId || 'DccBRhlrSiu9gMV7fmvizw' };
  }

  getCountList = () => {
    const params = this.getParams();
    this.fetchCountList(params);
  }

  setFormReference = (toobar) => {
    this.form = toobar && toobar.props && toobar.props.form;
  }

  handleTabChange = (tabActiveKey) => {
    this.setState({
      tabActiveKey,
      radioValue: '1',
    }, () => {
      this.form.resetFields();
      this.getCountList();
    });
  }

  handleChartTypeChange = ({ target: { value: radioValue } }) => {
    this.setState({ radioValue });
  }

  handleDateTypeChange = () => {
    this.forceUpdate();
  };

  handleSearch = () => {
    this.getCountList();
  }

  handleReset = () => {
    this.getCountList();
  }

  handleExport = () => {
    const params = this.getParams();
    this.exportReport(params);
  }

  renderTreeNodes = dict => dict.map(({ key, value, children }) => children ? (
    <TreeNode title={value} key={key} value={key}>
      {this.renderTreeNodes(children)}
    </TreeNode>
  ) : (
    <TreeNode title={value} key={key} value={key} />
  ))

  renderChart() {
    const {
      hiddenDangerCountReport: {
        countTypeDict=[],
        countList=[],
      },
    } = this.props;
    const {
      tabActiveKey,
      radioValue,
    } = this.state;
    if (countList.length === 0) {
      return <Empty />
    }
    const { types, values } = countList.reduce((result, { hdDesc, hdCount }) => {
      result.values.push(hdCount);
      result.types.push(hdDesc);
      return result;
    }, { types: [], values: [] });
    if (tabActiveKey === '1') {
      const countType = this.form && this.form.getFieldValue('countType');
      const countTypeName = (countType ? countTypeDict.find(({ key }) => key === countType).value : '按整改部门统计').replace(/^按(.*)统计$/, '$1');
      if (radioValue === '1') {
        const option = {
          color: ['#1890FF'],
          tooltip: {},
          grid: {
            top: 30,
            left: 10,
            right: 70,
            bottom: 10,
            containLabel: true,
          },
          xAxis: {
            type: 'value',
            name: '隐患数量',
            minInterval: 1,
          },
          yAxis: {
            type: 'category',
            name: countTypeName,
            data: types,
          },
          series: [{
            type: 'bar',
            barWidth: '50%',
            barMaxWidth: 60,
            data: values,
          }],
        };
        return (
          <Echarts
            key={`${tabActiveKey}-${radioValue}`}
            option={option}
            style={{ height: 600 }}
          />
        );
      } else if (radioValue === '2') {
        const option = {
          color: ['#1890FF', '#13C2C2', '#2FC25B', '#FACC14', '#F04864', '#8543E0'],
          tooltip:{
            formatter({ marker, name }) {
              return marker + name.replace(/\s/, ': ');
            },
          },
          legend: {
            orient: 'vertical',
            type: 'scroll',
            right: 20,
            pageIconColor: '#1890FF',
            pageIconInactiveColor: '#d9d9d9',
            // data: types,
            data: countList.map(({ hdDesc, hdCount }) => `${hdDesc} ${hdCount}`),
          },
          series: [{
            type: 'pie',
            center: ['50%', '50%'],
            radius: ['50%', '75%'],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: true,
                position: 'center',
                formatter: `{a|隐患总数}\n{b|${values.reduce((t, v) => t+v, 0)}}`,
                lineHeight: 24,
                rich: {
                  a: {
                    fontSize: 14,
                    color: '#999',
                  },
                  b: {
                    fontSize: 20,
                    color: '#333',
                  },
                },
              },
              emphasis: {
                show: true,
                // textStyle: {
                //   fontSize: '16',
                //   fontWeight: 'bold',
                // },
              },
            },
            labelLine: {
              normal: {
                show: false,
              },
            },
            data: countList.map(({ hdDesc, hdCount }) => ({ name: `${hdDesc} ${hdCount}`, value: hdCount })),
          }],
        };
        return (
          <Echarts
            key={`${tabActiveKey}-${radioValue}`}
            option={option}
            style={{ height: 600 }}
          />
        );
      } else if (radioValue === '3') {
        return (
          <Table
            key={`${tabActiveKey}-${radioValue}`}
            bordered
            columns={[{
              title: countTypeName,
              dataIndex: 'hdDesc',
              key: 'hdDesc',
              align: 'center',
            }, {
              title: '隐患数量',
              dataIndex: 'hdCount',
              key: 'hdCount',
              align: 'center',
            }]}
            dataSource={countList}
            rowKey="hdKey"
            pagination={false}
          />
        );
      }
    } else if (tabActiveKey === '2') {
      const option = {
        color: ['#1890FF'],
        tooltip : {},
        grid: {
          top: 30,
          left: 10,
          right: 60,
          bottom: 10,
          containLabel: true,
        },
        xAxis: {
          data: types,
          name: '时间段',
        },
        yAxis: {
          name: '隐患数量',
          minInterval: 1,
        },
        series : [{
          type:'bar',
          barWidth: '50%',
          barMaxWidth: 60,
          data: values,
        }],
      };
      return (
        <Echarts
          key={tabActiveKey}
          option={option}
          style={{ height: 600 }}
        />
      );
    } else if (tabActiveKey === '3') {
      return (
        <Table
          key={tabActiveKey}
          bordered
          columns={[{
            title: '隐患等级',
            dataIndex: 'hdDesc',
            key: 'hdDesc',
            align: 'center',
          }, {
            title: '隐患数量',
            dataIndex: 'hdCount',
            key: 'hdCount',
            align: 'center',
          }, {
            title: '已整改',
            dataIndex: 'hdRfCount',
            key: 'hdRfCount',
            align: 'center',
          }, {
            title: '整改率',
            dataIndex: 'hdRfPercent',
            key: 'hdRfPercent',
            render: (hdRfPercent) => typeof hdRfPercent === 'number' && `${hdRfPercent}%`,
            align: 'center',
          }]}
          dataSource={countList}
          rowKey="hdKey"
          pagination={false}
        />
      );
    }
  }

  render() {
    const {
      hiddenDangerCountReport: {
        countTypeDict=[],
        hiddenDangerStatusDict=[],
        departmentDict=[],
        hiddenDangerTypeDict=[],
        checkTypeDict=[],
        dateTypeDict=[],
      },
      loading,
    } = this.props;
    const {
      tabActiveKey,
      radioValue,
    } = this.state;
    const dateType = this.form && this.form.getFieldValue('dateType');
    let fields;
    if (tabActiveKey === '1') {
      fields = [
        {
          id: 'countType',
          label: '统计类型',
          options: {
            initialValue: countTypeDict[0] && countTypeDict[0].key,
          },
          render: () => (
            <Select
              placeholder="请选择"
            >
              {countTypeDict.map(({ key, value }) => (
                <Option value={key} key={key}>
                  {value}
                </Option>
              ))}
            </Select>
          ),
        },
        {
          id: 'hiddenDangerStatus',
          label: '隐患状态',
          render: () => (
            <Select
              placeholder="请选择"
              allowClear
            >
              {hiddenDangerStatusDict.map(({ key, value }) => (
                <Option value={key} key={key}>
                  {value}
                </Option>
              ))}
            </Select>
          ),
        },
        {
          id: 'createDate',
          label: '创建日期',
          render: () => (
            <RangePicker
              key={`1-createDate`}
              allowClear
              format={DATE_FORMAT}
            />
          ),
        },
        {
          id: 'department',
          label: '所属部门',
          render: () => (
            <TreeSelect
              placeholder="请选择"
              allowClear
            >
              {this.renderTreeNodes(departmentDict)}
            </TreeSelect>
          ),
        },
        {
          id: 'hiddenDangerType',
          label: '隐患类型',
          render: () => (
            <TreeSelect
              placeholder="请选择"
              allowClear
            >
              {this.renderTreeNodes(hiddenDangerTypeDict)}
            </TreeSelect>
          ),
        },
        {
          id: 'planRectifyDate',
          label: '计划整改日期',
          render: () => (
            <RangePicker
              allowClear
              format={DATE_FORMAT}
            />
          ),
        },
        {
          id: 'checkType',
          label: '检查类型',
          render: () => (
            <TreeSelect
              placeholder="请选择"
              allowClear
            >
              {this.renderTreeNodes(checkTypeDict)}
            </TreeSelect>
          ),
        },
      ];
    } else if (tabActiveKey === '2') {
      fields = [
        {
          id: 'dateType',
          label: <span className={styles.dateTypeLabel}>日/月/年</span>,
          options: {
            initialValue: countTypeDict[0] && countTypeDict[0].key,
          },
          render: () => (
            <Radio.Group name="dateType" onChange={this.handleDateTypeChange}>
              {dateTypeDict.map(({ key, value }) => (
                <Radio value={key} key={key}>{value}</Radio>
              ))}
            </Radio.Group>
          ),
        },
        {
          id: 'hiddenDangerStatus',
          label: '隐患状态',
          render: () => (
            <Select
              placeholder="请选择"
              allowClear
            >
              {hiddenDangerStatusDict.map(({ key, value }) => (
                <Option value={key} key={key}>
                  {value}
                </Option>
              ))}
            </Select>
          ),
        },
        {
          id: 'createDate',
          label: '选择日期',
          render: () => {
            let /* mode,  */format;
            if (dateType === '2') {
              // mode = ['month', 'month'];
              format = 'YYYY-MM';
            } else if (dateType === '3') {
              // mode = ['year', 'year'];
              format = 'YYYY';
            } else {
              // mode = ['date', 'date'];
              format = 'YYYY-MM-DD';
            }
            return (
              <RangePicker
                key={`2-${dateType}-createDate`}
                format={format}
                // mode={mode}
                allowClear
              />
            );
          },
        },
        {
          id: 'department',
          label: '所属部门',
          render: () => (
            <TreeSelect
              placeholder="请选择"
              allowClear
            >
              {this.renderTreeNodes(departmentDict)}
            </TreeSelect>
          ),
        },
        {
          id: 'hiddenDangerType',
          label: '隐患类型',
          render: () => (
            <TreeSelect
              placeholder="请选择"
              allowClear
            >
              {this.renderTreeNodes(hiddenDangerTypeDict)}
            </TreeSelect>
          ),
        },
      ];
    } else if (tabActiveKey === '3') {
      fields = [
        {
          id: 'createDate',
          label: '创建日期',
          render: () => (
            <RangePicker
              key={`3-createDate`}
              allowClear
              format={DATE_FORMAT}
            />
          ),
        },
        {
          id: 'department',
          label: '检查人所属部门',
          render: () => (
            <TreeSelect
              placeholder="请选择"
              allowClear
            >
              {this.renderTreeNodes(departmentDict)}
            </TreeSelect>
          ),
        },
      ];
    }

    return (
      <PageHeaderLayout
        className={styles.header}
        title={title}
        breadcrumbList={breadcrumbList}
        tabList={tabList}
        tabActiveKey={tabActiveKey}
        onTabChange={this.handleTabChange}
      >
        <Spin spinning={!!loading}>
          <Card title="查询条件" bordered={false} className={styles.card}>
            <ToolBar
              wrappedComponentRef={this.setFormReference}
              fields={fields}
              action={this.exportButton}
              onSearch={this.handleSearch}
              onReset={this.handleReset}
            />
          </Card>
          <Card title="统计图标" bordered={false} className={styles.card}>
            {tabActiveKey === '1' && (
              <div className={styles.radioWrapper}>
                <Radio.Group name="chartType" value={radioValue} onChange={this.handleChartTypeChange}>
                  <Radio value="1">柱状图</Radio>
                  <Radio value="2">饼图</Radio>
                  <Radio value="3">列表</Radio>
                </Radio.Group>
              </div>
            )}
            {this.renderChart()}
          </Card>
        </Spin>
      </PageHeaderLayout>
    );
  }
}
