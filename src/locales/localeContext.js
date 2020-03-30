import React from 'react';
import { addLocaleData, IntlProvider } from 'umi/locale';
import { ConfigProvider } from 'antd';
import enLocale from './en-US';
import cnLocale from './zh-CN';

const Context = React.createContext();

function getLang() {
  if (window.localStorage && localStorage.getItem('locale')) {
    return localStorage.getItem('locale');
  }
  return (navigator.language || navigator.browserLanguage).toLowerCase() === 'en-us'
    ? 'en-US'
    : 'zh-CN';
}

export class LocalComponent extends React.PureComponent {
  state = {
    locale: getLang(),
  };

  changeLocal = () => {
    this.setState({
      locale: getLang(),
    });
  };

  render() {
    const { children } = this.props;
    const { locale } = this.state;
    return (
      <Context.Provider
        value={{
          appLocale: locale === 'zh-CN' ? cnLocale : enLocale,
          changeLocal: this.changeLocal,
        }}
      >
        <Context.Consumer>
          {({ appLocale }) => {
            addLocaleData(appLocale.data);
            return (
              <IntlProvider locale={appLocale.locale} messages={appLocale.messages}>
                <ConfigProvider locale={appLocale.antd}>{children}</ConfigProvider>
              </IntlProvider>
            );
          }}
        </Context.Consumer>
      </Context.Provider>
    );
  }
}
export default Context;
