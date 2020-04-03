const fs = require('fs');
const getOptions = require('loader-utils').getOptions;
const path = require('path');

const ws = '[^]*?';
const requireRe = new RegExp(`<require${ws}path="\(.*?\)">`, 'g');

module.exports = function (source) {
  const options = getOptions(this);
  const templateRoot = options.root || path.dirname(this.resoucePath);

  // Replace requires with injected HTML source.
  let match;
  const requires = [];
  while (match = requireRe.exec(source)) {
    let requirePath = path.resolve(templateRoot, match[1].trim());
    let requireSource = fs.readFileSync(requirePath, 'utf8');
    requires.push(requirePath);

    // Escape windows backslashes to fix a
    // `Bad escape sequence in untagged template literal` error
    let escapedRequirePath = requirePath.replace(/\\/g, "\\\\")

    source = source.replace(match[0], `<!-- <require path="${escapedRequirePath}"> -->
${requireSource}<!-- </require> -->`);
  }

  // Add loader dependencies (e.g., for hot reloading).
  requires.filter(uniq).forEach(requirePath => {
    this.addDependency(requirePath);
  });

  return source;
};

function uniq (value, index, self) {
  return self.indexOf(value) === index;
}
