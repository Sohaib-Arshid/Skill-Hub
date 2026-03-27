// Test backend API endpoints to debug frontend failures
import axios from 'axios';

const testApi = async () => {
    try {
        // Authenticate (login as a test user or register if it fails)
        let cookie;
        try {
            const loginRes = await axios.post('http://localhost:8000/api/auth/login', {
                email: 'test@test.com',
                password: 'password123'
            });
            cookie = loginRes.headers['set-cookie'];
            console.log("Logged in successfully");
        } catch (e) {
            console.log("Login failed, registering...");
            const regRes = await axios.post('http://localhost:8000/api/auth/register', {
                name: "Test User",
                email: "test@test.com",
                password: "password123",
                skills: ["React"]
            });
            cookie = regRes.headers['set-cookie'];
            console.log("Registered successfully");
        }

        const axiosConfig = { headers: { Cookie: cookie } };

        // 1. Check Update Profile
        try {
            const upRes = await axios.patch('http://localhost:8000/api/user/updateProfile', {
                name: "Test User Updated",
                bio: "New Bio",
                skills: ["Node"]
            }, axiosConfig);
            console.log("Update Profile:", upRes.status, upRes.data.statusCode);
        } catch(e) {
            console.log("Update Profile Error:", e.response?.status, e.response?.data);
        }

        // 2. Check /connection/all
        try {
            const connRes = await axios.get('http://localhost:8000/api/connection/all', axiosConfig);
            console.log("Connections all:", connRes.status);
        } catch(e) {
            console.log("Connections all Error:", e.response?.status, e.response?.data);
        }

        // 3. Check follower get
        try {
            const follRes = await axios.get('http://localhost:8000/api/follow/followers', axiosConfig);
            console.log("Followers get:", follRes.status);
        } catch(e) {
            console.log("Followers get Error:", e.response?.status, e.response?.data);
        }

    } catch (err) {
        console.error("Critical error:", err);
    }
};

testApi();
