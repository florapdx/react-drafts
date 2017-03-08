import React, { PropTypes, Component } from 'react';

function Document(props) {
  const { file, caption } = props.blockProps || props;
  return (
    <figure className="custom-block document">
      {
        file.src &&
          <iframe
            src={file.src}
            width="440px"
            height="570px"
            frameBorder="0"
            allowFullScreen={false}
          />
      }
      <a>{file.name}</a>
      <figcaption>{caption}</figcaption>
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
