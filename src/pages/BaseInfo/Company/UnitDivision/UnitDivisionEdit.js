import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Form, Input, Button, Card, Icon, Popover, message } from 'antd';
import FooterToolbar from '@/components/FooterToolbar';
import { phoneReg } from '@/utils/validate';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';

// import { numReg } from '@/utils/validate';

import styles from './UnitDivision.less';

const FormItem = Form.Item;

// 编辑页面标题
const editTitle = '编辑单位分部';
// 添加页面标题
const addTitle = '新增单位分部';

// 表单标签
const fieldLabels = {
  divisionName: '分部名称',
  divisionAddress: '分部地址',
  user: '负责人',
  phone: '联系电话',
};

@connect(({ company, unitDivision, user, loading }) => ({
  company,
  user,
  unitDivision,
  loading: loading.models.unitDivision,
}))
@Form.create()
export default class UnitDivisionEdit extends PureComponent {
  state = {};

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
        type: 'unitDivision/fetchDivisionDetail',
        payload: {
          id,
        },
      });
    } else {
      // 清空详情
      dispatch({
        type: 'unitDivision/clearDetail',
      });
    }
  }

  // 返回到列表页面
  goBack = id => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push(`/base-info/company/division/list/${id}`));
  };

  /* 去除左右两边空白 */
  handleTrim = e => e.target.value.trim();

  /* 点击提交按钮验证表单信息 */
  handleClickValidate = () => {
    const {
      form: { validateFieldsAndScroll },
      match: {
        params: { id },
      },
      location: {
        query: { companyId, unitId },
      },
      dispatch,
    } = this.props;
    console.log('this.props', this.props);
    validateFieldsAndScroll((error, values) => {
      if (!error) {
        this.setState({
          submitting: true,
        });

        const { name, address, chargeName, phone } = values;

        const payload = {
          name,
          address,
          chargeName,
          phone,
        };

        const success = () => {
          const msg = id ? '编辑成功' : '新增成功';
          message.success(msg, 1, this.goBack(companyId));
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
            type: 'unitDivision/editUnitDivision',
            payload: {
              ...payload,
              unitId,
              id,
            },
            success,
            error,
          });
        }
        // 不存在id,则为新增
        else {
          dispatch({
            type: 'unitDivision/insertDivision',
            payload: {
              ...payload,
              unitId: companyId,
            },
            success,
            error,
          });
        }
      }
    });
  };

  // 渲染视频设备信息
  renderInfo() {
    const {
      unitDivision: {
        detail: {
          data: { name, address, chargeName, phone },
        },
      },
      form: { getFieldDecorator },
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
        <Form style={{ marginTop: 8 }}>
          <FormItem {...formItemLayout} label={fieldLabels.divisionName}>
            {getFieldDecorator('name', {
              initialValue: name,
              getValueFromEvent: this.handleTrim,
              rules: [
                {
                  required: true,
                  message: '请输入分部名称',
                },
              ],
            })(<Input placeholder="请输入分部名称" />)}
          </FormItem>

          <FormItem {...formItemLayout} label={fieldLabels.divisionAddress}>
            {getFieldDecorator('address', {
              initialValue: address,
              getValueFromEvent: this.handleTrim,
              rules: [
                {
                  required: true,
                  message: '请输入分部地址',
                },
              ],
            })(<Input placeholder="请输入分部地址" />)}
          </FormItem>

          <FormItem {...formItemLayout} label={fieldLabels.user}>
            {getFieldDecorator('chargeName', {
              initialValue: chargeName,
              getValueFromEvent: this.handleTrim,
              rules: [
                {
                  message: '请输入负责人姓名',
                },
              ],
            })(<Input placeholder="请输入负责人姓名" />)}
          </FormItem>

          <FormItem {...formItemLayout} label={fieldLabels.phone}>
            {getFieldDecorator('phone', {
              initialValue: phone,
              getValueFromEvent: this.handleTrim,
              rules: [
                {
                  message: '请输入联系电话',
                },
                { pattern: phoneReg, message: '联系电话格式不正确' },
              ],
            })(<Input placeholder="请输入联系电话" />)}
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
    const {
      location: {
        query: { companyId },
      },
    } = this.props;

    return (
      <FooterToolbar>
        {this.renderErrorInfo()}
        <Button type="primary" size="large" onClick={this.handleClickValidate}>
          确定
        </Button>
        <Button type="primary" size="large" onClick={() => this.goBack(companyId)}>
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
      location: {
        query: { companyId },
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
        title: '单位管理',
        name: '单位管理',
        href: '/base-info/company/list',
      },
      {
        title: '单位分部',
        name: '单位分部',
        href: `/base-info/company/division/list/${companyId}`,
      },
      {
        title,
        name: title,
      },
    ];

    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
        content={
          <div>
            <span style={{ paddingTop: 10 }}>
              一家单位里有多个分部，可以建立单位分部，比如：XXX医院，有城中院区，洋湖院区，可以在这里创建
            </span>
          </div>
        }
      >
        {this.renderInfo()}
        {this.renderFooterToolbar()}
      </PageHeaderLayout>
    );
  }
}
