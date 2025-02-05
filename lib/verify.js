const {isString, isNil, isArray} = require('lodash');
const AggregateError = require('aggregate-error');
const getError = require('./get-error.js');
const resolveConfig = require('./resolve-config.js');

const isNonEmptyString = (value) => isString(value) && value.trim();
const isArrayOrNull = (value) => isArray(value) || isNil(value);

const VALIDATORS = {
  changelogFile: isNonEmptyString,
  changelogTitle: isNonEmptyString,
  branches: isArrayOrNull,
};

module.exports = (pluginConfig) => {
  const options = resolveConfig(pluginConfig);

  const errors = Object.entries(options).reduce(
    (errors, [option, value]) =>
      !isNil(value) && !VALIDATORS[option](value)
        ? [...errors, getError(`EINVALID${option.toUpperCase()}`, {[option]: value})]
        : errors,
    []
  );

  if (errors.length > 0) {
    throw new AggregateError(errors);
  }
};
