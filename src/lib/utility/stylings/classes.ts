import { ClassNamesBaseType } from "@src/lib/types";

class ClassesUtility {
  /**
   * This utility process all arguments to be a className as string or string[].
   * * Same goal as classNames npm package just different method including types
   * @param {boolean} asString Default value: true. If we want to return a string of array, set it false
   * @param {ClassNamesBaseType[]} classes Accepted types:
   * * String: 'class1 class2'
  //  * * Array: ['class1','class2 class5',{ class3: false, class4: true }]
   * * Object: { class1: false, class2: true }
   * * Undefined, Null, False, Function: these will be filtered
   * @returns {string | string[]} string OR array of string
   * @example
   * // returns 'class1 class2 class5 class4'
   * composeClasses(true, 'class1','class2 class5',{ class3: false, class4: true }) as string
   * // return ['class1','class2','class5','class4']
   * composeClasses(false, 'class1','class2 class5',{ class3: false, class4: true }) as string[]
   */
  public composeClasses(
    asString = true,
    ...classes: ClassNamesBaseType[]
  ): string | string[] {
    const list = classes.reduce((arr: ClassNamesBaseType[], c) => {
      switch (typeof c) {
        case "undefined":
        case "boolean":
        case "function":
          return arr;
        case "object": {
          if (!c) return arr;
          return Array.isArray(c)
            ? [
                ...arr,
                ...(this.composeClasses(
                  false,
                  ...(c as ClassNamesBaseType[])
                ) as ClassNamesBaseType[]),
              ]
            : [
                ...arr,
                ...Object.entries(c).reduce((obj: string[], [key, value]) => {
                  if (!value) return obj;
                  return [
                    ...obj,
                    ...(typeof key === "string"
                      ? key.trim().split(" ")
                      : [key]),
                  ];
                }, []),
              ];
        }
        case "string": {
          if (!c) return arr;
          return [...arr, ...c.trim().split(" ")];
        }
        default:
          return [...arr, c];
      }
    }, []);
    return asString ? (list.join(" ") as string) : (list as string[]);
  }

  public getClassesStrFromModuleCss(
    css: {
      readonly [key: string]: string;
    },
    ...classes: ClassNamesBaseType[]
  ): string {
    return (this.composeClasses(false, ...classes) as string[])
      .map((c) => css[c] || c)
      .join(" ");
  }
}

const inst = new ClassesUtility();
export default inst;

export const _cx =
  (css: { readonly [key: string]: string } = {}) =>
  (...classes: ClassNamesBaseType[]) =>
    inst.getClassesStrFromModuleCss(css, ...classes);

export const csx = (
  css: { readonly [key: string]: string } = {},
  ...classes: ClassNamesBaseType[]
) => inst.getClassesStrFromModuleCss(css, ...classes);

export const cx = (...classes: ClassNamesBaseType[]) =>
  inst.composeClasses(true, ...classes) as string;

export const cssv = (
  cssVars: { readonly [key: string]: string | number | undefined },
  otherStyles: { readonly [key: string]: string } | undefined = undefined
) => {
  const ret: Record<string, string> = {};

  Object.entries(cssVars)
    .filter(([k, v]) => !!k && v !== "" && v !== undefined)
    .forEach(([k, v]) => (ret[`--${k}`] = `${v}`));

  if (otherStyles) {
    Object.entries(otherStyles)
      .filter(([k, v]) => v !== "")
      .forEach(([k, v]) => (ret[k] = v));
  }

  return ret;
};

export const cssvBorderColor = (color: string | undefined) =>
  color ? `var(--borderColor-${color})` : undefined;
export const cssvBkgColor = (color: string | undefined) =>
  color ? `var(--bkgColor-${color})` : undefined;
export const cssvBkgHoverColor = (color: string | undefined) =>
  color ? `var(--bkgHoverColor-${color})` : undefined;

export const cssvFontColor = (color: string | undefined) =>
  color ? `var(--fontColor-${color})` : undefined;

export const cssvbtnColor = (color: string | undefined) =>
  color ? `var(--btnColor-${color})` : undefined;
export const cssvbtnHoverColor = (color: string | undefined) =>
  color ? `var(--btnHoverColor-${color})` : undefined;

export const cssvbtnHeight = (size: string | undefined) =>
  size ? `var(--btnHeight-${size})` : undefined;
export const cssvbtnFontSize = (size: string | undefined) =>
  size ? `var(--btnFontSize-${size})` : undefined;
export const cssvbtnPadding = (size: string | undefined) =>
  size ? `var(--btnPadding-${size})` : undefined;

export const cssvHeroColor1 = (color: string | undefined) =>
  color ? `var(--heroColor1-${color})` : undefined;
export const cssvHeroColor2 = (color: string | undefined) =>
  color ? `var(--heroColor2-${color})` : undefined;
export const cssvGradient = (gradient: string | undefined) =>
  gradient ? `var(--gradient-${gradient})` : undefined;

export const cssvUrl = (url: string | undefined) =>
  url ? `url('${url}')` : undefined;

export const cssvSVGUrl = (url: string | undefined) =>
  url ? `url('data:image/svg+xml;utf8,${encodeURIComponent(url)}')` : undefined;
