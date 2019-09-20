import router from 'umi/router';
import Link from 'umi/link';
import { Icon, message } from 'antd';

export const FOLDER = 'checkPoints';
export const UPLOAD_ACTION = '/acloud_new/v2/uploadFile';

export const CARDS = ['单双色控制卡', '多彩控制卡', '全彩控制卡'];
export const TABS = ['卡口点位', '卡口设备', '显示屏'];
export const TAB_LIST = TABS.map((tab, index) => ({ key: index.toString(), tab }));
export const POINT_INDEX = 0;
export const EQUIPMENT_INDEX = 1;
export const SCREEN_INDEX = 2;
export const FORMITEM_LAYOUT = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
};

const LOCATION_LABELS = ['Province', 'City', 'District', 'Town', 'Address'];
export function getAddress(item) {
  return LOCATION_LABELS.reduce((prev, next) => `${prev}${item[`practical${next}`] || ''}`, '');
}

export function clearSpace(e) {
  return e.target.value.replace(/\s/g, '');
}

export function getFieldDecConfig(msg, required=true) {
  return {
    getValueFromEvent: clearSpace,
    validateTrigger: 'onBlur',
    rules: [{ required, whitespace: true, message: msg }],
  };
}

export function UploadButton(props) {
  return (
    <div>
      <Icon type="plus" />
      <div className="ant-upload-text">上传</div>
    </div>
  )
}

export function uploadConvertToOrigin(list) {
  return list.map(({ id, dbUrl, webUrl, fileName }, index) => ({
    uid: id || index,
    status: 'done',
    name: fileName,
    url: webUrl,
    dbUrl,
  }));
}

export function uploadConvertToResult(list) {
  return list.map(({ name, url, dbUrl }) => ({ fileName: name, webUrl: url, dbUrl }));
}

export function genOperateCallback(url) {
  return function (code, msg) {
    if (code === 200) {
      message.success('操作成功！');
      url && router.push(url);
    } else
    message.error(msg);
  };
}

export function genListLink(dispatch, companyId, index, id) {
  return [
    <Link to={`/personnel-management/check-point/detail/${companyId}/${index}/${id}`}>查看</Link>,
    <Link to={`/personnel-management/check-point/edit/${companyId}/${index}/${id}`}>编辑</Link>,
    <span onClick={e => {
      dispatch({
        index,
        type: 'checkPoint/deleteCheckPoint',
        callback: genOperateCallback(),
      });
    }}>删除</span>,
  ];
}

const PROPS = [
  ['name', 'location', 'direction', 'bayonetEquipmentList', 'photoList'],
  ['name', 'code', 'number', 'area', 'location', 'status'],
  ['name', 'pointId', 'code', 'ipAddress', 'portNumber', 'controllerCardType', 'modelType', 'modelNumber', 'status'],
]

export function initFormValues(values, index) {
  return PROPS[index].reduce((prev, next) => {
    const v = values[next];
    if (next === 'status')
      prev[next] = !!+v;
    else
      prev[next] = v;
    return prev;
  }, {});
}
