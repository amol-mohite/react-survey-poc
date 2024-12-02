import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchSurveys } from './../redux/actions/surveyActions';
import {useDispatch,useSelector} from 'react-redux';


function Home() {
  const dispatch = useDispatch();
  const {surveys, error } = useSelector((state) => state.surveys);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    dispatch(fetchSurveys(token));
  }, []);

  return (
    <div className="container mt-4">
      <h2>Surveys</h2>
      {error && <p className="text-danger">{error}</p>}
      <ul className="list-group">
        {surveys.map((survey) => (
          <li 
            key={survey.id}
            className={'list-group-item list-group-item-action '+ (survey.status === 'active' ? ' list-group-item-primary' : ' list-group-item-dark ')}
            onClick={() => (survey.status === 'active' || userRole == 'admin') && navigate(`/survey/${survey.id}`, {state: { id: survey.id }})}
            style={{cursor: (survey.status === 'active' || userRole == 'admin') ? 'pointer' : 'not-allowed', marginBottom: '10px'}}
          >
            <div className="d-flex justify-content-between">
              <div>
                <h5>{survey.title}</h5>
                <p>{survey.description}</p>
                <p>
                  <strong>Start Date:</strong> {new Date(survey.starting_date).toLocaleDateString()}
                  <br />
                  <strong>End Date:</strong> {new Date(survey.closing_date).toLocaleDateString()}
                </p>
              </div>
              {survey.is_submitted && userRole == 'customer' &&(<div className="position-absolute top-0 end-0 bg-light px-2 py-1 border rounded">Already Submitted</div>)}
            </div>

          </li>
        ))}
      </ul>
    </div>
  );
}

export default Home;
