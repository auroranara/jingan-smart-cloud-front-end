import { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Button, Form, Input, Radio, Select, message } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import router from 'umi/router';
import { BREADCRUMBLIST, LIST_URL } from './utils';
import CompanySelect from '@/jingan-components/CompanySelect';
import CompanyModal from '../../BaseInfo/Company/CompanyModal';

const FormItem = Form.Item;
const { Option } = Select;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const itemStyles = { style: { width: 'calc(70%)', marginRight: '10px' } };

const autoList = [
  { key: '1', value: '反馈控制' },
  { key: '2', value: '前馈控制' },
  { key: '3', value: '顺序控制' },
  { key: '4', value: '比值控制系统' },
  { key: '5', value: '串级控制系统' },
  { key: '6', value: '超驰控制系统' },
  { key: '7', value: '程序控制系统' },
  { key: '8', value: '批量控制系统' },
];

@Form.create()
@connect(({ safeFacilities, majorHazardInfo, user, loading }) => ({
  safeFacilities,
  majorHazardInfo,
  user,
  loading: loading.models.safeFacilities,
  technologyLoading: loading.effects['majorHazardInfo/fetchHighRiskProcessList'],
}))
export default class Edit extends PureComponent {
  state = {
    technologyVisible: false, // 危险化工工艺弹框是否可见
    chemiclaVisible: false, // 危化品及数量弹框是否可见
    detailList: {},
    facNameList: [],
  };

  // 挂载后
  componentDidMount() {
    const {
      dispatch,
      match: {
        params: { id },
      },
      safeFacilities: { facNameList = [] },
    } = this.props;

    if (id) {
      dispatch({
        type: 'safeFacilities/fetchSafeFacList',
        payload: {
          pageSize: 48,
          pageNum: 1,
        },
        callback: res => {
          const { list } = res;
          const currentList = list.find(item => item.id === id) || {};
          const { photoList } = currentList;
          this.setState({
            detailList: currentList,
            photoUrl: photoList.map(({ dbUrl, webUrl }, index) => ({
              uid: index,
              status: 'done',
              name: `附件${index + 1}`,
              url: webUrl,
              dbUrl,
            })),
          });
        },
      });
      this.setState({ facNameList: facNameList });
    } else {
      dispatch({
        type: 'safeFacilities/clearSafeFacDetail',
      });
    }
  }

  goBack = () => {
    router.push('/facility-management/safety-facilities/list');
  };

  /**
   * 去除左右两边空白
   */
  handleTrim = e => e.target.value.trim();

  /**
   * 打开危险化工工艺弹框
   */
  handleTechnologyModal = () => {
    this.setState({ technologyVisible: true });
    const payload = { pageSize: 10, pageNum: 1 };
    this.fetchTechnologyList({ payload });
  };

  fetchTechnologyList = ({ payload }) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'majorHazardInfo/fetchHighRiskProcessList',
      payload: { ...payload },
    });
  };

  handleTechnologySelect = item => {};

  handleSubmit = () => {
    const {
      match: {
        params: { id },
      },
      dispatch,
      form: { validateFieldsAndScroll },
      user: {
        currentUser: { companyId },
      },
    } = this.props;
    const { photoUrl } = this.state;
    validateFieldsAndScroll((errors, values) => {
      if (!errors) {
        const {
          category,
          safeFacilitiesName,
          specifications,
          processFacilitiesInvolved,
          equipNumber,
          equipStatus,
          productFactory,
          leaveFactoryDate,
          useYear,
          notes,
        } = values;
        const payload = {
          id,
          companyId: this.companyId || companyId,
          category: category.join(','),
          safeFacilitiesName,
          specifications,
          processFacilitiesInvolved,
          equipNumber,
          equipStatus,
          productFactory,
          leaveFactoryDate: leaveFactoryDate ? leaveFactoryDate.format('YYYY-MM-DD') : undefined,
          useYear,
          notes,
          photo:
            photoUrl.length > 0
              ? JSON.stringify(
                  photoUrl.map(({ name, url, dbUrl }) => ({ name, webUrl: url, dbUrl }))
                )
              : undefined,
        };

        const success = () => {
          const msg = id ? '编辑成功' : '新增成功';
          message.success(msg, 1, this.goBack());
        };

        const error = () => {
          message.error(id ? '编辑失败' : '新增失败');
        };

        if (id) {
          dispatch({
            type: 'safeFacilities/fetchSafeFacEdit',
            payload,
            success,
            error,
          });
        } else {
          dispatch({
            type: 'safeFacilities/fetchSafeFacAdd',
            payload,
            success,
            error,
          });
        }
      }
    });
  };

  /**
   * 渲染表单
   */
  renderForm = () => {
    const {
      form: { getFieldDecorator },
      user: {
        currentUser: { unitType },
      },
    } = this.props;
    const { detailList } = this.state;

    const {
      companyName,
      companyId,
      code,
      name,
      model,
      location,
      keyDevice,
      dangerTechnology,
      unitChemicla,
      environment,
      deviceFunction,
      deviceStatus,
      deviceProduct,
      pressure,
      deviceEnergyConsumption,
      deviceTechnology,
      automaticControl,
    } = detailList;

    return (
      <Card>
        <Form>
          {unitType !== 4 && (
            <FormItem label="单位名称" {...formItemLayout}>
              {getFieldDecorator('companyId', {
                initialValue: companyId ? { key: companyId, label: companyName } : undefined,
                rules: [
                  {
                    required: true,
                    message: '请选择',
                    transform: value => value && value.label,
                  },
                ],
              })(
                <CompanySelect
                  {...itemStyles}
                  placeholder="请选择"
                  onChange={this.onChangeComapny}
                />
              )}
            </FormItem>
          )}

          <FormItem label="装置编号" {...formItemLayout}>
            {getFieldDecorator('code', {
              initialValue: code,
              getValueFromEvent: this.handleTrim,
              rules: [{ required: true, message: '请输入' }],
            })(<Input placeholder="请输入" {...itemStyles} />)}
          </FormItem>

          <FormItem label="装置名称" {...formItemLayout}>
            {getFieldDecorator('name', {
              initialValue: name,
              getValueFromEvent: this.handleTrim,
              rules: [{ required: true, message: '请输入' }],
            })(<Input placeholder="请输入" {...itemStyles} />)}
          </FormItem>

          <FormItem label="设备型号" {...formItemLayout}>
            {getFieldDecorator('model', {
              initialValue: model,
              getValueFromEvent: this.handleTrim,
              rules: [{ required: true, message: '请输入' }],
            })(<Input placeholder="请输入" {...itemStyles} />)}
          </FormItem>

          <FormItem label="装置位置" {...formItemLayout}>
            {getFieldDecorator('location', {
              initialValue: location,
              rules: [{ required: true, message: '请输入' }],
              getValueFromEvent: this.handleTrim,
            })(<Input placeholder="请输入" {...itemStyles} />)}
          </FormItem>

          <FormItem label="是否关键装置" {...formItemLayout}>
            {getFieldDecorator('keyDevice', {
              initialValue: keyDevice ? +keyDevice : undefined,
              rules: [{ required: true, message: '请选择' }],
            })(
              <Radio.Group {...itemStyles}>
                <Radio value={1}>是</Radio>
                <Radio value={2}>否</Radio>
              </Radio.Group>
            )}
            <div style={{ color: '#999999' }}>
              说明：在易燃、易爆、有毒、有害、易腐蚀、高温、高压、真空、深冷、等条件下进行工艺操作的生产装置。
            </div>
          </FormItem>

          <FormItem label="所属危险化工工艺" {...formItemLayout}>
            {getFieldDecorator('dangerTechnology', {
              initialValue: dangerTechnology,
              rules: [{ required: true, message: '请选择' }],
            })(<Input placeholder="请选择" disabled {...itemStyles} />)}
            <Button type="primary" onClick={this.handleTechnologyModal}>
              选择
            </Button>
          </FormItem>

          <FormItem label="主要危化品及数量" {...formItemLayout}>
            {getFieldDecorator('unitChemicla', {
              initialValue: unitChemicla,
              rules: [{ required: true, message: '请选择' }],
            })(<Input placeholder="请选择" disabled {...itemStyles} />)}
            <Button type="primary" onClick={this.handleChemiclaModal}>
              选择
            </Button>
          </FormItem>

          <FormItem label="周围环境" {...formItemLayout}>
            {getFieldDecorator('environment', {
              initialValue: environment,
              rules: [{ required: true, message: '请输入' }],
              getValueFromEvent: this.handleTrim,
            })(<Input placeholder="请输入" {...itemStyles} />)}
          </FormItem>

          <FormItem label="装置功能" {...formItemLayout}>
            {getFieldDecorator('deviceFunction', {
              initialValue: deviceFunction,
              rules: [{ required: true, message: '请输入' }],
              getValueFromEvent: this.handleTrim,
            })(<Input placeholder="请输入" {...itemStyles} />)}
          </FormItem>

          <FormItem label="装置状态" {...formItemLayout}>
            {getFieldDecorator('deviceStatus', {
              initialValue: deviceStatus ? +deviceStatus : undefined,
              rules: [{ required: true, message: '请选择' }],
            })(
              <Radio.Group>
                <Radio value={1}>正常</Radio>
                <Radio value={2}>维检</Radio>
                <Radio value={3}>报废</Radio>
              </Radio.Group>
            )}
          </FormItem>

          <FormItem label="装置生产能力" {...formItemLayout}>
            {getFieldDecorator('deviceProduct', {
              initialValue: deviceProduct,
              rules: [{ required: true, message: '请输入' }],
            })(<Input placeholder="请输入" {...itemStyles} />)}
          </FormItem>

          <FormItem label="装置能耗" {...formItemLayout}>
            {getFieldDecorator('deviceEnergyConsumption', {
              initialValue: deviceEnergyConsumption,
              rules: [{ required: true, message: '请输入' }],
            })(<Input placeholder="请输入" {...itemStyles} />)}
          </FormItem>

          <FormItem label="装置技术条件" {...formItemLayout}>
            {getFieldDecorator('deviceTechnology', {
              initialValue: deviceTechnology,
              rules: [{ required: true, message: '请输入' }],
            })(<Input placeholder="请输入" {...itemStyles} />)}
          </FormItem>

          <FormItem label="设计压力" {...formItemLayout}>
            {getFieldDecorator('pressure', {
              initialValue: pressure,
              rules: [{ required: true, message: '请输入' }],
            })(<Input placeholder="请输入" {...itemStyles} />)}
          </FormItem>

          <FormItem label="自动化控制方式" {...formItemLayout}>
            {getFieldDecorator('automaticControl', {
              initialValue: automaticControl,
            })(
              <Select {...itemStyles} allowClear placeholder="请选择">
                {autoList.map(({ key, value }) => (
                  <Option key={key} value={key}>
                    {value}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
        </Form>
      </Card>
    );
  };

  render() {
    const {
      match: {
        params: { id },
      },
      // majorHazardInfo: {
      //   // 高危工艺流程
      //   highRiskProces,
      // },
    } = this.props;

    const { technologyLoading, technologyVisible } = this.state;
    const title = id ? '编辑' : '新增';
    const breadcrumbList = Array.from(BREADCRUMBLIST);
    breadcrumbList.push({ title, name: title });

    const technologyFields = [
      {
        id: 'targetName',
        render() {
          return <Input placeholder="请输入高危工艺名称" />;
        },
      },
      {
        id: 'unifiedCode',
        render() {
          return <Input placeholder="请输入统一编码" />;
        },
      },
      {
        id: 'reactionType',
        render() {
          return <Input placeholder="请输入反应类型" />;
        },
      },
    ];

    const technologyColumns = [
      {
        title: '高危工艺名称',
        dataIndex: 'processName',
        key: 'processName',
        align: 'center',
      },
      {
        title: '统一编码',
        dataIndex: 'unifiedCode',
        key: 'unifiedCode',
        align: 'center',
      },
      {
        title: '反应类型',
        dataIndex: 'reactionType',
        key: 'reactionType',
        align: 'center',
      },
    ];

    return (
      <PageHeaderLayout
        title={BREADCRUMBLIST[BREADCRUMBLIST.length - 1].title}
        breadcrumbList={breadcrumbList}
      >
        {this.renderForm()}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <span>
            <Button
              style={{ marginLeft: '50%', transform: 'translateX(-50%)', marginTop: '24px' }}
              type="primary"
              size="large"
              onClick={this.handleSubmit}
            >
              提交
            </Button>
          </span>

          <span style={{ marginLeft: 10 }}>
            <Button
              style={{ marginLeft: '50%', transform: 'translateX(-50%)', marginTop: '24px' }}
              size="large"
              href={`#LIST_URL`}
            >
              返回
            </Button>
          </span>
        </div>

        {/** 选择危险化工工艺 */}
        <CompanyModal
          title="选择单位"
          loading={technologyLoading}
          visible={technologyVisible}
          modal={{
            highRiskProces: { list: [], pagination: { pageNum: 1, pageSize: 1, total: 0 } },
          }}
          columns={technologyColumns}
          field={technologyFields}
          fetch={this.fetchTechnologyList}
          onSelect={this.handleTechnologySelect}
          onClose={() => {
            this.setState({ technologyVisible: false });
          }}
        />
      </PageHeaderLayout>
    );
  }
}
