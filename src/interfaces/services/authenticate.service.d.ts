export interface AuthenticateRequest {
    username: string;
    password: string;
}

export interface AuthenticateResponse {
    username: string;
    access_token: string;
    refresh_token: string;
    expire_in: number;
    refresh_expire_in: number;
}

export interface RefreshTokenResponse extends Omit<AuthenticateResponse, 'username'> {}
