import axios from "axios";

const SIGNIN_URL = "http://authentication_service:8087/signin"; // todo env var
const SIGNUP_URL = "http://authentication_service:8087/signup"; // todo env var

class AuthService {
    login(user) {
        return axios
            .post(SIGNIN_URL, {
                username: user.username,
                password: user.password
            })
            .then(response => {
                if (response.data.data.token) {
                    localStorage.setItem('user', JSON.stringify(response.data.data));
                    localStorage.setItem('username', user.username);
                }
                console.log("Signed in successfully");
                window.alert("Signed in successfully");
                return response.data;
            }).catch(error => {
                console.log(`Error in sending the login request ${error}`);
                window.alert("Signin error");
            });
    }

    logout() {
        localStorage.removeItem('user');
        localStorage.removeItem('username');
        window.alert("Logged out successfully");
    }

    register(user) {
        return axios.post(SIGNUP_URL, {
            username: user.username,
            name: user.name,
            lastName: user.lastName,
            email: user.email,
            password: user.password
        }).then(() => {
            console.log(`Signed up successfully`);
            window.alert("Signed up successfully");
        }).catch(error => {
            console.log(`Error in sending the registration request ${error}`);
            window.alert("Signup error");
        });
    }
}

export default new AuthService();