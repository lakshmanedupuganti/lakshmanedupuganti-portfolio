// These breakpoints are matching with the bootstrap breakpoints.
// If you change them, dont forget to check that too.

export const size = {
    xs: 0,
    sm: 800,
    lg: 1024,
    xl: 1440
};

export default {
    xs: `(min-width: ${size.xs}px)`,
    sm: `(min-width: ${size.sm}px)`,
    lg: `(min-width: ${size.lg}px)`,
    xl: `(min-width: ${size.xl}px)`,
    belowSm: `(max-width: ${size.sm-1}px)`,
    belowLg: `(max-width: ${size.lg-1}px)`,
    belowXl: `(max-width: ${size.xl-1}px)`
};
