import React, { PropTypes } from 'react';

function Video(props) {
  const { src, caption } = props.blockProps || props;
  return (
    <figure className="custom-block photo">
      <iframe src={src} frameBorder="0" allowFullScreen />
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

Video.propTypes = {
  props: PropTypes.shape({
    blockProps: PropTypes.shape({
      src: PropTypes.string,
      caption: PropTypes.string
    })
  })
};

export default Video;
