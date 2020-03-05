import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Form, Icon as LegacyIcon } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Input, Button, Card, Col, Row, Select, Upload, message } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import { getToken } from 'utils/authority';
import SignModal from './SignModal';
import styles from './RiskPointEdit.less';

const { TextArea } = Input;
const { Option } = Select;
// const PageSize = 10;

/* 标题---编辑 */
const editTitle = '编辑告知卡';
/* 标题---新增 */
const addTitle = '新增告知卡';

// 上传文件地址
const uploadAction = '/acloud_new/v2/uploadFile';

// 上传文件夹
const folder = 'riskInfo';
const UploadIcon = <LegacyIcon type="upload" />;

/* 表单标签 */
const fieldLabels = {
  letterName: '告知卡名称：',
  areaName: '场所/环节/部位名称：',
  riskType: '风险分类：',
  accidentTypeCode: '易导致的事故类型：',
  dangerFactor: '主要危险因素：',
  preventMeasures: '风险管控措施：',
  emergencyMeasures: '应急处置措施：',
  localPictureList: '现场图片：',
  warningSignList: '警示标志：',
};

// 获取root下的div
const getRootChild = () => document.querySelector('#root>div');

@connect(({ riskPointManage, user, loading }) => ({
  riskPointManage,
  user,
  loading: loading.models.riskPointManage,
}))
@Form.create()
export default class RiskPointEdit extends PureComponent {
  state = {
    emergencyList: '', // 当前应急处置措施
    picList: [], // 当前国际标志列表
    signId: '',
    typeId: '',
    signVisible: false,
    picUploadList: [], // 图片上传列表
    picCustomList: [],
    uploading: false, // 文件上传状态
    isSelected: false,
  };

  // 挂载后
  componentDidMount() {
    const {
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;
    // 获取风险分类字典
    dispatch({
      type: 'riskPointManage/fetchRiskTypeDict',
    });
    // 获取易导致的事故类型字典
    dispatch({
      type: 'riskPointManage/fetchAccidentTypeDict',
    });
    // 如果存在Id，则为编辑，否则为新增
    if (id) {
      // 获取详情
      dispatch({
        type: 'riskPointManage/fetchHdLetterDetail',
        payload: {
          id,
        },
        callback: ({ localPictureList, warningSignList, emergencyMeasures }) => {
          const localPicture = localPictureList ? localPictureList : [];
          const warningSign = warningSignList ? warningSignList : [];
          this.setState({
            picUploadList: localPicture.map(({ dbUrl, webUrl }, index) => ({
              uid: index,
              status: 'done',
              name: `照片${index + 1}`,
              url: webUrl,
              dbUrl,
            })),
            picList: warningSign,
            emergencyList: emergencyMeasures,
          });
        },
      });
    } else {
      // 清空详情
      dispatch({
        type: 'riskPointManage/clearHdLetterDetail',
      });
    }

    // 获取风险标志字典
    this.fetchPointLabel();
  }

  /* 去除左右两边空白 */
  handleTrim = e => e.target.value.trim();

  // 返回到列表页面
  goBack = () => {
    const {
      dispatch,
      location: {
        query: { companyId, companyName, itemId },
      },
    } = this.props;
    dispatch(
      routerRedux.push(
        `/risk-control/risk-point-manage/risk-card-list/${itemId}?companyName=${companyName}&companyId=${companyId}`
      )
    );
  };

  // 提交
  handleClickValidate = () => {
    const {
      form: { validateFieldsAndScroll },
      match: {
        params: { id },
      },
      dispatch,
      location: {
        query: { companyId, itemId },
      },
    } = this.props;

    const { picList, emergencyList, picUploadList } = this.state;

    validateFieldsAndScroll((error, values) => {
      if (!error) {
        this.setState({
          submitting: true,
        });
        const {
          letterName,
          areaName,
          riskType,
          accidentTypeCode,
          dangerFactor,
          preventMeasures,
        } = values;

        const payload = {
          id,
          itemId,
          companyId,
          letterName,
          areaName,
          dangerFactor,
          preventMeasures,
          riskType,
          accidentTypeCode: accidentTypeCode.join(','),
          emergencyMeasures: emergencyList,
          localPictureList: picUploadList,
          warningSignList: picList.map(({ signName, signUrl, dbUrl, webUrl }) => ({
            fileName: signName,
            dbUrl: signUrl || dbUrl,
            webUrl,
          })),
        };
        const success = () => {
          const msg = id ? '编辑成功' : '新增成功';
          message.success(msg, 1, this.goBack());
        };
        const error = () => {
          const msg = id ? '修改失败' : '新增失败';
          message.error(msg, 1);
          this.setState({
            submitting: false,
          });
        };
        // 如果id存在的话，为编辑
        if (id) {
          dispatch({
            type: 'riskPointManage/fetchHdLetterEdit',
            payload: {
              ...payload,
            },
            success,
            error,
          });
        }
        // 不存在id,则为新增
        else {
          dispatch({
            type: 'riskPointManage/fetchHdLetterAdd',
            payload,
            success,
            error,
          });
        }
      }
    });
  };

  // 获取应急措施和图标
  handleAccidentList = id => {
    const {
      riskPointManage: {
        accidentTypeDict: { list = [] },
      },
    } = this.props;
    const emergencyList = list
      .filter(item => id.indexOf(item.typeId) >= 0)
      .map(item => item.typeName + ':' + item.emergencyMeasure);

    const picList = list
      .filter(item => id.indexOf(item.typeId) >= 0)
      .map(item => item.warningSignInfos);

    const newPicList = picList.map(item => {
      let obj = {};
      for (const key in item) {
        if (item.hasOwnProperty(key)) {
          const element = item[key];
          obj = { ...element };
        }
      }
      return obj;
    });

    this.setState({ emergencyList: emergencyList.join('\n'), picList: newPicList });
  };

  // 删除标志
  handleSignDelete = index => {
    const picList = [...this.state.picList];
    this.setState({
      picList: picList.filter((item, i) => {
        return i !== index;
      }),
    });
  };

  // 显示国际标志模态框
  handlePicModal = () => {
    this.setState({ signVisible: true });
  };

  // 关闭标志模态框
  handleSignClose = () => {
    this.setState({ signVisible: false });
  };

  // 获取标志字典
  fetchPointLabel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'riskPointManage/fetchWarningSignDict',
    });
  };

  // 确定标志
  handleSignSelect = selectedImgs => {
    this.setState({ picList: selectedImgs });
    this.handleSignClose();
  };

  // 自定义上传标志
  handleCustomChange = ({ file, fileList }) => {
    if (file.status === 'uploading') {
      this.setState({
        picCustomList: fileList,
        uploading: true,
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
            picCustomList: fileList.map(item => {
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
            picList: [
              ...this.state.picList,
              {
                webUrl: result.webUrl,
                dbUrl: result.dbUrl,
                fileName: result.name,
              },
            ],
            picCustomList: [],
          });
        }
      } else {
        // code为500
        message.error('上传失败！');
        this.setState({
          picCustomList: fileList.filter(item => {
            return !item.response || item.response.code !== 200;
          }),
        });
      }
      this.setState({
        uploading: false,
      });
    }
  };

  // 渲染标志模态框
  renderSignModal() {
    const {
      loading,
      riskPointManage: {
        warningSignDict: { list = [] },
      },
    } = this.props;
    const { signVisible, isSelected, picList } = this.state;

    const setField = [
      {
        id: 'fileName',
        render() {
          return <Input placeholder="请输入标志名称" />;
        },
      },
    ];
    return (
      <SignModal
        title="选择标志"
        loading={loading}
        visible={signVisible}
        list={list}
        isSelected={isSelected}
        selectedList={picList}
        fetch={this.fetchPointLabel}
        handleSelect={this.handleSignSelect}
        onClose={this.handleSignClose}
        field={setField}
      />
    );
  }

  // 处理现场图片上传
  handlePicChange = ({ file, fileList }) => {
    if (file.status === 'uploading') {
      this.setState({
        picUploadList: fileList,
        uploading: true,
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
            picUploadList: fileList.map(item => {
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
        } else {
          // 没有返回值
          message.error('上传失败！');
          this.setState({
            picUploadList: fileList.filter(item => {
              return !item.response || item.response.data.list.length !== 0;
            }),
          });
        }
      } else {
        // code为500
        message.error('上传失败！');
        this.setState({
          picUploadList: fileList.filter(item => {
            return !item.response || item.response.code !== 200;
          }),
        });
      }
      this.setState({
        uploading: false,
      });
    } else if (file.status === 'removed') {
      // 删除
      this.setState({
        picUploadList: fileList.filter(item => {
          return item.status !== 'removed';
        }),
        uploading: false,
      });
    } else {
      // error
      message.error('上传失败！');
      this.setState({
        picUploadList: fileList.filter(item => {
          return item.status !== 'error';
        }),
        uploading: false,
      });
    }
  };

  // 渲染信息
  renderInfo() {
    const {
      form: { getFieldDecorator },
      riskPointManage: {
        riskTypeDict,
        accidentTypeDict: { list = [] },
        detailHdLetter: { data = {} },
      },
      match: {
        params: { id },
      },
    } = this.props;

    const { emergencyList, picUploadList, picCustomList, picList } = this.state;

    return (
      <Card className={styles.card} bordered={false}>
        <Form layout="vertical">
          <Row gutter={{ lg: 24, md: 12 }} style={{ position: 'relative' }}>
            <Col span={24}>
              <Row gutter={12}>
                <Col span={8}>
                  <Form.Item label={fieldLabels.letterName}>
                    {getFieldDecorator('letterName', {
                      initialValue: data.letterName,
                      getValueFromEvent: this.handleTrim,
                      rules: [{ required: true, message: '请输入告知卡名称' }],
                    })(<Input placeholder="请输入告知卡名称" />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label={fieldLabels.areaName}>
                    {getFieldDecorator('areaName', {
                      initialValue: data.areaName,
                      getValueFromEvent: this.handleTrim,
                      rules: [{ required: true, message: '请输入场所/环节/部位名称' }],
                    })(<Input placeholder="请输入场所/环节/部位名称" />)}
                  </Form.Item>
                </Col>
              </Row>
            </Col>
            <Col span={24}>
              <Row gutter={12}>
                <Col span={8}>
                  {id ? (
                    <Form.Item label={fieldLabels.riskType}>
                      {getFieldDecorator('riskType', {
                        initialValue: +data.riskType,
                        rules: [{ required: true, message: '请选择风险分类' }],
                      })(
                        <Select
                          allowClear
                          getPopupContainer={getRootChild}
                          placeholder="请选择风险分类"
                        >
                          {riskTypeDict.map(({ value, desc }) => (
                            <Option value={value} key={value}>
                              {desc}
                            </Option>
                          ))}
                        </Select>
                      )}
                    </Form.Item>
                  ) : (
                    <Form.Item label={fieldLabels.riskType}>
                      {getFieldDecorator('riskType', {
                        rules: [{ required: true, message: '请选择风险分类' }],
                      })(
                        <Select
                          allowClear
                          getPopupContainer={getRootChild}
                          placeholder="请选择风险分类"
                        >
                          {riskTypeDict.map(({ value, desc }) => (
                            <Option value={value} key={value}>
                              {desc}
                            </Option>
                          ))}
                        </Select>
                      )}
                    </Form.Item>
                  )}
                </Col>
                <Col span={8}>
                  <Form.Item label={fieldLabels.accidentTypeCode}>
                    {getFieldDecorator('accidentTypeCode', {
                      initialValue: data.accidentTypeCode && data.accidentTypeCode.split(','),
                      rules: [{ required: true, message: '请选择易导致的事故类型' }],
                    })(
                      <Select
                        mode="multiple"
                        placeholder="请选择易导致的事故类型"
                        onChange={this.handleAccidentList}
                      >
                        {list.map(({ typeId, typeName }) => (
                          <Option value={typeId} key={typeId}>
                            {typeName}
                          </Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </Col>
            <Col span={24}>
              <Row gutter={12}>
                <Col span={16}>
                  <Form.Item label={fieldLabels.dangerFactor}>
                    {getFieldDecorator('dangerFactor', {
                      initialValue: data.dangerFactor,
                      getValueFromEvent: this.handleTrim,
                      rules: [{ message: '请输入主要危险因素' }],
                    })(<TextArea rows={3} placeholder="请输入主要危险因素" maxLength="2000" />)}
                  </Form.Item>
                </Col>
              </Row>
            </Col>
            <Col span={24}>
              <Row gutter={12}>
                <Col span={16}>
                  <Form.Item label={fieldLabels.preventMeasures}>
                    {getFieldDecorator('preventMeasures', {
                      initialValue: data.preventMeasures,
                      getValueFromEvent: this.handleTrim,
                      rules: [{ message: '请输入风险管控措施' }],
                    })(<TextArea rows={5} placeholder="请输入风险管控措施" maxLength="2000" />)}
                  </Form.Item>
                </Col>
              </Row>
            </Col>
            <Col span={24}>
              <Row gutter={12}>
                <Col span={16}>
                  <Form.Item label={fieldLabels.emergencyMeasures}>
                    {getFieldDecorator('emergencyMeasures', {
                      initialValue: emergencyList,
                      rules: [{ message: '应急处置措施' }],
                    })(<TextArea rows={10} placeholder="应急处置措施" maxLength="2000" />)}
                  </Form.Item>
                </Col>
              </Row>
            </Col>
            <Col span={24}>
              <Row gutter={12}>
                <Col span={8}>
                  <Form.Item label={fieldLabels.localPictureList}>
                    {getFieldDecorator('localPictureList', {
                      initialValue: data.localPictureList,
                    })(
                      <Upload
                        name="files"
                        accept=".jpg,.png" // 接受的文件格式
                        headers={{ 'JA-Token': getToken() }} // 上传的请求头部
                        data={{ folder }} // 附带的参数
                        action={uploadAction} // 上传地址
                        fileList={picUploadList}
                        onChange={this.handlePicChange}
                      >
                        <Button type="primary">
                          {UploadIcon}
                          选择图片
                        </Button>
                      </Upload>
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </Col>
            <Col span={24}>
              <Row gutter={12}>
                <Col span={16}>
                  <Form.Item label={fieldLabels.warningSignList}>
                    {getFieldDecorator('warningSignList', {
                      initialValue: picList,
                    })(
                      <div>
                        {picList.map((item, index) => {
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
                      </div>
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </Col>
            <Col span={24}>
              <Row gutter={12}>
                <Col span={16}>
                  <Button type="primary" onClick={this.handlePicModal} style={{ marginBottom: 10 }}>
                    <LegacyIcon type="plus" />
                    选择国际标志
                  </Button>
                </Col>
              </Row>
            </Col>
            <Col span={24}>
              <Form.Item>
                {getFieldDecorator('floorUrl')(
                  <Upload
                    name="files"
                    headers={{ 'JA-Token': getToken() }}
                    data={{ folder }} // 附带的参数
                    action={uploadAction} // 上传地址
                    fileList={picCustomList}
                    onChange={this.handleCustomChange}
                  >
                    <Button type="primary">
                      {UploadIcon}
                      自定义上传
                    </Button>
                  </Upload>
                )}
              </Form.Item>
            </Col>
          </Row>
        </Form>

        <div style={{ marginTop: 30 }}>
          <Button size="large" type="primary" onClick={this.handleClickValidate}>
            提交
          </Button>
          <Button size="large" style={{ marginLeft: '20px' }} onClick={this.goBack}>
            返回
          </Button>
        </div>
      </Card>
    );
  }

  // 渲染页面所有信息
  render() {
    const {
      match: {
        params: { id },
      },
      location: {
        query: { companyId, companyName, itemId },
      },
    } = this.props;

    const title = id ? editTitle : addTitle;

    // 面包屑
    const breadcrumbList = [
      { title: '首页', name: '首页', href: '/' },
      {
        title: '单位风险点',
        name: '单位风险点',
        href: `/risk-control/risk-point-manage/risk-point-List/${companyId}?companyId=${companyId}&&companyName=${companyName}`,
      },
      {
        title: '风险告知卡',
        name: '风险告知卡',
        href: `/risk-control/risk-point-manage/risk-card-list/${itemId}?companyName=${companyName}&companyId=${companyId}`,
      },
      {
        title,
        name: title,
      },
    ];

    return (
      <PageHeaderLayout title={title} breadcrumbList={breadcrumbList}>
        {this.renderInfo()}
        {this.renderSignModal()}
      </PageHeaderLayout>
    );
  }
}
