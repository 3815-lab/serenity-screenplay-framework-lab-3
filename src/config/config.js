export const BASE_URL = __ENV.BASE_URL || 'https://fakestoreapi.com';

// Dynamic Configuration reading from Environment Variables
export const TEST_CONFIG = {
    TARGET_TPS: __ENV.TARGET_TPS || 22,
    MAX_VUS: __ENV.MAX_VUS || 100,
    DURATION: __ENV.DURATION || '1m',
    REQ_DURATION_THRESHOLD: __ENV.REQ_DURATION_THRESHOLD || 1500,
};

export const THRESHOLDS = {
    // Requirements from Exercise 1 (Dynamic)
    'http_req_duration': [`p(95)<${TEST_CONFIG.REQ_DURATION_THRESHOLD}`],
    'http_req_failed': ['rate<0.03'],  // Error rate must be less than 3%
};

export const REQUEST_HEADERS = {
    'Content-Type': 'application/json',
};
