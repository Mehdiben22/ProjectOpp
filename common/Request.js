import AsyncStorage from '@react-native-async-storage/async-storage';
import { URL_API } from './Constant';

const Request = async (url, method, data) => {
  const storageGet = async () => {
    try {
      const value = await AsyncStorage.getItem('token');
      return value;
    } catch (error) {
      console.log(error);
    }
  };

  if (url !== undefined && method !== undefined) {
    let headers = {
      'Accept': 'application/json',
      'Authorization': await storageGet(),
    };

    let body;

    if (method.toUpperCase() === 'POST') {
      if (data !== undefined && data instanceof FormData) {
        // If data is FormData, set appropriate headers
        headers['Content-Type'] = 'multipart/form-data';
        body = data;
      } else if (data !== undefined) {
        // If data is JSON, stringify it
        headers['Content-Type'] = 'application/json';
        body = JSON.stringify(data);
      }

      return fetch(URL_API + url, {
        method: 'POST',
        body: body,
        headers: headers,
      });
    } else if (method.toUpperCase() === 'GET') {
      return fetch(URL_API + url, {
        headers: headers,
      });
    }
  }
};

export default Request;
