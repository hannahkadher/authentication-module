export class config {
  public static JWT_SECRET_KEY =
    process.env.JWT_SECRET_KEY || 'default_secret_key';
  public static JWT_ACCESS_TOKEN_EXPIRES_AT =
    process.env.JWT_ACCESS_TOKEN_EXPIRES_AT || '3000s';
  public static JWT_REFRESH_TOKEN_EXPIRES_AT =
    process.env.JWT_REFRESH_TOKEN_EXPIRES_AT || '7d';
}
