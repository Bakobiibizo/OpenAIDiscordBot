export class ContextWindow {
     static MAX_TOKENS = 1000;
     tokens = [];

    addTokens(newTokens) {
      this.tokens = [...this.tokens, ...newTokens].slice(-ContextWindow.MAX_TOKENS);
    }

    getContext() {
      return this.tokens;
    }
  }