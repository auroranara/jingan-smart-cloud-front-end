import React, { Component } from 'react';
import { Upload, Button, Icon, message } from 'antd';
import { getToken } from '@/utils/authority';

export default class CustomUpload extends Component {
  handleChange = ({ fileList, file }) => {
    const { onChange } = this.props;
    onChange && onChange(fileList.reduce((result, item) => {
      const { uid, url, status, response, name } = item;
      if (status === 'uploading') {
        result.push(item);
      } else if (status === 'done') {
        if (url) {
          result.push(item);
        } else {
          const { webUrl, dbUrl } = response && response.data && response.data.list && response.data.list[0] || {};
          if (webUrl) {
            result.push({
              uid,
              name,
              url: webUrl,
              dbUrl,
              status,
            });
          } else {
            message.error('上传失败！');
          }
        }
      } else {
        message.error('上传失败！');
      }
      return result;
    }, []));
  }

  render() {
    const {
      value,
      folder='file',
      onChange,
      ...restProps
    } = this.props;

    return (
      <Upload
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
    );
  }
}
