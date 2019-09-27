import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import { Form, Input, Button, Card, DatePicker, Select, message } from 'antd';
import FooterToolbar from '@/components/FooterToolbar';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import CompanyModal from '../../BaseInfo/Company/CompanyModal';

import styles from './MajorHazardEdit.less';

const { TextArea } = Input;
const { Option } = Select;
const FormItem = Form.Item;

// 编辑页面标题
const editTitle = '编辑重大危险源';
// 添加页面标题
const addTitle = '新增重大危险源';

@connect(({ reservoirRegion, videoMonitor, user, loading }) => ({
  reservoirRegion,
  user,
  videoMonitor,
  loading: loading.models.reservoirRegion,
}))
@Form.create()
export default class MajorHazardEdit extends PureComponent {
  state = {
    companyVisible: false,
    submitting: false,
    detailList: {}, // 详情列表
    ChemicalsVisible: false,
    chemicalList: [], // 危险化学品列表
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
      // 获取列表
      dispatch({
        type: 'reservoirRegion/fetchSourceList',
        payload: {
          pageSize: 18,
          pageNum: 1,
        },
        callback: res => {
          const { list } = res;
          const currentList = list.find(item => item.id === id) || {};
          const { unitChemiclaNumDetail } = currentList;
          this.setState({
            detailList: currentList,
            chemicalList: unitChemiclaNumDetail,
          });
        },
      });
    }
  }

  /* 去除左右两边空白 */
  handleTrim = e => e.target.value.trim();

  goBack = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push(`/base-info/major-hazard/list`));
  };

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

        const { chemicalList } = this.state;

        const {
          companyName,
          code,
          name,
          desc,
          manageType,
          memoryPlace,
          antiStatic,
          dangerTechnology,
          location,
          useDate,
          r,
          dangerLevel,
          chemiclaNature,
          industryArea,
          environmentType,
          environmentName,
          environmentNum,
          dangerDistance,
          safetyDistance,
          linkman,
          linkmanTel,
        } = values;

        const payload = {
          companyId: this.companyId,
          companyName,
          code,
          name,
          desc,
          manageType,
          memoryPlace,
          antiStatic,
          dangerTechnology,
          location,
          useDate: useDate && useDate.format('YYYY-MM-DD'),
          r,
          dangerLevel,
          // unitChemicla: chemicalList.map(item => item.id).join(','),
          unitChemiclaNum: JSON.stringify(
            chemicalList.map(({ materialId, chineName, unitChemiclaNum, unitChemiclaNumUnit }) => ({
              materialId,
              chineName,
              unitChemiclaNum,
              unitChemiclaNumUnit,
            }))
          ),
          chemiclaNature,
          industryArea,
          environmentType,
          environmentName,
          environmentNum,
          dangerDistance,
          safetyDistance,
          linkman,
          linkmanTel,
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
            type: 'reservoirRegion/fetchSourceEdit',
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
            type: 'reservoirRegion/fetchSourceAdd',
            payload,
            success,
            error,
          });
        }
      }
    });
  };

  // 显示企业弹框
  handleCompanyModal = () => {
    this.setState({ companyVisible: true });
    const payload = { pageSize: 10, pageNum: 1 };
    this.fetchCompany({ payload });
  };

  // 获取企业列表
  fetchCompany = ({ payload }) => {
    const { dispatch } = this.props;
    dispatch({ type: 'videoMonitor/fetchModelList', payload });
  };

  // 关闭企业弹框
  handleClose = () => {
    this.setState({ companyVisible: false });
  };

  // 选择企业
  handleSelect = item => {
    const {
      form: { setFieldsValue },
    } = this.props;
    const { id, name } = item;
    setFieldsValue({
      companyId: name,
    });
    this.companyId = id;
    this.handleClose();
  };

  // 渲染企业模态框
  renderModal() {
    const {
      videoMonitor: { modal },
      loading,
    } = this.props;
    const { companyVisible } = this.state;
    return (
      <CompanyModal
        loading={loading}
        visible={companyVisible}
        modal={modal}
        fetch={this.fetchCompany}
        onSelect={this.handleSelect}
        onClose={this.handleClose}
      />
    );
  }

  // 显示化学品弹框
  handleShowChemicals = () => {
    this.setState({ ChemicalsVisible: true });
    const payload = { pageSize: 10, pageNum: 1, companyId: this.companyId };
    this.fetchChemicalsList({ payload });
  };

  fetchChemicalsList = ({ payload }) => {
    const { dispatch } = this.props;
    const { detailList } = this.state;
    const { companyId } = detailList;
    dispatch({
      type: 'reservoirRegion/fetchMaterialInfoList',
      payload: { ...payload, companyId: this.companyId || companyId },
    });
  };

  handleSelectChemicals = item => {
    const {
      form: { setFieldsValue, getFieldValue },
    } = this.props;
    const chemicalList = item.map(item => {
      const { id } = item;
      return {
        ...item,
        materialId: id,
        unitChemiclaNum: getFieldValue(`unitChemiclaNum${id}`),
        unitChemiclaNumUnit: getFieldValue(`unitChemiclaNumUnit${id}`),
      };
    });
    setFieldsValue({
      unitChemicla: chemicalList
        .map(item => {
          const { chineName, unitChemiclaNum, unitChemiclaNumUnit } = item;
          const name = chineName ? chineName : '';
          const num = unitChemiclaNum ? unitChemiclaNum : '';
          const unit = unitChemiclaNumUnit ? unitChemiclaNumUnit : '';
          return name + ' ' + num + unit;
        })
        .join(','),
    });
    this.setState({ chemicalList: chemicalList });
    this.handleChemicalsClose();
  };

  // 关闭化学品弹框
  handleChemicalsClose = () => {
    this.setState({ ChemicalsVisible: false });
  };

  // 渲染危险化学品弹框
  renderTechnologyModal() {
    const {
      form: { getFieldDecorator },
      reservoirRegion: { materialData },
      loading,
    } = this.props;

    const { ChemicalsVisible } = this.state;
    const FIELD = [
      {
        id: 'casNo',
        render() {
          return <Input placeholder="请输CAS号" />;
        },
        transform(value) {
          return value.trim();
        },
      },
      {
        id: 'chineName',
        render() {
          return <Input placeholder="请输品名" />;
        },
        transform(value) {
          return value.trim();
        },
      },
    ];

    const COLUMNS = [
      {
        title: '统一编码',
        dataIndex: 'unifiedCode',
        key: 'unifiedCode',
        align: 'center',
        width: 120,
      },
      {
        title: '品名',
        dataIndex: 'chineName',
        key: 'chineName',
        align: 'center',
        width: 90,
      },
      {
        title: 'CAS号',
        dataIndex: 'casNo',
        key: 'casNo',
        align: 'center',
        width: 150,
      },
      {
        title: '危险性类别',
        dataIndex: 'riskCateg',
        key: 'riskCateg',
        align: 'center',
        width: 200,
      },
      {
        title: '危险化学品存量',
        dataIndex: 'a',
        key: 'a',
        align: 'center',
        width: 200,
        render: (val, text) => {
          return (
            <Fragment>
              {getFieldDecorator(`unitChemiclaNum${text.id}`)(
                <Input style={{ width: 80, marginRight: 10 }} placeholder="数量" />
              )}
              {getFieldDecorator(`unitChemiclaNumUnit${text.id}`)(
                <Input style={{ width: 80 }} placeholder="单位" />
              )}
            </Fragment>
          );
        },
      },
    ];

    return (
      <CompanyModal
        title="选择危险化学品"
        loading={loading}
        visible={ChemicalsVisible}
        columns={COLUMNS}
        field={FIELD}
        modal={materialData}
        fetch={this.fetchChemicalsList}
        onSelect={this.handleSelectChemicals}
        onClose={this.handleChemicalsClose}
        rowSelection={{ type: 'checkbox ' }}
        multiSelect={true}
      />
    );
  }

  renderInfo() {
    const {
      form: { getFieldDecorator },
      reservoirRegion: {
        dangerTypeList,
        productTypeList,
        dangerChemicalsList,
        memoryPlaceList,
        antiStaticList,
      },
    } = this.props;

    const { detailList, chemicalList } = this.state;
    const {
      companyName,
      code,
      name,
      desc,
      manageType,
      memoryPlace,
      antiStatic,
      dangerTechnology,
      location,
      useDate,
      r,
      dangerLevel,
      // unitChemiclaNum,
      chemiclaNature,
      industryArea,
      environmentType,
      environmentName,
      environmentNum,
      dangerDistance,
      safetyDistance,
      linkman,
      linkmanTel,
    } = detailList;

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    const itemStyles = { style: { width: '70%', marginRight: '10px' } };
    return (
      <Card className={styles.card} bordered={false}>
        <Form style={{ marginTop: 8 }}>
          <FormItem {...formItemLayout} label="单位名称">
            {getFieldDecorator('companyId', {
              initialValue: companyName,
              rules: [
                {
                  required: true,
                  message: '请选择单位',
                },
              ],
            })(
              <Input
                {...itemStyles}
                ref={input => {
                  this.CompanyIdInput = input;
                }}
                disabled
                placeholder="请选择单位"
              />
            )}
            <Button type="primary" onClick={this.handleCompanyModal}>
              {' '}
              选择单位
            </Button>
          </FormItem>
          <FormItem {...formItemLayout} label="统一编码">
            {getFieldDecorator('code', {
              initialValue: code,
              getValueFromEvent: this.handleTrim,
              rules: [
                {
                  required: true,
                  message: '请输入统一编码',
                },
              ],
            })(<Input {...itemStyles} placeholder="请输入统一编码" maxLength={15} />)}
          </FormItem>
          <FormItem {...formItemLayout} label="重大危险源名称">
            {getFieldDecorator('name', {
              initialValue: name,
              getValueFromEvent: this.handleTrim,
              rules: [
                {
                  required: true,
                  message: '请输入重大危险源名称',
                },
              ],
            })(<Input {...itemStyles} placeholder="请输入重大危险源名称" maxLength={15} />)}
          </FormItem>
          <FormItem {...formItemLayout} label="重大危险源描述">
            {getFieldDecorator('desc', {
              initialValue: desc,
              getValueFromEvent: this.handleTrim,
              rules: [
                {
                  required: true,
                  message: '请输入重大危险源描述',
                },
              ],
            })(
              <TextArea
                {...itemStyles}
                placeholder="请输入重大危险源描述"
                rows={4}
                maxLength="200"
              />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="生产经营活动类型">
            {getFieldDecorator('manageType', {
              initialValue: manageType,
              rules: [
                {
                  required: true,
                  message: '请选择生产经营活动类型',
                },
              ],
            })(
              <Select {...itemStyles} allowClear placeholder="请选择生产经营活动类型">
                {productTypeList.map(({ key, value }) => (
                  <Option key={key} value={key}>
                    {value}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="生产存储场所产权">
            {getFieldDecorator('memoryPlace', {
              initialValue: memoryPlace,
              rules: [
                {
                  required: true,
                  message: '请选择生产存储场所产权',
                },
              ],
            })(
              <Select {...itemStyles} allowClear placeholder="请选择生产存储场所产权">
                {memoryPlaceList.map(({ key, value }) => (
                  <Option key={key} value={key}>
                    {value}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="防雷防静电设施是否定期接受检测">
            {getFieldDecorator('antiStatic', {
              initialValue: antiStatic,
              rules: [
                {
                  required: true,
                  message: '请选择',
                },
              ],
            })(
              <Select {...itemStyles} allowClear placeholder="请选择">
                {antiStaticList.map(({ key, value }) => (
                  <Option key={key} value={key}>
                    {value}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="涉及危险工艺">
            {getFieldDecorator('dangerTechnology', {
              initialValue: dangerTechnology,
              getValueFromEvent: this.handleTrim,
            })(
              <TextArea
                {...itemStyles}
                placeholder="请输入涉及危险工艺"
                rows={4}
                maxLength="2000"
              />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="区域位置">
            {getFieldDecorator('location', {
              initialValue: location,
              getValueFromEvent: this.handleTrim,
              rules: [
                {
                  required: true,
                  message: '请输入区域位置',
                },
              ],
            })(<Input {...itemStyles} placeholder="请输入区域位置" maxLength={15} />)}
          </FormItem>
          <FormItem {...formItemLayout} label="投用日期">
            {getFieldDecorator('useDate', {
              initialValue: useDate ? moment(+useDate) : undefined,
              rules: [
                {
                  required: true,
                  message: '请选择投用日期',
                },
              ],
            })(
              <DatePicker
                {...itemStyles}
                showToday={false}
                format="YYYY-MM-DD"
                placeholder="请选择投用日期"
              />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="R值">
            {getFieldDecorator('r', {
              initialValue: r,
              getValueFromEvent: this.handleTrim,
              rules: [
                {
                  required: true,
                  message: '请输入R值',
                },
              ],
            })(<Input {...itemStyles} placeholder="请输入R值" maxLength={15} />)}
          </FormItem>
          <FormItem {...formItemLayout} label="重大危险源等级">
            {getFieldDecorator('dangerLevel', {
              initialValue: dangerLevel,
              rules: [
                {
                  required: true,
                  message: '请选择重大危险源等级',
                },
              ],
            })(
              <Select {...itemStyles} allowClear placeholder="请选择重大危险源等级">
                {dangerTypeList.map(({ key, value }) => (
                  <Option key={key} value={key}>
                    {value}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="单元内涉及的危险化学品">
            {getFieldDecorator('unitChemicla', {
              initialValue: chemicalList
                .map(item => item.chineName + ' ' + item.unitChemiclaNum + item.unitChemiclaNumUnit)
                .join(','),
              getValueFromEvent: this.handleTrim,
              rules: [
                {
                  required: true,
                  message: '请选择单元内涉及的危险化学品',
                },
              ],
            })(
              <TextArea
                {...itemStyles}
                placeholder="请选择单元内涉及的危险化学品"
                rows={4}
                disabled
                maxLength="2000"
              />
            )}
            <Button type="primary" onClick={this.handleShowChemicals}>
              {' '}
              选择
            </Button>
          </FormItem>
          <FormItem {...formItemLayout} label="危险化学品性质">
            {getFieldDecorator('chemiclaNature', {
              initialValue: chemiclaNature,
              rules: [
                {
                  required: true,
                  message: '请选择危险化学品性质',
                },
              ],
            })(
              <Select {...itemStyles} allowClear placeholder="请选择危险化学品性质">
                {dangerChemicalsList.map(({ key, value }) => (
                  <Option key={key} value={key}>
                    {value}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="所处装置或区域">
            {getFieldDecorator('industryArea', {
              initialValue: industryArea,
              getValueFromEvent: this.handleTrim,
            })(
              <TextArea
                {...itemStyles}
                placeholder="请输入所处装置或区域"
                rows={4}
                maxLength="2000"
              />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="周边环境类型">
            {getFieldDecorator('environmentType', {
              initialValue: environmentType,
              getValueFromEvent: this.handleTrim,
            })(
              <TextArea
                {...itemStyles}
                placeholder="请输入周边环境类型"
                rows={4}
                maxLength="2000"
              />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="周边环境名称">
            {getFieldDecorator('environmentName', {
              initialValue: environmentName,
              getValueFromEvent: this.handleTrim,
            })(
              <TextArea
                {...itemStyles}
                placeholder="请输入周边环境名称"
                rows={4}
                maxLength="2000"
              />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="周边环境人数">
            {getFieldDecorator('environmentNum', {
              initialValue: environmentNum,
              getValueFromEvent: this.handleTrim,
            })(<Input {...itemStyles} placeholder="请输入周边环境人数" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="与危险源最近距离">
            {getFieldDecorator('dangerDistance', {
              initialValue: dangerDistance,
              getValueFromEvent: this.handleTrim,
            })(<Input {...itemStyles} placeholder="请输入与危险源最近距离" maxLength={10} />)}
          </FormItem>
          <FormItem {...formItemLayout} label="重大危险源周边安全间距">
            {getFieldDecorator('safetyDistance', {
              initialValue: safetyDistance,
              getValueFromEvent: this.handleTrim,
            })(<Input {...itemStyles} placeholder="请输入重大危险源周边安全间距" maxLength={10} />)}
          </FormItem>
          <FormItem {...formItemLayout} label="周边环境联系人">
            {getFieldDecorator('linkman', {
              initialValue: linkman,
              getValueFromEvent: this.handleTrim,
            })(<Input {...itemStyles} placeholder="请输入周边环境联系人" maxLength={10} />)}
          </FormItem>
          <FormItem {...formItemLayout} label="周边环境联系人电话">
            {getFieldDecorator('linkmanTel', {
              initialValue: linkmanTel,
              getValueFromEvent: this.handleTrim,
            })(<Input {...itemStyles} placeholder="请输入周边环境联系人电话" maxLength={15} />)}
          </FormItem>
        </Form>
      </Card>
    );
  }

  /* 渲染底部工具栏 */
  renderFooterToolbar() {
    const { submitting } = this.state;
    return (
      <FooterToolbar>
        <Button type="primary" size="large" loading={submitting} onClick={this.handleClickValidate}>
          提交
        </Button>
        <Button type="primary" size="large" onClick={this.goBack}>
          返回
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
        title: '一企一档',
        name: '一企一档',
      },
      {
        title: '重大危险源',
        name: '重大危险源',
        href: '/base-info/major-hazard/list',
      },
      {
        title,
        name: title,
      },
    ];

    return (
      <PageHeaderLayout title={title} breadcrumbList={breadcrumbList}>
        {this.renderInfo()}
        {this.renderFooterToolbar()}
        {this.renderModal()}
        {this.renderTechnologyModal()}
      </PageHeaderLayout>
    );
  }
}
