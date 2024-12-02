const initialState = {
  surveys: [],
  loading: false,
  error: null,
};

const surveyReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_SURVEYS_SUCCESS':
      return { ...state, surveys: action.payload, loading: false, error: null };
    case 'FETCH_SURVEYS_FAILURE':
      return { ...state, error: action.payload, loading: false };
    case 'FETCH_SURVEY_DETAILS_SUCCESS':
      return { ...state, surveys: action.payload, loading: false, error: null };
    case 'FETCH_SURVEY_DETAILS_FAILURE':
      return { ...state, error: action.payload, loading: false };
    case 'CREATE_SURVEY_SUCCESS':
      return { ...state, surveys: [...state.surveys, action.payload], loading: false, errors: null };
    case 'CREATE_SURVEY_FAILURE':
      case 'CREATE_SURVEY_FAILURE':
      return { ...state, error: action.payload, loading: false };
    
    default:
      return state;
  }
};

export default surveyReducer;
