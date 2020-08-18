import { Component } from 'react';
import { Modal, Upload, Button, message, Row } from 'antd';
import { connect } from 'dva';
import { getToken } from '@/utils/authority';
import CompanySelect from '@/jingan-components/CompanySelect';
import { hasAuthority } from '@/utils/customAuth';

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
        message.success(typeof res.data === 'string' ? res.data : '操作成功');
        onUploadSuccess && onUploadSuccess();
      } else {
        res && res.data && res.data.errorMessage && res.data.errorMessage.length > 0
          ? Modal.error({
            title: '错误信息',
            content: res.data.errorMessage,
            okText: '确定',
          }) : message.error(res.msg);
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
      code, // 导入权限代码
      auth, // 导入权限
      showCompanySelect = true, // 是否显示选择单位
      ...resProps
    } = this.props;
    const { importModalVisible, importLoading, company } = this.state;
    const importAuth = typeof auth === 'boolean' ? auth : hasAuthority(code, currentUser.permissionCodes);
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
      <div style={{ display: 'inline-block' }} {...resProps}>
        {isCompany || !showCompanySelect ? (
          <Upload {...uploadProps} >
            <Button disabled={!importAuth || importLoading} loading={importLoading}>
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
          {showCompanySelect && (
            <Row style={{ marginBottom: '20px' }}>
              <CompanySelect
                style={{ width: '300px' }}
                onChange={this.handleCompanyChange}
                value={company}
              />
            </Row>
          )}
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
