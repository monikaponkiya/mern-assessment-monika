import axios from 'axios';

import { BASE_URL } from '../../utils/constant';

export const apiInstance = axios.create({
  baseURL: BASE_URL
});
