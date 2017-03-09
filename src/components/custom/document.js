import React, { PropTypes, Component } from 'react';

function Document(props) {
  const { file, caption } = props.blockProps || props;
  return (
    <figure className="custom-block document">
      <a
        className="file-name"
        href={file.src}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => () => window.open(file.src, 'blank')}
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
