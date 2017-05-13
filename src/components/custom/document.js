import React from 'react';
import PropTypes from 'prop-types';

function Document(props) {
  const { src, name, caption } = props.blockProps || props;

  let blockClass = 'content-editor__custom-block document';
  if (caption) {
    blockClass += ' with-caption';
  }

  return (
    <figure className={blockClass}>
      <a
        className="file-name"
        href={src}
        download={name}
      >
        {name}
      </a>
      {
        caption && (
          <figcaption className="caption">
            {caption}
          </figcaption>
        )
      }
    </figure>
  );
}

Document.propTypes = {
  props: PropTypes.shape({
    blockProps: PropTypes.shape({
      src: PropTypes.string,
      name: PropTypes.string,
      caption: PropTypes.string
    })
  })
};

export default Document;
