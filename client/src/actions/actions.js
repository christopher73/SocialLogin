import ActionTypes from '../constants/ActionTypes';
import jwt_decode from 'jwt-decode';
import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';
axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

//register user
export const registerUser = (userData, history) => dispatch => {
  axios
    .post('api/v1/users/register', userData)
    .then(res => history.push('/dashboard')) //will change in future
    .catch(err => {
      console.log(err);
      dispatch({
        type: ActionTypes.GET_ERRORS,
        payload: err.response.data
      });
    });
};
export const registerFacebook = response => dispatch => {
  const tokenBlob = new Blob(
    [JSON.stringify({ access_token: response.accessToken }, null, 2)],
    { type: 'application/json' }
  );
  const options = {
    method: 'POST',
    body: tokenBlob,
    mode: 'cors',
    cache: 'default'
  };
  fetch('http://localhost:5033/api/v1/auth/facebook', options).then(res => {
    // Save to localStorage
    // Set token to localStorage
    console.log(res.data);
    const { token } = res.data;
    localStorage.setItem('jwtToken', token);
    // Set token to Auth header
    setAuthToken(token);
    // Decode token to get user data
    const decoded = jwt_decode(token);
    // Set current user
    dispatch(setCurrentUser(decoded));
  });
};
export const registerGoogle = response => dispatch => {
  //
  dispatch(setCurrentUser(response));
  console.log(response);
};
//login user
export const loginUser = userData => dispatch => {
  console.log(userData);
  axios
    .post('http://127.0.0.1:5033/api/v1/users/login', userData)
    .then(res => {
      // Save to localStorage
      // Set token to localStorage
      console.log(res.data);
      const { token } = res.data;
      localStorage.setItem('jwtToken', token);
      // Set token to Auth header
      setAuthToken(token);
      // Decode token to get user data
      const decoded = jwt_decode(token);
      // Set current user
      dispatch(setCurrentUser(decoded));
    })
    .catch(err => console.log(err));
};
// Set logged in user
export const setCurrentUser = decoded => {
  return {
    type: ActionTypes.SET_CURRENT_USER,
    payload: decoded
  };
};
// Log user out
export const logoutUser = () => dispatch => {
  // Remove token from local storage
  localStorage.removeItem('jwtToken');
  // Remove auth header for future requests
  setAuthToken(false);
  // Set current user to empty object {} which will set isAuthenticated to false
  dispatch(setCurrentUser({}));
};
