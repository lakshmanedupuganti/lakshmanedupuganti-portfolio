import "server-only";

declare type NumberAttr =
  | number
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "11"
  | "12";
declare type ColOrderNumber = number | "1" | "2" | "3" | "4" | "5";
declare type ColOrder = ColOrderNumber | "first" | "last";
declare type ColSize = boolean | "auto" | NumberAttr;
declare type ColSpec =
  | ColSize
  | {
      span?: ColSize;
      offset?: NumberAttr;
      order?: ColOrder;
    };
declare type Variant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'dark' | 'light' | string;
declare type ButtonVariant = Variant | 'link' | 'outline-primary' | 'outline-secondary' | 'outline-success' | 'outline-danger' | 'outline-warning' | 'outline-info' | 'outline-dark' | 'outline-light';

export interface ColProps extends React.HTMLAttributes<HTMLElement> {
  xs?: ColSpec;
  sm?: ColSpec;
  md?: ColSpec;
  lg?: ColSpec;
  xl?: ColSpec;
  xxl?: ColSpec;
}

export const Col: React.FC<ColProps> = (props) => {
  const { xs, sm, md, lg, xl, xxl, className, children, ...rest } = props;

  const classList: string[] = [];

  const addClassesForBreakpoint = (prefix: string, size?: ColSpec) => {
    if (size === undefined) return;

    if (typeof size === "number" || typeof size === "string") {
      classList.push(`col${prefix ? "-" + prefix : ""}-${size}`);
    } else {
      const { span, offset, order } = size as {
        span?: ColSize;
        offset?: NumberAttr;
        order?: ColOrder;
      };

      if (span) classList.push(`col${prefix ? "-" + prefix : ""}-${span}`);
      if (offset)
        classList.push(`offset${prefix ? "-" + prefix : ""}-${offset}`);
      if (order) classList.push(`order${prefix ? "-" + prefix : ""}-${order}`);
    }
  };

  addClassesForBreakpoint("", xs);
  addClassesForBreakpoint("sm", sm);
  addClassesForBreakpoint("md", md);
  addClassesForBreakpoint("lg", lg);
  addClassesForBreakpoint("xl", xl);
  addClassesForBreakpoint("xxl", xxl);
  if (className) classList.push(className);

  return (
    <div className={classList.join(" ")} {...rest}>
      {children}
    </div>
  );
};

export interface RowProps extends React.HTMLAttributes<HTMLElement> {}

export const Row: React.FC<RowProps> = (props) => {
  const { className, children, ...rest } = props;

  const classList = ["row"];
  if (className) classList.push(className);

  return (
    <div className={classList.join(" ")} {...rest}>
      {children}
    </div>
  );
};

export interface ContainerProps extends React.HTMLAttributes<HTMLElement> {
  fluid?: boolean | "sm" | "md" | "lg" | "xl" | "xxl";
}

export const Container: React.FC<ContainerProps> = (props) => {
  const { className, fluid, children, ...rest } = props;

  const classList = [
    fluid === true
      ? "container-fluid"
      : typeof fluid === "string"
      ? "container-" + fluid
      : "container",
  ];
  if (className) classList.push(className);

  return (
    <div className={classList.join(" ")} {...rest}>
      {children}
    </div>
  );
};

export interface ButtonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: ButtonVariant;
  active?: boolean;
  block?: boolean;
  size?: "sm" | "lg";
  type?: "button" | "reset" | "submit" | string;
  href?: string;
  disabled?: boolean;
  target?: any;
}

export const Button: React.FC<ButtonProps> = (props) => {
  const { className, variant, size, children, type = "button", ...rest } = props;

  const classList = ["btn"];

  if (variant) classList.push(`btn-${variant}`);
  if (size) classList.push(`btn-${size}`);

  if (className) classList.push(className);

  return (
    <div role="button" className={classList.join(" ")} {...rest}>
      {children}
    </div>
  );
};
