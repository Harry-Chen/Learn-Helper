import React from 'react';

export const renderHTML = (content?: string) =>
  React.createElement('span', {
    dangerouslySetInnerHTML: { __html: content },
    style: { display: 'contents' },
  });
