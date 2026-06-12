const TOKEN_KEY = "sfa_token";

export const storage = {
  getToken: () => localStorage.getItem(TOKEN_KEY),

  setToken: (token: string) => localStorage.setItem(TOKEN_KEY, token),

  removeToken: () => localStorage.removeItem(TOKEN_KEY),
};
