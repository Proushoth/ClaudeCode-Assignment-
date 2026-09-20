'use strict';

const { validateTask } = require('../src/validators');

describe('validateTask', () => {
  // 1. Valid input — all fields provided
  it('returns a clean object for valid title and priority', () => {
    const result = validateTask({ title: 'Buy milk', priority: 'high' });
    expect(result.error).toBeUndefined();
    expect(result.value).toMatchObject({ title: 'Buy milk', priority: 'high' });
  });

  // 2. Missing title
  it('returns an error when title is missing', () => {
    const result = validateTask({ priority: 'low' });
    expect(result.error).toBeDefined();
    expect(result.error).toMatch(/title/i);
  });

  // 3. Title too short (< 3 characters)
  it('returns an error when title is shorter than 3 characters', () => {
    const result = validateTask({ title: 'Hi' });
    expect(result.error).toBeDefined();
    expect(result.error).toMatch(/3/);
  });

  // 4. Title too long (> 100 characters)
  it('returns an error when title is longer than 100 characters', () => {
    const longTitle = 'A'.repeat(101);
    const result = validateTask({ title: longTitle });
    expect(result.error).toBeDefined();
    expect(result.error).toMatch(/100/);
  });

  // 5. Bad priority value
  it('returns an error for an invalid priority value', () => {
    const result = validateTask({ title: 'Valid title', priority: 'urgent' });
    expect(result.error).toBeDefined();
    expect(result.error).toMatch(/priority/i);
  });

  // 6. Missing priority defaults to "medium"
  it('defaults priority to "medium" when not provided', () => {
    const result = validateTask({ title: 'Valid title' });
    expect(result.error).toBeUndefined();
    expect(result.value.priority).toBe('medium');
  });

  // 7. Title is trimmed
  it('trims whitespace from title', () => {
    const result = validateTask({ title: '  Clean me  ' });
    expect(result.error).toBeUndefined();
    expect(result.value.title).toBe('Clean me');
  });

  // 8. Title that is exactly 3 characters is valid
  it('accepts a title of exactly 3 characters', () => {
    const result = validateTask({ title: 'abc' });
    expect(result.error).toBeUndefined();
  });

  // 9. Title that is exactly 100 characters is valid
  it('accepts a title of exactly 100 characters', () => {
    const result = validateTask({ title: 'A'.repeat(100) });
    expect(result.error).toBeUndefined();
  });

  // 10. Non-string description returns error
  it('returns an error when description is not a string', () => {
    const result = validateTask({ title: 'Valid title', description: 42 });
    expect(result.error).toBeDefined();
    expect(result.error).toMatch(/description must be a string/i);
  });

  // 11. Valid description is trimmed and stored
  it('trims whitespace from valid description', () => {
    const result = validateTask({ title: 'Valid title', description: '  some note  ' });
    expect(result.error).toBeUndefined();
    expect(result.value.description).toBe('some note');
  });

  // 12. Missing description defaults to empty string
  it('defaults description to empty string when omitted', () => {
    const result = validateTask({ title: 'Valid title' });
    expect(result.error).toBeUndefined();
    expect(result.value.description).toBe('');
  });
});
