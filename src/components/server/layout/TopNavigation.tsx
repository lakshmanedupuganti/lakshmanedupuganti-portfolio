import css from "./TopNavigation.module.scss";
import { _cx } from "@src/lib/utility/stylings/classes";
import Util from "@serverlib/utility";
import type { ServerContentItemComponentProps } from "@lakshmanedupuganti/server-library";
import { HeaderFields, LocaleConfigEx, SiteConfigEx } from "@src/lib/types";
import NavLogo from "@server/layout/NavLogo";
import {
  HamburgerIcon,
  ButtonGroup,
  NavigationNodeLink,
} from "@server/layout/Header";
import { HeaderFooterNavigation } from "@server/layout/FooterNavigation";

const cx = _cx(css);

type TopNavigationProps = ServerContentItemComponentProps<HeaderFields>;

const TopNavigation = (props: TopNavigationProps) => {
  const { item, renderContentItemComponent, pageResult } = props;
  if (!pageResult) return null;

  const { localeId, site, items } = pageResult;

  const { footer } = items[0].fields;

  const {
    desktopLogo,
    mobileLogo,
    buttons,
    topNavigationRoot,
    footerNavigation,
  } = item.fields;

  const { bottomNavigationRoot, countryFlag, language } =
    footerNavigation?.fields || footer?.fields || {};
  const { flagCode, locales } = (site as SiteConfigEx) || {};
  const navgationNodes = topNavigationRoot?.fields.childNodes || [];
  console.log("item.fields", item.fields);
  const bottomNavgationNodes = bottomNavigationRoot?.fields.childNodes || [];

  const currentLocale = site.locales.find((l) => l.id === localeId);
  const logoUrl = currentLocale?.slugPrefix
    ? `/${currentLocale.slugPrefix}`
    : "/";

  return (
    <nav
      data-anchor="nav"
      className={cx(
        "navbar",
        "nav",
        "navbar-expand-lg",
        "navbar-light",
        "bg-white",
      )}
    >
      <div className={cx("navbar-brand", "top-navigation-logo")}>
        <NavLogo
          desktopLogo={desktopLogo}
          mobileLogo={mobileLogo}
          logoUrl={logoUrl}
        />
      </div>
      <div id="collapseMenu" className={css.navContainer}>
        {!!navgationNodes?.length && (
          <>
            <div className={css.mainNav}>
              {navgationNodes.map((node, index) => {
                const {
                  calculatedUrl,
                  title,
                  childNodes,
                  tealiumEvent,
                  target = "",
                  linkTitle,
                  addIdToSlug,
                } = node.fields;
                if (!title && !linkTitle) return null;
                const dataTrackingKey = Util.kebabCase(
                  tealiumEvent || title || "",
                );
                const hasChildren = Util.hasChildNodes(node.fields);
                const dataAttributes: Record<string, string> = {
                  "data-topnav-dropdown": hasChildren ? "true" : "false",
                  id: `dropdown-menu${index + 1}`,
                  "data-tracking-key": dataTrackingKey,
                };

                if (!hasChildren) {
                  if (addIdToSlug) {
                    dataAttributes["data-nav-anchor-item"] = "true";
                    dataAttributes["data-anchor-link"] = "true";
                  } else {
                    dataAttributes["data-nav-item"] = "true";
                  }
                }

                const pageSlug = addIdToSlug
                  ? `#${Util.kebabCase(title || linkTitle || "")}`
                  : Util.addIdToSlug(calculatedUrl || "", addIdToSlug);

                console.log("node.fields", pageSlug);
                return (
                  <div
                    className={cx("main-menu")}
                    key={`navigation_node_${title || linkTitle}_${index + 1}`}
                  >
                    <div
                      className={cx("main-item", "navigationLink1", {
                        hasChild: hasChildren,
                      })}
                    >
                      <NavigationNodeLink
                        pageSlug={pageSlug || ""}
                        title={linkTitle || title || ""}
                        dataTrackingKey={dataTrackingKey}
                        target={target}
                        dataAttributes={dataAttributes}
                        showDropdown={hasChildren}
                        dataTopNavIconId={`dropdown-menu${index + 1}`}
                        level={1}
                      />
                    </div>
                    {hasChildren && childNodes && (
                      <div
                        aria-labelledby={`dropdown-menu${index + 1}`}
                        className={cx("dropdown-menu")}
                        data-topnav-dropdown-selected="false"
                      >
                        {childNodes.map((childNode, index) => {
                          const {
                            calculatedUrl,
                            title,
                            tealiumEvent,
                            target = "",
                            linkTitle,
                            addIdToSlug,
                            childNodes,
                          } = childNode.fields;
                          if (!calculatedUrl) return null;
                          const dataTrackingKey = Util.kebabCase(
                            tealiumEvent || title || "",
                          );

                          const pageSlug = Util.addIdToSlug(
                            calculatedUrl,
                            addIdToSlug,
                          );

                          const dataAttributes: Record<string, string> = {};
                          if (!addIdToSlug) {
                            dataAttributes["data-nav-item"] = "true";
                          }

                          if (addIdToSlug) {
                            dataAttributes["data-nav-anchor-item"] = "true";
                          }

                          return (
                            <NavigationNodeLink
                              key={`navigation_node_child_${title || linkTitle}_${index + 1}`}
                              pageSlug={pageSlug || ""}
                              title={linkTitle || title || ""}
                              dataTrackingKey={dataTrackingKey}
                              className={cx("dropdown-item", "navigationLink2")}
                              target={target}
                              showDropdown={false}
                              dataTopNavIconId={`dropdown-menu${index + 1}`}
                              level={index + 1}
                              dataAttributes={dataAttributes}
                            />
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}

        <div className={css.sideSection}>
          <div className={cx("sideSectionInner")}>
            <div className={cx("localeContainer")}>
              {(locales as LocaleConfigEx[])
                .filter((v) => v.id !== localeId)
                .map((v) => (
                  <a
                    key={v.id}
                    href={`/${(v.slugPrefix || "").split("/").filter(Boolean).join("/")}`}
                    className={cx("navigationLink2", "footerText1")}
                  >
                    {v.language}
                  </a>
                ))}
            </div>
            {!!buttons?.length && <ButtonGroup buttons={buttons} />}
          </div>

          {!!bottomNavgationNodes?.length && (
            <HeaderFooterNavigation
              footerNavItems={bottomNavgationNodes}
              countryFlag={countryFlag}
              flagCode={flagCode}
              language={language}
            />
          )}
        </div>
      </div>
      <HamburgerIcon />
    </nav>
  );
};

export default TopNavigation;
