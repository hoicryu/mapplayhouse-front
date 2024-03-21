import DOMPurify from 'dompurify';
import React from 'react';

const sanitizeHtml = (html, { className } = {}) =>
  React.createElement('div', {
    dangerouslySetInnerHTML: { __html: DOMPurify.sanitize(html) },
    ...(className ? { className } : {}),
  });

export default sanitizeHtml;
