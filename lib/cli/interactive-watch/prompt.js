'use strict';

const {gray, dim, bgYellow} = require('ansi-colors');
const micromatch = require('micromatch');
const isGlob = require('is-glob');
const {
  Autocomplete,
  dimUnmatchedStrings,
  getMatchedIndexes
} = require('cli-autocomplete-prompt');

class CustomAutocomplete extends Autocomplete {
  suggestion(item) {
    if (this.input === '') return true;

    // to support globs as a search input
    return micromatch.contains(item.label, this.input);
  }

  highlight(input = '', label = '') {
    input = input.trim();
    if (input.length === 0) return dim(label);

    // by default, it's a white color text.
    if (isGlob(input)) return label;

    const matchedIndexes = getMatchedIndexes(label, input);
    if (matchedIndexes.length === 0) return dim(label);

    return dimUnmatchedStrings(label, matchedIndexes);
  }

  renderOption({label}, isFocused, isStart, isEnd) {
    const prefix = dim('›');
    const scrollIndicator = isStart ? ' ↑' : isEnd ? ' ↓' : '';
    const content = isFocused
      ? bgYellow.black(label)
      : this.highlight(this.input, label);

    return ` ${prefix}${scrollIndicator} ${content}`;
  }

  formatBody(suggestions) {
    if (this.filteredList.length > this.limit) {
      const matchCountText = `\n\n ${gray(
        `Matched ${this.filteredList.length} files`
      )}`;

      return ['\n\n', suggestions, matchCountText].join('');
    }

    return `\n\n${suggestions || ' No matches found'}`;
  }
}

const options = {
  onSubmit: matches => matches.map(match => match.value),
  promptLabel: dim(' filter › ')
};

exports.autocompletePrompt = list => {
  return new Promise(resolve => {
    const autocomplete = new CustomAutocomplete({list, ...options});
    autocomplete.on('submit', resolve);
  });
};
