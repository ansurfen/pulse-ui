import type { TextFieldValidateFn } from "./useTextFieldValidation";

export interface TextFieldRuleOptions {
  message: string;
  /** 值为空时是否跳过此规则，默认 true（必填请单独用 required） */
  skipEmpty?: boolean;
}

function runRule(value: string, options: TextFieldRuleOptions, validate: (value: string) => boolean) {
  if (options.skipEmpty !== false && value.trim().length === 0) {
    return undefined;
  }

  return validate(value) ? undefined : options.message;
}

/** 组合多条规则，返回第一个错误 */
export function composeTextFieldRules(...rules: TextFieldValidateFn[]): TextFieldValidateFn {
  return (value) => {
    for (const rule of rules) {
      const message = rule(value);
      if (message) {
        return message;
      }
    }

    return undefined;
  };
}

/** 必填 */
export function requiredRule(options: TextFieldRuleOptions): TextFieldValidateFn {
  return (value) => (value.trim().length > 0 ? undefined : options.message);
}

/** 最小长度 */
export function minLengthRule(min: number, options: TextFieldRuleOptions): TextFieldValidateFn {
  return (value) => runRule(value, options, (input) => input.length >= min);
}

/** 最大长度 */
export function maxLengthRule(max: number, options: TextFieldRuleOptions): TextFieldValidateFn {
  return (value) => runRule(value, options, (input) => input.length <= max);
}

/** 正则匹配 */
export function patternRule(regex: RegExp, options: TextFieldRuleOptions): TextFieldValidateFn {
  return (value) => runRule(value, options, (input) => regex.test(input.trim()));
}

/** 邮箱 */
export function emailRule(options: Partial<TextFieldRuleOptions> & { message?: string } = {}): TextFieldValidateFn {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return patternRule(emailPattern, {
    message: options.message ?? "请输入有效的邮箱地址。",
    skipEmpty: options.skipEmpty
  });
}

/** 中国大陆手机号（11 位，1 开头） */
export function phoneRule(options: Partial<TextFieldRuleOptions> & { message?: string } = {}): TextFieldValidateFn {
  const phonePattern = /^1\d{10}$/;

  return (value) =>
    runRule(
      value,
      {
        message: options.message ?? "请输入有效的手机号。",
        skipEmpty: options.skipEmpty
      },
      (input) => phonePattern.test(input.trim().replace(/\s+/g, ""))
    );
};

/** 密码最少位数 */
export function passwordRule(
  minLength = 8,
  options: Partial<TextFieldRuleOptions> & { message?: string } = {}
): TextFieldValidateFn {
  return minLengthRule(minLength, {
    message: options.message ?? `密码太短，请至少使用 ${minLength} 个字符。`,
    skipEmpty: options.skipEmpty ?? false
  });
}

/** 完全自定义 */
export function customRule(
  predicate: (value: string) => boolean,
  options: TextFieldRuleOptions
): TextFieldValidateFn {
  return (value) => runRule(value, options, predicate);
}
