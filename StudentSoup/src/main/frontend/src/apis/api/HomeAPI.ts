import axios from 'axios';

export const SchoolList = async () => {
  return await axios.get('/home');
};
