import React, { PureComponent } from 'react';
import { Tag, List, Button, Row, Col, Card, Form, Input, Select, DatePicker, Divider, Popconfirm, Icon } from 'antd';
import moment from 'moment';
import styles from './CoursewareList.less'

const FormItem = Form.Item;
const Option = Select.Option;
const ListItem = List.Item;
// const { RangePicker } = DatePicker;

// 筛选栏grid配置
const colWrapper = {
  xl: 8, md: 12, sm: 24, xs: 24,
}
const statusList = [
  { value: '发布', label: '发布' },
  { value: '未发布', label: '未发布' },
]

const list = [
  {
    name: '阿瑟东萨达水水水水水水水水水水水水水水水水阿瑟东萨达水水水水水水水水水水水水水水水水阿瑟东萨达水水水水水水水水水水水水水水水水',
    author: 'zhangsan',
    view: 1000,
    people: 500,
    time: '2018-11-14 14:44',
    status: 1,
  },
  {
    name: 'asdsasadsaddddddddddddddddddddddddddddsaddddddddddddddddddddddddddddddddddddddasdsasadsadddddddddddddddddddddddddddddddddddddd',
    author: 'zhangsan',
    view: 1000,
    people: 500,
    time: '2018-11-14 14:44',
    status: 1,
  },
]

@Form.create()
export default class CoursewareList extends PureComponent {

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props
    return (
      <div className={styles.coursewareList}>
        <Row gutter={8}>
          <Form>
            <Col {...colWrapper}>
              <FormItem>
                {getFieldDecorator('name')(
                  <Input placeholder="请输入视频名称" />
                )}
              </FormItem>
            </Col>
            <Col {...colWrapper}>
              <FormItem>
                {getFieldDecorator('status')(
                  <Select placeholder="请选择发布状态">
                    {statusList.map(({ value, label }) => (
                      <Option key={value} value={value}>{label}</Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col {...colWrapper}>
              <FormItem>
                {getFieldDecorator('time')(
                  <DatePicker
                    style={{ width: '100%' }}
                    format="YYYY-MM-DD HH:mm:ss"
                    placeholder="发布时间" />
                )}
              </FormItem>
            </Col>
            <Col {...colWrapper}>
              <FormItem>
                <Button className={styles.mr10} type="primary">查询</Button>
                <Button className={styles.mr10}>重置</Button>
                <Button type="primary">新增</Button>
              </FormItem>
            </Col>
          </Form>
        </Row>
        <List
          grid={{ gutter: 16, column: 1 }}
          dataSource={list}
          renderItem={item => (
            <ListItem>
              <Card className={styles.cardContainer}>
                <div className={styles.firstLine}>
                  <div className={styles.title}>{item.name}</div>
                  <div className={styles.rightIcons}>
                    <Icon className={styles.icon} type="eye" />
                    <Divider type="vertical" />
                    <Icon className={styles.icon} type="edit" />
                    <Divider type="vertical" />
                    <Popconfirm title="确认删除该试题吗？" onConfirm={() => { console.log('delete') }}>
                      <Icon className={styles.icon} type="close" />
                    </Popconfirm>
                  </div>
                </div>
                <Tag className={styles.tags} color={item.status ? 'blue' : 'grey'}>{item.status ? '已发布' : '未发布'}</Tag>
                <div className={styles.introduction}>
                  <span>{item.author}</span>
                  <span className={styles.grey}>{' 发布于 '}</span>
                  <span>{item.time}</span>
                </div>
                <div className={styles.statistics}>
                  <span><Icon className={styles.icon} type="eye" />{item.view}</span>
                  <Divider type="vertical" />
                  <span><Icon className={styles.icon} type="user" />{item.people}</span>
                </div>
              </Card>
            </ListItem>
          )}
        ></List>
      </div>
    )
  }
}
