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
    }
    if (info.file.status === undefined) {
      this.setState({ importLoading: false });
    }
    if (info.file.status === 'done' && res) {
      if (res.code && res.code === 200) {
        message.success(res.msg);
      } else {
        res.data.errorMesssge.length === 0
          ? message.error(res.msg)
          : Modal.error({
            title: '错误信息',
            content: res.data.errorMesssge,
            okText: '确定',
          });
      }
      onUploadSuccess();
      this.setState({ importLoading: false });
    }
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
      action,
      importAuth = true,
    } = this.props;
    const { importModalVisible, importLoading, company } = this.state;
    const companyId = isCompany ? currentUser.companyId : company ? company.key : undefined;
    const uploadProps = {
      name: 'file',
      accept: ".xls,.xlsx",
      headers: { 'JA-Token': getToken() },
      action: typeof action === 'function' ? action(companyId) : action,
      onChange: this.handleImportChange,
      beforeUpload: this.handleBeforeUpload,
      showUploadList: false,
      disabled: !importAuth && !isCompany && !(company && company.key),
    };
    return (
      <div>
        {isCompany ? (
          <Upload {...uploadProps} >
            <Button type="primary" disabled={importLoading} loading={importLoading}>
              批量导入
          </Button>
          </Upload>
        ) : (
            <Button disabled={!importAuth} onClick={this.handleOpenImportModal}>
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
            <Button disabled={importLoading || (!isCompany && !(company && company.key))} loading={importLoading}>
              批量导入
            </Button>
          </Upload>
        </Modal>
      </div>
    )
  }
}
