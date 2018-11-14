import React, { PureComponent } from 'react';
import connect from 'dva';
import { List, Card, Row, Button, Icon, Divider, Popconfirm, Form, Col, Input } from 'antd';
import router from 'umi/router';
import styles from './articleList.less';

const ListItem = List.Item
const FormItem = Form.Item

// 筛选栏grid配置
const colWrapper = {
  xl: 8, md: 12, sm: 24, xs: 24,
}

const data = [
  { title: '文章一按时大撒大撒大撒按时大撒大撒大撒按时大撒大撒大撒按时大撒大撒大撒按时大撒大撒大撒按时大撒大撒大撒按时大撒大撒大撒', content: 'asdsadsadsadassssssssssssssssssssssssss', author: '马云', id: '001' },
  { title: '按时大撒大撒大撒', content: 'asdsadsadsadassssssssssssssssssssssssss', author: '啊是大', id: '002' },
  { title: '撒大苏打撒旦撒旦', content: 'asdsadsadsadassssssssssssssssssssssssss', author: '啊是大', id: '003' },
]

@Form.create()
export default class ArticleList extends PureComponent {

  // 点击新增文章
  handleAddArticle = () => {
    router.push('/training/library/article/add')
  }

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props
    return (
      <div className={styles.articleList}>
        <Row gutter={8}>
          <Form>
            <Col {...colWrapper}>
              <FormItem>
                {getFieldDecorator('title')(
                  <Input placeholder="请输入文章标题" />
                )}
              </FormItem>
            </Col>
            <Col {...colWrapper}>
              <FormItem>
                {getFieldDecorator('author')(
                  <Input placeholder="请输入文章作者" />
                )}
              </FormItem>
            </Col>
          </Form>
          <Col {...colWrapper}>
            <FormItem>
              <Button type="primary" onClick={this.handleAddArticle}>新增</Button>
            </FormItem>
          </Col>
        </Row>
        <List
          grid={{ gutter: 16, column: 1 }}
          dataSource={data}
          renderItem={item => (
            <ListItem>
              <Card className={styles.cardContainer}>
                <div className={styles.firstLine}>
                  <div className={styles.title}>{item.title}</div>
                  <div className={styles.rightIcon}>
                    <Icon className={styles.icon} type="edit" onClick={() => { router.push(`/training/library/article/edit/${item.id}`) }} />
                    <Divider type="vertical" />
                    <Popconfirm title="确认删除该试题吗？" onConfirm={() => { console.log('delete') }}>
                      <Icon className={styles.icon} type="close" />
                    </Popconfirm>
                  </div>
                </div>
                <div className={styles.introduction}>
                  <span>作者：</span>
                  <span>{item.author}</span>
                </div>
              </Card>
            </ListItem>
          )}
        >

        </List>
      </div>
    )
  }
}
