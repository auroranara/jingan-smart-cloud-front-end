import React, { PureComponent, Fragment } from 'react';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import moment from 'moment';
import { connect } from 'dva';
import router from 'umi/router';
import {
  Card,
  Form,
  Button,
  Row,
  Col,
  Input,
  Checkbox,
  DatePicker,
  AutoComplete,
  Transfer,
  Modal,
  Table,
  Icon,
  message,
  Tag,
} from 'antd';
import styles from './ExaminationMissionAdd.less';

const { RangePicker } = DatePicker;

const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 14 },
};

const defaultPageSize = 10;

const paperColumns = [
  {
    title: '试卷名称',
    dataIndex: 'name',
    align: 'center',
    width: 500,
  },
  {
    title: '抽题规则',
    dataIndex: 'ruleTypeName',
    align: 'center',
    width: 300,
  },
  {
    title: '出题时间',
    dataIndex: 'createTimeStr',
    align: 'center',
    width: 300,
  },
];

@Form.create()
@connect(({ examinationMission, user }) => ({
  examinationMission,
  user,
}))
export default class ExaminationMissionAdd extends PureComponent {
  constructor() {
    super();
    this.state = {
      paperModalVisible: false, // 控制选择试卷弹窗可见
      studentsModalVisible: false, // 控制选择考生弹窗可见
      selectedRowKeys: [], // 勾选的试卷key
      selectedRows: [], // 勾选的试卷信息
      targetKeys: [], // 考试人员穿梭狂右侧keys
      // examStudents: [], // 考试人员穿梭狂左侧数据源
      disableMin: false,
    };
  }

  componentDidMount() {
    const {
      dispatch,
      form: { setFieldsValue },
      match: {
        params: { id },
      },
      user: {
        currentUser: { id: userId },
      },
    } = this.props;
    // 从session中获取companyId
    const { id: companyId } =
      JSON.parse(sessionStorage.getItem(`examination_mission_list_company_${userId}`)) || {};
    // 获取当前企业的考试人员列表
    dispatch({
      type: 'examinationMission/fetchExamStudents',
      payload: {
        pageNum: 1,
        pageSize: defaultPageSize,
        companyId,
        // examId: id,
      },
    });
    // 如果新增
    if (!id) {
      dispatch({
        type: 'examinationMission/fetchDetail',
      });
      // 设置默认值 考试时长90min 合格率60% 考试规则第一项
      setFieldsValue({ arrRuleType: ['1'], examLimit: 90, percentOfPass: 60 });
    } else {
      // 如果编辑
      dispatch({
        type: 'examinationMission/fetchDetail',
        payload: {
          id,
        },
        success: response => {
          const { arrRuleType, paperId, paperName, students } = response;
          setFieldsValue({
            arrRuleType,
            paperId: { key: paperId, label: paperName },
            students,
          });
          this.setState({
            selectedRows: [{ id: paperId, name: paperName }],
            selectedRowKeys: [paperId],
            targetKeys: students.map(s => s.studentId),
          });
        },
      });
    }
  }

  range = (start, end) => {
    const result = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  };

  disabledDate = current => {
    return current && current < moment().startOf('day');
  };

  disabledDateTime = (_, type) => {
    // 开始时间才需要筛选
    const { disableMin } = this.state;
    if (type === 'start' && this.disTime) {
      return {
        disabledHours: () => this.range(0, 24).slice(0, moment().hour()),
        disabledMinutes: () =>
          // this.range(0, 60).slice(0, 0),
          disableMin ? this.range(0, 60).slice(0, moment().minute()) : this.range(0, 0),
        disabledSeconds: () => this.range(0, 60).slice(0, moment().second()),
      };
    }
  };

  // 点击返回
  handleToBack = () => {
    router.push('/training/mission/list');
  };

  //点击提交
  handleSubmit = () => {
    const {
      dispatch,
      form: { validateFields },
      match: {
        params: { id },
      },
      user: {
        currentUser: { id: userId },
      },
    } = this.props;
    validateFields((errors, values) => {
      if (!errors) {
        // 从session中获取companyId
        const { id: companyId } =
          JSON.parse(sessionStorage.getItem(`examination_mission_list_company_${userId}`)) || {};
        // 新增 TODO：企业id 企业人员新增不需要companyId
        const {
          timeRange: [start, end],
          paperId,
          ...others
        } = values;
        const payload = {
          ...others,
          id,
          startTime: moment(start).format('YYYY/MM/DD HH:mm:00'),
          endTime: moment(end).format('YYYY/MM/DD HH:mm:00'),
          paperId: paperId.key,
          companyId,
        };
        if (!id) {
          dispatch({
            type: 'examinationMission/addExam',
            payload,
            success: () => {
              message.success('新增成功');
              router.push('/training/mission/list');
            },
            error: () => {
              message.error('新增失败');
            },
          });
        } else {
          dispatch({
            type: 'examinationMission/edit',
            payload,
            success: () => {
              message.success('编辑成功');
              router.push('/training/mission/list');
            },
            error: () => {
              message.error('编辑失败');
            },
          });
        }
      }
    });
  };

  // 点击删除考试人员
  handleDeleteStudent = id => {
    const {
      form: { getFieldValue, setFieldsValue },
    } = this.props;
    const { targetKeys } = this.state;
    const students = getFieldValue('students');
    setFieldsValue({ students: students.filter(item => item.studentId !== id) });
    this.setState({ targetKeys: targetKeys.filter(item => item !== id) });
  };

  // 点击选择按钮
  handleViewPaperModal = () => {
    const {
      dispatch,
      user: {
        currentUser: { id: userId },
      },
    } = this.props;
    // 从session中获取companyId
    const { id: companyId } =
      JSON.parse(sessionStorage.getItem(`examination_mission_list_company_${userId}`)) || {};
    // 获取试卷列表
    dispatch({
      type: 'examinationMission/fetchExamPaper',
      payload: {
        pageNum: 1,
        pageSize: defaultPageSize,
        companyId,
      },
    });
    this.setState({
      paperModalVisible: true,
    });
  };

  // 试卷列表左侧选择框选择变化
  onPaperSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRowKeys, selectedRows });
  };

  // 选择试卷弹窗点击确认试卷
  handleConfirmPaper = () => {
    const { selectedRows } = this.state;
    const {
      form: { setFieldsValue },
    } = this.props;
    if (!selectedRows || selectedRows.length === 0) {
      message.error('请先选择试卷');
      return;
    }
    const { name, id } = selectedRows[0];
    // 将选择的试卷填入form表单
    setFieldsValue({
      paperId: { key: id, label: name },
    });
    this.setState({ paperModalVisible: false });
  };

  // 试卷列表翻页
  handlePaperPageChange = (pageNum, pageSize) => {
    const {
      dispatch,
      user: {
        currentUser: { id: userId },
      },
    } = this.props;
    // 从session中获取companyId
    const { id: companyId } =
      JSON.parse(sessionStorage.getItem(`examination_mission_list_company_${userId}`)) || {};
    // 获取试卷列表
    dispatch({
      type: 'examinationMission/fetchExamPaper',
      payload: {
        pageNum,
        pageSize,
        companyId,
      },
    });
  };

  // 打开选择考试人员弹窗
  handleViewStudentsModal = () => {
    this.setState({ studentsModalVisible: true });
  };

  // 考试人员穿梭狂变化
  handleTransferChange = (nextTargetKeys, direction, moveKeys) => {
    this.setState({ targetKeys: nextTargetKeys });
  };

  // 确认考试人员
  handleConfirmStudents = () => {
    const { targetKeys } = this.state;
    const {
      form: { setFieldsValue },
      examinationMission: {
        examStudents: { list },
      },
    } = this.props;
    const newStudents = list.reduce((arr, { studentId, name }) => {
      return targetKeys.includes(studentId) ? [...arr, { studentId, name }] : arr;
    }, []);
    setFieldsValue({ students: newStudents });
    this.setState({ studentsModalVisible: false });
  };

  // 渲染选择试卷弹窗
  renderSelectPaper = () => {
    const {
      examinationMission: {
        examPaper: {
          list,
          pagination: { pageNum, pageSize, total },
        },
      },
    } = this.props;
    const { paperModalVisible, selectedRowKeys } = this.state;
    return (
      <Modal
        title="选择试卷"
        visible={paperModalVisible}
        width={800}
        onCancel={() => {
          this.setState({ paperModalVisible: false });
        }}
        onOk={this.handleConfirmPaper}
      >
        <Table
          rowKey="id"
          dataSource={list}
          columns={paperColumns}
          rowSelection={{
            type: 'radio',
            columnTitle: '选项',
            onChange: this.onPaperSelectChange,
            selectedRowKeys,
          }}
          pagination={{
            current: pageNum,
            pageSize,
            total,
            onChange: this.handlePaperPageChange,
          }}
        />
      </Modal>
    );
  };

  // 渲染选择人员
  renderSelectStudents = () => {
    const { studentsModalVisible, targetKeys } = this.state;
    const {
      examinationMission: {
        examStudents: { list = [] },
      },
    } = this.props;
    return (
      <Modal
        title="选择人员"
        visible={studentsModalVisible}
        width={800}
        onCancel={() => {
          this.setState({ studentsModalVisible: false });
        }}
        onOk={this.handleConfirmStudents}
      >
        <Transfer
          dataSource={[...list]} // 数据源（左侧）
          titles={['未选择人员', '已选择人员']}
          targetKeys={targetKeys} // 右侧数据的key集合
          onChange={this.handleTransferChange}
          render={item => item.name}
          rowKey={record => record.studentId}
        />
      </Modal>
    );
  };

  render() {
    const {
      form: { getFieldDecorator, getFieldValue },
      examinationMission: {
        detail: { name, percentOfPass, examLimit, startTime, endTime },
      },
      match: {
        params: { id },
      },
    } = this.props;
    const { studentsModalVisible } = this.state;
    const title = id ? '编辑考试任务' : '新增考试任务';
    const arrRuleType = getFieldValue('arrRuleType') || [];
    const breadcrumbList = [
      { title: '首页', name: '首页', href: '/' },
      { title: '培训', name: '培训' },
      { title: '考试任务', name: '考试任务', href: '/training/mission/list' },
      { title, name: title },
    ];
    const students = getFieldValue('students') || [];
    return (
      <PageHeaderLayout title={title} breadcrumbList={breadcrumbList}>
        <Card className={styles.examinationMissionAdd}>
          <Form>
            <Row>
              <Form.Item label="考试名称" {...formItemLayout}>
                {getFieldDecorator('name', {
                  initialValue: name,
                  validateTrigger: 'onBlur',
                  rules: [
                    { required: true, message: '请输入考试名称' },
                    { min: 6, max: 30, message: '请输入不少于6个字符，不超过30个字符' },
                  ],
                })(<Input />)}
              </Form.Item>
            </Row>
            <Row>
              <Form.Item label="考试规则" {...formItemLayout}>
                {getFieldDecorator('arrRuleType', {
                  rules: [{ required: true, message: '请选择考试规则', type: 'array' }],
                })(
                  <Checkbox.Group>
                    <Row>
                      <Col span={24}>
                        <Checkbox
                          value={'1'}
                          disabled={arrRuleType.includes('2') || arrRuleType.includes('3')}
                        >
                          统一顺序
                        </Checkbox>
                      </Col>
                      <Col span={24}>
                        <Checkbox value={'2'} disabled={arrRuleType.includes('1')}>
                          选项随机
                        </Checkbox>
                      </Col>
                      <Col span={24}>
                        <Checkbox value={'3'} disabled={arrRuleType.includes('1')}>
                          顺序随机
                        </Checkbox>
                      </Col>
                    </Row>
                  </Checkbox.Group>
                )}
              </Form.Item>
            </Row>
            <Row>
              <Form.Item label="考试时长" {...formItemLayout}>
                {getFieldDecorator('examLimit', {
                  initialValue: examLimit,
                  rules: [
                    { required: true, message: '请输入考试时长' },
                    { type: 'number', message: '请输入数字' },
                  ],
                  validateTrigger: 'onBlur',
                  getValueFromEvent: e => {
                    const value = e.target.value;
                    return isNaN(value) ? 0 : Math.round(value);
                  },
                })(<Input addonAfter="分钟" />)}
              </Form.Item>
            </Row>
            <Row>
              <Form.Item label="合格率" {...formItemLayout}>
                {getFieldDecorator('percentOfPass', {
                  initialValue: percentOfPass,
                  validateTrigger: 'onBlur',
                  rules: [
                    { required: true, message: '请输入合格率' },
                    { type: 'number', min: 1, max: 100, message: '请输入0-100以内的整数' },
                  ],
                  getValueFromEvent: e => {
                    const value = e.target.value;
                    return isNaN(value) ? value : Math.round(value);
                  },
                })(<Input addonAfter="%" />)}
              </Form.Item>
            </Row>
            <Row>
              <Form.Item label="考试期限" {...formItemLayout}>
                {getFieldDecorator('timeRange', {
                  initialValue: startTime ? [moment(startTime), moment(endTime)] : [],
                  rules: [
                    {
                      required: true,
                      validator: (rule, value, callback) => {
                        const {
                          form: { getFieldValue },
                        } = this.props;
                        const examLimit = +getFieldValue('examLimit') * 60000;
                        const diff = moment(value[1]).diff(moment(value[0]));
                        if (value.length < 2) {
                          callback('请选择考试期限!');
                          return;
                        }
                        if (diff < examLimit) {
                          callback('所选考试期限时长需大于考试时长!');
                        } else {
                          callback();
                        }
                      },
                    },
                  ],
                })(
                  <RangePicker
                    disabledDate={this.disabledDate}
                    disabledTime={this.disabledDateTime}
                    showTime={{ format: 'HH:mm' }}
                    format="YYYY-MM-DD HH:mm"
                    onCalendarChange={dates => {
                      if (dates.length !== 2) return;
                      const selectDay = moment(dates[0]).format('YYYY-MM-DD');
                      const thisDay = moment().format('YYYY-MM-DD');
                      if (selectDay !== thisDay) return; // 所选日期不是今日时间随意选
                      this.disTime = true;
                      const selectHour = moment(dates[0]).format('HH');
                      const thisHour = moment().format('HH');
                      if (selectHour !== thisHour) {
                        this.setState({ disableMin: false });
                        return;
                      }
                      // 所选日期是今日今时分钟disable当前以前的
                      this.setState({ disableMin: true });
                    }}
                  />
                )}
              </Form.Item>
            </Row>
            <Row>
              <Form.Item label="选择试卷" {...formItemLayout}>
                {getFieldDecorator('paperId', {
                  rules: [{ required: true, message: '请选择试卷', type: 'object' }],
                })(
                  <AutoComplete labelInValue mode="combobox" optionLabelProp="children" disabled>
                    <Input
                      suffix={
                        <Button type="primary" onClick={this.handleViewPaperModal}>
                          选择
                        </Button>
                      }
                    />
                  </AutoComplete>
                )}
              </Form.Item>
            </Row>
            <Row>
              <Form.Item label="考试人员" {...formItemLayout}>
                {getFieldDecorator('students', {
                  rules: [{ required: true, message: '请选择考试人员', type: 'array' }],
                })(
                  <Fragment>
                    <Icon
                      onClick={this.handleViewStudentsModal}
                      type="search"
                      className={styles.iconSelectStudents}
                    />
                    <div className={styles.studentsContainer}>
                      {students.map(item => (
                        <Tag
                          closable
                          onClose={() => this.handleDeleteStudent(item.studentId)}
                          color="#108ee9"
                          key={item.studentId}
                        >
                          {item.name}
                        </Tag>
                      ))}
                    </div>
                  </Fragment>
                )}
              </Form.Item>
            </Row>
            <div style={{ textAlign: 'center' }}>
              <Button style={{ marginRight: '24px' }} onClick={this.handleToBack}>
                取消
              </Button>
              <Button type="primary" onClick={this.handleSubmit}>
                保存
              </Button>
            </div>
          </Form>
        </Card>
        {this.renderSelectPaper()}
        {studentsModalVisible && this.renderSelectStudents()}
      </PageHeaderLayout>
    );
  }
}
