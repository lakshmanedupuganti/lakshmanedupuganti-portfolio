import "server-only";

import { ContentFields, DocumentEx } from "@src/lib/types";
import HeaderText from "@server/commontemplates/HeaderText";
import ContentText from "@server/commontemplates/ContentText";
import CTAList from "@server/commontemplates/CTAList";
import {
  _cx,
  cssv,
  cssvBkgColor,
  csx,
} from "@src/lib/utility/stylings/classes";
import css from "./HeroArea.module.scss";
import { Col, Row } from "@server/utility/Bootstrap";
import Util from "@serverlib/utility";
import type {
  AssetEntry,
  ServerContentItemComponentProps,
} from "@lakshmanedupuganti/server-library";
import RenderImage, {
  RenderAssetContainerProps,
} from "@server/commontemplates/RenderImage";
import DynamicLink from "../layout/DynamicLink";

const cx = _cx(css);

type SkillPosition = "left" | "right" | "center";

interface FloatingSkill {
  label: string;
  SkillPosition: SkillPosition;
  icon: AssetEntry;
}

interface SocialConnect {
  content: DocumentEx;
  socialLinks?: SocialLink[];
}

interface SocialLink {
  socialLinkUrl: string;
  icon: AssetEntry;
}

export type HeroAreaProps = ServerContentItemComponentProps<
  ContentFields & {
    custom?: {
      floatingSkills?: FloatingSkill[];
      socialConnect?: SocialConnect;
      mobileImagePosition?: "top" | "bottom";
    };
  }
>;

/** Vertical offset base (%) per column; staggered by index within column. */
const FLOATING_SKILL_TOP_BY_COLUMN: Record<Exclude<SkillPosition, "center">, number> =
  {
    left: 22,
    right: 10,
  };

const FLOATING_SKILL_TOP_CENTER_BASE = 18;
const FLOATING_SKILL_TOP_STEP = 28;
const FLOATING_SKILL_DELAY_STEP_S = 0.5;
const FLOATING_SKILL_TRANSLATE_BASE_PX = 10;
const FLOATING_SKILL_TRANSLATE_STEP_PX = 2;

function partitionFloatingSkills(
  skills: FloatingSkill[],
): Record<SkillPosition, FloatingSkill[]> {
  const empty: Record<SkillPosition, FloatingSkill[]> = {
    left: [],
    right: [],
    center: [],
  };
  for (const skill of skills) {
    const column = skill.SkillPosition;
    if (
      column === "left" ||
      column === "right" ||
      column === "center"
    ) {
      empty[column].push(skill);
    }
  }
  return empty;
}

function floatingSkillStyleVars(index: number) {
  return cssv({
    translateY: `${FLOATING_SKILL_TRANSLATE_BASE_PX + index * FLOATING_SKILL_TRANSLATE_STEP_PX}px`,
    animationDelay: `${index * FLOATING_SKILL_DELAY_STEP_S}s`,
  });
}

function floatingHostTopStyle(position: SkillPosition, index: number) {
  const topPct =
    position === "center"
      ? FLOATING_SKILL_TOP_CENTER_BASE + index * FLOATING_SKILL_TOP_STEP
      : FLOATING_SKILL_TOP_BY_COLUMN[position] + index * FLOATING_SKILL_TOP_STEP;
  return cssv({ top: `${topPct}%` });
}

function alignClassForPosition(position: SkillPosition): string {
  switch (position) {
    case "left":
      return "alignLeft";
    case "right":
      return "alignRight";
    case "center":
      return "alignCenter";
    default: {
      const _exhaustive: never = position;
      return _exhaustive;
    }
  }
}

function FloatingSkillsLayer({
  skills,
}: {
  skills: FloatingSkill[];
}) {
  const grouped = partitionFloatingSkills(skills);

  const renderChip = (skill: FloatingSkill, index: number) => {
    const { label, icon, SkillPosition: position } = skill;
    const key = `${position}-${index}-${label}`;

    const chip = (
      <div className={cx("floatingSkill")} style={floatingSkillStyleVars(index)}>
        {position === "right" ? (
          <>
            <div className={cx("floatingSkillLabel")}>{label}</div>
            <div className={cx("floatingSkillIcon")}>
              <RenderImage image={[icon]} />
            </div>
          </>
        ) : (
          <>
            <div className={cx("floatingSkillIcon")}>
              <RenderImage image={[icon]} />
            </div>
            <div className={cx("floatingSkillLabel")}>{label}</div>
          </>
        )}
      </div>
    );

    return (
      <div
        key={key}
        className={cx("floatingSkillHost", alignClassForPosition(position))}
        style={floatingHostTopStyle(position, index)}
      >
        {chip}
      </div>
    );
  };

  return (
    <div className={cx("floatingSkills")}>
      {grouped.left.map((skill, i) => renderChip(skill, i))}
      {grouped.center.map((skill, i) => renderChip(skill, i))}
      {grouped.right.map((skill, i) => renderChip(skill, i))}
    </div>
  );
}

function HeroSocialConnect({
  content,
  socialLinks,
}: SocialConnect) {
  return (
    <div className={cx("socialConnect")}>
      {content && (
        <div className={cx("socialConnectContent")}>
          <ContentText bodyContent={content} />
        </div>
      )}
      {socialLinks?.length ? (
        <ul className={cx("socialConnectLinks")}>
          {socialLinks.map((social) => (
            <li key={social.socialLinkUrl} className={cx("socialConnectLink")}>
              <DynamicLink slug={social.socialLinkUrl} target="_blank">
                <RenderImage image={[social.icon]} />
              </DynamicLink>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function HeroAssetContainers({
  props,
  floatingSkills,
  clientId,
}: {
  props: HeroAreaProps;
  floatingSkills: FloatingSkill[] | undefined;
  clientId: string;
}) {
  const renderAssetPane = (
    visibilityClass: string,
    idType: "Mobile" | "Desktop",
  ) => (
    <div
      className={cx("assetContainer", visibilityClass)}
      {...Util.renderContentfulDataAttributes(clientId, "image")}
    >
      <div className={cx("assetContainerInner")}>
        <RenderAssetContainerProps {...props} idType={idType} />
      </div>
      {floatingSkills?.length ? (
        <FloatingSkillsLayer skills={floatingSkills} />
      ) : null}
    </div>
  );

  return (
    <>
      {renderAssetPane("show-on-desktop", "Desktop")}
      {renderAssetPane("show-on-mobile", "Mobile")}
    </>
  );
}

const HeroArea = (props: HeroAreaProps) => {
  const { item } = props;
  const { textContent, buttons, custom, backgroundColor } = item.fields;
  const { bodyContent } = textContent || {};
  const {
    floatingSkills,
    socialConnect,
    mobileImagePosition = "bottom",
  } = custom || {};

  const { startH, clientId = item.id, fnIdToNumber } = item.calculated || {};
  const editorialClientId = clientId ?? "";

  return (
    <div
      className={csx(css, "wrapper")}
      style={cssv({
        backgroundColor: cssvBkgColor(backgroundColor || "white"),
      })}
    >
      <Row
        className={cx("mainSection", {
          mobileImageBottom: mobileImagePosition === "bottom",
        })}
      >
        <Col md={6} lg={6} xl={6} sm={12} className={cx("textContainer")}>
          <div
            className={cx("textContainerInner")}
            {...Util.renderContentfulDataAttributes(
              editorialClientId,
              "textContent",
            )}
          >
            {textContent ? (
              <HeaderText
                startH={startH}
                textContent={textContent}
                useHeroTitles={true}
                fnNumbers={fnIdToNumber}
              />
            ) : null}
            <div className={cx("bodyContent")}>
              {bodyContent ? (
                <ContentText
                  bodyContent={bodyContent}
                  fnNumbers={fnIdToNumber}
                />
              ) : null}
            </div>
            {buttons ? (
              <div
                className={cx("ctaContainer")}
                {...Util.renderContentfulDataAttributes(
                  editorialClientId,
                  "buttons",
                )}
              >
                <CTAList buttons={buttons} />
              </div>
            ) : null}
            {socialConnect ? (
              <HeroSocialConnect
                content={socialConnect.content}
                socialLinks={socialConnect.socialLinks}
              />
            ) : null}
          </div>
        </Col>
        <Col md={6} lg={6} xl={6} sm={12}>
          <HeroAssetContainers
            props={props}
            floatingSkills={floatingSkills}
            clientId={editorialClientId}
          />
        </Col>
      </Row>
    </div>
  );
};

export default HeroArea;
