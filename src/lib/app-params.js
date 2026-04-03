export const appParams = {
  appId: 'oplo-local',
  token: null,
  functionsVersion: null,
  appBaseUrl: typeof window !== 'undefined' ? window.location.origin : '',
  fromUrl: typeof window !== 'undefined' ? window.location.href : '',
};
