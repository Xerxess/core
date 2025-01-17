import {
  isArray,
  isMap,
  isObject,
  isFunction,
  isPlainObject,
  isSet,
  objectToString,
  isString
} from './index'

/**
 * 目前只知道用于转换对象为vue识别的专用字符串
 * For converting {{ interpolation }} values to displayed strings.
 * @private
 */
export const toDisplayString = (val: unknown): string => {
  return isString(val) ? val : val == null 
                       ? '' : isArray(val) || (isObject(val) && (val.toString === objectToString || !isFunction(val.toString)))
                       ? JSON.stringify(val, replacer, 2) : String(val)
}

const replacer = (_key: string, val: any): any => {
  // can't use isRef here since @vue/shared has no deps
  if (val && val.__v_isRef) {
    return replacer(_key, val.value)
  } else if (isMap(val)) {
    return {
      [`Map(${val.size})`]: [...val.entries()].reduce((entries, [key, val]) => {
        ;(entries as any)[`${key} =>`] = val
        return entries
      }, {})
    }
  } else if (isSet(val)) {
    return {
      [`Set(${val.size})`]: [...val.values()]
    }
  } else if (isObject(val) && !isArray(val) && !isPlainObject(val)) {
    return String(val)
  }
  return val
}
