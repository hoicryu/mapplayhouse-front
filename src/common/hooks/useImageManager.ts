import { createImage, destroyImage } from '@api';
import { Image } from '@constants';
import { convertObjectToFormData } from '@utils';
import { useCallback, useState } from 'react';
import { forEach } from 'lodash';
import { useMutation } from 'react-query';

export const useImageManager = (imagableType, defaultImages: Image[] = []) => {
  const [images, setImages] = useState<Image[]>(defaultImages);

  const [state, setState] = useState({
    isUploading: false,
    isError: false,
    error: null,
  });
  const { isUploading, isError, error } = state;

  const { mutate } = useMutation(createImage(), {
    onSuccess: (image) => {
      setImages((data) => [...data, image]);
      setState((state) => ({ ...state, isUploading: false }));
    },
    onError: (e) => {
      setState((state) => ({ ...state, isError: true, error: e }));
      setState((state) => ({ ...state, isUploading: false }));
    },
  });

  const inputRef = useCallback((el: HTMLInputElement) => {
    if (!el) return;

    const uploadImages = async (imageFiles: FileList) => {
      setState((state) => ({ ...state, isUploading: true, isError: false }));
      try {
        const imagesPromise = Array.from(imageFiles).map(async (imageFile) => {
          const formData = new FormData();
          Object.entries({ image: imageFile, imagable_type: imagableType }).forEach(([k, v]) =>
            formData.append(`image[${k}]`, v),
          );
          // formData.append('image', imageFile);
          // return await createImage(formData);
          return await mutate(formData);
        });
        // for await (const image of imagesPromise) {
        //   setImages((images) => [...images, image]);
        // }
      } catch (error) {
        setState((state) => ({ ...state, isError: true, error }));
      }
    };
    el.onchange = (e: any) => {
      uploadImages(e.target.files);
      el.value = null;
    };
  }, []);

  const deleteImage = (image: Image) => {
    if (!image?.id) throw new Error("'image' in 'deleteImage' function has invalid id");
    destroyImage(image.id)();
    setImages((images) => images.filter((each) => each.id !== image.id));
  };

  return { images, setImages, isUploading, isError, error, deleteImage, inputRef };
};
