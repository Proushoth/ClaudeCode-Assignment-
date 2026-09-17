'use strict';

const VALID_PRIORITIES = ['low', 'medium', 'high'];

/**
 * Validates and sanitises task input.
 *
 * @param {object} input - Raw task input.
 * @param {string} input.title - Task title (required, 3–100 chars after trim).
 * @param {string} [input.priority] - Task priority: low | medium | high (default: medium).
 * @returns {{ value?: object, error?: string }}
 */
function validateTask(input) {
  const { title, priority } = input || {};

  // --- title ---
  if (title === undefined || title === null) {
    return { error: 'title is required.' };
  }

  if (typeof title !== 'string') {
    return { error: 'title must be a string.' };
  }

  const trimmedTitle = title.trim();

  if (trimmedTitle.length < 3) {
    return { error: 'title must be at least 3 characters long.' };
  }

  if (trimmedTitle.length > 100) {
    return { error: 'title must be at most 100 characters long.' };
  }

  // --- priority ---
  const resolvedPriority = priority === undefined ? 'medium' : priority;

  if (!VALID_PRIORITIES.includes(resolvedPriority)) {
    return {
      error: `priority must be one of: ${VALID_PRIORITIES.join(', ')}.`,
    };
  }

  return {
    value: {
      title: trimmedTitle,
      priority: resolvedPriority,
    },
  };
}

module.exports = { validateTask };
