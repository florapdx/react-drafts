import React, { PropTypes } from 'react';

function Link(props) {
  const { url, text, children } = props;
  return (
    <a
      className="content-editor__custom-block link"
      href={url}
      alt={text}
      onClick={() => window.open(url, '_blank, noopener, noreferrer')}
    >
      {children || text}
    </a>
  );
}

export default Link;
