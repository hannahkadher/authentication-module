export class ControllerRoute {
  public static readonly AUTH_ROUTE = 'auth';
  static ACTIONS = class {
    public static readonly SIGNUP_SUMMARY = 'User sign-up endpoint';
    public static readonly SIGNUP_DESCRIPTION =
      'Endpoint for users to create new accounts.';
    public static readonly LOGIN_SUMMARY = 'User login endpoint';
    public static readonly LOGIN_DESCRIPTION =
      'Endpoint for users to log in to their accounts.';
  };
}
