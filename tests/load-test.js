import { loginScenario } from '../src/scenarios/login-scenario.js';
import { THRESHOLDS, TEST_CONFIG } from '../src/config/config.js';
import { SharedArray } from 'k6/data';
import papaparse from '../src/lib/papaparse.js';
import { textSummary } from '../src/lib/k6-summary.js';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/2.4.0/dist/bundle.js';

// Load and filter data once
const csvData = new SharedArray('users', function () {
    const rawData = papaparse.parse(open('../src/data/users.csv'), { header: true }).data;
    return rawData.filter(user => user.user && user.user.trim() !== '' && user.passwd);
});

export const options = {
    thresholds: THRESHOLDS,
    scenarios: {
        login_test: {
            executor: 'constant-arrival-rate',
            rate: TEST_CONFIG.TARGET_TPS,
            timeUnit: '1s',
            duration: TEST_CONFIG.DURATION,
            preAllocatedVUs: 50,
            maxVUs: TEST_CONFIG.MAX_VUS,
        },
    },
};

export default function () {
    if (csvData.length === 0) {
        console.error('No valid data found!');
        return;
    }

    const user = csvData[Math.floor(Math.random() * csvData.length)];

    loginScenario({
        username: user.user,
        password: user.passwd.trim(),
    });
}

export function handleSummary(data) {
    return {
        'index.html': htmlReport(data),
        'stdout': textSummary(data, { indent: ' ', enableColors: true }), // Show in console
        'summary.txt': textSummary(data, { indent: ' ', enableColors: false }), // Save to file
    };
}
