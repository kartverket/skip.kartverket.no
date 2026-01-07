// some prism highlighting for jsonnet 

module.exports = function prismJsonnet(Prism) {
  const string = /(["'])(?:\\[\s\S]|(?!\1)[^\\])*\1/;

  Prism.languages.jsonnet = {
    comment: [
      { pattern: /\/\*[\s\S]*?\*\//, greedy: true },
      { pattern: /(^|[^\\])\/\/.*/m, lookbehind: true, greedy: true },
    ],

    'triple-bar-string': {
      pattern: /\|\|\|[\s\S]*?\|\|\|/,
      greedy: true,
      alias: 'string',
    },

    string: { pattern: string, greedy: true },

    keyword:
      /\b(?:assert|else|error|false|for|function|if|import|importstr|in|local|null|self|super|then|true)\b/,

    builtin: /\bstd\b/,

    number: /\b0x[\da-fA-F]+|\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b/,

    function: /\b[A-Za-z_]\w*(?=\s*\()/,

    operator: /::|:\+|\+\:|==|!=|<=|>=|&&|\|\||[=<>!?~%*/+-]/,

    punctuation: /[{}[\];(),.:]/,
  };

  Prism.languages.insertBefore('jsonnet', 'operator', {
    property: [
      {
        pattern: new RegExp(
          String.raw`(?:${string.source}|\b[A-Za-z_]\w*\b)(?=\s*(?::|\+\s*:|:\s*\+))`
        ),
        greedy: true,
      },
    ],
  });
};
