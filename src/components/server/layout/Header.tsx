import css from "./Header.module.scss";
import { _cx, cssv, cssvSVGUrl } from "@src/lib/utility/stylings/classes";
import ContentText from "@server/commontemplates/ContentText";
import {
  CaretArrowDownIcon,
  CaretArrowUpIcon,
  CloseBtnIcon,
} from "@server/utility/IconSVGFile";
import type { ServerContentItemComponentProps } from "@lakshmanedupuganti/server-library";
import type {
  DataAttributes,
  HeaderFields,
  PageEntry,
  ButtonEntry,
} from "@src/lib/types";
import TopNavigation from "@server/layout/TopNavigation";
import Button from "@server/commontemplates/Button";
import DynamicLink from "./DynamicLink";
import Util from "@serverlib/utility";

const cx = _cx(css);

type HeaderProps = ServerContentItemComponentProps<HeaderFields>;

const Header = (props: HeaderProps) => {
  const { pageResult } = props;
  if (!pageResult) return null;

  const page = pageResult.items[0] as PageEntry;
  if (!page) return null;

  const { cookies } = pageResult;
  const promoBannerDismissed = cookies?.promoBannerDismissed === "true";

  const { header } = page.fields;

  if (!header) return null;

  const { topMessage, navDisplayType = "Default" } = header.fields;

  return (
    <>
      <div className={css.header}>
        {topMessage && (
          <div id="promo-banner" role="banner">
            <div
              className={cx("promoBanner", {
                "d-none": promoBannerDismissed,
              })}
            >
              <div className={cx("promoBannerText")}>
                <ContentText bodyContent={topMessage} />
              </div>
              {CloseBtnIcon({ color: "white" }) && (
                <div
                  className={css.promoBannerImage}
                  data-header-banner="hide-parent"
                  data-topnav-target="#collapseMenu"
                  style={{
                    backgroundImage: cssvSVGUrl(
                      CloseBtnIcon({ color: "white" }),
                    ),
                  }}
                ></div>
              )}
            </div>
          </div>
        )}
        <TopNavigation {...props} />
      </div>
    </>
  );
};

export default Header;

// helper function
export const HamburgerIcon = () => {
  return (
    <div id="toggleMenu" className={css.hamburger}>
      <div
        data-topnav-menu-toggle="toggleMenu"
        data-topnav-toggle-target="#collapseMenu"
      >
        {[...Array(4)].map((v, i) => {
          return (
            <span
              data-topnav-menu-toggle="toggleMenu"
              data-topnav-toggle-target="#collapseMenu"
              key={`${i}-${v}`}
            ></span>
          );
        })}
      </div>
    </div>
  );
};

type DropdownIconProps = {
  dataAttributes: DataAttributes;
  dataTopNavIconId: string;
};

export const DropdownIcon = ({
  dataAttributes,
  dataTopNavIconId,
}: DropdownIconProps) => (
  <div
    className={cx("mobile-icons")}
    {...dataAttributes}
    data-topnav-icon={dataTopNavIconId}
    data-topnav-icon-selected="false"
    style={cssv({
      arrowdown: cssvSVGUrl(CaretArrowDownIcon({})),
      arrowup: cssvSVGUrl(CaretArrowUpIcon({})),
    })}
  ></div>
);

export const ButtonGroup = ({ buttons }: { buttons: ButtonEntry[] }) => (
  <div className={css.buttonContainer}>
    {buttons.map((button, index) => {
      if (!button) return null;
      const { label, target = "", dataTrackingKey } = button.fields;
      return (
        <Button
          key={`${index + button.id}-${label}`}
          {...button.fields}
          className={cx(`navButton${index + 1}`)}
          target={target}
          dataTrackingKey={dataTrackingKey}
        >
          <span className={cx("buttonText")}>{label}</span>
        </Button>
      );
    })}
  </div>
);

type NavigationNodeLinkProps = {
  pageSlug: string;
  title: string;
  dataTrackingKey: string;
  target: string;
  dataTopNavIconId: string;
  showDropdown: boolean;
  level: number;
  className?: string;
  dataAttributes?: DataAttributes;
};

export const NavigationNodeLink = ({
  pageSlug,
  title,
  dataTrackingKey,
  target,
  dataAttributes = {},
  showDropdown,
  className,
  dataTopNavIconId,
  level = 0,
}: NavigationNodeLinkProps) => {
  const navTitle = Util.replaceWithSuperScript(title);

  const dataAttributesWithDefaults: DataAttributes = {
    ...dataAttributes,
    "data-nav-level": level,
    ...(showDropdown
      ? { "data-show-dropdown": false }
      : {
          "data-toggle-menu": true,
        }),
  };

  const mergedHTML = Util.applyDataAttributesToHTML(
    navTitle || "",
    dataAttributesWithDefaults,
  );
  return (
    <DynamicLink
      slug={pageSlug || ""}
      dataTrackingKey={dataTrackingKey}
      dataTealiumEvent={dataTrackingKey}
      target={target}
      className={className}
      dataAttributes={(dataAttributes as any) || {}}
      key={`${dataTrackingKey}-${title}-${level}`}
    >
      <span
        dangerouslySetInnerHTML={{ __html: mergedHTML || "" }}
        {...dataAttributesWithDefaults}
      ></span>
      {showDropdown && level <= 1 && (
        <DropdownIcon
          dataAttributes={dataAttributes}
          dataTopNavIconId={dataTopNavIconId}
        />
      )}
    </DynamicLink>
  );
};
