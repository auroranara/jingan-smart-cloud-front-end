import React, { PureComponent } from 'react';
// import connect from 'dva';
import { List, Card, Row, Button, Icon, Tag, Form, Col, Input, Select } from 'antd';
// import router from 'umi/router';
import styles from './Article.less';

const ListItem = List.Item;
const FormItem = Form.Item;
const Option = Select.Option;

// 筛选栏grid配置
const colWrapper = {
  xl: 4,
  md: 8,
  sm: 12,
  xs: 12,
};

const data = [
  {
    title: '消防应急操作指南指导消防应急操作指南指导 ',
    content: '学习学习',
    author: '马云',
    id: '001',
  },
  {
    title: '消防应急操作指南指导fsdfvsd',
    content: '学习学习',
    author: '啊是大',
    id: '002',
  },
  {
    title: '消防应急操作指南指导东方闪电',
    content: '学习学习',
    author: '啊是大',
    id: '003',
  },
];

@Form.create()
export default class ArticleList extends PureComponent {
  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;

    const IconText = ({ type, text }) => (
      <span>
        <Icon type={type} style={{ marginRight: 7 }} />
        {text}
      </span>
    );

    return (
      <div>
        <Row gutter={8}>
          <Form>
            <Col {...colWrapper}>
              <FormItem>
                {getFieldDecorator('title')(<Input placeholder="请输入文章标题" />)}
              </FormItem>
            </Col>
            <Col {...colWrapper}>
              <FormItem>
                {getFieldDecorator('author')(
                  <Select placeholder="请选择阅读状态">
                    <Option value="已读">已读</Option>
                    <Option value="未读">未读</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col {...colWrapper}>
              <FormItem>
                {getFieldDecorator('author')(<Select placeholder="请选择知识点" />)}
              </FormItem>
            </Col>
          </Form>
          <Col {...colWrapper}>
            <FormItem>
              <Button type="primary" onClick={this.handleAddArticle}>
                查询
              </Button>
              <Button type="primary" style={{ marginLeft: '10px' }} onClick={this.handleAddArticle}>
                重置
              </Button>
            </FormItem>
          </Col>
        </Row>

        <List
          grid={{ gutter: 16, column: 1 }}
          dataSource={data}
          renderItem={item => (
            <ListItem key={item.id}>
              <Card className={styles.cardContainer}>
                <div className={styles.firstLine}>
                  <div className={styles.title}>{item.title}</div>
                </div>
                <div className={styles.secondLine}>
                  <p>
                    <Tag>知识点一</Tag>
                    <Tag color="blue">已读</Tag>
                  </p>
                  <span>2018-11-11 11:11</span>
                  <p>
                    <ListItem
                      actions={[
                        <IconText type="user" text="100" />,
                        <IconText type="eye" text="1000" />,
                        <a>
                          <IconText type="read" text="开始阅读" />
                        </a>,
                      ]}
                    />
                  </p>
                </div>
              </Card>
            </ListItem>
          )}
        />
      </div>
    );
  }
}
