import React, { PropTypes } from 'react';

function Photo(props) {
  const { src, file, caption } = props.blockProps || props;
  return (
    <div className="custom-block photo">
      <img src={src || file.preview} />
      {
        caption && <figcaption>{caption}</figcaption>
      }
    </div>
  );
}

Photo.propTypes = {
  props: PropTypes.shape({
    blockProps: PropTypes.shape({
      src: PropTypes.string,
      file: PropTypes.shape({}),
      caption: PropTypes.caption
    })
  })
};

export default Photo;
