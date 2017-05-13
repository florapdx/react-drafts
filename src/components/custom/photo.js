import React from 'react';
import PropTypes from 'prop-types';

function Photo(props) {
  const {
    src,
    caption,
    width,
    height,
    href,
    target
  } = props.blockProps || props;

  // max-height supports image responsiveness for smaller screens
  const styles = {
    width: width && `${width}px`,
    maxHeight: height && `${height}px`
  };

  return (
    <figure className="content-editor__custom-block photo">
      {
        href ? (
          <a
            href={href}
            target={target ? "_blank" : "_self"}
            rel={target ? "noopener noreferrer" : ""}
          >
            <img
              src={src}
              style={styles}
            />
          </a>
        ) : (
          <img
            src={src}
            style={styles}
          />
        )
      }
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
