import { isAllowedOrigin } from './configure-app';

describe('isAllowedOrigin', () => {
  it.each([
    undefined,
    'http://localhost:5173',
    'https://meterflow-demo.netlify.app',
    'https://deploy-preview-42--meterflow-demo.netlify.app',
    'https://abc123--meterflow-demo.netlify.app',
  ])('allows %s', (origin) => {
    expect(isAllowedOrigin(origin)).toBe(true);
  });

  it.each([
    'http://localhost:3000',
    'https://meterflow-demo.netlify.app.evil.example',
    'https://other-site.netlify.app',
    'https://preview--other-site.netlify.app',
  ])('rejects %s', (origin) => {
    expect(isAllowedOrigin(origin)).toBe(false);
  });
});
