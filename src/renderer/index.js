import Photo from '../components/custom/photo';
import Video from '../components/custom/video';
import Document from '../components/custom/document';

/*
 * BlockRenderer is responsible for rendering custom block types.
 * Returns React component for block type w/props ('atomicData'),
 * accessible via `props.blockProps` in component, and
 * `contentEditable` state (false in all cases).
 */
export function blockRenderer(toolbarControls, entityType, entityData) {
  if (entityType) {
    let component;
    if (entityType === toolbarControls.photo.id) {
      component = Photo;
    } else if (entityType === toolbarControls.video.id) {
      component = Video;
    } else if (entityType === toolbarControls.file.id) {
      component = Document;
    }

    return {
      component,
      editable: false,
      props: entityData
    };
  }
}
