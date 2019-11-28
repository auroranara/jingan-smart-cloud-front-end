import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Form, Input, Button, Card, Icon, Popover, Select, message } from 'antd';
import FooterToolbar from '@/components/FooterToolbar';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import CompanyModal from '../../BaseInfo/Company/CompanyModal';

import styles from './ReservoirRegion.less';

const { Option } = Select;
const FormItem = Form.Item;

// const selectTypeList = [{ key: '1', value: '是' }, { key: '2', value: '否' }];

// 编辑页面标题
const editTitle = '编辑库区';
// 添加页面标题
const addTitle = '新增库区';

// 表单标签
const fieldLabels = {};

@connect(({ loading, reservoirRegion, user, videoMonitor }) => ({
  reservoirRegion,
  videoMonitor,
  user,
  loading: loading.models.reservoirRegion,
}))
@Form.create()
export default class ReservoirRegionEdit extends PureComponent {
  state = {
    companyVisible: false,
    hasDangerSourse: '', // 选择更换
    submitting: false,
    detailList: {}, // 详情列表
    dangerVisible: false,
    dangerSourceUnitId: [],
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
        type: 'reservoirRegion/fetchAreaList',
        payload: {
          pageSize: 18,
          pageNum: 1,
        },
        callback: res => {
          const { list } = res;
          const currentList = list.find(item => item.id === id) || {};
          // const { dangerSource, dangerSourceMessage } = currentList;
          this.setState({
            detailList: currentList,
            // hasDangerSourse: dangerSource,
            // dangerSourceUnitId: dangerSourceMessage,
          });
        },
      });
    }
  }

  /* 去除左右两边空白 */
  handleTrim = e => e.target.value.trim();

  goBack = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push(`/base-info/reservoir-region-management/list`));
  };

  handleClickValidate = () => {
    const {
      form: { validateFieldsAndScroll },
      match: {
        params: { id },
      },
      user: {
        currentUser: { companyId },
      },
      dispatch,
    } = this.props;

    validateFieldsAndScroll((error, values) => {
      if (!error) {
        this.setState({
          submitting: true,
        });

        // const { dangerSourceUnitId } = this.state;

        const {
          number,
          name,
          position,
          environment,
          safetyDistance,
          deviceDistance,
          area,
          // count,
          spaceBetween,
          // dangerSource,
          // dangerSourceUnit,
          // unitCode,
        } = values;

        const payload = {
          companyId: this.companyId || companyId,
          number,
          name,
          position,
          environment,
          safetyDistance,
          deviceDistance,
          area,
          // count,
          spaceBetween,
          // dangerSource,
          // dangerSourceUnit:
          //   dangerSourceUnitId && dangerSourceUnitId.length > 0
          //     ? dangerSourceUnitId.map(item => item.id).join(',')
          //     : undefined,
          // unitCode: +dangerSource === 1 ? unitCode : '',
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
            type: 'reservoirRegion/fetchAreaEdit',
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
            type: 'reservoirRegion/fetchAreaAdd',
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

  // 显示重大危险源弹框
  // handleShowDangerSource = () => {
  //   const { detailList } = this.state;
  //   const { companyId } = detailList;
  //   this.setState({ dangerVisible: true });
  //   if (this.companyId || companyId) {
  //     const payload = { pageSize: 10, pageNum: 1, companyId: this.companyId || companyId };
  //     this.fetchDangerSourseList({ payload });
  //   }
  // };

  // 获取危险源列表
  // fetchDangerSourseList = ({ payload }) => {
  //   const { dispatch } = this.props;
  //   const { detailList } = this.state;
  //   const { companyId } = detailList;
  //   dispatch({
  //     type: 'reservoirRegion/fetchSourceList',
  //     payload: { ...payload, companyId: this.companyId || companyId },
  //   });
  // };

  // handleSelectDSList = item => {
  //   const {
  //     form: { setFieldsValue },
  //   } = this.props;
  //   setFieldsValue({
  //     dangerSourceUnit: item.map(item => item.name).join(','),
  //     unitCode: item.map(item => item.code).join(','),
  //   });
  //   this.setState({ dangerSourceUnitId: item });
  //   this.handleDSListClose();
  // };

  // 选择变化
  // onChangeDanger = i => {
  //   const {
  //     form: { setFieldsValue },
  //   } = this.props;
  //   this.setState({ hasDangerSourse: +i === 1 ? 1 : 2, dangerSourceUnitId: [] });
  //   setFieldsValue({
  //     unitCode: undefined,
  //   });
  // };

  // handleDSListClose = () => {
  //   this.setState({ dangerVisible: false });
  // };

  // 渲染危险源模态框
  // renderDangerModal() {
  //   const {
  //     reservoirRegion: { sourceData },
  //     loading,
  //   } = this.props;

  //   const { dangerVisible } = this.state;
  //   const spanStyle = { md: 8, sm: 12, xs: 24 };
  //   const FIELD = [
  //     {
  //       id: 'code',
  //       span: spanStyle,
  //       render() {
  //         return <Input placeholder="请输统一编码" />;
  //       },
  //       transform(value) {
  //         return value.trim();
  //       },
  //     },
  //     {
  //       id: 'name',
  //       render() {
  //         return <Input placeholder="请输危险源名称" />;
  //       },
  //       transform(value) {
  //         return value.trim();
  //       },
  //     },
  //   ];

  //   const COLUMNS = [
  //     {
  //       title: '统一编码',
  //       dataIndex: 'code',
  //       key: 'code',
  //       align: 'center',
  //       width: 120,
  //     },
  //     {
  //       title: '危险源名称',
  //       dataIndex: 'name',
  //       key: 'name',
  //       align: 'center',
  //       width: 90,
  //     },
  //     {
  //       title: '重大危险源等级',
  //       dataIndex: 'dangerLevel',
  //       key: 'dangerLevel',
  //       align: 'center',
  //       width: 150,
  //     },
  //     {
  //       title: '单元内涉及的危险化学品',
  //       dataIndex: 'unitChemiclaNumDetail',
  //       key: 'unitChemiclaNumDetail',
  //       align: 'center',
  //       width: 200,
  //       render: val => {
  //         return val
  //           .map(item => item.chineName + ' ' + item.unitChemiclaNum + item.unitChemiclaNumUnit)
  //           .join(',')
  //           .replace(/null+/g, '');
  //       },
  //     },
  //   ];

  //   return (
  //     <CompanyModal
  //       title="选择重大危险源"
  //       loading={loading}
  //       visible={dangerVisible}
  //       columns={COLUMNS}
  //       field={FIELD}
  //       modal={sourceData}
  //       fetch={this.fetchDangerSourseList}
  //       onSelect={this.handleSelectDSList}
  //       onClose={this.handleDSListClose}
  //       rowSelection={{ type: 'checkbox ' }}
  //       multiSelect={true}
  //     />
  //   );
  // }

  renderInfo() {
    const {
      form: { getFieldDecorator },
      reservoirRegion: { envirTypeList },
      user: {
        currentUser: { unitType },
      },
    } = this.props;

    const { detailList } = this.state;

    const {
      companyName,
      number,
      name,
      position,
      environment,
      safetyDistance,
      deviceDistance,
      area,
      spaceBetween,
      // dangerSourceUnit,
      // unitCode,
    } = detailList;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    const itemStyles = { style: { width: '70%', marginRight: '10px' } };

    return (
      <Card className={styles.card} bordered={false}>
        <Form style={{ marginTop: 8 }}>
          {unitType !== 4 && (
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
                选择单位
              </Button>
            </FormItem>
          )}

          <FormItem {...formItemLayout} label="库区编号">
            {getFieldDecorator('number', {
              initialValue: number,
              getValueFromEvent: this.handleTrim,
              rules: [
                {
                  required: true,
                  message: '请输入库区编号',
                },
              ],
            })(<Input {...itemStyles} placeholder="请输入库区编号" maxLength={15} />)}
          </FormItem>
          <FormItem {...formItemLayout} label="库区名称">
            {getFieldDecorator('name', {
              initialValue: name,
              getValueFromEvent: this.handleTrim,
              rules: [
                {
                  required: true,
                  message: '请输入库区名称',
                },
              ],
            })(<Input {...itemStyles} placeholder="请输入库区名称" maxLength={15} />)}
          </FormItem>
          <FormItem {...formItemLayout} label="区域位置">
            {getFieldDecorator('position', {
              initialValue: position,
              getValueFromEvent: this.handleTrim,
              rules: [
                {
                  required: true,
                  message: '请输入区域位置',
                },
              ],
            })(<Input {...itemStyles} placeholder="请输入区域位置" maxLength={15} />)}
          </FormItem>
          <FormItem {...formItemLayout} label="所处环境功能区">
            {getFieldDecorator('environment', {
              initialValue: environment,
              rules: [
                {
                  required: true,
                  message: '请选择所处环境功能区',
                },
              ],
            })(
              <Select {...itemStyles} allowClear placeholder="请选择所处环境功能区">
                {envirTypeList.map(({ key, value }) => (
                  <Option key={key} value={key}>
                    {value}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="周边安全防护间距（m）">
            {getFieldDecorator('safetyDistance', {
              initialValue: safetyDistance,
              getValueFromEvent: this.handleTrim,
              rules: [
                {
                  required: true,
                  message: '请输入周边安全防护间距（m）',
                },
              ],
            })(<Input {...itemStyles} placeholder="请输入周边安全防护间距（m）" maxLength={10} />)}
          </FormItem>
          <FormItem {...formItemLayout} label="与周边装置的距离">
            {getFieldDecorator('deviceDistance', {
              initialValue: deviceDistance,
              getValueFromEvent: this.handleTrim,
              rules: [
                {
                  required: true,
                  message: '请输入与周边装置的距离',
                },
              ],
            })(<Input {...itemStyles} placeholder="请输入与周边装置的距离" maxLength={10} />)}
          </FormItem>
          <FormItem {...formItemLayout} label="库区面积（㎡）">
            {getFieldDecorator('area', {
              initialValue: area,
              getValueFromEvent: this.handleTrim,
              rules: [
                {
                  required: true,
                  message: '请输入库区面积（㎡）',
                },
              ],
            })(<Input {...itemStyles} placeholder="请输入库区面积（㎡）" maxLength={10} />)}
          </FormItem>
          {/* <FormItem {...formItemLayout} label="库房个数">
            {getFieldDecorator('count', {
              initialValue: count,
              rules: [
                {
                  required: true,
                  message: '请输入库房个数',
                },
              ],
            })(<Input {...itemStyles} placeholder="请输入库房个数" maxLength={10} />)}
          </FormItem> */}
          <FormItem {...formItemLayout} label="相邻库房最小间距（m）">
            {getFieldDecorator('spaceBetween', {
              initialValue: spaceBetween,
              getValueFromEvent: this.handleTrim,
              rules: [
                {
                  required: true,
                  message: '请输入相邻库房最小间距（m）',
                },
              ],
            })(<Input {...itemStyles} placeholder="请输入相邻库房最小间距（m）" maxLength={10} />)}
          </FormItem>
          {/* <FormItem {...formItemLayout} label="是否构成重大危险源">
            {getFieldDecorator('dangerSource', {
              initialValue: dangerSource,
              rules: [
                {
                  required: true,
                  message: '请选择是否构成重大危险源',
                },
              ],
            })(
              <Select
                {...itemStyles}
                allowClear
                placeholder="请选择是否构成重大危险源"
                onChange={this.onChangeDanger}
              >
                {selectTypeList.map(({ key, value }) => (
                  <Option key={key} value={key}>
                    {value}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem> */}
          {/* {+hasDangerSourse === 1 && (
            <FormItem {...formItemLayout} label="所属危险化学品重大危险源单元">
              {getFieldDecorator('dangerSourceUnit', {
                initialValue:
                  dangerSourceUnitId && dangerSourceUnitId.length > 0
                    ? dangerSourceUnitId.map(item => item.name).join(',')
                    : undefined,
                getValueFromEvent: this.handleTrim,
              })(
                <Input
                  {...itemStyles}
                  placeholder="请选择所属危险化学品重大危险源单元"
                  maxLength={15}
                  disabled
                />
              )}
              <Button type="primary" onClick={this.handleShowDangerSource}>
                {' '}
                选择
              </Button>
            </FormItem> */}
          {/* )}
          <FormItem {...formItemLayout} label="所属重大危险源单元编号">
            {getFieldDecorator('unitCode', {
              initialValue: unitCode,
              getValueFromEvent: this.handleTrim,
            })(<Input {...itemStyles} disabled />)}
          </FormItem> */}
        </Form>
      </Card>
    );
  }

  // 渲染错误信息
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

  // 渲染底部工具栏
  renderFooterToolbar() {
    const { submitting } = this.state;
    return (
      <FooterToolbar>
        {this.renderErrorInfo()}
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
        title: '库区管理',
        name: '库区管理',
        href: '/base-info/reservoir-region-management/list',
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
        {/* {this.renderDangerModal()} */}
      </PageHeaderLayout>
    );
  }
}
