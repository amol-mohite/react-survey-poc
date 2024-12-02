import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {useDispatch,useSelector} from 'react-redux';
import { createSurvey } from './../redux/actions/surveyActions';

function NewSurvey() {
  const dispatch = useDispatch();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startingDate, setStartingDate] = useState('');
  const [closingDate, setClosingDate] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const {surveys, errors } = useSelector((state) => state.surveys);

    
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !startingDate || !closingDate) {
      setError('All fields are required.');
      return;
    }
    setError('');
    try {
      const body = new URLSearchParams({title, description, starting_date: startingDate, closing_date: closingDate})
      const result = await dispatch(createSurvey(token, body));
      console.log(result)
      if (result.success) {
        alert('Survey created successfully!');
        navigate('/')
      }else{
        setError(result.message || 'Failed to create survey.');
      }

      //const response = dispatch(createSurvey(token, body)); 
      // console.log(response);
      // if (response.success) {
      //   alert('Survey created successfully!');
      //   navigate('/');
      // } else {
      //   setError(response.message || 'Failed to create survey.');
      // }
      
      //navigate('/')
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while creating the survey.');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Create a New Survey</h2>
      {error && <p className="text-danger">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Title
          </label>
          <input
            type="text"
            className="form-control"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea
            className="form-control"
            id="description"
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>

        <div className="mb-3">
          <label htmlFor="startingDate" className="form-label">
            Starting Date
          </label>
          <input
            type="date"
            className="form-control"
            id="startingDate"
            value={startingDate}
            onChange={(e) => setStartingDate(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="closingDate" className="form-label">
            Closing Date
          </label>
          <input
            type="date"
            className="form-control"
            id="closingDate"
            value={closingDate}
            onChange={(e) => setClosingDate(e.target.value)}
          />
        </div>

        <div className="d-flex justify-content-end">
          <button
            type="button"
            className="btn btn-secondary me-2"
            onClick={() => navigate('/')}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default NewSurvey;
