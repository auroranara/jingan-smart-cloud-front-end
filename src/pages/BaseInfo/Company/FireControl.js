import React, { PureComponent, Fragment } from 'react';
// import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Form, Icon as LegacyIcon } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { message, Button, Card, Col, Modal, Upload, Radio } from 'antd';
import { getToken } from 'utils/authority';
import Lightbox from 'react-images';

import {
  getNewCompanyType,
  getImportantTypes,
  PhotoStyles,
  getFileList,
  getImageSize,
} from '../utils';
import { getInitPhotoList as getInitFileList, getSubmitPhotoList as getSubmitFileList, handleFileList } from '@/pages/RoleAuthorization/AccountManagement/utils';
import urls from 'utils/urls';
import styles from './FireControl.less';

const { Item: FormItem } = Form;
const { Group: RadioGroup } = Radio;

// 上传文件地址
const uploadAction = '/acloud_new/v2/uploadFile';
// 上传文件夹
const folder = 'firecontrol';

@Form.create()
export default class FireControl extends PureComponent {
  state = {
    submitting: false,
    firePictureList: [],
    uploading: false,
    unitPhotoList: [],
    images: [],
    currentImage: 0,
    lightBoxVisible: false,
    fireFileList: [],
  };

  componentDidMount() {
    this.initImgs();
  }

  componentDidUpdate({ detail: prevDetail }) {
    const { detail } = this.props;
    if (JSON.stringify(detail) !== JSON.stringify(prevDetail)) {
      this.initImgs();
    }
  }

  initImgs = () => {
    const { detail } = this.props;
    const { fireIchnographyDetails, companyPhotoDetails, fireCheckFileList } = detail;
    const fireIchnographyList = Array.isArray(fireIchnographyDetails) ? fireIchnographyDetails : [];
    const unitPhotoList = Array.isArray(companyPhotoDetails) ? companyPhotoDetails : [];
    this.setState({
      firePictureList: fireIchnographyList.map(({ id, dbUrl, webUrl, fileName }, index) => ({
        uid: id || index,
        status: 'done',
        name: fileName,
        url: webUrl,
        dbUrl,
      })),
      unitPhotoList: unitPhotoList.map(({ id, dbUrl, webUrl, fileName }, index) => ({
        uid: id || index,
        status: 'done',
        name: fileName,
        url: webUrl,
        dbUrl,
      })),
      fireFileList: getInitFileList(fireCheckFileList),
    });
  };

  handleSubmit = e => {
    const {
      form: { validateFields },
      dispatch,
      companyId,
      detail: { companyType },
    } = this.props;
    e.preventDefault();
    validateFields((err, fieldsValue) => {
      // 获取到的为Option中的value
      const { operation } = this.props;
      const { firePictureList, unitPhotoList, fireFileList } = this.state;
      // 在添加页面安监信息都提示要新建企业基本信息后才能添加，当新建企业基本信息成功后，会询问是否添加安监信息，选择添加，则会跳转到编辑页面
      // 也就是说安监信息的添加修改都在编辑页面完成，添加页面的安监信息只是为了让人看下需要添加那些东西
      if (operation === 'add') {
        Modal.warning({
          title: '友情提示',
          content: '请在新建企业基本信息成功后，再添加消防信息',
        });
        return;
      }

      if (err) return;
      const { importantHost, photoStyle } = fieldsValue;
      const payload = {
        id: companyId,
        companyType: getNewCompanyType(companyType, importantHost),
        photoStyle,
        fireIchnography: JSON.stringify(
          firePictureList.map(({ name, url, dbUrl }) => ({
            fileName: name,
            webUrl: url,
            dbUrl,
          }))
        ),
        companyPhoto: JSON.stringify(
          unitPhotoList.map(({ name, url, dbUrl }) => ({ fileName: name, webUrl: url, dbUrl }))
        ),
        fireCheckFileList: getSubmitFileList(fireFileList),
      };
      this.setState({ submitting: true });
      // 成功回调
      const success = companyId => {
        const msg = '编辑成功！';
        message.success(msg, 1, () => {
          this.setState({ submitting: false });
          dispatch(routerRedux.push(urls.company.list));
        });
      };
      // 失败回调
      const error = msg => {
        message.error(msg);
        this.setState({
          submitting: false,
        });
      };
      dispatch({
        type: 'company/editCompany',
        payload,
        success,
        error,
      });
    });
  };

  /* 上传文件按钮 */
  renderUploadButton = (fileList, onChange, multiple = true, tips) => {
    const { uploading } = this.state;
    return (
      <Upload
        name="files"
        data={{
          folder,
        }}
        multiple={multiple}
        action={uploadAction}
        fileList={fileList}
        onChange={onChange}
        // beforeUpload={this.handleBeforeUploadUnitPhoto}
        headers={{ 'JA-Token': getToken() }}
        disabled={uploading}
      >
        <Button type="dashed" style={{ width: '96px', height: '96px' }}>
          <LegacyIcon type="plus" style={{ fontSize: '32px' }} />
          <div style={{ marginTop: '8px' }}>点击上传</div>
        </Button>
        {tips && (
          <span
            style={{ whiteSpace: 'nowrap', marginLeft: '25px' }}
            onClick={e => {
              e.stopPropagation();
              return null;
            }}
          >
            {tips}
          </span>
        )}
      </Upload>
    );
  };

  /* 上传消防平面图 */
  handleUploadfireIchnography = ({ fileList, file }) => {
    if (file.status === 'uploading') {
      this.setState({
        firePictureList: fileList,
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
          if (file.type !== 'image/png') {
            message.error('请上传png格式的图片');
            const files = fileList.slice(0, fileList.length - 1);
            this.setState({
              firePictureList: files.map(item => {
                if (!item.url && item.response) {
                  return {
                    ...item,
                    url: result.webUrl,
                    dbUrl: result.dbUrl,
                  };
                }
                return item;
              }),
              uploading: false,
            });
          } else {
            getImageSize(
              result.webUrl,
              isSatisfied => {
                let files = [...fileList];
                if (file.response.code === 200 && isSatisfied) {
                  files = [...fileList];
                  message.success('上传成功');
                } else {
                  message.error('上传的图片分辨率请不要大于3840*2160');
                  files = fileList.slice(0, fileList.length - 1);
                }
                this.setState({
                  firePictureList: files.map(item => {
                    if (!item.url && item.response) {
                      return {
                        ...item,
                        url: result.webUrl,
                        dbUrl: result.dbUrl,
                      };
                    }
                    return item;
                  }),
                  uploading: false,
                });
              },
              [3840, 2160]
            );
          }
        } else {
          // 没有返回值
          message.error('上传失败！');
          this.setState({
            firePictureList: fileList.filter(item => {
              return !item.response || item.response.data.list.length !== 0;
            }),
            uploading: false,
          });
        }
      } else {
        // code为500
        message.error('上传失败！');
        this.setState({
          firePictureList: fileList.filter(item => {
            return !item.response || item.response.code !== 200;
          }),
          uploading: false,
        });
      }
    } else if (file.status === 'removed') {
      // 删除
      this.setState({
        firePictureList: fileList.filter(item => {
          return item.status !== 'removed';
        }),
      });
    } else {
      // error
      message.error('上传失败！');
      this.setState({
        firePictureList: fileList.filter(item => {
          return item.status !== 'error';
        }),
        uploading: false,
      });
    }
  };

  handleUploadUnitPhoto = info => {
    // 限制一个文件，但有可能新文件上传失败，所以在新文件上传完成后判断，成功则只保留新的，失败，则保留原来的
    const { fileList: fList, file } = info;
    let fileList = [...fList];

    if (file.status === 'done') {
      // 上传完成后，查看图片大小
      const {
        response: {
          data: {
            list: [{ webUrl }],
          },
        },
      } = file;
      if (file.type !== 'image/png') {
        message.error('请上传png格式的图片');
        fileList.splice(-1, 1);
        fileList = getFileList(fileList);
        this.setState({ unitPhotoList: fileList, uploading: false });
      } else {
        getImageSize(
          webUrl,
          isSatisfied => {
            if (file.response.code === 200 && isSatisfied) {
              fileList = [file];
              message.success('上传成功');
            } else {
              message.error('上传的图片分辨率请不要大于240*320');
              fileList.splice(-1, 1);
            }
            fileList = getFileList(fileList);
            this.setState({ unitPhotoList: fileList, uploading: false });
          },
          [240, 320]
        );
      }
    } else {
      if (file.status === 'uploading') this.setState({ uploading: true });
      // 其他情况，直接用原文件数组
      fileList = getFileList(fileList);
      this.setState({ unitPhotoList: fileList });
    }
  };

  handleUploadFireFileList = info => {
    const { fileList, file } = info;
    let fList = fileList;
    if (file.status === 'done' || file.status === undefined){ // file.status === undefined 为文件被beforeUpload拦截下拉的情况
      fList = handleFileList(fileList);
    }

    this.setState({ fireFileList: fList });
  };

  renderFormItems = () => {
    const {
      form: { getFieldDecorator },
      detail: { companyType, photoStyle },
      operation,
    } = this.props;
    const { firePictureList, unitPhotoList, fireFileList } = this.state;
    const [importantHost] = getImportantTypes(companyType);
    return (
      <Fragment>
        <Col span={22} offset={1}>
          <FormItem
            label={'消防重点单位'}
            labelCol={{ xs: { span: 24 }, sm: { span: 4 } }}
            wrapperCol={{ xs: { span: 24 }, sm: { span: 20 } }}
          >
            {getFieldDecorator('importantHost', {
              initialValue: operation === 'add' ? '0' : importantHost,
              rules: [{ required: true, message: '请选择消防重点单位' }],
            })(
              <RadioGroup>
                <Radio value="1">是</Radio>
                <Radio value="0">否</Radio>
              </RadioGroup>
            )}
          </FormItem>
        </Col>
        <Col span={16} offset={1}>
          <Form.Item
            label={
              <span>
                消防平面图
                <span style={{ marginLeft: '25px' }}>（用于企业消防运营驾驶舱展示）</span>
              </span>
            }
          >
            {this.renderUploadButton(
              firePictureList,
              this.handleUploadfireIchnography,
              true,
              '尺寸限制：3840*2160（宽*高），png格式'
            )}
          </Form.Item>
        </Col>

        <Col span={22} offset={1}>
          <FormItem label={'若未上传消防平面图，企业消防运营驾驶舱底图可选现有风格'} colon={true}>
            {getFieldDecorator('photoStyle', { initialValue: photoStyle || undefined })(
              <RadioGroup>
                {PhotoStyles.map(item => {
                  const { value, name, urls } = item;
                  return (
                    <Radio value={value} key={value} style={{ width: 'calc( 25% - 8px )' }}>
                      {name}
                      <div
                        className={styles.stylesImg}
                        // onClick={() => {
                        //   this.handleShow([urls[1]]);
                        // }}
                      >
                        <img src={urls[1]} alt="" />
                      </div>
                      {/* <Button
                        type="link"
                        size={'small'}
                        className={styles.btnLink}
                        onClick={() => {
                          this.handleShow(urls);
                        }}
                      >
                        预览
                      </Button> */}
                    </Radio>
                  );
                })}
              </RadioGroup>
            )}
          </FormItem>
        </Col>
        {/* <Col span={22} offset={1} style={{ marginBottom: '24px' }}>
          消防运营驾驶舱中间图片显示逻辑：上传图>底图>无图（默认空）
        </Col> */}
        <Col span={16} offset={1}>
          <Form.Item
            label={
              <span>
                单位照片
                <span style={{ marginLeft: '25px' }}>（用于加油站驾驶舱展示）</span>
              </span>
            }
          >
            {this.renderUploadButton(
              unitPhotoList,
              this.handleUploadUnitPhoto,
              false,
              '尺寸限制：240*320（宽*高），png格式'
            )}
          </Form.Item>
        </Col>
        <Col span={16} offset={1}>
          <Form.Item label="消防验收报告">
            {this.renderUploadButton(
              fireFileList,
              this.handleUploadFireFileList,
              false,
            )}
          </Form.Item>
        </Col>
      </Fragment>
    );
  };

  /**
   * 显示图片详情
   */
  handleShow = images => {
    this.setState({ images, currentImage: 0, lightBoxVisible: true });
  };

  /**
   * 切换图片
   */
  handleSwitchImage = currentImage => {
    this.setState({
      currentImage,
    });
  };

  /**
   * 切换上一张图片
   */
  handlePrevImage = () => {
    this.setState(({ currentImage }) => ({
      currentImage: currentImage - 1,
    }));
  };

  /**
   * 切换下一张图片
   */
  handleNextImage = () => {
    this.setState(({ currentImage }) => ({
      currentImage: currentImage + 1,
    }));
  };

  /**
   * 关闭图片详情
   */
  handleClose = () => {
    this.setState({
      images: [],
      lightBoxVisible: false,
    });
  };

  render() {
    const { loading } = this.props;
    const { submitting, uploading, images, currentImage, lightBoxVisible } = this.state;

    return (
      <Card>
        <Form
          className={styles.form}
          onSubmit={this.handleSubmit}
          labelAlign={'left'}
          colon={false}
        >
          {this.renderFormItems()}
          <Col span={24}>
            <FormItem wrapperCol={{ xs: { span: 24, offset: 0 }, sm: { span: 13, offset: 11 } }}>
              <Button type="primary" htmlType="submit" loading={loading || submitting || uploading}>
                提交
              </Button>
            </FormItem>
          </Col>
          {/* <FooterToolbar>
              <Button
                type="primary"
                size="large"
                htmlType="submit"
                loading={loading || submitting}
              >
                提交
              </Button>
            </FooterToolbar> */}
          <Lightbox
            images={images.map(src => ({ src }))}
            isOpen={lightBoxVisible}
            closeButtonTitle="关闭"
            currentImage={currentImage}
            onClickPrev={this.handlePrevImage}
            onClickNext={this.handleNextImage}
            onClose={this.handleClose}
            onClickThumbnail={this.handleSwitchImage}
            showThumbnails
          />
        </Form>
      </Card>
    );
  }
}
