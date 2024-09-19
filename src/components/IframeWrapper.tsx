import { Fragment } from 'react';
import Iframe from 'react-iframe';

interface IframeWrapperProps {
  id?: string;
  className?: string;
  url: string;
}

const IframeWrapper = ({ id, className, url }: IframeWrapperProps) => {
  return (
    <Fragment key={url}>
      <Iframe
        id={id}
        className={className}
        url={url}
        sandbox={[
          'allow-forms',
          'allow-modals',
          'allow-popups',
          'allow-scripts',
          'allow-same-origin',
          // biome-ignore lint/suspicious/noExplicitAny: wrong type
          'allow-downloads' as any,
        ]}
      />
    </Fragment>
  );
};

export default IframeWrapper;
