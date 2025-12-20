import { v2 as cloudinary } from 'cloudinary';

export const PhotoProvider = {
  provide: 'CLOUDINATY',
  useFactory: () => {
    return cloudinary.config({
      isGlobal: true,
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  },
};
