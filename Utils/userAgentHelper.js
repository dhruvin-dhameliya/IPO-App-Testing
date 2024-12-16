import UserAgent from 'user-agents';

const getRandomUserAgent = () => {
    const userAgent = new UserAgent();
    return userAgent.toString();
};

export default getRandomUserAgent;