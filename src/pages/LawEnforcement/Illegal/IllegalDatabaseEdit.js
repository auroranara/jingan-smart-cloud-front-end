import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import FooterToolbar from '@/components/FooterToolbar';
import {
  Form,
  Input,
  Button,
  Card,
  Col,
  Switch,
  Select,
  Divider,
  Popover,
  Icon,
  Table,
  Popconfirm,
  // message,
} from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';

import CompanyModal from '../../BaseInfo/Company/CompanyModal';
import CheckModal from './checkModal';
import styles from './IllegalDatabase.less';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

const PageSize = 5;

/* 标题---编辑 */
const editTitle = '编辑违法行为';
/* 标题---新增 */
const addTitle = '新增违法行为';

/* 表单标签 */
const fieldLabels = {
  businessClassify: '所属业务分类',
  hasType: '所属类别',
  illegalAct: '违法行为',
  setBasis: '设定依据',
  punishBasis: '处罚依据',
  discretionaryBasis: '裁量基准',
  isUse: '是否启用',
  checkContent: '检查内容',
};

/* (设定依据) */
const COLUMNS = [
  {
    title: '所属法律法规',
    dataIndex: 'lawsRegulations',
    key: 'lawsRegulations',
    align: 'center',
    width: 120,
  },
  {
    title: '所属条款',
    dataIndex: 'subClause',
    key: 'subClause',
    align: 'center',
    width: 90,
  },
  {
    title: '法律法规内容',
    dataIndex: 'lawsRegulationsInput',
    key: 'lawsRegulationsInput',
    align: 'center',
    width: 300,
  },
];

/* (检查内容) */
const checkCOLUMNS = [
  {
    title: '检查点名称',
    dataIndex: 'checkName',
    key: 'checkName',
    align: 'center',
    width: 140,
  },
  {
    title: '所属行业',
    dataIndex: 'hasIndustry',
    key: 'hasIndustry',
    align: 'center',
    width: 90,
  },
  {
    title: '业务分类',
    dataIndex: 'businessClassify',
    key: 'businessClassify',
    align: 'center',
    width: 100,
  },
];

const checkList = [
  {
    checkName: '检查点',
    hasIndustry: '制造业',
    businessClassify: '环保',
  },
];

/* (检查内容) */
const contentCOLUMNS = [
  {
    title: '检查内容',
    dataIndex: 'checkContent',
    key: 'checkContent',
    align: 'center',
    width: 300,
  },
  {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
    align: 'center',
    width: 80,
    render: (text, record) => (
      <span>
        <a>添加</a>
      </span>
    ),
  },
];

/* 表单(设定依据) */
const setField = [
  {
    id: 'businessClassify',
    render() {
      return <Select placeholder="请选择业务分类" />;
    },
    transform(value) {
      return value.trim();
    },
  },
  {
    id: 'lawsRegulations',
    render() {
      return <Select placeholder="请选择法律法规" />;
    },
    transform(value) {
      return value.trim();
    },
  },
];

/* 表单(检查内容) */
const checkField = [
  {
    id: 'checkName',
    render() {
      return <Input placeholder="请输入检查项名称" />;
    },
    transform(value) {
      return value.trim();
    },
  },
  {
    id: 'businessClassify',
    render() {
      return <Select placeholder="请选择业务分类" />;
    },
    transform(value) {
      return value.trim();
    },
  },
];

@connect(({ illegalDatabase, lawDatabase, user, loading }) => ({
  illegalDatabase,
  lawDatabase,
  user,
  loading: loading.models.illegalDatabase,
}))
@Form.create()
export default class IllegalDatabaseEdit extends PureComponent {
  state = {
    set: {
      visible: false,
    },
    punish: {
      visible: false,
    },
    check: {
      visible: false,
    },
    clickContent: false,
  };

  // 返回到列表页面
  goBack = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push(`/law-enforcement/illegal/list`));
  };

  // 挂载后
  componentDidMount() {
    const {
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;
    if (id) {
      // 根据id获取详情
      dispatch({
        type: 'illegalDatabase/fetchIllegalList',
        payload: {
          id,
        },
      });
    } else {
      // 清空详情
      dispatch({
        type: 'illegalDatabase/clearDetail',
      });
    }
    // 获取初始化选项
    dispatch({
      type: 'lawDatabase/fetchOptions',
    });
    // 获取所属类别
    dispatch({
      type: 'illegalDatabase/fetchType',
    });
  }

  // 显示模态框(设定依据)
  handleFocusSet = e => {
    e.target.blur();
    this.setState({ set: { visible: true } });
  };

  // 获取内容(设定依据)
  fetchIllegalSet = ({ payload }) => {
    const { dispatch } = this.props;
    dispatch({ type: 'illegalDatabase/', payload });
  };

  // 选择按钮点击事件(设定依据)
  handleSelect = item => {
    // const { setFieldsValue } = this.props.form;
    // const { id, name } = item;
    // this.companyId = id;
    // setFieldsValue({ companyName: name });
    this.handleCloseSet();
  };

  // 关闭模态框(设定依据)
  handleCloseSet = () => {
    this.setState({ set: { visible: false } });
  };

  // 渲染模态框(设定依据)
  renderSetModal() {
    const {
      illegalDatabase: { modal },
      loading,
    } = this.props;
    const {
      set: { visible },
    } = this.state;
    return (
      <CompanyModal
        title="选择设定依据"
        loading={loading}
        visible={visible}
        columns={COLUMNS}
        modal={modal}
        fetch={this.fetchIllegalSet}
        onSelect={this.handleSelectSet}
        onClose={this.handleCloseSet}
        field={setField}
      />
    );
  }

  // 显示模态框(处罚依据)
  handleFocusPunish = e => {
    e.target.blur();
    this.setState({ punish: { visible: true } });
  };

  // 获取内容(处罚依据)
  fetchIllegalPunish = ({ payload }) => {
    const { dispatch } = this.props;
    dispatch({ type: 'illegalDatabase/', payload });
  };

  // 选择按钮点击事件(处罚依据)
  handleSelectPunish = item => {
    // const { setFieldsValue } = this.props.form;
    // const { id, name } = item;
    // this.companyId = id;
    // setFieldsValue({ companyName: name });
    this.handleClosePunish();
  };

  // 关闭模态框(处罚依据)
  handleClosePunish = () => {
    this.setState({ punish: { visible: false } });
  };

  // 渲染模态框(处罚依据)
  renderPunishModal() {
    const {
      illegalDatabase: { modal },
      loading,
    } = this.props;
    const {
      punish: { visible },
    } = this.state;
    return (
      <CompanyModal
        title="选择处罚依据"
        loading={loading}
        visible={visible}
        columns={COLUMNS}
        modal={modal}
        fetch={this.fetchIllegalPunish}
        onSelect={this.handleSelectPunish}
        onClose={this.handleClosePunish}
        field={setField}
      />
    );
  }

  // 显示模态框(检查内容)
  handleContentModal = e => {
    e.target.blur();
    this.setState({ check: { visible: true } });
  };

  // 关闭模态框(检查内容)
  handleCloseCheck = () => {
    this.setState({ check: { visible: false }, clickContent: false });
  };

  showContentTable = () => {
    this.setState({ clickContent: true });
  };

  // 渲染模态框(检查内容)
  renderCheckModal() {
    const {
      illegalDatabase: { modal },
      loading,
    } = this.props;
    const {
      check: { visible },
      clickContent,
    } = this.state;

    return (
      <CheckModal
        title="选择检查内容"
        loading={loading}
        visible={visible}
        columns={checkCOLUMNS}
        column={contentCOLUMNS}
        checkList={checkList}
        clickContent={clickContent}
        modal={modal}
        fetch={this.fetchIllegalCheck}
        onSelect={this.handleSelectCheck}
        onClose={this.handleCloseCheck}
        onClick={this.handleContentTable}
        onShowTable={this.showContentTable}
        field={checkField}
        actSelect={false}
      />
    );
  }

  // 点击提交按钮验证表单信息
  handleClickValidate = () => {};

  /* 渲染table(检查内容) */
  renderCheckTable() {
    const { tableLoading } = this.props;

    const list = [
      {
        number: '001',
        businessClassify: '安全生产',
        hasIndustry: '制造业',
        inspectionBig: '用电安全',
        inspectionSmall: '用电安全用电安全用电安全用电安全用电安全',
        dangerGrade: '一般隐患',
      },
      {
        number: '001',
        businessClassify: '安全生产',
        hasIndustry: '制造业',
        inspectionBig: '用电安全',
        inspectionSmall: '用电安全用电安全用电安全用电安全用电安全',
        dangerGrade: '一般隐患',
      },
    ];

    /* 配置描述 */
    const COLUMNS = [
      {
        title: '序号',
        dataIndex: 'number',
        key: 'number',
        align: 'center',
        width: 20,
      },
      {
        title: '业务分类',
        dataIndex: 'businessClassify',
        key: 'businessClassify',
        align: 'center',
        width: 65,
      },
      {
        title: '所属行业',
        dataIndex: 'hasIndustry',
        key: 'hasIndustry',
        align: 'center',
        width: 70,
      },
      {
        title: '检查大项',
        dataIndex: 'inspectionBig',
        key: 'inspectionBig',
        align: 'center',
        width: 80,
      },
      {
        title: '检查小项',
        dataIndex: 'inspectionSmall',
        key: 'inspectionSmall',
        align: 'center',
        width: 150,
      },
      {
        title: '隐患等级',
        dataIndex: 'dangerGrade',
        key: 'dangerGrade',
        align: 'center',
        width: 65,
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        align: 'center',
        width: 50,
        render: (text, record) => (
          <span>
            <Popconfirm
              title="确认要删除该检查内容吗？"
              onConfirm={() => this.handleDelete(record)}
            >
              <a>删除</a>
            </Popconfirm>
          </span>
        ),
      },
    ];

    return (
      <Card style={{ marginTop: '-25px' }}>
        {list && list.length ? (
          <Table
            loading={tableLoading}
            rowKey="id"
            columns={COLUMNS}
            dataSource={list}
            pagination={{ pageSize: PageSize }}
            bordered
          />
        ) : (
          <div style={{ textAlign: 'center' }}>暂无数据</div>
        )}
      </Card>
    );
  }

  // 渲染信息
  renderLawsInfo() {
    const {
      form: { getFieldDecorator },
      illegalDatabase: {
        detail: {
          businessType,
          typeCode,
          actContent,
          setLawIds,
          punishLawIds,
          discretionStandard,
          enable,
          // checkObjectIds,
        },
        businessTypes,
        typeCodes,
      },
    } = this.props;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };

    return (
      <Card className={styles.card} bordered={false}>
        <Form hideRequiredMark style={{ marginTop: 8 }}>
          <FormItem {...formItemLayout} label={fieldLabels.businessClassify}>
            <Col span={24}>
              {getFieldDecorator('businessType', {
                initialValue: businessType,
                rules: [
                  {
                    required: true,
                    message: '请选择业务分类',
                  },
                ],
              })(
                <Select placeholder="请选择业务分类">
                  {businessTypes.map(item => (
                    <Option value={item.id} key={item.id}>
                      {item.label}
                    </Option>
                  ))}
                </Select>
              )}
            </Col>
          </FormItem>

          <FormItem {...formItemLayout} label={fieldLabels.hasType}>
            {getFieldDecorator('typeCode', {
              initialValue: typeCode,
              rules: [
                {
                  required: true,
                  message: '请选择所属类别',
                },
              ],
            })(
              <Select placeholder="请选择所属类别">
                {typeCodes.map(item => (
                  <Option value={item.id} key={item.id}>
                    {item.label}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>

          <FormItem {...formItemLayout} label={fieldLabels.illegalAct}>
            {getFieldDecorator('actContent', {
              initialValue: actContent,
              rules: [
                {
                  required: true,
                  message: '请输入违法行为',
                  whitespace: true,
                },
              ],
            })(<TextArea rows={4} placeholder="请输入违法行为" maxLength="2000" />)}
          </FormItem>

          <FormItem {...formItemLayout} label={fieldLabels.setBasis}>
            {getFieldDecorator('setLawIds', {
              initialValue: setLawIds,
              rules: [
                {
                  required: true,
                  message: '请选择设定依据',
                },
              ],
            })(<Input placeholder="请选择设定依据" onFocus={this.handleFocusSet} />)}
          </FormItem>

          <FormItem {...formItemLayout} label={fieldLabels.punishBasis}>
            {getFieldDecorator('punishLawIds', {
              initialValue: punishLawIds,
              rules: [
                {
                  required: true,
                  message: '请选择处罚依据',
                },
              ],
            })(<Input placeholder="请选择处罚依据" onFocus={this.handleFocusPunish} />)}
          </FormItem>

          <FormItem {...formItemLayout} label={fieldLabels.discretionaryBasis}>
            {getFieldDecorator('discretionStandard', {
              initialValue: discretionStandard,
              rules: [{ required: true, message: '请输入裁量基准', whitespace: true }],
            })(<TextArea rows={4} placeholder="请输入裁量基准" maxLength="2000" />)}
          </FormItem>

          <FormItem {...formItemLayout} label={fieldLabels.isUse}>
            {getFieldDecorator('enable', {
              valuePropName: 'checked',
              initialValue: !!enable,
            })(<Switch checkedChildren="是" unCheckedChildren="否" />)}
          </FormItem>

          <FormItem {...formItemLayout} label={fieldLabels.checkContent}>
            <Button type="primary" style={{ float: 'right' }} onClick={this.handleContentModal}>
              添加内容
            </Button>
          </FormItem>
          <Divider style={{ marginTop: '-20px' }} />
          {this.renderCheckTable()}
        </Form>
      </Card>
    );
  }

  /* 渲染错误信息 */
  renderErrorInfo() {
    const {
      form: { getFieldsError },
    } = this.props;
    const errors = getFieldsError();
    const errorCount = Object.keys(errors).filter(key => errors[key]).length;
    if (!errors || errorCount === 0) {
      return null;
    }
    const scrollToField = fieldKey => {
      const labelNode = document.querySelector(`label[for="${fieldKey}"]`);
      if (labelNode) {
        labelNode.scrollIntoView(true);
      }
    };
    const errorList = Object.keys(errors).map(key => {
      if (!errors[key]) {
        return null;
      }
      return (
        <li key={key} className={styles.errorListItem} onClick={() => scrollToField(key)}>
          <Icon type="cross-circle-o" className={styles.errorIcon} />
          <div className={styles.errorMessage}>{errors[key][0]}</div>
          <div className={styles.errorField}>{fieldLabels[key]}</div>
        </li>
      );
    });
    return (
      <span className={styles.errorIcon}>
        <Popover
          title="表单校验信息"
          content={errorList}
          overlayClassName={styles.errorPopover}
          trigger="click"
          getPopupContainer={trigger => trigger.parentNode}
        >
          <Icon type="exclamation-circle" />
          {errorCount}
        </Popover>
      </span>
    );
  }

  /* 渲染底部工具栏 */
  renderFooterToolbar() {
    return (
      <FooterToolbar>
        {this.renderErrorInfo()}
        <Button size="large" type="primary" onClick={this.handleClickValidate}>
          提交
        </Button>
      </FooterToolbar>
    );
  }

  // 渲染页面所有信息
  render() {
    const {
      match: {
        params: { id },
      },
    } = this.props;
    const title = id ? editTitle : addTitle;

    // 面包屑
    const breadcrumbList = [
      {
        title: '首页',
        name: '首页',
        href: '/',
      },
      {
        title: '执法检查',
        name: '执法检查',
      },
      {
        title: '违法行为库',
        name: '违法行为库',
        href: '/law-enforcement/illegal/list',
      },
      {
        title,
        name: title,
      },
    ];

    return (
      <PageHeaderLayout title={title} breadcrumbList={breadcrumbList}>
        {this.renderLawsInfo()}
        {this.renderFooterToolbar()}
        {this.renderSetModal()}
        {this.renderPunishModal()}
        {this.renderCheckModal()}
      </PageHeaderLayout>
    );
  }
}
