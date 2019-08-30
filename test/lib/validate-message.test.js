const validateMessage = require('../../lib/validate-message.js');

describe('validateMessage', () => {
  test('It allows valid messages', async () => {
    const validMessages = [
      'Fix the bug',
      'Refactor the feature',
      'Update documentation',
      'Document the feature',
      'Close the gap',
      'Bridge the gap',
      'Redact the stuff',
      'Add the thing',
      'Remove the codes',
      'Count the sheep',
      'Fire the laser!',
      'Build the machine',
    ];
    expect.assertions(validMessages.length);
    for (let validMsg of validMessages) {
      const success = await validateMessage(validMsg);
      expect(success).toEqual(true);
    }
  });

  test('It allows version commits', async () => {
    const validMessages = [
      'v1.0.0',
      'v123.12345.123456790',
      'v2.42.10-alpha',
      'v3.80.0+meta',
    ];
    expect.assertions(validMessages.length);
    for (let validMsg of validMessages) {
      const success = await validateMessage(validMsg);
      expect(success).toEqual(true);
    }
  });

  test('It throws on invalid messages', async () => {
    const invalidMessages = [
      ['fix the bug', 'Subject does not start with an uppercase letter'],
      ['refactor the feature', 'Subject does not start with an uppercase letter'],
      ['It seems like this is a very long message. Far too long if you ask me. We should do something about that', 'Subject exceeds maximum length of 72 characters'],
      ['Verb? What verb?', 'Subject does not seem to start with a verb'],
      ['The bug is gone', 'Subject does not seem to start with a verb'],
      ['!fixup This commit was made with the --fixup flag', 'Commit includes rebase instruction: !fixup'],
      ['!squash This commit was made with the --squash flag', 'Commit includes rebase instruction: !squash'],
      ['Fixed the bug', 'Subject does not seem to start with an imperative verb'],
      ['Closed the ticket', 'Subject does not seem to start with an imperative verb'],
      ['v1.0.0 added', 'Subject does not start with an uppercase letter'],
    ];
    expect.assertions(invalidMessages.length);
    for (let [message, error] of invalidMessages) {
      try {
        const success = await validateMessage(message);
      } catch (err) {
        expect(err.message).toEqual(error);
      }
    }
  });
});
