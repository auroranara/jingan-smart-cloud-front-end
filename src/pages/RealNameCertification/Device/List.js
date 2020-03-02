import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Form,
  Card,
  Button,
  Spin,
  Col,
  Row,
  Select,
  message,
  Table,
  Divider,
  Input,
  DatePicker,
  Icon,
  Dropdown,
  Menu,
  Modal,
} from 'antd';
import { Link } from 'dva/router';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import codes from '@/utils/codes';
import { hasAuthority } from '@/utils/customAuth';
import router from 'umi/router';
import { stringify } from 'qs';
import AddModal from './AddModal';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { confirm } = Modal;

const title = '设备管理';
const defaultPageSize = 18;
const colWrapper = { lg: 8, md: 12, sm: 24, xs: 24 };
const formItemStyle = { style: { margin: '0', padding: '4px 0' } };
const iconStyle = {
  marginLeft: '0.5em',
  fontSize: '13px',
  color: '#1890ff',
  cursor: 'pointer',
};

//面包屑
const breadcrumbList = [
  {
    title: '首页',
    name: '首页',
    href: '/',
  },
  {
    title: '实名制认证系统',
    name: '实名制认证系统',
  },
  {
    title,
    name: title,
  },
];

@connect(({ realNameCertification }) => ({
  realNameCertification,
}))
@Form.create()
export default class DeviceList extends PureComponent {

  state = {
    addModalVisible: false, // 新增、编辑弹窗可见
    descriptionModalVisible: false, // 操作说明弹窗可见
  }

  // 点击新增
  handleViewAdd = () => {
    this.setState({ addModalVisible: true })
  }

  // 新增
  handleAdd = (values) => {
    console.log('add', values);

  }

  // 重置设备
  handleResetDevice = () => {
    confirm({
      title: '重置该设备？',
      content: '设备重置后删除该设备上的所有数据，重置后系统自动进行数据恢复',
      okText: '重置',
      // okButtonProps: {
      //   disabled: true,
      // },
      cancelText: '取消',
      onOk () {
        console.log('重置设备');
      },
    });
  }

  // 禁用设备
  handleDisableDevice = () => {
    confirm({
      title: '禁用该设备？',
      content: '禁用设备后，除了除启用、删除与查询功能，该设备的所有功能按钮不能使用，接口中也无法对该设备进行操作',
      okText: '禁用',
      // okButtonProps: {
      //   disabled: true,
      // },
      cancelText: '取消',
      onOk () {
        console.log('禁用设备');
      },
    });
  }

  // 删除设备
  handleDeleteDevice = () => {
    confirm({
      title: '删除该设备？',
      content: '删除设备后，将删除系统保存的所有设备信息，同时删除设备内的所有数据',
      okText: '删除',
      // okButtonProps: {
      //   disabled: true,
      // },
      cancelText: '取消',
      onOk () {
        console.log('删除设备');
      },
    });
  }

  // 渲染筛选栏
  renderFilter = () => {
    const {
      form: { getFieldDecorator },
      realNameCertification: { deviceTypeDict },
    } = this.props;
    return (
      <Card>
        <Form>
          <Row gutter={16}>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                {getFieldDecorator('num')(
                  <Input placeholder="序列号" />
                )}
              </FormItem>
            </Col>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                {getFieldDecorator('name')(
                  <Input placeholder="名称" />
                )}
              </FormItem>
            </Col>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                {getFieldDecorator('type')(
                  <Select placeholder="设备类型">
                    {deviceTypeDict.map(({ key, label }) => (
                      <Select.Option key={key} value={key}>{label}</Select.Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                {getFieldDecorator('time')(
                  <RangePicker
                    format="YYYY-MM-DD HH:mm:ss"
                  />
                )}
              </FormItem>
            </Col>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                <Button style={{ marginRight: '10px' }} type="primary" onClick={() => this.handleQuery()}>
                  查询
                </Button>
                <Button style={{ marginRight: '10px' }} onClick={this.handleReset}>
                  重置
                </Button>
                <Button type="primary" onClick={this.handleViewAdd}>
                  新增设备
                </Button>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Card>
    )
  }

  // 渲染列表
  renderList = () => {
    const pageNum = 1, pageSize = 10, total = 1;
    const list = [
      {
        id: '001',
        companyId: '123',
        companyName: '常熟市鑫博伟针纺织有限公司',
        phone: '13815208877',
        name: '张三',
        sex: '男',
        remark: '',
        office: '员工',
        icNum: '1919E11F0009',
      },
    ];
    const columns = [
      {
        title: '设备序列号',
        dataIndex: 'a',
        align: 'center',
        width: 200,
      },
      {
        title: '名称',
        dataIndex: 'name',
        align: 'center',
        width: 200,
      },
      {
        title: '类型',
        dataIndex: 'sex',
        align: 'center',
        width: 150,
      },
      {
        title: '识别方式',
        dataIndex: 'phone',
        align: 'center',
        width: 200,
      },
      {
        title: '状态',
        dataIndex: 'office',
        align: 'center',
        width: 150,
      },
      {
        title: '版本',
        dataIndex: 'icNuma',
        align: 'center',
        width: 200,
      },
      {
        title: '识别模式',
        dataIndex: 'icNumb',
        align: 'center',
        width: 200,
      },
      {
        title: '识别模式',
        dataIndex: 'icNucm',
        align: 'center',
        width: 200,
      },
      {
        title: (
          <span>
            操作
          <Icon
              onClick={() => { this.setState({ descriptionModalVisible: true }) }}
              style={iconStyle}
              type="question-circle" />
          </span>
        ),
        key: '操作',
        align: 'center',
        width: 280,
        fixed: 'right',
        render: (val, record) => (
          <Fragment>
            <a><Icon type="sync" /><span style={{ marginLeft: '0.5em' }}>升级</span></a>
            <Divider type="vertical" />
            <a>修改配置</a>
            <Divider type="vertical" />
            <a>重启</a>
            <Divider type="vertical" />
            <a>编辑</a>
            <Divider type="vertical" />
            <Dropdown
              overlay={(
                <Menu>
                  <Menu.Item>
                    <a>远程控制</a>
                  </Menu.Item>
                  <Menu.Item>
                    <a onClick={() => this.handleResetDevice()}>重置</a>
                  </Menu.Item>
                  <Menu.Item>
                    <a onClick={() => this.handleDisableDevice()}>禁用</a>
                  </Menu.Item>
                  <Menu.Item>
                    <a onClick={() => this.handleDeleteDevice()}>删除</a>
                  </Menu.Item>
                </Menu>
              )}
              trigger={['click']}
              placement="bottomCenter">
              <a style={{ fontWeight: '700' }}>···</a>
            </Dropdown>
          </Fragment>
        ),
      },
    ];
    return (
      <Card style={{ marginTop: '24px' }}>
        <Table
          rowKey="id"
          // loading={loading}
          columns={columns}
          dataSource={list}
          scroll={{ x: 'max-content' }}
          pagination={{
            current: pageNum,
            pageSize,
            total,
            showQuickJumper: true,
            showSizeChanger: true,
            pageSizeOptions: ['5', '10', '15', '20'],
            onChange: this.handleQuery,
            onShowSizeChange: (num, size) => {
              this.handleQuery(1, size);
            },
          }}
        />
      </Card>
    )
  }

  // 渲染操作说明弹窗
  renderDescriptionModal = () => {
    const list = [
      {
        tag: '升级',
        desc: '对当前设备进行版本的升降级，选择相应设备，点击升级，然后选择想要的版本',
      },
      {
        tag: '修改配置',
        desc: '对当前设备的各类参数进行配置，如识别参数，显示参数等',
      },
      {
        tag: '配置复制',
        desc: '将当前设备配置信息拷贝至其他设备上',
      },
      {
        tag: '远程控制',
        desc: '从云端向设备下发指令，执行相应操作，目前只有开门操作，后期扩展其他指令',
      },
      {
        tag: '编辑',
        desc: '编辑设备信息：如名称，备注，识别方式',
      },
      {
        tag: '重置',
        desc: '除了云端的绑定关系外删除该设备上的所有数据',
      },
      {
        tag: '禁用',
        desc: '将设备状态修改为禁用状态，设备界面显示禁用，该设备的所有功能按钮不能使用，接口中也无法对该设备进行操作，除启用，删除与查询功能',
      },
      {
        tag: '启用',
        desc: '将设备由已禁用状态修改为已启用，恢复设备所有功能',
      },
      {
        tag: '删除',
        desc: ' 在应用下，解除与设备的绑定关系，删除保存的设备信息，同时删除设备内的所有数据',
      },
    ];
    return (
      <Modal
        title="操作说明"
        visible={this.state.descriptionModalVisible}
        footer={null}
        onCancel={() => { this.setState({ descriptionModalVisible: false }) }}
      >
        {list.map(({ tag, desc }, i) => (
          <p key={i}>
            <span style={{ fontWeight: 'bold' }}>{`${i + 1}.${tag}：`}</span>
            {desc}
          </p>
        ))}
      </Modal>
    )
  }

  render () {
    const { addModalVisible } = this.state;
    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
      // content={
      //   <div>
      //     <span>
      //       单位总数：
      //       {0}
      //     </span>
      //     <span style={{ paddingLeft: 20 }}>
      //       人员总数:
      //       <span style={{ paddingLeft: 8 }}>{0}</span>
      //     </span>
      //   </div>
      // }
      >
        {this.renderFilter()}
        {this.renderList()}
        <AddModal
          visible={addModalVisible}
          onOk={this.handleAdd}
          onCancel={() => { this.setState({ addModalVisible: false }) }}
        />
        {this.renderDescriptionModal()}
      </PageHeaderLayout>
    )
  }
}
