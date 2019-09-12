import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Form, Input, Button, Card, Icon, Popover, Select } from 'antd';
import FooterToolbar from '@/components/FooterToolbar';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';

import styles from './Edit.less';

const { Option } = Select;
const FormItem = Form.Item;

// 编辑页面标题
const editTitle = '编辑储罐区';
// 添加页面标题
const addTitle = '新增储罐区';

const envirTypeList = [
  { key: '1', value: '一类区' },
  { key: '2', value: '二类区' },
  { key: '3', value: '三类区' },
];

// 表单标签
const fieldLabels = {};

@connect(({ loading }) => ({}))
@Form.create()
export default class Edit extends PureComponent {
  state = {};

  // 挂载后
  componentDidMount() {}

  /* 去除左右两边空白 */
  handleTrim = e => e.target.value.trim();

  goBack = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push(`/base-info/storage-area-management/list`));
  };

  handleClickValidate = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push(`/base-info/storage-area-management/list`));
  };

  renderInfo() {
    const {
      form: { getFieldDecorator },
    } = this.props;

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
              rules: [
                {
                  required: true,
                  message: '请输入单位',
                },
              ],
            })(
              <Input
                {...itemStyles}
                ref={input => {
                  this.CompanyIdInput = input;
                }}
                placeholder="请输入单位"
              />
            )}
            <Button type="primary"> 选择单位</Button>
          </FormItem>
          <FormItem {...formItemLayout} label="统一编码">
            {getFieldDecorator('code', {
              getValueFromEvent: this.handleTrim,
              rules: [
                {
                  required: true,
                  message: '请输入统一编码',
                },
              ],
            })(<Input {...itemStyles} placeholder="请输入统一编码" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="储罐区名称">
            {getFieldDecorator('dangerName', {
              getValueFromEvent: this.handleTrim,
              rules: [
                {
                  required: true,
                  message: '请输入储罐区名称',
                },
              ],
            })(<Input {...itemStyles} placeholder="请输入储罐区名称" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="在厂区的位置">
            {getFieldDecorator('hazardDes', {
              getValueFromEvent: this.handleTrim,
              rules: [
                {
                  required: true,
                  message: '请输入在厂区的位置',
                },
              ],
            })(<Input {...itemStyles} placeholder="请输入在厂区的位置" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="所处环境功能区">
            {getFieldDecorator('productType', {
              rules: [
                {
                  required: true,
                  message: '请选择所处环境功能区',
                },
              ],
            })(
              <Select {...itemStyles} allowClear placeholder="请选择所处环境功能区">
                {envirTypeList.map(({ key, value }) => (
                  <Option key={key} value={value}>
                    {value}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="周边安全防护间距（m）">
            {getFieldDecorator('productArea', {
              getValueFromEvent: this.handleTrim,
              rules: [
                {
                  required: true,
                  message: '请输入周边安全防护间距（m）',
                },
              ],
            })(<Input {...itemStyles} placeholder="请输入周边安全防护间距（m）" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="储罐区面积（㎡）">
            {getFieldDecorator('involvedCraft', {
              getValueFromEvent: this.handleTrim,
            })(<Input {...itemStyles} placeholder="请输入储罐区面积（㎡）" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="有无围堰">
            {getFieldDecorator('hasAccept', {
              rules: [
                {
                  required: true,
                  message: '请选择有无围堰',
                },
              ],
            })(
              <Select {...itemStyles} allowClear placeholder="请选择有无围堰">
                <Option value="1">无</Option>
                <Option value="2">有</Option>
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="围堰所围面积">
            {getFieldDecorator('area', {
              getValueFromEvent: this.handleTrim,
              rules: [
                {
                  required: true,
                  message: '请输入围堰所围面积',
                },
              ],
            })(<Input {...itemStyles} placeholder="请输入围堰所围面积" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="储罐个数">
            {getFieldDecorator('startDate', {
              getValueFromEvent: this.handleTrim,
              rules: [
                {
                  required: true,
                  message: '请输入储罐个数',
                },
              ],
            })(<Input {...itemStyles} placeholder="请输入储罐个数" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="储存物质">
            {getFieldDecorator('r', {
              getValueFromEvent: this.handleTrim,
              rules: [
                {
                  required: true,
                  message: '请输入储存物质',
                },
              ],
            })(<Input {...itemStyles} placeholder="请输入储存物质" />)}
            <Button type="primary"> 选择</Button>
          </FormItem>
          <FormItem {...formItemLayout} label="储罐区总容积（m³）">
            {getFieldDecorator('acceptDanger', {
              getValueFromEvent: this.handleTrim,
              rules: [
                {
                  required: true,
                  message: '请输入储罐区总容积（m³）',
                },
              ],
            })(<Input {...itemStyles} placeholder="请输入储罐区总容积（m³）" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="常规存储量">
            {getFieldDecorator('memorySpace', {
              getValueFromEvent: this.handleTrim,
              rules: [
                {
                  required: true,
                  message: '请输入常规存储量',
                },
              ],
            })(<Input {...itemStyles} placeholder="请输入常规存储量" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="两罐间最小间距（m">
            {getFieldDecorator('min', {
              getValueFromEvent: this.handleTrim,
              rules: [
                {
                  required: true,
                  message: '请输入两罐间最小间距（m',
                },
              ],
            })(<Input {...itemStyles} placeholder="请输入两罐间最小间距（m" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="有无消防通道">
            {getFieldDecorator('level', {
              rules: [
                {
                  required: true,
                  message: '请选择有无消防通道',
                },
              ],
            })(
              <Select {...itemStyles} allowClear placeholder="请选择有无消防通道">
                <Option value="1">有</Option>
                <Option value="2">无</Option>
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="装卸方式">
            {getFieldDecorator('typeA', {
              getValueFromEvent: this.handleTrim,
              rules: [
                {
                  required: true,
                  message: '请输入装卸方式',
                },
              ],
            })(<Input {...itemStyles} placeholder="请输入装卸方式" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="装卸危险化学品种类">
            {getFieldDecorator('typeA', {
              getValueFromEvent: this.handleTrim,
              rules: [
                {
                  required: true,
                  message: '请输入危险化学品性质',
                },
              ],
            })(<Input {...itemStyles} placeholder="请输入装卸危险化学品种类" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="是否构成重大危险源">
            {getFieldDecorator('dangerChemicals', {
              rules: [
                {
                  required: true,
                  message: '请选择是否构成重大危险源',
                },
              ],
            })(
              <Select {...itemStyles} allowClear placeholder="请选择是否构成重大危险源">
                <Option value="1">是</Option>
                <Option value="2">否</Option>
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="所属危险化学品重大危险源单元">
            {getFieldDecorator('envirType', {
              getValueFromEvent: this.handleTrim,
            })(<Input {...itemStyles} placeholder="请输入所属危险化学品重大危险源单元" />)}
            <Button type="primary"> 选择</Button>
          </FormItem>
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
        <Button type="primary" size="large" onClick={this.handleClickValidate}>
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
        title: '储罐区管理',
        name: '储罐区管理',
        href: '/base-info/storage-area-management/list',
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
      </PageHeaderLayout>
    );
  }
}
