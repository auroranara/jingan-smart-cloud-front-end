import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Form, Input, Button, Card, DatePicker, Select } from 'antd';
import FooterToolbar from '@/components/FooterToolbar';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';

import styles from './MajorHazardEdit.less';

const { TextArea } = Input;
const { Option } = Select;
const FormItem = Form.Item;

// 编辑页面标题
const editTitle = '编辑重大危险源';
// 添加页面标题
const addTitle = '新增重大危险源';

@connect(({ loading }) => ({}))
@Form.create()
export default class MajorHazardEdit extends PureComponent {
  state = {};

  // 挂载后
  componentDidMount() {}

  /* 去除左右两边空白 */
  handleTrim = e => e.target.value.trim();

  goBack = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push(`/base-info/major-hazard/list`));
  };

  handleClickValidate = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push(`/base-info/major-hazard/list`));
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
          <FormItem {...formItemLayout} label="重大危险源名称">
            {getFieldDecorator('dangerName', {
              getValueFromEvent: this.handleTrim,
              rules: [
                {
                  required: true,
                  message: '请输入重大危险源名称',
                },
              ],
            })(<Input {...itemStyles} placeholder="请输入重大危险源名称" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="重大危险源描述">
            {getFieldDecorator('hazardDes', {
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
                maxLength="2000"
              />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="生产经营活动类型">
            {getFieldDecorator('productType', {
              getValueFromEvent: this.handleTrim,
              rules: [
                {
                  required: true,
                  message: '请选择生产经营活动类型',
                },
              ],
            })(
              <Select {...itemStyles} allowClear placeholder="请选择">
                <Option value="1">生产</Option>
                <Option value="2">经营</Option>
                <Option value="3">使用</Option>
                <Option value="4">存储</Option>
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="生产存储场所产权">
            {getFieldDecorator('productArea', {
              getValueFromEvent: this.handleTrim,
              rules: [
                {
                  required: true,
                  message: '请选择生产存储场所产权',
                },
              ],
            })(
              <Select {...itemStyles} allowClear placeholder="请选择">
                <Option value="1">自有</Option>
                <Option value="2">租赁</Option>
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="防雷防静电设施是否定期接受检测">
            {getFieldDecorator('hasAccept', {
              getValueFromEvent: this.handleTrim,
              rules: [
                {
                  required: true,
                  message: '请选择',
                },
              ],
            })(
              <Select {...itemStyles} allowClear placeholder="请选择">
                <Option value="1">是</Option>
                <Option value="2">否</Option>
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="涉及危险工艺">
            {getFieldDecorator('involvedCraft', {
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
            {getFieldDecorator('area', {
              getValueFromEvent: this.handleTrim,
              rules: [
                {
                  required: true,
                  message: '请输入区域位置',
                },
              ],
            })(<Input {...itemStyles} placeholder="请输入区域位置" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="投用日期">
            {getFieldDecorator('startDate', {
              rules: [
                {
                  required: true,
                  message: '请输入投用日期',
                },
              ],
            })(
              <DatePicker
                {...itemStyles}
                showToday={false}
                format="YYYY-MM-DD"
                placeholder="请选择投用日期"
                // style={{ width: 260 }}
              />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="R值">
            {getFieldDecorator('r', {
              getValueFromEvent: this.handleTrim,
              rules: [
                {
                  required: true,
                  message: '请输入R值',
                },
              ],
            })(<Input {...itemStyles} placeholder="请输入R值" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="重大危险源等级">
            {getFieldDecorator('level', {
              rules: [
                {
                  required: true,
                  message: '请选择重大危险源等级',
                },
              ],
            })(
              <Select {...itemStyles} allowClear placeholder="请选择重大危险源等级">
                <Option value="1">一级</Option>
                <Option value="2">二级</Option>
                <Option value="3">三级</Option>
                <Option value="4">四级</Option>
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="单元内涉及的危险化学品">
            {getFieldDecorator('acceptDanger', {
              getValueFromEvent: this.handleTrim,
              rules: [
                {
                  required: true,
                  message: '请输入单元内涉及的危险化学品',
                },
              ],
            })(
              <TextArea
                {...itemStyles}
                placeholder="请输入单元内涉及的危险化学品"
                rows={4}
                maxLength="2000"
              />
            )}
            <Button type="primary"> 选择</Button>
          </FormItem>
          <FormItem {...formItemLayout} label="危险化学品性质">
            {getFieldDecorator('dangerChemicals', {
              getValueFromEvent: this.handleTrim,
              rules: [
                {
                  required: true,
                  message: '请选择危险化学品性质',
                },
              ],
            })(
              <Select {...itemStyles} allowClear placeholder="请选择危险化学品性质">
                <Option value="1">易燃</Option>
                <Option value="2">有毒</Option>
                <Option value="3">兼有易燃有毒</Option>
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="所处装置或区域">
            {getFieldDecorator('hasArea', {
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
            {getFieldDecorator('envirType', {
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
            {getFieldDecorator('envirname', {
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
            {getFieldDecorator('personNum', {
              getValueFromEvent: this.handleTrim,
            })(<Input {...itemStyles} placeholder="请输入周边环境人数" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="与危险源最近距离">
            {getFieldDecorator('distance', {
              getValueFromEvent: this.handleTrim,
            })(<Input {...itemStyles} placeholder="请输入与危险源最近距离" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="重大危险源周边安全间距">
            {getFieldDecorator('safetyClearance', {
              getValueFromEvent: this.handleTrim,
            })(<Input {...itemStyles} placeholder="请输入重大危险源周边安全间距" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="周边环境联系人">
            {getFieldDecorator('contactPerson', {
              getValueFromEvent: this.handleTrim,
            })(<Input {...itemStyles} placeholder="请输入周边环境联系人" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="周边环境联系人电话">
            {getFieldDecorator('phone', {
              getValueFromEvent: this.handleTrim,
            })(<Input {...itemStyles} placeholder="请输入周边环境联系人电话" />)}
          </FormItem>
        </Form>
      </Card>
    );
  }

  /* 渲染底部工具栏 */
  renderFooterToolbar() {
    return (
      <FooterToolbar>
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
      </PageHeaderLayout>
    );
  }
}
