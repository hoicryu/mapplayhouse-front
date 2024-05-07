import { IMAGE_API_URL, getRecentImages } from '@api';
import { Image } from '@constants';
import React from 'react';
import { useQuery } from 'react-query';

const Images: React.FC<any> = ({ inView }) => {
  const { data: images, isError, isSuccess } = useQuery<Image[]>('images', getRecentImages());
  console.log(images);
  if (isError) {
    return (
      <div className="h-32 flex items-center justify-center">
        <span className="text-theme-gray">무대 사진이 없습니다.</span>
      </div>
    );
  }

  return (
    isSuccess && (
      <div className="px-4 grid grid-cols-2 gap-4">
        {images.map((img) => (
          <div className="rounded-2xl">
            <img className="rounded-2xl" src={`${IMAGE_API_URL + img.image_path}`} alt={`img-${img.id}`} />
          </div>
        ))}
      </div>
    )
  );
};
export default React.memo(Images);
