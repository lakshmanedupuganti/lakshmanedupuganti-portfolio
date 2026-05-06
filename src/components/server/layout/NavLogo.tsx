import type { AssetEntry } from "@lakshmanedupuganti/server-library";
import DynamicLink from "@server/layout/DynamicLink";
import ResponsiveImage from "@client/utility/ResponsiveImage";
import css from "./NavLogo.module.scss";

type NavLogoProps = {
  logoUrl: string;
  desktopLogo?: AssetEntry;
  mobileLogo?: AssetEntry;
  dataAttributes?: { [key: string]: string };
};

const NavLogo = (props: NavLogoProps) => {
  const { logoUrl, desktopLogo, mobileLogo, dataAttributes } = props;
  return (
    <div className={css.logo}>
      <DynamicLink slug={logoUrl} className={css.logo}>
        <ResponsiveImage
          image={desktopLogo}
          alt={desktopLogo?.fields?.description || "invisalign logo"}
          className={css.desktopLogo}
          dataAttributes={dataAttributes}
        />
        <ResponsiveImage
          image={mobileLogo}
          alt={mobileLogo?.fields?.description || "invisalign logo"}
          className={css.mobileLogo}
          dataAttributes={dataAttributes}
        />
      </DynamicLink>
    </div>
  );
};

export default NavLogo;
