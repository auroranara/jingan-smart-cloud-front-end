import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Form, Icon as LegacyIcon } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Input, Button, Card, Popover, Cascader, Upload, message } from 'antd';

import FooterToolbar from '@/components/FooterToolbar';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import { getToken } from 'utils/authority';
import styles from '../TypicalAccidentCase/TEdit.less';
import { genGoBack } from '@/utils/utils';

const { TextArea } = Input;
const FormItem = Form.Item;

// 编辑页面标题
const editTitle = '编辑案例';
// 添加页面标题
const addTitle = '新增案例';

const fieldLabels = {};

/* root下的div */
const getRootChild = () => document.querySelector('#root>div');

// 上传文件夹
const folder = 'caseInfo';
// 上传文件地址
const uploadAction = '/acloud_new/v2/uploadFile';

@connect(({ typicalAccidentCase, company, loading }) => ({
  typicalAccidentCase,
  company,
  loading: loading.models.typicalAccidentCase,
}))
@Form.create()
export default class TEdit extends PureComponent {
  constructor(props) {
    super(props);
    this.goBack = genGoBack(props, '/safety-knowledge-base/typical-accident-case/list');
  }

  state = {
    accidentPicList: [],
    accidentLoading: false,
    directPicList: [],
    directLoading: false,
    indirectPicList: [],
    indirectLoading: false,
    adjunctPicList: [],
    adjunctLoading: false,
    detailList: {},
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
        type: 'typicalAccidentCase/fetchCaseList',
        payload: {
          pageSize: 18,
          pageNum: 1,
        },
        callback: res => {
          const { list } = res;
          const currentList = list.find(item => item.id === id) || {};
          const { accidProcessList, deriReasonList, inderiReasonList, otherFileList } = currentList;
          this.setState({
            detailList: currentList,
            accidentPicList: accidProcessList.map(({ dbUrl, webUrl }, index) => ({
              uid: index,
              status: 'done',
              name: `附件${index + 1}`,
              url: webUrl,
              dbUrl,
            })),
            directPicList: deriReasonList.map(({ dbUrl, webUrl }, index) => ({
              uid: index,
              status: 'done',
              name: `附件${index + 1}`,
              url: webUrl,
              dbUrl,
            })),
            indirectPicList: inderiReasonList.map(({ dbUrl, webUrl }, index) => ({
              uid: index,
              status: 'done',
              name: `附件${index + 1}`,
              url: webUrl,
              dbUrl,
            })),
            adjunctPicList: otherFileList.map(({ dbUrl, webUrl }, index) => ({
              uid: index,
              status: 'done',
              name: `附件${index + 1}`,
              url: webUrl,
              dbUrl,
            })),
          });
        },
      });
    } else {
      dispatch({
        type: 'typicalAccidentCase/clearDetail',
      });
    }
    // 获取行政区域
    dispatch({
      type: 'company/fetchIndustryType',
    });
  }

  /* 去除左右两边空白 */
  handleTrim = e => e.target.value.trim();

  // goBack = () => {
  //   const { dispatch } = this.props;
  //   dispatch(routerRedux.push(`/safety-knowledge-base/typical-accident-case/list`));
  // };

  // 事故经过上传照片处理
  handleAccidentChange = ({ fileList, file }) => {
    if (file.status === 'uploading') {
      this.setState({
        accidentPicList: fileList,
        accidentLoading: true,
      });
    } else if (file.status === 'done' && file.response.code === 200) {
      const {
        data: {
          list: [result],
        },
      } = file.response;
      if (result) {
        this.setState({
          accidentPicList: fileList.map(item => {
            if (!item.url && item.response) {
              return {
                ...item,
                url: result.webUrl,
                dbUrl: result.dbUrl,
              };
            }
            return item;
          }),
          accidentLoading: false,
        });
        message.success('上传成功！');
      }
    } else if (file.status === 'removed') {
      // 删除
      this.setState({
        accidentPicList: fileList.filter(item => {
          return item.status !== 'removed';
        }),
        accidentLoading: false,
      });
    } else if (file.status === 'error') {
      // error
      message.error('上传失败！');
      this.setState({
        accidentPicList: [],
        accidentLoading: false,
      });
    }
  };

  // 直接原因照片处理
  handleDirectChange = ({ file, fileList }) => {
    if (file.status === 'uploading') {
      this.setState({
        directPicList: fileList,
        directLoading: true,
      });
    } else if (file.status === 'done' && file.response.code === 200) {
      const {
        data: {
          list: [result],
        },
      } = file.response;
      if (result) {
        this.setState({
          directPicList: fileList.map(item => {
            if (!item.url && item.response) {
              return {
                ...item,
                url: result.webUrl,
                dbUrl: result.dbUrl,
              };
            }
            return item;
          }),
          directLoading: false,
        });
        message.success('上传成功！');
      }
    } else if (file.status === 'removed') {
      // 删除
      this.setState({
        directPicList: fileList.filter(item => {
          return item.status !== 'removed';
        }),
        directLoading: false,
      });
    } else if (file.status === 'error') {
      this.setState({
        directPicList: [],
        directLoading: false,
      });
    }
  };

  // 间接原因照片处理
  handleIndirectChange = ({ file, fileList }) => {
    if (file.status === 'uploading') {
      this.setState({
        indirectPicList: fileList,
        indirectLoading: true,
      });
    } else if (file.status === 'done' && file.response.code === 200) {
      const {
        data: {
          list: [result],
        },
      } = file.response;
      if (result) {
        this.setState({
          indirectPicList: fileList.map(item => {
            if (!item.url && item.response) {
              return {
                ...item,
                url: result.webUrl,
                dbUrl: result.dbUrl,
              };
            }
            return item;
          }),
          indirectLoading: false,
        });
        message.success('上传成功！');
      }
    } else if (file.status === 'removed') {
      // 删除
      this.setState({
        indirectPicList: fileList.filter(item => {
          return item.status !== 'removed';
        }),
        indirectLoading: false,
      });
    } else if (file.status === 'error') {
      // error
      this.setState({
        indirectPicList: [],
        indirectLoading: false,
      });
    }
  };

  // 其他附件照片处理
  handleAdjunctChange = ({ file, fileList }) => {
    if (file.status === 'uploading') {
      this.setState({
        adjunctPicList: fileList,
        adjunctLoading: true,
      });
    } else if (file.status === 'done' && file.response.code === 200) {
      const {
        data: {
          list: [result],
        },
      } = file.response;
      if (result) {
        this.setState({
          adjunctPicList: fileList.map(item => {
            if (!item.url && item.response) {
              return {
                ...item,
                url: result.webUrl,
                dbUrl: result.dbUrl,
              };
            }
            return item;
          }),
          adjunctLoading: false,
        });
        message.success('上传成功！');
      }
    } else if (file.status === 'removed') {
      // 删除
      this.setState({
        adjunctPicList: fileList.filter(item => {
          return item.status !== 'removed';
        }),
        adjunctLoading: false,
      });
    } else if (file.status === 'error') {
      // error
      this.setState({
        adjunctPicList: [],
        adjunctLoading: false,
      });
    }
  };

  handleBeforeUpload = (file, uploading) => {
    const isImage = file.type === 'image/jpeg' || file.type === 'image/png';
    if (uploading) {
      message.error('尚未上传结束');
    }
    if (!isImage) {
      message.error('上传失败，请上传jpg格式或者png格式图片');
    }
    return isImage && !uploading;
  };

  handleClickValidate = () => {
    const {
      match: {
        params: { id },
      },
      dispatch,
      form: { validateFieldsAndScroll },
    } = this.props;
    const { accidentPicList, directPicList, indirectPicList, adjunctPicList } = this.state;

    validateFieldsAndScroll((errors, values) => {
      if (
        // accidentPicList.length === 0 ||
        // directPicList.length === 0 ||
        adjunctPicList.length === 0
      ) {
        return message.error('请先上传！');
      }
      if (!errors) {
        const { expName, industyCategory, keyWords, abstractDesc } = values;
        const payload = {
          id,
          expName,
          industyCategory: industyCategory.join(','),
          keyWords,
          abstractDesc,
          accidProcess: JSON.stringify(
            accidentPicList.map(({ name, url, dbUrl }) => ({ name, webUrl: url, dbUrl }))
          ),
          deriReason: JSON.stringify(
            directPicList.map(({ name, url, dbUrl }) => ({ name, webUrl: url, dbUrl }))
          ),
          inderiReason: JSON.stringify(
            indirectPicList.map(({ name, url, dbUrl }) => ({ name, webUrl: url, dbUrl }))
          ),
          otherFile: JSON.stringify(
            adjunctPicList.map(({ name, url, dbUrl }) => ({ name, webUrl: url, dbUrl }))
          ),
        };
        const success = () => {
          const msg = id ? '编辑成功' : '新增成功';
          message.success(msg, 1, () => setTimeout(this.goBack, 1000));
        };

        const error = () => {
          message.error(id ? '编辑失败' : '新增失败');
        };

        if (id) {
          dispatch({
            type: 'typicalAccidentCase/fetchCaseEdit',
            payload,
            success,
            error,
          });
        } else {
          dispatch({
            type: 'typicalAccidentCase/fetchCaseAdd',
            payload,
            success,
            error,
          });
        }
      }
    });
  };

  renderInfo() {
    const {
      form: { getFieldDecorator },
      company: { industryCategories },
    } = this.props;

    const {
      accidentPicList,
      directPicList,
      indirectPicList,
      adjunctPicList,
      accidentLoading,
      directLoading,
      indirectLoading,
      adjunctLoading,
      detailList,
    } = this.state;

    const { expName, industyCategory, keyWords, abstractDesc } = detailList;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };

    const itemStyles = { style: { width: '70%', marginRight: '10px' } };

    return (
      <Card className={styles.card} bordered={false}>
        <Form style={{ marginTop: 8 }}>
          <FormItem {...formItemLayout} label="案例名称">
            {getFieldDecorator('expName', {
              initialValue: expName,
              getValueFromEvent: this.handleTrim,
              rules: [
                {
                  required: true,
                  message: '请输入单位',
                },
              ],
            })(<Input {...itemStyles} placeholder="请输入案例名称" />)}
          </FormItem>

          <FormItem {...formItemLayout} label="行业类别">
            {getFieldDecorator('industyCategory', {
              initialValue: industyCategory ? industyCategory.split(',') : [],
              rules: [
                {
                  required: true,
                  message: '请选择行业类别',
                },
              ],
            })(
              <Cascader
                {...itemStyles}
                options={industryCategories}
                fieldNames={{
                  value: 'type_id',
                  label: 'gs_type_name',
                  children: 'children',
                }}
                allowClear
                changeOnSelect
                notFoundContent
                placeholder="请选择行业类别"
                getPopupContainer={getRootChild}
              />
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="关键字">
            {getFieldDecorator('keyWords', {
              initialValue: keyWords,
              rules: [
                {
                  required: true,
                  message: '请输入关键字',
                },
              ],
            })(<Input {...itemStyles} placeholder="请输入关键字" />)}
          </FormItem>

          <FormItem {...formItemLayout} label="事故概述">
            {getFieldDecorator('abstractDesc', {
              initialValue: abstractDesc,
              rules: [
                {
                  required: true,
                  message: '请输入事故概述',
                },
              ],
            })(<TextArea {...itemStyles} placeholder="请输入事故概述" rows={4} maxLength="2000" />)}
          </FormItem>

          {/* <FormItem {...formItemLayout} label="事故经过">
            {getFieldDecorator('accidProcess', {
              initialValue: accidentPicList,
              rules: [
                {
                  required: true,
                  message: '请上传照片',
                },
              ],
            })(
              <Upload
                name="files"
                accept=".jpg,.png" // 接受的文件格式
                headers={{ 'JA-Token': getToken() }} // 上传的请求头部
                data={{ folder }} // 附带参数
                action={uploadAction} // 上传地址
                fileList={accidentPicList}
                onChange={this.handleAccidentChange}
                beforeUpload={file => this.handleBeforeUpload(file, accidentLoading)}
              >
                <Button
                  type="dashed"
                  style={{ width: '96px', height: '96px' }}
                  disabled={accidentLoading}
                >
                  <LegacyIcon type="plus" style={{ fontSize: '32px' }} />
                  <div style={{ marginTop: '8px' }}>点击上传</div>
                </Button>
              </Upload>
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="直接原因">
            {getFieldDecorator('deriReason', {
              initialValue: directPicList,
              rules: [
                {
                  required: true,
                  message: '请上传照片',
                },
              ],
            })(
              <Upload
                name="files"
                accept=".jpg,.png" // 接受的文件格式
                headers={{ 'JA-Token': getToken() }} // 上传的请求头部
                data={{ folder }} // 附带参数
                action={uploadAction} // 上传地址
                fileList={directPicList}
                onChange={this.handleDirectChange}
                beforeUpload={file => this.handleBeforeUpload(file, directLoading)}
              >
                <Button
                  type="dashed"
                  style={{ width: '96px', height: '96px' }}
                  disabled={directLoading}
                >
                  <LegacyIcon type="plus" style={{ fontSize: '32px' }} />
                  <div style={{ marginTop: '8px' }}>点击上传</div>
                </Button>
              </Upload>
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="间接原因">
            {getFieldDecorator('inderiReason')(
              <Upload
                name="files"
                accept=".jpg,.png" // 接受的文件格式
                headers={{ 'JA-Token': getToken() }} // 上传的请求头部
                data={{ folder }} // 附带参数
                action={uploadAction} // 上传地址
                fileList={indirectPicList}
                onChange={this.handleIndirectChange}
                beforeUpload={file => this.handleBeforeUpload(file, indirectLoading)}
              >
                <Button
                  type="dashed"
                  style={{ width: '96px', height: '96px' }}
                  disabled={indirectLoading}
                >
                  <LegacyIcon type="plus" style={{ fontSize: '32px' }} />
                  <div style={{ marginTop: '8px' }}>点击上传</div>
                </Button>
              </Upload>
            )}
          </FormItem> */}

          <FormItem {...formItemLayout} label="附件">
            {getFieldDecorator('otherFile', {
              initialValue: adjunctPicList,
              rules: [
                {
                  required: true,
                  message: '请上传照片',
                },
              ],
            })(
              <Upload
                name="files"
                accept=".jpg,.png" // 接受的文件格式
                headers={{ 'JA-Token': getToken() }} // 上传的请求头部
                data={{ folder }} // 附带参数
                action={uploadAction} // 上传地址
                fileList={adjunctPicList}
                onChange={this.handleAdjunctChange}
                beforeUpload={file => this.handleBeforeUpload(file, adjunctLoading)}
              >
                <Button
                  type="dashed"
                  style={{ width: '96px', height: '96px' }}
                  disabled={adjunctLoading}
                >
                  <LegacyIcon type="plus" style={{ fontSize: '32px' }} />
                  <div style={{ marginTop: '8px' }}>点击上传</div>
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
          <LegacyIcon type="cross-circle-o" className={styles.errorIcon} />
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
          <LegacyIcon type="exclamation-circle" />
          {errorCount}
        </Popover>
      </span>
    );
  }

  /* 渲染底部工具栏 */
  renderFooterToolbar() {
    const { accidentLoading, adjunctLoading, indirectLoading, directLoading } = this.state;
    return (
      <FooterToolbar>
        {this.renderErrorInfo()}
        <Button
          type="primary"
          size="large"
          loading={adjunctLoading || indirectLoading || directLoading || accidentLoading}
          onClick={this.handleClickValidate}
        >
          提交
        </Button>
        <Button size="large" onClick={this.goBack}>
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
        title: '安全生产知识库',
        name: '安全生产知识库',
      },
      {
        title: '典型事故案例',
        name: '典型事故案例',
        href: '/safety-knowledge-base/typical-accident-case/list',
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
