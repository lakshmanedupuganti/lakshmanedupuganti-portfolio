import {
  FooterEntry,
  FooterFields,
  NavigationEntry,
  PageEntry,
} from "@src/lib/types";
import css from "./FooterNavigation.module.scss";
import { _cx } from "@src/lib/utility/stylings/classes";
import { Col, Row } from "@server/utility/Bootstrap";
import DynamicLink from "@server/layout/DynamicLink";
import ResponsiveImage from "@client/utility/ResponsiveImage";
import Button from "@server/commontemplates/Button";
import type {
  AssetEntry,
  ServerContentItemComponentProps,
} from "@lakshmanedupuganti/server-library";
import Util from "@serverlib/utility";
import ClientComponentBridge, {
  environmentConfig,
} from "@server/utility/ClientComponentBridge";
import { emptyItem } from "@server/utility/ClientHandlerRoot";
import NavLogo from "@server/layout/NavLogo";

const cx = _cx(css);

type FooterNavigationProps = ServerContentItemComponentProps<FooterFields>;

const FooterNavigation = (props: FooterNavigationProps) => {
  const { item, renderContentItemComponent, pageResult } = props;
  const { desktopLogo, mobileLogo, footerNavigationRoot, buttons, contents } =
    item.fields;
  if (!pageResult) return null;
  const { localeId, site, items } = pageResult;
  const page = items[0] as PageEntry;
  const { disablePreFooterBanner } = page.fields;
  const navgationNodes = footerNavigationRoot?.fields.childNodes || [];
  const currentLocale = site.locales.find((l) => l.id === localeId);
  const logoUrl = currentLocale?.slugPrefix
    ? `/${currentLocale.slugPrefix}`
    : "/";

  return (
    <>
      {contents &&
        contents.length &&
        !disablePreFooterBanner &&
        contents.map((c) => {
          return renderContentItemComponent(c, props, c.id);
        })}

      <div className={cx("container", "wrapper")}>
        <Row>
          <Col lg={3} className="mb-4 mb-lg-0">
            <div className={cx("footer-logo")}>
              <NavLogo
                desktopLogo={desktopLogo}
                mobileLogo={mobileLogo}
                logoUrl={logoUrl}
                dataAttributes={{
                  role: "img",
                }}
              />
            </div>
          </Col>
          <Col lg={9} className="mt-5">
            <Row>
              {!!navgationNodes?.length && (
                <>
                  {navgationNodes.map((node, index) => {
                    const {
                      calculatedUrl,
                      title,
                      childNodes,
                      tealiumEvent,
                      linkTitle,
                      addIdToSlug,
                    } = node.fields;
                    if (!title && !linkTitle) return null;
                    const dataTrackingKey = Util.kebabCase(
                      tealiumEvent || title || linkTitle || "",
                    );
                    const pageSlug = Util.addIdToSlug(
                      calculatedUrl || "",
                      addIdToSlug,
                    );
                    const mergedHTML = Util.applyDataAttributesToHTML(
                      linkTitle || title || "",
                      {
                        "data-tracking-key": dataTrackingKey,
                        "data-tealium-event": dataTrackingKey,
                      },
                    );
                    return (
                      <Col xs={6} lg={3} key={index}>
                        <DynamicLink
                          slug={pageSlug || ""}
                          dataTrackingKey={dataTrackingKey}
                          dataTealiumEvent={dataTrackingKey}
                        >
                          <span
                            dangerouslySetInnerHTML={{
                              __html: mergedHTML || "",
                            }}
                            className={cx("footerLink1", "mt-5")}
                            data-tracking-key={dataTrackingKey}
                          />
                        </DynamicLink>

                        {childNodes?.map((childNode, idx) => {
                          const {
                            calculatedUrl,
                            title,
                            tealiumEvent,
                            linkTitle,
                            addIdToSlug,
                          } = childNode.fields;
                          if (!title && !linkTitle) return null;
                          const dataTrackingKey = Util.kebabCase(
                            tealiumEvent || title || linkTitle || "",
                          );
                          const pageSlug = Util.addIdToSlug(
                            calculatedUrl || "",
                            addIdToSlug,
                          );
                          return (
                            <DynamicLink
                              slug={pageSlug || ""}
                              key={idx}
                              dataTrackingKey={dataTrackingKey}
                              dataTealiumEvent={dataTrackingKey}
                              className={cx("footerLink2", "link")}
                            >
                              <span
                                dangerouslySetInnerHTML={{
                                  __html: linkTitle || title || "",
                                }}
                              />
                            </DynamicLink>
                          );
                        })}
                      </Col>
                    );
                  })}
                </>
              )}
              <Col xs={6} lg={3}>
                {!!buttons?.length && (
                  <div className={cx("buttonContainer")}>
                    {buttons.map((button, index) => {
                      if (!button) return null;
                      const { label, dataTrackingKey } = button.fields;
                      return (
                        <Button
                          key={index}
                          {...button.fields}
                          className={cx(`navButton${index + 1}`)}
                          dataTrackingKey={dataTrackingKey}
                        >
                          <span
                            className={cx("buttonText")}
                            dangerouslySetInnerHTML={{
                              __html: label || "",
                            }}
                          ></span>
                        </Button>
                      );
                    })}
                  </div>
                )}
              </Col>
              {environmentConfig?.RECAPTCHA_ACTIVE === "true" &&
                environmentConfig?.RECAPTCHA_ENTERPRISE_KEY && (
                  <Col xs={12} lg={12}>
                    <div
                      className={cx("recaptchaContainer")}
                      data-tracking-key="recaptcha"
                    >
                      <ClientComponentBridge
                        {...props}
                        item={emptyItem}
                        clientComponentType="RecaptchaClientScript"
                        itemExpandLogic="emptyitem"
                        env={environmentConfig}
                      />
                    </div>
                  </Col>
                )}
            </Row>
          </Col>
        </Row>
      </div>
      <BottomMobileFooter footer={item} />
    </>
  );
};

export default FooterNavigation;

interface BottomMobileFooterProps {
  footer: FooterEntry;
}

export const BottomMobileFooter = ({ footer }: BottomMobileFooterProps) => {
  const { copyright, language, countryFlag, bottomNavigationRoot } =
    footer.fields;
  const bottomNavNodes = bottomNavigationRoot?.fields.childNodes || [];

  return (
    <div className={cx("bottom-footer-wrapper")}>
      <div className={cx("container", "footer-section")}>
        <div className={css.copyright}>
          {copyright && (
            <p className="footerText1">{`© ${new Date().getFullYear()} ${copyright.trim()}`}</p>
          )}
        </div>
        <div className={cx("bottomNav")}>
          {bottomNavNodes.map((node, index) => {
            const { calculatedUrl, title, tealiumEvent, target, linkTitle } =
              node.fields;
            if (!title && !linkTitle) return null;
            const dataTrackingKey = Util.kebabCase(tealiumEvent || title || "");
            return (
              <div key={index}>
                <DynamicLink
                  slug={calculatedUrl || ""}
                  dataTrackingKey={dataTrackingKey}
                  dataTealiumEvent={dataTrackingKey}
                  target={target}
                >
                  <span
                    className={cx("footerText1")}
                    dangerouslySetInnerHTML={{
                      __html: linkTitle || title || "",
                    }}
                  />
                </DynamicLink>
              </div>
            );
          })}
        </div>
        <div className={cx("local-flag")}>
          {countryFlag && (
            <div className={cx("countryFlagContainer")}>
              <ResponsiveImage
                image={countryFlag}
                alt={countryFlag?.fields?.description || "country flag"}
                className={cx("countryFlag")}
              />
            </div>
          )}
          {language && (
            <DynamicLink
              slug="/choose-your-geography"
              dataTrackingKey="choose-your-geography"
              dataTealiumEvent="choose-your-geography"
            >
              <p className={cx("footerText1")}>{language}</p>
            </DynamicLink>
          )}
        </div>
      </div>
    </div>
  );
};

export const LocaleSelector = ({
  countryFlag,
  flagCode,
  language,
}: {
  countryFlag?: AssetEntry;
  flagCode?: string;
  language?: string;
}) => {
  return (
    <div className={css.localFlag}>
      {countryFlag && (
        <div className={cx("countryFlagContainer")}>
          <ResponsiveImage
            image={countryFlag}
            alt={countryFlag?.fields.description || "country flag"}
            className={css.countryFlag}
          />
        </div>
      )}
      {(flagCode || language) && (
        <DynamicLink
          slug="/choose-your-geography"
          className={cx("mobileNavigationLink3")}
          dataTealiumEvent="footer-choose-your-geography"
          dataTrackingKey="footer-choose-your-geography"
        >
          <span
            dangerouslySetInnerHTML={{ __html: flagCode || language || "" }}
          ></span>
        </DynamicLink>
      )}
    </div>
  );
};

type HeaderFooterNavigationProps = {
  footerNavItems: NavigationEntry[];
  countryFlag?: AssetEntry;
  flagCode?: string;
  language?: string;
};

export const HeaderFooterNavigation = ({
  footerNavItems,
  countryFlag,
  flagCode,
  language,
}: HeaderFooterNavigationProps) => (
  <div className={css.mobileFooterNavigation}>
    {footerNavItems.map((node, index) => {
      const {
        calculatedUrl = "",
        title,
        target = "",
        tealiumEvent,
        linkTitle,
      } = node.fields;
      // if (!calculatedUrl) return null;
      const dataTrackingKey = Util.kebabCase(tealiumEvent || title || "");
      return (
        <div
          className={cx("mobileNavigationLink3", "footerLink")}
          key={`footer_navigation_node_${title || linkTitle}_${index + 1}`}
        >
          <DynamicLink
            slug={calculatedUrl}
            className={cx("mobileNavigationLink3")}
            key={index}
            target={target}
            dataTrackingKey={dataTrackingKey}
            dataTealiumEvent={dataTrackingKey}
          >
            <span
              dangerouslySetInnerHTML={{ __html: linkTitle || title || "" }}
            />
          </DynamicLink>
        </div>
      );
    })}
    <LocaleSelector
      countryFlag={countryFlag}
      flagCode={flagCode}
      language={language}
    />
  </div>
);
