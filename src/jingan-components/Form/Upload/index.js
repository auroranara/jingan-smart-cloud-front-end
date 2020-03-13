import React, { Component } from 'react';
import { Upload, Button, Icon, message } from 'antd';
import FileList from '@/jingan-components/View/FileList';
import { getToken } from '@/utils/authority';
import styles from './index.less';

export default class FormUpload extends Component {
  handleChange = ({ fileList }) => {
    const { onChange, limitLength } = this.props;
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
    if (+limitLength && list.length > limitLength) {
      list = list.slice(list.length - length);
    }
    onChange && onChange(list);
  };

  handleBeforeUpload = file => {
    const { limitType, limitSize } = this.props;
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
      message.error(`文件上传只支持${limitType.join('/')}格式!`);
    }
    const isLtSize = limitSize ? file.size / 1024 <= limitSize : true;
    if (!isLtSize) {
      message.error(
        `文件上传最大支持${limitSize >= 1024 ? `${limitSize / 1024}MB` : `${limitSize}KB`}!`
      );
    }
    return hasType && isLtSize;
  };

  render() {
    const {
      mode = 'add',
      folder = 'file',
      limitLength,
      limitType,
      limitSize,
      type = 'button',
      value,
      onChange,
      empty,
      ellipsis,
      ...restProps
    } = this.props;
    const fileList = value || [];
    let children;
    if (type === 'button') {
      children = (
        <Button type="primary">
          <Icon type="upload" /> 点击上传
        </Button>
      );
    }

    if (mode !== 'detail') {
      return (
        <Upload
          fileList={fileList}
          onChange={this.handleChange}
          beforeUpload={this.handleBeforeUpload}
          headers={{ 'JA-Token': getToken() }}
          name="files"
          data={{
            folder,
          }}
          action="/acloud_new/v2/uploadFile"
          {...restProps}
        >
          {children}
        </Upload>
      );
    } else {
      return (
        <FileList
          className={styles.fileList}
          value={value}
          empty={empty}
          ellipsis={ellipsis}
          type={type === 'button' ? 'file' : 'image'}
        />
      );
    }
  }
}
