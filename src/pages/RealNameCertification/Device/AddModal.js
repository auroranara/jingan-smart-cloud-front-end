import {
  Modal,
  Form,
  Input,
  Row,
  Col,
  Radio,
  Icon,
  Tooltip,
} from 'antd';
import styles from './AddModal.less';

const FormItem = Form.Item;
const formItemProps = {
  colon: false,
};
const serialNumberLabel = (
  <span>
    设备序列号
  <Tooltip title="设备序列号（SN）在设备背面与开机后主屏幕右下角区域" placement="right" className={styles.tooltipIcon}>
      <Icon type="question-circle" />
    </Tooltip>
  </span>
);

const AddModal = Form.create()(
  props => {
    const {
      visible,
      onCancel,
      onOk,
      form: { getFieldDecorator, getFieldValue, setFieldsValue, validateFields },
    } = props;
    // 容量参考
    const reference = [
      {
        url: 'http://wo-front-end.oss-cn-hangzhou.aliyuncs.com/static/img/uface1.723214c.png',
        type: 'Uface 1',
        capacity: '10000张照片',
      },
      {
        url: 'http://wo-front-end.oss-cn-hangzhou.aliyuncs.com/static/img/uface2.5196a77.png',
        type: 'Uface 2',
        capacity: '10000张照片',
      },
      {
        url: 'http://wo-front-end.oss-cn-hangzhou.aliyuncs.com/static/img/ufaceC.c0e78eb.png',
        type: 'Uface C',
        capacity: '10000张照片',
      },
      {
        url: 'http://wo-front-end.oss-cn-hangzhou.aliyuncs.com/static/img/uface3.611541b.png',
        type: 'Uface 3',
        capacity: '10000张照片',
      },
    ];
    // 识别方式 
    const identifications = [
      {
        value: '本地识别',
        label: '本地识别',
        remark: '设备识别时只和设备本地人脸库进行对比。授权时将人员权限信息保存在设备本地人脸库',
      },
      {
        value: '云端识别',
        label: '云端识别',
        remark: '设备识别时只和设备云端人脸库进行对比。授权时将人员权限信息保存在设备云端人脸库',
      },
    ];
    // 识别方式
    const identification = getFieldValue('identification');
    const handleIdentificationChange = identification => {
      setFieldsValue({ identification });
    }
    const handleSubmit = () => {
      validateFields((err, values) => {
        if (err) return;
        onOk(values);
      })
    }

    return (
      <Modal
        title="新增设备"
        visible={visible}
        width={500}
        onCancel={onCancel}
        onOk={handleSubmit}
      >
        <Form>
          <Row gutter={24}>
            <Col span={12}>
              <FormItem label={serialNumberLabel} {...formItemProps}>
                {getFieldDecorator('num', {
                  rules: [{ required: true, message: '请输入设备序列号' }],
                })(
                  <Input placeholder="请输入设备序列号" />
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="设备名称" {...formItemProps}>
                {getFieldDecorator('name')(
                  <Input placeholder="请输入设备名称" />
                )}
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem label={(<span>识别方式<span className={styles.extra}>(现场人数小于设备容量，建议选本地)</span></span>)} {...formItemProps}>
                {getFieldDecorator('identification')(
                  <table className={styles.table}>
                    <tbody>
                      {identifications.map(item => (
                        <tr key={item.value}>
                          <td>
                            <Radio.Group name="identification" onChange={() => handleIdentificationChange(item.value)} value={identification}>
                              <Radio value={item.value}>{item.label}</Radio>
                            </Radio.Group>
                          </td>
                          <td>{item.remark}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem label="备注" {...formItemProps}>
                {getFieldDecorator('remark')(
                  <Input.TextArea placeholder="请输入备注信息" />
                )}
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem label="容量参考" {...formItemProps}>
                <Row gutter={16}>
                  {reference.map(item => (
                    <Col className={styles.reference} span={6} key={item.type}>
                      <img alt="img" src={item.url} />
                      <p>{item.type}</p>
                      <p>{item.capacity}</p>
                    </Col>
                  ))}
                </Row>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>
    )
  }
)
export default AddModal;