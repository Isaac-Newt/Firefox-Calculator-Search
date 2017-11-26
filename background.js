// Provide help text to the user.
browser.omnibox.setDefaultSuggestion({
  description: `Get results for math queries
    (e.g. 5 * 9 = 45)`
});

// Update suggestions with user input
browser.omnibox.onInputChanged.addListener((text, addSuggestions) => {
  let headers = new Headers({"Accept": "application/json"});
  let init = {method: 'GET', headers};
  let url = buildSearchURL(text);
  let request = new Request(url, init);

  fetch(request)
    .then(createSuggestionsFromResponse)
    .then(addSuggestions);
});
