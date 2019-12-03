import React, { Component } from 'react';
import { Upload, Button, Icon, message } from 'antd';
import classNames from 'classnames';
import { getToken } from '@/utils/authority';
import styles from './index.less';

export default class CustomUpload extends Component {
  handleChange = ({ fileList }) => {
    const { onChange } = this.props;
    onChange && onChange(fileList.reduce((result, item) => {
      const { uid, url, status, response, name } = item;
      if (status === 'uploading') {
        result.push(item);
      } else if (status === 'done') {
        if (url) {
          result.push(item);
        } else {
          const { webUrl, dbUrl, success, fileName } = response && response.data && response.data.list && response.data.list[0] || {};
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
    }, []));
  }

  render() {
    const {
      className,
      style,
      value,
      folder='file',
      onChange,
      type,
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
        headers={{ 'JA-Token': getToken() }}
        {...restProps}
      >
        <Button type="primary">
          <Icon type="upload" /> 点击上传
        </Button>
      </Upload>
    ) : (
      <div className={classNames(styles.fileList, className)} style={style}>
        {value && value.map(({ webUrl, fileName }, index) => (
          <div key={index}>
            <a className={styles.clickable} href={webUrl} target="_blank" rel="noopener noreferrer">{fileName}</a>
          </div>
        ))}
      </div>
    );
  }
}
