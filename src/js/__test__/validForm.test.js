import validForm from '../validForm';

test('check coords 1', () => {
    const coords = '51.50851, -0.12572';
    const expected = {coords: {latitude: '51.50851', longitude: '-0.12572'}};
    const received = validForm(coords);
    expect(received).toStrictEqual(expected);
});

test('check coords 2', () => {
    const coords = '51.50851,-0.12572';
    const expected = {coords: {latitude: '51.50851', longitude: '-0.12572'}};
    const received = validForm(coords);
    expect(received).toStrictEqual(expected);
});

test('check coords 3', () => {
    const coords = '[51.50851, -0.12572]';
    const expected = {coords: {latitude: '51.50851', longitude: '-0.12572'}};
    const received = validForm(coords);
    expect(received).toStrictEqual(expected);
});

test('check coords 4', () => {
    const coords = '[51.5a0851, -0.12572]';
    const expected = false;
    const received = validForm(coords);
    expect(received).toStrictEqual(expected);
});