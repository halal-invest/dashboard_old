export const JWT_SECRET = "74fe2be9d0ee352956fa4e66a6a8b72da5946da13e7416f902cd693a4ae8de58";
export const JWT_JOIN_SECRET = "74fe2be9d0ee352956fa4e66a6a8b72da5946da13e7416f902cd698a4aeadfasd58";
export const REFRESH_TOKEN_SECRET = "74fe2be9d0ee352956fa4e66a6a8b72da5946da13e7416f902cd692a4aeadfasd58";
export const FORGOT_PASSWORD_TOKEN_SECRET = "74fe2be9d0ee352956fa4e66a6a8b72da5949da13e7418f902cd692a4aeadfasd58";

export const URL = process.env.NODE_ENV === "production" ? "https://dashboard-theta-indol.vercel.app" : "http://localhost:3000"
export const IP_ADDRESS_URL = "https://ip-address-xn83.onrender.com/getUserPrivateIpAddress";

export const RATE_LIMIT = 10;
export const RATE_LIMIT_TIME = 60 * 1000 * 10;
export const RATE_LIMIT_TIME_MIN = 10;
