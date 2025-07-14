export interface JWTPayload {
        sub: number; //> User ID...
        username: string;
        role: string;
        iat?: number;
        exp?: number;
}
