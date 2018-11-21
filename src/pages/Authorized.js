import React from 'react';
import RenderAuthorized from '@/components/Authorized';
import { getAuthority } from '@/utils/authority';

import Link from 'umi/link';
import { formatMessage } from 'umi/locale';
import Exception from '@/components/Exception';

const Authorized = RenderAuthorized(getAuthority());

export default props => {
  // console.log(props);
  const {
    children,
    location: { pathname },
  } = props;

  const page403 = (
    <Exception
      type="403"
      desc={formatMessage({ id: 'app.exception.description.403' })}
      linkElement={Link}
      backText={formatMessage({ id: 'app.exception.back' })}
    />
  );

  return (
    <Authorized
      // authority={authorityFn(pathname)}
      authority={() => false}
      noMatch={page403}
    >
      {children}
    </Authorized>
  );
};
