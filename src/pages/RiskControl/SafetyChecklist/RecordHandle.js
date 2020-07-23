import React, { Component } from 'react';
import { connect } from 'dva';
import { Form } from '@ant-design/compatible';
import { Card, Input, Button, Select, Row, Upload, message, Table } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import { title as listTitlt } from './List';
import { title as recordTitlt } from './RecordList';
import CustomUpload from '@/jingan-components/CustomUpload';
import { PlusOutlined, DownloadOutlined } from '@ant-design/icons';
import { getToken } from 'utils/authority';
import SignModal from '@/pages/RiskControl/RiskPointManage/SignModal.js';
import styles from '@/pages/RiskControl/RiskPointManage/RiskPointEdit.less';

const FormItem = Form.Item;
const Option = Select.Option;

// 上传文件夹
const folder = 'scl';
// 上传文件地址
const uploadAction = '/acloud_new/v2/uploadFile';
const itemStyles = { style: { width: 'calc(70%)', marginRight: '10px' } };
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};
const eventPossibilityColumns = [
  {
    title: '分值',
    key: 'score',
    dataIndex: 'score',
    width: 200,
  },
  {
    title: '事故、事件或偏差发生的可能性',
    key: 'label',
    dataIndex: 'label',
  },
];
// 事件发生可能性（L）
const lList = [
  {
    score: 10,
    label: '完全可以预料',
  },
  {
    score: 6,
    label: '相当可能；或危害的发生不能被发现（没有监测系统）；或在现场没有采取防范、监测、保护、控制措施；或在正常情况下经常发生此类事故、事件或偏差',
  },
  {
    score: 3,
    label: '可能，但不经常；或危害的发生不容易被发现；现场没有检测系统或保护措施（如没有保护装置、没有个人防护用品等），也未作过任何监测；或未严格按操作规程执行；或在现场有控制措施，但未有效执行或控制措施不当；或危害在预期情况下发生',
  },
  {
    score: 1,
    label: '可能性小，完全意外；或危害的发生容易被发现；现场有监测系统或曾经作过监测；或过去曾经发生类似事故、事件或偏差；或在异常情况下发生过类似事故、事件或偏差',
  },
  {
    score: 0.5,
    label: '很不可能，可以设想；危害一旦发生能及时发现，并能定期进行监测',
  },
  {
    score: 0.2,
    label: '极不可能；有充分、有效的防范、控制、监测、保护措施；或员工安全卫生意识相当高，严格执行操作规程',
  },
  {
    score: 0.1,
    label: '实际不可能',
  },
];
// 暴露于危险环境的频繁程度（E）
const eList = [
  {
    score: 10,
    label: '连续暴露',
  },
  {
    score: 6,
    label: '连续暴露',
  },
  {
    score: 3,
    label: '连续暴露',
  },
  {
    score: 2,
    label: '连续暴露',
  },
  {
    score: 10,
    label: '连续暴露',
  },
  {
    score: 10,
    label: '连续暴露',
  },
];

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
  };

  componentDidMount () {
    const { dispatch } = this.props;
    // 获取易导致的事故类型字典
    dispatch({
      type: 'riskPointManage/fetchAccidentTypeDict',
    });
    // 获取风险标志字典
    this.fetchPointLabel();
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

  render () {
    const {
      signLoading,
      match: { params: { id } },
      form: { getFieldDecorator, setFieldsValue, getFieldsValue },
      riskPointManage: {
        accidentTypeDict: { list: accidentTypeList = [] },
        warningSignDict: { list: signList = [] },
      },
    } = this.props;
    const {
      signVisible,
      selectedSignList,
      signUploadList,
    } = this.state;

    const { l } = getFieldsValue();
    const isDetail = /view/.test(location.href);
    const title = (/add/.test(location.href) && '新增评价记录') || (/edit/.test(location.href) && '编辑评价记录') || (/view/.test(location.href) && '查看评价记录');
    const BREADCRUMB_LIST = [
      { title: '首页', name: '首页', href: '/' },
      { title: '风险分级管控', name: '风险分级管控' },
      { title: listTitlt, name: listTitlt },
      { title: recordTitlt, name: recordTitlt, href: `` },
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
          <Form>
            <FormItem label="评估项目" {...formItemLayout}>
              {getFieldDecorator('evaluateProject', {
                rules: [{ required: true, message: '请输入评估项目' }],
              })(<Input.TextArea rows={3} {...itemStyles} />)}
            </FormItem>
            <FormItem label="主要危险因素（人、物、作业环境、管理）" {...formItemLayout}>
              {getFieldDecorator('majorHidden', {
                rules: [{ required: true, message: '请输主要危险因素（人、物、作业环境、管理）' }],
              })(<Input.TextArea rows={3} {...itemStyles} />)}
            </FormItem>
            <FormItem label="可能发生的事故类型及后果" {...formItemLayout}>
              {getFieldDecorator('hiddenTypeResult', {
                rules: [{ required: true, message: '请输入可能发生的事故类型及后果' }],
              })(
                <Select
                  mode="multiple"
                  placeholder="请选择可能发生的事故类型及后果"
                  onChange={this.onHiddenTypeChange}
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
            <FormItem label="风险管控措施" {...formItemLayout}>
              {getFieldDecorator('riskMeasures', {
                rules: [{ required: true, message: '请输入风险管控措施' }],
                initialValue: '工程技术措施：\n 管理措施：\n 培训教育措施： \n 应急处置措施：',
              })(<Input.TextArea rows={5} {...itemStyles} />)}
            </FormItem>
            <FormItem label="应急处置措施" {...formItemLayout}>
              {getFieldDecorator('emergencyMeasures', {
                rules: [{ required: true, message: '请输入应急处置措施' }],
              })(<Input.TextArea rows={5} {...itemStyles} />)}
            </FormItem>
            <FormItem label="现场图片" {...formItemLayout}>
              {getFieldDecorator('scenePhotoList')(
                <CustomUpload folder={folder} type={isDetail ? 'span' : 'select'} />
              )}
            </FormItem>
            <FormItem label="警示标志" {...formItemLayout}>
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
              <Row style={{ marginBottom: '10px' }}>
                <Button type="primary" onClick={() => this.setState({ signVisible: true })}><PlusOutlined />选择国际标志</Button>
              </Row>
              <Row>
                {getFieldDecorator('warnSign')(
                  <Upload
                    name="files"
                    headers={{ 'JA-Token': getToken() }}
                    data={{ folder }} // 附带的参数
                    action={uploadAction} // 上传地址
                    fileList={signUploadList}
                    onChange={this.onSignUploadChange}
                  >
                    <Button type="primary"><DownloadOutlined />自定义上传</Button>
                  </Upload>
                )}
              </Row>
            </FormItem>
            <h2 style={{ textAlign: 'center' }}>风险分析方法： LEC</h2>
            <FormItem label="事件发生可能性（L）" {...formItemLayout}>
              {getFieldDecorator('l')(
                <Table
                  rowKey="score"
                  dataSource={lList}
                  pagination={false}
                  columns={eventPossibilityColumns}
                  bordered
                  rowSelection={{
                    selectedRowKeys: l,
                    type: 'radio',
                    onSelect: ({ score }) => {
                      setFieldsValue({ l: [score] });
                    },
                  }}
                />
              )}
            </FormItem>
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
