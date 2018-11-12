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
  message,
} from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';

import CompanyModal from '../../BaseInfo/Company/CompanyModal';
import CheckModal from './checkModal';
import styles from './IllegalDatabase.less';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
let flow_id = [];
const PageSize = 10;

//  默认分页参数
const defaultPagination = {
  pageNum: 1,
  pageSize: 10,
};

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

const COLUMNS = [
  {
    title: '所属法律法规',
    dataIndex: 'lawTypeName',
    key: 'lawType',
    align: 'center',
    width: 120,
  },
  {
    title: '所属条款',
    dataIndex: 'article',
    key: 'article',
    align: 'center',
    width: 90,
  },
  {
    title: '法律法规内容',
    dataIndex: 'content',
    key: 'content',
    align: 'center',
    width: 300,
  },
];

/* (检查内容) */
const checkCOLUMNS = [
  {
    title: '检查点名称',
    dataIndex: 'object_title',
    key: 'object_id',
    align: 'center',
    width: 140,
  },
  {
    title: '所属行业',
    dataIndex: 'industry',
    key: 'industry',
    align: 'center',
    width: 90,
  },
  {
    title: '业务分类',
    dataIndex: 'business_type',
    key: 'business_type',
    align: 'center',
    width: 100,
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
    flowList: [],
    currentPage: 1,
    setLawIds: undefined,
    punishLawIds: undefined,
    business_type: undefined,
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

    const payload = { pageSize: PageSize, pageNum: 1 };

    if (id) {
      // 根据id获取详情
      dispatch({
        type: 'illegalDatabase/fetchIllegalList',
        payload: {
          id,
        },
        success: response => {
          const flows = response.data.list[0].checkObject;
          this.setState({ flowList: flows });
          flow_id = flows.map(d => d.flow_id);
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
      type: 'illegalDatabase/fetchOptions',
    });
    // 获取所属类别
    dispatch({
      type: 'illegalDatabase/fetchType',
    });
    this.fetchIllegal({ payload });
    this.fetchIllegalPunish({ payload });
    this.fetchIllegalCheck({ payload });
  }

  // 显示模态框(设定依据)
  handleFocus = e => {
    const { dispatch } = this.props;
    e.target.blur();
    this.setState({ set: { visible: true } });
    // 初始化表格
    dispatch({
      type: 'illegalDatabase/fetchModalList',
      ...defaultPagination,
    });
  };

  // 获取内容(设定依据)
  fetchIllegal = ({ payload }) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'illegalDatabase/fetchModalList',
      payload,
    });
  };

  // 选择按钮点击事件(设定依据)
  handleSelect = value => {
    const { setFieldsValue } = this.props.form;
    setFieldsValue({ setLawIds: value.lawTypeName + ' , ' + value.article });
    this.setState({
      setLawIds: value.id,
    });
    this.handleClose();
  };

  // 关闭模态框(设定依据)
  handleClose = () => {
    this.setState({
      set: { visible: false },
    });
  };

  // 渲染模态框(设定依据)
  renderSetModal() {
    const {
      loading,
      illegalDatabase: { modal, businessTypes, lawTypes },
    } = this.props;
    const {
      set: { visible },
    } = this.state;

    const setField = [
      {
        id: 'businessType',
        render() {
          return (
            <Select placeholder="请选择业务分类">
              {businessTypes.map(item => (
                <Option value={item.id} key={item.id}>
                  {item.label}
                </Option>
              ))}
            </Select>
          );
        },
      },
      {
        id: 'lawType',
        render() {
          return (
            <Select placeholder="请选择法律法规">
              {lawTypes.map(item => (
                <Option value={item.id} key={item.id}>
                  {item.label}
                </Option>
              ))}
            </Select>
          );
        },
      },
      {
        id: 'content',
        render() {
          return <Input placeholder="请输入法律法规内容" />;
        },
      },
    ];

    return (
      <CompanyModal
        title="选择设定依据"
        loading={loading}
        visible={visible}
        columns={COLUMNS}
        modal={modal}
        fetch={this.fetchIllegal}
        onSelect={this.handleSelect}
        onClose={this.handleClose}
        field={setField}
      />
    );
  }

  // 显示模态框(处罚依据)
  handleFocusPunish = e => {
    const { dispatch } = this.props;
    e.target.blur();
    this.setState({ punish: { visible: true } });
    // 初始化表格
    dispatch({
      type: 'illegalDatabase/fetchModalList',
      ...defaultPagination,
    });
  };

  // 获取内容(处罚依据)
  fetchIllegalPunish = ({ payload }) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'illegalDatabase/fetchModalList',
      payload,
    });
  };

  // 选择按钮点击事件(处罚依据)
  handleSelectPunish = value => {
    const { setFieldsValue } = this.props.form;
    setFieldsValue({ punishLawIds: value.lawTypeName + ' , ' + value.article });
    this.setState({
      punishLawIds: value.id,
    });
    this.handleClosePunish();
  };

  // 关闭模态框(处罚依据)
  handleClosePunish = () => {
    this.setState({ punish: { visible: false } });
  };

  // 渲染模态框(处罚依据)
  renderPunishModal() {
    const {
      loading,
      illegalDatabase: { modal, businessTypes, lawTypes },
    } = this.props;
    const {
      punish: { visible },
    } = this.state;

    const punishField = [
      {
        id: 'businessType',
        render() {
          return (
            <Select placeholder="请选择业务分类">
              {businessTypes.map(item => (
                <Option value={item.id} key={item.id}>
                  {item.label}
                </Option>
              ))}
            </Select>
          );
        },
      },
      {
        id: 'lawType',
        render() {
          return (
            <Select placeholder="请选择法律法规">
              {lawTypes.map(item => (
                <Option value={item.id} key={item.id}>
                  {item.label}
                </Option>
              ))}
            </Select>
          );
        },
      },
      {
        id: 'content',
        render() {
          return <Input placeholder="请输入法律法规内容" />;
        },
      },
    ];

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
        field={punishField}
      />
    );
  }

  // 显示模态框(检查内容)
  handleContentModal = e => {
    const { dispatch } = this.props;
    e.target.blur();
    this.setState({ check: { visible: true } });
    // 初始化表格
    dispatch({
      type: 'illegalDatabase/fetchDtoList',
      ...defaultPagination,
    });
  };

  // 获取内容（检查内容）
  fetchIllegalCheck = ({ payload }) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'illegalDatabase/fetchDtoList',
      payload,
    });
  };

  // 关闭模态框(检查内容)
  handleCloseCheck = () => {
    this.setState({ check: { visible: false } });
  };

  // 处理数据（检查内容table）
  handleTableData = (list = [], indexBase) => {
    return list.map((item, index) => {
      return {
        ...item,
        index: indexBase + index + 1,
      };
    });
  };

  // 渲染模态框(检查内容)
  renderCheckModal() {
    const {
      illegalDatabase: { checkModal, businessTypes },
      loading,
    } = this.props;
    const {
      check: { visible },
      flowList,
    } = this.state;
    /* (检查内容) */
    const contentCOLUMNS = [
      {
        title: '检查内容',
        dataIndex: 'flow_name',
        key: 'flow_name',
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
            <a
              onClick={() => {
                if (flow_id.join(',').indexOf(record.flow_id) >= 0) {
                  return;
                }
                this.setState({ flowList: [...flowList, record] });
                flow_id.push(record.flow_id);
              }}
            >
              {flow_id.join(',').indexOf(record.flow_id) >= 0 ? '已添加' : '添加'}
            </a>
          </span>
        ),
      },
    ];
    const checkField = [
      {
        id: 'object_title',
        render() {
          return <Input placeholder="请输入检查项名称" />;
        },
        transform(value) {
          return value.trim();
        },
      },
      {
        id: 'business_type',
        render() {
          return (
            <Select placeholder="请选择业务分类">
              {businessTypes.map(item => (
                <Option value={item.id} key={item.id}>
                  {item.label}
                </Option>
              ))}
            </Select>
          );
        },
      },
    ];

    return (
      <CheckModal
        title="选择检查内容"
        loading={loading}
        visible={visible}
        columns={checkCOLUMNS}
        column={contentCOLUMNS}
        checkModal={checkModal}
        fetch={this.fetchIllegalCheck}
        onClose={this.handleCloseCheck}
        field={checkField}
        actSelect={false}
      />
    );
  }

  // 删除检查内容添加项
  handleDeleteCheck = key => {
    const flowList = [...this.state.flowList];
    this.setState({ flowList: flowList.filter(item => item.flow_id !== key) });
    flow_id = flow_id.filter(d => d !== key);
  };

  // 点击提交按钮验证表单信息
  handleClickValidate = () => {
    const {
      form: { validateFieldsAndScroll },
      match: {
        params: { id },
      },
      dispatch,
    } = this.props;
    validateFieldsAndScroll((error, values) => {
      if (!error) {
        this.setState({
          submitting: true,
        });
        const { businessType, typeCode, actContent, discretionStandard, enable } = values;

        const { setLawIds, punishLawIds } = this.state;

        const payload = {
          id,
          businessType,
          typeCode,
          actContent,
          setLawIds: setLawIds,
          punishLawIds: punishLawIds,
          discretionStandard,
          enable: +enable,
          checkObjectIds: flow_id.join(','),
        };
        const success = () => {
          const msg = id ? '编辑成功' : '新增成功';
          message.success(msg, 1, this.goBack());
        };
        const error = () => {
          const msg = id ? '编辑失败' : '新增失败';
          message.error(msg, 1);
          this.setState({
            submitting: false,
          });
        };
        // 如果id存在的话，为编辑
        if (id) {
          dispatch({
            type: 'illegalDatabase/editIllegal',
            payload: {
              id,
              ...payload,
            },
            success,
            error,
          });
        }
        // 不存在id,则为新增
        else {
          dispatch({
            type: 'illegalDatabase/insertIllegal',
            payload,
            success,
            error,
          });
        }
      }
    });
  };

  /* 渲染table(检查内容) */
  renderCheckTable() {
    const { tableLoading } = this.props;
    const { flowList: list, currentPage } = this.state;
    const indexBase = (currentPage - 1) * PageSize;

    const BusinessType = ['安全生产', '消防', '环保', '卫生'];

    /* 配置描述 */
    const COLUMNS = [
      {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
        align: 'center',
        width: 20,
      },
      {
        title: '业务分类',
        dataIndex: 'business_type',
        key: 'business_type',
        align: 'center',
        width: 65,
        render: val => {
          return BusinessType[val - 1];
        },
      },
      {
        title: '所属行业',
        dataIndex: 'industry',
        key: 'industry',
        align: 'center',
        width: 70,
      },
      {
        title: '检查大项',
        dataIndex: 'check_way',
        key: 'check_way',
        align: 'center',
        width: 80,
      },
      {
        title: '检查小项',
        dataIndex: 'flow_name',
        key: 'flow_name',
        align: 'center',
        width: 150,
      },
      {
        title: '隐患等级',
        dataIndex: 'danger_level',
        key: 'danger_level',
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
              onConfirm={() => this.handleDeleteCheck(record.flow_id)}
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
            dataSource={this.handleTableData(list, indexBase)}
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
      match: {
        params: { id },
      },
      form: { getFieldDecorator },
      illegalDatabase: {
        data: { list },
        businessTypes,
        typeCodes,
      },
    } = this.props;

    const detail = list.find(d => d.id === id) || {};
    const {
      businessType,
      typeCode,
      actContent,
      setLaw = [],
      punishLaw = [],
      discretionStandard,
      enable,
    } = detail;

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
                  <Option value={item.value} key={item.value}>
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
              initialValue: setLaw.map(s => s.lawTypeName + ' ' + s.article).join(','),
              rules: [
                {
                  required: true,
                  message: '请选择设定依据',
                },
              ],
            })(<Input placeholder="请选择设定依据" onFocus={this.handleFocus} />)}
          </FormItem>

          <FormItem {...formItemLayout} label={fieldLabels.punishBasis}>
            {getFieldDecorator('punishLawIds', {
              initialValue: punishLaw.map(s => s.lawTypeName + ' ' + s.article).join(','),
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
              initialValue: +enable,
            })(<Switch checkedChildren="是" unCheckedChildren="否" />)}
          </FormItem>

          <FormItem {...formItemLayout} label={fieldLabels.checkContent}>
            <Button type="primary" style={{ float: 'right' }} onClick={this.handleContentModal}>
              添加
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
