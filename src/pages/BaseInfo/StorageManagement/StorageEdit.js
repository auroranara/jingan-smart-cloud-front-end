import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Form, Input, Button, Card, Icon, Popover, DatePicker, Select, Upload } from 'antd';
import FooterToolbar from '@/components/FooterToolbar';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import { getToken } from '@/utils/authority';

import styles from './StorageEdit.less';

const { Option } = Select;
const FormItem = Form.Item;
const { TextArea } = Input;

// 编辑页面标题
const editTitle = '编辑储罐';
// 添加页面标题
const addTitle = '新增储罐';

const storageAreaList = [
  { key: '1', value: '地上' },
  { key: '2', value: '地下' },
  { key: '3', value: '海上' },
  { key: '4', value: '海底' },
];

const storagTypeList = [
  { key: '1', value: '立式' },
  { key: '2', value: '卧式' },
  { key: '3', value: '球式' },
];

const constructList = [
  { key: '1', value: '拱顶式' },
  { key: '2', value: '浮顶式' },
  { key: '3', value: '内浮顶' },
  { key: '4', value: '卧式' },
];

const materialList = [
  { key: '1', value: '碳钢' },
  { key: '2', value: '不锈钢' },
  { key: '3', value: '聚乙烯' },
  { key: '4', value: '玻璃钢' },
];

const dangerLevelList = [
  { key: '1', value: '甲' },
  { key: '2', value: '乙' },
  { key: '3', value: '丙' },
  { key: '4', value: '丁' },
];

const pressureList = [
  { key: '1', value: '低压' },
  { key: '2', value: '中压' },
  { key: '3', value: '高压' },
  { key: '4', value: '超高压' },
];

const selectTypeList = [{ key: '1', value: '是' }, { key: '2', value: '否' }];

// 表单标签
const fieldLabels = {};

// 上传文件地址
const uploadAction = '/acloud_new/v2/uploadFile';

@connect(({ loading }) => ({}))
@Form.create()
export default class StorageEdit extends PureComponent {
  state = {};

  // 挂载后
  componentDidMount() {}

  // 去除左右两边空白
  handleTrim = e => e.target.value.trim();

  goBack = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push(`/base-info/storage-management/list`));
  };

  handleClickValidate = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push(`/base-info/storage-management/list`));
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
          <FormItem {...formItemLayout} label="所属罐组编号">
            {getFieldDecorator('number', {
              getValueFromEvent: this.handleTrim,
              rules: [
                {
                  required: true,
                  message: '请输入所属罐组编号',
                },
              ],
            })(<Input {...itemStyles} placeholder="请输入所属罐组编号" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="储罐编号">
            {getFieldDecorator('storgeCode', {
              getValueFromEvent: this.handleTrim,
              rules: [
                {
                  required: true,
                  message: '请输入储罐编号',
                },
              ],
            })(<Input {...itemStyles} placeholder="请输入储罐编号" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="储罐名称">
            {getFieldDecorator('storgeName', {
              getValueFromEvent: this.handleTrim,
              rules: [
                {
                  required: true,
                  message: '请输入储罐名称',
                },
              ],
            })(<Input {...itemStyles} placeholder="请输入储罐名称" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="储罐位置分类">
            {getFieldDecorator('productType', {
              rules: [
                {
                  required: true,
                  message: '请选择储罐位置分类',
                },
              ],
            })(
              <Select {...itemStyles} allowClear placeholder="请选择储罐位置分类">
                {storageAreaList.map(({ key, value }) => (
                  <Option key={key} value={value}>
                    {value}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="所属储罐区">
            {getFieldDecorator('hasArea', {
              getValueFromEvent: this.handleTrim,
            })(<Input {...itemStyles} placeholder="请输入所属储罐区" />)}
            <Button type="primary"> 选择</Button>
          </FormItem>
          <FormItem {...formItemLayout} label="位号">
            {getFieldDecorator('weihao', {
              getValueFromEvent: this.handleTrim,
              rules: [
                {
                  required: true,
                  message: '请输入位号',
                },
              ],
            })(<Input {...itemStyles} placeholder="请输入位号" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="储罐容积（m³）">
            {getFieldDecorator('storageCubage', {
              getValueFromEvent: this.handleTrim,
              rules: [
                {
                  required: true,
                  message: '请输入储罐容积（m³）',
                },
              ],
            })(<Input {...itemStyles} placeholder="请输入储罐容积（m³）" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="储罐形式">
            {getFieldDecorator('storageType', {
              rules: [
                {
                  required: true,
                  message: '请选择储罐形式',
                },
              ],
            })(
              <Select {...itemStyles} allowClear placeholder="请选择储罐形式">
                {storagTypeList.map(({ key, value }) => (
                  <Option key={key} value={value}>
                    {value}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="储罐结构">
            {getFieldDecorator('storageConstruct', {
              rules: [
                {
                  required: true,
                  message: '请选择储罐结构',
                },
              ],
            })(
              <Select {...itemStyles} allowClear placeholder="请选择储罐结构">
                {constructList.map(({ key, value }) => (
                  <Option key={key} value={value}>
                    {value}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="储罐材质">
            {getFieldDecorator('slect1', {
              rules: [
                {
                  required: true,
                  message: '请选择储罐材质',
                },
              ],
            })(
              <Select {...itemStyles} allowClear placeholder="请选择储罐材质">
                {materialList.map(({ key, value }) => (
                  <Option key={key} value={value}>
                    {value}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="是否压力容器">
            {getFieldDecorator('slect2', {
              rules: [
                {
                  required: true,
                  message: '请选择是否压力容器',
                },
              ],
            })(
              <Select {...itemStyles} allowClear placeholder="请选择是否压力容器">
                {selectTypeList.map(({ key, value }) => (
                  <Option key={key} value={value}>
                    {value}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="压力等级">
            {getFieldDecorator('slect3', {
              rules: [
                {
                  required: true,
                  message: '请选择压力等级',
                },
              ],
            })(
              <Select {...itemStyles} allowClear placeholder="请选择压力等级">
                {pressureList.map(({ key, value }) => (
                  <Option key={key} value={value}>
                    {value}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="设计压力（KPa）">
            {getFieldDecorator('productArea', {
              getValueFromEvent: this.handleTrim,
              rules: [
                {
                  required: true,
                  message: '请输入设计压力（KPa）',
                },
              ],
            })(<Input {...itemStyles} placeholder="请输入设计压力（KPa）" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="设计储量">
            {getFieldDecorator('involvedCraft', {
              getValueFromEvent: this.handleTrim,
              rules: [
                {
                  required: true,
                  message: '请输入设计压力（KPa）',
                },
              ],
            })(<Input {...itemStyles} placeholder="请输入设计储量" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="进出料方式">
            {getFieldDecorator('hasAccept', {
              getValueFromEvent: this.handleTrim,
              rules: [
                {
                  required: true,
                  message: '请输入进出料方式',
                },
              ],
            })(<Input {...itemStyles} placeholder="请输入进出料方式" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="投产日期">
            {getFieldDecorator('startDate', {
              rules: [
                {
                  required: true,
                  message: '请输入投产日期',
                },
              ],
            })(
              <DatePicker
                {...itemStyles}
                showToday={false}
                format="YYYY-MM-DD"
                placeholder="请选择投产日期"
              />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="存储介质">
            {getFieldDecorator('save1', {
              getValueFromEvent: this.handleTrim,
              rules: [
                {
                  required: true,
                  message: '请输入存储介质',
                },
              ],
            })(<Input {...itemStyles} placeholder="请输入存储介质" />)}
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
                {selectTypeList.map(({ key, value }) => (
                  <Option key={key} value={value}>
                    {value}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="所属危险化学品重大危险源单元">
            {getFieldDecorator('envirType', {
              getValueFromEvent: this.handleTrim,
            })(<Input {...itemStyles} placeholder="请输入所属危险化学品重大危险源单元" />)}
            <Button type="primary"> 选择</Button>
          </FormItem>
          <FormItem {...formItemLayout} label="是否高危储罐">
            {getFieldDecorator('dangerChemicals1', {
              rules: [
                {
                  required: true,
                  message: '请选择是否高危储罐',
                },
              ],
            })(
              <Select {...itemStyles} allowClear placeholder="请选择是否高危储罐">
                {selectTypeList.map(({ key, value }) => (
                  <Option key={key} value={value}>
                    {value}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="高危储罐自控系">
            {getFieldDecorator('startDate', {
              getValueFromEvent: this.handleTrim,
            })(<Input {...itemStyles} placeholder="请输入高危储罐自控系" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="安全设备">
            {getFieldDecorator('safety', {
              getValueFromEvent: this.handleTrim,
              rules: [
                {
                  required: true,
                  message: '请输入安全设备',
                },
              ],
            })(<Input {...itemStyles} placeholder="请输入安全设备" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="有无围堰">
            {getFieldDecorator('hasCofferdam', {
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
            {getFieldDecorator('acceptDanger', {
              getValueFromEvent: this.handleTrim,
              rules: [
                {
                  required: true,
                  message: '请输入围堰所围面积',
                },
              ],
            })(<Input {...itemStyles} placeholder="请输入围堰所围面积" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="火灾危险性等级">
            {getFieldDecorator('select8', {
              rules: [
                {
                  required: true,
                  message: '请选择火灾危险性等级',
                },
              ],
            })(
              <Select {...itemStyles} allowClear placeholder="请选择火灾危险性等级">
                {dangerLevelList.map(({ key, value }) => (
                  <Option key={key} value={value}>
                    {value}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="是否配套火柜">
            {getFieldDecorator('select9', {
              rules: [
                {
                  required: true,
                  message: '请选择是否配套火柜',
                },
              ],
            })(
              <Select {...itemStyles} allowClear placeholder="请选择是否配套火柜">
                {selectTypeList.map(({ key, value }) => (
                  <Option key={key} value={value}>
                    {value}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="是否设置保温/保冷">
            {getFieldDecorator('select10', {
              rules: [
                {
                  required: true,
                  message: '请选择是否设置保温/保冷',
                },
              ],
            })(
              <Select {...itemStyles} allowClear placeholder="请选择是否设置保温/保冷">
                {selectTypeList.map(({ key, value }) => (
                  <Option key={key} value={value}>
                    {value}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="是否设置自动喷淋">
            {getFieldDecorator('select11', {
              rules: [
                {
                  required: true,
                  message: '请选择是否设置自动喷淋',
                },
              ],
            })(
              <Select {...itemStyles} allowClear placeholder="请选择是否设置自动喷淋">
                {selectTypeList.map(({ key, value }) => (
                  <Option key={key} value={value}>
                    {value}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="是否设置消防水炮/泡沫炮">
            {getFieldDecorator('select12', {
              rules: [
                {
                  required: true,
                  message: '请选择是否设置消防水炮/泡沫炮',
                },
              ],
            })(
              <Select {...itemStyles} allowClear placeholder="请选择是否设置消防水炮/泡沫炮">
                {selectTypeList.map(({ key, value }) => (
                  <Option key={key} value={value}>
                    {value}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="备注">
            {getFieldDecorator('hazardDes', {
              getValueFromEvent: this.handleTrim,
            })(<TextArea {...itemStyles} placeholder="请输入备注" rows={4} maxLength="2000" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="现场照片">
            {getFieldDecorator('faceUrl', {})(
              <Upload
                name="files"
                headers={{ 'JA-Token': getToken() }}
                accept=".jpg" // 接收的文件格式
                data={{ folder: 'securityManageInfo' }} // 附带的参数
                showUploadList={false}
                action={uploadAction} // 上传地址
              >
                <Button>
                  <Icon type="upload" />
                  点击上传
                </Button>
              </Upload>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="附件">
            {getFieldDecorator('faceUrl', {})(
              <Upload
                name="files"
                headers={{ 'JA-Token': getToken() }}
                accept=".jpg" // 接收的文件格式
                data={{ folder: 'securityManageInfo' }} // 附带的参数
                showUploadList={false}
                action={uploadAction} // 上传地址
              >
                <Button>
                  <Icon type="upload" />
                  点击上传
                </Button>
              </Upload>
            )}
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
        title: '储罐管理',
        name: '储罐管理',
        href: '/base-info/storage-management/list',
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
