export interface TokenBlacklist {
        addToBlacklist(token: string): Promise<void>;
        isBlacklisted(token: string): Promise<boolean>;
}
