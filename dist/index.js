// src/providers/wallet.ts
import { Actor, HttpAgent } from "@dfinity/agent";
import { Ed25519KeyIdentity } from "@dfinity/identity";
var WalletProvider = class {
  privateKey;
  identity;
  host;
  constructor(privateKey, host = "https://ic0.app") {
    this.privateKey = privateKey;
    this.host = host;
    this.identity = this.createIdentity();
  }
  createIdentity = () => {
    if (!this.privateKey) {
      throw new Error("Private key is required");
    }
    try {
      const privateKeyBytes = Buffer.from(this.privateKey, "hex");
      if (privateKeyBytes.length !== 32) {
        throw new Error("Invalid private key length");
      }
      const arrayBuffer = privateKeyBytes.buffer.slice(
        privateKeyBytes.byteOffset,
        privateKeyBytes.byteOffset + privateKeyBytes.length
      );
      return Ed25519KeyIdentity.fromSecretKey(arrayBuffer);
    } catch {
      throw new Error("Failed to create ICP identity");
    }
  };
  createAgent = async () => {
    return HttpAgent.create({
      identity: this.identity,
      host: this.host
    });
  };
  getIdentity = () => {
    return this.identity;
  };
  getPrincipal = () => {
    return this.identity.getPrincipal();
  };
  createActor = async (idlFactory7, canisterId, fetchRootKey = false) => {
    const agent = await this.createAgent();
    if (fetchRootKey) {
      await agent.fetchRootKey();
    }
    return Actor.createActor(idlFactory7, {
      agent,
      canisterId
    });
  };
};
var icpWalletProvider = {
  async get(runtime, _message, _state) {
    try {
      const privateKey = runtime.getSetting(
        "INTERNET_COMPUTER_PRIVATE_KEY"
      );
      if (!privateKey) {
        throw new Error("INTERNET_COMPUTER_PRIVATE_KEY not found in settings");
      }
      console.log("icp loaded successfully");
      if (!/^[0-9a-fA-F]{64}$/.test(privateKey)) {
        throw new Error("Invalid private key format - must be 32 bytes hex");
      }
      const wallet = new WalletProvider(privateKey);
      return {
        wallet,
        identity: wallet.getIdentity(),
        principal: wallet.getPrincipal().toString(),
        isAuthenticated: true,
        createActor: wallet.createActor
      };
    } catch (error) {
      console.error("ICP Wallet Provider Error:", error);
      return {
        wallet: null,
        identity: null,
        principal: null,
        isAuthenticated: false,
        error: error instanceof Error ? error.message : "Unknown error initializing ICP wallet"
      };
    }
  }
};

// src/constants/apis.ts
var WEB3_STORAGE_API_HOST = "";
var KONG_SWAP_TOKEN_API_HOST = "https://api.kongswap.io/api/tokens";
var STRIPE_API_KEY = process.env.STRIPE_API_KEY || "";

// ../../node_modules/.pnpm/zod@3.24.2/node_modules/zod/lib/index.mjs
var util;
(function(util2) {
  util2.assertEqual = (val) => val;
  function assertIs(_arg) {
  }
  util2.assertIs = assertIs;
  function assertNever(_x) {
    throw new Error();
  }
  util2.assertNever = assertNever;
  util2.arrayToEnum = (items) => {
    const obj = {};
    for (const item of items) {
      obj[item] = item;
    }
    return obj;
  };
  util2.getValidEnumValues = (obj) => {
    const validKeys = util2.objectKeys(obj).filter((k) => typeof obj[obj[k]] !== "number");
    const filtered = {};
    for (const k of validKeys) {
      filtered[k] = obj[k];
    }
    return util2.objectValues(filtered);
  };
  util2.objectValues = (obj) => {
    return util2.objectKeys(obj).map(function(e) {
      return obj[e];
    });
  };
  util2.objectKeys = typeof Object.keys === "function" ? (obj) => Object.keys(obj) : (object) => {
    const keys = [];
    for (const key in object) {
      if (Object.prototype.hasOwnProperty.call(object, key)) {
        keys.push(key);
      }
    }
    return keys;
  };
  util2.find = (arr, checker) => {
    for (const item of arr) {
      if (checker(item))
        return item;
    }
    return void 0;
  };
  util2.isInteger = typeof Number.isInteger === "function" ? (val) => Number.isInteger(val) : (val) => typeof val === "number" && isFinite(val) && Math.floor(val) === val;
  function joinValues(array, separator = " | ") {
    return array.map((val) => typeof val === "string" ? `'${val}'` : val).join(separator);
  }
  util2.joinValues = joinValues;
  util2.jsonStringifyReplacer = (_, value) => {
    if (typeof value === "bigint") {
      return value.toString();
    }
    return value;
  };
})(util || (util = {}));
var objectUtil;
(function(objectUtil2) {
  objectUtil2.mergeShapes = (first, second) => {
    return {
      ...first,
      ...second
      // second overwrites first
    };
  };
})(objectUtil || (objectUtil = {}));
var ZodParsedType = util.arrayToEnum([
  "string",
  "nan",
  "number",
  "integer",
  "float",
  "boolean",
  "date",
  "bigint",
  "symbol",
  "function",
  "undefined",
  "null",
  "array",
  "object",
  "unknown",
  "promise",
  "void",
  "never",
  "map",
  "set"
]);
var getParsedType = (data) => {
  const t = typeof data;
  switch (t) {
    case "undefined":
      return ZodParsedType.undefined;
    case "string":
      return ZodParsedType.string;
    case "number":
      return isNaN(data) ? ZodParsedType.nan : ZodParsedType.number;
    case "boolean":
      return ZodParsedType.boolean;
    case "function":
      return ZodParsedType.function;
    case "bigint":
      return ZodParsedType.bigint;
    case "symbol":
      return ZodParsedType.symbol;
    case "object":
      if (Array.isArray(data)) {
        return ZodParsedType.array;
      }
      if (data === null) {
        return ZodParsedType.null;
      }
      if (data.then && typeof data.then === "function" && data.catch && typeof data.catch === "function") {
        return ZodParsedType.promise;
      }
      if (typeof Map !== "undefined" && data instanceof Map) {
        return ZodParsedType.map;
      }
      if (typeof Set !== "undefined" && data instanceof Set) {
        return ZodParsedType.set;
      }
      if (typeof Date !== "undefined" && data instanceof Date) {
        return ZodParsedType.date;
      }
      return ZodParsedType.object;
    default:
      return ZodParsedType.unknown;
  }
};
var ZodIssueCode = util.arrayToEnum([
  "invalid_type",
  "invalid_literal",
  "custom",
  "invalid_union",
  "invalid_union_discriminator",
  "invalid_enum_value",
  "unrecognized_keys",
  "invalid_arguments",
  "invalid_return_type",
  "invalid_date",
  "invalid_string",
  "too_small",
  "too_big",
  "invalid_intersection_types",
  "not_multiple_of",
  "not_finite"
]);
var quotelessJson = (obj) => {
  const json = JSON.stringify(obj, null, 2);
  return json.replace(/"([^"]+)":/g, "$1:");
};
var ZodError = class _ZodError extends Error {
  get errors() {
    return this.issues;
  }
  constructor(issues) {
    super();
    this.issues = [];
    this.addIssue = (sub) => {
      this.issues = [...this.issues, sub];
    };
    this.addIssues = (subs = []) => {
      this.issues = [...this.issues, ...subs];
    };
    const actualProto = new.target.prototype;
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(this, actualProto);
    } else {
      this.__proto__ = actualProto;
    }
    this.name = "ZodError";
    this.issues = issues;
  }
  format(_mapper) {
    const mapper = _mapper || function(issue) {
      return issue.message;
    };
    const fieldErrors = { _errors: [] };
    const processError = (error) => {
      for (const issue of error.issues) {
        if (issue.code === "invalid_union") {
          issue.unionErrors.map(processError);
        } else if (issue.code === "invalid_return_type") {
          processError(issue.returnTypeError);
        } else if (issue.code === "invalid_arguments") {
          processError(issue.argumentsError);
        } else if (issue.path.length === 0) {
          fieldErrors._errors.push(mapper(issue));
        } else {
          let curr = fieldErrors;
          let i = 0;
          while (i < issue.path.length) {
            const el = issue.path[i];
            const terminal = i === issue.path.length - 1;
            if (!terminal) {
              curr[el] = curr[el] || { _errors: [] };
            } else {
              curr[el] = curr[el] || { _errors: [] };
              curr[el]._errors.push(mapper(issue));
            }
            curr = curr[el];
            i++;
          }
        }
      }
    };
    processError(this);
    return fieldErrors;
  }
  static assert(value) {
    if (!(value instanceof _ZodError)) {
      throw new Error(`Not a ZodError: ${value}`);
    }
  }
  toString() {
    return this.message;
  }
  get message() {
    return JSON.stringify(this.issues, util.jsonStringifyReplacer, 2);
  }
  get isEmpty() {
    return this.issues.length === 0;
  }
  flatten(mapper = (issue) => issue.message) {
    const fieldErrors = {};
    const formErrors = [];
    for (const sub of this.issues) {
      if (sub.path.length > 0) {
        fieldErrors[sub.path[0]] = fieldErrors[sub.path[0]] || [];
        fieldErrors[sub.path[0]].push(mapper(sub));
      } else {
        formErrors.push(mapper(sub));
      }
    }
    return { formErrors, fieldErrors };
  }
  get formErrors() {
    return this.flatten();
  }
};
ZodError.create = (issues) => {
  const error = new ZodError(issues);
  return error;
};
var errorMap = (issue, _ctx) => {
  let message;
  switch (issue.code) {
    case ZodIssueCode.invalid_type:
      if (issue.received === ZodParsedType.undefined) {
        message = "Required";
      } else {
        message = `Expected ${issue.expected}, received ${issue.received}`;
      }
      break;
    case ZodIssueCode.invalid_literal:
      message = `Invalid literal value, expected ${JSON.stringify(issue.expected, util.jsonStringifyReplacer)}`;
      break;
    case ZodIssueCode.unrecognized_keys:
      message = `Unrecognized key(s) in object: ${util.joinValues(issue.keys, ", ")}`;
      break;
    case ZodIssueCode.invalid_union:
      message = `Invalid input`;
      break;
    case ZodIssueCode.invalid_union_discriminator:
      message = `Invalid discriminator value. Expected ${util.joinValues(issue.options)}`;
      break;
    case ZodIssueCode.invalid_enum_value:
      message = `Invalid enum value. Expected ${util.joinValues(issue.options)}, received '${issue.received}'`;
      break;
    case ZodIssueCode.invalid_arguments:
      message = `Invalid function arguments`;
      break;
    case ZodIssueCode.invalid_return_type:
      message = `Invalid function return type`;
      break;
    case ZodIssueCode.invalid_date:
      message = `Invalid date`;
      break;
    case ZodIssueCode.invalid_string:
      if (typeof issue.validation === "object") {
        if ("includes" in issue.validation) {
          message = `Invalid input: must include "${issue.validation.includes}"`;
          if (typeof issue.validation.position === "number") {
            message = `${message} at one or more positions greater than or equal to ${issue.validation.position}`;
          }
        } else if ("startsWith" in issue.validation) {
          message = `Invalid input: must start with "${issue.validation.startsWith}"`;
        } else if ("endsWith" in issue.validation) {
          message = `Invalid input: must end with "${issue.validation.endsWith}"`;
        } else {
          util.assertNever(issue.validation);
        }
      } else if (issue.validation !== "regex") {
        message = `Invalid ${issue.validation}`;
      } else {
        message = "Invalid";
      }
      break;
    case ZodIssueCode.too_small:
      if (issue.type === "array")
        message = `Array must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `more than`} ${issue.minimum} element(s)`;
      else if (issue.type === "string")
        message = `String must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `over`} ${issue.minimum} character(s)`;
      else if (issue.type === "number")
        message = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`;
      else if (issue.type === "date")
        message = `Date must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${new Date(Number(issue.minimum))}`;
      else
        message = "Invalid input";
      break;
    case ZodIssueCode.too_big:
      if (issue.type === "array")
        message = `Array must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `less than`} ${issue.maximum} element(s)`;
      else if (issue.type === "string")
        message = `String must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `under`} ${issue.maximum} character(s)`;
      else if (issue.type === "number")
        message = `Number must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
      else if (issue.type === "bigint")
        message = `BigInt must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
      else if (issue.type === "date")
        message = `Date must be ${issue.exact ? `exactly` : issue.inclusive ? `smaller than or equal to` : `smaller than`} ${new Date(Number(issue.maximum))}`;
      else
        message = "Invalid input";
      break;
    case ZodIssueCode.custom:
      message = `Invalid input`;
      break;
    case ZodIssueCode.invalid_intersection_types:
      message = `Intersection results could not be merged`;
      break;
    case ZodIssueCode.not_multiple_of:
      message = `Number must be a multiple of ${issue.multipleOf}`;
      break;
    case ZodIssueCode.not_finite:
      message = "Number must be finite";
      break;
    default:
      message = _ctx.defaultError;
      util.assertNever(issue);
  }
  return { message };
};
var overrideErrorMap = errorMap;
function setErrorMap(map) {
  overrideErrorMap = map;
}
function getErrorMap() {
  return overrideErrorMap;
}
var makeIssue = (params) => {
  const { data, path, errorMaps, issueData } = params;
  const fullPath = [...path, ...issueData.path || []];
  const fullIssue = {
    ...issueData,
    path: fullPath
  };
  if (issueData.message !== void 0) {
    return {
      ...issueData,
      path: fullPath,
      message: issueData.message
    };
  }
  let errorMessage = "";
  const maps = errorMaps.filter((m) => !!m).slice().reverse();
  for (const map of maps) {
    errorMessage = map(fullIssue, { data, defaultError: errorMessage }).message;
  }
  return {
    ...issueData,
    path: fullPath,
    message: errorMessage
  };
};
var EMPTY_PATH = [];
function addIssueToContext(ctx, issueData) {
  const overrideMap = getErrorMap();
  const issue = makeIssue({
    issueData,
    data: ctx.data,
    path: ctx.path,
    errorMaps: [
      ctx.common.contextualErrorMap,
      // contextual error map is first priority
      ctx.schemaErrorMap,
      // then schema-bound map if available
      overrideMap,
      // then global override map
      overrideMap === errorMap ? void 0 : errorMap
      // then global default map
    ].filter((x) => !!x)
  });
  ctx.common.issues.push(issue);
}
var ParseStatus = class _ParseStatus {
  constructor() {
    this.value = "valid";
  }
  dirty() {
    if (this.value === "valid")
      this.value = "dirty";
  }
  abort() {
    if (this.value !== "aborted")
      this.value = "aborted";
  }
  static mergeArray(status, results) {
    const arrayValue = [];
    for (const s of results) {
      if (s.status === "aborted")
        return INVALID;
      if (s.status === "dirty")
        status.dirty();
      arrayValue.push(s.value);
    }
    return { status: status.value, value: arrayValue };
  }
  static async mergeObjectAsync(status, pairs) {
    const syncPairs = [];
    for (const pair of pairs) {
      const key = await pair.key;
      const value = await pair.value;
      syncPairs.push({
        key,
        value
      });
    }
    return _ParseStatus.mergeObjectSync(status, syncPairs);
  }
  static mergeObjectSync(status, pairs) {
    const finalObject = {};
    for (const pair of pairs) {
      const { key, value } = pair;
      if (key.status === "aborted")
        return INVALID;
      if (value.status === "aborted")
        return INVALID;
      if (key.status === "dirty")
        status.dirty();
      if (value.status === "dirty")
        status.dirty();
      if (key.value !== "__proto__" && (typeof value.value !== "undefined" || pair.alwaysSet)) {
        finalObject[key.value] = value.value;
      }
    }
    return { status: status.value, value: finalObject };
  }
};
var INVALID = Object.freeze({
  status: "aborted"
});
var DIRTY = (value) => ({ status: "dirty", value });
var OK = (value) => ({ status: "valid", value });
var isAborted = (x) => x.status === "aborted";
var isDirty = (x) => x.status === "dirty";
var isValid = (x) => x.status === "valid";
var isAsync = (x) => typeof Promise !== "undefined" && x instanceof Promise;
function __classPrivateFieldGet(receiver, state, kind, f) {
  if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}
function __classPrivateFieldSet(receiver, state, value, kind, f) {
  if (kind === "m") throw new TypeError("Private method is not writable");
  if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
}
var errorUtil;
(function(errorUtil2) {
  errorUtil2.errToObj = (message) => typeof message === "string" ? { message } : message || {};
  errorUtil2.toString = (message) => typeof message === "string" ? message : message === null || message === void 0 ? void 0 : message.message;
})(errorUtil || (errorUtil = {}));
var _ZodEnum_cache;
var _ZodNativeEnum_cache;
var ParseInputLazyPath = class {
  constructor(parent, value, path, key) {
    this._cachedPath = [];
    this.parent = parent;
    this.data = value;
    this._path = path;
    this._key = key;
  }
  get path() {
    if (!this._cachedPath.length) {
      if (this._key instanceof Array) {
        this._cachedPath.push(...this._path, ...this._key);
      } else {
        this._cachedPath.push(...this._path, this._key);
      }
    }
    return this._cachedPath;
  }
};
var handleResult = (ctx, result) => {
  if (isValid(result)) {
    return { success: true, data: result.value };
  } else {
    if (!ctx.common.issues.length) {
      throw new Error("Validation failed but no issues detected.");
    }
    return {
      success: false,
      get error() {
        if (this._error)
          return this._error;
        const error = new ZodError(ctx.common.issues);
        this._error = error;
        return this._error;
      }
    };
  }
};
function processCreateParams(params) {
  if (!params)
    return {};
  const { errorMap: errorMap2, invalid_type_error, required_error, description } = params;
  if (errorMap2 && (invalid_type_error || required_error)) {
    throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
  }
  if (errorMap2)
    return { errorMap: errorMap2, description };
  const customMap = (iss, ctx) => {
    var _a, _b;
    const { message } = params;
    if (iss.code === "invalid_enum_value") {
      return { message: message !== null && message !== void 0 ? message : ctx.defaultError };
    }
    if (typeof ctx.data === "undefined") {
      return { message: (_a = message !== null && message !== void 0 ? message : required_error) !== null && _a !== void 0 ? _a : ctx.defaultError };
    }
    if (iss.code !== "invalid_type")
      return { message: ctx.defaultError };
    return { message: (_b = message !== null && message !== void 0 ? message : invalid_type_error) !== null && _b !== void 0 ? _b : ctx.defaultError };
  };
  return { errorMap: customMap, description };
}
var ZodType = class {
  get description() {
    return this._def.description;
  }
  _getType(input) {
    return getParsedType(input.data);
  }
  _getOrReturnCtx(input, ctx) {
    return ctx || {
      common: input.parent.common,
      data: input.data,
      parsedType: getParsedType(input.data),
      schemaErrorMap: this._def.errorMap,
      path: input.path,
      parent: input.parent
    };
  }
  _processInputParams(input) {
    return {
      status: new ParseStatus(),
      ctx: {
        common: input.parent.common,
        data: input.data,
        parsedType: getParsedType(input.data),
        schemaErrorMap: this._def.errorMap,
        path: input.path,
        parent: input.parent
      }
    };
  }
  _parseSync(input) {
    const result = this._parse(input);
    if (isAsync(result)) {
      throw new Error("Synchronous parse encountered promise.");
    }
    return result;
  }
  _parseAsync(input) {
    const result = this._parse(input);
    return Promise.resolve(result);
  }
  parse(data, params) {
    const result = this.safeParse(data, params);
    if (result.success)
      return result.data;
    throw result.error;
  }
  safeParse(data, params) {
    var _a;
    const ctx = {
      common: {
        issues: [],
        async: (_a = params === null || params === void 0 ? void 0 : params.async) !== null && _a !== void 0 ? _a : false,
        contextualErrorMap: params === null || params === void 0 ? void 0 : params.errorMap
      },
      path: (params === null || params === void 0 ? void 0 : params.path) || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    const result = this._parseSync({ data, path: ctx.path, parent: ctx });
    return handleResult(ctx, result);
  }
  "~validate"(data) {
    var _a, _b;
    const ctx = {
      common: {
        issues: [],
        async: !!this["~standard"].async
      },
      path: [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    if (!this["~standard"].async) {
      try {
        const result = this._parseSync({ data, path: [], parent: ctx });
        return isValid(result) ? {
          value: result.value
        } : {
          issues: ctx.common.issues
        };
      } catch (err) {
        if ((_b = (_a = err === null || err === void 0 ? void 0 : err.message) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === null || _b === void 0 ? void 0 : _b.includes("encountered")) {
          this["~standard"].async = true;
        }
        ctx.common = {
          issues: [],
          async: true
        };
      }
    }
    return this._parseAsync({ data, path: [], parent: ctx }).then((result) => isValid(result) ? {
      value: result.value
    } : {
      issues: ctx.common.issues
    });
  }
  async parseAsync(data, params) {
    const result = await this.safeParseAsync(data, params);
    if (result.success)
      return result.data;
    throw result.error;
  }
  async safeParseAsync(data, params) {
    const ctx = {
      common: {
        issues: [],
        contextualErrorMap: params === null || params === void 0 ? void 0 : params.errorMap,
        async: true
      },
      path: (params === null || params === void 0 ? void 0 : params.path) || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    const maybeAsyncResult = this._parse({ data, path: ctx.path, parent: ctx });
    const result = await (isAsync(maybeAsyncResult) ? maybeAsyncResult : Promise.resolve(maybeAsyncResult));
    return handleResult(ctx, result);
  }
  refine(check, message) {
    const getIssueProperties = (val) => {
      if (typeof message === "string" || typeof message === "undefined") {
        return { message };
      } else if (typeof message === "function") {
        return message(val);
      } else {
        return message;
      }
    };
    return this._refinement((val, ctx) => {
      const result = check(val);
      const setError = () => ctx.addIssue({
        code: ZodIssueCode.custom,
        ...getIssueProperties(val)
      });
      if (typeof Promise !== "undefined" && result instanceof Promise) {
        return result.then((data) => {
          if (!data) {
            setError();
            return false;
          } else {
            return true;
          }
        });
      }
      if (!result) {
        setError();
        return false;
      } else {
        return true;
      }
    });
  }
  refinement(check, refinementData) {
    return this._refinement((val, ctx) => {
      if (!check(val)) {
        ctx.addIssue(typeof refinementData === "function" ? refinementData(val, ctx) : refinementData);
        return false;
      } else {
        return true;
      }
    });
  }
  _refinement(refinement) {
    return new ZodEffects({
      schema: this,
      typeName: ZodFirstPartyTypeKind.ZodEffects,
      effect: { type: "refinement", refinement }
    });
  }
  superRefine(refinement) {
    return this._refinement(refinement);
  }
  constructor(def) {
    this.spa = this.safeParseAsync;
    this._def = def;
    this.parse = this.parse.bind(this);
    this.safeParse = this.safeParse.bind(this);
    this.parseAsync = this.parseAsync.bind(this);
    this.safeParseAsync = this.safeParseAsync.bind(this);
    this.spa = this.spa.bind(this);
    this.refine = this.refine.bind(this);
    this.refinement = this.refinement.bind(this);
    this.superRefine = this.superRefine.bind(this);
    this.optional = this.optional.bind(this);
    this.nullable = this.nullable.bind(this);
    this.nullish = this.nullish.bind(this);
    this.array = this.array.bind(this);
    this.promise = this.promise.bind(this);
    this.or = this.or.bind(this);
    this.and = this.and.bind(this);
    this.transform = this.transform.bind(this);
    this.brand = this.brand.bind(this);
    this.default = this.default.bind(this);
    this.catch = this.catch.bind(this);
    this.describe = this.describe.bind(this);
    this.pipe = this.pipe.bind(this);
    this.readonly = this.readonly.bind(this);
    this.isNullable = this.isNullable.bind(this);
    this.isOptional = this.isOptional.bind(this);
    this["~standard"] = {
      version: 1,
      vendor: "zod",
      validate: (data) => this["~validate"](data)
    };
  }
  optional() {
    return ZodOptional.create(this, this._def);
  }
  nullable() {
    return ZodNullable.create(this, this._def);
  }
  nullish() {
    return this.nullable().optional();
  }
  array() {
    return ZodArray.create(this);
  }
  promise() {
    return ZodPromise.create(this, this._def);
  }
  or(option) {
    return ZodUnion.create([this, option], this._def);
  }
  and(incoming) {
    return ZodIntersection.create(this, incoming, this._def);
  }
  transform(transform) {
    return new ZodEffects({
      ...processCreateParams(this._def),
      schema: this,
      typeName: ZodFirstPartyTypeKind.ZodEffects,
      effect: { type: "transform", transform }
    });
  }
  default(def) {
    const defaultValueFunc = typeof def === "function" ? def : () => def;
    return new ZodDefault({
      ...processCreateParams(this._def),
      innerType: this,
      defaultValue: defaultValueFunc,
      typeName: ZodFirstPartyTypeKind.ZodDefault
    });
  }
  brand() {
    return new ZodBranded({
      typeName: ZodFirstPartyTypeKind.ZodBranded,
      type: this,
      ...processCreateParams(this._def)
    });
  }
  catch(def) {
    const catchValueFunc = typeof def === "function" ? def : () => def;
    return new ZodCatch({
      ...processCreateParams(this._def),
      innerType: this,
      catchValue: catchValueFunc,
      typeName: ZodFirstPartyTypeKind.ZodCatch
    });
  }
  describe(description) {
    const This = this.constructor;
    return new This({
      ...this._def,
      description
    });
  }
  pipe(target) {
    return ZodPipeline.create(this, target);
  }
  readonly() {
    return ZodReadonly.create(this);
  }
  isOptional() {
    return this.safeParse(void 0).success;
  }
  isNullable() {
    return this.safeParse(null).success;
  }
};
var cuidRegex = /^c[^\s-]{8,}$/i;
var cuid2Regex = /^[0-9a-z]+$/;
var ulidRegex = /^[0-9A-HJKMNP-TV-Z]{26}$/i;
var uuidRegex = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i;
var nanoidRegex = /^[a-z0-9_-]{21}$/i;
var jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/;
var durationRegex = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/;
var emailRegex = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i;
var _emojiRegex = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;
var emojiRegex;
var ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
var ipv4CidrRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/;
var ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
var ipv6CidrRegex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
var base64Regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
var base64urlRegex = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/;
var dateRegexSource = `((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))`;
var dateRegex = new RegExp(`^${dateRegexSource}$`);
function timeRegexSource(args) {
  let regex = `([01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d`;
  if (args.precision) {
    regex = `${regex}\\.\\d{${args.precision}}`;
  } else if (args.precision == null) {
    regex = `${regex}(\\.\\d+)?`;
  }
  return regex;
}
function timeRegex(args) {
  return new RegExp(`^${timeRegexSource(args)}$`);
}
function datetimeRegex(args) {
  let regex = `${dateRegexSource}T${timeRegexSource(args)}`;
  const opts = [];
  opts.push(args.local ? `Z?` : `Z`);
  if (args.offset)
    opts.push(`([+-]\\d{2}:?\\d{2})`);
  regex = `${regex}(${opts.join("|")})`;
  return new RegExp(`^${regex}$`);
}
function isValidIP(ip, version) {
  if ((version === "v4" || !version) && ipv4Regex.test(ip)) {
    return true;
  }
  if ((version === "v6" || !version) && ipv6Regex.test(ip)) {
    return true;
  }
  return false;
}
function isValidJWT(jwt, alg) {
  if (!jwtRegex.test(jwt))
    return false;
  try {
    const [header] = jwt.split(".");
    const base64 = header.replace(/-/g, "+").replace(/_/g, "/").padEnd(header.length + (4 - header.length % 4) % 4, "=");
    const decoded = JSON.parse(atob(base64));
    if (typeof decoded !== "object" || decoded === null)
      return false;
    if (!decoded.typ || !decoded.alg)
      return false;
    if (alg && decoded.alg !== alg)
      return false;
    return true;
  } catch (_a) {
    return false;
  }
}
function isValidCidr(ip, version) {
  if ((version === "v4" || !version) && ipv4CidrRegex.test(ip)) {
    return true;
  }
  if ((version === "v6" || !version) && ipv6CidrRegex.test(ip)) {
    return true;
  }
  return false;
}
var ZodString = class _ZodString extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = String(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.string) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.string,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    const status = new ParseStatus();
    let ctx = void 0;
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        if (input.data.length < check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: check.value,
            type: "string",
            inclusive: true,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        if (input.data.length > check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: check.value,
            type: "string",
            inclusive: true,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "length") {
        const tooBig = input.data.length > check.value;
        const tooSmall = input.data.length < check.value;
        if (tooBig || tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          if (tooBig) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_big,
              maximum: check.value,
              type: "string",
              inclusive: true,
              exact: true,
              message: check.message
            });
          } else if (tooSmall) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_small,
              minimum: check.value,
              type: "string",
              inclusive: true,
              exact: true,
              message: check.message
            });
          }
          status.dirty();
        }
      } else if (check.kind === "email") {
        if (!emailRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "email",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "emoji") {
        if (!emojiRegex) {
          emojiRegex = new RegExp(_emojiRegex, "u");
        }
        if (!emojiRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "emoji",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "uuid") {
        if (!uuidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "uuid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "nanoid") {
        if (!nanoidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "nanoid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cuid") {
        if (!cuidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cuid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cuid2") {
        if (!cuid2Regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cuid2",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "ulid") {
        if (!ulidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "ulid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "url") {
        try {
          new URL(input.data);
        } catch (_a) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "url",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "regex") {
        check.regex.lastIndex = 0;
        const testResult = check.regex.test(input.data);
        if (!testResult) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "regex",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "trim") {
        input.data = input.data.trim();
      } else if (check.kind === "includes") {
        if (!input.data.includes(check.value, check.position)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { includes: check.value, position: check.position },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "toLowerCase") {
        input.data = input.data.toLowerCase();
      } else if (check.kind === "toUpperCase") {
        input.data = input.data.toUpperCase();
      } else if (check.kind === "startsWith") {
        if (!input.data.startsWith(check.value)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { startsWith: check.value },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "endsWith") {
        if (!input.data.endsWith(check.value)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { endsWith: check.value },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "datetime") {
        const regex = datetimeRegex(check);
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "datetime",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "date") {
        const regex = dateRegex;
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "date",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "time") {
        const regex = timeRegex(check);
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "time",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "duration") {
        if (!durationRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "duration",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "ip") {
        if (!isValidIP(input.data, check.version)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "ip",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "jwt") {
        if (!isValidJWT(input.data, check.alg)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "jwt",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cidr") {
        if (!isValidCidr(input.data, check.version)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cidr",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "base64") {
        if (!base64Regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "base64",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "base64url") {
        if (!base64urlRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "base64url",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  _regex(regex, validation, message) {
    return this.refinement((data) => regex.test(data), {
      validation,
      code: ZodIssueCode.invalid_string,
      ...errorUtil.errToObj(message)
    });
  }
  _addCheck(check) {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  email(message) {
    return this._addCheck({ kind: "email", ...errorUtil.errToObj(message) });
  }
  url(message) {
    return this._addCheck({ kind: "url", ...errorUtil.errToObj(message) });
  }
  emoji(message) {
    return this._addCheck({ kind: "emoji", ...errorUtil.errToObj(message) });
  }
  uuid(message) {
    return this._addCheck({ kind: "uuid", ...errorUtil.errToObj(message) });
  }
  nanoid(message) {
    return this._addCheck({ kind: "nanoid", ...errorUtil.errToObj(message) });
  }
  cuid(message) {
    return this._addCheck({ kind: "cuid", ...errorUtil.errToObj(message) });
  }
  cuid2(message) {
    return this._addCheck({ kind: "cuid2", ...errorUtil.errToObj(message) });
  }
  ulid(message) {
    return this._addCheck({ kind: "ulid", ...errorUtil.errToObj(message) });
  }
  base64(message) {
    return this._addCheck({ kind: "base64", ...errorUtil.errToObj(message) });
  }
  base64url(message) {
    return this._addCheck({
      kind: "base64url",
      ...errorUtil.errToObj(message)
    });
  }
  jwt(options) {
    return this._addCheck({ kind: "jwt", ...errorUtil.errToObj(options) });
  }
  ip(options) {
    return this._addCheck({ kind: "ip", ...errorUtil.errToObj(options) });
  }
  cidr(options) {
    return this._addCheck({ kind: "cidr", ...errorUtil.errToObj(options) });
  }
  datetime(options) {
    var _a, _b;
    if (typeof options === "string") {
      return this._addCheck({
        kind: "datetime",
        precision: null,
        offset: false,
        local: false,
        message: options
      });
    }
    return this._addCheck({
      kind: "datetime",
      precision: typeof (options === null || options === void 0 ? void 0 : options.precision) === "undefined" ? null : options === null || options === void 0 ? void 0 : options.precision,
      offset: (_a = options === null || options === void 0 ? void 0 : options.offset) !== null && _a !== void 0 ? _a : false,
      local: (_b = options === null || options === void 0 ? void 0 : options.local) !== null && _b !== void 0 ? _b : false,
      ...errorUtil.errToObj(options === null || options === void 0 ? void 0 : options.message)
    });
  }
  date(message) {
    return this._addCheck({ kind: "date", message });
  }
  time(options) {
    if (typeof options === "string") {
      return this._addCheck({
        kind: "time",
        precision: null,
        message: options
      });
    }
    return this._addCheck({
      kind: "time",
      precision: typeof (options === null || options === void 0 ? void 0 : options.precision) === "undefined" ? null : options === null || options === void 0 ? void 0 : options.precision,
      ...errorUtil.errToObj(options === null || options === void 0 ? void 0 : options.message)
    });
  }
  duration(message) {
    return this._addCheck({ kind: "duration", ...errorUtil.errToObj(message) });
  }
  regex(regex, message) {
    return this._addCheck({
      kind: "regex",
      regex,
      ...errorUtil.errToObj(message)
    });
  }
  includes(value, options) {
    return this._addCheck({
      kind: "includes",
      value,
      position: options === null || options === void 0 ? void 0 : options.position,
      ...errorUtil.errToObj(options === null || options === void 0 ? void 0 : options.message)
    });
  }
  startsWith(value, message) {
    return this._addCheck({
      kind: "startsWith",
      value,
      ...errorUtil.errToObj(message)
    });
  }
  endsWith(value, message) {
    return this._addCheck({
      kind: "endsWith",
      value,
      ...errorUtil.errToObj(message)
    });
  }
  min(minLength, message) {
    return this._addCheck({
      kind: "min",
      value: minLength,
      ...errorUtil.errToObj(message)
    });
  }
  max(maxLength, message) {
    return this._addCheck({
      kind: "max",
      value: maxLength,
      ...errorUtil.errToObj(message)
    });
  }
  length(len, message) {
    return this._addCheck({
      kind: "length",
      value: len,
      ...errorUtil.errToObj(message)
    });
  }
  /**
   * Equivalent to `.min(1)`
   */
  nonempty(message) {
    return this.min(1, errorUtil.errToObj(message));
  }
  trim() {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "trim" }]
    });
  }
  toLowerCase() {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "toLowerCase" }]
    });
  }
  toUpperCase() {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "toUpperCase" }]
    });
  }
  get isDatetime() {
    return !!this._def.checks.find((ch) => ch.kind === "datetime");
  }
  get isDate() {
    return !!this._def.checks.find((ch) => ch.kind === "date");
  }
  get isTime() {
    return !!this._def.checks.find((ch) => ch.kind === "time");
  }
  get isDuration() {
    return !!this._def.checks.find((ch) => ch.kind === "duration");
  }
  get isEmail() {
    return !!this._def.checks.find((ch) => ch.kind === "email");
  }
  get isURL() {
    return !!this._def.checks.find((ch) => ch.kind === "url");
  }
  get isEmoji() {
    return !!this._def.checks.find((ch) => ch.kind === "emoji");
  }
  get isUUID() {
    return !!this._def.checks.find((ch) => ch.kind === "uuid");
  }
  get isNANOID() {
    return !!this._def.checks.find((ch) => ch.kind === "nanoid");
  }
  get isCUID() {
    return !!this._def.checks.find((ch) => ch.kind === "cuid");
  }
  get isCUID2() {
    return !!this._def.checks.find((ch) => ch.kind === "cuid2");
  }
  get isULID() {
    return !!this._def.checks.find((ch) => ch.kind === "ulid");
  }
  get isIP() {
    return !!this._def.checks.find((ch) => ch.kind === "ip");
  }
  get isCIDR() {
    return !!this._def.checks.find((ch) => ch.kind === "cidr");
  }
  get isBase64() {
    return !!this._def.checks.find((ch) => ch.kind === "base64");
  }
  get isBase64url() {
    return !!this._def.checks.find((ch) => ch.kind === "base64url");
  }
  get minLength() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxLength() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
};
ZodString.create = (params) => {
  var _a;
  return new ZodString({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodString,
    coerce: (_a = params === null || params === void 0 ? void 0 : params.coerce) !== null && _a !== void 0 ? _a : false,
    ...processCreateParams(params)
  });
};
function floatSafeRemainder(val, step) {
  const valDecCount = (val.toString().split(".")[1] || "").length;
  const stepDecCount = (step.toString().split(".")[1] || "").length;
  const decCount = valDecCount > stepDecCount ? valDecCount : stepDecCount;
  const valInt = parseInt(val.toFixed(decCount).replace(".", ""));
  const stepInt = parseInt(step.toFixed(decCount).replace(".", ""));
  return valInt % stepInt / Math.pow(10, decCount);
}
var ZodNumber = class _ZodNumber extends ZodType {
  constructor() {
    super(...arguments);
    this.min = this.gte;
    this.max = this.lte;
    this.step = this.multipleOf;
  }
  _parse(input) {
    if (this._def.coerce) {
      input.data = Number(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.number) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.number,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    let ctx = void 0;
    const status = new ParseStatus();
    for (const check of this._def.checks) {
      if (check.kind === "int") {
        if (!util.isInteger(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: "integer",
            received: "float",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "min") {
        const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
        if (tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: check.value,
            type: "number",
            inclusive: check.inclusive,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
        if (tooBig) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: check.value,
            type: "number",
            inclusive: check.inclusive,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "multipleOf") {
        if (floatSafeRemainder(input.data, check.value) !== 0) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_multiple_of,
            multipleOf: check.value,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "finite") {
        if (!Number.isFinite(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_finite,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  gte(value, message) {
    return this.setLimit("min", value, true, errorUtil.toString(message));
  }
  gt(value, message) {
    return this.setLimit("min", value, false, errorUtil.toString(message));
  }
  lte(value, message) {
    return this.setLimit("max", value, true, errorUtil.toString(message));
  }
  lt(value, message) {
    return this.setLimit("max", value, false, errorUtil.toString(message));
  }
  setLimit(kind, value, inclusive, message) {
    return new _ZodNumber({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind,
          value,
          inclusive,
          message: errorUtil.toString(message)
        }
      ]
    });
  }
  _addCheck(check) {
    return new _ZodNumber({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  int(message) {
    return this._addCheck({
      kind: "int",
      message: errorUtil.toString(message)
    });
  }
  positive(message) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  negative(message) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  nonpositive(message) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  nonnegative(message) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  multipleOf(value, message) {
    return this._addCheck({
      kind: "multipleOf",
      value,
      message: errorUtil.toString(message)
    });
  }
  finite(message) {
    return this._addCheck({
      kind: "finite",
      message: errorUtil.toString(message)
    });
  }
  safe(message) {
    return this._addCheck({
      kind: "min",
      inclusive: true,
      value: Number.MIN_SAFE_INTEGER,
      message: errorUtil.toString(message)
    })._addCheck({
      kind: "max",
      inclusive: true,
      value: Number.MAX_SAFE_INTEGER,
      message: errorUtil.toString(message)
    });
  }
  get minValue() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxValue() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
  get isInt() {
    return !!this._def.checks.find((ch) => ch.kind === "int" || ch.kind === "multipleOf" && util.isInteger(ch.value));
  }
  get isFinite() {
    let max = null, min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "finite" || ch.kind === "int" || ch.kind === "multipleOf") {
        return true;
      } else if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      } else if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return Number.isFinite(min) && Number.isFinite(max);
  }
};
ZodNumber.create = (params) => {
  return new ZodNumber({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodNumber,
    coerce: (params === null || params === void 0 ? void 0 : params.coerce) || false,
    ...processCreateParams(params)
  });
};
var ZodBigInt = class _ZodBigInt extends ZodType {
  constructor() {
    super(...arguments);
    this.min = this.gte;
    this.max = this.lte;
  }
  _parse(input) {
    if (this._def.coerce) {
      try {
        input.data = BigInt(input.data);
      } catch (_a) {
        return this._getInvalidInput(input);
      }
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.bigint) {
      return this._getInvalidInput(input);
    }
    let ctx = void 0;
    const status = new ParseStatus();
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
        if (tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            type: "bigint",
            minimum: check.value,
            inclusive: check.inclusive,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
        if (tooBig) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            type: "bigint",
            maximum: check.value,
            inclusive: check.inclusive,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "multipleOf") {
        if (input.data % check.value !== BigInt(0)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_multiple_of,
            multipleOf: check.value,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  _getInvalidInput(input) {
    const ctx = this._getOrReturnCtx(input);
    addIssueToContext(ctx, {
      code: ZodIssueCode.invalid_type,
      expected: ZodParsedType.bigint,
      received: ctx.parsedType
    });
    return INVALID;
  }
  gte(value, message) {
    return this.setLimit("min", value, true, errorUtil.toString(message));
  }
  gt(value, message) {
    return this.setLimit("min", value, false, errorUtil.toString(message));
  }
  lte(value, message) {
    return this.setLimit("max", value, true, errorUtil.toString(message));
  }
  lt(value, message) {
    return this.setLimit("max", value, false, errorUtil.toString(message));
  }
  setLimit(kind, value, inclusive, message) {
    return new _ZodBigInt({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind,
          value,
          inclusive,
          message: errorUtil.toString(message)
        }
      ]
    });
  }
  _addCheck(check) {
    return new _ZodBigInt({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  positive(message) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  negative(message) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  nonpositive(message) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  nonnegative(message) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  multipleOf(value, message) {
    return this._addCheck({
      kind: "multipleOf",
      value,
      message: errorUtil.toString(message)
    });
  }
  get minValue() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxValue() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
};
ZodBigInt.create = (params) => {
  var _a;
  return new ZodBigInt({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodBigInt,
    coerce: (_a = params === null || params === void 0 ? void 0 : params.coerce) !== null && _a !== void 0 ? _a : false,
    ...processCreateParams(params)
  });
};
var ZodBoolean = class extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = Boolean(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.boolean) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.boolean,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodBoolean.create = (params) => {
  return new ZodBoolean({
    typeName: ZodFirstPartyTypeKind.ZodBoolean,
    coerce: (params === null || params === void 0 ? void 0 : params.coerce) || false,
    ...processCreateParams(params)
  });
};
var ZodDate = class _ZodDate extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = new Date(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.date) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.date,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    if (isNaN(input.data.getTime())) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_date
      });
      return INVALID;
    }
    const status = new ParseStatus();
    let ctx = void 0;
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        if (input.data.getTime() < check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            message: check.message,
            inclusive: true,
            exact: false,
            minimum: check.value,
            type: "date"
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        if (input.data.getTime() > check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            message: check.message,
            inclusive: true,
            exact: false,
            maximum: check.value,
            type: "date"
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return {
      status: status.value,
      value: new Date(input.data.getTime())
    };
  }
  _addCheck(check) {
    return new _ZodDate({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  min(minDate, message) {
    return this._addCheck({
      kind: "min",
      value: minDate.getTime(),
      message: errorUtil.toString(message)
    });
  }
  max(maxDate, message) {
    return this._addCheck({
      kind: "max",
      value: maxDate.getTime(),
      message: errorUtil.toString(message)
    });
  }
  get minDate() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min != null ? new Date(min) : null;
  }
  get maxDate() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max != null ? new Date(max) : null;
  }
};
ZodDate.create = (params) => {
  return new ZodDate({
    checks: [],
    coerce: (params === null || params === void 0 ? void 0 : params.coerce) || false,
    typeName: ZodFirstPartyTypeKind.ZodDate,
    ...processCreateParams(params)
  });
};
var ZodSymbol = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.symbol) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.symbol,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodSymbol.create = (params) => {
  return new ZodSymbol({
    typeName: ZodFirstPartyTypeKind.ZodSymbol,
    ...processCreateParams(params)
  });
};
var ZodUndefined = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.undefined) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.undefined,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodUndefined.create = (params) => {
  return new ZodUndefined({
    typeName: ZodFirstPartyTypeKind.ZodUndefined,
    ...processCreateParams(params)
  });
};
var ZodNull = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.null) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.null,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodNull.create = (params) => {
  return new ZodNull({
    typeName: ZodFirstPartyTypeKind.ZodNull,
    ...processCreateParams(params)
  });
};
var ZodAny = class extends ZodType {
  constructor() {
    super(...arguments);
    this._any = true;
  }
  _parse(input) {
    return OK(input.data);
  }
};
ZodAny.create = (params) => {
  return new ZodAny({
    typeName: ZodFirstPartyTypeKind.ZodAny,
    ...processCreateParams(params)
  });
};
var ZodUnknown = class extends ZodType {
  constructor() {
    super(...arguments);
    this._unknown = true;
  }
  _parse(input) {
    return OK(input.data);
  }
};
ZodUnknown.create = (params) => {
  return new ZodUnknown({
    typeName: ZodFirstPartyTypeKind.ZodUnknown,
    ...processCreateParams(params)
  });
};
var ZodNever = class extends ZodType {
  _parse(input) {
    const ctx = this._getOrReturnCtx(input);
    addIssueToContext(ctx, {
      code: ZodIssueCode.invalid_type,
      expected: ZodParsedType.never,
      received: ctx.parsedType
    });
    return INVALID;
  }
};
ZodNever.create = (params) => {
  return new ZodNever({
    typeName: ZodFirstPartyTypeKind.ZodNever,
    ...processCreateParams(params)
  });
};
var ZodVoid = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.undefined) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.void,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodVoid.create = (params) => {
  return new ZodVoid({
    typeName: ZodFirstPartyTypeKind.ZodVoid,
    ...processCreateParams(params)
  });
};
var ZodArray = class _ZodArray extends ZodType {
  _parse(input) {
    const { ctx, status } = this._processInputParams(input);
    const def = this._def;
    if (ctx.parsedType !== ZodParsedType.array) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.array,
        received: ctx.parsedType
      });
      return INVALID;
    }
    if (def.exactLength !== null) {
      const tooBig = ctx.data.length > def.exactLength.value;
      const tooSmall = ctx.data.length < def.exactLength.value;
      if (tooBig || tooSmall) {
        addIssueToContext(ctx, {
          code: tooBig ? ZodIssueCode.too_big : ZodIssueCode.too_small,
          minimum: tooSmall ? def.exactLength.value : void 0,
          maximum: tooBig ? def.exactLength.value : void 0,
          type: "array",
          inclusive: true,
          exact: true,
          message: def.exactLength.message
        });
        status.dirty();
      }
    }
    if (def.minLength !== null) {
      if (ctx.data.length < def.minLength.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_small,
          minimum: def.minLength.value,
          type: "array",
          inclusive: true,
          exact: false,
          message: def.minLength.message
        });
        status.dirty();
      }
    }
    if (def.maxLength !== null) {
      if (ctx.data.length > def.maxLength.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_big,
          maximum: def.maxLength.value,
          type: "array",
          inclusive: true,
          exact: false,
          message: def.maxLength.message
        });
        status.dirty();
      }
    }
    if (ctx.common.async) {
      return Promise.all([...ctx.data].map((item, i) => {
        return def.type._parseAsync(new ParseInputLazyPath(ctx, item, ctx.path, i));
      })).then((result2) => {
        return ParseStatus.mergeArray(status, result2);
      });
    }
    const result = [...ctx.data].map((item, i) => {
      return def.type._parseSync(new ParseInputLazyPath(ctx, item, ctx.path, i));
    });
    return ParseStatus.mergeArray(status, result);
  }
  get element() {
    return this._def.type;
  }
  min(minLength, message) {
    return new _ZodArray({
      ...this._def,
      minLength: { value: minLength, message: errorUtil.toString(message) }
    });
  }
  max(maxLength, message) {
    return new _ZodArray({
      ...this._def,
      maxLength: { value: maxLength, message: errorUtil.toString(message) }
    });
  }
  length(len, message) {
    return new _ZodArray({
      ...this._def,
      exactLength: { value: len, message: errorUtil.toString(message) }
    });
  }
  nonempty(message) {
    return this.min(1, message);
  }
};
ZodArray.create = (schema, params) => {
  return new ZodArray({
    type: schema,
    minLength: null,
    maxLength: null,
    exactLength: null,
    typeName: ZodFirstPartyTypeKind.ZodArray,
    ...processCreateParams(params)
  });
};
function deepPartialify(schema) {
  if (schema instanceof ZodObject) {
    const newShape = {};
    for (const key in schema.shape) {
      const fieldSchema = schema.shape[key];
      newShape[key] = ZodOptional.create(deepPartialify(fieldSchema));
    }
    return new ZodObject({
      ...schema._def,
      shape: () => newShape
    });
  } else if (schema instanceof ZodArray) {
    return new ZodArray({
      ...schema._def,
      type: deepPartialify(schema.element)
    });
  } else if (schema instanceof ZodOptional) {
    return ZodOptional.create(deepPartialify(schema.unwrap()));
  } else if (schema instanceof ZodNullable) {
    return ZodNullable.create(deepPartialify(schema.unwrap()));
  } else if (schema instanceof ZodTuple) {
    return ZodTuple.create(schema.items.map((item) => deepPartialify(item)));
  } else {
    return schema;
  }
}
var ZodObject = class _ZodObject extends ZodType {
  constructor() {
    super(...arguments);
    this._cached = null;
    this.nonstrict = this.passthrough;
    this.augment = this.extend;
  }
  _getCached() {
    if (this._cached !== null)
      return this._cached;
    const shape = this._def.shape();
    const keys = util.objectKeys(shape);
    return this._cached = { shape, keys };
  }
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.object) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    const { status, ctx } = this._processInputParams(input);
    const { shape, keys: shapeKeys } = this._getCached();
    const extraKeys = [];
    if (!(this._def.catchall instanceof ZodNever && this._def.unknownKeys === "strip")) {
      for (const key in ctx.data) {
        if (!shapeKeys.includes(key)) {
          extraKeys.push(key);
        }
      }
    }
    const pairs = [];
    for (const key of shapeKeys) {
      const keyValidator = shape[key];
      const value = ctx.data[key];
      pairs.push({
        key: { status: "valid", value: key },
        value: keyValidator._parse(new ParseInputLazyPath(ctx, value, ctx.path, key)),
        alwaysSet: key in ctx.data
      });
    }
    if (this._def.catchall instanceof ZodNever) {
      const unknownKeys = this._def.unknownKeys;
      if (unknownKeys === "passthrough") {
        for (const key of extraKeys) {
          pairs.push({
            key: { status: "valid", value: key },
            value: { status: "valid", value: ctx.data[key] }
          });
        }
      } else if (unknownKeys === "strict") {
        if (extraKeys.length > 0) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.unrecognized_keys,
            keys: extraKeys
          });
          status.dirty();
        }
      } else if (unknownKeys === "strip") ;
      else {
        throw new Error(`Internal ZodObject error: invalid unknownKeys value.`);
      }
    } else {
      const catchall = this._def.catchall;
      for (const key of extraKeys) {
        const value = ctx.data[key];
        pairs.push({
          key: { status: "valid", value: key },
          value: catchall._parse(
            new ParseInputLazyPath(ctx, value, ctx.path, key)
            //, ctx.child(key), value, getParsedType(value)
          ),
          alwaysSet: key in ctx.data
        });
      }
    }
    if (ctx.common.async) {
      return Promise.resolve().then(async () => {
        const syncPairs = [];
        for (const pair of pairs) {
          const key = await pair.key;
          const value = await pair.value;
          syncPairs.push({
            key,
            value,
            alwaysSet: pair.alwaysSet
          });
        }
        return syncPairs;
      }).then((syncPairs) => {
        return ParseStatus.mergeObjectSync(status, syncPairs);
      });
    } else {
      return ParseStatus.mergeObjectSync(status, pairs);
    }
  }
  get shape() {
    return this._def.shape();
  }
  strict(message) {
    errorUtil.errToObj;
    return new _ZodObject({
      ...this._def,
      unknownKeys: "strict",
      ...message !== void 0 ? {
        errorMap: (issue, ctx) => {
          var _a, _b, _c, _d;
          const defaultError = (_c = (_b = (_a = this._def).errorMap) === null || _b === void 0 ? void 0 : _b.call(_a, issue, ctx).message) !== null && _c !== void 0 ? _c : ctx.defaultError;
          if (issue.code === "unrecognized_keys")
            return {
              message: (_d = errorUtil.errToObj(message).message) !== null && _d !== void 0 ? _d : defaultError
            };
          return {
            message: defaultError
          };
        }
      } : {}
    });
  }
  strip() {
    return new _ZodObject({
      ...this._def,
      unknownKeys: "strip"
    });
  }
  passthrough() {
    return new _ZodObject({
      ...this._def,
      unknownKeys: "passthrough"
    });
  }
  // const AugmentFactory =
  //   <Def extends ZodObjectDef>(def: Def) =>
  //   <Augmentation extends ZodRawShape>(
  //     augmentation: Augmentation
  //   ): ZodObject<
  //     extendShape<ReturnType<Def["shape"]>, Augmentation>,
  //     Def["unknownKeys"],
  //     Def["catchall"]
  //   > => {
  //     return new ZodObject({
  //       ...def,
  //       shape: () => ({
  //         ...def.shape(),
  //         ...augmentation,
  //       }),
  //     }) as any;
  //   };
  extend(augmentation) {
    return new _ZodObject({
      ...this._def,
      shape: () => ({
        ...this._def.shape(),
        ...augmentation
      })
    });
  }
  /**
   * Prior to zod@1.0.12 there was a bug in the
   * inferred type of merged objects. Please
   * upgrade if you are experiencing issues.
   */
  merge(merging) {
    const merged = new _ZodObject({
      unknownKeys: merging._def.unknownKeys,
      catchall: merging._def.catchall,
      shape: () => ({
        ...this._def.shape(),
        ...merging._def.shape()
      }),
      typeName: ZodFirstPartyTypeKind.ZodObject
    });
    return merged;
  }
  // merge<
  //   Incoming extends AnyZodObject,
  //   Augmentation extends Incoming["shape"],
  //   NewOutput extends {
  //     [k in keyof Augmentation | keyof Output]: k extends keyof Augmentation
  //       ? Augmentation[k]["_output"]
  //       : k extends keyof Output
  //       ? Output[k]
  //       : never;
  //   },
  //   NewInput extends {
  //     [k in keyof Augmentation | keyof Input]: k extends keyof Augmentation
  //       ? Augmentation[k]["_input"]
  //       : k extends keyof Input
  //       ? Input[k]
  //       : never;
  //   }
  // >(
  //   merging: Incoming
  // ): ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"],
  //   NewOutput,
  //   NewInput
  // > {
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  setKey(key, schema) {
    return this.augment({ [key]: schema });
  }
  // merge<Incoming extends AnyZodObject>(
  //   merging: Incoming
  // ): //ZodObject<T & Incoming["_shape"], UnknownKeys, Catchall> = (merging) => {
  // ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"]
  // > {
  //   // const mergedShape = objectUtil.mergeShapes(
  //   //   this._def.shape(),
  //   //   merging._def.shape()
  //   // );
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  catchall(index) {
    return new _ZodObject({
      ...this._def,
      catchall: index
    });
  }
  pick(mask) {
    const shape = {};
    util.objectKeys(mask).forEach((key) => {
      if (mask[key] && this.shape[key]) {
        shape[key] = this.shape[key];
      }
    });
    return new _ZodObject({
      ...this._def,
      shape: () => shape
    });
  }
  omit(mask) {
    const shape = {};
    util.objectKeys(this.shape).forEach((key) => {
      if (!mask[key]) {
        shape[key] = this.shape[key];
      }
    });
    return new _ZodObject({
      ...this._def,
      shape: () => shape
    });
  }
  /**
   * @deprecated
   */
  deepPartial() {
    return deepPartialify(this);
  }
  partial(mask) {
    const newShape = {};
    util.objectKeys(this.shape).forEach((key) => {
      const fieldSchema = this.shape[key];
      if (mask && !mask[key]) {
        newShape[key] = fieldSchema;
      } else {
        newShape[key] = fieldSchema.optional();
      }
    });
    return new _ZodObject({
      ...this._def,
      shape: () => newShape
    });
  }
  required(mask) {
    const newShape = {};
    util.objectKeys(this.shape).forEach((key) => {
      if (mask && !mask[key]) {
        newShape[key] = this.shape[key];
      } else {
        const fieldSchema = this.shape[key];
        let newField = fieldSchema;
        while (newField instanceof ZodOptional) {
          newField = newField._def.innerType;
        }
        newShape[key] = newField;
      }
    });
    return new _ZodObject({
      ...this._def,
      shape: () => newShape
    });
  }
  keyof() {
    return createZodEnum(util.objectKeys(this.shape));
  }
};
ZodObject.create = (shape, params) => {
  return new ZodObject({
    shape: () => shape,
    unknownKeys: "strip",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};
ZodObject.strictCreate = (shape, params) => {
  return new ZodObject({
    shape: () => shape,
    unknownKeys: "strict",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};
ZodObject.lazycreate = (shape, params) => {
  return new ZodObject({
    shape,
    unknownKeys: "strip",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};
var ZodUnion = class extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const options = this._def.options;
    function handleResults(results) {
      for (const result of results) {
        if (result.result.status === "valid") {
          return result.result;
        }
      }
      for (const result of results) {
        if (result.result.status === "dirty") {
          ctx.common.issues.push(...result.ctx.common.issues);
          return result.result;
        }
      }
      const unionErrors = results.map((result) => new ZodError(result.ctx.common.issues));
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union,
        unionErrors
      });
      return INVALID;
    }
    if (ctx.common.async) {
      return Promise.all(options.map(async (option) => {
        const childCtx = {
          ...ctx,
          common: {
            ...ctx.common,
            issues: []
          },
          parent: null
        };
        return {
          result: await option._parseAsync({
            data: ctx.data,
            path: ctx.path,
            parent: childCtx
          }),
          ctx: childCtx
        };
      })).then(handleResults);
    } else {
      let dirty = void 0;
      const issues = [];
      for (const option of options) {
        const childCtx = {
          ...ctx,
          common: {
            ...ctx.common,
            issues: []
          },
          parent: null
        };
        const result = option._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: childCtx
        });
        if (result.status === "valid") {
          return result;
        } else if (result.status === "dirty" && !dirty) {
          dirty = { result, ctx: childCtx };
        }
        if (childCtx.common.issues.length) {
          issues.push(childCtx.common.issues);
        }
      }
      if (dirty) {
        ctx.common.issues.push(...dirty.ctx.common.issues);
        return dirty.result;
      }
      const unionErrors = issues.map((issues2) => new ZodError(issues2));
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union,
        unionErrors
      });
      return INVALID;
    }
  }
  get options() {
    return this._def.options;
  }
};
ZodUnion.create = (types, params) => {
  return new ZodUnion({
    options: types,
    typeName: ZodFirstPartyTypeKind.ZodUnion,
    ...processCreateParams(params)
  });
};
var getDiscriminator = (type) => {
  if (type instanceof ZodLazy) {
    return getDiscriminator(type.schema);
  } else if (type instanceof ZodEffects) {
    return getDiscriminator(type.innerType());
  } else if (type instanceof ZodLiteral) {
    return [type.value];
  } else if (type instanceof ZodEnum) {
    return type.options;
  } else if (type instanceof ZodNativeEnum) {
    return util.objectValues(type.enum);
  } else if (type instanceof ZodDefault) {
    return getDiscriminator(type._def.innerType);
  } else if (type instanceof ZodUndefined) {
    return [void 0];
  } else if (type instanceof ZodNull) {
    return [null];
  } else if (type instanceof ZodOptional) {
    return [void 0, ...getDiscriminator(type.unwrap())];
  } else if (type instanceof ZodNullable) {
    return [null, ...getDiscriminator(type.unwrap())];
  } else if (type instanceof ZodBranded) {
    return getDiscriminator(type.unwrap());
  } else if (type instanceof ZodReadonly) {
    return getDiscriminator(type.unwrap());
  } else if (type instanceof ZodCatch) {
    return getDiscriminator(type._def.innerType);
  } else {
    return [];
  }
};
var ZodDiscriminatedUnion = class _ZodDiscriminatedUnion extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.object) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const discriminator = this.discriminator;
    const discriminatorValue = ctx.data[discriminator];
    const option = this.optionsMap.get(discriminatorValue);
    if (!option) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union_discriminator,
        options: Array.from(this.optionsMap.keys()),
        path: [discriminator]
      });
      return INVALID;
    }
    if (ctx.common.async) {
      return option._parseAsync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
    } else {
      return option._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
    }
  }
  get discriminator() {
    return this._def.discriminator;
  }
  get options() {
    return this._def.options;
  }
  get optionsMap() {
    return this._def.optionsMap;
  }
  /**
   * The constructor of the discriminated union schema. Its behaviour is very similar to that of the normal z.union() constructor.
   * However, it only allows a union of objects, all of which need to share a discriminator property. This property must
   * have a different value for each object in the union.
   * @param discriminator the name of the discriminator property
   * @param types an array of object schemas
   * @param params
   */
  static create(discriminator, options, params) {
    const optionsMap = /* @__PURE__ */ new Map();
    for (const type of options) {
      const discriminatorValues = getDiscriminator(type.shape[discriminator]);
      if (!discriminatorValues.length) {
        throw new Error(`A discriminator value for key \`${discriminator}\` could not be extracted from all schema options`);
      }
      for (const value of discriminatorValues) {
        if (optionsMap.has(value)) {
          throw new Error(`Discriminator property ${String(discriminator)} has duplicate value ${String(value)}`);
        }
        optionsMap.set(value, type);
      }
    }
    return new _ZodDiscriminatedUnion({
      typeName: ZodFirstPartyTypeKind.ZodDiscriminatedUnion,
      discriminator,
      options,
      optionsMap,
      ...processCreateParams(params)
    });
  }
};
function mergeValues(a, b) {
  const aType = getParsedType(a);
  const bType = getParsedType(b);
  if (a === b) {
    return { valid: true, data: a };
  } else if (aType === ZodParsedType.object && bType === ZodParsedType.object) {
    const bKeys = util.objectKeys(b);
    const sharedKeys = util.objectKeys(a).filter((key) => bKeys.indexOf(key) !== -1);
    const newObj = { ...a, ...b };
    for (const key of sharedKeys) {
      const sharedValue = mergeValues(a[key], b[key]);
      if (!sharedValue.valid) {
        return { valid: false };
      }
      newObj[key] = sharedValue.data;
    }
    return { valid: true, data: newObj };
  } else if (aType === ZodParsedType.array && bType === ZodParsedType.array) {
    if (a.length !== b.length) {
      return { valid: false };
    }
    const newArray = [];
    for (let index = 0; index < a.length; index++) {
      const itemA = a[index];
      const itemB = b[index];
      const sharedValue = mergeValues(itemA, itemB);
      if (!sharedValue.valid) {
        return { valid: false };
      }
      newArray.push(sharedValue.data);
    }
    return { valid: true, data: newArray };
  } else if (aType === ZodParsedType.date && bType === ZodParsedType.date && +a === +b) {
    return { valid: true, data: a };
  } else {
    return { valid: false };
  }
}
var ZodIntersection = class extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    const handleParsed = (parsedLeft, parsedRight) => {
      if (isAborted(parsedLeft) || isAborted(parsedRight)) {
        return INVALID;
      }
      const merged = mergeValues(parsedLeft.value, parsedRight.value);
      if (!merged.valid) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_intersection_types
        });
        return INVALID;
      }
      if (isDirty(parsedLeft) || isDirty(parsedRight)) {
        status.dirty();
      }
      return { status: status.value, value: merged.data };
    };
    if (ctx.common.async) {
      return Promise.all([
        this._def.left._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        }),
        this._def.right._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        })
      ]).then(([left, right]) => handleParsed(left, right));
    } else {
      return handleParsed(this._def.left._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      }), this._def.right._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      }));
    }
  }
};
ZodIntersection.create = (left, right, params) => {
  return new ZodIntersection({
    left,
    right,
    typeName: ZodFirstPartyTypeKind.ZodIntersection,
    ...processCreateParams(params)
  });
};
var ZodTuple = class _ZodTuple extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.array) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.array,
        received: ctx.parsedType
      });
      return INVALID;
    }
    if (ctx.data.length < this._def.items.length) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.too_small,
        minimum: this._def.items.length,
        inclusive: true,
        exact: false,
        type: "array"
      });
      return INVALID;
    }
    const rest = this._def.rest;
    if (!rest && ctx.data.length > this._def.items.length) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.too_big,
        maximum: this._def.items.length,
        inclusive: true,
        exact: false,
        type: "array"
      });
      status.dirty();
    }
    const items = [...ctx.data].map((item, itemIndex) => {
      const schema = this._def.items[itemIndex] || this._def.rest;
      if (!schema)
        return null;
      return schema._parse(new ParseInputLazyPath(ctx, item, ctx.path, itemIndex));
    }).filter((x) => !!x);
    if (ctx.common.async) {
      return Promise.all(items).then((results) => {
        return ParseStatus.mergeArray(status, results);
      });
    } else {
      return ParseStatus.mergeArray(status, items);
    }
  }
  get items() {
    return this._def.items;
  }
  rest(rest) {
    return new _ZodTuple({
      ...this._def,
      rest
    });
  }
};
ZodTuple.create = (schemas, params) => {
  if (!Array.isArray(schemas)) {
    throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
  }
  return new ZodTuple({
    items: schemas,
    typeName: ZodFirstPartyTypeKind.ZodTuple,
    rest: null,
    ...processCreateParams(params)
  });
};
var ZodRecord = class _ZodRecord extends ZodType {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.object) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const pairs = [];
    const keyType = this._def.keyType;
    const valueType = this._def.valueType;
    for (const key in ctx.data) {
      pairs.push({
        key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, key)),
        value: valueType._parse(new ParseInputLazyPath(ctx, ctx.data[key], ctx.path, key)),
        alwaysSet: key in ctx.data
      });
    }
    if (ctx.common.async) {
      return ParseStatus.mergeObjectAsync(status, pairs);
    } else {
      return ParseStatus.mergeObjectSync(status, pairs);
    }
  }
  get element() {
    return this._def.valueType;
  }
  static create(first, second, third) {
    if (second instanceof ZodType) {
      return new _ZodRecord({
        keyType: first,
        valueType: second,
        typeName: ZodFirstPartyTypeKind.ZodRecord,
        ...processCreateParams(third)
      });
    }
    return new _ZodRecord({
      keyType: ZodString.create(),
      valueType: first,
      typeName: ZodFirstPartyTypeKind.ZodRecord,
      ...processCreateParams(second)
    });
  }
};
var ZodMap = class extends ZodType {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.map) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.map,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const keyType = this._def.keyType;
    const valueType = this._def.valueType;
    const pairs = [...ctx.data.entries()].map(([key, value], index) => {
      return {
        key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, [index, "key"])),
        value: valueType._parse(new ParseInputLazyPath(ctx, value, ctx.path, [index, "value"]))
      };
    });
    if (ctx.common.async) {
      const finalMap = /* @__PURE__ */ new Map();
      return Promise.resolve().then(async () => {
        for (const pair of pairs) {
          const key = await pair.key;
          const value = await pair.value;
          if (key.status === "aborted" || value.status === "aborted") {
            return INVALID;
          }
          if (key.status === "dirty" || value.status === "dirty") {
            status.dirty();
          }
          finalMap.set(key.value, value.value);
        }
        return { status: status.value, value: finalMap };
      });
    } else {
      const finalMap = /* @__PURE__ */ new Map();
      for (const pair of pairs) {
        const key = pair.key;
        const value = pair.value;
        if (key.status === "aborted" || value.status === "aborted") {
          return INVALID;
        }
        if (key.status === "dirty" || value.status === "dirty") {
          status.dirty();
        }
        finalMap.set(key.value, value.value);
      }
      return { status: status.value, value: finalMap };
    }
  }
};
ZodMap.create = (keyType, valueType, params) => {
  return new ZodMap({
    valueType,
    keyType,
    typeName: ZodFirstPartyTypeKind.ZodMap,
    ...processCreateParams(params)
  });
};
var ZodSet = class _ZodSet extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.set) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.set,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const def = this._def;
    if (def.minSize !== null) {
      if (ctx.data.size < def.minSize.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_small,
          minimum: def.minSize.value,
          type: "set",
          inclusive: true,
          exact: false,
          message: def.minSize.message
        });
        status.dirty();
      }
    }
    if (def.maxSize !== null) {
      if (ctx.data.size > def.maxSize.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_big,
          maximum: def.maxSize.value,
          type: "set",
          inclusive: true,
          exact: false,
          message: def.maxSize.message
        });
        status.dirty();
      }
    }
    const valueType = this._def.valueType;
    function finalizeSet(elements2) {
      const parsedSet = /* @__PURE__ */ new Set();
      for (const element of elements2) {
        if (element.status === "aborted")
          return INVALID;
        if (element.status === "dirty")
          status.dirty();
        parsedSet.add(element.value);
      }
      return { status: status.value, value: parsedSet };
    }
    const elements = [...ctx.data.values()].map((item, i) => valueType._parse(new ParseInputLazyPath(ctx, item, ctx.path, i)));
    if (ctx.common.async) {
      return Promise.all(elements).then((elements2) => finalizeSet(elements2));
    } else {
      return finalizeSet(elements);
    }
  }
  min(minSize, message) {
    return new _ZodSet({
      ...this._def,
      minSize: { value: minSize, message: errorUtil.toString(message) }
    });
  }
  max(maxSize, message) {
    return new _ZodSet({
      ...this._def,
      maxSize: { value: maxSize, message: errorUtil.toString(message) }
    });
  }
  size(size, message) {
    return this.min(size, message).max(size, message);
  }
  nonempty(message) {
    return this.min(1, message);
  }
};
ZodSet.create = (valueType, params) => {
  return new ZodSet({
    valueType,
    minSize: null,
    maxSize: null,
    typeName: ZodFirstPartyTypeKind.ZodSet,
    ...processCreateParams(params)
  });
};
var ZodFunction = class _ZodFunction extends ZodType {
  constructor() {
    super(...arguments);
    this.validate = this.implement;
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.function) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.function,
        received: ctx.parsedType
      });
      return INVALID;
    }
    function makeArgsIssue(args, error) {
      return makeIssue({
        data: args,
        path: ctx.path,
        errorMaps: [
          ctx.common.contextualErrorMap,
          ctx.schemaErrorMap,
          getErrorMap(),
          errorMap
        ].filter((x) => !!x),
        issueData: {
          code: ZodIssueCode.invalid_arguments,
          argumentsError: error
        }
      });
    }
    function makeReturnsIssue(returns, error) {
      return makeIssue({
        data: returns,
        path: ctx.path,
        errorMaps: [
          ctx.common.contextualErrorMap,
          ctx.schemaErrorMap,
          getErrorMap(),
          errorMap
        ].filter((x) => !!x),
        issueData: {
          code: ZodIssueCode.invalid_return_type,
          returnTypeError: error
        }
      });
    }
    const params = { errorMap: ctx.common.contextualErrorMap };
    const fn = ctx.data;
    if (this._def.returns instanceof ZodPromise) {
      const me = this;
      return OK(async function(...args) {
        const error = new ZodError([]);
        const parsedArgs = await me._def.args.parseAsync(args, params).catch((e) => {
          error.addIssue(makeArgsIssue(args, e));
          throw error;
        });
        const result = await Reflect.apply(fn, this, parsedArgs);
        const parsedReturns = await me._def.returns._def.type.parseAsync(result, params).catch((e) => {
          error.addIssue(makeReturnsIssue(result, e));
          throw error;
        });
        return parsedReturns;
      });
    } else {
      const me = this;
      return OK(function(...args) {
        const parsedArgs = me._def.args.safeParse(args, params);
        if (!parsedArgs.success) {
          throw new ZodError([makeArgsIssue(args, parsedArgs.error)]);
        }
        const result = Reflect.apply(fn, this, parsedArgs.data);
        const parsedReturns = me._def.returns.safeParse(result, params);
        if (!parsedReturns.success) {
          throw new ZodError([makeReturnsIssue(result, parsedReturns.error)]);
        }
        return parsedReturns.data;
      });
    }
  }
  parameters() {
    return this._def.args;
  }
  returnType() {
    return this._def.returns;
  }
  args(...items) {
    return new _ZodFunction({
      ...this._def,
      args: ZodTuple.create(items).rest(ZodUnknown.create())
    });
  }
  returns(returnType) {
    return new _ZodFunction({
      ...this._def,
      returns: returnType
    });
  }
  implement(func) {
    const validatedFunc = this.parse(func);
    return validatedFunc;
  }
  strictImplement(func) {
    const validatedFunc = this.parse(func);
    return validatedFunc;
  }
  static create(args, returns, params) {
    return new _ZodFunction({
      args: args ? args : ZodTuple.create([]).rest(ZodUnknown.create()),
      returns: returns || ZodUnknown.create(),
      typeName: ZodFirstPartyTypeKind.ZodFunction,
      ...processCreateParams(params)
    });
  }
};
var ZodLazy = class extends ZodType {
  get schema() {
    return this._def.getter();
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const lazySchema = this._def.getter();
    return lazySchema._parse({ data: ctx.data, path: ctx.path, parent: ctx });
  }
};
ZodLazy.create = (getter, params) => {
  return new ZodLazy({
    getter,
    typeName: ZodFirstPartyTypeKind.ZodLazy,
    ...processCreateParams(params)
  });
};
var ZodLiteral = class extends ZodType {
  _parse(input) {
    if (input.data !== this._def.value) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_literal,
        expected: this._def.value
      });
      return INVALID;
    }
    return { status: "valid", value: input.data };
  }
  get value() {
    return this._def.value;
  }
};
ZodLiteral.create = (value, params) => {
  return new ZodLiteral({
    value,
    typeName: ZodFirstPartyTypeKind.ZodLiteral,
    ...processCreateParams(params)
  });
};
function createZodEnum(values, params) {
  return new ZodEnum({
    values,
    typeName: ZodFirstPartyTypeKind.ZodEnum,
    ...processCreateParams(params)
  });
}
var ZodEnum = class _ZodEnum extends ZodType {
  constructor() {
    super(...arguments);
    _ZodEnum_cache.set(this, void 0);
  }
  _parse(input) {
    if (typeof input.data !== "string") {
      const ctx = this._getOrReturnCtx(input);
      const expectedValues = this._def.values;
      addIssueToContext(ctx, {
        expected: util.joinValues(expectedValues),
        received: ctx.parsedType,
        code: ZodIssueCode.invalid_type
      });
      return INVALID;
    }
    if (!__classPrivateFieldGet(this, _ZodEnum_cache, "f")) {
      __classPrivateFieldSet(this, _ZodEnum_cache, new Set(this._def.values), "f");
    }
    if (!__classPrivateFieldGet(this, _ZodEnum_cache, "f").has(input.data)) {
      const ctx = this._getOrReturnCtx(input);
      const expectedValues = this._def.values;
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_enum_value,
        options: expectedValues
      });
      return INVALID;
    }
    return OK(input.data);
  }
  get options() {
    return this._def.values;
  }
  get enum() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  get Values() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  get Enum() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  extract(values, newDef = this._def) {
    return _ZodEnum.create(values, {
      ...this._def,
      ...newDef
    });
  }
  exclude(values, newDef = this._def) {
    return _ZodEnum.create(this.options.filter((opt) => !values.includes(opt)), {
      ...this._def,
      ...newDef
    });
  }
};
_ZodEnum_cache = /* @__PURE__ */ new WeakMap();
ZodEnum.create = createZodEnum;
var ZodNativeEnum = class extends ZodType {
  constructor() {
    super(...arguments);
    _ZodNativeEnum_cache.set(this, void 0);
  }
  _parse(input) {
    const nativeEnumValues = util.getValidEnumValues(this._def.values);
    const ctx = this._getOrReturnCtx(input);
    if (ctx.parsedType !== ZodParsedType.string && ctx.parsedType !== ZodParsedType.number) {
      const expectedValues = util.objectValues(nativeEnumValues);
      addIssueToContext(ctx, {
        expected: util.joinValues(expectedValues),
        received: ctx.parsedType,
        code: ZodIssueCode.invalid_type
      });
      return INVALID;
    }
    if (!__classPrivateFieldGet(this, _ZodNativeEnum_cache, "f")) {
      __classPrivateFieldSet(this, _ZodNativeEnum_cache, new Set(util.getValidEnumValues(this._def.values)), "f");
    }
    if (!__classPrivateFieldGet(this, _ZodNativeEnum_cache, "f").has(input.data)) {
      const expectedValues = util.objectValues(nativeEnumValues);
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_enum_value,
        options: expectedValues
      });
      return INVALID;
    }
    return OK(input.data);
  }
  get enum() {
    return this._def.values;
  }
};
_ZodNativeEnum_cache = /* @__PURE__ */ new WeakMap();
ZodNativeEnum.create = (values, params) => {
  return new ZodNativeEnum({
    values,
    typeName: ZodFirstPartyTypeKind.ZodNativeEnum,
    ...processCreateParams(params)
  });
};
var ZodPromise = class extends ZodType {
  unwrap() {
    return this._def.type;
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.promise && ctx.common.async === false) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.promise,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const promisified = ctx.parsedType === ZodParsedType.promise ? ctx.data : Promise.resolve(ctx.data);
    return OK(promisified.then((data) => {
      return this._def.type.parseAsync(data, {
        path: ctx.path,
        errorMap: ctx.common.contextualErrorMap
      });
    }));
  }
};
ZodPromise.create = (schema, params) => {
  return new ZodPromise({
    type: schema,
    typeName: ZodFirstPartyTypeKind.ZodPromise,
    ...processCreateParams(params)
  });
};
var ZodEffects = class extends ZodType {
  innerType() {
    return this._def.schema;
  }
  sourceType() {
    return this._def.schema._def.typeName === ZodFirstPartyTypeKind.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    const effect = this._def.effect || null;
    const checkCtx = {
      addIssue: (arg) => {
        addIssueToContext(ctx, arg);
        if (arg.fatal) {
          status.abort();
        } else {
          status.dirty();
        }
      },
      get path() {
        return ctx.path;
      }
    };
    checkCtx.addIssue = checkCtx.addIssue.bind(checkCtx);
    if (effect.type === "preprocess") {
      const processed = effect.transform(ctx.data, checkCtx);
      if (ctx.common.async) {
        return Promise.resolve(processed).then(async (processed2) => {
          if (status.value === "aborted")
            return INVALID;
          const result = await this._def.schema._parseAsync({
            data: processed2,
            path: ctx.path,
            parent: ctx
          });
          if (result.status === "aborted")
            return INVALID;
          if (result.status === "dirty")
            return DIRTY(result.value);
          if (status.value === "dirty")
            return DIRTY(result.value);
          return result;
        });
      } else {
        if (status.value === "aborted")
          return INVALID;
        const result = this._def.schema._parseSync({
          data: processed,
          path: ctx.path,
          parent: ctx
        });
        if (result.status === "aborted")
          return INVALID;
        if (result.status === "dirty")
          return DIRTY(result.value);
        if (status.value === "dirty")
          return DIRTY(result.value);
        return result;
      }
    }
    if (effect.type === "refinement") {
      const executeRefinement = (acc) => {
        const result = effect.refinement(acc, checkCtx);
        if (ctx.common.async) {
          return Promise.resolve(result);
        }
        if (result instanceof Promise) {
          throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
        }
        return acc;
      };
      if (ctx.common.async === false) {
        const inner = this._def.schema._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (inner.status === "aborted")
          return INVALID;
        if (inner.status === "dirty")
          status.dirty();
        executeRefinement(inner.value);
        return { status: status.value, value: inner.value };
      } else {
        return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((inner) => {
          if (inner.status === "aborted")
            return INVALID;
          if (inner.status === "dirty")
            status.dirty();
          return executeRefinement(inner.value).then(() => {
            return { status: status.value, value: inner.value };
          });
        });
      }
    }
    if (effect.type === "transform") {
      if (ctx.common.async === false) {
        const base = this._def.schema._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (!isValid(base))
          return base;
        const result = effect.transform(base.value, checkCtx);
        if (result instanceof Promise) {
          throw new Error(`Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.`);
        }
        return { status: status.value, value: result };
      } else {
        return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((base) => {
          if (!isValid(base))
            return base;
          return Promise.resolve(effect.transform(base.value, checkCtx)).then((result) => ({ status: status.value, value: result }));
        });
      }
    }
    util.assertNever(effect);
  }
};
ZodEffects.create = (schema, effect, params) => {
  return new ZodEffects({
    schema,
    typeName: ZodFirstPartyTypeKind.ZodEffects,
    effect,
    ...processCreateParams(params)
  });
};
ZodEffects.createWithPreprocess = (preprocess, schema, params) => {
  return new ZodEffects({
    schema,
    effect: { type: "preprocess", transform: preprocess },
    typeName: ZodFirstPartyTypeKind.ZodEffects,
    ...processCreateParams(params)
  });
};
var ZodOptional = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType === ZodParsedType.undefined) {
      return OK(void 0);
    }
    return this._def.innerType._parse(input);
  }
  unwrap() {
    return this._def.innerType;
  }
};
ZodOptional.create = (type, params) => {
  return new ZodOptional({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodOptional,
    ...processCreateParams(params)
  });
};
var ZodNullable = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType === ZodParsedType.null) {
      return OK(null);
    }
    return this._def.innerType._parse(input);
  }
  unwrap() {
    return this._def.innerType;
  }
};
ZodNullable.create = (type, params) => {
  return new ZodNullable({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodNullable,
    ...processCreateParams(params)
  });
};
var ZodDefault = class extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    let data = ctx.data;
    if (ctx.parsedType === ZodParsedType.undefined) {
      data = this._def.defaultValue();
    }
    return this._def.innerType._parse({
      data,
      path: ctx.path,
      parent: ctx
    });
  }
  removeDefault() {
    return this._def.innerType;
  }
};
ZodDefault.create = (type, params) => {
  return new ZodDefault({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodDefault,
    defaultValue: typeof params.default === "function" ? params.default : () => params.default,
    ...processCreateParams(params)
  });
};
var ZodCatch = class extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const newCtx = {
      ...ctx,
      common: {
        ...ctx.common,
        issues: []
      }
    };
    const result = this._def.innerType._parse({
      data: newCtx.data,
      path: newCtx.path,
      parent: {
        ...newCtx
      }
    });
    if (isAsync(result)) {
      return result.then((result2) => {
        return {
          status: "valid",
          value: result2.status === "valid" ? result2.value : this._def.catchValue({
            get error() {
              return new ZodError(newCtx.common.issues);
            },
            input: newCtx.data
          })
        };
      });
    } else {
      return {
        status: "valid",
        value: result.status === "valid" ? result.value : this._def.catchValue({
          get error() {
            return new ZodError(newCtx.common.issues);
          },
          input: newCtx.data
        })
      };
    }
  }
  removeCatch() {
    return this._def.innerType;
  }
};
ZodCatch.create = (type, params) => {
  return new ZodCatch({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodCatch,
    catchValue: typeof params.catch === "function" ? params.catch : () => params.catch,
    ...processCreateParams(params)
  });
};
var ZodNaN = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.nan) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.nan,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return { status: "valid", value: input.data };
  }
};
ZodNaN.create = (params) => {
  return new ZodNaN({
    typeName: ZodFirstPartyTypeKind.ZodNaN,
    ...processCreateParams(params)
  });
};
var BRAND = Symbol("zod_brand");
var ZodBranded = class extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const data = ctx.data;
    return this._def.type._parse({
      data,
      path: ctx.path,
      parent: ctx
    });
  }
  unwrap() {
    return this._def.type;
  }
};
var ZodPipeline = class _ZodPipeline extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.common.async) {
      const handleAsync = async () => {
        const inResult = await this._def.in._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (inResult.status === "aborted")
          return INVALID;
        if (inResult.status === "dirty") {
          status.dirty();
          return DIRTY(inResult.value);
        } else {
          return this._def.out._parseAsync({
            data: inResult.value,
            path: ctx.path,
            parent: ctx
          });
        }
      };
      return handleAsync();
    } else {
      const inResult = this._def.in._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
      if (inResult.status === "aborted")
        return INVALID;
      if (inResult.status === "dirty") {
        status.dirty();
        return {
          status: "dirty",
          value: inResult.value
        };
      } else {
        return this._def.out._parseSync({
          data: inResult.value,
          path: ctx.path,
          parent: ctx
        });
      }
    }
  }
  static create(a, b) {
    return new _ZodPipeline({
      in: a,
      out: b,
      typeName: ZodFirstPartyTypeKind.ZodPipeline
    });
  }
};
var ZodReadonly = class extends ZodType {
  _parse(input) {
    const result = this._def.innerType._parse(input);
    const freeze = (data) => {
      if (isValid(data)) {
        data.value = Object.freeze(data.value);
      }
      return data;
    };
    return isAsync(result) ? result.then((data) => freeze(data)) : freeze(result);
  }
  unwrap() {
    return this._def.innerType;
  }
};
ZodReadonly.create = (type, params) => {
  return new ZodReadonly({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodReadonly,
    ...processCreateParams(params)
  });
};
function cleanParams(params, data) {
  const p = typeof params === "function" ? params(data) : typeof params === "string" ? { message: params } : params;
  const p2 = typeof p === "string" ? { message: p } : p;
  return p2;
}
function custom(check, _params = {}, fatal) {
  if (check)
    return ZodAny.create().superRefine((data, ctx) => {
      var _a, _b;
      const r = check(data);
      if (r instanceof Promise) {
        return r.then((r2) => {
          var _a2, _b2;
          if (!r2) {
            const params = cleanParams(_params, data);
            const _fatal = (_b2 = (_a2 = params.fatal) !== null && _a2 !== void 0 ? _a2 : fatal) !== null && _b2 !== void 0 ? _b2 : true;
            ctx.addIssue({ code: "custom", ...params, fatal: _fatal });
          }
        });
      }
      if (!r) {
        const params = cleanParams(_params, data);
        const _fatal = (_b = (_a = params.fatal) !== null && _a !== void 0 ? _a : fatal) !== null && _b !== void 0 ? _b : true;
        ctx.addIssue({ code: "custom", ...params, fatal: _fatal });
      }
      return;
    });
  return ZodAny.create();
}
var late = {
  object: ZodObject.lazycreate
};
var ZodFirstPartyTypeKind;
(function(ZodFirstPartyTypeKind2) {
  ZodFirstPartyTypeKind2["ZodString"] = "ZodString";
  ZodFirstPartyTypeKind2["ZodNumber"] = "ZodNumber";
  ZodFirstPartyTypeKind2["ZodNaN"] = "ZodNaN";
  ZodFirstPartyTypeKind2["ZodBigInt"] = "ZodBigInt";
  ZodFirstPartyTypeKind2["ZodBoolean"] = "ZodBoolean";
  ZodFirstPartyTypeKind2["ZodDate"] = "ZodDate";
  ZodFirstPartyTypeKind2["ZodSymbol"] = "ZodSymbol";
  ZodFirstPartyTypeKind2["ZodUndefined"] = "ZodUndefined";
  ZodFirstPartyTypeKind2["ZodNull"] = "ZodNull";
  ZodFirstPartyTypeKind2["ZodAny"] = "ZodAny";
  ZodFirstPartyTypeKind2["ZodUnknown"] = "ZodUnknown";
  ZodFirstPartyTypeKind2["ZodNever"] = "ZodNever";
  ZodFirstPartyTypeKind2["ZodVoid"] = "ZodVoid";
  ZodFirstPartyTypeKind2["ZodArray"] = "ZodArray";
  ZodFirstPartyTypeKind2["ZodObject"] = "ZodObject";
  ZodFirstPartyTypeKind2["ZodUnion"] = "ZodUnion";
  ZodFirstPartyTypeKind2["ZodDiscriminatedUnion"] = "ZodDiscriminatedUnion";
  ZodFirstPartyTypeKind2["ZodIntersection"] = "ZodIntersection";
  ZodFirstPartyTypeKind2["ZodTuple"] = "ZodTuple";
  ZodFirstPartyTypeKind2["ZodRecord"] = "ZodRecord";
  ZodFirstPartyTypeKind2["ZodMap"] = "ZodMap";
  ZodFirstPartyTypeKind2["ZodSet"] = "ZodSet";
  ZodFirstPartyTypeKind2["ZodFunction"] = "ZodFunction";
  ZodFirstPartyTypeKind2["ZodLazy"] = "ZodLazy";
  ZodFirstPartyTypeKind2["ZodLiteral"] = "ZodLiteral";
  ZodFirstPartyTypeKind2["ZodEnum"] = "ZodEnum";
  ZodFirstPartyTypeKind2["ZodEffects"] = "ZodEffects";
  ZodFirstPartyTypeKind2["ZodNativeEnum"] = "ZodNativeEnum";
  ZodFirstPartyTypeKind2["ZodOptional"] = "ZodOptional";
  ZodFirstPartyTypeKind2["ZodNullable"] = "ZodNullable";
  ZodFirstPartyTypeKind2["ZodDefault"] = "ZodDefault";
  ZodFirstPartyTypeKind2["ZodCatch"] = "ZodCatch";
  ZodFirstPartyTypeKind2["ZodPromise"] = "ZodPromise";
  ZodFirstPartyTypeKind2["ZodBranded"] = "ZodBranded";
  ZodFirstPartyTypeKind2["ZodPipeline"] = "ZodPipeline";
  ZodFirstPartyTypeKind2["ZodReadonly"] = "ZodReadonly";
})(ZodFirstPartyTypeKind || (ZodFirstPartyTypeKind = {}));
var instanceOfType = (cls, params = {
  message: `Input not instance of ${cls.name}`
}) => custom((data) => data instanceof cls, params);
var stringType = ZodString.create;
var numberType = ZodNumber.create;
var nanType = ZodNaN.create;
var bigIntType = ZodBigInt.create;
var booleanType = ZodBoolean.create;
var dateType = ZodDate.create;
var symbolType = ZodSymbol.create;
var undefinedType = ZodUndefined.create;
var nullType = ZodNull.create;
var anyType = ZodAny.create;
var unknownType = ZodUnknown.create;
var neverType = ZodNever.create;
var voidType = ZodVoid.create;
var arrayType = ZodArray.create;
var objectType = ZodObject.create;
var strictObjectType = ZodObject.strictCreate;
var unionType = ZodUnion.create;
var discriminatedUnionType = ZodDiscriminatedUnion.create;
var intersectionType = ZodIntersection.create;
var tupleType = ZodTuple.create;
var recordType = ZodRecord.create;
var mapType = ZodMap.create;
var setType = ZodSet.create;
var functionType = ZodFunction.create;
var lazyType = ZodLazy.create;
var literalType = ZodLiteral.create;
var enumType = ZodEnum.create;
var nativeEnumType = ZodNativeEnum.create;
var promiseType = ZodPromise.create;
var effectsType = ZodEffects.create;
var optionalType = ZodOptional.create;
var nullableType = ZodNullable.create;
var preprocessType = ZodEffects.createWithPreprocess;
var pipelineType = ZodPipeline.create;
var ostring = () => stringType().optional();
var onumber = () => numberType().optional();
var oboolean = () => booleanType().optional();
var coerce = {
  string: (arg) => ZodString.create({ ...arg, coerce: true }),
  number: (arg) => ZodNumber.create({ ...arg, coerce: true }),
  boolean: (arg) => ZodBoolean.create({
    ...arg,
    coerce: true
  }),
  bigint: (arg) => ZodBigInt.create({ ...arg, coerce: true }),
  date: (arg) => ZodDate.create({ ...arg, coerce: true })
};
var NEVER = INVALID;
var z = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  defaultErrorMap: errorMap,
  setErrorMap,
  getErrorMap,
  makeIssue,
  EMPTY_PATH,
  addIssueToContext,
  ParseStatus,
  INVALID,
  DIRTY,
  OK,
  isAborted,
  isDirty,
  isValid,
  isAsync,
  get util() {
    return util;
  },
  get objectUtil() {
    return objectUtil;
  },
  ZodParsedType,
  getParsedType,
  ZodType,
  datetimeRegex,
  ZodString,
  ZodNumber,
  ZodBigInt,
  ZodBoolean,
  ZodDate,
  ZodSymbol,
  ZodUndefined,
  ZodNull,
  ZodAny,
  ZodUnknown,
  ZodNever,
  ZodVoid,
  ZodArray,
  ZodObject,
  ZodUnion,
  ZodDiscriminatedUnion,
  ZodIntersection,
  ZodTuple,
  ZodRecord,
  ZodMap,
  ZodSet,
  ZodFunction,
  ZodLazy,
  ZodLiteral,
  ZodEnum,
  ZodNativeEnum,
  ZodPromise,
  ZodEffects,
  ZodTransformer: ZodEffects,
  ZodOptional,
  ZodNullable,
  ZodDefault,
  ZodCatch,
  ZodNaN,
  BRAND,
  ZodBranded,
  ZodPipeline,
  ZodReadonly,
  custom,
  Schema: ZodType,
  ZodSchema: ZodType,
  late,
  get ZodFirstPartyTypeKind() {
    return ZodFirstPartyTypeKind;
  },
  coerce,
  any: anyType,
  array: arrayType,
  bigint: bigIntType,
  boolean: booleanType,
  date: dateType,
  discriminatedUnion: discriminatedUnionType,
  effect: effectsType,
  "enum": enumType,
  "function": functionType,
  "instanceof": instanceOfType,
  intersection: intersectionType,
  lazy: lazyType,
  literal: literalType,
  map: mapType,
  nan: nanType,
  nativeEnum: nativeEnumType,
  never: neverType,
  "null": nullType,
  nullable: nullableType,
  number: numberType,
  object: objectType,
  oboolean,
  onumber,
  optional: optionalType,
  ostring,
  pipeline: pipelineType,
  preprocess: preprocessType,
  promise: promiseType,
  record: recordType,
  set: setType,
  strictObject: strictObjectType,
  string: stringType,
  symbol: symbolType,
  transformer: effectsType,
  tuple: tupleType,
  "undefined": undefinedType,
  union: unionType,
  unknown: unknownType,
  "void": voidType,
  NEVER,
  ZodIssueCode,
  quotelessJson,
  ZodError
});

// src/utils/environment.ts
var internetComputerEnvSchema = z.object({
  INTERNET_COMPUTER_PRIVATE_KEY: z.string().min(1, "ICP private key is required")
});
async function validateInternetComputerConfig(runtime) {
  try {
    const config = {
      INTERNET_COMPUTER_PRIVATE_KEY: runtime.getSetting("INTERNET_COMPUTER_PRIVATE_KEY")
    };
    return internetComputerEnvSchema.parse(config);
  } catch (error) {
    console.log("error::::", error);
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map((err) => `${err.path.join(".")}: ${err.message}`).join("\n");
      throw new Error(`Internet Computer configuration validation failed:
${errorMessages}`);
    }
    throw error;
  }
}

// src/actions/getTokenPrice.ts
var getTokenPrice = async (symbol) => {
  try {
    const response = await fetch(`${KONG_SWAP_TOKEN_API_HOST}?page=1&limit=50`);
    const data = await response.json();
    const token = data.items.find(
      (item) => item.symbol.toLowerCase() === symbol.toLowerCase()
    );
    console.log("token:", token);
    if (!token) {
      throw new Error(`Token ${symbol} not found`);
    }
    return {
      symbol: token.symbol,
      price: token.metrics.price,
      priceChange: token.metrics.price_change_24h || "0",
      marketCap: token.metrics.market_cap,
      volume: token.metrics.volume_24h,
      lastUpdated: token.metrics.updated_at
    };
  } catch (error) {
    console.error("Error fetching token price:", error);
    throw error;
  }
};
var getTokenPriceAction = {
  name: "GET_TOKEN_PRICE",
  description: "Get token price from KongSwap",
  similes: ["TOKEN_PRICE", "CHECK_PRICE"],
  handler: async (runtime, message, state, _options, callback) => {
    try {
      if (!state) {
        state = await runtime.composeState(message);
      }
      const messageText = typeof message.content === "string" ? message.content : message.content.text || "";
      const match = messageText.match(/price of (\w+)/i) || messageText.match(/(\w+) price/i);
      const symbol = match ? match[1].toUpperCase() : "ICP";
      const priceData = await getTokenPrice(symbol);
      callback == null ? void 0 : callback({
        text: `${symbol} is currently trading at $${Number(priceData.price).toFixed(4)}. In the last 24 hours, the price has changed by ${Number(priceData.priceChange).toFixed(2)}%. The token has a market cap of $${Number(priceData.marketCap).toLocaleString()} with a 24-hour trading volume of $${Number(priceData.volume).toLocaleString()}.`,
        action: "GET_TOKEN_PRICE",
        type: "success"
      });
    } catch (error) {
      callback == null ? void 0 : callback({
        text: `\u274C Failed to get token price: ${error instanceof Error ? error.message : "Unknown error"}`,
        action: "GET_TOKEN_PRICE",
        type: "error"
      });
    }
  },
  validate: async (runtime, message) => {
    const keywords = [
      "price",
      "price of",
      "token price",
      "how much is",
      "what is the price of"
    ];
    await validateInternetComputerConfig(runtime);
    const messageText = (typeof message.content === "string" ? message.content : message.content.text || "").toLowerCase();
    return keywords.some((keyword) => messageText.includes(keyword));
  },
  examples: [[
    {
      user: "{{user1}}",
      content: "What's the price of ICP?"
    },
    {
      user: "{{user2}}",
      content: {
        text: "\u{1F4B0} Current price of ICP is $5.66\n\u{1F4C8} 24h Change: -6.52%",
        action: "GET_TOKEN_PRICE"
      }
    }
  ]]
};

// src/actions/transferToken.ts
import {
  ModelClass,
  composeContext,
  generateObjectDeprecated
} from "@elizaos/core";

// src/constants/canisters.ts
var CANISTER_IDS = {
  PICK_PUMP: "tl65e-yyaaa-aaaah-aq2pa-cai",
  CKBTC: "mxzaz-hqaaa-aaaar-qaada-cai",
  ICPSWAP_FACTORY: "4mmnk-kiaaa-aaaag-qbllq-cai",
  STORAGE_CANISTER: "vv4p7-5yaaa-aaaal-asc7a-cai",
  CKUSDT: "cngnf-vqaaa-aaaar-qag4q-cai",
  CHAT: "2ouva-viaaa-aaaaq-aaamq-cai",
  ICP: "ryjl3-tyaaa-aaaaa-aaaba-cai",
  GOVERNANCE: "rrkah-fqaaa-aaaaa-aaaaq-cai",
  ESCROW_ADDRESS: "rtqyh-h2r2t-uvy5j-5sodt-jhkre-nem3l-bk5k6-smmbh-2dzex-gfttk-kqe"
};

// src/actions/prompts/token.ts
var createTokenTemplate = `Based on the user's description, generate creative and memorable values for a new meme token on PickPump:

User's idea: "{{recentMessages}}"

Please generate:
1. A catchy and fun token name that reflects the theme
2. A 3-4 letter symbol based on the name (all caps)
3. An engaging and humorous description (include emojis)
4. Set other fields to null

Example response:
\`\`\`json
{
    "name": "CatLaser",
    "symbol": "PAWS",
    "description": "The first meme token powered by feline laser-chasing energy! Watch your investment zoom around like a red dot! \u{1F63A}\u{1F534}\u2728",
    "logo": null,
    "website": null,
    "twitter": null,
    "telegram": null
}
\`\`\`

Generate appropriate meme token information based on the user's description.
Respond with a JSON markdown block containing only the generated values.`;
var transferTemplate = `Extract transfer details for sending tokens to another address.

User's message: "{{recentMessages}}"

Required information:
1. amount: Number of tokens to send
2. to: Recipient's principal address (63 characters)
3. canisterId: Token's canister ID (27 characters)

Return in this format:
{
    "amount": "[NUMBER]",
    "to": "[PRINCIPAL_ADDRESS]",
    "canisterId": "[CANISTER_ID]"
}

RULES
- if the user wants to send icp, the canisterId is ${CANISTER_IDS.ICP}
- if the user wants to send ckusdt, the canisterId is ${CANISTER_IDS.CKUSDT}
- if the user wants to send ckbtc, the canisterId is ${CANISTER_IDS.CKBTC}
- if the user wants to send chat, the canisterId is ${CANISTER_IDS.CHAT}

Example valid inputs:
"send 100 CHAT to 4dcwd-5oxhq-z32kh-2prdj-uoh2h-rjfc7-6faoh-rsvbn-jypgt-t6ayq-cae"
"transfer 50 tokens to principal 4dcwd-5oxhq-z32kh-2prdj-uoh2h-rjfc7-6faoh-rsvbn-jypgt-t6ayq-cae"

Note: This is for sending tokens to another address ONLY. For token swaps, use the swap command instead.
NO additional text or explanations in the output.`;
var logoPromptTemplate = `Based on this token idea: "{{description}}", create a detailed prompt for generating a logo image.
The prompt should describe visual elements, style, and mood for the logo.
Focus on making it memorable and suitable for a cryptocurrency token.
Keep the response short and specific.
Respond with only the prompt text, no additional formatting.

Example for a dog-themed token:
"A playful cartoon dog face with a cryptocurrency symbol on its collar, using vibrant colors and bold outlines, crypto-themed minimal style"`;
var swapTemplate = `Extract token swap details from the user's message. This is for exchanging one token for another.

User's message: "{{recentMessages}}"

Required information:
1. fromToken: Source token name/symbol (e.g., "CHAT", "ICP")
2. toToken: Target token name/symbol (e.g., "EXE", "ckBTC")
3. amount: Number of source tokens to swap
4. platform: Trading platform ("kongswap" or "icpswap")
5. DEFAULT platform is kongswap
6. When swapping, we dont need to specify the receiver address because the tokens are deposited to the wallet that did the swap automatically
7. Please generate the response in JSON format:
{
    "fromToken": "[SOURCE_TOKEN]",
    "toToken": "[TARGET_TOKEN]",
    "amount": "[NUMBER]",
    "platform": "[PLATFORM]"
}

Example valid inputs:
"swap 100 CHAT for EXE on kongswap"
"exchange 50 ICP to ckBTC using icpswap"
"convert 25 CHAT into EXE via kongswap"
"trade 75 AWL for CHAT through icpswap"

Note: Platform (kongswap/icpswap) must be specified if no platform is specified in the user's message, use kongswap as default. No recipient address needed - swapped tokens go directly to your wallet.
NO additional text or explanations in the output.`;
var buyTokenTemplate = `Extract token purchase details from the user's message.

User's message: "{{recentMessages}}"

Required information:
1. tokenSymbol: Token symbol/name to buy (e.g., "ICP", "CHAT")
2. amount: Number of tokens to buy

Return in this format:
{
    "tokenSymbol": "[TOKEN_SYMBOL]",
    "amount": "[NUMBER]"
}

Example valid inputs:
"I want to buy 100 ICP"
"How can I purchase 50 CHAT tokens"
"Buy 25 ckBTC"

NO additional text or explanations in the output.`;
var stakeNeuronTemplate = `Extract ICP staking details from the user's message.

User's message: "{{recentMessages}}"

Required information:
1. amount: Number of ICP to stake
2. neuronId: Neuron ID to stake into (optional)

Return in this format:
{
    "amount": "[NUMBER]",
    "neuronId": "[NEURON_ID or null]"
}

Example valid inputs:
"create a new neuron with 1 icp"
"stake 1 ICP in a neuron"
"stake 0.5 ICP in neuron 12345678"
"add 1 ICP to neuron 987654321"
"use 1 icp to stake in a neuron"

Note: If no neuron ID is specified, a new neuron will be created.
NO additional text or explanations in the output.`;
var startDissolveNeuronTemplate = `Extract neuron ID for dissolving from the user's message.

User's message: "{{recentMessages}}"

Required information:
1. neuronId: Neuron ID to dissolve

RULES:
- Use the latest messages in the state to determine the neuron id

Return in this format as a bigInt:
{
    "neuronId": "[NEURON_ID]"
}

Example valid inputs:
"dissolve neuron 12345678"
"start dissolving neuron 987654321"
"start dissolving neuron 12345678"
"start dissolving neuron 987654321"

NO additional text or explanations in the output.`;
var stopDissolveNeuronTemplate = `Extract neuron ID for stopping dissolving from the user's message.

User's message: "{{recentMessages}}"

Required information:
1. neuronId: Neuron ID to stop dissolving

RULES:
- Use the latest messages in the state to determine the neuron id

Return in this format as a bigInt:
{
    "neuronId": "[NEURON_ID]"
}

Example valid inputs:
"stop dissolving neuron 12345678"
"stop dissolving neuron 987654321"
"stop dissolving neuron 12345678"
"stop dissolving neuron 987654321"

NO additional text or explanations in the output.`;
var increaseDissolveDelayTemplate = `Extract neuron ID and delay time for increasing dissolve delay from the user's message.

User's message: "{{recentMessages}}"


RULES:
- If the user specifies the time in hours, convert it to days (1 day = 24 hours).
- If the user specifies the time in days, use it directly.
- Use the latest messages in the state to determine the neuron id and the delay time



Required information:
1. neuronId: Neuron ID to increase dissolve delay
2. delayDays: Delay time in days

Return in this format:
{
    "neuronId": "[NEURON_ID]",
    "delayDays": "[DELAY_DAYS]"
}


Example valid inputs:
"increase dissolve delay for neuron 12345678 by 240 hours"
"extend dissolve delay for neuron 987654321 by 10 days"
"increase dissolve delay for neuron 12345678 by 48 hours"
"extend dissolve delay for neuron 987654321 by 5 days"

NO additional text or explanations in the output.`;
var disburseNeuronTemplate = `Extract disburse details from the user's message.

User's message: "{{recentMessages}}"

Required information:
1. neuronId: Neuron ID to disburse
2. amount: Number of tokens to disburse
3. toAccountId: Recipient's account ID

RULES:
- Use the latest messages in the state to determine the neuron id, amount and toAccountId

Return in this format:
{
    "neuronId": "[NEURON_ID]",
    "amount": "[NUMBER]",
    "toAccountId": "[ACCOUNT_ID]"
    }

Example valid inputs:
"disburse 100 ICP from neuron 12345678 to 783b4a9fa2e08acf2e540ed442e57f497de231bbab974e6f57c4f493cb23d7fe"
"withdraw 0.4 ICP from neuron 987654321 to 783b4a9fa2e08acf2e540ed442e57f497de231bbab974e6f57c4f493cb23d7fe"

NO additional text or explanations in the output.`;

// src/canisters/icrc/index.did.ts
var idlFactory = ({ IDL }) => {
  const Account = IDL.Record({
    owner: IDL.Principal,
    subaccount: IDL.Opt(IDL.Vec(IDL.Nat8))
  });
  const TransferArgs = IDL.Record({
    to: Account,
    fee: IDL.Opt(IDL.Nat),
    memo: IDL.Opt(IDL.Vec(IDL.Nat8)),
    from_subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)),
    created_at_time: IDL.Opt(IDL.Nat64),
    amount: IDL.Nat
  });
  const TransferError = IDL.Variant({
    GenericError: IDL.Record({ message: IDL.Text, error_code: IDL.Nat }),
    TemporarilyUnavailable: IDL.Null,
    BadBurn: IDL.Record({ min_burn_amount: IDL.Nat }),
    Duplicate: IDL.Record({ duplicate_of: IDL.Nat }),
    BadFee: IDL.Record({ expected_fee: IDL.Nat }),
    CreatedInFuture: IDL.Record({ ledger_time: IDL.Nat64 }),
    TooOld: IDL.Null,
    InsufficientFunds: IDL.Record({ balance: IDL.Nat })
  });
  const TransferResult = IDL.Variant({
    Ok: IDL.Nat,
    Err: TransferError
  });
  const AllowanceArgs = IDL.Record({
    account: Account,
    spender: Account
  });
  const Allowance = IDL.Record({
    allowance: IDL.Nat,
    expires_at: IDL.Opt(IDL.Nat64)
  });
  const ApproveArgs2 = IDL.Record({
    fee: IDL.Opt(IDL.Nat),
    memo: IDL.Opt(IDL.Vec(IDL.Nat8)),
    from_subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)),
    created_at_time: IDL.Opt(IDL.Nat64),
    amount: IDL.Nat,
    expected_allowance: IDL.Opt(IDL.Nat),
    expires_at: IDL.Opt(IDL.Nat64),
    spender: Account
  });
  const ApproveError = IDL.Variant({
    GenericError: IDL.Record({ message: IDL.Text, error_code: IDL.Nat }),
    TemporarilyUnavailable: IDL.Null,
    Duplicate: IDL.Record({ duplicate_of: IDL.Nat }),
    BadFee: IDL.Record({ expected_fee: IDL.Nat }),
    AllowanceChanged: IDL.Record({ current_allowance: IDL.Nat }),
    CreatedInFuture: IDL.Record({ ledger_time: IDL.Nat64 }),
    TooOld: IDL.Null,
    Expired: IDL.Record({ ledger_time: IDL.Nat64 }),
    InsufficientFunds: IDL.Record({ balance: IDL.Nat })
  });
  const ApproveResult2 = IDL.Variant({
    Ok: IDL.Nat,
    Err: ApproveError
  });
  return IDL.Service({
    icrc1_decimals: IDL.Func([], [IDL.Nat8], ["query"]),
    icrc1_fee: IDL.Func([], [IDL.Nat], ["query"]),
    icrc1_balance_of: IDL.Func([Account], [IDL.Nat], ["query"]),
    icrc1_transfer: IDL.Func([TransferArgs], [TransferResult], []),
    icrc2_approve: IDL.Func([ApproveArgs2], [ApproveResult2], []),
    icrc2_allowance: IDL.Func([AllowanceArgs], [Allowance], ["query"])
  });
};

// src/actions/transferToken.ts
import { Principal as Principal3 } from "@dfinity/principal";

// src/utils/ic/principals.ts
import { Principal } from "@dfinity/principal";
var isPrincipalText = (text) => {
  if (!text) return false;
  try {
    Principal.fromText(text);
    return true;
  } catch {
    return false;
  }
};

// src/utils/common/data/json.ts
var customStringify = (v) => JSON.stringify(v, (_key, value) => {
  if (typeof value === "bigint") {
    return `${value}`;
  } else if (value && typeof value === "object" && value._isPrincipal === true) {
    return value.toText();
  } else if (value && typeof value === "object" && value.__principal__ && isPrincipalText(value.__principal__)) {
    return value.__principal__;
  }
  return value;
});

// src/utils/common/types/results.ts
var unwrapRustResultMap = (result, transform_ok, transform_err) => {
  if (result.Ok !== void 0) return transform_ok(result.Ok);
  if (result.Err !== void 0) return transform_err(result.Err);
  throw new Error(`wrong rust result: ${customStringify(result)}`);
};

// src/utils/ic/index.ts
import { Principal as Principal2 } from "@dfinity/principal";
var formatTransferError = (err) => {
  if (err.InsufficientFunds) {
    return `Insufficient funds. Current balance: ${Number(err.InsufficientFunds.balance) / 1e8}`;
  }
  if (err.BadFee) {
    return `Incorrect fee. Expected fee: ${err.BadFee.expected_fee} tokens`;
  }
  if (err.GenericError) {
    return `${err.GenericError.message} (Error code: ${err.GenericError.error_code})`;
  }
  if (err.TemporarilyUnavailable) {
    return "Service temporarily unavailable. Please try again later";
  }
  if (err.CreatedInFuture) {
    return "Transaction timestamp is in the future";
  }
  if (err.TooOld) {
    return "Transaction is too old";
  }
  if (err.Duplicate) {
    return `Duplicate transaction. Already processed in block ${err.Duplicate.duplicate_of}`;
  }
  return `Unknown error: ${JSON.stringify(err)}`;
};
var getTokenByNameOrSymbol = async (nameOrSymbol) => {
  try {
    const response = await fetch(KONG_SWAP_TOKEN_API_HOST);
    const data = await response.json();
    const searchTerm = nameOrSymbol.toLowerCase().trim();
    let token = data.items.find(
      (t) => t.symbol.toLowerCase() === searchTerm || t.name.toLowerCase() === searchTerm
    );
    if (!token) {
      token = data.items.find((t) => {
        const symbol = t.symbol.toLowerCase();
        const name = t.name.toLowerCase();
        if (name.includes(searchTerm)) return true;
        if (searchTerm.split("").every((char) => symbol.includes(char))) return true;
        if (symbol.includes(searchTerm) || searchTerm.includes(symbol)) return true;
        return false;
      });
    }
    if (!token) return null;
    return {
      symbol: token.symbol,
      name: token.name,
      canisterId: token.canister_id
    };
  } catch (error) {
    console.error("Error getting token by name/symbol:", error);
    return null;
  }
};

// src/actions/transferToken.ts
var validateTransferParams = (response) => {
  if (response.error) {
    throw new Error(response.error);
  }
  if (!response.canisterId) {
    throw new Error("Please provide the canister ID for the token you want to transfer");
  }
  if (response.canisterId.length !== 27) {
    throw new Error("Invalid canister ID format. Please provide a valid 27-character canister ID");
  }
  if (!response.to) {
    throw new Error("Please provide a recipient address");
  }
  if (!response.amount || isNaN(Number(response.amount))) {
    throw new Error("Please specify a valid amount to transfer");
  }
};
var transferTokenTransaction = async (creator, params) => {
  const actor = await creator(idlFactory, params.canisterId);
  try {
    const toPrincipal = typeof params.to === "string" ? Principal3.fromText(params.to) : params.to;
    console.log("Amount to transfer:", params.amount, "->", params.amount.toString());
    console.log("transfers params", params);
    const result = await actor.icrc1_transfer({
      to: {
        owner: toPrincipal,
        subaccount: []
      },
      fee: [],
      memo: [],
      from_subaccount: [],
      created_at_time: [],
      amount: Number(params.amount)
    });
    console.log("transfer result", result);
    return unwrapRustResultMap(
      result,
      (ok) => ({
        Ok: `Transfer successful! Transaction block height: ${ok}. You can view more details about your transaction on the ICP dashboard.`
      }),
      (err) => {
        throw new Error(formatTransferError(err));
      }
    );
  } catch (error) {
    console.error("Transfer error:", error);
    throw error;
  }
};
var transferTokenAction = {
  name: "TRANSFER_TOKEN",
  description: "Transfer an icrc1 token to a specific principal address",
  similes: ["SEND_TOKENS", "SEND_TOKEN", "TRANSFER"],
  validate: async (runtime, message) => {
    const messageText = (typeof message.content === "string" ? message.content : message.content.text || "").toLowerCase();
    const transferKeywords = ["send", "transfer", "send to", "transfer to"];
    const addressPatterns = [
      /to\s+[a-zA-Z0-9-]{10,}/i,
      /address[:\s]+[a-zA-Z0-9-]{10,}/i,
      /recipient[:\s]+[a-zA-Z0-9-]{10,}/i,
      /principal[:\s]+[a-zA-Z0-9-]{10,}/i
    ];
    return transferKeywords.some((keyword) => messageText.includes(keyword)) && addressPatterns.some((pattern) => pattern.test(messageText));
  },
  handler: async (runtime, message, state, _options, callback) => {
    try {
      if (!state) {
        state = await runtime.composeState(message);
      } else {
        state = await runtime.updateRecentMessageState(state);
      }
      const transferTokenContext = composeContext({
        state,
        template: transferTemplate
      });
      const response = await generateObjectDeprecated({
        runtime,
        context: transferTokenContext,
        modelClass: ModelClass.LARGE
      });
      await validateTransferParams(response);
      callback == null ? void 0 : callback({
        text: `\u{1F50D} Please confirm this transfer:

Amount: ${response.amount} tokens
To: ${response.to}
Canister ID: ${response.canisterId}

Type 'yes' to confirm or 'no' to cancel.`,
        action: "TRANSFER_TOKEN",
        type: "confirmation"
      });
      const confirmation = message.content.text;
      if (confirmation.toLowerCase().includes("no")) {
        callback == null ? void 0 : callback({
          text: "\u274C Transfer cancelled by user",
          action: "TRANSFER_TOKEN",
          type: "cancelled"
        });
        return;
      }
      callback == null ? void 0 : callback({
        text: `\u{1F504} Initiating transfer of ${response.amount} tokens to ${response.to}...`,
        action: "TRANSFER_TOKEN",
        type: "processing"
      });
      const walletResponse = await icpWalletProvider.get(runtime, message, state);
      if (!walletResponse.wallet || !walletResponse.createActor) {
        throw new Error("Failed to initialize wallet");
      }
      const result = await transferTokenTransaction(walletResponse.createActor, {
        to: response.to,
        amount: Math.floor(Number(response.amount) * 1e8),
        canisterId: response.canisterId
      });
      callback == null ? void 0 : callback({
        text: `\u2705 Transfer complete: ${result.Ok}`,
        action: "TRANSFER_TOKEN",
        type: "success"
      });
    } catch (error) {
      console.error("Transfer error:", error);
      callback == null ? void 0 : callback({
        text: `\u274C Transfer failed: ${error instanceof Error ? error.message : "Unknown error"}`,
        action: "TRANSFER_TOKEN",
        type: "error"
      });
    }
  },
  //examples of the conversation
  examples: [
    [
      {
        user: "{{user1}}",
        content: "I want to sent 100 CHAT to my friend. and the recipient address: 4dcwd-5oxhq-z32kh-2prdj-uoh2h-rjfc7-6faoh-rsvbn-jypgt-t6ayq-cae"
      },
      {
        user: "{{user2}}",
        content: {
          text: "Transferring tokens to my friend.",
          action: "TRANSFER_TOKEN"
        }
      },
      {
        user: "{{user2}}",
        content: {
          text: "\u2728 Tokens transferred successfully!"
        }
      }
    ],
    [
      {
        user: "{{user1}}",
        content: "I want to sent some EXE to my friend"
      },
      {
        user: "{{user2}}",
        content: {
          text: "can you please specify the recipient address and the amount you want to send"
        }
      },
      {
        user: "{{user1}}",
        content: "I want to sent 100 EXE to my friend. and the recipient address: 4dcwd-5oxhq-z32kh-2prdj-uoh2h-rjfc7-6faoh-rsvbn-jypgt-t6ayq-cae"
      },
      {
        user: "{{user2}}",
        content: {
          text: "Transferring tokens to my friend.",
          action: "TRANSFER_TOKEN"
        }
      },
      {
        user: "{{user2}}",
        content: {
          text: "\u2728 Tokens transferred successfully!"
        }
      }
    ]
  ]
};

// src/actions/createToken.ts
import {
  composeContext as composeContext2,
  generateImage,
  generateText,
  generateObjectDeprecated as generateObjectDeprecated2
} from "@elizaos/core";
import {
  ModelClass as ModelClass2
} from "@elizaos/core";

// src/canisters/pick-pump/index.did.ts
var idlFactory2 = ({ IDL }) => {
  const Result2 = IDL.Variant({ Ok: IDL.Nat, Err: IDL.Text });
  const CreateMemeTokenArg = IDL.Record({
    twitter: IDL.Opt(IDL.Text),
    logo: IDL.Text,
    name: IDL.Text,
    description: IDL.Text,
    website: IDL.Opt(IDL.Text),
    telegram: IDL.Opt(IDL.Text),
    symbol: IDL.Text
  });
  const MemeToken = IDL.Record({
    id: IDL.Nat64,
    creator: IDL.Text,
    available_token: IDL.Nat,
    twitter: IDL.Opt(IDL.Text),
    volume_24h: IDL.Nat,
    logo: IDL.Text,
    name: IDL.Text,
    liquidity: IDL.Float64,
    description: IDL.Text,
    created_at: IDL.Nat64,
    website: IDL.Opt(IDL.Text),
    last_tx_time: IDL.Nat64,
    canister: IDL.Opt(IDL.Text),
    market_cap_icp: IDL.Nat,
    market_cap_usd: IDL.Float64,
    price: IDL.Float64,
    telegram: IDL.Opt(IDL.Text),
    symbol: IDL.Text
  });
  const Result_1 = IDL.Variant({ Ok: MemeToken, Err: IDL.Text });
  const Transaction2 = IDL.Record({
    token_amount: IDL.Nat,
    token_id: IDL.Nat64,
    token_symbol: IDL.Text,
    from: IDL.Text,
    timestamp: IDL.Nat64,
    icp_amount: IDL.Nat,
    tx_type: IDL.Text
  });
  const CreateCommentArg = IDL.Record({
    token: IDL.Text,
    content: IDL.Text,
    image: IDL.Opt(IDL.Text)
  });
  const Sort = IDL.Variant({
    CreateTimeDsc: IDL.Null,
    LastTradeDsc: IDL.Null,
    MarketCapDsc: IDL.Null
  });
  const Candle = IDL.Record({
    low: IDL.Float64,
    high: IDL.Float64,
    close: IDL.Float64,
    open: IDL.Float64,
    timestamp: IDL.Nat64
  });
  const Comment = IDL.Record({
    creator: IDL.Text,
    token: IDL.Text,
    content: IDL.Text,
    created_at: IDL.Nat64,
    image: IDL.Opt(IDL.Text)
  });
  const Holder = IDL.Record({ balance: IDL.Nat, owner: IDL.Text });
  const User = IDL.Record({
    principal: IDL.Text,
    name: IDL.Text,
    last_login_seconds: IDL.Nat64,
    register_at_second: IDL.Nat64,
    avatar: IDL.Text
  });
  const MemeTokenView = IDL.Record({
    token: MemeToken,
    balance: IDL.Nat
  });
  const WalletReceiveResult = IDL.Record({ accepted: IDL.Nat64 });
  return IDL.Service({
    buy: IDL.Func([IDL.Nat64, IDL.Float64], [Result2], []),
    calculate_buy: IDL.Func([IDL.Nat64, IDL.Float64], [Result2], ["query"]),
    calculate_sell: IDL.Func([IDL.Nat64, IDL.Float64], [Result2], ["query"]),
    create_token: IDL.Func([CreateMemeTokenArg], [Result_1], []),
    king_of_hill: IDL.Func([], [IDL.Opt(MemeToken)], ["query"]),
    last_txs: IDL.Func([IDL.Nat64], [IDL.Vec(Transaction2)], ["query"]),
    post_comment: IDL.Func([CreateCommentArg], [], []),
    query_all_tokens: IDL.Func(
      [IDL.Nat64, IDL.Nat64, IDL.Opt(Sort)],
      [IDL.Vec(MemeToken), IDL.Nat64],
      ["query"]
    ),
    query_token: IDL.Func([IDL.Nat64], [IDL.Opt(MemeToken)], ["query"]),
    query_token_candle: IDL.Func(
      [IDL.Nat64, IDL.Opt(IDL.Nat64)],
      [IDL.Vec(Candle)],
      ["query"]
    ),
    query_token_comments: IDL.Func(
      [IDL.Principal, IDL.Nat64, IDL.Nat64],
      [IDL.Vec(Comment), IDL.Nat64],
      ["query"]
    ),
    query_token_holders: IDL.Func(
      [IDL.Nat64, IDL.Nat64, IDL.Nat64],
      [IDL.Vec(Holder), IDL.Nat64],
      ["query"]
    ),
    query_token_transactions: IDL.Func(
      [IDL.Nat64, IDL.Nat64, IDL.Nat64],
      [IDL.Vec(Transaction2), IDL.Nat64],
      ["query"]
    ),
    query_user: IDL.Func([IDL.Opt(IDL.Principal)], [User], ["query"]),
    query_user_launched: IDL.Func(
      [IDL.Opt(IDL.Principal)],
      [IDL.Vec(MemeToken)],
      ["query"]
    ),
    query_user_tokens: IDL.Func(
      [IDL.Opt(IDL.Principal)],
      [IDL.Vec(MemeTokenView)],
      ["query"]
    ),
    sell: IDL.Func([IDL.Nat64, IDL.Float64], [Result2], []),
    wallet_balance: IDL.Func([], [IDL.Nat], ["query"]),
    wallet_receive: IDL.Func([], [WalletReceiveResult], [])
  });
};

// src/utils/common/types/options.ts
var unwrapOption = (v) => v.length ? v[0] : void 0;
var wrapOption = (v) => v !== void 0 ? [v] : [];

// src/apis/uploadFile.ts
async function uploadFileToWeb3Storage(base64Data, fileName = "image.png") {
  try {
    const cleanBase64 = base64Data.replace(/^data:image\/\w+;base64,/, "");
    const byteCharacters = atob(cleanBase64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "image/png" });
    const file = new File([blob], fileName, { type: "image/png" });
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch(WEB3_STORAGE_API_HOST, {
      method: "POST",
      body: formData
    });
    if (!response.ok) {
      throw new Error(`Upload failed with status: ${response.status}`);
    }
    const result = await response.json();
    return result;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "upload failed"
    };
  }
}

// src/actions/createToken.ts
async function createTokenTransaction(creator, tokenInfo) {
  const actor = await creator(idlFactory2, CANISTER_IDS.PICK_PUMP);
  const result = await actor.create_token({
    ...tokenInfo,
    name: tokenInfo.name,
    symbol: tokenInfo.symbol,
    description: tokenInfo.description,
    logo: tokenInfo.logo,
    twitter: wrapOption(tokenInfo.twitter),
    website: wrapOption(tokenInfo.website),
    telegram: wrapOption(tokenInfo.telegram)
  });
  return unwrapRustResultMap(
    result,
    (ok) => ({
      ...ok,
      id: ok.id.toString(),
      created_at: ok.created_at.toString(),
      available_token: ok.available_token.toString(),
      volume_24h: ok.volume_24h.toString(),
      last_tx_time: ok.last_tx_time.toString(),
      market_cap_icp: ok.market_cap_icp.toString(),
      twitter: unwrapOption(ok.twitter),
      website: unwrapOption(ok.website),
      telegram: unwrapOption(ok.telegram)
    }),
    (err) => {
      throw new Error(`Token creation failed: ${err}`);
    }
  );
}
async function generateTokenLogo(description, runtime) {
  const logoPrompt = `Create a fun and memorable logo for a cryptocurrency token with these characteristics: ${description}. The logo should be simple, iconic, and suitable for a meme token. Style: minimal, bold colors, crypto-themed.`;
  const result = await generateImage(
    {
      prompt: logoPrompt,
      width: 512,
      height: 512,
      count: 1
    },
    runtime
  );
  if (result.success && result.data && result.data.length > 0) {
    return result.data[0];
  }
  return null;
}
var executeCreateToken = {
  name: "CREATE_TOKEN",
  similes: [
    "CREATE_PICKPUMP_TOKEN",
    "MINT_PICKPUMP",
    "PICKPUMP_TOKEN",
    "PP_TOKEN",
    "PICKPUMP\u53D1\u5E01",
    "PP\u53D1\u5E01",
    "\u5728PICKPUMP\u4E0A\u53D1\u5E01",
    "PICKPUMP\u4EE3\u5E01"
  ],
  description: "Create a new meme token on PickPump platform (Internet Computer). This action helps users create and launch tokens specifically on the PickPump platform.",
  validate: async (_runtime, message) => {
    const keywords = [
      "pickpump",
      "pp",
      "\u76AE\u514B\u5E2E",
      "token",
      "coin",
      "\u4EE3\u5E01",
      "\u5E01",
      "create",
      "mint",
      "launch",
      "deploy",
      "\u521B\u5EFA",
      "\u53D1\u884C",
      "\u94F8\u9020"
    ];
    const messageText = (typeof message.content === "string" ? message.content : message.content.text || "").toLowerCase();
    return keywords.some(
      (keyword) => messageText.includes(keyword.toLowerCase())
    );
  },
  handler: async (runtime, message, state, _options, callback) => {
    var _a;
    callback == null ? void 0 : callback({
      text: "\u{1F504} Creating meme token...",
      action: "CREATE_TOKEN",
      type: "processing"
    });
    let currentState = state;
    if (!currentState) {
      currentState = await runtime.composeState(message);
    } else {
      currentState = await runtime.updateRecentMessageState(currentState);
    }
    const createTokenContext = composeContext2({
      state: currentState,
      template: createTokenTemplate
    });
    const response = await generateObjectDeprecated2({
      runtime,
      context: createTokenContext,
      modelClass: ModelClass2.LARGE
    });
    const logoPromptContext = composeContext2({
      state,
      template: logoPromptTemplate.replace(
        "{{description}}",
        response.description
      )
    });
    const logoPrompt = await generateText({
      runtime,
      context: logoPromptContext,
      modelClass: ModelClass2.LARGE
    });
    const logo = await generateTokenLogo(logoPrompt, runtime);
    if (!logo) {
      throw new Error("Failed to generate token logo");
    }
    const logoUploadResult = await uploadFileToWeb3Storage(logo);
    if (!((_a = logoUploadResult.urls) == null ? void 0 : _a.gateway)) {
      throw new Error("Failed to upload logo to Web3Storage");
    }
    try {
      const { wallet } = await icpWalletProvider.get(
        runtime,
        message,
        state
      );
      const creator = wallet.createActor;
      const createTokenResult = await createTokenTransaction(creator, {
        name: response.name,
        symbol: response.symbol,
        description: response.description,
        logo: logoUploadResult.urls.gateway
      });
      const responseMsg = {
        text: `\u2728 Created new meme token:
\u{1FA99} ${response.name} (${response.symbol})
\u{1F4DD} ${response.description}`,
        data: createTokenResult,
        action: "CREATE_TOKEN",
        type: "success"
      };
      callback == null ? void 0 : callback(responseMsg);
    } catch (error) {
      const responseMsg = {
        text: `Failed to create token: ${error instanceof Error ? error.message : "Unknown error"}`,
        action: "CREATE_TOKEN",
        type: "error"
      };
      callback == null ? void 0 : callback(responseMsg);
    }
  },
  examples: [
    [
      {
        user: "{{user1}}",
        content: "I want to create a space cat token on PickPump"
      },
      {
        user: "{{user2}}",
        content: {
          text: "Creating space cat token on PickPump...",
          action: "CREATE_TOKEN"
        }
      },
      {
        user: "{{user2}}",
        content: {
          text: "\u2728 Token created successfully!"
        }
      }
    ],
    [
      {
        user: "{{user1}}",
        content: "Help me create a pizza-themed funny token on PP"
      },
      {
        user: "{{user2}}",
        content: {
          text: "Creating pizza token on PickPump...",
          action: "CREATE_TOKEN"
        }
      }
    ]
  ]
};

// src/actions/swapAction.ts
import {
  ModelClass as ModelClass3,
  composeContext as composeContext3,
  generateObjectDeprecated as generateObjectDeprecated3
} from "@elizaos/core";

// src/canisters/kongswap/index.did.ts
var idlFactory3 = ({ IDL }) => {
  const TxId = IDL.Variant({
    "TransactionId": IDL.Text,
    "BlockIndex": IDL.Nat
  });
  const AddLiquidityArgs = IDL.Record({
    "token_0": IDL.Text,
    "token_1": IDL.Text,
    "amount_0": IDL.Nat,
    "amount_1": IDL.Nat,
    "tx_id_0": IDL.Opt(TxId),
    "tx_id_1": IDL.Opt(TxId)
  });
  const ICTransferReply = IDL.Record({
    "is_send": IDL.Bool,
    "block_index": IDL.Nat,
    "chain": IDL.Text,
    "canister_id": IDL.Text,
    "amount": IDL.Nat,
    "symbol": IDL.Text
  });
  const TransferReply = IDL.Variant({ "IC": ICTransferReply });
  const TransferIdReply = IDL.Record({
    "transfer_id": IDL.Nat64,
    "transfer": TransferReply
  });
  const AddLiquidityReply = IDL.Record({
    "ts": IDL.Nat64,
    "request_id": IDL.Nat64,
    "status": IDL.Text,
    "tx_id": IDL.Nat64,
    "add_lp_token_amount": IDL.Nat,
    "transfer_ids": IDL.Vec(TransferIdReply),
    "amount_0": IDL.Nat,
    "amount_1": IDL.Nat,
    "claim_ids": IDL.Vec(IDL.Nat64),
    "address_0": IDL.Text,
    "address_1": IDL.Text,
    "symbol_0": IDL.Text,
    "symbol_1": IDL.Text,
    "chain_0": IDL.Text,
    "chain_1": IDL.Text,
    "symbol": IDL.Text
  });
  const AddLiquidityResult = IDL.Variant({
    "Ok": AddLiquidityReply,
    "Err": IDL.Text
  });
  const AddLiquidityAmountsReply = IDL.Record({
    "add_lp_token_amount": IDL.Nat,
    "amount_0": IDL.Nat,
    "amount_1": IDL.Nat,
    "address_0": IDL.Text,
    "address_1": IDL.Text,
    "symbol_0": IDL.Text,
    "symbol_1": IDL.Text,
    "chain_0": IDL.Text,
    "chain_1": IDL.Text,
    "symbol": IDL.Text,
    "fee_0": IDL.Nat,
    "fee_1": IDL.Nat
  });
  const AddLiquiditAmountsResult = IDL.Variant({
    "Ok": AddLiquidityAmountsReply,
    "Err": IDL.Text
  });
  const AddLiquidityAsyncResult = IDL.Variant({
    "Ok": IDL.Nat64,
    "Err": IDL.Text
  });
  const AddPoolArgs = IDL.Record({
    "token_0": IDL.Text,
    "token_1": IDL.Text,
    "amount_0": IDL.Nat,
    "amount_1": IDL.Nat,
    "tx_id_0": IDL.Opt(TxId),
    "tx_id_1": IDL.Opt(TxId),
    "lp_fee_bps": IDL.Opt(IDL.Nat8)
  });
  const AddPoolReply = IDL.Record({
    "ts": IDL.Nat64,
    "request_id": IDL.Nat64,
    "status": IDL.Text,
    "tx_id": IDL.Nat64,
    "lp_token_symbol": IDL.Text,
    "add_lp_token_amount": IDL.Nat,
    "transfer_ids": IDL.Vec(TransferIdReply),
    "name": IDL.Text,
    "amount_0": IDL.Nat,
    "amount_1": IDL.Nat,
    "claim_ids": IDL.Vec(IDL.Nat64),
    "address_0": IDL.Text,
    "address_1": IDL.Text,
    "symbol_0": IDL.Text,
    "symbol_1": IDL.Text,
    "pool_id": IDL.Nat32,
    "chain_0": IDL.Text,
    "chain_1": IDL.Text,
    "is_removed": IDL.Bool,
    "symbol": IDL.Text,
    "lp_fee_bps": IDL.Nat8
  });
  const AddPoolResult = IDL.Variant({ "Ok": AddPoolReply, "Err": IDL.Text });
  const AddTokenArgs = IDL.Record({ "token": IDL.Text });
  const ICTokenReply = IDL.Record({
    "fee": IDL.Nat,
    "decimals": IDL.Nat8,
    "token_id": IDL.Nat32,
    "chain": IDL.Text,
    "name": IDL.Text,
    "canister_id": IDL.Text,
    "icrc1": IDL.Bool,
    "icrc2": IDL.Bool,
    "icrc3": IDL.Bool,
    "is_removed": IDL.Bool,
    "symbol": IDL.Text
  });
  const AddTokenReply = IDL.Variant({ "IC": ICTokenReply });
  const AddTokenResult = IDL.Variant({
    "Ok": AddTokenReply,
    "Err": IDL.Text
  });
  const PoolExpectedBalance = IDL.Record({
    "balance": IDL.Nat,
    "kong_fee": IDL.Nat,
    "pool_symbol": IDL.Text,
    "lp_fee": IDL.Nat
  });
  const ExpectedBalance = IDL.Record({
    "balance": IDL.Nat,
    "pool_balances": IDL.Vec(PoolExpectedBalance),
    "unclaimed_claims": IDL.Nat
  });
  const CheckPoolsReply = IDL.Record({
    "expected_balance": ExpectedBalance,
    "diff_balance": IDL.Int,
    "actual_balance": IDL.Nat,
    "symbol": IDL.Text
  });
  const CheckPoolsResult = IDL.Variant({
    "Ok": IDL.Vec(CheckPoolsReply),
    "Err": IDL.Text
  });
  const ClaimReply = IDL.Record({
    "ts": IDL.Nat64,
    "fee": IDL.Nat,
    "status": IDL.Text,
    "claim_id": IDL.Nat64,
    "transfer_ids": IDL.Vec(TransferIdReply),
    "desc": IDL.Text,
    "chain": IDL.Text,
    "canister_id": IDL.Opt(IDL.Text),
    "to_address": IDL.Text,
    "amount": IDL.Nat,
    "symbol": IDL.Text
  });
  const ClaimResult = IDL.Variant({ "Ok": ClaimReply, "Err": IDL.Text });
  const ClaimsReply = IDL.Record({
    "ts": IDL.Nat64,
    "fee": IDL.Nat,
    "status": IDL.Text,
    "claim_id": IDL.Nat64,
    "desc": IDL.Text,
    "chain": IDL.Text,
    "canister_id": IDL.Opt(IDL.Text),
    "to_address": IDL.Text,
    "amount": IDL.Nat,
    "symbol": IDL.Text
  });
  const ClaimsResult = IDL.Variant({
    "Ok": IDL.Vec(ClaimsReply),
    "Err": IDL.Text
  });
  const UserReply = IDL.Record({
    "account_id": IDL.Text,
    "fee_level_expires_at": IDL.Opt(IDL.Nat64),
    "referred_by": IDL.Opt(IDL.Text),
    "user_id": IDL.Nat32,
    "fee_level": IDL.Nat8,
    "principal_id": IDL.Text,
    "referred_by_expires_at": IDL.Opt(IDL.Nat64),
    "my_referral_code": IDL.Text
  });
  const UserResult = IDL.Variant({ "Ok": UserReply, "Err": IDL.Text });
  const Icrc10SupportedStandards = IDL.Record({
    "url": IDL.Text,
    "name": IDL.Text
  });
  const icrc21_consent_message_metadata = IDL.Record({
    "utc_offset_minutes": IDL.Opt(IDL.Int16),
    "language": IDL.Text
  });
  const icrc21_consent_message_spec = IDL.Record({
    "metadata": icrc21_consent_message_metadata,
    "device_spec": IDL.Opt(
      IDL.Variant({
        "GenericDisplay": IDL.Null,
        "LineDisplay": IDL.Record({
          "characters_per_line": IDL.Nat16,
          "lines_per_page": IDL.Nat16
        })
      })
    )
  });
  const icrc21_consent_message_request = IDL.Record({
    "arg": IDL.Vec(IDL.Nat8),
    "method": IDL.Text,
    "user_preferences": icrc21_consent_message_spec
  });
  const icrc21_consent_message = IDL.Variant({
    "LineDisplayMessage": IDL.Record({
      "pages": IDL.Vec(IDL.Record({ "lines": IDL.Vec(IDL.Text) }))
    }),
    "GenericDisplayMessage": IDL.Text
  });
  const icrc21_consent_info = IDL.Record({
    "metadata": icrc21_consent_message_metadata,
    "consent_message": icrc21_consent_message
  });
  const icrc21_error_info = IDL.Record({ "description": IDL.Text });
  const icrc21_error = IDL.Variant({
    "GenericError": IDL.Record({
      "description": IDL.Text,
      "error_code": IDL.Nat
    }),
    "InsufficientPayment": icrc21_error_info,
    "UnsupportedCanisterCall": icrc21_error_info,
    "ConsentMessageUnavailable": icrc21_error_info
  });
  const icrc21_consent_message_response = IDL.Variant({
    "Ok": icrc21_consent_info,
    "Err": icrc21_error
  });
  const Icrc28TrustedOriginsResponse = IDL.Record({
    "trusted_origins": IDL.Vec(IDL.Text)
  });
  const PoolReply = IDL.Record({
    "lp_token_symbol": IDL.Text,
    "name": IDL.Text,
    "lp_fee_0": IDL.Nat,
    "lp_fee_1": IDL.Nat,
    "balance_0": IDL.Nat,
    "balance_1": IDL.Nat,
    "address_0": IDL.Text,
    "address_1": IDL.Text,
    "symbol_0": IDL.Text,
    "symbol_1": IDL.Text,
    "pool_id": IDL.Nat32,
    "price": IDL.Float64,
    "chain_0": IDL.Text,
    "chain_1": IDL.Text,
    "is_removed": IDL.Bool,
    "symbol": IDL.Text,
    "lp_fee_bps": IDL.Nat8
  });
  const PoolsResult = IDL.Variant({
    "Ok": IDL.Vec(PoolReply),
    "Err": IDL.Text
  });
  const RemoveLiquidityArgs = IDL.Record({
    "token_0": IDL.Text,
    "token_1": IDL.Text,
    "remove_lp_token_amount": IDL.Nat
  });
  const RemoveLiquidityReply = IDL.Record({
    "ts": IDL.Nat64,
    "request_id": IDL.Nat64,
    "status": IDL.Text,
    "tx_id": IDL.Nat64,
    "transfer_ids": IDL.Vec(TransferIdReply),
    "lp_fee_0": IDL.Nat,
    "lp_fee_1": IDL.Nat,
    "amount_0": IDL.Nat,
    "amount_1": IDL.Nat,
    "claim_ids": IDL.Vec(IDL.Nat64),
    "address_0": IDL.Text,
    "address_1": IDL.Text,
    "symbol_0": IDL.Text,
    "symbol_1": IDL.Text,
    "chain_0": IDL.Text,
    "chain_1": IDL.Text,
    "remove_lp_token_amount": IDL.Nat,
    "symbol": IDL.Text
  });
  const RemoveLiquidityResult = IDL.Variant({
    "Ok": RemoveLiquidityReply,
    "Err": IDL.Text
  });
  const RemoveLiquidityAmountsReply = IDL.Record({
    "lp_fee_0": IDL.Nat,
    "lp_fee_1": IDL.Nat,
    "amount_0": IDL.Nat,
    "amount_1": IDL.Nat,
    "address_0": IDL.Text,
    "address_1": IDL.Text,
    "symbol_0": IDL.Text,
    "symbol_1": IDL.Text,
    "chain_0": IDL.Text,
    "chain_1": IDL.Text,
    "remove_lp_token_amount": IDL.Nat,
    "symbol": IDL.Text
  });
  const RemoveLiquidityAmountsResult = IDL.Variant({
    "Ok": RemoveLiquidityAmountsReply,
    "Err": IDL.Text
  });
  const RemoveLiquidityAsyncResult = IDL.Variant({
    "Ok": IDL.Nat64,
    "Err": IDL.Text
  });
  const SwapArgs = IDL.Record({
    "receive_token": IDL.Text,
    "max_slippage": IDL.Opt(IDL.Float64),
    "pay_amount": IDL.Nat,
    "referred_by": IDL.Opt(IDL.Text),
    "receive_amount": IDL.Opt(IDL.Nat),
    "receive_address": IDL.Opt(IDL.Text),
    "pay_token": IDL.Text,
    "pay_tx_id": IDL.Opt(TxId)
  });
  const RequestRequest = IDL.Variant({
    "AddLiquidity": AddLiquidityArgs,
    "Swap": SwapArgs,
    "AddPool": AddPoolArgs,
    "RemoveLiquidity": RemoveLiquidityArgs
  });
  const SwapTxReply = IDL.Record({
    "ts": IDL.Nat64,
    "receive_chain": IDL.Text,
    "pay_amount": IDL.Nat,
    "receive_amount": IDL.Nat,
    "pay_symbol": IDL.Text,
    "receive_symbol": IDL.Text,
    "receive_address": IDL.Text,
    "pool_symbol": IDL.Text,
    "pay_address": IDL.Text,
    "price": IDL.Float64,
    "pay_chain": IDL.Text,
    "lp_fee": IDL.Nat,
    "gas_fee": IDL.Nat
  });
  const SwapReply = IDL.Record({
    "ts": IDL.Nat64,
    "txs": IDL.Vec(SwapTxReply),
    "request_id": IDL.Nat64,
    "status": IDL.Text,
    "tx_id": IDL.Nat64,
    "transfer_ids": IDL.Vec(TransferIdReply),
    "receive_chain": IDL.Text,
    "mid_price": IDL.Float64,
    "pay_amount": IDL.Nat,
    "receive_amount": IDL.Nat,
    "claim_ids": IDL.Vec(IDL.Nat64),
    "pay_symbol": IDL.Text,
    "receive_symbol": IDL.Text,
    "receive_address": IDL.Text,
    "pay_address": IDL.Text,
    "price": IDL.Float64,
    "pay_chain": IDL.Text,
    "slippage": IDL.Float64
  });
  const RequestReply = IDL.Variant({
    "AddLiquidity": AddLiquidityReply,
    "Swap": SwapReply,
    "AddPool": AddPoolReply,
    "RemoveLiquidity": RemoveLiquidityReply,
    "Pending": IDL.Null
  });
  const RequestsReply = IDL.Record({
    "ts": IDL.Nat64,
    "request_id": IDL.Nat64,
    "request": RequestRequest,
    "statuses": IDL.Vec(IDL.Text),
    "reply": RequestReply
  });
  const RequestsResult = IDL.Variant({
    "Ok": IDL.Vec(RequestsReply),
    "Err": IDL.Text
  });
  const SendArgs = IDL.Record({
    "token": IDL.Text,
    "to_address": IDL.Text,
    "amount": IDL.Nat
  });
  const SendReply = IDL.Record({
    "ts": IDL.Nat64,
    "request_id": IDL.Nat64,
    "status": IDL.Text,
    "tx_id": IDL.Nat64,
    "chain": IDL.Text,
    "to_address": IDL.Text,
    "amount": IDL.Nat,
    "symbol": IDL.Text
  });
  const SendResult = IDL.Variant({ "OK": SendReply, "Err": IDL.Text });
  const SwapResult = IDL.Variant({ "Ok": SwapReply, "Err": IDL.Text });
  const SwapAmountsTxReply = IDL.Record({
    "receive_chain": IDL.Text,
    "pay_amount": IDL.Nat,
    "receive_amount": IDL.Nat,
    "pay_symbol": IDL.Text,
    "receive_symbol": IDL.Text,
    "receive_address": IDL.Text,
    "pool_symbol": IDL.Text,
    "pay_address": IDL.Text,
    "price": IDL.Float64,
    "pay_chain": IDL.Text,
    "lp_fee": IDL.Nat,
    "gas_fee": IDL.Nat
  });
  const SwapAmountsReply = IDL.Record({
    "txs": IDL.Vec(SwapAmountsTxReply),
    "receive_chain": IDL.Text,
    "mid_price": IDL.Float64,
    "pay_amount": IDL.Nat,
    "receive_amount": IDL.Nat,
    "pay_symbol": IDL.Text,
    "receive_symbol": IDL.Text,
    "receive_address": IDL.Text,
    "pay_address": IDL.Text,
    "price": IDL.Float64,
    "pay_chain": IDL.Text,
    "slippage": IDL.Float64
  });
  const SwapAmountsResult = IDL.Variant({
    "Ok": SwapAmountsReply,
    "Err": IDL.Text
  });
  const SwapAsyncResult = IDL.Variant({ "Ok": IDL.Nat64, "Err": IDL.Text });
  const LPTokenReply = IDL.Record({
    "fee": IDL.Nat,
    "decimals": IDL.Nat8,
    "token_id": IDL.Nat32,
    "chain": IDL.Text,
    "name": IDL.Text,
    "address": IDL.Text,
    "pool_id_of": IDL.Nat32,
    "is_removed": IDL.Bool,
    "total_supply": IDL.Nat,
    "symbol": IDL.Text
  });
  const TokenReply = IDL.Variant({ "IC": ICTokenReply, "LP": LPTokenReply });
  const TokensResult = IDL.Variant({
    "Ok": IDL.Vec(TokenReply),
    "Err": IDL.Text
  });
  const UpdateTokenArgs = IDL.Record({ "token": IDL.Text });
  const UpdateTokenReply = IDL.Variant({ "IC": ICTokenReply });
  const UpdateTokenResult = IDL.Variant({
    "Ok": UpdateTokenReply,
    "Err": IDL.Text
  });
  const LPBalancesReply = IDL.Record({
    "ts": IDL.Nat64,
    "usd_balance": IDL.Float64,
    "balance": IDL.Float64,
    "name": IDL.Text,
    "amount_0": IDL.Float64,
    "amount_1": IDL.Float64,
    "address_0": IDL.Text,
    "address_1": IDL.Text,
    "symbol_0": IDL.Text,
    "symbol_1": IDL.Text,
    "usd_amount_0": IDL.Float64,
    "usd_amount_1": IDL.Float64,
    "chain_0": IDL.Text,
    "chain_1": IDL.Text,
    "symbol": IDL.Text,
    "lp_token_id": IDL.Nat64
  });
  const UserBalancesReply = IDL.Variant({ "LP": LPBalancesReply });
  const UserBalancesResult = IDL.Variant({
    "Ok": IDL.Vec(UserBalancesReply),
    "Err": IDL.Text
  });
  const ValidateAddLiquidityResult = IDL.Variant({
    "Ok": IDL.Text,
    "Err": IDL.Text
  });
  const ValidateRemoveLiquidityResult = IDL.Variant({
    "Ok": IDL.Text,
    "Err": IDL.Text
  });
  return IDL.Service({
    "add_liquidity": IDL.Func([AddLiquidityArgs], [AddLiquidityResult], []),
    "add_liquidity_amounts": IDL.Func(
      [IDL.Text, IDL.Nat, IDL.Text],
      [AddLiquiditAmountsResult],
      ["query"]
    ),
    "add_liquidity_async": IDL.Func(
      [AddLiquidityArgs],
      [AddLiquidityAsyncResult],
      []
    ),
    "add_pool": IDL.Func([AddPoolArgs], [AddPoolResult], []),
    "add_token": IDL.Func([AddTokenArgs], [AddTokenResult], []),
    "check_pools": IDL.Func([], [CheckPoolsResult], []),
    "claim": IDL.Func([IDL.Nat64], [ClaimResult], []),
    "claims": IDL.Func([IDL.Text], [ClaimsResult], ["query"]),
    "get_user": IDL.Func([], [UserResult], ["query"]),
    "icrc10_supported_standards": IDL.Func(
      [],
      [IDL.Vec(Icrc10SupportedStandards)],
      ["query"]
    ),
    "icrc1_name": IDL.Func([], [IDL.Text], ["query"]),
    "icrc21_canister_call_consent_message": IDL.Func(
      [icrc21_consent_message_request],
      [icrc21_consent_message_response],
      []
    ),
    "icrc28_trusted_origins": IDL.Func([], [Icrc28TrustedOriginsResponse], []),
    "pools": IDL.Func([IDL.Opt(IDL.Text)], [PoolsResult], ["query"]),
    "remove_liquidity": IDL.Func(
      [RemoveLiquidityArgs],
      [RemoveLiquidityResult],
      []
    ),
    "remove_liquidity_amounts": IDL.Func(
      [IDL.Text, IDL.Text, IDL.Nat],
      [RemoveLiquidityAmountsResult],
      ["query"]
    ),
    "remove_liquidity_async": IDL.Func(
      [RemoveLiquidityArgs],
      [RemoveLiquidityAsyncResult],
      []
    ),
    "requests": IDL.Func([IDL.Opt(IDL.Nat64)], [RequestsResult], ["query"]),
    "send": IDL.Func([SendArgs], [SendResult], []),
    "swap": IDL.Func([SwapArgs], [SwapResult], []),
    "swap_amounts": IDL.Func(
      [IDL.Text, IDL.Nat, IDL.Text],
      [SwapAmountsResult],
      ["query"]
    ),
    "swap_async": IDL.Func([SwapArgs], [SwapAsyncResult], []),
    "tokens": IDL.Func([IDL.Opt(IDL.Text)], [TokensResult], ["query"]),
    "update_token": IDL.Func([UpdateTokenArgs], [UpdateTokenResult], []),
    "user_balances": IDL.Func([IDL.Text], [UserBalancesResult], ["query"]),
    "validate_add_liquidity": IDL.Func([], [ValidateAddLiquidityResult], []),
    "validate_remove_liquidity": IDL.Func(
      [],
      [ValidateRemoveLiquidityResult],
      []
    )
  });
};

// src/actions/swapAction.ts
import { Principal as Principal4 } from "@dfinity/principal";

// src/canisters/icpswap/swapFactory.did.ts
var idlFactory4 = ({ IDL }) => {
  const Passcode = IDL.Record({
    "fee": IDL.Nat,
    "token0": IDL.Principal,
    "token1": IDL.Principal
  });
  const Error2 = IDL.Variant({
    "CommonError": IDL.Null,
    "InternalError": IDL.Text,
    "UnsupportedToken": IDL.Text,
    "InsufficientFunds": IDL.Null
  });
  const Result_1 = IDL.Variant({ "ok": IDL.Null, "err": Error2 });
  const PoolInstaller = IDL.Record({
    "weight": IDL.Nat,
    "subnet": IDL.Text,
    "subnetType": IDL.Text,
    "canisterId": IDL.Principal
  });
  const Token = IDL.Record({ "address": IDL.Text, "standard": IDL.Text });
  const CreatePoolArgs = IDL.Record({
    "fee": IDL.Nat,
    "sqrtPriceX96": IDL.Text,
    "token0": Token,
    "token1": Token,
    "subnet": IDL.Opt(IDL.Text)
  });
  const PoolData = IDL.Record({
    "fee": IDL.Nat,
    "key": IDL.Text,
    "tickSpacing": IDL.Int,
    "token0": Token,
    "token1": Token,
    "canisterId": IDL.Principal
  });
  const Result_8 = IDL.Variant({ "ok": PoolData, "err": Error2 });
  const PoolUpgradeTaskStep = IDL.Record({
    "isDone": IDL.Bool,
    "timestamp": IDL.Nat
  });
  const PoolUpgradeTask = IDL.Record({
    "turnOnAvailable": PoolUpgradeTaskStep,
    "backup": IDL.Record({
      "isDone": IDL.Bool,
      "isSent": IDL.Bool,
      "retryCount": IDL.Nat,
      "timestamp": IDL.Nat
    }),
    "stop": PoolUpgradeTaskStep,
    "moduleHashBefore": IDL.Opt(IDL.Vec(IDL.Nat8)),
    "moduleHashAfter": IDL.Opt(IDL.Vec(IDL.Nat8)),
    "turnOffAvailable": PoolUpgradeTaskStep,
    "upgrade": PoolUpgradeTaskStep,
    "start": PoolUpgradeTaskStep,
    "poolData": PoolData
  });
  const Result_13 = IDL.Variant({
    "ok": IDL.Opt(PoolUpgradeTask),
    "err": Error2
  });
  const CycleInfo = IDL.Record({ "balance": IDL.Nat, "available": IDL.Nat });
  const Result_12 = IDL.Variant({ "ok": CycleInfo, "err": Error2 });
  const Result_11 = IDL.Variant({
    "ok": IDL.Opt(IDL.Principal),
    "err": Error2
  });
  const Result_10 = IDL.Variant({
    "ok": IDL.Record({
      "infoCid": IDL.Principal,
      "trustedCanisterManagerCid": IDL.Principal,
      "governanceCid": IDL.Opt(IDL.Principal),
      "passcodeManagerCid": IDL.Principal,
      "backupCid": IDL.Principal,
      "feeReceiverCid": IDL.Principal
    }),
    "err": Error2
  });
  const Result_9 = IDL.Variant({ "ok": IDL.Vec(Passcode), "err": Error2 });
  const Result_7 = IDL.Variant({
    "ok": IDL.Vec(PoolUpgradeTask),
    "err": Error2
  });
  const GetPoolArgs = IDL.Record({
    "fee": IDL.Nat,
    "token0": Token,
    "token1": Token
  });
  const Result_6 = IDL.Variant({
    "ok": IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Vec(PoolUpgradeTask))),
    "err": Error2
  });
  const Result_4 = IDL.Variant({ "ok": IDL.Vec(PoolData), "err": Error2 });
  const Result_5 = IDL.Variant({
    "ok": IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Vec(Passcode))),
    "err": Error2
  });
  const FailedPoolInfo = IDL.Record({
    "task": PoolUpgradeTask,
    "timestamp": IDL.Nat,
    "errorMsg": IDL.Text
  });
  const Result_3 = IDL.Variant({
    "ok": IDL.Vec(FailedPoolInfo),
    "err": Error2
  });
  const Icrc21ConsentMessageMetadata = IDL.Record({
    "utc_offset_minutes": IDL.Opt(IDL.Int16),
    "language": IDL.Text
  });
  const Icrc21ConsentMessageSpec = IDL.Record({
    "metadata": Icrc21ConsentMessageMetadata,
    "device_spec": IDL.Opt(
      IDL.Variant({
        "GenericDisplay": IDL.Null,
        "LineDisplay": IDL.Record({
          "characters_per_line": IDL.Nat16,
          "lines_per_page": IDL.Nat16
        })
      })
    )
  });
  const Icrc21ConsentMessageRequest = IDL.Record({
    "arg": IDL.Vec(IDL.Nat8),
    "method": IDL.Text,
    "user_preferences": Icrc21ConsentMessageSpec
  });
  const Icrc21ConsentMessage = IDL.Variant({
    "LineDisplayMessage": IDL.Record({
      "pages": IDL.Vec(IDL.Record({ "lines": IDL.Vec(IDL.Text) }))
    }),
    "GenericDisplayMessage": IDL.Text
  });
  const Icrc21ConsentInfo = IDL.Record({
    "metadata": Icrc21ConsentMessageMetadata,
    "consent_message": Icrc21ConsentMessage
  });
  const Icrc21ErrorInfo = IDL.Record({ "description": IDL.Text });
  const Icrc21Error = IDL.Variant({
    "GenericError": IDL.Record({
      "description": IDL.Text,
      "error_code": IDL.Nat
    }),
    "InsufficientPayment": Icrc21ErrorInfo,
    "UnsupportedCanisterCall": Icrc21ErrorInfo,
    "ConsentMessageUnavailable": Icrc21ErrorInfo
  });
  const Icrc21ConsentMessageResponse = IDL.Variant({
    "Ok": Icrc21ConsentInfo,
    "Err": Icrc21Error
  });
  const Icrc28TrustedOriginsResponse = IDL.Record({
    "trusted_origins": IDL.Vec(IDL.Text)
  });
  const Result_2 = IDL.Variant({ "ok": IDL.Bool, "err": Error2 });
  const UpgradePoolArgs = IDL.Record({ "poolIds": IDL.Vec(IDL.Principal) });
  const Result2 = IDL.Variant({ "ok": IDL.Text, "err": Error2 });
  return IDL.Service({
    "addPasscode": IDL.Func([IDL.Principal, Passcode], [Result_1], []),
    "addPoolControllers": IDL.Func(
      [IDL.Principal, IDL.Vec(IDL.Principal)],
      [],
      []
    ),
    "addPoolInstallers": IDL.Func([IDL.Vec(PoolInstaller)], [], []),
    "addPoolInstallersValidate": IDL.Func(
      [IDL.Vec(PoolInstaller)],
      [IDL.Variant({ "Ok": IDL.Text, "Err": IDL.Text })],
      []
    ),
    "batchAddPoolControllers": IDL.Func(
      [IDL.Vec(IDL.Principal), IDL.Vec(IDL.Principal)],
      [],
      []
    ),
    "batchClearRemovedPool": IDL.Func([IDL.Vec(IDL.Principal)], [], []),
    "batchRemovePoolControllers": IDL.Func(
      [IDL.Vec(IDL.Principal), IDL.Vec(IDL.Principal)],
      [],
      []
    ),
    "batchRemovePools": IDL.Func([IDL.Vec(IDL.Principal)], [Result_1], []),
    "batchSetPoolAdmins": IDL.Func(
      [IDL.Vec(IDL.Principal), IDL.Vec(IDL.Principal)],
      [],
      []
    ),
    "batchSetPoolAvailable": IDL.Func(
      [IDL.Vec(IDL.Principal), IDL.Bool],
      [],
      []
    ),
    "batchSetPoolIcrc28TrustedOrigins": IDL.Func(
      [IDL.Vec(IDL.Principal), IDL.Vec(IDL.Text)],
      [Result_1],
      []
    ),
    "batchSetPoolLimitOrderAvailable": IDL.Func(
      [IDL.Vec(IDL.Principal), IDL.Bool],
      [],
      []
    ),
    "clearPoolUpgradeTaskHis": IDL.Func([], [], []),
    "clearRemovedPool": IDL.Func([IDL.Principal], [IDL.Text], []),
    "clearUpgradeFailedPoolList": IDL.Func([], [], []),
    "createPool": IDL.Func([CreatePoolArgs], [Result_8], []),
    "deletePasscode": IDL.Func([IDL.Principal, Passcode], [Result_1], []),
    "getAdmins": IDL.Func([], [IDL.Vec(IDL.Principal)], ["query"]),
    "getCurrentUpgradeTask": IDL.Func([], [Result_13], ["query"]),
    "getCycleInfo": IDL.Func([], [Result_12], []),
    "getGovernanceCid": IDL.Func([], [Result_11], ["query"]),
    "getInitArgs": IDL.Func([], [Result_10], ["query"]),
    "getInstallerModuleHash": IDL.Func(
      [],
      [IDL.Opt(IDL.Vec(IDL.Nat8))],
      ["query"]
    ),
    "getNextPoolVersion": IDL.Func([], [IDL.Text], ["query"]),
    "getPasscodesByPrincipal": IDL.Func(
      [IDL.Principal],
      [Result_9],
      ["query"]
    ),
    "getPendingUpgradePoolList": IDL.Func([], [Result_7], ["query"]),
    "getPool": IDL.Func([GetPoolArgs], [Result_8], ["query"]),
    "getPoolInstallers": IDL.Func([], [IDL.Vec(PoolInstaller)], ["query"]),
    "getPoolUpgradeTaskHis": IDL.Func([IDL.Principal], [Result_7], ["query"]),
    "getPoolUpgradeTaskHisList": IDL.Func([], [Result_6], ["query"]),
    "getPools": IDL.Func([], [Result_4], ["query"]),
    "getPrincipalPasscodes": IDL.Func([], [Result_5], ["query"]),
    "getRemovedPools": IDL.Func([], [Result_4], ["query"]),
    "getUpgradeFailedPoolList": IDL.Func([], [Result_3], ["query"]),
    "getVersion": IDL.Func([], [IDL.Text], ["query"]),
    "icrc10_supported_standards": IDL.Func(
      [],
      [IDL.Vec(IDL.Record({ "url": IDL.Text, "name": IDL.Text }))],
      ["query"]
    ),
    "icrc21_canister_call_consent_message": IDL.Func(
      [Icrc21ConsentMessageRequest],
      [Icrc21ConsentMessageResponse],
      []
    ),
    "icrc28_trusted_origins": IDL.Func([], [Icrc28TrustedOriginsResponse], []),
    "removePool": IDL.Func([GetPoolArgs], [IDL.Text], []),
    "removePoolControllers": IDL.Func(
      [IDL.Principal, IDL.Vec(IDL.Principal)],
      [],
      []
    ),
    "removePoolInstaller": IDL.Func([IDL.Principal], [], []),
    "removePoolInstallerValidate": IDL.Func(
      [IDL.Principal],
      [IDL.Variant({ "Ok": IDL.Text, "Err": IDL.Text })],
      []
    ),
    "retryAllFailedUpgrades": IDL.Func([], [Result_1], []),
    "setAdmins": IDL.Func([IDL.Vec(IDL.Principal)], [], []),
    "setIcrc28TrustedOrigins": IDL.Func([IDL.Vec(IDL.Text)], [Result_2], []),
    "setInstallerModuleHash": IDL.Func([IDL.Vec(IDL.Nat8)], [], []),
    "setInstallerModuleHashValidate": IDL.Func(
      [IDL.Vec(IDL.Nat8)],
      [IDL.Variant({ "Ok": IDL.Text, "Err": IDL.Text })],
      []
    ),
    "setPoolAdmins": IDL.Func([IDL.Principal, IDL.Vec(IDL.Principal)], [], []),
    "setPoolAvailable": IDL.Func([IDL.Principal, IDL.Bool], [], []),
    "setUpgradePoolList": IDL.Func([UpgradePoolArgs], [Result_1], []),
    "upgradePoolTokenStandard": IDL.Func(
      [IDL.Principal, IDL.Principal],
      [Result2],
      []
    )
  });
};

// src/canisters/icpswap/swapCanister.did.ts
var idlFactory5 = ({ IDL }) => {
  const LimitOrderArgs = IDL.Record({
    "positionId": IDL.Nat,
    "tickLimit": IDL.Int
  });
  const Error2 = IDL.Variant({
    "CommonError": IDL.Null,
    "InternalError": IDL.Text,
    "UnsupportedToken": IDL.Text,
    "InsufficientFunds": IDL.Null
  });
  const Result_2 = IDL.Variant({ "ok": IDL.Bool, "err": Error2 });
  const AccountBalance = IDL.Record({
    "balance0": IDL.Nat,
    "balance1": IDL.Nat
  });
  const Page_5 = IDL.Record({
    "content": IDL.Vec(IDL.Tuple(IDL.Principal, AccountBalance)),
    "offset": IDL.Nat,
    "limit": IDL.Nat,
    "totalElements": IDL.Nat
  });
  const Result_31 = IDL.Variant({ "ok": Page_5, "err": Error2 });
  const Result_30 = IDL.Variant({
    "ok": IDL.Record({
      "tokenIncome": IDL.Vec(
        IDL.Tuple(
          IDL.Nat,
          IDL.Record({ "tokensOwed0": IDL.Nat, "tokensOwed1": IDL.Nat })
        )
      ),
      "totalTokensOwed0": IDL.Nat,
      "totalTokensOwed1": IDL.Nat
    }),
    "err": Error2
  });
  const ClaimArgs = IDL.Record({ "positionId": IDL.Nat });
  const Result_29 = IDL.Variant({
    "ok": IDL.Record({ "amount0": IDL.Nat, "amount1": IDL.Nat }),
    "err": Error2
  });
  const DecreaseLiquidityArgs = IDL.Record({
    "liquidity": IDL.Text,
    "positionId": IDL.Nat
  });
  const DepositArgs = IDL.Record({
    "fee": IDL.Nat,
    "token": IDL.Text,
    "amount": IDL.Nat
  });
  const Result2 = IDL.Variant({ "ok": IDL.Nat, "err": Error2 });
  const DepositAndMintArgs = IDL.Record({
    "tickUpper": IDL.Int,
    "fee0": IDL.Nat,
    "fee1": IDL.Nat,
    "amount0": IDL.Nat,
    "amount1": IDL.Nat,
    "positionOwner": IDL.Principal,
    "amount0Desired": IDL.Text,
    "amount1Desired": IDL.Text,
    "tickLower": IDL.Int
  });
  const CycleInfo = IDL.Record({ "balance": IDL.Nat, "available": IDL.Nat });
  const Result_28 = IDL.Variant({ "ok": CycleInfo, "err": Error2 });
  const Result_27 = IDL.Variant({
    "ok": IDL.Record({
      "feeGrowthGlobal1X128": IDL.Nat,
      "feeGrowthGlobal0X128": IDL.Nat
    }),
    "err": Error2
  });
  const Token = IDL.Record({ "address": IDL.Text, "standard": IDL.Text });
  const Result_26 = IDL.Variant({
    "ok": IDL.Record({
      "infoCid": IDL.Principal,
      "trustedCanisterManagerCid": IDL.Principal,
      "token0": Token,
      "token1": Token,
      "feeReceiverCid": IDL.Principal
    }),
    "err": Error2
  });
  const Time = IDL.Int;
  const JobInfo = IDL.Record({
    "interval": IDL.Nat,
    "name": IDL.Text,
    "lastRun": Time,
    "timerId": IDL.Opt(IDL.Nat)
  });
  const Level = IDL.Variant({ "Inactive": IDL.Null, "Active": IDL.Null });
  const LimitOrderType = IDL.Variant({
    "Lower": IDL.Null,
    "Upper": IDL.Null
  });
  const LimitOrderKey = IDL.Record({
    "timestamp": IDL.Nat,
    "tickLimit": IDL.Int
  });
  const LimitOrderValue = IDL.Record({
    "userPositionId": IDL.Nat,
    "token0InAmount": IDL.Nat,
    "owner": IDL.Principal,
    "token1InAmount": IDL.Nat
  });
  const Result_25 = IDL.Variant({
    "ok": IDL.Vec(IDL.Tuple(LimitOrderType, LimitOrderKey, LimitOrderValue)),
    "err": Error2
  });
  const Result_24 = IDL.Variant({
    "ok": IDL.Record({
      "lowerLimitOrders": IDL.Vec(IDL.Tuple(LimitOrderKey, LimitOrderValue)),
      "upperLimitOrders": IDL.Vec(IDL.Tuple(LimitOrderKey, LimitOrderValue))
    }),
    "err": Error2
  });
  const GetPositionArgs = IDL.Record({
    "tickUpper": IDL.Int,
    "tickLower": IDL.Int
  });
  const PositionInfo = IDL.Record({
    "tokensOwed0": IDL.Nat,
    "tokensOwed1": IDL.Nat,
    "feeGrowthInside1LastX128": IDL.Nat,
    "liquidity": IDL.Nat,
    "feeGrowthInside0LastX128": IDL.Nat
  });
  const Result_23 = IDL.Variant({ "ok": PositionInfo, "err": Error2 });
  const PositionInfoWithId = IDL.Record({
    "id": IDL.Text,
    "tokensOwed0": IDL.Nat,
    "tokensOwed1": IDL.Nat,
    "feeGrowthInside1LastX128": IDL.Nat,
    "liquidity": IDL.Nat,
    "feeGrowthInside0LastX128": IDL.Nat
  });
  const Page_4 = IDL.Record({
    "content": IDL.Vec(PositionInfoWithId),
    "offset": IDL.Nat,
    "limit": IDL.Nat,
    "totalElements": IDL.Nat
  });
  const Result_22 = IDL.Variant({ "ok": Page_4, "err": Error2 });
  const Result_21 = IDL.Variant({
    "ok": IDL.Vec(
      IDL.Record({
        "userPositionId": IDL.Nat,
        "token0InAmount": IDL.Nat,
        "timestamp": IDL.Nat,
        "tickLimit": IDL.Int,
        "token1InAmount": IDL.Nat
      })
    ),
    "err": Error2
  });
  const TransactionType = IDL.Variant({
    "decreaseLiquidity": IDL.Null,
    "limitOrder": IDL.Record({
      "token0InAmount": IDL.Nat,
      "positionId": IDL.Nat,
      "tickLimit": IDL.Int,
      "token1InAmount": IDL.Nat
    }),
    "claim": IDL.Null,
    "swap": IDL.Null,
    "addLiquidity": IDL.Null,
    "transferPosition": IDL.Nat,
    "increaseLiquidity": IDL.Null
  });
  const SwapRecordInfo = IDL.Record({
    "to": IDL.Text,
    "feeAmount": IDL.Int,
    "action": TransactionType,
    "feeAmountTotal": IDL.Int,
    "token0Id": IDL.Text,
    "token1Id": IDL.Text,
    "token0AmountTotal": IDL.Nat,
    "liquidityTotal": IDL.Nat,
    "from": IDL.Text,
    "tick": IDL.Int,
    "feeTire": IDL.Nat,
    "recipient": IDL.Text,
    "token0ChangeAmount": IDL.Nat,
    "token1AmountTotal": IDL.Nat,
    "liquidityChange": IDL.Nat,
    "token1Standard": IDL.Text,
    "TVLToken0": IDL.Int,
    "TVLToken1": IDL.Int,
    "token0Fee": IDL.Nat,
    "token1Fee": IDL.Nat,
    "timestamp": IDL.Int,
    "token1ChangeAmount": IDL.Nat,
    "token0Standard": IDL.Text,
    "price": IDL.Nat,
    "poolId": IDL.Text
  });
  const PushError = IDL.Record({ "time": IDL.Int, "message": IDL.Text });
  const Result_20 = IDL.Variant({
    "ok": IDL.Record({
      "infoCid": IDL.Text,
      "records": IDL.Vec(SwapRecordInfo),
      "errors": IDL.Vec(PushError),
      "retryCount": IDL.Nat
    }),
    "err": Error2
  });
  const Result_19 = IDL.Variant({
    "ok": IDL.Vec(IDL.Tuple(IDL.Int, IDL.Nat)),
    "err": Error2
  });
  const TickLiquidityInfo = IDL.Record({
    "tickIndex": IDL.Int,
    "price0Decimal": IDL.Nat,
    "liquidityNet": IDL.Int,
    "price0": IDL.Nat,
    "price1": IDL.Nat,
    "liquidityGross": IDL.Nat,
    "price1Decimal": IDL.Nat
  });
  const Page_3 = IDL.Record({
    "content": IDL.Vec(TickLiquidityInfo),
    "offset": IDL.Nat,
    "limit": IDL.Nat,
    "totalElements": IDL.Nat
  });
  const Result_18 = IDL.Variant({ "ok": Page_3, "err": Error2 });
  const TickInfoWithId = IDL.Record({
    "id": IDL.Text,
    "initialized": IDL.Bool,
    "feeGrowthOutside1X128": IDL.Nat,
    "secondsPerLiquidityOutsideX128": IDL.Nat,
    "liquidityNet": IDL.Int,
    "secondsOutside": IDL.Nat,
    "liquidityGross": IDL.Nat,
    "feeGrowthOutside0X128": IDL.Nat,
    "tickCumulativeOutside": IDL.Int
  });
  const Page_2 = IDL.Record({
    "content": IDL.Vec(TickInfoWithId),
    "offset": IDL.Nat,
    "limit": IDL.Nat,
    "totalElements": IDL.Nat
  });
  const Result_17 = IDL.Variant({ "ok": Page_2, "err": Error2 });
  const Result_16 = IDL.Variant({
    "ok": IDL.Record({
      "swapFee0Repurchase": IDL.Nat,
      "token0Amount": IDL.Nat,
      "swapFeeReceiver": IDL.Text,
      "token1Amount": IDL.Nat,
      "swapFee1Repurchase": IDL.Nat
    }),
    "err": Error2
  });
  const Value = IDL.Variant({
    "Int": IDL.Int,
    "Nat": IDL.Nat,
    "Blob": IDL.Vec(IDL.Nat8),
    "Text": IDL.Text
  });
  const TransferLog = IDL.Record({
    "to": IDL.Principal,
    "fee": IDL.Nat,
    "result": IDL.Text,
    "token": Token,
    "action": IDL.Text,
    "daysFrom19700101": IDL.Nat,
    "owner": IDL.Principal,
    "from": IDL.Principal,
    "fromSubaccount": IDL.Opt(IDL.Vec(IDL.Nat8)),
    "timestamp": IDL.Nat,
    "index": IDL.Nat,
    "amount": IDL.Nat,
    "errorMsg": IDL.Text,
    "toSubaccount": IDL.Opt(IDL.Vec(IDL.Nat8))
  });
  const Result_15 = IDL.Variant({ "ok": IDL.Vec(TransferLog), "err": Error2 });
  const Result_1 = IDL.Variant({ "ok": IDL.Text, "err": Error2 });
  const Result_14 = IDL.Variant({
    "ok": IDL.Record({
      "upperLimitOrdersIds": IDL.Vec(
        IDL.Record({ "userPositionId": IDL.Nat, "timestamp": IDL.Nat })
      ),
      "lowerLimitOrderIds": IDL.Vec(
        IDL.Record({ "userPositionId": IDL.Nat, "timestamp": IDL.Nat })
      )
    }),
    "err": Error2
  });
  const UserPositionInfo = IDL.Record({
    "tickUpper": IDL.Int,
    "tokensOwed0": IDL.Nat,
    "tokensOwed1": IDL.Nat,
    "feeGrowthInside1LastX128": IDL.Nat,
    "liquidity": IDL.Nat,
    "feeGrowthInside0LastX128": IDL.Nat,
    "tickLower": IDL.Int
  });
  const Result_13 = IDL.Variant({ "ok": UserPositionInfo, "err": Error2 });
  const Result_12 = IDL.Variant({
    "ok": IDL.Vec(IDL.Tuple(IDL.Text, IDL.Vec(IDL.Nat))),
    "err": Error2
  });
  const Result_11 = IDL.Variant({ "ok": IDL.Vec(IDL.Nat), "err": Error2 });
  const UserPositionInfoWithTokenAmount = IDL.Record({
    "id": IDL.Nat,
    "tickUpper": IDL.Int,
    "tokensOwed0": IDL.Nat,
    "tokensOwed1": IDL.Nat,
    "feeGrowthInside1LastX128": IDL.Nat,
    "liquidity": IDL.Nat,
    "feeGrowthInside0LastX128": IDL.Nat,
    "token0Amount": IDL.Nat,
    "token1Amount": IDL.Nat,
    "tickLower": IDL.Int
  });
  const Page_1 = IDL.Record({
    "content": IDL.Vec(UserPositionInfoWithTokenAmount),
    "offset": IDL.Nat,
    "limit": IDL.Nat,
    "totalElements": IDL.Nat
  });
  const Result_10 = IDL.Variant({ "ok": Page_1, "err": Error2 });
  const UserPositionInfoWithId = IDL.Record({
    "id": IDL.Nat,
    "tickUpper": IDL.Int,
    "tokensOwed0": IDL.Nat,
    "tokensOwed1": IDL.Nat,
    "feeGrowthInside1LastX128": IDL.Nat,
    "liquidity": IDL.Nat,
    "feeGrowthInside0LastX128": IDL.Nat,
    "tickLower": IDL.Int
  });
  const Page = IDL.Record({
    "content": IDL.Vec(UserPositionInfoWithId),
    "offset": IDL.Nat,
    "limit": IDL.Nat,
    "totalElements": IDL.Nat
  });
  const Result_9 = IDL.Variant({ "ok": Page, "err": Error2 });
  const Result_8 = IDL.Variant({
    "ok": IDL.Vec(UserPositionInfoWithId),
    "err": Error2
  });
  const Result_7 = IDL.Variant({
    "ok": IDL.Record({ "balance0": IDL.Nat, "balance1": IDL.Nat }),
    "err": Error2
  });
  const Icrc21ConsentMessageMetadata = IDL.Record({
    "utc_offset_minutes": IDL.Opt(IDL.Int16),
    "language": IDL.Text
  });
  const Icrc21ConsentMessageSpec = IDL.Record({
    "metadata": Icrc21ConsentMessageMetadata,
    "device_spec": IDL.Opt(
      IDL.Variant({
        "GenericDisplay": IDL.Null,
        "LineDisplay": IDL.Record({
          "characters_per_line": IDL.Nat16,
          "lines_per_page": IDL.Nat16
        })
      })
    )
  });
  const Icrc21ConsentMessageRequest = IDL.Record({
    "arg": IDL.Vec(IDL.Nat8),
    "method": IDL.Text,
    "user_preferences": Icrc21ConsentMessageSpec
  });
  const Icrc21ConsentMessage = IDL.Variant({
    "LineDisplayMessage": IDL.Record({
      "pages": IDL.Vec(IDL.Record({ "lines": IDL.Vec(IDL.Text) }))
    }),
    "GenericDisplayMessage": IDL.Text
  });
  const Icrc21ConsentInfo = IDL.Record({
    "metadata": Icrc21ConsentMessageMetadata,
    "consent_message": Icrc21ConsentMessage
  });
  const Icrc21ErrorInfo = IDL.Record({ "description": IDL.Text });
  const Icrc21Error = IDL.Variant({
    "GenericError": IDL.Record({
      "description": IDL.Text,
      "error_code": IDL.Nat
    }),
    "InsufficientPayment": Icrc21ErrorInfo,
    "UnsupportedCanisterCall": Icrc21ErrorInfo,
    "ConsentMessageUnavailable": Icrc21ErrorInfo
  });
  const Icrc21ConsentMessageResponse = IDL.Variant({
    "Ok": Icrc21ConsentInfo,
    "Err": Icrc21Error
  });
  const Icrc28TrustedOriginsResponse = IDL.Record({
    "trusted_origins": IDL.Vec(IDL.Text)
  });
  const IncreaseLiquidityArgs = IDL.Record({
    "positionId": IDL.Nat,
    "amount0Desired": IDL.Text,
    "amount1Desired": IDL.Text
  });
  const PoolMetadata = IDL.Record({
    "fee": IDL.Nat,
    "key": IDL.Text,
    "sqrtPriceX96": IDL.Nat,
    "tick": IDL.Int,
    "liquidity": IDL.Nat,
    "token0": Token,
    "token1": Token,
    "maxLiquidityPerTick": IDL.Nat,
    "nextPositionId": IDL.Nat
  });
  const Result_6 = IDL.Variant({ "ok": PoolMetadata, "err": Error2 });
  const MintArgs = IDL.Record({
    "fee": IDL.Nat,
    "tickUpper": IDL.Int,
    "token0": IDL.Text,
    "token1": IDL.Text,
    "amount0Desired": IDL.Text,
    "amount1Desired": IDL.Text,
    "tickLower": IDL.Int
  });
  const SwapArgs = IDL.Record({
    "amountIn": IDL.Text,
    "zeroForOne": IDL.Bool,
    "amountOutMinimum": IDL.Text
  });
  const Result_5 = IDL.Variant({
    "ok": IDL.Record({ "tokensOwed0": IDL.Nat, "tokensOwed1": IDL.Nat }),
    "err": Error2
  });
  const Result_4 = IDL.Variant({ "ok": IDL.Bool, "err": IDL.Null });
  const Result_3 = IDL.Variant({ "ok": IDL.Int, "err": Error2 });
  const WithdrawArgs = IDL.Record({
    "fee": IDL.Nat,
    "token": IDL.Text,
    "amount": IDL.Nat
  });
  const WithdrawToSubaccountArgs = IDL.Record({
    "fee": IDL.Nat,
    "token": IDL.Text,
    "subaccount": IDL.Vec(IDL.Nat8),
    "amount": IDL.Nat
  });
  return IDL.Service({
    "activeJobs": IDL.Func([], [], []),
    "addLimitOrder": IDL.Func([LimitOrderArgs], [Result_2], []),
    "allTokenBalance": IDL.Func([IDL.Nat, IDL.Nat], [Result_31], ["query"]),
    "approvePosition": IDL.Func([IDL.Principal, IDL.Nat], [Result_2], []),
    "batchRefreshIncome": IDL.Func([IDL.Vec(IDL.Nat)], [Result_30], ["query"]),
    "checkOwnerOfUserPosition": IDL.Func(
      [IDL.Principal, IDL.Nat],
      [Result_2],
      ["query"]
    ),
    "claim": IDL.Func([ClaimArgs], [Result_29], []),
    "decreaseLiquidity": IDL.Func([DecreaseLiquidityArgs], [Result_29], []),
    "deposit": IDL.Func([DepositArgs], [Result2], []),
    "depositAllAndMint": IDL.Func([DepositAndMintArgs], [Result2], []),
    "depositFrom": IDL.Func([DepositArgs], [Result2], []),
    "getAdmins": IDL.Func([], [IDL.Vec(IDL.Principal)], ["query"]),
    "getAvailabilityState": IDL.Func(
      [],
      [
        IDL.Record({
          "whiteList": IDL.Vec(IDL.Principal),
          "available": IDL.Bool
        })
      ],
      ["query"]
    ),
    "getClaimLog": IDL.Func([], [IDL.Vec(IDL.Text)], ["query"]),
    "getCycleInfo": IDL.Func([], [Result_28], []),
    "getFeeGrowthGlobal": IDL.Func([], [Result_27], ["query"]),
    "getInitArgs": IDL.Func([], [Result_26], ["query"]),
    "getJobs": IDL.Func(
      [],
      [IDL.Record({ "jobs": IDL.Vec(JobInfo), "level": Level })],
      ["query"]
    ),
    "getLimitOrderAvailabilityState": IDL.Func([], [Result_2], ["query"]),
    "getLimitOrderStack": IDL.Func([], [Result_25], ["query"]),
    "getLimitOrders": IDL.Func([], [Result_24], ["query"]),
    "getMistransferBalance": IDL.Func([Token], [Result2], []),
    "getPosition": IDL.Func([GetPositionArgs], [Result_23], ["query"]),
    "getPositions": IDL.Func([IDL.Nat, IDL.Nat], [Result_22], ["query"]),
    "getSortedUserLimitOrders": IDL.Func(
      [IDL.Principal],
      [Result_21],
      ["query"]
    ),
    "getSwapRecordState": IDL.Func([], [Result_20], ["query"]),
    "getTickBitmaps": IDL.Func([], [Result_19], ["query"]),
    "getTickInfos": IDL.Func([IDL.Nat, IDL.Nat], [Result_18], ["query"]),
    "getTicks": IDL.Func([IDL.Nat, IDL.Nat], [Result_17], ["query"]),
    "getTokenAmountState": IDL.Func([], [Result_16], ["query"]),
    "getTokenBalance": IDL.Func(
      [],
      [IDL.Record({ "token0": IDL.Nat, "token1": IDL.Nat })],
      []
    ),
    "getTokenMeta": IDL.Func(
      [],
      [
        IDL.Record({
          "token0": IDL.Vec(IDL.Tuple(IDL.Text, Value)),
          "token1": IDL.Vec(IDL.Tuple(IDL.Text, Value)),
          "token0Fee": IDL.Opt(IDL.Nat),
          "token1Fee": IDL.Opt(IDL.Nat)
        })
      ],
      []
    ),
    "getTransferLogs": IDL.Func([], [Result_15], ["query"]),
    "getUserByPositionId": IDL.Func([IDL.Nat], [Result_1], ["query"]),
    "getUserLimitOrders": IDL.Func([IDL.Principal], [Result_14], ["query"]),
    "getUserPosition": IDL.Func([IDL.Nat], [Result_13], ["query"]),
    "getUserPositionIds": IDL.Func([], [Result_12], ["query"]),
    "getUserPositionIdsByPrincipal": IDL.Func(
      [IDL.Principal],
      [Result_11],
      ["query"]
    ),
    "getUserPositionWithTokenAmount": IDL.Func(
      [IDL.Nat, IDL.Nat],
      [Result_10],
      ["query"]
    ),
    "getUserPositions": IDL.Func([IDL.Nat, IDL.Nat], [Result_9], ["query"]),
    "getUserPositionsByPrincipal": IDL.Func(
      [IDL.Principal],
      [Result_8],
      ["query"]
    ),
    "getUserUnusedBalance": IDL.Func([IDL.Principal], [Result_7], ["query"]),
    "getVersion": IDL.Func([], [IDL.Text], ["query"]),
    "icrc10_supported_standards": IDL.Func(
      [],
      [IDL.Vec(IDL.Record({ "url": IDL.Text, "name": IDL.Text }))],
      ["query"]
    ),
    "icrc21_canister_call_consent_message": IDL.Func(
      [Icrc21ConsentMessageRequest],
      [Icrc21ConsentMessageResponse],
      []
    ),
    "icrc28_trusted_origins": IDL.Func([], [Icrc28TrustedOriginsResponse], []),
    "increaseLiquidity": IDL.Func([IncreaseLiquidityArgs], [Result2], []),
    "init": IDL.Func([IDL.Nat, IDL.Int, IDL.Nat], [], []),
    "metadata": IDL.Func([], [Result_6], ["query"]),
    "mint": IDL.Func([MintArgs], [Result2], []),
    "quote": IDL.Func([SwapArgs], [Result2], ["query"]),
    "quoteForAll": IDL.Func([SwapArgs], [Result2], ["query"]),
    "refreshIncome": IDL.Func([IDL.Nat], [Result_5], ["query"]),
    "removeErrorTransferLog": IDL.Func([IDL.Nat, IDL.Bool], [], []),
    "removeLimitOrder": IDL.Func([IDL.Nat], [Result_2], []),
    "restartJobs": IDL.Func([IDL.Vec(IDL.Text)], [], []),
    "setAdmins": IDL.Func([IDL.Vec(IDL.Principal)], [], []),
    "setAvailable": IDL.Func([IDL.Bool], [], []),
    "setIcrc28TrustedOrigins": IDL.Func([IDL.Vec(IDL.Text)], [Result_4], []),
    "setLimitOrderAvailable": IDL.Func([IDL.Bool], [], []),
    "setWhiteList": IDL.Func([IDL.Vec(IDL.Principal)], [], []),
    "stopJobs": IDL.Func([IDL.Vec(IDL.Text)], [], []),
    "sumTick": IDL.Func([], [Result_3], ["query"]),
    "swap": IDL.Func([SwapArgs], [Result2], []),
    "transferPosition": IDL.Func(
      [IDL.Principal, IDL.Principal, IDL.Nat],
      [Result_2],
      []
    ),
    "upgradeTokenStandard": IDL.Func([IDL.Principal], [Result_1], []),
    "withdraw": IDL.Func([WithdrawArgs], [Result2], []),
    "withdrawMistransferBalance": IDL.Func([Token], [Result2], []),
    "withdrawToSubaccount": IDL.Func([WithdrawToSubaccountArgs], [Result2], [])
  });
};

// src/actions/swapAction.ts
var executeKongSwap = async (walletResponse, params) => {
  try {
    const tokenActor = await walletResponse.createActor(
      idlFactory,
      params.fromCanisterId
    );
    const tokenDecimals = await tokenActor.icrc1_decimals();
    const tokenFee = await tokenActor.icrc1_fee();
    console.log("Token decimals:", tokenDecimals);
    console.log("Token fee:", tokenFee);
    let swapAmount = BigInt(Math.floor(Number(params.amount) * 10 ** tokenDecimals)) + BigInt(tokenFee);
    const approveArgs = {
      spender: {
        owner: Principal4.fromText("2ipq2-uqaaa-aaaar-qailq-cai"),
        // KongSwap canister ID
        subaccount: []
        // No subaccount
      },
      amount: swapAmount,
      expires_at: [],
      // No expiration
      memo: [],
      // No memo
      fee: [],
      // Default fee
      created_at_time: [],
      // Current time
      expected_allowance: [],
      // No expected allowance
      from_subaccount: []
      // No subaccount
    };
    console.log("Approving KongSwap to spend tokens...");
    const approveResult = await tokenActor.icrc2_approve(approveArgs);
    if ("Err" in approveResult) {
      throw new Error(`Approval failed: ${JSON.stringify(approveResult.Err)}`);
    }
    const kongswapActor = await walletResponse.createActor(
      idlFactory3,
      "2ipq2-uqaaa-aaaar-qailq-cai"
    );
    const swapArgs = {
      pay_token: "IC." + params.fromCanisterId,
      receive_token: "IC." + params.toCanisterId,
      pay_amount: params.amount,
      receive_amount: [],
      // Let KongSwap calculate optimal amount
      max_slippage: [],
      // 0.5% slippage tolerance
      receive_address: [],
      // Empty means send to caller's address
      referred_by: [],
      // No referral
      pay_tx_id: []
      // Let KongSwap generate tx id
    };
    console.log("Executing swap...");
    const result = await kongswapActor.swap(swapArgs);
    console.log("Swap result:", result);
    return unwrapRustResultMap(
      result,
      (ok) => ({
        Ok: {
          txId: ok.tx_id.toString(),
          fromAmount: ok.pay_amount.toString(),
          toAmount: ok.receive_amount.toString(),
          price: ok.price,
          slippage: ok.slippage
        }
      }),
      (err) => {
        throw new Error(`Swap failed: ${err}`);
      }
    );
  } catch (error) {
    console.error("Swap execution error:", error);
    throw error;
  }
};
var executeICPSwap = async (walletResponse, params) => {
  var _a;
  try {
    const factoryActor = await walletResponse.createActor(
      idlFactory4,
      CANISTER_IDS.ICPSWAP_FACTORY
    );
    const poolsResult = await factoryActor.getPools();
    if ("err" in poolsResult) {
      throw new Error(`Failed to get pools: ${poolsResult.err}`);
    }
    const pool = poolsResult.ok.find(
      (p) => p.token0.address === params.fromCanisterId && p.token1.address === params.toCanisterId || p.token0.address === params.toCanisterId && p.token1.address === params.fromCanisterId
    );
    console.log("Pool:", pool);
    if (!pool) {
      throw new Error("No liquidity pool found for these tokens");
    }
    const swapActor = await walletResponse.createActor(
      idlFactory5,
      (_a = pool.canisterId) == null ? void 0 : _a.toString()
    );
    const [tokenFromActor, tokenToActor] = await Promise.all([
      walletResponse.createActor(idlFactory, params.fromCanisterId),
      walletResponse.createActor(idlFactory, params.toCanisterId)
    ]);
    const zeroForOne = pool.token0.address === params.fromCanisterId;
    const [tokenFromDecimals, tokenToDecimals, tokenFromFee, tokenToFee] = await Promise.all([
      tokenFromActor.icrc1_decimals(),
      tokenToActor.icrc1_decimals(),
      tokenFromActor.icrc1_fee(),
      tokenToActor.icrc1_fee()
    ]);
    console.log(
      "Pool canister id:",
      pool.canisterId.toString(),
      "from canister id:",
      params.fromCanisterId,
      "to canister id:",
      params.toCanisterId
    );
    const approveArgs = {
      spender: {
        owner: pool.canisterId,
        subaccount: []
        // No subaccount
      },
      amount: params.amount + BigInt(pool.fee) + params.amount * BigInt(3) / BigInt(100) + BigInt(tokenFromFee),
      //approve the amount of tokens to the swap canister + fee +  6 %
      expires_at: [],
      // No expiration
      memo: [],
      // No memo
      fee: [],
      // Default fee
      created_at_time: [],
      // Current time
      expected_allowance: [],
      // No expected allowance
      from_subaccount: []
      // No subaccount
    };
    const approveResult = await tokenFromActor.icrc2_approve(
      approveArgs
    );
    console.log("Approval result for icpswap:", approveResult);
    if ("Err" in approveResult) {
      throw new Error(`Approval failed: ${JSON.stringify(approveResult.Err)}`);
    }
    const depositResult = await swapActor.depositFrom({
      fee: tokenFromFee,
      amount: params.amount + BigInt(pool.fee) + tokenFromFee * BigInt(3) / BigInt(100),
      token: params.fromCanisterId
    });
    console.log("Deposit result:", depositResult);
    if ("err" in depositResult) {
      throw new Error(`Error in depositing tokens: ${depositResult.err}`);
    }
    const swapArgs = {
      amountIn: params.amount.toString(),
      zeroForOne,
      amountOutMinimum: "0"
      // Consider adding slippage protection
    };
    const result = await swapActor.swap(swapArgs);
    console.log("Swap result:", result);
    if ("err" in result) {
      throw new Error(`Swap failed: ${result.err}`);
    }
    const principalAddress = walletResponse.wallet.getPrincipal();
    const balanceResult = await swapActor.getUserUnusedBalance(
      principalAddress
    );
    console.log("Balance result:", balanceResult);
    const withdrawAmount = zeroForOne ? balanceResult.ok.balance1 : balanceResult.ok.balance0;
    const withdrawToken = zeroForOne ? pool.token1.address : pool.token0.address;
    const tokenWithdrawActor = await walletResponse.createActor(idlFactory, withdrawToken);
    const tokenWithdrawFee = await tokenWithdrawActor.icrc1_fee();
    const withdrawAmountWithoutFee = Number(withdrawAmount - BigInt(tokenWithdrawFee));
    const withdrawResult = await swapActor.withdraw({
      fee: Number(tokenWithdrawFee),
      amount: withdrawAmountWithoutFee,
      token: withdrawToken
    });
    if ("err" in withdrawResult) {
      throw new Error(
        `Error withdrawing funds from ICPSwap: ${withdrawResult.err}`
      );
    }
    return {
      Ok: {
        toAmount: withdrawAmount
      }
    };
  } catch (error) {
    console.error("ICPSwap execution error:", error);
    throw error;
  }
};
var swapAction = {
  name: "SWAP_TOKENS",
  description: "Swap between two tokens on KongSwap or ICPSwap",
  similes: ["SWAP", "SWAP_TOKENS", "EXCHANGE", "CONVERT", "TRADE"],
  validate: async (runtime, message) => {
    const messageText = (typeof message.content === "string" ? message.content : message.content.text || "").toLowerCase();
    const hasPlatform = /(kongswap|icpswap|via\s+kong|via\s+icp|using\s+kong|using\s+icp|on\s+kong|on\s+icp|through\s+kong|through\s+icp)/i.test(
      messageText
    );
    if (!hasPlatform) {
      return false;
    }
    const swapPatterns = [
      /swap\s+(\d+)\s+(\w+)\s+(to|for|into)\s+(\w+)/i,
      /exchange\s+(\d+)\s+(\w+)\s+(to|for|into)\s+(\w+)/i,
      /convert\s+(\d+)\s+(\w+)\s+(to|for|into)\s+(\w+)/i,
      /trade\s+(\d+)\s+(\w+)\s+(to|for|into)\s+(\w+)/i
    ];
    return swapPatterns.some((pattern) => pattern.test(messageText));
  },
  handler: async (runtime, message, state, _options, callback) => {
    try {
      if (!state) {
        state = await runtime.composeState(message);
      } else {
        state = await runtime.updateRecentMessageState(state);
      }
      console.log("Processing swap with message:", message);
      const swapContext = composeContext3({
        state,
        template: swapTemplate
      });
      const response = await generateObjectDeprecated3({
        runtime,
        context: swapContext,
        modelClass: ModelClass3.LARGE
      });
      console.log("Generated swap response:", response);
      if (!response.platform) {
        throw new Error(
          "Please specify which platform to use (kongswap or icpswap)"
        );
      }
      const platform = response.platform.toLowerCase();
      if (platform !== "kongswap" && platform !== "icpswap") {
        throw new Error(
          "Invalid platform. Please use either kongswap or icpswap"
        );
      }
      console.log("Initial response:", response);
      callback == null ? void 0 : callback({
        text: "\u{1F50D} Analyzing swap request...",
        action: "SWAP_TOKENS",
        type: "processing"
      });
      const fromTokenInfo = await getTokenByNameOrSymbol(response.fromToken);
      const toTokenInfo = await getTokenByNameOrSymbol(response.toToken);
      if (!fromTokenInfo || !toTokenInfo) {
        throw new Error("Could not find token information");
      }
      const walletResponse = await icpWalletProvider.get(
        runtime,
        message,
        state
      );
      if (!walletResponse.wallet || !walletResponse.createActor) {
        throw new Error("Failed to initialize wallet");
      }
      callback == null ? void 0 : callback({
        text: `\u{1F504} Initiating swap on ${response.platform.toUpperCase()}...`,
        action: "SWAP_TOKENS",
        type: "processing"
      });
      if (response.platform.toLowerCase() == "kongswap") {
        callback == null ? void 0 : callback({
          text: `\u{1F510} Approving KongSwap to spend your ${fromTokenInfo.symbol}...`,
          action: "SWAP_TOKENS",
          type: "processing"
        });
        const swapResult = await executeKongSwap(walletResponse, {
          fromToken: fromTokenInfo.symbol,
          toToken: toTokenInfo.symbol,
          amount: BigInt(Math.floor(Number(response.amount) * 1e8)),
          // Convert to token decimals
          fromCanisterId: fromTokenInfo.canisterId,
          toCanisterId: toTokenInfo.canisterId
        });
        callback == null ? void 0 : callback({
          text: `\u2705 Swap completed on KONGSWAP
Amount: ${Number(response.amount)} ${fromTokenInfo.symbol}
Received: ${Number(swapResult.Ok.toAmount) / 1e8} ${toTokenInfo.symbol}
Price: ${swapResult.Ok.price}
Slippage: ${swapResult.Ok.slippage}%
Transaction ID: ${swapResult.Ok.txId}`,
          action: "SWAP_TOKENS",
          type: "success"
        });
      } else {
        const swapResult = await executeICPSwap(walletResponse, {
          fromToken: fromTokenInfo.symbol,
          toToken: toTokenInfo.symbol,
          amount: BigInt(Math.floor(Number(response.amount) * 1e8)),
          fromCanisterId: fromTokenInfo.canisterId,
          toCanisterId: toTokenInfo.canisterId
        });
        callback == null ? void 0 : callback({
          text: `\u2705 Swap completed on ICPSWAP
Amount: ${response.amount} ${fromTokenInfo.symbol}
Received: ${Number(swapResult.Ok.toAmount) / 1e8} ${toTokenInfo.symbol}
`,
          action: "SWAP_TOKENS",
          type: "success"
        });
      }
    } catch (error) {
      console.error("Swap error:", error);
      callback == null ? void 0 : callback({
        text: `\u274C Swap failed: ${error instanceof Error ? error.message : "Unknown error"}`,
        action: "SWAP_TOKENS",
        type: "error"
      });
    }
  },
  examples: [
    [
      {
        user: "{{user1}}",
        content: "I want to swap 100 CHAT for EXE"
      },
      {
        user: "{{user2}}",
        content: {
          text: "\u{1F504} Processing swap...",
          action: "SWAP_TOKENS"
        }
      }
    ],
    [
      {
        user: "{{user1}}",
        content: "Exchange 50 ICP to ckBTC"
      },
      {
        user: "{{user2}}",
        content: {
          text: "\u{1F504} Processing swap...",
          action: "SWAP_TOKENS"
        }
      }
    ]
  ]
};

// src/actions/checkBalancesAction.ts
var fetchTop10Tokens = async () => {
  return [
    {
      canisterId: "ryjl3-tyaaa-aaaaa-aaaba-cai",
      name: "Internet Computer",
      symbol: "ICP",
      decimals: 8
    },
    {
      canisterId: "mxzaz-hqaaa-aaaar-qaada-cai",
      name: "ckBTC",
      symbol: "ckBTC",
      decimals: 8
    },
    {
      canisterId: "2ouva-viaaa-aaaaq-aaamq-cai",
      name: "OpenChat",
      symbol: "CHAT",
      decimals: 8
    },
    {
      canisterId: "cngnf-vqaaa-aaaar-qag4q-cai",
      name: "ckUSDT",
      symbol: "ckUSDT",
      decimals: 8
    }
  ];
};
var getTokenBalance = async (creator, canisterId, principal, decimals) => {
  const tokenActor = await creator(idlFactory, canisterId);
  const balance = await tokenActor.icrc1_balance_of({
    owner: principal,
    subaccount: []
  });
  return {
    balance: Number(balance) / Math.pow(10, decimals),
    raw: balance
  };
};
var checkBalancesAction = {
  name: "CHECK_BALANCE",
  description: "Check balances of top 10 tokens on KongSwap",
  similes: ["CHECK_BALANCE", "BALANCE", "BALANCES", "CHECK_BALANCES", "SHOW_BALANCE", "SHOW_BALANCES"],
  validate: async (runtime, message) => {
    const messageText = (typeof message.content === "string" ? message.content : message.content.text || "").toLowerCase();
    const balancePatterns = [
      /check.*balance/i,
      /show.*balance/i,
      /my.*balance/i,
      /balance.*(check|show)/i,
      /what.*balance/i
    ];
    return balancePatterns.some((pattern) => pattern.test(messageText));
  },
  handler: async (runtime, message, state, _options, callback) => {
    try {
      console.log("Starting balance check...");
      if (!state) {
        state = await runtime.composeState(message);
      }
      callback == null ? void 0 : callback({
        text: "\u{1F50D} Checking your ICP balances...",
        action: "CHECK_BALANCE",
        type: "processing"
      });
      const walletResponse = await icpWalletProvider.get(runtime, message, state);
      if (!walletResponse.wallet || !walletResponse.isAuthenticated) {
        throw new Error(`Wallet initialization failed: ${walletResponse.error || "Unknown error"}`);
      }
      const principal = await walletResponse.wallet.getPrincipal();
      callback == null ? void 0 : callback({
        text: "\u{1F4CA} Getting top token list from KongSwap...",
        action: "CHECK_BALANCE",
        type: "processing"
      });
      const tokens = await fetchTop10Tokens();
      callback == null ? void 0 : callback({
        text: "\u{1F4B0} Checking balances for each token...",
        action: "CHECK_BALANCE",
        type: "processing"
      });
      const balances = await Promise.all(
        tokens.map(async (token) => {
          try {
            const balance = await getTokenBalance(
              walletResponse.createActor,
              token.canisterId,
              principal,
              token.decimals
            );
            return {
              ...token,
              ...balance
            };
          } catch (error) {
            console.error(`Error fetching balance for ${token.symbol}:`, error);
            return {
              ...token,
              balance: 0,
              raw: BigInt(0),
              error: true
            };
          }
        })
      );
      const balanceText = balances.map((token) => {
        const balanceStr = token.error ? "Error fetching balance" : `${token.balance.toFixed(4)} ${token.symbol}`;
        return `${token.name} (${token.symbol}): ${balanceStr}`;
      }).join("\n");
      callback == null ? void 0 : callback({
        text: `Principal address: ${principal.toText()}
\u2705 Your token balances:
${balanceText}`,
        action: "CHECK_BALANCE",
        type: "success"
      });
    } catch (error) {
      console.error("Balance check error:", error);
      callback == null ? void 0 : callback({
        text: `\u274C Failed to check balances: ${error instanceof Error ? error.message : "Unknown error"}`,
        action: "CHECK_BALANCE",
        type: "error"
      });
    }
  },
  examples: [
    [
      {
        user: "{{user1}}",
        content: {
          text: "What are my token balances?",
          action: "CHECK_BALANCE"
        }
      },
      {
        user: "{{user2}}",
        content: {
          text: "\u{1F50D} Fetching your token balances...",
          action: "CHECK_BALANCE"
        }
      }
    ],
    [
      {
        user: "{{user1}}",
        content: {
          text: "Show me my balances",
          action: "CHECK_BALANCE"
        }
      },
      {
        user: "{{user2}}",
        content: {
          text: "\u{1F50D} Fetching your token balances...",
          action: "CHECK_BALANCE"
        }
      }
    ]
  ]
};

// src/actions/buyTokenAction.ts
import {
  ModelClass as ModelClass4,
  composeContext as composeContext4,
  generateObjectDeprecated as generateObjectDeprecated4
} from "@elizaos/core";
import Stripe from "stripe";
import { v4 as uuidv4 } from "uuid";
import { Principal as Principal5 } from "@dfinity/principal";
var stripe = new Stripe(STRIPE_API_KEY, {
  apiVersion: "2025-03-31.basil"
});
var stripeClient = new Stripe(STRIPE_API_KEY);
var validateBuyParams = (response) => {
  console.log("response---------------", response);
  if (!response.tokenSymbol) {
    throw new Error("Please specify which token you want to buy");
  }
  if (!response.amount || isNaN(Number(response.amount))) {
    throw new Error("Please specify a valid amount to buy");
  }
};
var createStripePaymentLink = async (params) => {
  try {
    const product = await stripeClient.products.create({
      name: `Purchase ${params.tokenAmount} ${params.tokenSymbol}`,
      description: `Purchase ${params.tokenAmount} ${params.tokenSymbol} tokens worth ${params.usdAmount} USD`,
      metadata: {
        tokenSymbol: params.tokenSymbol,
        tokenAmount: params.tokenAmount.toString(),
        destinationAddress: params.destinationAddress
      }
    });
    console.log("product", product);
    const price = await stripeClient.prices.create({
      product: product.id,
      unit_amount: Math.round(params.usdAmount * 100),
      currency: "usd"
    });
    let paymentLinkId = uuidv4();
    const paymentLink = await stripeClient.paymentLinks.create({
      line_items: [{
        price: price.id,
        quantity: 1
      }],
      metadata: {
        tokenSymbol: params.tokenSymbol,
        tokenAmount: params.tokenAmount.toString(),
        usdAmount: params.usdAmount,
        destinationCanisterId: params.destinationCanisterId,
        destinationAddress: params.destinationAddress,
        paymentLinkId
      }
    });
    return {
      paymentLinkUrl: paymentLink.url,
      paymentLinkId
    };
  } catch (error) {
    console.error("Error creating Stripe session:", error);
    throw error;
  }
};
var checkCKUSDTBalance = async (createActor) => {
  try {
    const ckusdtActor = await createActor(idlFactory, CANISTER_IDS.CKUSDT);
    const [balance, decimals] = await Promise.all([
      ckusdtActor.icrc1_balance_of({
        owner: Principal5.fromText(CANISTER_IDS.ESCROW_ADDRESS),
        subaccount: []
      }),
      ckusdtActor.icrc1_decimals()
    ]);
    console.log("balance usdddddd--------", balance);
    return Number(balance) / Math.pow(10, decimals);
  } catch (error) {
    console.error("Error checking CKUSDT balance:", error);
    throw error;
  }
};
var buyTokenAction = {
  name: "BUY_TOKEN",
  description: "Buy tokens using credit card through Stripe",
  similes: ["BUY", "PURCHASE", "GET"],
  validate: async (runtime, message) => {
    const messageText = (typeof message.content === "string" ? message.content : message.content.text || "").toLowerCase();
    const buyKeywords = ["buy", "purchase", "get"];
    return buyKeywords.some((keyword) => messageText.includes(keyword));
  },
  handler: async (runtime, message, state, _options, callback) => {
    var _a;
    try {
      if (!state) {
        state = await runtime.composeState(message);
      }
      const buyTokenContext = composeContext4({
        state,
        template: buyTokenTemplate
      });
      const response = await generateObjectDeprecated4({
        runtime,
        context: buyTokenContext,
        modelClass: ModelClass4.LARGE
      });
      validateBuyParams(response);
      const walletResponse = await icpWalletProvider.get(runtime, message, state);
      if (!walletResponse.wallet || !walletResponse.createActor) {
        throw new Error("Failed to initialize wallet");
      }
      const destinationAddress = await walletResponse.wallet.getPrincipal();
      const tokenInfo = await getTokenByNameOrSymbol(response.tokenSymbol);
      if (!tokenInfo) {
        throw new Error(`Token ${response.tokenSymbol} not found`);
      }
      const tokenPrice = await fetch(`${KONG_SWAP_TOKEN_API_HOST}/${tokenInfo.canisterId}`);
      const priceData = await tokenPrice.json();
      const price = Number((_a = priceData.metrics) == null ? void 0 : _a.price) || 0;
      const amount = Number(response.amount) || 0;
      const usdAmount = price * amount;
      const ckusdtBalance = await checkCKUSDTBalance(walletResponse.createActor);
      console.log("ckusdtBalance--------", ckusdtBalance, usdAmount, response.amount);
      if (ckusdtBalance < usdAmount) {
        callback == null ? void 0 : callback({
          text: `\u274C The tokens you are trying to buy are more than the balance in the swap escrow.

Requested amount: $${usdAmount.toFixed(2)} USD
Available balance: $${ckusdtBalance.toFixed(2)} USD

Please try a smaller amount to complete the purchase.`,
          action: "BUY_TOKEN",
          type: "error"
        });
        return;
      }
      console.log("tokenInfo--------", tokenInfo);
      console.log("Price calculation:", { price, amount, usdAmount });
      callback == null ? void 0 : callback({
        text: `\u{1F4B3} Creating payment link for ${response.amount} ${response.tokenSymbol}...
Total: $${usdAmount.toFixed(2)} USD`,
        action: "BUY_TOKEN",
        type: "processing"
      });
      const paymentLink = await createStripePaymentLink({
        tokenSymbol: response.tokenSymbol,
        tokenAmount: Number(response.amount),
        usdAmount,
        destinationAddress: destinationAddress.toString(),
        destinationCanisterId: tokenInfo.canisterId
      });
      callback == null ? void 0 : callback({
        text: `\u2705 Payment link created!

Amount: ${response.amount} ${response.tokenSymbol}
Total: $${usdAmount.toFixed(2)} USD
Delivery Address: ${destinationAddress.toString()}

Payment Link: ${paymentLink.paymentLinkUrl}
Payment Link ID: ${paymentLink.paymentLinkId}

Once payment is completed, tokens will be automatically sent to your wallet.`,
        action: "BUY_TOKEN",
        type: "success"
      });
    } catch (error) {
      console.error("Buy token error:", error);
      callback == null ? void 0 : callback({
        text: `\u274C Failed to create payment: ${error instanceof Error ? error.message : "Unknown error"}`,
        action: "BUY_TOKEN",
        type: "error"
      });
    }
  },
  examples: [
    [
      {
        user: "{{user1}}",
        content: {
          text: "I want to buy 100 ICP",
          action: "BUY_TOKEN"
        }
      },
      {
        user: "{{user2}}",
        content: {
          text: "Creating payment link for 100 ICP...",
          action: "BUY_TOKEN"
        }
      }
    ],
    [
      {
        user: "{{user1}}",
        content: {
          text: "How can I purchase CHAT tokens?",
          action: "BUY_TOKEN"
        }
      },
      {
        user: "{{user2}}",
        content: {
          text: "Please specify how many CHAT tokens you'd like to buy"
        }
      }
    ]
  ]
};

// src/canisters/storage/storage.did.ts
var idlFactory6 = ({ IDL }) => {
  const Transaction2 = IDL.Record({
    "fromAmount": IDL.Opt(IDL.Text),
    "destinationAddress": IDL.Text,
    "usdAmount": IDL.Text,
    "isPaid": IDL.Bool,
    "tokenAmount": IDL.Text,
    "error": IDL.Opt(IDL.Text),
    "tokenSymbol": IDL.Text,
    "swapTxId": IDL.Opt(IDL.Text),
    "destinationCanisterId": IDL.Text,
    "price": IDL.Opt(IDL.Text),
    "toAmount": IDL.Opt(IDL.Text),
    "paymentLinkId": IDL.Text,
    "slippage": IDL.Opt(IDL.Text)
  });
  return IDL.Service({
    "checkPaymentStatus": IDL.Func([IDL.Text], [IDL.Bool], []),
    "getAllTransactions": IDL.Func(
      [],
      [IDL.Vec(IDL.Tuple(IDL.Text, Transaction2))],
      ["query"]
    ),
    "getTransaction": IDL.Func([IDL.Text], [IDL.Opt(Transaction2)], ["query"]),
    "storeTransaction": IDL.Func([Transaction2], [IDL.Bool], []),
    "updateTransaction": IDL.Func([IDL.Text, Transaction2], [IDL.Bool], [])
  });
};

// src/actions/checkPaymentAction.ts
var checkPaymentStatus = async (paymentId, createActor) => {
  const storageCanister = await createActor(
    idlFactory6,
    CANISTER_IDS.STORAGE_CANISTER
  );
  const paymentDetails = await storageCanister.getTransaction(paymentId);
  if (paymentDetails.length === 0) {
    return {
      fromAmount: [],
      destinationAddress: "",
      usdAmount: "",
      isPaid: false,
      tokenAmount: "",
      error: [],
      tokenSymbol: "",
      swapTxId: [],
      destinationCanisterId: "",
      price: [],
      toAmount: [],
      paymentLinkId: "",
      slippage: []
    };
  }
  const paymentDetail = paymentDetails[0];
  console.log("Payment details:", paymentDetail);
  return paymentDetail;
};
var checkPaymentAction = {
  name: "CHECK_PAYMENT",
  description: "Check the status of a crypto purchase payment",
  similes: ["PAYMENT_STATUS", "CHECK_PAYMENT"],
  validate: async (runtime, message) => {
    const messageText = (typeof message.content === "string" ? message.content : message.content.text || "").toLowerCase();
    const statusKeywords = [
      "payment status",
      "check payment",
      "payment id",
      "check status"
    ];
    return statusKeywords.some((keyword) => messageText.includes(keyword));
  },
  handler: async (runtime, message, state, _options, callback) => {
    try {
      const messageText = typeof message.content === "string" ? message.content : message.content.text || "";
      const paymentIdMatch = messageText.match(/[a-zA-Z0-9-]{36}/);
      if (!paymentIdMatch) {
        throw new Error("Please provide a valid payment ID to check status");
      }
      const paymentId = paymentIdMatch[0];
      callback == null ? void 0 : callback({
        text: `\u{1F50D} Checking payment status for ID: ${paymentId}...`,
        action: "CHECK_PAYMENT",
        type: "processing"
      });
      const walletResponse = await icpWalletProvider.get(
        runtime,
        message,
        state
      );
      if (!walletResponse.wallet || !walletResponse.createActor) {
        throw new Error("Failed to initialize wallet");
      }
      const status = await checkPaymentStatus(
        paymentId,
        walletResponse.createActor
      );
      console.log("Status:", status);
      let statusMessage = "";
      switch (status.isPaid) {
        case true:
          statusMessage = `\u2705 Purchase Completed!

Amount: ${status.tokenAmount} ${status.tokenSymbol}
Value: $${Number(status.usdAmount).toFixed(2)}
Delivered to: ${status.destinationAddress}
`;
          break;
        case false:
          if (status.error.length > 0) {
            statusMessage = `\u274C Payment Failed

Amount: ${status.tokenAmount} ${status.tokenSymbol}
Value: $${status.usdAmount}
Destination: ${status.destinationAddress}
Escrow does not have enough funds to complete the payment`;
          } else {
            statusMessage = `\u23F3 Payment Pending

`;
          }
      }
      callback == null ? void 0 : callback({
        text: statusMessage,
        action: "CHECK_PAYMENT",
        type: status.isPaid ? "success" : !status.isPaid ? "error" : "processing"
      });
    } catch (error) {
      console.error("Payment status check error:", error);
      callback == null ? void 0 : callback({
        text: `\u274C Failed to check payment status: ${error instanceof Error ? error.message : "Unknown error"}`,
        action: "CHECK_PAYMENT",
        type: "error"
      });
    }
  },
  examples: [
    [
      {
        user: "{{user1}}",
        content: {
          text: "Check payment status for abc123-def456-ghi789",
          action: "CHECK_PAYMENT"
        }
      },
      {
        user: "{{user2}}",
        content: {
          text: "Checking payment status...",
          action: "CHECK_PAYMENT"
        }
      }
    ]
  ]
};

// src/actions/checkNeuronsAction.ts
import { GovernanceCanister } from "@dfinity/nns";
import { createAgent } from "@dfinity/utils";
import { Principal as Principal6 } from "@dfinity/principal";
var HOST = "https://icp-api.io";
var checkNeuronsAction = {
  name: "CHECK_NEURONS",
  description: "Check all available NNS neurons for the user",
  similes: ["CHECK_NEURONS", "MY_NEURONS", "LIST_NEURONS", "SHOW_NEURONS"],
  validate: async (_runtime, message) => {
    return typeof message.content === "string";
  },
  handler: async (runtime, message, state, _options, callback) => {
    try {
      callback == null ? void 0 : callback({
        text: "\u{1F50D} Fetching your NNS neurons...",
        action: "CHECK_NEURONS",
        type: "processing"
      });
      if (!state) {
        state = await runtime.composeState(message);
      }
      const walletResponse = await icpWalletProvider.get(
        runtime,
        message,
        state
      );
      if (!walletResponse.wallet || !walletResponse.identity) {
        throw new Error("Failed to initialize wallet/identity");
      }
      const agent = await createAgent({
        identity: walletResponse.identity,
        host: HOST
      });
      const { listNeurons } = GovernanceCanister.create({
        agent,
        canisterId: Principal6.fromText(CANISTER_IDS.GOVERNANCE)
      });
      const myNeurons = await listNeurons({ certified: false });
      if (myNeurons.length === 0) {
        callback == null ? void 0 : callback({
          text: "You have no NNS neurons.",
          action: "CHECK_NEURONS",
          type: "success"
        });
        return;
      }
      const neuronList = myNeurons.map((n, i) => {
        var _a;
        const id = ((_a = n.neuronId) == null ? void 0 : _a.toString()) || "Unknown";
        const createdDate = new Date(
          Number(n.createdTimestampSeconds) * 1e3
        ).toLocaleDateString();
        const icpStake = (Number(n.fullNeuron.cachedNeuronStake) / 1e8).toFixed(2);
        const ageInDays = Math.floor(Number(n.ageSeconds) / (24 * 60 * 60));
        const votingPower = (Number(n.votingPower) / 1e8).toFixed(2);
        const dissolveDelay = Math.floor(
          Number(n.dissolveDelaySeconds) / (24 * 60 * 60)
        );
        const maturityRewards = (Number(n.fullNeuron.maturityE8sEquivalent) / 1e8).toFixed(5);
        return `Neuron #${i + 1}:
              - ID: ${id}
              - Created: ${createdDate}
              - Stake: ${icpStake} ICP
              - Age: ${ageInDays} days
              - Voting Power: ${votingPower}
              - Dissolve Delay: ${dissolveDelay} days
              - Maturity Rewards: ${maturityRewards} ICP
              `;
      }).join("\n\n");
      callback == null ? void 0 : callback({
        text: `\u{1F9E0} Your NNS Neurons:

${neuronList}`,
        action: "CHECK_NEURONS",
        type: "success"
      });
    } catch (error) {
      console.error("Neuron check error:", error);
      callback == null ? void 0 : callback({
        text: `\u274C Failed to fetch neurons: ${error instanceof Error ? error.message : "Unknown error"}`,
        action: "CHECK_NEURONS",
        type: "error"
      });
    }
  },
  examples: [
    [
      {
        user: "{{user1}}",
        content: {
          text: "Show me my neurons",
          action: "CHECK_NEURONS"
        }
      },
      {
        user: "{{user2}}",
        content: {
          text: "\u{1F50D} Fetching your NNS neurons...",
          action: "CHECK_NEURONS"
        }
      }
    ],
    [
      {
        user: "{{user1}}",
        content: {
          text: "List all my NNS neurons",
          action: "CHECK_NEURONS"
        }
      },
      {
        user: "{{user2}}",
        content: {
          text: "\u{1F9E0} Your NNS Neurons:\n\nNeuron #1: ...",
          action: "CHECK_NEURONS"
        }
      }
    ]
  ]
};

// src/actions/createNeuronAction.ts
import {
  composeContext as composeContext5,
  generateObjectDeprecated as generateObjectDeprecated5,
  ModelClass as ModelClass5
} from "@elizaos/core";
import { GovernanceCanister as GovernanceCanister2 } from "@dfinity/nns";
import { createAgent as createAgent2 } from "@dfinity/utils";
import { Principal as Principal7 } from "@dfinity/principal";
import { LedgerCanister } from "@dfinity/ledger-icp";
import { createHash } from "crypto";
var GOVERNANCE_CANISTER_ID = "rrkah-fqaaa-aaaaa-aaaaq-cai";
var LEDGER_CANISTER_ID = "ryjl3-tyaaa-aaaaa-aaaba-cai";
var HOST2 = "https://icp-api.io";
var DEFAULT_FEE = BigInt(1e4);
var createNeuronAction = {
  name: "CREATE_NEURON",
  description: "Create a new NNS neuron with a specified amount of ICP.",
  similes: [
    "CREATE_NEURON",
    "NEW_NEURON",
    "STAKE_NEURON",
    "CREATE NNS NEURON",
    "CREATE A NEURON",
    "STAKE ICP FOR NEURON"
  ],
  validate: async (_runtime, message) => {
    const text = typeof message.content === "string" ? message.content : message.content.text || "";
    return /create.*neuron.*with.*icp/i.test(text) || /stake.*neuron/i.test(text);
  },
  handler: async (runtime, message, state, _options, callback) => {
    try {
      callback == null ? void 0 : callback({
        text: "\u{1F9E0} Preparing to create a new neuron...",
        action: "CREATE_NEURON",
        type: "processing"
      });
      if (!state) {
        state = await runtime.composeState(message);
      }
      const stakeNeuronContext = composeContext5({
        state,
        template: stakeNeuronTemplate
      });
      const stakeNeuronResponse = await generateObjectDeprecated5({
        runtime,
        context: stakeNeuronContext,
        modelClass: ModelClass5.LARGE
      });
      const icpAmount = Number(stakeNeuronResponse.amount);
      const neuronId = stakeNeuronResponse.neuronId;
      console.log("stakeNeuronResponse", stakeNeuronResponse);
      if (!icpAmount) {
        callback == null ? void 0 : callback({
          text: "\u274C Please specify the amount of ICP to stake, e.g. 'create a new neuron with 1 icp'.",
          action: "CREATE_NEURON",
          type: "error"
        });
        return;
      }
      const stake = BigInt(Math.floor(icpAmount * 1e8));
      if (stake < BigInt(1 * 1e8)) {
        throw new Error("Stake must be at least 1 ICP");
      }
      const walletResponse = await icpWalletProvider.get(runtime, message, state);
      if (!walletResponse.wallet || !walletResponse.identity) {
        throw new Error("Failed to initialize wallet/identity");
      }
      const agent = await createAgent2({
        identity: walletResponse.identity,
        host: HOST2
      });
      const governance = GovernanceCanister2.create({
        agent,
        canisterId: Principal7.fromText(GOVERNANCE_CANISTER_ID)
      });
      const ledger = LedgerCanister.create({
        agent,
        canisterId: Principal7.fromText(LEDGER_CANISTER_ID)
      });
      const principal = walletResponse.identity.getPrincipal();
      callback == null ? void 0 : callback({
        text: "\u{1F511} Transfering ICP to governance canister...",
        action: "CREATE_NEURON",
        type: "processing"
      });
      try {
        const stakeNeuronResult = await governance.stakeNeuron({
          stake: stake + BigInt(2e4),
          principal,
          ledgerCanister: ledger,
          createdAt: void 0,
          fee: DEFAULT_FEE
        });
        console.log("stakeNeuronResult", stakeNeuronResult);
        const successMessage = neuronId ? `\u2705 Successfully staked ${icpAmount} ICP in neuron ${Number(stakeNeuronResult)}!` : `\u2705 New neuron created successfully with ${icpAmount} ICP!`;
        callback == null ? void 0 : callback({
          text: successMessage,
          action: "CREATE_NEURON",
          type: "success"
        });
      } catch (error) {
        console.error("Stake neuron error:", error);
        throw error;
      }
    } catch (error) {
      const { message: message2, stack } = error;
      console.error("Create neuron error:", error, message2, stack);
      callback == null ? void 0 : callback({
        text: `\u274C Failed to create neuron: ${error instanceof Error ? error.message : "Unknown error"}`,
        action: "CREATE_NEURON",
        type: "error"
      });
    }
  },
  examples: [
    [
      {
        user: "{{user1}}",
        content: {
          text: "Create a new neuron with 1 icp",
          action: "CREATE_NEURON"
        }
      },
      {
        user: "{{user2}}",
        content: {
          text: "\u{1F9E0} Preparing to create a new neuron...",
          action: "CREATE_NEURON"
        }
      }
    ],
    [
      {
        user: "{{user1}}",
        content: {
          text: "Stake 2.5 ICP to create a neuron",
          action: "CREATE_NEURON"
        }
      },
      {
        user: "{{user2}}",
        content: {
          text: "\u23F3 Staking ICP to create neuron...",
          action: "CREATE_NEURON"
        }
      }
    ]
  ]
};

// src/actions/startDissolvingNeuronAction.ts
import {
  composeContext as composeContext6,
  generateObjectDeprecated as generateObjectDeprecated6,
  ModelClass as ModelClass6
} from "@elizaos/core";
import { GovernanceCanister as GovernanceCanister3 } from "@dfinity/nns";
import { createAgent as createAgent3 } from "@dfinity/utils";
import { Principal as Principal8 } from "@dfinity/principal";
var HOST3 = "https://icp-api.io";
var startDissolvingNeuronAction = {
  name: "START_DISSOLVING_NEURON",
  description: "Start dissolving a specific NNS neuron by ID.",
  similes: [
    "START_DISSOLVING_NEURON",
    "DISSOLVE_NEURON",
    "BEGIN_DISSOLVE",
    "START DISSOLVING"
  ],
  validate: async (_runtime, message) => {
    const text = typeof message.content === "string" ? message.content : message.content.text || "";
    return typeof message.content === "string";
  },
  handler: async (runtime, message, state, _options, callback) => {
    try {
      callback == null ? void 0 : callback({
        text: "\u{1F50D} Preparing to start dissolving the neuron...",
        action: "START_DISSOLVING_NEURON",
        type: "processing"
      });
      if (!state) {
        state = await runtime.composeState(message);
      }
      const dissolveNeuronContext = composeContext6({
        state,
        template: startDissolveNeuronTemplate
      });
      const response = await generateObjectDeprecated6({
        runtime,
        context: dissolveNeuronContext,
        modelClass: ModelClass6.LARGE
      });
      console.log("response", response);
      const walletResponse = await icpWalletProvider.get(runtime, message, state);
      if (!walletResponse.wallet || !walletResponse.identity) {
        throw new Error("Failed to initialize wallet/identity");
      }
      if (!response.neuronId) {
        callback == null ? void 0 : callback({
          text: "\u274C Please specify the neuron ID to start dissolving, e.g. 'start dissolving neuron id: 123456'.",
          action: "START_DISSOLVING_NEURON",
          type: "error"
        });
        return;
      }
      const agent = await createAgent3({
        identity: walletResponse.identity,
        host: HOST3
      });
      const governance = GovernanceCanister3.create({
        agent,
        canisterId: Principal8.fromText(CANISTER_IDS.GOVERNANCE)
      });
      await governance.startDissolving(BigInt(response.neuronId));
      console.log("neuron started dissolving", response.neuronId);
      callback == null ? void 0 : callback({
        text: `\u2705 Neuron ${response.neuronId} is now dissolving.`,
        action: "START_DISSOLVING_NEURON",
        type: "success"
      });
    } catch (error) {
      console.error("Start dissolving neuron error:", error);
      callback == null ? void 0 : callback({
        text: `\u274C Failed to start dissolving neuron: The neuron id may not be valid. Or the neuron is already dissolving.`,
        action: "START_DISSOLVING_NEURON",
        type: "error"
      });
    }
  },
  examples: [
    [
      {
        user: "{{user1}}",
        content: {
          text: "Start dissolving neuron id: 123456",
          action: "START_DISSOLVING_NEURON"
        }
      },
      {
        user: "{{user2}}",
        content: {
          text: "\u{1F50D} Preparing to start dissolving the neuron...",
          action: "START_DISSOLVING_NEURON"
        }
      }
    ]
  ]
};

// src/actions/stopDissolvingNeuronAction.ts
import {
  composeContext as composeContext7,
  generateObjectDeprecated as generateObjectDeprecated7,
  ModelClass as ModelClass7
} from "@elizaos/core";
import { GovernanceCanister as GovernanceCanister4 } from "@dfinity/nns";
import { createAgent as createAgent4 } from "@dfinity/utils";
import { Principal as Principal9 } from "@dfinity/principal";
var HOST4 = "https://icp-api.io";
var stopDissolvingNeuronAction = {
  name: "STOP_DISSOLVING_NEURON",
  description: "Stop dissolving a specific NNS neuron by ID.",
  similes: [
    "STOP_DISSOLVING_NEURON",
    "STOP_DISSOLVE",
    "STOP_DISSOLVING",
    "STOP DISSOLVING"
  ],
  validate: async (_runtime, message) => {
    return typeof message.content === "string";
  },
  handler: async (runtime, message, state, _options, callback) => {
    try {
      callback == null ? void 0 : callback({
        text: "\u{1F50D} Preparing to stop dissolving the neuron...",
        action: "STOP_DISSOLVING_NEURON",
        type: "processing"
      });
      if (!state) {
        state = await runtime.composeState(message);
      }
      const dissolveNeuronContext = composeContext7({
        state,
        template: stopDissolveNeuronTemplate
      });
      const response = await generateObjectDeprecated7({
        runtime,
        context: dissolveNeuronContext,
        modelClass: ModelClass7.LARGE
      });
      console.log("response", response);
      const walletResponse = await icpWalletProvider.get(runtime, message, state);
      if (!walletResponse.wallet || !walletResponse.identity) {
        throw new Error("Failed to initialize wallet/identity");
      }
      if (!response.neuronId) {
        callback == null ? void 0 : callback({
          text: "\u274C Please specify the neuron ID to stop dissolving, e.g. 'stop dissolving neuron id: 123456'.",
          action: "STOP_DISSOLVING_NEURON",
          type: "error"
        });
        return;
      }
      const agent = await createAgent4({
        identity: walletResponse.identity,
        host: HOST4
      });
      const governance = GovernanceCanister4.create({
        agent,
        canisterId: Principal9.fromText(CANISTER_IDS.GOVERNANCE)
      });
      await governance.stopDissolving(BigInt(response.neuronId));
      console.log("neuron stopped dissolving", response.neuronId);
      callback == null ? void 0 : callback({
        text: `\u2705 Neuron ${response.neuronId} is now stopped from dissolving.`,
        action: "STOP_DISSOLVING_NEURON",
        type: "success"
      });
    } catch (error) {
      console.error("Start dissolving neuron error:", error);
      callback == null ? void 0 : callback({
        text: `\u274C Failed to stop dissolving neuron: The neuron id may not be valid. Or the neuron is not dissolving.`,
        action: "STOP_DISSOLVING_NEURON",
        type: "error"
      });
    }
  },
  examples: [
    [
      {
        user: "{{user1}}",
        content: {
          text: "Stop dissolving neuron id: 123456",
          action: "STOP_DISSOLVING_NEURON"
        }
      },
      {
        user: "{{user2}}",
        content: {
          text: "\u{1F50D} Preparing to stop dissolving the neuron...",
          action: "STOP_DISSOLVING_NEURON"
        }
      }
    ]
  ]
};

// src/actions/increaseDissolveDelayAction.ts
import { GovernanceCanister as GovernanceCanister5 } from "@dfinity/nns";
import { createAgent as createAgent5 } from "@dfinity/utils";
import { Principal as Principal10 } from "@dfinity/principal";
import { composeContext as composeContext8 } from "@elizaos/core";
import { generateObjectDeprecated as generateObjectDeprecated8 } from "@elizaos/core";
import { ModelClass as ModelClass8 } from "@elizaos/core";
var HOST5 = "https://icp-api.io";
var increaseDissolveDelayAction = {
  name: "INCREASE_DISSOLVE_DELAY",
  description: "Increase the dissolve delay of a specific NNS neuron by ID.",
  similes: [
    "INCREASE_DISSOLVE_DELAY",
    "EXTEND_DISSOLVE_DELAY",
    "INCREASE DELAY",
    "EXTEND DELAY"
  ],
  validate: async (_runtime, message) => {
    return typeof message.content === "string";
  },
  handler: async (runtime, message, state, _options, callback) => {
    try {
      callback == null ? void 0 : callback({
        text: "\u{1F50D} Preparing to increase the dissolve delay of the neuron...",
        action: "INCREASE_DISSOLVE_DELAY",
        type: "processing"
      });
      if (!state) {
        state = await runtime.composeState(message);
      }
      state = await runtime.composeState(message);
      const walletResponse = await icpWalletProvider.get(runtime, message, state);
      if (!walletResponse.wallet || !walletResponse.identity) {
        throw new Error("Failed to initialize wallet/identity");
      }
      let increaseDissolveDelayContext = composeContext8({
        state,
        template: increaseDissolveDelayTemplate
      });
      const response = await generateObjectDeprecated8({
        runtime,
        context: increaseDissolveDelayContext,
        modelClass: ModelClass8.LARGE
      });
      console.log("increase dissolve delay response", response);
      if (!response.neuronId || !response.delayDays) {
        callback == null ? void 0 : callback({
          text: "\u274C Please specify the neuron ID and delay in days, e.g. 'increase dissolve delay for neuron id: 123456 by 30 days'.",
          action: "INCREASE_DISSOLVE_DELAY",
          type: "error"
        });
        return;
      }
      const { neuronId, delayDays } = response;
      const additionalDissolveDelaySeconds = delayDays * 24 * 60 * 60;
      const agent = await createAgent5({
        identity: walletResponse.identity,
        host: HOST5
      });
      const governance = GovernanceCanister5.create({
        agent,
        canisterId: Principal10.fromText(CANISTER_IDS.GOVERNANCE)
      });
      await governance.increaseDissolveDelay({
        neuronId: BigInt(neuronId),
        additionalDissolveDelaySeconds: Number(additionalDissolveDelaySeconds)
      });
      callback == null ? void 0 : callback({
        text: `\u2705 Neuron ${neuronId} dissolve delay increased by ${delayDays} days.`,
        action: "INCREASE_DISSOLVE_DELAY",
        type: "success"
      });
    } catch (error) {
      console.error("Increase dissolve delay error:", error);
      callback == null ? void 0 : callback({
        text: `\u274C Failed to increase dissolve delay: ${error instanceof Error ? error.message : "Unknown error"}`,
        action: "INCREASE_DISSOLVE_DELAY",
        type: "error"
      });
    }
  },
  examples: [
    [
      {
        user: "{{user1}}",
        content: {
          text: "Increase dissolve delay for neuron id: 123456 by 30 days",
          action: "INCREASE_DISSOLVE_DELAY"
        }
      },
      {
        user: "{{user2}}",
        content: {
          text: "\u{1F50D} Preparing to increase the dissolve delay of the neuron...",
          action: "INCREASE_DISSOLVE_DELAY"
        }
      }
    ]
  ]
};

// src/actions/disburseNeuronAction.ts
import {
  composeContext as composeContext9
} from "@elizaos/core";
import { GovernanceCanister as GovernanceCanister6 } from "@dfinity/nns";
import { createAgent as createAgent6 } from "@dfinity/utils";
import { generateObjectDeprecated as generateObjectDeprecated9, ModelClass as ModelClass9 } from "@elizaos/core";
import { Principal as Principal11 } from "@dfinity/principal";
var HOST6 = "https://icp-api.io";
var disburseNeuronAction = {
  name: "DISBURSE_NEURON",
  description: "Disburse a specific NNS neuron by ID.",
  similes: [
    "DISBURSE_NEURON",
    "WITHDRAW_NEURON",
    "DISBURSE",
    "WITHDRAW"
  ],
  validate: async (_runtime, message) => {
    const text = typeof message.content === "string" ? message.content : message.content.text || "";
    console.log("text :", text);
    const patterns = [
      /disburse.*neuron.*id/i,
      /withdraw.*neuron.*id/i,
      /disburse.*from.*neuron/i,
      /withdraw.*from.*neuron/i,
      /disburse.*icp.*(?:from\s+)?neuron/i,
      /withdraw.*icp.*(?:from\s+)?neuron/i
    ];
    return patterns.some((pattern) => pattern.test(text));
  },
  handler: async (runtime, message, state, _options, callback) => {
    try {
      callback == null ? void 0 : callback({
        text: "\u{1F50D} Preparing to disburse the neuron...",
        action: "DISBURSE_NEURON",
        type: "processing"
      });
      let disburseNeuronContext = composeContext9({
        state,
        template: disburseNeuronTemplate
      });
      let response = await generateObjectDeprecated9({
        runtime,
        context: disburseNeuronContext,
        modelClass: ModelClass9.LARGE
      });
      const walletResponse = await icpWalletProvider.get(runtime, message, state);
      if (!walletResponse.wallet || !walletResponse.identity) {
        throw new Error("Failed to initialize wallet/identity");
      }
      const { neuronId, amount, toAccountId } = response;
      if (!neuronId || !amount || !toAccountId) {
        callback == null ? void 0 : callback({
          text: "\u274C Please specify the neuron ID to disburse, e.g. 'disburse neuron id: 123456'.",
          action: "DISBURSE_NEURON",
          type: "error"
        });
        return;
      }
      console.log("disburse details :", neuronId, amount, toAccountId);
      const agent = await createAgent6({
        identity: walletResponse.identity,
        host: HOST6
      });
      const governance = GovernanceCanister6.create({
        agent,
        canisterId: Principal11.fromText(CANISTER_IDS.GOVERNANCE)
      });
      const formattedAmount = Number(amount) * 10 ** 18;
      const result = await governance.disburse({
        neuronId: BigInt(neuronId),
        toAccountId,
        amount: BigInt(formattedAmount)
      });
      console.log("result :", result);
      callback == null ? void 0 : callback({
        text: `\u2705 Neuron ${neuronId} has been disbursed.`,
        action: "DISBURSE_NEURON",
        type: "success"
      });
    } catch (error) {
      console.error("Disburse neuron error:", error);
      callback == null ? void 0 : callback({
        text: `\u274C Failed to disburse neuron. The neuron might not exist or there is not enough maturity in the neuron to disburse.`,
        action: "DISBURSE_NEURON",
        type: "error"
      });
    }
  },
  examples: [
    [
      {
        user: "{{user1}}",
        content: {
          text: "Disburse neuron id: 123456 to account id: abcdef-ghi",
          action: "DISBURSE_NEURON"
        }
      },
      {
        user: "{{user2}}",
        content: {
          text: "\u{1F50D} Preparing to disburse the neuron...",
          action: "DISBURSE_NEURON"
        }
      }
    ]
  ]
};

// src/index.ts
var icpPlugin = {
  name: "icp",
  description: "Internet Computer Protocol Plugin for Eliza",
  providers: [icpWalletProvider],
  actions: [
    swapAction,
    executeCreateToken,
    checkBalancesAction,
    getTokenPriceAction,
    checkNeuronsAction,
    createNeuronAction,
    transferTokenAction,
    buyTokenAction,
    checkPaymentAction,
    startDissolvingNeuronAction,
    stopDissolvingNeuronAction,
    increaseDissolveDelayAction,
    disburseNeuronAction
  ],
  evaluators: []
};
var index_default = icpPlugin;
export {
  index_default as default,
  icpPlugin
};
//# sourceMappingURL=index.js.map