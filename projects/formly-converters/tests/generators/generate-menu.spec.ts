import 'mocha';
import { expect } from 'chai';
import { generateMenu } from '../../src/generators/generate-menu';

describe('generate-menu', () => {
  it('sorted', function () {
    const res = generateMenu(['b', 'a']);
    expect(res).to.deep.equal([
      { name: 'a', url: 'a', children: [] },
      { name: 'b', url: 'b', children: [] },
    ]);
  });

  it('sorted case insensitive', function () {
    const res = generateMenu(['B', 'a', 'c']);
    expect(res).to.deep.equal([
      { name: 'a', url: 'a', children: [] },
      { name: 'B', url: 'B', children: [] },
      { name: 'c', url: 'c', children: [] },
    ]);
  });

  it('sorted numerical', function () {
    const res = generateMenu(['1', '10', '9']);
    expect(res).to.deep.equal([
      { name: '1', url: '1', children: [] },
      { name: '9', url: '9', children: [] },
      { name: '10', url: '10', children: [] },
    ]);
  });

  it('parents added', function () {
    const res = generateMenu(['a/b/c']);
    expect(res).to.deep.equal([
      {
        name: 'a',
        children: [
          {
            name: 'b',
            children: [{ name: 'c', url: 'a/b/c', children: [] }],
          },
        ],
      },
    ]);
  });

  it('children sorted', function () {
    const res = generateMenu(['a/b', 'a/a']);
    expect(res).to.deep.equal([
      {
        name: 'a',
        children: [
          { name: 'a', url: 'a/a', children: [] },
          { name: 'b', url: 'a/b', children: [] },
        ],
      },
    ]);
  });

  it('parents with urls', function () {
    const res = generateMenu(['a/a/a', 'a', 'a/a']);
    expect(res).to.deep.equal([
      {
        name: 'a',
        url: 'a',
        children: [
          {
            name: 'a',
            url: 'a/a',
            children: [{ name: 'a', url: 'a/a/a', children: [] }],
          },
        ],
      },
    ]);
  });

  it('shared parent', function () {
    const res = generateMenu(['a/a', 'a/b']);
    expect(res).to.deep.equal([
      {
        name: 'a',
        children: [
          {
            name: 'a',
            url: 'a/a',
            children: [],
          },
          {
            name: 'b',
            url: 'a/b',
            children: [],
          },
        ],
      },
    ]);
  });
});
