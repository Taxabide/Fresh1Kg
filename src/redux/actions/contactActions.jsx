import {
  SUBMIT_CONTACT_REQUEST,
  SUBMIT_CONTACT_SUCCESS,
  SUBMIT_CONTACT_FAILURE,
} from '../constants/actionTypes';
import { Alert } from 'react-native';

const CONTACT_API_URL = 'https://fresh1kg.com/api/add-contact-api.php';

export const submitContactForm = (formData) => async (dispatch) => {
  dispatch({ type: SUBMIT_CONTACT_REQUEST });

  try {
    // Validate form data
    if (!formData.contact_name?.trim()) throw new Error('Name is required');
    if (!formData.contact_email?.trim()) throw new Error('Email is required');
    if (!/\S+@\S+\.\S+/.test(formData.contact_email.trim())) throw new Error('Invalid email format');
    if (!formData.contact_phone?.trim()) throw new Error('Phone number is required');
    if (!/^\d{10,}$/.test(formData.contact_phone.replace(/\D/g, ''))) throw new Error('Invalid phone number');
    if (!formData.contact_subject?.trim()) throw new Error('Subject is required');
    if (!formData.contact_message?.trim()) throw new Error('Message is required');

    // Create URLSearchParams for the form data
    const params = new URLSearchParams();
    params.append('contact_name', formData.contact_name.trim());
    params.append('contact_email', formData.contact_email.trim());
    params.append('contact_phone', formData.contact_phone.replace(/\D/g, ''));
    params.append('contact_subject', formData.contact_subject.trim());
    params.append('contact_message', formData.contact_message.trim());

    console.log('Submitting form data:', {
      contact_name: formData.contact_name.trim(),
      contact_email: formData.contact_email.trim(),
      contact_phone: formData.contact_phone.replace(/\D/g, ''),
      contact_subject: formData.contact_subject.trim(),
      contact_message: formData.contact_message.trim()
    });

    const response = await fetch(CONTACT_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const responseText = await response.text();
    console.log('Raw API Response:', responseText);

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse API response:', e);
      throw new Error('Invalid response from server');
    }

    console.log('Parsed API Response:', data);

    if (data.status === 'success') {
      dispatch({ 
        type: SUBMIT_CONTACT_SUCCESS, 
        payload: data.message || 'Your message has been sent successfully!' 
      });
      Alert.alert(
        'Success',
        data.message || 'Your message has been sent successfully!',
        [{ text: 'OK' }]
      );
      return true;
    } else {
      throw new Error(data.message || 'Failed to send message');
    }
  } catch (error) {
    console.error('Contact form submission error:', error);
    dispatch({ 
      type: SUBMIT_CONTACT_FAILURE, 
      payload: error.message 
    });
    Alert.alert(
      'Error',
      error.message || 'An unexpected error occurred',
      [{ text: 'OK' }]
    );
    return false;
  }
}; 