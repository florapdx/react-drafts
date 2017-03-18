import React, { PropTypes } from 'react';

function Video(props) {
  const { src, caption } = props.blockProps || props;
  return (
    <figure className="content-editor__custom-block video">
      <div className="video-wrapper">
        <iframe src={src} frameBorder="0" allowFullScreen />
      </div>
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

Video.propTypes = {
  props: PropTypes.shape({
    blockProps: PropTypes.shape({
      src: PropTypes.string,
      caption: PropTypes.string
    })
  })
};

export default Video;
