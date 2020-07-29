import React, { Component } from 'react';
import { connect } from 'dva';
import { Form } from '@ant-design/compatible';
import { Card, Input, Button, Select, Row, Col, Upload, message, Table, DatePicker, Divider, Tooltip } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import { title as listTitlt, listPath } from './List';
import { title as recordTitlt } from './RecordList';
import CustomUpload from '@/jingan-components/CustomUpload';
import { PlusOutlined, DownloadOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { getToken } from 'utils/authority';
import SignModal from '@/pages/RiskControl/RiskPointManage/SignModal.js';
import styles from '@/pages/RiskControl/RiskPointManage/RiskPointEdit.less';
import standardImgLec from '@/assets/risk-standard-scl-lec.png';
import standardImgLs from '@/assets/risk-standard-scl-ls.png';
import router from 'umi/router';
import moment from 'moment';
import { lecSettings, lsSettings } from './config';
import { stringify } from 'qs';

const FormItem = Form.Item;
const Option = Select.Option;

// 上传文件夹
const folder = 'scl';
// 上传文件地址
const uploadAction = '/acloud_new/v2/uploadFile';
const itemStyles = { style: { width: 'calc(70%)', marginRight: '10px' } };
const formItemLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 15 },
};



@Form.create()
@connect(({ riskPointManage, safetyChecklist, loading }) => ({
  riskPointManage,
  safetyChecklist,
  signLoading: loading.effects['riskPointManage/fetchWarningSignDict'],
}))
export default class RecordHandle extends Component {

  state = {
    signVisible: false, // 选择标志弹窗是否可见
    selectedSignList: [], // 已选择标志
    signUploadList: [], // 标志自定义上传文件
    detail: {}, // 详情
  };

  componentDidMount () {
    const {
      dispatch,
      match: { params: { recordId } },
      form: { setFieldsValue },
      location: { query: { riskAnalyze } },
    } = this.props;
    // 获取易导致的事故类型字典
    dispatch({
      type: 'riskPointManage/fetchAccidentTypeDict',
    });
    // 获取风险标志字典
    this.fetchPointLabel();
    // 如果编辑/查看 获取详情
    if (recordId) {
      dispatch({
        type: 'safetyChecklist/fetchRecordDetail',
        payload: { id: recordId },
        callback: detail => {
          const {
            warnSign,
            l,
            e,
            c,
            s,
            evaluateProject,
            majorHidden,
            hiddenTypeResult,
            riskMeasures,
            emergencyMeasures,
            evaluatePer,
            evaluateDate,
            scenePhotoList,
          } = detail;
          this.setState({
            detail,
            selectedSignList: warnSign ? warnSign.split(',').map(webUrl => ({ webUrl })) : [],
          });
          setFieldsValue({
            ...+riskAnalyze === 1 ? { l, e, c } : { l, s },
            evaluateProject,
            majorHidden,
            hiddenTypeResult: hiddenTypeResult ? hiddenTypeResult.split(',') : [],
            riskMeasures,
            emergencyMeasures,
            evaluatePer,
            evaluateDate: evaluateDate ? moment(evaluateDate) : undefined,
            scenePhotoList: Array.isArray ? scenePhotoList.map(item => ({ ...item, uid: item.id, status: 'done', url: item.webUrl, name: item.fileName })) : [],
          });
        },
      });
    }
  }

  // 获取标志字典
  fetchPointLabel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'riskPointManage/fetchWarningSignDict',
    });
  };

  // 选择标志
  handleSignSelect = values => {
    this.setState({ selectedSignList: values || [] });
    this.onSignModalClose();
  }

  // 关闭标志弹窗
  onSignModalClose = () => {
    this.setState({ signVisible: false })
  }

  // 监听可能发生的事故类型及后果
  onHiddenTypeChange = id => {
    const {
      riskPointManage: {
        accidentTypeDict: { list = [] },
      },
      form: { setFieldsValue },
    } = this.props;
    // 联动-应急处置设施
    setFieldsValue({
      emergencyMeasures: list
        .filter(item => id.indexOf(item.typeId) >= 0)
        .map(item => item.typeName + ':' + item.emergencyMeasure).join('\n'),
    });
    this.setState({
      selectedSignList: list.reduce((arr, item) => {
        return id.indexOf(item.typeId) >= 0 && Array.isArray(item.warningSignInfos) && item.warningSignInfos.length ? [...arr, item.warningSignInfos[0]] : arr;
      }, []),
    });
  }

  //删除点击的标志
  handleSignDelete = index => {
    this.setState(({ selectedSignList }) => ({
      selectedSignList: selectedSignList.filter((item, i) => {
        return i !== index;
      }),
    }))
  }

  // 监听标志自定义上传
  onSignUploadChange = ({ file, fileList }) => {
    if (file.status === 'uploading') {
      this.setState({
        signUploadList: fileList,
      });
    } else if (file.status === 'done') {
      if (file.response.code === 200) {
        const {
          data: {
            list: [result],
          },
        } = file.response;
        if (result) {
          this.setState({
            signUploadList: fileList.map(item => {
              if (!item.url && item.response) {
                return {
                  ...item,
                  url: result.webUrl,
                  dbUrl: result.dbUrl,
                };
              }
              return item;
            }),
          });
          this.setState({
            selectedSignList: [
              ...this.state.selectedSignList,
              {
                webUrl: result.webUrl,
                dbUrl: result.dbUrl,
                fileName: result.name,
              },
            ],
            signUploadList: [],
          });
        }
      } else {
        // code为500
        message.error('上传失败！');
        this.setState({
          signUploadList: fileList.filter(item => {
            return !item.response || item.response.code !== 200;
          }),
        });
      }
    }
  }

  onClickBack = () => {
    const path = this.generateBackPath();
    router.push(path);
  }

  onClickSubmit = () => {
    const {
      dispatch,
      form: { validateFieldsAndScroll },
      match: { params: { id, recordId } },
      location: { query: { riskAnalyze } }, // 风险分析方法 lec-1 ls-2
    } = this.props;
    const { selectedSignList } = this.state;
    validateFieldsAndScroll((error, values) => {
      if (error) return;
      const { l, e, c, s, hiddenTypeResult, evaluateDate, ...resValues } = values;
      const riskItem = l && e && c ? lecSettings.riskLevelList.find(item => item.range(l * e * c)) : undefined;
      const payload = {
        ...resValues,
        safeCheckId: id,
        riskLevel: riskItem ? riskItem.level : undefined,
        warnSign: Array.isArray(selectedSignList) ? selectedSignList.map(item => item.webUrl).join(',') : '',
        hiddenTypeResult: Array.isArray(hiddenTypeResult) && hiddenTypeResult.length ? hiddenTypeResult.join(',') : '',
        evaluateDate: evaluateDate ? moment(evaluateDate).valueOf() : undefined,
        ...+riskAnalyze === 1 ? { l, e, c } : { l, s },
        type: 1,
      };
      const path = this.generateBackPath();
      const callback = (success, res) => {
        if (success) {
          message.success('操作成功');
          router.push(path);
        } else {
          message.error(res && res.msg ? res.msg : '操作失败');
        }
      }
      // 新增
      if (/add/.test(location.href)) {
        dispatch({
          type: 'safetyChecklist/addRecord',
          payload,
          callback,
        });
      } else if (/edit/.test(location.href)) {
        // 编辑
        dispatch({
          type: 'safetyChecklist/editRecord',
          payload: { ...payload, id: recordId },
          callback,
        });
      }
    })
  }

  generateBackPath = () => {
    const { match: { params: { id } }, location: { query } } = this.props;
    return `/risk-control/safety-checklist/${id}/record?${stringify(query)}`
  }

  // 风险分析方法： LEC
  renderLec = () => {
    const {
      form: { getFieldDecorator, setFieldsValue, getFieldsValue },
    } = this.props;
    const { l, e, c } = getFieldsValue();
    const riskItem = l && e && c ? lecSettings.riskLevelList.find(item => item.range(l * e * c)) : undefined;
    return (
      <div>
        <h2 style={{ display: 'inline-block', transform: 'translateX(-100%)', marginLeft: '31%' }}>风险分析方法： LEC</h2>
        <FormItem label="事件发生可能性（L）">
          {getFieldDecorator('l', {
            rules: [{ required: true, message: '请选择事件发生可能性（L）' }],
          })(
            <Table
              rowKey="score"
              dataSource={lecSettings.l.list}
              pagination={false}
              columns={lecSettings.l.columns}
              bordered
              rowSelection={{
                selectedRowKeys: [l],
                type: 'radio',
                onSelect: ({ score }) => {
                  setFieldsValue({ l: score });
                },
              }}
            />
          )}
        </FormItem>
        <FormItem label="暴露于危险环境的频繁程度（E）">
          {getFieldDecorator('e', {
            rules: [{ required: true, message: '请选择暴露于危险环境的频繁程度（E）' }],
          })(
            <Table
              rowKey="score"
              dataSource={lecSettings.e.list}
              pagination={false}
              columns={lecSettings.e.columns}
              bordered
              rowSelection={{
                selectedRowKeys: [e],
                type: 'radio',
                onSelect: ({ score }) => {
                  setFieldsValue({ e: score });
                },
              }}
            />
          )}
        </FormItem>
        <FormItem label="发生事故事件偏差产生的后果严重性（C）">
          {getFieldDecorator('c', {
            rules: [{ required: true, message: '请选择发生事故事件偏差产生的后果严重性（C）' }],
          })(
            <Table
              rowKey="score"
              dataSource={lecSettings.c.list}
              pagination={false}
              columns={lecSettings.c.columns}
              bordered
              rowSelection={{
                selectedRowKeys: [c],
                type: 'radio',
                onSelect: ({ score }) => {
                  setFieldsValue({ c: score });
                },
              }}
            />
          )}
        </FormItem>
        <FormItem label={(<span>评估风险值（D）：<Tooltip title="备注：D=L×E×C"><InfoCircleOutlined style={{ color: 'gray', cursor: 'pointer', verticalAlign: 'middle' }} /></Tooltip></span>)} {...formItemLayout}>
          <Input value={l && e && c ? `${l}×${e}×${c}=${l * e * c}` : ''} disabled style={{ width: '300px' }} />
        </FormItem>
        <FormItem label="风险级别：" {...formItemLayout}>
          <Input value={riskItem ? riskItem.level + '级' : ''} disabled style={{ width: '300px' }} />
        </FormItem>
        <FormItem label="风险等级：" {...formItemLayout}>
          <Input value={riskItem ? riskItem.colorName : ''} disabled style={{ width: '300px' }} />
        </FormItem>
        <FormItem label="风险程度：" {...formItemLayout}>
          <Input value={riskItem ? riskItem.degree : ''} disabled style={{ width: '300px' }} />
        </FormItem>
        <FormItem label="风险等级判断标准：">
          <img style={{ width: '760px', height: '260px', objectFit: 'contain' }} src={standardImgLec} alt="standard" />
        </FormItem>
        <Divider type="horizontal" />
        <FormItem label="评估人员：" {...formItemLayout}>
          {getFieldDecorator('evaluatePer', {
            rules: [{ required: true, message: '请输入评估人员' }],
          })(
            <Input placeholder="请输入" {...itemStyles} />
          )}
        </FormItem>
        <FormItem label="评估日期：" {...formItemLayout}>
          {getFieldDecorator('evaluateDate', {
            rules: [{ required: true, message: '请选择评估日期' }],
          })(
            <DatePicker allowClear {...itemStyles} />
          )}
        </FormItem>
      </div>
    )
  }

  // 风险分析方法： LS
  renderLs = () => {
    const {
      form: { getFieldDecorator, setFieldsValue, getFieldsValue },
    } = this.props;
    const { l, s } = getFieldsValue();
    const riskItem = l && s ? lsSettings.riskLevelList.find(item => item.range(l * s)) : undefined;

    return (
      <div>
        <h2 style={{ display: 'inline-block', transform: 'translateX(-100%)', marginLeft: '31%' }}>风险分析方法： LS</h2>
        <FormItem label="事件发生可能性（L）">
          {getFieldDecorator('l', {
            rules: [{ required: true, message: '请选择事件发生可能性（L）' }],
          })(
            <Table
              rowKey="score"
              dataSource={lsSettings.l.list}
              pagination={false}
              columns={lsSettings.l.columns}
              bordered
              rowSelection={{
                selectedRowKeys: [l],
                type: 'radio',
                onSelect: ({ score }) => {
                  setFieldsValue({ l: score });
                },
              }}
            />
          )}
        </FormItem>
        <FormItem label="事件后果严重性（S）">
          {getFieldDecorator('s', {
            rules: [{ required: true, message: '请选择事件后果严重性（S）' }],
          })(
            <Table
              rowKey="score"
              dataSource={lsSettings.s.list}
              pagination={false}
              columns={lsSettings.s.columns}
              bordered
              rowSelection={{
                selectedRowKeys: [s],
                type: 'radio',
                onSelect: ({ score }) => {
                  setFieldsValue({ s: score });
                },
              }}
            />
          )}
        </FormItem>
        <FormItem
          label={(<span>评估风险值（R）：<Tooltip title="备注：R=L×S"><InfoCircleOutlined style={{ color: 'gray', cursor: 'pointer', verticalAlign: 'middle' }} /></Tooltip></span>)}
          {...formItemLayout}>
          <Input value={l && s ? `${l}×${s}=${l * s}` : ''} disabled style={{ width: '300px' }} />
        </FormItem>
        <FormItem label="风险级别：" {...formItemLayout}>
          <Input value={riskItem ? riskItem.level + '级' : ''} disabled style={{ width: '300px' }} />
        </FormItem>
        <FormItem label="风险等级：" {...formItemLayout}>
          <Input value={riskItem ? riskItem.colorName : ''} disabled style={{ width: '300px' }} />
        </FormItem>
        <FormItem label="风险程度：" {...formItemLayout}>
          <Input value={riskItem ? riskItem.degree : ''} disabled style={{ width: '300px' }} />
        </FormItem>
        <FormItem label="风险等级判断标准：">
          <img style={{ width: '760px', height: '260px', objectFit: 'contain' }} src={standardImgLs} alt="standard" />
        </FormItem>
        <Divider type="horizontal" />
        <FormItem label="评估人员：" {...formItemLayout}>
          {getFieldDecorator('evaluatePer', {
            rules: [{ required: true, message: '请输入评估人员' }],
          })(
            <Input placeholder="请输入" {...itemStyles} />
          )}
        </FormItem>
        <FormItem label="评估日期：" {...formItemLayout}>
          {getFieldDecorator('evaluateDate', {
            rules: [{ required: true, message: '请选择评估日期' }],
          })(
            <DatePicker allowClear {...itemStyles} />
          )}
        </FormItem>
      </div>
    )
  }

  render () {
    const {
      signLoading,
      riskPointManage: {
        warningSignDict: { list: signList = [] },
      },
      location: { query: { riskAnalyze } }, // 风险分析方法
      form: { getFieldDecorator },
      riskPointManage: {
        accidentTypeDict: { list: accidentTypeList = [] },
      },
    } = this.props;
    const {
      signVisible,
      selectedSignList,
      signUploadList,
    } = this.state;
    const isAdd = /add/.test(location.href);
    const isDetail = /view/.test(location.href);
    const title = (isAdd && '新增评价记录') || (/edit/.test(location.href) && '编辑评价记录') || (isDetail && '查看评价记录');
    const BREADCRUMB_LIST = [
      { title: '首页', name: '首页', href: '/' },
      { title: '风险分级管控', name: '风险分级管控' },
      { title: listTitlt, name: listTitlt, href: listPath },
      { title: recordTitlt, name: recordTitlt, href: this.generateBackPath() },
      { title, name: title },
    ];
    const setField = [
      {
        id: 'fileName',
        render () {
          return <Input placeholder="请输入标志名称" />;
        },
      },
    ];
    return (
      <PageHeaderLayout title={title} breadcrumbList={BREADCRUMB_LIST}>
        <Card bordered={false}>
          <Form {...formItemLayout}>
            <FormItem label="评估项目">
              {getFieldDecorator('evaluateProject', {
                rules: [{ required: true, message: '请输入评估项目' }],
              })(<Input.TextArea rows={3} {...itemStyles} />)}
            </FormItem>
            <FormItem label="主要危险因素（人、物、作业环境、管理）">
              {getFieldDecorator('majorHidden', {
                rules: [{ required: true, message: '请输主要危险因素（人、物、作业环境、管理）' }],
              })(<Input.TextArea rows={3} {...itemStyles} />)}
            </FormItem>
            <FormItem label="可能发生的事故类型及后果">
              {getFieldDecorator('hiddenTypeResult', {
                rules: [{ required: true, message: '请选择可能发生的事故类型及后果' }],
              })(
                <Select
                  mode="multiple"
                  placeholder="请选择可能发生的事故类型及后果"
                  onChange={this.onHiddenTypeChange}
                  filterOption={(value, option) => new RegExp(option.children).test(value)}
                  {...itemStyles}
                >
                  {accidentTypeList.map(({ typeId, typeName }) => (
                    <Option value={typeId} key={typeId}>
                      {typeName}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
            <FormItem label="风险管控措施">
              {getFieldDecorator('riskMeasures', {
                rules: [{ required: true, message: '请输入风险管控措施' }],
                initialValue: isAdd ? '工程技术措施：\n 管理措施：\n 培训教育措施： \n 应急处置措施：' : undefined,
              })(<Input.TextArea rows={5} {...itemStyles} />)}
            </FormItem>
            <FormItem label="应急处置措施">
              {getFieldDecorator('emergencyMeasures', {
                rules: [{ required: true, message: '请输入应急处置措施' }],
              })(<Input.TextArea rows={5} {...itemStyles} />)}
            </FormItem>
            <FormItem label="现场图片">
              {getFieldDecorator('scenePhotoList')(
                <CustomUpload folder={folder} type={isDetail ? 'span' : 'select'} />
              )}
            </FormItem>
            <FormItem label="警示标志">
              {Array.isArray(selectedSignList) && selectedSignList.length > 0 && (
                <Row style={{ marginBottom: '10px' }}>
                  {selectedSignList.map((item, index) => {
                    const { webUrl } = item;
                    return (
                      <div key={index} className={styles.iconItem}>
                        <img width="100%" height="100%" src={webUrl} alt="" />
                        <div
                          className={styles.iconDelete}
                          onClick={() => this.handleSignDelete(index)}
                        >
                          删除
                      </div>
                      </div>
                    );
                  })}
                </Row>
              )}
              <Row>
                <Button type="primary" style={{ margin: '4px 10px 4px 0' }} onClick={() => this.setState({ signVisible: true })}><PlusOutlined />选择国际标志</Button>
                {getFieldDecorator('warnSign')(
                  <Upload
                    name="files"
                    headers={{ 'JA-Token': getToken() }}
                    data={{ folder }} // 附带的参数
                    action={uploadAction} // 上传地址
                    fileList={signUploadList}
                    onChange={this.onSignUploadChange}
                  >
                    <Button><DownloadOutlined />自定义上传</Button>
                  </Upload>
                )}
              </Row>
            </FormItem>
            <Divider type="horizontal" />
            {/* 风险分析方法： LEC */}
            {+riskAnalyze === 1 && this.renderLec()}
            {/* 风险分析方法： LS */}
            {+riskAnalyze === 2 && this.renderLs()}
            <div style={{ textAlign: 'center', marginTop: 30 }}>
              {!isDetail && (
                <Button style={{ marginRight: '20px' }} size="large" type="primary" onClick={this.onClickSubmit}>
                  提交
                </Button>
              )}
              <Button size="large" onClick={this.onClickBack}>
                返回
            </Button>
            </div>
          </Form>
        </Card>

        {/* 选择标志 */}
        <SignModal
          title="选择标志"
          loading={signLoading}
          visible={signVisible}
          list={signList}
          selectedList={selectedSignList}
          fetch={this.fetchPointLabel}
          handleSelect={this.handleSignSelect}
          onClose={this.onSignModalClose}
          field={setField}
        />
      </PageHeaderLayout>
    )
  }
}
