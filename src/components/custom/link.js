import React from 'react';
import PropTypes from 'prop-types';

function Link(props) {
  const { url, text, target, children } = props;

  let href = url;
  if (url.indexOf('@') >= 0 && url.indexOf('mailto:') < 0) {
    href = `mailto:${url}`;
  }

  return (
    <a
      className="content-editor__custom-block link"
      href={href}
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
