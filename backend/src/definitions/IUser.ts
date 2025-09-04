export interface IUser extends Document {
    name: string,
    email: string,
    username: string,
    phone: Number,
    password?: string,
    authProvider?: string,
    accessToken: string,
    refreshToken: string,
    id_token: string,
    generateAccessToken(): string,
    generateRefreshToken(): string,
    generateIdToken(): string,
    isPasswordCorrect(password: string): boolean,
    save(params: any): Promise<Document>
}