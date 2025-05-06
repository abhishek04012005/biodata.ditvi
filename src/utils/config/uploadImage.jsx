import { supabase } from './supabase';

export const uploadImage = async (file) => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}-${Date.now()}.${fileExt}`;
    const filePath = `biodata-images/${fileName}`;

    // Upload file to Supabase storage
    const { error: uploadError } = await supabase.storage
      .from('biodata-images')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // Get the public URL of the uploaded image
    const { data: { publicUrl } } = supabase.storage
      .from('biodata-images')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};