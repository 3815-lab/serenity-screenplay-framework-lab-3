import { check } from 'k6';
import { Trend, Counter, Rate } from 'k6/metrics';
import { AuthService } from '../services/auth-service.js';

// Custom Business Metrics
const LoginTime = new Trend('business_login_duration');
const SuccessfulLogins = new Counter('business_successful_logins');
const TokenRate = new Rate('business_token_received_rate');

export function loginScenario(user) {
    const authService = new AuthService();

    // Perform Login
    const res = authService.login(user.username, user.password);

    // Track Business Metrics
    LoginTime.add(res.timings.duration);

    const success = check(res, {
        'status is 200 or 201': (r) => r.status === 200 || r.status === 201,
        'has token': (r) => r.json('token') !== undefined && r.json('token') !== null,
    });

    if (success) {
        SuccessfulLogins.add(1);
        TokenRate.add(1);
    } else {
        TokenRate.add(0);
        console.log(`Failed check: Status ${res.status}. Body: ${res.body}`);
    }
}
