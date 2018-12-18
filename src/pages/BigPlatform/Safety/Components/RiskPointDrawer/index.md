# props属性详解
* drawerProps={{ width: 200, onClose: this.handleClose }} 抽屉组件可以设置的属性对象
* levelName="黄" 抽屉显示的风险等级名称
* data={this.props.bigPlatform.countDangerLocationForCompany} 数据源

# 使用示例
renderRiskPointDrawer() {
  const { bigPlatform: { countDangerLocationForCompany } } = this.props;
  const { riskPointDrawerVisible, riskPointDrawerLevel } = this.state;
  return (
    <RiskPointDrawer visible={riskPointDrawerVisible}
      drawerProps={{
        width: '30%',
        closable: false,
        visible: riskPointDrawerVisible,
        style: { padding: 0 },
        onClose: () => { this.setState({ riskPointDrawerVisible: false }) },
      }}
      levelName={riskPointDrawerLevel}
      data={countDangerLocationForCompany}
    />
  );
}
