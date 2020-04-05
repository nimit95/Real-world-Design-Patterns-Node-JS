class ConfigCheck {
  check() {
    return true;
  }

  setNext(next) {
    // Returning a handler from here will let us link handlers in a convenient
    this._next = next;
    return next;
  }
}

// Chanin of commands for checking config
class AuthCheck extends ConfigCheck {
  check(config) {
    if (!config.key) return new Error("No key");
    if (!config.password) return new Error("No password");
    if (this._next)
      return this._next.check(config);
    else {
      return super.check();
    }
  }
}

class URLCheck extends ConfigCheck {
  check(config) {
    if (!config.url) return new Error("No valid URL");
    if (this._next)
      return this._next.check(config);
    else {
      return super.check();
    }
  }
}

const urlChecker = new URLCheck();
const authChecker = new AuthCheck();

urlChecker.setNext(authChecker);

console.log(urlChecker.check({}));
const config = {
  key: "abc",
  password: "secret",
  url: "valid url"
};
console.log(urlChecker.check(config));