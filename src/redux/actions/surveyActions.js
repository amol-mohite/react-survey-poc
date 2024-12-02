import axios from 'axios';
const API_BASE_URL = 'http://localhost:3000';

export const fetchSurveys = (token) => async (dispatch) => {
  try {
    console.log(token)
    const response = await axios.get(`${API_BASE_URL}/api/v1/surveys`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    dispatch({ type: 'FETCH_SURVEYS_SUCCESS', payload: response.data });
  } catch (error) {
    dispatch({ type: 'FETCH_SURVEYS_FAILURE', payload: error.message });
  }
};

export const fetchSurveyDetails = (token, id) => async (dispatch) => {
  try {
    console.log(token)
    const response = await axios.get(`${API_BASE_URL}/api/v1/surveys/${id}`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    dispatch({ type: 'FETCH_SURVEY_DETAILS_SUCCESS', payload: response.data });
  } catch (error) {
    dispatch({ type: 'FETCH_SURVEY_DETAILS_FAILURE', payload: error.message });
  }
};

export const createSurvey = (token, params) => async (dispatch) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/surveys/`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: params,
    });

    if (response.ok) {
      const data = await response.json();
      dispatch({ type: 'CREATE_SURVEY_SUCCESS', payload: data });
      return { success: true };
    } else {
      const error = await response.json();
      dispatch({
        type: 'CREATE_SURVEY_FAILURE',
        payload: error.message || 'Failed to create survey',
      });
      return { success: false, message: 'Failed to create survey due to '+ error.error };
    }
  } catch (error) {
    console.error('Error:', error);
    dispatch({
      type: 'CREATE_SURVEY_FAILURE',
      payload: error.error || 'Unexpected error occurred.',
    });
    return { success: false, message: error.error || 'Unexpected error occurred.' };
  }
};


export const makeActiveSurvey = (token, surevey_id, action) => async (dispatch) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/surveys/${surevey_id}/${action}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      }
    });

    if (response.ok) {
      const data = await response.json();
      dispatch({ type: 'MAKE_SURVEY_ACTIVE_SUCCESS', payload: data });
      return { success: true };
    } else {
      const error = await response.json();
      dispatch({
        type: 'MAKE_SURVEY_ACTIVE_FAILURE',
        payload: error.message || 'Failed to create survey',
      });
      return { success: false, message: error.errors };
    }
  } catch (error) {
    console.error('Error:', error);
    dispatch({
      type: 'MAKE_SURVEY_ACTIVE_FAILURE',
      payload: error.error || 'Unexpected error occurred.',
    });
    return { success: false, message: error.error || 'Unexpected error occurred.' };
  }
};
