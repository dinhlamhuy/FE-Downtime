export default function authHeader() {
    const user = JSON.parse(localStorage.getItem('access_token'));
    if (user) {
        return { 'Authorization': user };
    } else {
        return {};
    }
}