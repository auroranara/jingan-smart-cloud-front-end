import React, { Component } from 'react';
import Result from 'components/Result';
import router from 'umi/router';
import { Card } from 'antd'
import { setToken } from '@/utils/authority';
import styles from './JumpLogin.less'

export default class JumpLogin extends Component {

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
          setToken(token)
          router.push('/')
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
              title={
                <div className={styles.title}>
                  跳转登录成功
            </div>
              }
              description={<span>将在{count}秒后跳转到首页……</span>}
              style={{ marginTop: 52 }}
            />
          ) : (
              <Result
                className={styles.result}
                type="error"
                title={
                  <div className={styles.title}>
                    跳转登录失败
            </div>
                }
                description={<span>将在{count}秒后跳转到登录页……</span>}
                style={{ marginTop: 52 }}
              />
            )}
        </Card>
      </div>
    )
  }
}
