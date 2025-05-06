import { supabase } from './supabase';

export const BiodataStorage = {
  async saveBiodata(formData) {
    try {
      // Prepare the data for database storage
      const { data, error } = await supabase
        .from('user_requests')
        .insert([{
          name: formData.name,
          personal_data: formData.personalData,
          professional_data: formData.professionalData,
          education_data: formData.educationData,
          family_data: formData.familyData,
          contact_data: formData.contactData, // This matches the database column name
          profile_url: formData.profileImage,
          guest_detail_id: formData.guestDetailId,
          biodata_details: formData.biodataDetails
        }])
        .select()
        .single();

      if (error) throw error;

      // Map the data back to frontend format
      return {
        name: data.name,
        personalData: data.personal_data,
        professionalData: data.professional_data,
        educationData: data.education_data,
        familyData: data.family_data,
        contactData: data.contact_data,
        profileImage: data.profile_url,
        guestDetailId: data.guest_detail_id,
        biodataDetails: data.biodata_details
      };
    } catch (error) {
      console.error('Error saving biodata:', error);
      throw error;
    }
  }
};

export const GuestStorage = {
  async saveGuestDetails(guestData) {
    try {
      const { data, error } = await supabase
        .from('guest_details')
        .insert([{  
          name: guestData.name,
          mobile_number: guestData.whatsapp
        }])
        .select('id')
        .single();

      if (error) throw error;

      return data.id;
    } catch (error) {
      console.error('Error saving guest details:', error);
      throw error;
    }
  }
};