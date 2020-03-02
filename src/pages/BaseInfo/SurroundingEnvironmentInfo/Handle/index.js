import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Button, Card, Form, message, Tooltip, Icon, Input, Divider, Upload } from 'antd';

import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import { renderSections } from '@/pages/SafetyKnowledgeBase/MSDS/utils';
import { handleDetails, BREADCRUMBLIST, LIST_URL, envirType } from '../Other/utils';
import { getFileList } from '@/pages/BaseInfo/utils';
import { getToken } from '@/utils/authority';
import { isCompanyUser } from '@/pages/RoleAuthorization/Role/utils';
import styles from '@/pages/CardsInfo/EmergencyCard/TableList.less';
import { phoneReg, emailReg } from '@/utils/validate';
// import { hasAuthority } from '@/utils/customAuth';
import MapModal from '@/components/MapModal';
// import codes from '@/utils/codes';
import style from './index.less';

// 权限
// const {
//   baseInfo: {
//     surroundingEnvironmentInfo: { edit: editCode },
//   },
// } = codes;

const FOLDER = 'envirInfo';
const uploadAction = '/acloud_new/v2/uploadFile';

// 默认经纬度坐标
const defaultPosition = { longitude: 120.3, latitude: 31.57 };

@connect(({ user, surroundEnvirInfo, loading }) => ({
  user,
  surroundEnvirInfo,
  loading: loading.models.surroundEnvirInfo,
}))
@Form.create()
export default class Edit extends PureComponent {
  state = {
    areaCode: '', // 区号
    fixedPhone: '', // 固定电话
    photoList: [], // 上传照片
    map: {
      // 地图参数
      visible: false,
      center: undefined,
      point: undefined,
    },
    fileLoading: false,
  };

  componentDidMount() {
    const {
      match: {
        params: { id },
      },
      form: { setFieldsValue },
      user: {
        currentUser: { unitType, companyId, companyName },
      },
    } = this.props;
    if (id) this.getDetail(id);
    else if (isCompanyUser(+unitType)) {
      setFieldsValue({ companyId: { key: companyId, label: companyName } });
    }
  }

  getDetail = id => {
    const {
      dispatch,
      form: { setFieldsValue },
    } = this.props;
    dispatch({
      type: 'surroundEnvirInfo/fetchEnvirDetail',
      payload: { id },
      callback: detail => {
        const { photoList, areaCode, telNumber } = detail;
        const det = { ...detail };
        const list = Array.isArray(photoList)
          ? photoList.map(({ id, fileName, webUrl, dbUrl }) => ({
              uid: id,
              name: fileName,
              url: webUrl,
              dbUrl,
            }))
          : [];
        det.photo = list.length ? { fileList: list } : null;
        setFieldsValue(handleDetails(det));
        this.setState({
          photoList: list,
          areaCode,
          fixedPhone: telNumber,
        });
      },
    });
  };

  handleSubmit = e => {
    const {
      dispatch,
      form: { validateFields },
      match: {
        params: { id },
      },
    } = this.props;
    const { photoList, areaCode, fixedPhone } = this.state;

    e.preventDefault();
    validateFields((errors, values) => {
      if (errors) return;
      const {
        companyId,
        environmentType,
        environmentName,
        environmentBear,
        minSpace,
        buildStructure,
        buildHeight,
        perNumber,
        contact,
        contactPhone,
        contactMail,
        coordinate,
        note,
      } = values;
      const [longitude, latitude] = coordinate ? coordinate.split(',') : [];
      const vals = {
        companyId: companyId.key,
        environmentType,
        environmentName,
        environmentBear,
        minSpace,
        buildStructure,
        buildHeight,
        perNumber,
        contact,
        areaCode,
        telNumber: fixedPhone,
        contactPhone,
        contactMail,
        longitude,
        latitude,
        note,
        photoList: photoList.map(({ uid, name, url, dbUrl }) => ({
          id: uid,
          fileName: name,
          webUrl: url,
          dbUrl,
        })),
      };

      const success = () => {
        const msg = id ? '编辑成功' : '新增成功';
        message.success(msg, 1);
        router.push(LIST_URL);
      };

      const error = () => {
        const msg = id ? '编辑失败' : '新增失败';
        message.error(msg, 1);
      };

      dispatch({
        type: `surroundEnvirInfo/fetchEnvirInfo${id ? 'Edit' : 'Add'}`,
        payload: id ? { id, ...vals } : vals,
        success,
        error,
      });
    });
  };

  //   isDetail = () => {
  //     const {
  //       match: { url },
  //     } = this.props;
  //     return url && url.includes('detail');
  //   };

  handleUploadPhoto = info => {
    const {
      form: { setFieldsValue },
    } = this.props;
    const { fileList: fList, file } = info;
    let fileList = [...fList];
    if (file.status === 'uploading') {
      this.setState({ fileLoading: true });
    }
    if (file.status === 'done') {
      this.setState({ fileLoading: false });
    }
    if (file.status === undefined)
      // file.status === undefined 为文件被beforeUpload拦截下拉的情况
      fileList.pop();
    fileList = getFileList(fileList);
    this.setState({ photoList: fileList });
    setFieldsValue({ photo: fileList.length ? { fileList } : null });
  };

  handleBeforeUpload = file => {
    const { type } = file;
    const isImage = ['image/jpeg', 'image/png'].includes(type);
    if (!isImage) message.error('请上传图片格式(jpg, png)的附件！');
    return isImage;
  };

  /*获取区号*/
  handleAreaCodeChange = event => {
    this.setState({ areaCode: event.target.value });
  };

  /**获取固定电话 */
  handleFixedPhoneChange = event => {
    this.setState({ fixedPhone: event.target.value });
  };
  /**从表单中个获取经纬度 */
  getCoordinateFromInput = () => {
    const {
      form: { getFieldValue },
    } = this.props;
    // 获取坐标，值可能为undefined或"135.12123,141.4142"这样的格式
    const coordinate = getFieldValue('coordinate');
    const temp = coordinate && coordinate.split(',');
    return temp && { longitude: +temp[0], latitude: +temp[1] };
  };

  /**显示地图 */
  handleShowMap = () => {
    const coord = this.getCoordinateFromInput();
    this.setState(({ map }) => ({
      map: {
        visible: true,
        center: coord,
        point: coord,
      },
    }));
  };

  /**隐藏地图 */
  handleHideMap = () => {
    this.setState(({ map }) => ({
      map: {
        ...map,
        visible: false,
      },
    }));
  };

  /**确定选中的地图点坐标 */
  handleConfirmPoint = () => {
    const {
      form: { setFieldsValue },
    } = this.props;
    const {
      map: {
        point: { longitude, latitude },
      },
    } = this.state;
    // 将选中点的坐标放入输入框
    setFieldsValue({ coordinate: `${longitude},${latitude}` });
    // 隐藏地图模态框
    this.handleHideMap();
  };

  /**重置地图 */
  handleResetMap = () => {
    const coord = this.getCoordinateFromInput();
    this.setState(({ map }) => ({
      map: {
        ...map,
        center: coord,
        point: coord,
      },
    }));
  };

  /** 搜索地图 */
  handleSearchMap = point => {
    this.setState(({ map }) => ({
      map: {
        ...map,
        center: point,
        point,
      },
    }));
  };

  /**点击地图 */
  handleClickMap = point => {
    this.setState(({ map }) => ({
      map: {
        ...map,
        point,
      },
    }));
  };

  /** 复制经纬度 */
  handleCopyCoordinate = () => {
    const {
      form: { getFieldValue },
    } = this.props;
    const coordinate = getFieldValue('coordinate');
    if (!coordinate) {
      message.warning('请先选择经纬度');
      return;
    }
    this.coordinate.select();
    if (document.execCommand('copy')) {
      document.execCommand('copy');
      message.success('复制成功');
    }
    this.coordinate.blur();
  };

  /* 渲染地图 */
  renderMap() {
    const {
      map: { visible, center = defaultPosition, point },
    } = this.state;

    return (
      <MapModal
        center={center}
        point={point}
        visible={visible}
        onOk={this.handleConfirmPoint}
        onCancel={this.handleHideMap}
        onReset={this.handleResetMap}
        onSearch={this.handleSearchMap}
        onClick={this.handleClickMap}
      />
    );
  }

  render() {
    const {
      loading,
      match: {
        params: { id },
      },
      form: { getFieldDecorator },
      user: {
        currentUser: { permissionCodes, unitType },
      },
    } = this.props;

    const { photoList, areaCode, fixedPhone, fileLoading } = this.state;
    // const editAuth = hasAuthority(editCode, permissionCodes);

    // const isDet = this.isDetail();
    const title = id ? '编辑' : '新增';
    const breadcrumbList = Array.from(BREADCRUMBLIST);
    breadcrumbList.push({ title, name: title });
    const handleSubmit = this.handleSubmit;
    const isComUser = isCompanyUser(+unitType);

    const uploadBtn = (
      <Upload
        name="files"
        data={{ folder: FOLDER }}
        action={uploadAction}
        fileList={photoList}
        beforeUpload={this.handleBeforeUpload}
        onChange={this.handleUploadPhoto}
        headers={{ 'JA-Token': getToken() }}
      >
        <Button type="primary">点击上传</Button>
      </Upload>
    );

    const formItems = [
      {
        name: 'companyId',
        label: '单位名称',
        type: 'companyselect',
        disabled: isComUser,
        wrapperClassName: isComUser ? styles.disappear : undefined,
      },
      {
        name: 'environmentType',
        label: '周边环境类型',
        type: 'select',
        options: envirType,
      },
      { name: 'environmentName', label: '周边环境名称' },
      { name: 'environmentBear', label: '周边环境方位' },
      { name: 'minSpace', label: '与本企业最小距离(m)' },
      { name: 'buildStructure', label: '建筑结构', required: false },
      { name: 'buildHeight', label: '相邻建筑高度(m)', required: false },
      { name: 'perNumber', label: '人员数量' },
      { name: 'contact', label: '联系人' },
      {
        name: 'contactTel',
        label: '联系人固定电话',
        required: false,
        type: 'compt',
        component: (
          <div className={style.mutil}>
            <Input
              value={areaCode}
              placeholder="区号"
              className={style.itemF}
              onChange={this.handleAreaCodeChange}
            />
            <span className={style.itemS}>
              <Divider />
            </span>
            <Input
              value={fixedPhone}
              placeholder="电话号码"
              className={style.itemT}
              onChange={this.handleFixedPhoneChange}
            />
          </div>
        ),
      },
      {
        name: 'contactPhone',
        label: '联系人移动电话',
        phoneRule: true,
      },
      {
        name: 'contactMail',
        label: '联系人电子邮箱',
        rules: [{ pattern: emailReg, message: '格式不正确' }],
        emailRule: true,
        required: false,
      },
      {
        name: 'coordinate',
        label: ' 经纬度',
        type: 'compt',
        component: (
          <Input
            ref={coordinate => {
              this.coordinate = coordinate;
            }}
            placeholder="请选择经纬度"
            addonAfter={
              <Fragment>
                <Tooltip title="复制">
                  <Icon
                    type="copy"
                    style={{ marginRight: '10px' }}
                    onClick={this.handleCopyCoordinate}
                  />
                </Tooltip>
                <Tooltip title="打开地图">
                  <Icon type="environment" onClick={this.handleShowMap} />
                </Tooltip>
              </Fragment>
            }
          />
        ),
      },
      { name: 'note', label: '备注', required: false, type: 'text' },
      {
        name: 'photo',
        label: '相关照片',
        required: false,
        type: 'compt',
        component: uploadBtn,
      },
    ];

    return (
      <PageHeaderLayout title={title} breadcrumbList={breadcrumbList}>
        <Card style={{ marginBottom: 15 }}>
          {renderSections(
            formItems,
            getFieldDecorator,
            handleSubmit,
            LIST_URL,
            fileLoading,
            loading
          )}
        </Card>
        {this.renderMap()}
      </PageHeaderLayout>
    );
  }
}
