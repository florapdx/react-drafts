import Divider from '../components/custom/divider';
import Photo from '../components/custom/photo';
import Rich from '../components/custom/rich';
import Document from '../components/custom/document';

/*
 * BlockRenderer is responsible for rendering custom block types.
 * Returns React component for block type w/entity data as props
 * (accessible in the component through `props.blockProps`,
 * and an `editable` state of false (in all cases).
 */
export function blockRenderer(toolbarControls, entityType, entityData) {
  if (entityType) {
    let component;
    if (entityType === toolbarControls.photo.id) {
      component = Photo;
    } else if (entityType === toolbarControls.rich.id) {
      component = Rich;
    } else if (entityType === toolbarControls.file.id) {
      component = Document;
    } else if (entityType === toolbarControls.divider.id) {
      component = Divider;
    }

    return {
      component,
      editable: false,
      props: entityData
    };
  }
}
