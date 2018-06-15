<<<<<<< HEAD
import city from './geographic/city.json';
import province from './geographic/province.json';

export function getProvince(req, res) {
  res.json(province);
}

export function getCity(req, res) {
  res.json(city[req.params.province]);
=======
function getJson(infoType) {
  const json = require(`${__dirname}/geographic/${infoType}.json`); // eslint-disable-line
  return json;
}

export function getProvince(req, res) {
  res.json(getJson('province'));
}

export function getCity(req, res) {
  res.json(getJson('city')[req.params.province]);
>>>>>>> init
}

export default {
  getProvince,
  getCity,
};
