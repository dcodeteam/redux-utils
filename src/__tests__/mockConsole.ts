export function mockConsole(mocks: { warn?: jest.Mock; error?: jest.Mock }) {
  /* eslint-disable no-console */
  const realConsole = { ...console };

  beforeAll(() => {
    if (mocks.warn) {
      console.warn = mocks.warn;
    }

    if (mocks.error) {
      console.error = mocks.error;
    }
  });

  afterEach(() => {
    if (mocks.warn) {
      mocks.warn.mockReset();
    }

    if (mocks.error) {
      mocks.error.mockReset();
    }
  });

  afterAll(() => {
    console.warn = realConsole.warn;
    console.error = realConsole.error;
  });
  /* eslint-enable no-console */
}
