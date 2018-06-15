import Authorized from './Authorized';
import AuthorizedRoute from './AuthorizedRoute';
import Secured from './Secured';
import check from './CheckPermissions.js';
<<<<<<< HEAD
import renderAuthorize from './renderAuthorize';
=======

/* eslint-disable import/no-mutable-exports */
let CURRENT = 'NULL';
>>>>>>> init

Authorized.Secured = Secured;
Authorized.AuthorizedRoute = AuthorizedRoute;
Authorized.check = check;

<<<<<<< HEAD
export default renderAuthorize(Authorized);
=======
/**
 * use  authority or getAuthority
 * @param {string|()=>String} currentAuthority
 */
const renderAuthorize = currentAuthority => {
  if (currentAuthority) {
    if (currentAuthority.constructor.name === 'Function') {
      CURRENT = currentAuthority();
    }
    if (currentAuthority.constructor.name === 'String') {
      CURRENT = currentAuthority;
    }
  } else {
    CURRENT = 'NULL';
  }
  return Authorized;
};

export { CURRENT };
export default renderAuthorize;
>>>>>>> init
