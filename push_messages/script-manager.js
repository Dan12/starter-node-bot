var scripts = {};

exports.startScript = (name, interval) => {
  scripts[name] = interval;
}

exports.getScripts = () => {
  return scripts;
}

exports.endScript = (name) => {
  if(scripts[name] !== undefined) {
    clearInterval(scripts[name]);

    delete scripts[name];
  }
}
