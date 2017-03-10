import React, { PropTypes, Component } from 'react';

function Document(props) {
  const { file, caption } = props.blockProps || props;
  let blockClass = 'custom-block document';
  if (caption) {
    blockClass += ' with-caption';
  }
  return (
    <figure className={blockClass}>
      <a
        className="file-name"
        href={file.src}
        download={file.name}
      >{file.name}</a>
      {
        caption && (
          <figcaption className="custom-block__caption">
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
      file: PropTypes.shape({}),
      caption: PropTypes.string
    })
  })
};

export default Document;
