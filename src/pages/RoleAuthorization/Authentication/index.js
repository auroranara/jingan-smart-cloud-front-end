import React, { PureComponent } from 'react';
import { connect } from 'dva';
import Authentication from './Authentication';
import CompanyList from './CompanyList';

@connect(({ user }) => ({
  user,
}))
export default class AppManagement extends PureComponent {
  state = {
    companyId: undefined,
  };

  handleParentChange = newState => {
    this.setState(newState);
  };

  render() {
    const {
      user: {
        currentUser: { unitType },
      },
    } = this.props;
    const { companyId } = this.state;

    return +unitType === 4 || companyId ? (
      <Authentication handleParentChange={this.handleParentChange} companyId={companyId} />
    ) : (
      <CompanyList handleParentChange={this.handleParentChange} />
    );
  }
}
