// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock react-leaflet for Jest to avoid ESM parsing issues during tests.
jest.mock('react-leaflet', () => {
  const React = require('react');
  return {
    MapContainer: ({ children }) => <div data-testid="map">{children}</div>,
    TileLayer: () => null,
    Marker: ({ children }) => <div>{children}</div>,
    Popup: ({ children }) => <div>{children}</div>,
  };
});

// Mock navigator.geolocation for tests (used in DonorForm).
const mockGeolocation = {
  getCurrentPosition: jest.fn((success) => {
    success({
      coords: {
        latitude: 28.6139,
        longitude: 77.2090,
      },
    });
  }),
  watchPosition: jest.fn(),
};

if (!global.navigator) {
  global.navigator = {};
}

Object.defineProperty(global.navigator, 'geolocation', {
  value: mockGeolocation,
  writable: true,
  configurable: true,
});
