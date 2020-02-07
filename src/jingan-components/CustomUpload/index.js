import React, { Component } from 'react';
import { Upload, Button, Icon, message } from 'antd';
import classNames from 'classnames';
import { getToken } from '@/utils/authority';
import styles from './index.less';

export default class CustomUpload extends Component {
  handleChange = ({ fileList }) => {
    const { onChange, length } = this.props;
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
            message.error('上传失败！');
          }
        }
      } else if (status === 'error') {
        message.error('上传失败！');
      }
      return result;
    }, []);
    if (length) {
      list = list.slice(list.length - length);
    }
    onChange && onChange(list);
  };

  // 上传前
  handleBeforeUpload = file => {
    const { types, size } = this.props;
    const hasType =
      types && types.length
        ? types.some(type => {
            let lowerCaseType = type.toLowerCase();
            if (lowerCaseType === 'jpg') {
              lowerCaseType = 'jpeg';
            }
            return file.type.includes(lowerCaseType);
          })
        : true;
    if (!hasType) {
      message.error(`文件上传只支持${types.join('/')}格式!`);
    }
    const isLtSize = size ? file.size / 1024 / 1024 <= size : true;
    if (!isLtSize) {
      message.error(`文件上传最大支持${size >= 1 ? `${size}MB` : `${size * 1000}KB`}!`);
    }
    return hasType && isLtSize;
  };

  render() {
    const {
      className,
      style,
      value,
      folder = 'file',
      onChange,
      type,
      types,
      length,
      ...restProps
    } = this.props;

    return type !== 'span' ? (
      <Upload
        className={className}
        style={style}
        name="files"
        data={{
          folder,
        }}
        action="/acloud_new/v2/uploadFile"
        fileList={value}
        multiple
        onChange={this.handleChange}
        beforeUpload={this.handleBeforeUpload}
        headers={{ 'JA-Token': getToken() }}
        {...restProps}
      >
        <Button type="primary">
          <Icon type="upload" /> 点击上传
        </Button>
      </Upload>
    ) : (
      <div className={classNames(styles.fileList, className)} style={style}>
        {value &&
          value.map(({ webUrl, fileName }, index) => (
            <div key={index}>
              <a
                className={styles.clickable}
                href={webUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {fileName}
              </a>
            </div>
          ))}
      </div>
    );
  }
}
