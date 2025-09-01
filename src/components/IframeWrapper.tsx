interface IframeWrapperProps {
  className?: string;
  url: string;
}

const IframeWrapper = ({ className, url }: IframeWrapperProps) => {
  return (
    <iframe
      title={url}
      className={className}
      src={url}
      sandbox={[
        'allow-forms',
        'allow-modals',
        'allow-popups',
        'allow-scripts',
        'allow-same-origin',
        'allow-downloads',
      ].join(' ')}
    />
  );
};

export default IframeWrapper;
