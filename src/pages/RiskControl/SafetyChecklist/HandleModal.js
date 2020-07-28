import { Component } from 'react';
import { Form } from '@ant-design/compatible';
import { Modal, Input, Select, Button } from 'antd';
import CompanySelect from '@/jingan-components/CompanySelect';
import CompanyModal from '@/pages/BaseInfo/Company/CompanyModal';
import { connect } from 'dva';
import { analysisFunDict } from './List';

const FormItem = Form.Item;

const formWrapper = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
}
const itemProps = { style: { width: '70%', marginRight: '10px' } };
const field = [
  {
    id: 'objectTitle',
    render: () => <Input placeholder="风险点名称" />,
  },
];
const columns = [
  {
    title: '风险点名称',
    dataIndex: 'objectTitle',
    key: 'objectTitle',
    align: 'center',
  },
];

// 新增/编辑弹窗
@connect(({ riskPointManage, user, loading }) => ({
  riskPointManage,
  user,
  modalLoading: loading.effects['riskPointManage/fetchRiskList'],
}))
@Form.create()
export default class HandleModal extends Component {

  state = {
    modalVisible: false,
    riskPoint: undefined, // {objectTitle, itemId }
  };

  componentDidUpdate (preProps) {
    if (preProps.visible !== this.props.visible && this.props.visible) {
      const detail = this.props.detail
      this.fetchRiskPointList();
      this.setState({ riskPoint: detail && detail.riskPoint ? { objectTitle: detail.riskPointName, itemId: detail.riskPoint } : undefined });
    }
  }

  handleOk = () => {
    const {
      form: { validateFields },
      onOk,
      detail,
    } = this.props;
    const { riskPoint } = this.state;
    validateFields((err, values) => {
      if (err) return;
      const { company, riskPointName, ...resValues } = values;
      onOk({
        ...resValues,
        riskPoint: riskPoint ? riskPoint.itemId : undefined,
        companyId: company ? company.value : undefined,
        type: 1,
        id: detail && detail.id ? detail.id : undefined,
      });
    })
  }

  // 获取风险点列表
  fetchRiskPointList = (action = {}) => {
    const {
      dispatch,
      form: { getFieldValue },
      user: { isCompany, currentUser },
    } = this.props;
    const company = isCompany ? { value: currentUser.companyId } : getFieldValue('company');
    dispatch({
      type: 'riskPointManage/fetchRiskList',
      payload: {
        pageNum: 1,
        pageSize: 10,
        companyId: company ? company.value : undefined,
        ...(action.payload || {}),
      },
    });
  }

  // 监听单位改变
  onCompanyChange = company => {
    const { form: { setFieldsValue } } = this.props;
    this.fetchRiskPointList({ payload: { companyId: company.value } });
    setFieldsValue({ riskPointName: undefined });
    this.setState({ riskPoint: undefined });
  }

  // 选择风险点
  onSelectRiskPoint = item => {
    const { form: { setFieldsValue }, onSelectRiskPoint } = this.props;
    this.setState({ riskPoint: item, modalVisible: false });
    setFieldsValue({ riskPointName: item.objectTitle });
    onSelectRiskPoint && onSelectRiskPoint(item.itemId);
  }

  handleViewModal = () => {
    this.setState({ modalVisible: true });
  }

  render () {
    const {
      modalLoading,
      form: { getFieldDecorator },
      onCancel,
      detail,
      isDetail = false,
      title,
      visible,
      riskPointManage: {
        riskPointData: riskPointModal,
      },
      user: { isCompany },
    } = this.props;
    const { modalVisible } = this.state;
    const id = detail ? detail.id : undefined;
    return (
      <Modal
        title={id ? (isDetail ? `查看${title}` : `编辑${title}`) : `新增${title}`}
        visible={visible}
        width={800}
        onOk={this.handleOk}
        onCancel={onCancel}
        destroyOnClose
        {...isDetail ? [{ footer: null }] : []}
      >
        <Form>
          {!isCompany && (
            <FormItem label="单位名称" {...formWrapper}>
              {isDetail ? detail.companyName : getFieldDecorator('company', {
                rules: [
                  {
                    required: true,
                    message: '单位名称不能为空',
                    transform: value => value && value.label,
                  },
                ],
                initialValue: id ? { value: detail.companyId, label: detail.companyName } : undefined,
              })(
                <CompanySelect {...itemProps} type={isDetail ? 'span' : 'select'} onChange={this.onCompanyChange} />
              )}
            </FormItem>
          )}
          <FormItem label="编号" {...formWrapper}>
            {isDetail ? detail.code : getFieldDecorator('code', {
              rules: [{ required: true, message: '请输入编号' }],
              initialValue: id ? detail.code : undefined,
              getValueFromEvent: e => e.target.value.trim(),
            })(
              <Input placeholder="请输入" {...itemProps} />
            )}
          </FormItem>
          <FormItem label="风险点" {...formWrapper}>
            {isDetail ? detail.riskPointName : getFieldDecorator('riskPointName', {
              rules: [{ required: true, message: '请选择风险点' }],
              initialValue: id ? detail.riskPointName : undefined,
            })(
              <Input placeholder="请选择" disabled {...itemProps} />
            )}
            {!isDetail && (<Button type="primary" onClick={this.handleViewModal}>选择</Button>)}
          </FormItem>
          <FormItem label="风险分析方法" {...formWrapper}>
            {isDetail ? detail.riskAnalyze : getFieldDecorator('riskAnalyze', {
              rules: [{ required: true, message: '请选择风险分析方法' }],
              initialValue: id ? detail.riskAnalyze : undefined,
            })(
              <Select allowClear placeholder="请选择" {...itemProps}>
                {analysisFunDict.map(({ value, shortLabel }) => (
                  <Select.Option key={value} value={value}>{shortLabel + '法'}</Select.Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem label="装置/设备/设施" {...formWrapper}>
            {isDetail ? detail.equip : getFieldDecorator('equip', {
              initialValue: id ? detail.equip : undefined,
              getValueFromEvent: e => e.target.value.trim(),
            })(
              <Input placeholder="请输入" {...itemProps} />
            )}
          </FormItem>
        </Form>
        <CompanyModal
          rowKey="itemId"
          title="选择风险点"
          loading={modalLoading}
          visible={modalVisible}
          modal={riskPointModal}
          fetch={this.fetchRiskPointList}
          onSelect={this.onSelectRiskPoint}
          onClose={() => {
            this.setState({ modalVisible: false });
          }}
          field={field}
          columns={columns}
        />
      </Modal>
    )
  }
};
