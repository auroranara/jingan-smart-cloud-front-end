import React, { PureComponent } from 'react';
import { Card, Form, Row, Col, Input, Select, Cascader, Upload, Button, Icon, message, AutoComplete, Spin } from 'antd';
import { getToken } from '@/utils/authority';

const { Option } = Select;

/* 获取root下的div元素 */
const getRootChild = () => document.querySelector('#root>div');

// 上传文件地址
const uploadAction = '/acloud_new/v2/uploadFile';

// 上传文件夹
const folder = 'fireControl';

/**
 * 基础信息
 */
export default class App extends PureComponent {
  /**
   * 去除数据左右空格
   */
  handleTrim = e => e.target.value.trim()

  /* 上传单位平面图 */
  handleUpload = ({ fileList, file }) => {
    const { handleChangeUploading } = this.props;
    let value;
    // 上传中
    if (file.status === 'uploading') {
      value = fileList;
      handleChangeUploading(true);
    }
    // 上传完毕
    else if (file.status === 'done') {
      // code为200时
      if (file.response.code === 200) {
        const {
          data: {
            list: [result],
          },
        } = file.response;
        // 有返回内容
        if (result) {
          value = fileList.map(item => {
            if (!item.url && item.response) {
              return {
                ...item,
                url: result.webUrl,
                dbUrl: result.dbUrl,
              };
            }
            return item;
          });
        }
        // 没有返回内容
        else {
          message.error('上传失败！');
          value = fileList.filter(item => {
            return !item.response || item.response.data.list.length !== 0;
          });
        }
      }
      // code不为200时
      else {
        message.error('上传失败！');
        value = fileList.filter(item => {
          return !item.response || item.response.code !== 200;
        });
      }
      handleChangeUploading(false);
    }
    // 删除文件
    else if (file.status === 'removed') {
      value = fileList.filter(item => {
        return item.status !== 'removed';
      });
    }
    // 发生错误
    else {
      message.error('上传失败！');
      value = fileList.filter(item => {
        return item.status !== 'error';
      });
      handleChangeUploading(false);
    }
    return value;
  };

  /**
   * 总公司输入框失焦事件
   */
  handleClearParentId = (value) => {
    const { handleSearchParentIdList, form: { setFieldsValue, validateFields }, model: { modal: { list } } } = this.props;
    if (value && value.key === value.label) {
      handleSearchParentIdList.cancel();
      // 从数组中筛选出与value.label相等的数据
      const maintenance = list.filter(item => item.name === value.label)[0];
      if (maintenance) {
        // 如果筛选出的数据存在的话，则设置选中对应的下拉框选项
        setFieldsValue({
          parentId: {
            key: maintenance.id,
            label: maintenance.name,
          },
        });
      }
      else {
        // 否则清空维保单位输入框
        setFieldsValue({
          parentId: undefined,
        });
        // 提示验证信息
        validateFields(['parentId']);
        // 获取维保单位列表
        handleSearchParentIdList();
      }
    }
  }

  render() {
    const {
      model: {
        detail: {
          companyBasicInfo: {
            name,
            code,
            longitude,
            latitude,
            registerAddress,
            registerProvince,
            registerCity,
            registerDistrict,
            registerTown,
            practicalAddress,
            practicalProvince,
            practicalCity,
            practicalDistrict,
            practicalTown,
            companyNature,
            // companyStatus,
            // industryCategory,
            companyIchnography,
          }={},
          // 是否为分公司
          isBranch,
          // 总公司
          parentId,
          // 总公司名称
          parentUnitName,
        },
        // 注册地址列表
        registerAddressList,
        // 实际地址列表
        practicalAddressList,
        // 单位性质列表
        companyNatureList,
        // // 单位状态列表
        // companyStatusList,
        // // 行业类别列表
        // industryCategoryList,
        // 是否为分公司列表
        isBranchList,
        // 总公司列表
        modal: {
          list: parentIdList,
        },
      },
      form: {
        getFieldDecorator,
      },
      styles,
      fieldLabels,
      // // 是否是一般企业
      // isCompany=true,
      // // 用于修改isCompany
      // handleChangeIsCompany,
      // 显示地图
      handleShowMap,
      // 加载地址
      handleLoadData,
      // 默认选中的单位性质
      defaultCompanyNature,
      // 修改isBranch
      handleChangeIsBranch,
      // 当前选中是否为分公司
      isBranch: currentIsBranch,
      // 是否正在加载中
      loading,
      // 查询总公司列表
      handleSearchParentIdList,
      // 是否为维保人员
      isMaintenanceUser=false,
      // 默认总公司对象
      defaultParentCompany,
    } = this.props;

    // 修改平面图字段的格式
    let companyIchnographyList = companyIchnography ? JSON.parse(companyIchnography) : [];
    companyIchnographyList = Array.isArray(companyIchnographyList) ? companyIchnographyList.map((item, index) => ({
      ...item,
      uid: index,
      status: 'done',
    })) : JSON.parse(companyIchnographyList.dbUrl).map((item, index) => ({
      ...item,
      uid: index,
      status: 'done',
    }));

    return (
      <Card className={styles.card} bordered={false}>
        <Form layout="vertical">
          <Row gutter={{ lg: 48, md: 24 }}>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label={fieldLabels.name}>
                {getFieldDecorator('name', {
                  initialValue: name,
                  getValueFromEvent: this.handleTrim,
                  rules: [{ required: true, message: '请输入单位名称' }],
                })(<Input placeholder="请输入单位名称" />)}
              </Form.Item>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label={fieldLabels.companyNature}>
                {getFieldDecorator('companyNature', {
                  initialValue:
                    companyNature ||
                    (companyNatureList.length > 0
                      ? companyNatureList.filter(item => item.label === defaultCompanyNature)[0].id
                      : undefined),
                  rules: [{ required: true, message: '请选择单位性质' }],
                })(
                  <Select
                    placeholder="请选择单位性质"
                    getPopupContainer={getRootChild}
                    // onChange={handleChangeIsCompany}
                    disabled={true}
                  >
                    {companyNatureList.map(item => (
                      <Option value={item.id} key={item.id}>
                        {item.label}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label={fieldLabels.code}>
                {getFieldDecorator('code', {
                  initialValue: code,
                  getValueFromEvent: this.handleTrim,
                })(<Input placeholder="请输入社会信用代码" />)}
              </Form.Item>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label={fieldLabels.coordinate}>
                {getFieldDecorator('coordinate', {
                  initialValue: longitude && latitude ? `${longitude},${latitude}` : undefined,
                  getValueFromEvent: this.handleTrim,
                  rules: [{ required: true, message: '请选择经纬度' }],
                })(
                  <Input
                    placeholder="请选择经纬度"
                    onFocus={e => e.target.blur()}
                    onClick={handleShowMap}
                  />
                )}
              </Form.Item>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label={fieldLabels.isBranch}>
                {getFieldDecorator('isBranch', {
                  initialValue: isMaintenanceUser ? '1'  : (isBranch ? isBranch+'' : '0'),
                  rules: [{ required: true, message: '请选择是否为分公司' }],
                })(
                  <Select placeholder="请选择是否为分公司" getPopupContainer={getRootChild} onChange={handleChangeIsBranch} disabled={isMaintenanceUser}>
                    {isBranchList.map(item => (
                      <Option value={item.key} key={item.key}>
                        {item.value}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            {(isMaintenanceUser || currentIsBranch) && (
              <Col lg={8} md={12} sm={24}>
                <Form.Item label={fieldLabels.parentId}>
                  {getFieldDecorator('parentId', {
                    initialValue: isMaintenanceUser ? defaultParentCompany: (parentId && parentUnitName
                        ? {
                            key: parentId,
                            label: parentUnitName,
                          }
                        : undefined),
                    rules: [
                      {
                        required: true,
                        message: '请选择总公司',
                        whitespace: true,
                        transform: value => value && value.label,
                      },
                    ],
                  })(
                    <AutoComplete
                      mode="combobox"
                      placeholder="请选择总公司"
                      labelInValue
                      defaultActiveFirstOption={false}
                      filterOption={false}
                      notFoundContent={loading ? <Spin size="small" /> : '无法查找到对应数据'}
                      onSearch={handleSearchParentIdList}
                      onBlur={this.handleClearParentId}
                      getPopupContainer={getRootChild}
                      optionLabelProp="children"
                      disabled={isMaintenanceUser}
                    >
                      {parentIdList.map(item => (
                        <Option key={item.id}>
                          {item.name}
                        </Option>
                      ))}
                    </AutoComplete>
                  )}
                </Form.Item>
              </Col>
            )}
            {/* {!isCompany && (
              <Col lg={8} md={12} sm={24}>
                <Form.Item label={fieldLabels.industryCategory}>
                  {getFieldDecorator('industryCategory', {
                    initialValue: industryCategory ? industryCategory.split(',') : [],
                  })(
                    <Cascader
                      options={industryCategoryList}
                      fieldNames={{
                        value: 'type_id',
                        label: 'gs_type_name',
                        children: 'children',
                      }}
                      allowClear
                      changeOnSelect
                      notFoundContent
                      placeholder="请选择行业类别"
                      getPopupContainer={getRootChild}
                    />
                  )}
                </Form.Item>
              </Col>
            )}
            {!isCompany && (
              <Col lg={8} md={12} sm={24}>
                <Form.Item label={fieldLabels.companyStatus}>
                  {getFieldDecorator('companyStatus', {
                    initialValue: companyStatus,
                    rules: [{ required: true, message: '请选择单位状态' }],
                  })(
                    <Select placeholder="请选择单位状态" getPopupContainer={getRootChild}>
                      {companyStatusList.map(item => (
                        <Option value={item.key} key={item.key}>
                          {item.value}
                        </Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
            )} */}
          </Row>
          <Row gutter={{ lg: 48, md: 24 }}>
            <Col span={24}>
              <Row gutter={24}>
                <Col md={12} sm={24}>
                  <Form.Item label={fieldLabels.registerAddress}>
                    {getFieldDecorator('registerAddressList', {
                      initialValue: registerProvince
                        ? [registerProvince, registerCity, registerDistrict, registerTown]
                        : [],
                      rules: [{ required: true, message: '请选择注册地址' }],
                    })(
                      <Cascader
                        options={registerAddressList}
                        fieldNames={{
                          value: 'id',
                          label: 'name',
                          children: 'children',
                          isLeaf: 'isLeaf',
                        }}
                        loadData={selectedOptions => {
                          handleLoadData('registerAddress', selectedOptions);
                        }}
                        changeOnSelect
                        placeholder="请选择注册地址"
                        allowClear
                        getPopupContainer={getRootChild}
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col md={12} sm={24}>
                  <Form.Item style={{ paddingTop: '29px' }}>
                    {getFieldDecorator('registerAddress', {
                      initialValue: registerAddress,
                      getValueFromEvent: this.handleTrim,
                      rules: [{ required: true, message: '请输入注册地址详细地址' }],
                    })(<Input placeholder="请输入详细地址" />)}
                  </Form.Item>
                </Col>
              </Row>
            </Col>
            <Col span={24}>
              <Row gutter={24}>
                <Col md={12} sm={24}>
                  <Form.Item label={fieldLabels.practicalAddress}>
                    {getFieldDecorator('practicalAddressList', {
                      initialValue: practicalProvince
                        ? [practicalProvince, practicalCity, practicalDistrict, practicalTown]
                        : [],
                      rules: [{ required: true, message: '请选择实际经营地址' }],
                    })(
                      <Cascader
                        options={practicalAddressList}
                        fieldNames={{
                          value: 'id',
                          label: 'name',
                          children: 'children',
                          isLeaf: 'isLeaf',
                        }}
                        loadData={selectedOptions => {
                          handleLoadData('practicalAddress', selectedOptions);
                        }}
                        changeOnSelect
                        placeholder="请选择实际经营地址"
                        allowClear
                        getPopupContainer={getRootChild}
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col md={12} sm={24}>
                  <Form.Item style={{ paddingTop: '29px' }}>
                    {getFieldDecorator('practicalAddress', {
                      initialValue: practicalAddress,
                      getValueFromEvent: this.handleTrim,
                      rules: [{ required: true, message: '请输入实际经营地址详细地址' }],
                    })(<Input placeholder="请输入详细地址" />)}
                  </Form.Item>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row gutter={{ lg: 48, md: 24 }}>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label={fieldLabels.companyIchnography}>
                {getFieldDecorator('companyIchnography', {
                  initialValue: companyIchnographyList,
                  valuePropName: 'fileList',
                  getValueFromEvent: this.handleUpload,
                })(
                  <Upload
                    name="files"
                    data={{
                      folder,
                    }}
                    multiple
                    action={uploadAction}
                    headers={{ 'JA-Token': getToken() }}
                  >
                    <Button type="dashed" style={{ width: '96px', height: '96px' }}>
                      <Icon type="plus" style={{ fontSize: '32px' }} />
                      <div style={{ marginTop: '8px' }}>点击上传</div>
                    </Button>
                  </Upload>
                )}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
    );
  }
}
