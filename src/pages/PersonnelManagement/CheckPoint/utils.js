import router from 'umi/router';
import Link from 'umi/link';
import { Icon, message } from 'antd';

export const FOLDER = 'checkPoints';
export const UPLOAD_ACTION = '/acloud_new/v2/uploadFile';

export const CARDS = ['单双色控制卡', '多彩控制卡', '全彩控制卡'];
export const TABS = ['卡口点位', '卡口设备', '显示屏'];
export const TAB_LIST = TABS.map((tab, index) => ({ key: index.toString(), tab }));
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

export function genOperateCallback(companyId, index) {
  return function (code, msg) {
    if (code === 200) {
      message.success('操作成功！');
      router.push(`/personnel-management/check-point/list/${companyId}/${index}`);
    } else
    message.error(msg);
  };
}

export function genListLink(companyId, index) {
  return ['查看', '编辑', '删除'].map(label => <Link to={``}>{label}</Link>);
}
