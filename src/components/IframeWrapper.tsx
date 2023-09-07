import React, { Fragment } from 'react';
import Iframe from 'react-iframe';

import { addCSRFTokenToIframeUrl } from '../utils/format';
import { useAppSelector } from '../redux/hooks';

interface IframeWrapperProps {
  id?: string;
  className?: string;
  url: string;
}

const IframeWrapper = ({ id, className, url }: IframeWrapperProps) => {
  const csrfToken = useAppSelector((state) => state.helper.helper.getCSRFToken());

  return (
    <Fragment key={url}>
      <Iframe id={id} className={className} url={addCSRFTokenToIframeUrl(csrfToken, url)}></Iframe>
    </Fragment>
  );
};

export default IframeWrapper;
