import Photo from '../components/custom/photo';
import Video from '../components/custom/video';

function blockRenderer(atomicData) {
  const { type } = atomicData;

  let block;
  if (type) {
    return {
      component: type === 'photo' ? Photo : Video,
      editable: false,
      atomicData
    };
  }
}
