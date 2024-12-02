import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import {useDispatch,useSelector} from 'react-redux';
import { makeActiveSurvey } from './../redux/actions/surveyActions';

function SurveyDetails() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [error, setError] = useState(null);
  const [survey, setSurvey] = useState(null);
  const [surveyLoading, setSurveyLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [questionsLoaded, setQuestionsLoaded] = useState(false);
  const [newQuestion, setNewQuestion] = useState({ text: '', question_type: 'text' });


  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  useEffect(() => {
    if (token) {
      if (!survey){
        fetchSurveyDetails();
      }
    } else {
      navigate('/login');
    }
  }, []);

 
  const fetchSurveyDetails = async () => {
    setError(null);
    setSurveyLoading(true);
    try {
      const response = await axios.get(`http://localhost:3000/api/v1/surveys/${id}`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      console.log("Survey Response:", response.data);
      setSurvey(response.data);
      console.log("Survey State:", survey);
    } catch (err) {
      setError('Failed to fetch survey details. Please try again later.');
      console.error(err);
    } finally {
      if (survey) {
        setSurveyLoading(false);
      }
    }
  };

  const handleToggle = async() => {
    const action = isActive ? 'mark_inactive' : 'mark_active';
    const confirmMessage = isActive ? 'Are you sure you want to deactivate this survey?' : 'Are you sure you want to activate this survey?';
    if (!window.confirm(confirmMessage)) {
      return;
    }
    setLoading(true);
    setError(null);

    const response = await dispatch(makeActiveSurvey(token, id, action));
    if (response.success) {
      alert('Survey activated successfully!');
    }else{
      console.log(response)
      setError(response.message || 'Failed to activate survey.');
    }
    setLoading(false);
  };

  const fetchQuestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `http://localhost:3000/api/v1/surveys/${survey.id}/questions`,
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setQuestions(response.data.data);
      setQuestionsLoaded(true);
    } catch (err) {
      setError('Failed to load questions. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (questionId, value) => {
    setResponses((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleFillSurvey = async (e) => {
    e.preventDefault();
    setFormSubmitted(true)
    const unansweredQuestions = questions.filter(
      (question) => !responses[question.id] || responses[question.id].length === 0
    );

    if (unansweredQuestions.length > 0) {
      return;
    }
    const payload = {
      responses: questions.map((question) => ({
        question_id: question.id,
        answer: responses[question.id],
      })),
    };
    try {
      const response = await axios.post(
        `http://localhost:3000/api/v1/surveys/${id}/responses`,
        payload,
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      alert('Submitted successfully!');
      console.log('Submitted responses:', responses);
      navigate('/');
    } catch (error) {
      alert('Failed to submit responses. Please try again.');
    }
  };

  const renderInput = (question) => {
    const { id, question_type } = question;
    const options = question.options ? question.options.split(',') : [];
    const isInvalid = formSubmitted && (!responses[id] || responses[id].length === 0);
  
    switch (question_type) {
      case 'boolean':
        return (
          <select
            className={`form-select ${isInvalid ? 'is-invalid' : ''}`}
            value={responses[id] || ''}
            onChange={(e) => handleInputChange(id, e.target.value)}
          >
            <option value="">Select</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        );
      case 'multiple-choice':
        return (
          <select
            className={`form-select ${isInvalid ? 'is-invalid' : ''}`}
            value={responses[id] || ''}
            onChange={(e) => handleInputChange(id, e.target.value)}
          >
            <option value="">Select</option>
            {options.map((option, index) => (
              <option key={index} value={option.trim()}>
                {option.trim()}
              </option>
            ))}
          </select>
        );
      case 'multi-select':
        return (
          <select
            className={`form-select ${isInvalid ? 'is-invalid' : ''}`}
            multiple
            value={responses[id] || []}
            onChange={(e) => {
              const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
              handleInputChange(id, selectedOptions);
            }}
          >
            {options.map((option, index) => (
              <option key={index} value={option.trim()}>
                {option.trim()}
              </option>
            ))}
          </select>
        );
      case 'text':
      default:
        return (
          <input
            type="text"
            className={`form-control ${isInvalid ? 'is-invalid' : ''}`}
            placeholder="Your answer"
            value={responses[id] || ''}
            onChange={(e) => handleInputChange(id, e.target.value)}
          />
        );
    }
  };
  
  const handleAddQuestion = async (e) => {
    e.preventDefault();
    setLoading(true);
    setQuestionsLoaded(false);
    setError(null);
    try {
      const response = await axios.post(
        `http://localhost:3000/api/v1/surveys/${survey.id}/questions`,
        newQuestion,
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
          },
        }
      );
      alert('Question added successfully!');
      setNewQuestion({ text: '', question_type: 'text' });
      fetchQuestions();
    } catch (err) {
      setError('Failed to add question. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      { survey && 
    <div className="container mt-4">
      <div className="d-flex">
        <h2>Survey Details</h2>
      </div>
        <div className="card mt-3">
          <div className="card-body ">
            <div className='d-flex justify-content-between align-items-center'>
              <h5 className="card-title">{survey.title}</h5>
              {userRole === 'admin' && <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="surveyToggle"
                    checked={isActive}
                    onChange={handleToggle}
                  />
                  <label className="form-check-label" htmlFor="surveyToggle">
                    {isActive ? 'Active' : 'Inactive'}
                  </label>
              </div>}
            </div>
            <p className="card-text">{survey.description}</p>
            <p className="card-text">
              <strong>Start Date:</strong> {new Date(survey.starting_date).toLocaleDateString()}
            </p>
            <p className="card-text">
              <strong>End Date:</strong> {new Date(survey.closing_date).toLocaleDateString()}
            </p>
            {userRole !== 'admin' && <p className="card-text">
                <strong>Status:</strong> {survey.status}
              </p>
            }
          </div>
        </div>
      
        {!questionsLoaded && (survey.status === 'active' || userRole === 'admin') && (
          <button className="btn btn-primary mt-3" onClick={fetchQuestions} disabled={loading}>
            {loading ? 'Loading...' : 'Load Questions'}
          </button>
        )}

        {error && <div className="alert alert-danger mt-3">{error}</div>}
        {(survey.status === 'active' || userRole === 'admin') && (<>
          {questions.length > 0 ? <>
              <form onSubmit={handleFillSurvey} className="mt-4">
                <h3>Questions</h3>
                <div className="list-group">
                  {questions.map((question) => (
                    
                    <li key={question.id} className="list-group-item">
                      <p>{question.text}</p>
                      {renderInput(question)}
                    </li>
                  ))}
                </div>
                { userRole === 'customer'   && <button type="submit" className="btn btn-success mt-3">
                  Submit
                </button>}
              </form>
            </>      
            : 
            <>
              {questionsLoaded &&
              <div class="alert alert-info m-3" role="alert">
                There are no questions at the movement.
              </div>}
            </>
          }
          {(userRole === 'admin' && questionsLoaded) && (
              <form onSubmit={handleAddQuestion} className="mt-4">
                <h3>Add a New Question</h3>
                <div className="mb-3">
                  <label htmlFor="questionText" className="form-label">
                    Question Text
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="questionText"
                    value={newQuestion.text}
                    onChange={(e) => setNewQuestion({ ...newQuestion, text: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="questionType" className="form-label">
                    Question Type
                  </label>
                  <select
                    className="form-select"
                    id="questionType"
                    value={newQuestion.question_type}
                    onChange={(e) =>
                      setNewQuestion({ ...newQuestion, question_type: e.target.value, options: '' })
                    }
                  >
                    <option value="text">Text</option>
                    <option value="boolean">Boolean</option>
                    <option value="multiple-choice">Multiple Choice</option>
                    <option value="multi-select">Multi-Select</option>
                  </select>
                </div>
                {(newQuestion.question_type === 'multiple-choice' ||
                  newQuestion.question_type === 'multi-select') && (
                  <div className="mb-3">
                    <label htmlFor="questionOptions" className="form-label">
                      Options (comma-separated)
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="questionOptions"
                      placeholder="e.g., option1, option2, option3"
                      value={newQuestion.options || ''}
                      onChange={(e) => setNewQuestion({ ...newQuestion, options: e.target.value })}
                      required
                    />
                  </div>
                )}
                <button type="submit" className="btn btn-primary">
                  Add Question
                </button>
              </form>
          )}

        </>)}
      </div>

    } 
    </>
  );
}

export default SurveyDetails;