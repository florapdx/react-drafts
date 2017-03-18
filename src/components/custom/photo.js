import React, { PropTypes } from 'react';

function Photo(props) {
  const { src, caption } = props.blockProps || props;
  return (
    <figure className="content-editor__custom-block photo">
      <img src={src} />
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

Photo.propTypes = {
  props: PropTypes.shape({
    blockProps: PropTypes.shape({
      src: PropTypes.string,
      caption: PropTypes.caption
    })
  })
};

export default Photo;
