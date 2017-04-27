import React, { PropTypes } from 'react';

function Link(props) {
  const { url, text, target, children } = props;
  return (
    <a
      className="content-editor__custom-block link"
      href={url}
      alt={text}
      target={target ? "_blank" : "_self"}
      rel={target ? "noopener noreferrer" : ""}
      onClick={() => window.open(url, '_blank, noopener, noreferrer')}
    >
      {children || text}
    </a>
  );
}

export default Link;
