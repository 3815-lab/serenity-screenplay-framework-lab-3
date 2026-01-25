import http from 'k6/http';
import { BASE_URL, REQUEST_HEADERS } from '../config/config.js';
import { API_ENDPOINTS } from '../config/endpoints.js';

export class AuthService {
    /**
     * Authenticates a user against the API.
     * @param {string} username 
     * @param {string} password 
     * @returns {import('k6/http').RefinedResponse} K6 HTTP Response
     */
    login(username, password) {
        const payload = JSON.stringify({
            username: username,
            password: password,
        });

        const res = http.post(`${BASE_URL}${API_ENDPOINTS.LOGIN}`, payload, {
            headers: REQUEST_HEADERS,
            tags: { name: 'Login' },
        });

        return res;
    }
}
