import React, { Component } from 'react';
import Result from 'components/Result';
import router from 'umi/router';
import { Card, Button } from 'antd'
import { setToken } from '@/utils/authority';
import styles from './RedirectLogin.less'

export default class RedirectLogin extends Component {

  state = {
    count: 10,
  }

  componentDidMount() {
    const {
      location: { query: { token } },
    } = this.props
    this.timer = setInterval(() => {
      let { count } = this.state
      if (count <= 0) {
        if (token) {
          this.toDashboard()
        } else router.push('/user')
        return
      }
      this.setState({
        count: --count,
      })
    }, 1000)
  }

  componentWillUnmount() {
    clearInterval(this.timer)
  }

  // 保存token并跳转到首页
  toDashboard = () => {
    const {
      location: { query: { token } },
    } = this.props
    setToken(token)
    router.push('/')
  }

  render() {
    const {
      location: { query: { token } },
    } = this.props
    const { count } = this.state
    return (
      <div className={styles.jumpLogin}>
        <Card style={{ width: '40%' }}>
          {token ? (
            <Result
              className={styles.result}
              type="success"
              title={<div className={styles.title}>跳转登录成功</div>}
              description={<span>将在{count}秒后跳转到首页……</span>}
              style={{ marginTop: 52 }}
              actions={(
                <div className={styles.actions}>
                  <Button onClick={this.toDashboard} size="large" type="primary">返回首页</Button>
                </div>
              )}
            />
          ) : (
              <Result
                className={styles.result}
                type="error"
                title={<div className={styles.title}>跳转登录失败</div>}
                description={<span>将在{count}秒后跳转到登录页……</span>}
                style={{ marginTop: 52 }}
                actions={(
                  <div className={styles.actions}>
                    <Button onClick={() => { router.push('/user') }} size="large" type="primary">返回登录页</Button>
                  </div>
                )}
              />
            )}
        </Card>
      </div>
    )
  }
}
