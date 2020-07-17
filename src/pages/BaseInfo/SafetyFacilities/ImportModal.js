import { Component } from 'react';
import { Modal, Upload, Button, message, Row } from 'antd';
import { connect } from 'dva';
import { getToken } from '@/utils/authority';
import CompanySelect from '@/jingan-components/CompanySelect';

@connect(({ user }) => ({ user }))
export default class ImportModal extends Component {

  state = {
    importLoading: false,
    importModalVisible: false,
    company: undefined,
  };

  handleBeforeUpload = file => {
    const { importLoading } = this.state;
    const isExcel = /xls/.test(file.name);
    console.log('11')
    if (importLoading) {
      message.error('尚未上传结束');
    }
    if (!isExcel) {
      message.error('上传失败，请上传.xls格式');
    }
    return !importLoading || isExcel;
  }

  handleImportChange = info => {
    const { onUploadSuccess } = this.props;
    const res = info.file.response;
    if (info.file.status === 'uploading') {
      this.setState({ importLoading: true });
    } else if (info.file.status === 'done' && res) {
      if (res.code && res.code === 200) {
        message.success(res.msg);
        onUploadSuccess();
      } else if (res.code && res.code === 500) {
        message.error(res.msg)
      } else {
        res.data.errorMessage.length === 0
          ? message.error(res.msg)
          : Modal.error({
            title: '错误信息',
            content: res.data.errorMessage,
            okText: '确定',
          });
      }
      this.setState({ importLoading: false });
    } else this.setState({ importLoading: false });
  }

  handleCompanyChange = company => {
    if (company && company.key !== company.label) {
      this.setState({ company });
    } else if (!company) {
      this.setState({ company: undefined });
    }
  }

  handleOpenImportModal = () => {
    this.setState({ importModalVisible: true, company: undefined });
  }

  render () {
    const {
      user: { isCompany, currentUser },
      action, // 导入接口路径
      importAuth = true, // 导入权限
      showCompanySelect = true, // 是否显示选择单位
    } = this.props;
    const { importModalVisible, importLoading, company } = this.state;
    const companyId = isCompany ? currentUser.companyId : company ? company.key : undefined;
    const disabled = !importAuth || importLoading || (showCompanySelect && !isCompany && !(company && company.key));
    const uploadProps = {
      name: 'file',
      accept: ".xls,.xlsx",
      headers: { 'JA-Token': getToken() },
      action: typeof action === 'function' ? action(companyId) : action,
      onChange: this.handleImportChange,
      beforeUpload: this.handleBeforeUpload,
      showUploadList: false,
      disabled,
    };
    return (
      <div>
        {isCompany ? (
          <Upload {...uploadProps} >
            <Button type="primary" disabled={!importAuth || importLoading} loading={importLoading}>
              批量导入
            </Button>
          </Upload>
        ) : (
            <Button disabled={!importAuth || importLoading} onClick={this.handleOpenImportModal}>
              批量导入
            </Button>
          )}
        <Modal
          title="导入"
          visible={importModalVisible}
          onCancel={() => this.setState({ importModalVisible: false })}
          footer={(<Button onClick={() => this.setState({ importModalVisible: false })}>关闭</Button>)}
        >
          <Row style={{ marginBottom: '20px' }}>
            <CompanySelect
              style={{ width: '300px' }}
              onChange={this.handleCompanyChange}
              value={company}
            />
          </Row>
          <Upload {...uploadProps}>
            <Button disabled={disabled} loading={importLoading}>
              批量导入
            </Button>
          </Upload>
        </Modal>
      </div>
    )
  }
}
