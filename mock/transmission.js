const myItem = {
  name: '常熟市鑫博伟纺织有限公司',
  praticalAddress: '常熟市朝阳区北京路1号',
  leader: '张三',
  phone: '13912345678',
  hostQuantity: 3,
};
const getDeviceList = [];
for (
  let i = 0;
  i < 9;
  i++ // eslint-disable-line
)
  getDeviceList[i] = { ...myItem, id: i };

const deviceData = [
  {
    index: '00001',
    brand: '海湾',
    model: 'ZCY-001',
    position: '5号楼5层东大厅301室内东侧',
    productionDate: '2017-05-10',
    hostQuantity: 3,
  },
];

const hostData = [1, 2, 3].map(n => ({
  index: `Y00${n}`,
  brand: '蓝天',
  model: 'HCD-01',
  interface: n,
  position: '5号楼5层东大厅301室内东侧',
  productionDate: '2017-05-10',
}));

const getDeviceDetail = [0, 1].map(n => ({ index: n, deviceData, hostData }));

const deviceResponse = { data: { list: getDeviceList } };
const deviceDetailResponse = { data: getDeviceDetail };

export { deviceResponse, deviceDetailResponse };
