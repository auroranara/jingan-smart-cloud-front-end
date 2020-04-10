import React, { useState } from 'react';
import { Upload, Button, message, Modal } from 'antd';
import { Icon as LegacyIcon } from '@ant-design/compatible';
import FileList from '@/jingan-components/View/FileList';
import { getToken } from '@/utils/authority';
import styles from './index.less';

const FormUpload = ({
  value,
  onChange,
  limitLength,
  limitType,
  limitSize,
  mode,
  folder = 'file',
  listType,
  empty,
  ellipsis,
  ...rest
}) => {
  const [preview, setPreview] = useState({
    visible: false,
    image: undefined,
  });
  const handleChange = ({ fileList }) => {
    let list = fileList.reduce((result, item) => {
      const { uid, url, status, response, name } = item;
      if (status === 'uploading') {
        result.push(item);
      } else if (status === 'done') {
        if (url) {
          result.push(item);
        } else {
          const { webUrl, dbUrl, success, fileName } =
            (response && response.data && response.data.list && response.data.list[0]) || {};
          if (webUrl) {
            result.push({
              uid,
              name,
              url: webUrl,
              webUrl,
              dbUrl,
              status,
              fileName,
              success,
            });
          } else {
            message.error('上传失败，请稍后重试！');
          }
        }
      } else if (status === 'error') {
        message.error('上传失败，请稍后重试！');
      }
      return result;
    }, []);
    if (limitLength && list.length > limitLength) {
      list = list.slice(0, limitLength);
    }
    onChange && onChange(list);
  };
  const fileList = value || [];
  const handleBeforeUpload = file => {
    const hasType =
      limitType && limitType.length
        ? limitType.some(type => {
            let lowerCaseType = type.toLowerCase();
            if (lowerCaseType === 'jpg') {
              lowerCaseType = 'jpeg';
            }
            return file.type.includes(lowerCaseType);
          })
        : true;
    if (!hasType) {
      message.error(`文件只支持${limitType.join('/')}格式!`);
    }
    const isLtSize = !limitSize || file.size / 1024 <= limitSize;
    if (!isLtSize) {
      message.error(
        `文件最大支持${limitSize >= 1024 ? `${limitSize / 1024}MB` : `${limitSize}KB`}!`
      );
    }
    const isLtLength = !limitLength || fileList.length < limitLength;
    if (!isLtLength) {
      message.error('文件数量已达最大上限！');
    }
    return hasType && isLtSize && isLtLength;
  };
  if (mode !== 'detail') {
    const isPictureCard = listType === 'picture-card';
    return (
      <div>
        <Upload
          fileList={fileList}
          onChange={handleChange}
          beforeUpload={handleBeforeUpload}
          headers={{ 'JA-Token': getToken() }}
          name="files"
          data={{
            folder,
          }}
          action="/acloud_new/v2/uploadFile"
          listType={listType}
          onPreview={
            isPictureCard
              ? file => {
                  console.log(file);
                  setPreview({
                    visible: true,
                    image: file.webUrl,
                  });
                }
              : undefined
          }
          {...rest}
        >
          {!isPictureCard ? (
            <Button>
              <LegacyIcon type="upload" /> 上传文件
            </Button>
          ) : (
            (!limitLength || fileList.length < limitLength) && (
              <div>
                <LegacyIcon type="plus" />
                <div className={styles.uploadText}>上传文件</div>
              </div>
            )
          )}
        </Upload>
        <Modal
          visible={preview.visible}
          footer={null}
          onCancel={() => setPreview(preview => ({ ...preview, visible: false }))}
          zIndex={1009}
        >
          {preview.image && <img className={styles.image} src={preview.image} alt="" />}
        </Modal>
      </div>
    );
  } else {
    return (
      <FileList
        className={styles.fileList}
        value={fileList}
        empty={empty}
        ellipsis={ellipsis}
        type={['picture', 'picture-card'].includes(listType) ? 'picture' : 'file'}
      />
    );
  }
};

FormUpload.getRules = ({ label }) => [
  {
    type: 'array',
    min: 1,
    required: true,
    message: `${label || ''}不能为空`,
  },
];

export default FormUpload;
