import type {
  SiteConfig,
  LocaleConfig,
  EntryEx,
  DefaultInternalEntryFields,
  ContentCalculatedFields,
  AssetEntry,
  ServerContentItemComponentProps,
  ClassOrFuncComponent,
  ContentEntry,
  ContentfulPageAdditionalEntriesHelper,
  ContentfulPageResult,
  ContentfulPageResultBase,
  ContentfulPageServiceOptions,
  ETLEntryQueryResult,
} from "@lakshmanedupuganti/server-library";
import { Document } from "@contentful/rich-text-types";

declare global {
  interface Window {
    [prop: string]: any;
    dataLayer?: Array<PageViewData | Record<string, any>>;
  }
  interface HTMLElement {
    eventname?: string;
    __html?: string;
  }
}

export interface PageViewData {
  event: string;
  pageUrl: string;
  pageTitle: string;
  previousUrl: string;
}

export interface Dictionary<T = any> {
  [key: string]: T;
}

export interface DeviceSupportInfo {
  supportsWebp?: boolean;
  isIOS?: boolean;
}

export type AppPageProps = {
  params: Promise<{ slug?: string[] } & Record<string, string[] | undefined>>;
  searchParams: Promise<{ slug?: string } & Record<string, string | undefined>>;
};

export type DataAttributes = Record<string, string | number | boolean>;

export type LocaleConfigEx = LocaleConfig & {
  defaultHtmlLang?: string;
  defaultTrustArcLang?: string;
  defaultTrustArcCountry?: string;
  gtmKey?: string;
  gtmDomain?: string;
  optimizelyKey?: string;
  hotjarKey?: string;
  language?: string;
  privacyPolicySlug?: string;
};

export type SiteConfigEx = SiteConfig & {
  flagCode?: string;
  locales: LocaleConfigEx[];
  localRegion?: string;
  googleKey?: string;
  facebookKey?: string;
  gtmKey?: string;
  gtmKey2?: string;
  gtmDomain?: string;
  optimizelyKey?: string;
  hotjarKey?: string;
  evergageEnabled?: boolean;
  defaultTrustArcCountry?: string;
};

export type ServerContentItemProps = ServerContentItemComponentProps;

export interface PageFields {
  title?: string;
  slug?: string;
  htmlTitle?: string;
  description?: string;
  keywords?: string;
  type?: string;
  contents?: ContentEntry[];
  custom?: {
    pageContent?: string;
  };
  seoMetadata?: ContentEntry<SEOMetadataFields>;
  footnotes?: FootnoteEntry[];
  genericFootnotes?: FootnoteEntry[];
  header?: HeaderEntry;
  footer?: FooterEntry;
  disablePreFooterBanner?: boolean;
  disableNavigation?: boolean;
  popups?: PopupEntry[];
}

export type SEOMetadataFields = {
  twitterCardType?: string;
  twitterDescription?: string;
  twitterTitle?: string;
  twitterImage?: AssetEntry;
  openGraphTitle?: string;
  openGraphDescription?: string;
  openGraphImage?: AssetEntry;
  canonicalTagUrl?: string;
  robotsMetaTag?: string[];
  excludeInSitemap?: boolean;
  jsonLd?: {
    contactPoint?: Record<string, string>;
    customSchemaScript?: string;
  };
};

export interface FootnoteFields {
  title?: string;
  claim?: Document;
}

export type PageEntry = ContentEntry<PageFields>;
export type FootnoteEntry = EntryEx<FootnoteFields>;

export interface BaseContentEntryFields {
  title?: string;
  template?: string;
  contents?: MixedContentEntry[];
  custom?: Record<string, any>;
  fluid?: boolean;
  inactive?: boolean;
  anchor?: string;
}
export interface TextContent {
  eyebrow?: Document;
  headline?: Document;
  bodyContent?: Document;
  subheadline?: Document;
}

export interface ContentFields extends BaseContentEntryFields {
  textContent?: TextContent;
  video?: AssetEntry[];
  videoUrl?: string[];
  image?: AssetEntry[];
  buttons?: ButtonEntry[];
  backgroundColor?: string;
  question?: Document;
  answer?: Document;
}

export interface ButtonFields {
  variant?:
    | "primary"
    | "secondary"
    | "primary-heritage-blue"
    | "secondary-for-dark-bg"
    | "transparent"
    | "transparent-blue"
    | "image"
    | "circle"
    | "link";
  color?: string;
  label?: string;
  image?: AssetEntry;
  calculatedUrl?: string; // will be resolved in the ETL phase from the pageLink ref field, downloadOrPlayVideo etc.
  url?: string;
  otherLinks?: string;
  target?: string;
  dataTrackingKey?: string;
  showOnlyOn?: "show-on-desktop" | "show-on-mobile";
  noFollow?: boolean;
  buttonIcon?: AssetEntry;

  $minWidth?: string;
  $minWidthMobile?: string;
  disabled?: boolean;
  size?: "md" | "sm" | "header-footer";
  align?: "left" | "center" | "right"; // TOOD - add in Contentful if needed, otherwise remove
  entryId?: string;
  // calculated in the ETL phase
  isDownload?: boolean;
  isVideo?: boolean;
  dataAttributes?: Record<string, string>;
  popup?: PopupEntry;
}

export interface ContainerHeadingCardsCtaFields extends BaseContentEntryFields {
  backgroundColor?: string;
  textContent?: TextContent;
  buttons?: ButtonEntry[];
  image?: AssetEntry[];
}

export interface ContainerCaseStudiesFields extends BaseContentEntryFields {
  backgroundColor?: string;
  textContent?: TextContent;
  buttons?: ButtonEntry[];
  custom?: {
    disclaimer?: Document;
  };
}

export interface FaqsFields extends BaseContentEntryFields {
  backgroundColor?: string;
  textContent?: TextContent;
  buttons?: ButtonEntry[];
}

export interface ContainerAnchorLinkFields extends BaseContentEntryFields {
  textContent?: TextContent;
  buttons?: ButtonEntry[];
  image?: AssetEntry[];
  custom?: {
    links?: {
      headline?: Document;
      image: AssetEntry[];
      navAnchorId?: string;
    }[];
  };
}

export interface ContainerAccordionFields extends BaseContentEntryFields {
  backgroundColor?: string;
  textContent?: TextContent;
  buttons?: ButtonEntry[];
  image?: AssetEntry[];
  staticImage?: AssetEntry;
}

export interface ContainerTabsFields extends BaseContentEntryFields {
  textContent?: TextContent;
  buttons?: ButtonEntry[];
  custom?: {
    tabTitles?: string[];
    tabs?: {
      label: string;
      navAnchorId?: string;
    }[];
  };
}

export interface ContainerStageProps {
  headline?: Document;
  bodyContent?: Document;
  image: AssetEntry[];
  iconName?: string;
}

export interface ContainerStageTabsFields extends BaseContentEntryFields {
  textContent?: TextContent;
  custom?: {
    stages?: ContainerStageProps[];
  };
}

export interface ContainerSelectableTabsFields extends BaseContentEntryFields {
  textContent?: TextContent;
  custom?: {
    backgroundColor?: string;
    enableHashSelection?: boolean;
    tabDropdown: {
      title?: string;
      defaultValue?: string;
      options: FieldOptions[];
    };
  };
}

export interface ContainerOnlyTextFields extends BaseContentEntryFields {
  textContent?: TextContent;
  image?: AssetEntry[];
}

export interface FormContainerFields extends BaseContentEntryFields {
  successMessage?: MixedContentEntry<ContentFields & FormItemFields>[];
}

export type RangeValidation = { min?: number; max?: number };

export interface FieldValidationType {
  type:
    | "required"
    | "email"
    | "regex"
    | "optional"
    | "options"
    | "range"
    | "EU_VATNumber"
    | "EU_PostalCode"
    | "EU_ProvinceAbbreviation"
    | "Country_Based_Regex"
    | "combined";
  fieldNames?: string[];
  regex?: string;
  range?: RangeValidation;
  countryBasedRegex?: Record<string, string>;
}

export type FieldOptions = {
  value: string;
  label: string;
};

// Base interface for shared field properties
export interface BaseFieldDef {
  fieldName: string;
  label?: string;
  type?:
    | "text"
    | "textarea"
    | "select"
    | "checkbox"
    | "hidden"
    | "date"
    | "checkboxGroup"
    | "radioboxGroup";
  col?: number;
  defaultValue?: string;
  tooltip?: string;
  placeholder?: string;
}
// Extended interface for CustomFieldDef
export interface CustomFieldDef extends BaseFieldDef {
  options?: FieldOptions[];
  otherFieldOptions?: {
    options?: FieldOptions[];
    selectedValue?: string;
  };
  validations?: FieldValidationType[];
  masking?: {
    mask?: string;
    pattern?: string;
    uppercase?: string;
  };
  otherSettings?: OtherFieldSettings;
  doNotPost?: boolean;
  fieldDisabled?: boolean;
}
// Extended interface for FormFields with shared properties from BaseFieldDef
export interface FormFields extends Omit<BaseFieldDef, "options"> {
  fieldOptions?: {
    options?: FieldOptions[];
    selectedValue?: string;
  };
  moreFields?: OtherFieldSettings;
  fieldValidation?: {
    validations?: FieldValidationType[];
  };
  fieldMasking?: {
    masking?: {
      mask?: string;
      pattern?: string;
      uppercase?: string;
    };
  };
  doNotPost?: boolean;
  multiline?: number;
}

export interface FormGroupFields extends BaseContentEntryFields {
  textContent?: TextContent;
  formFields?: MixedContentEntry<FormFields>[];
  moreFields?: FormGroupMoreFields;
}

export interface FormGroupMoreFields {
  showFieldOn: ShowFieldOn[];
}

export interface ShowFieldOn {
  fieldName?: string;
  value?: string;
  cookieName?: string;
}

export interface OtherFieldSettings {
  optionLabel?: string;
  autosetValue?: AutosetValueFields;
  autoSetDefaultValues?: boolean;
  tooltip?: string;
  setAutoPhonePrefix?: boolean;
  showFieldOn: ShowFieldOn[];
  placeholder?: string;
  countryLocalizedLabels?: Record<string, string>;
  disabled?: boolean;
}

export interface AutosetValueFields {
  sourceType?: "Cookie" | "URLSearchParams" | "Values" | "GeoData";
  sourceKey?: string;
  matchValue?: string;
  valueIfMatch?: string;
  valueIfNoMatch?: string;
}

export interface FormItemFields extends BaseContentEntryFields {
  leadService?: "GLOBAL" | "EU" | "APAC" | "NPJ";
  successMessage?: MixedContentEntry<ContentFields & FormItemFields>[];
  errorMessage?: TextContent;
  formFields?: MixedContentEntry<FormGroupFields>[];
  leadSource?: string;
  subLeadSource?: string;
  custom?: {
    fields?: CustomFieldDef[];
    languageData?: Record<string, string>;
    formType?: string;
    campaignId?: string;
    additionalCampaignId?: string;
    leadOwnerId?: string;
    recordtypeid?: string;
    redirectSlugOnSuccess?: string;
    hideDevPanel?: boolean;
    displayFieldErrors?: boolean;
    successTrackingConfig?: SuccessTrackingConfig;
    calendly?: CalendlyFields;
  };
}

export interface CalendlyFields {
  calendlyUrl: string;
  calendlyType: "Inline embed" | "Popup widget";
  calendlyBtnLabel?: string;
  calendlyFields?: Record<string, string>;
  calendlyCustomFields?: Record<string, string>;
}

export interface SuccessTrackingConfig {
  eventName: string;
  additionalData?: Record<string, any>;
  fieldsToHash?: string[];
  fieldMappings?: Record<string, string>;
}

export interface EventSpeakerFields {
  name?: string;
  image?: AssetEntry[];
  speakerContent?: {
    typeOfSpeaker?: string;
    designation?: string;
    shortDescription?: Document;
    description?: Document;
  };
  custom?: Record<string, any>;
  buttons?: ButtonEntry[];
}

export interface EventFieldsBase extends ContentFields {
  category?:
    | "Align Events"
    | "Certification Training"
    | "Staff Training Days"
    | "Foundation Program"
    | "Electronic"
    | "Master Classes"
    | "Third Party Events";
  htmlTitle?: string;
  description?: string;
  keywords?: string;
  seoMetadata?: ContentEntry<SEOMetadataFields>;
  cardImage?: AssetEntry;
  eventLogo?: AssetEntry[];
  startDate?: string;
  endDate?: string;
  typeOfEvent?: string;
  custom?: {
    format?: string[];
    audience?: string[];
    language?: string[];
    country?: string[];
    tier?: string[];
    location?: string;
    registrationSlug?: string;
    heroBackgroundColor?: string;
  };
  speakers?: EventSpeakerEntry[];
  button?: ButtonEntry;
}

export interface ClientEventFieldsBase {
  category?:
    | "Align Events"
    | "Certification Training"
    | "Staff Training Days"
    | "Foundation Program"
    | "Electronic"
    | "Master Classes"
    | "Third Party Events";
  cardImage: AssetEntry;
  startDate: string;
  endDate: string;
  format: string[];
  audience: string[];
  language: string[];
  country: string[];
  tier: string[];
  location: string;
  dateRange?: string;
  monthRange?: string[];
  eventDetails: {
    label: string;
    value: string | string[];
    show: boolean;
  }[];
  eventType: string;
  formattedDate: string;
  speakers: (EventSpeakerEntry | EventSpeaker | string)[];
  title: string;
  eventPageSlug: string;
}

export interface FilterType {
  filterType?: string;
  filterOptions?: {
    filterValue?: string;
    filterLabel?: string;
  }[];
  defaultValue?: string;
  expandFilter?: boolean;
}

export interface EventListBase extends ContentFields {
  custom?: {
    eventDetailFields?: string[];
    filters?: FilterType[];
    defaultEventCardImage?: AssetEntry[];
    languageData?: Record<string, string>;
    disableStickyFilters?: "Desktop" | "Mobile" | "Both" | "None";
    syncFiltersWithUrl?: boolean;
  };
  clientEvents?: ClientEventEntry[];
  events?: EventEntry[];
  additionalEvents?: CertificationEvent[];
  source?:
    | "CONTENTFUL"
    | "ELECTRONIC"
    | "MASTERCLASSES"
    | "COMPLETED"
    | "TRAINING COURSES"
    | "COMPLETE"
    | "DEFAULT";
}

export type EventSpeakerEntry = EntryEx<EventSpeakerFields>;
export type EventEntry = EntryEx<EventFieldsBase>;
export type ClientEventEntry = EntryEx<ClientEventFieldsBase>;
export type EventEntryFields = EventListBase;

export interface ContainerEventDetailsFields extends BaseContentEntryFields {
  event?: EventEntry[];
  additionalEvents?: CertificationEvent[];
  notFoundEvent?: MixedContentEntry[];
  sfdcOverviewContents?: MixedContentEntry[];
  form?: MixedContentEntry;
  image?: AssetEntry[];
  custom?: {
    hideNonProviderForm?: boolean;
    languageData?: Record<string, string>;
  };
}

export interface NavigationFields {
  title?: string;
  linkTitle?: string;
  customUrl?: string;
  addIdToSlug?: string;
  childNodes?: NavigationEntry[];
  pageSlug?: string;
  pageTitle?: string;
  calculatedUrl?: string;
  tealiumEvent?: string | null;
  target?: string;
}

export interface HeaderFields {
  desktopLogo?: AssetEntry;
  mobileLogo?: AssetEntry;
  navDisplayType?: "Default" | "MegaMenu";
  topNavigationRoot?: NavigationEntry;
  buttons?: ButtonEntry[];
  links?: ButtonEntry[];
  topMessage?: Document;
  footerNavigation?: EntryEx<FooterFields>;
}
export interface FooterFields {
  desktopLogo?: AssetEntry;
  mobileLogo?: AssetEntry;
  navDisplayType?: "Default" | "MegaMenu";
  bottomNavigationRoot?: NavigationEntry;
  footerNavigationRoot?: NavigationEntry;
  buttons?: ButtonEntry[];
  copyright?: string;
  language?: string;
  countryFlag?: AssetEntry;
  contents?: MixedContentEntry[];
}

export interface PopupEntryFields extends ContentFields {
  template?: string;
  custom?: {
    fromEntry?: MixedContentEntry<ContentFields & FormItemFields>;
    borderRadius?: number;
  };
}

export type NavigationEntry = EntryEx<NavigationFields>;
export type HeaderEntry = ContentEntry<HeaderFields>;
export type FooterEntry = ContentEntry<FooterFields>;
export type PopupEntry = ContentEntry<PopupEntryFields>;

export type ButtonEntry = EntryEx<ButtonFields>;

export type MixedContentEntry<
  T extends DefaultInternalEntryFields = ContentFields,
  C extends ContentCalculatedFields = ContentCalculatedFields,
> = EntryEx<T, ContentCalculatedFields>;

export type ContentfulPageGetAdditionalEntriesFuncEX = {
  (
    pageResult: Readonly<ContentfulPageResult>,
    pageData: ETLEntryQueryResult,
    helper: ContentfulPageAdditionalEntriesHelper,
    pageServiceOptions: ContentfulPageServiceOptions,
  ): Promise<ContentfulPageResultBase>;
};

export interface CertificationEventsConfig {
  language: string | null;
  isIGo: boolean;
  label: string | null;
}

export type ContentfulDataAttributes = {
  "data-contentful-field-id": string;
  "data-contentful-entry-id": string;
  "data-contentful-asset-id": string;
};

export interface SliderProperties {
  sliderBtnText?: string;
  beforeText?: string;
  afterText?: string;
}

export type DocumentEx = Document;

export type ClassNamesBaseType =
  | string
  | Record<string, boolean | undefined | null>
  | undefined
  | null
  | false;

export type ClientContentItemComponentProps<
  T extends DefaultInternalEntryFields = DefaultInternalEntryFields,
> = Omit<
  ServerContentItemComponentProps<T>,
  "renderContentItemComponent" | "helpers"
> & {
  env?: NamedEnvMap;
};

export type ClientContentItemComponent<
  T extends ClientContentItemComponentProps = ClientContentItemComponentProps,
> = ClassOrFuncComponent<T>;

export type DocumentState = "interactive" | "complete";

export type IntersectParams = {
  rootMargin: string;
  disabled: boolean;
  documentState: DocumentState;
  delayMilliseconds: number;
};

export interface NamedEnvMap {
  GENERAL_ENABLE_TRUSTARC?: string;
  TRUSTARC_BEHAVIOR?: string;
  TRUSTARC_PERAMETERS?: string;
  RELOAD_ON_TRUSTARC_ACTION?: string;
  GENERAL_RECAPTCHA_DELAYED?: string;
  RECAPTCHA_DELAYED_EXCLUDE_SLUG_REGEX?: string;
  EMEA_RECAPTCHA_V2_PUBLIC_KEY?: string;
  EMEA_RECAPTCHA_V3_PUBLIC_KEY?: string;
  RECAPTCHA_ENTERPRISE_KEY?: string;
  CLIENT_API_PREFIX?: string;
  RECAPTCHA_ACTIVE?: string;
  USE_DEVELOPMENT_PANEL?: boolean;
}

export interface WebPageSchema {
  "@context": "https://schema.org";
  "@type": "WebPage";
  mainEntityOfPage: {
    "@type": "WebPage";
    "@id": string;
  };
  headline: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  author: {
    "@type": "Organization";
    name: string;
  };
  publisher: {
    "@type": "Organization";
    name: string;
    logo: {
      "@type": "ImageObject";
      url: string;
    };
  };
  image: {
    "@type": "ImageObject";
    url: string;
  };
}

export interface ImageGallerySchema {
  "@context": "https://schema.org";
  "@type": "ImageGallery";
  name: string;
  url: string;
  hasPart: ImageObject[];
}

export interface ImageObject {
  "@type": "ImageObject";
  url: string;
  description: string;
  height: number;
  width: number;
}

export interface SiteNavigationElement {
  "@context": "https://schema.org";
  "@type": "SiteNavigationElement";
  name: string;
  url: string;
  hasPart?: SiteNavigationElementPart[];
  mainEntity?: SiteNavigationElementPart[];
}

export interface SiteNavigationElementPart {
  "@type": "SiteNavigationElement";
  name: string;
  url: string;
}

export interface FAQSchema {
  "@type": "Question";
  name: string;
  acceptedAnswer: {
    "@type": "Answer";
    text: string;
  };
}

export interface FAQPageSchema {
  "@context": "https://schema.org";
  "@type": "FAQPage";
  name: string;
  url: string;
  mainEntity: FAQSchema[];
}

export interface HomeFAQPageSchema {
  "@context": "https://schema.org";
  "@graph": [
    {
      "@type": "MedicalOrganization";
      MedicalSpecialty: "Dentistry";
      name: string;
      url: string;
      logo: string;
      contactPoint: Record<string, string>;
    },
    {
      "@type": string;
      mainEntity: FAQSchema[];
    },
  ];
}

export interface ItemListElement {
  "@type": "ListItem";
  position: number;
  name: string;
  description: string;
}
export interface AnchorLinksAccordianSchema {
  "@context": "https://schema.org";
  "@type": "ItemList";
  url: string;
  itemListElement: ItemListElement[];
}

export interface EventSpeaker {
  BioSections: string | null;
  DID: string | null;
  Description: string | null;
  EmailPicture: string | null;
  Id: string;
  Language: string | null;
  LongDescription: string | null;
  Name: string | null;
}

export interface CertificationEvent {
  Agenda: string | null;
  CampaignHours: string | null;
  Country: string | null;
  Date: string | null;
  DateLocation: string | null;
  Description: string | null;
  DoctorType: string | null;
  EndTime: string | null;
  FullyBooked: boolean | null;
  HoursDuration: string | null;
  Id: string;
  Language: string | null;
  Location: string | null;
  LongDescription: string | null;
  Name: string | null;
  ProgramName: string | null;
  Speaker: string | null;
  Speakers: EventSpeaker[] | null;
  StartTime: string | null;
  Title: string | null;
  VenueAddress: string | null;
  VenueCity: string | null;
  VenueLatitude: number | null;
  VenueLongitude: number | null;
  VenueName: string | null;
  VenuePostcode: string | null;
  Day2Date: string | null;
  CampaignMemberAllowed?: string | null;
  EventType?: string | null;
}

export interface UTMParams {
  lead_url_campaign__c?: string;
  lead_url_medium__c?: string;
  lead_url_source__c?: string;
  lead_url_content__c?: string;
  lead_url_term__c?: string;
}

// export interface EULeadRegisterInput {
//   FirstName?: string;
//   LastName?: string;
//   Title?: string;
//   Email?: string;
//   PracticeName?: string;
//   PracticeType?: string;
//   Experience?: string;
//   Ownership?: string;
//   PreferredLanguage?: string;
//   CountryCode?: string;
//   PostalCode?: string;
//   PhoneMobile?: string;
//   PhoneLandline?: string;
//   WebsiteUrl?: string;
//   AddressLinePrefix?: string;
//   StreetName?: string;
//   StreetType?: string;
//   HouseNumber?: string;
//   AddressLine2?: string;
//   AddressLine3?: string;
//   AddressLine4?: string;
//   Locality?: string;
//   DependantLocality?: string;
//   DoubleDependantLocality?: string;
//   ProvinceAbbreviation?: string;
//   Province?: string;
//   DateCreated?: string;
//   DateModified?: string;
//   VATNumber?: string;
//   IsDuplicate?: boolean;
//   ParentDuplicateId?: string;
//   OptInOptions?: number;
//   OptInOptions2?: number;
//   DateCopiedForExport?: Date;
//   GDCNumber?: string;
//   AccessLead?: boolean;
//   UniqueId?: string;
//   id?: string;
//   SubmitType?: string;
//   LineOfBusiness?: string;
//   RecordType?: string;
//   RecordTypeId?: string;
//   AdditionalComments?: string;
// }
export interface Lead extends UTMParams {
  account2__r__account_number__c?: string;
  account3__r__account_number__c?: string;
  account__r__account_number__c?: string;
  account_type__c?: string;
  additional_comments__c?: string;
  additional_information__c?: string;
  address_1__c?: string;
  address_2__c?: string;
  address_3__c?: string;
  address_4__c?: string;
  age_range__c?: string;
  annual_ortho_cases__c?: string;
  city?: string;
  city_1__c?: string;
  comments__c?: string;
  company?: string;
  consult_date__c?: string;
  country__c?: string;
  country_1__c?: string;
  countrycode?: string;
  county__c?: string;
  date_of_birth__c?: string;
  doctor_license_number__c?: string;
  duplicate__c?: boolean;
  email?: string;
  email_opt_in_marketing__c?: boolean;
  et4ae5__hasoptedoutofmobile__c?: boolean;
  external_lead_id__c?: string;
  fax?: string;
  firstname?: string;
  gclid__c?: string;
  gdc_number__c?: string;
  gender__c?: string;
  hasoptedoutofemail?: boolean;
  house_name_building__c?: string;
  how_did_you_know_the_training_course__c?: string;
  invisalign_treatment_start_date__c?: string;
  language__c?: string;
  lastname?: string;
  latitude?: number;
  leadsource?: string;
  line_of_business__c?: string;
  longitude?: number;
  mobilephone?: string;
  mode_of_contact__c?: string;
  opt_in_date__c?: string;
  organization__c?: string;
  other_source__c?: string;
  ownerid?: string;
  parent_email__c?: string;
  parent_name__c?: string;
  parent_phone__c?: string;
  phone?: string;
  please_select_your_position__c?: string;
  postalcode?: string;
  postcode?: string;
  practice_name__c?: string;
  preferred_appointment_time__c?: string;
  preferred_contact_time__c?: string;
  preferred_doctor_1__c?: string;
  preferred_doctor_2__c?: string;
  preferred_doctor_3__c?: string;
  professional_category__c?: string;
  professional_sub_category__c?: string;
  prospect_id_text__c?: string;
  recordtypeid?: string;
  regional_fiscal_identifier__c?: string;
  salutation?: string;
  scheduled_date__c?: string;
  smileview__c?: boolean;
  source_sub_type__c?: string;
  state?: string;
  state__c?: string;
  statecode?: string;
  status?: string;
  street_name__c?: string;
  street_number__c?: string;
  tax_registration_number__c?: string;
  translated_address_street_1__c?: string;
  translated_address_street_2__c?: string;
  translated_address_street_3__c?: string;
  translated_address_street_4__c?: string;
  translated_city__c?: string;
  translated_country__c?: string;
  translated_county__c?: string;
  translated_firstname__c?: string;
  translated_lastname__c?: string;
  translated_mailing_name__c?: string;
  translated_name2__c?: string;
  translated_name__c?: string;
  translated_salutation__c?: string;
  translated_state__c?: string;
  unsubscribe__c?: boolean;
  vat_reg_no__c?: string;
  website?: string;
  zip__c?: string;

  lead_journey?: LeadServiceLeadJourney;
  extra_fields?: LeadServiceExtraFields;
}

export interface LeadServiceExtraFields {
  AccessLead?: boolean;
  AddressLinePrefix?: string;
  DoubleDependantLocality?: string;
  DependantLocality?: string;
  UniqueId?: string;
}

export interface ProviderLeadInputRequest extends Lead, UTMParams {
  formType: string;
  calendly_event_start_time?: string;
  campaignId?: string;
  additionalCampaignId?: string | null;
  LeadSource?: string;
  SubLeadSource?: string;
  AdditionalComments?: string;
}

export interface LeadInputRequest extends Lead, UTMParams {
  LeadSource?: string;
  SubLeadSource?: string;
  LeadService?: "GLOBAL" | "EU" | "APAC" | "NPJ";
  campaignId?: string;
  AdditionalComments?: string;
}

export interface LeadServiceLeadJourney extends UTMParams {
  leadsource__c?: string;
  i_am__c?: string;
  primary_goal__c?: string;
  sa_prospect_status__c?: string;
  condition_type__c?: string;
  account__r__account_number__c?: string;
  account2__r__account_number__c?: string;
  account3__r__account_number__c?: string;
  preferred_doctor_1__c?: string;
  preferred_doctor_2__c?: string;
  preferred_doctor_3__c?: string;
  simulation_file_share_url__c?: string;
  lead_status__c?: string;
  sub_lead_source__c?: string;
}

export interface LeadRequest {
  api_v1_lead: Lead;
}
export interface LeadResult {
  success: boolean;
  errorMessage?: string;
  error?: Record<string, string>;
  res?: Record<string, string>;
  existingAccount?: boolean;
  seatsNotAvailable?: boolean;
  additionalSeatsAvailable?: boolean;
  data?: Record<string, any>;
  errorDetails?: any;
}
export interface LeadOutput extends Lead {
  prospect_id_text__c?: string;
  id?: number;
}

export interface LeadResponse {
  lead: LeadOutput;
  leadData?: Record<string, any>;
}

export interface CountryData {
  Countries: {
    Id: string;
    Name: string;
    VATRegex?: string;
    PostalCodeRegex?: string;
    PhonePrefix?: string;
    ExpandedAddressFields?: string;
    RequiredAddressFields?: string;
    VATNumberMandatory?: string;
    ShowGDCNumber?: boolean;
    DefaultLanguage?: string;
    AddressLines?: string;
    ProvinceAbbreviationRegex?: string;
    ProvinceAbbreviationMap?: string[][];
    LanguageRegex?: string;
    PostalCodeFormat?: string;
  }[];
}

export interface ProviderData {
  id: string;
  campaign_id?: string;
  first_name: string;
  last_name: string;
  address: string;
  additional_address_line?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  email: string;
  phone: string;
  practice_name: string;
  specialty: string;
  license: string;
  npi?: string;
  license_state: string;
  agd_pace_number: string;
  course_type?: string;
  on_demand_course_type?: string;
  professional_subcategory?: string;
  status?: string;
  team_members?: Array<{
    first_name: string;
    last_name: string;
  }>;
  role?: string;
  go_digital_enabled: boolean;
}

export interface CartData {
  contact_info_editable: boolean;
  tax: number;
  price: number;
  old_price: number;
  price_with_tax: number;
  course_selection_editable: boolean;
  currency: string;
  course_info: {
    title: string | null;
    author: string | null;
    type: string | null;
    ce_hours: string | null;
    date: string | null;
  };
  go_digital_prices: string;
  suggest_go_digital: boolean;
  applied_coupon: boolean;
}

export interface RegisterMutationPayload {
  /** Team members form */
  team_members: {
    first_name: string;
    last_name: string;
    email: string;
    member_type: string | null;
  }[];

  /** Registration form */
  additional_address_line: string;
  address: string;
  agd_pace_number: string;
  city: string;
  country: string;
  course_type: "on_demand" | "sf_campaign";
  email: string;
  first_name: string;
  last_name: string;
  license: string;
  license_state: string;
  npi: string | null; // null for on-demand course
  phone: string;
  postal_code: string;
  practice_name: string;
  role: string | null;
  specialty: string;
  state: string;
  professional_subcategory: string | null;
  campaign_id: string | null;
  locale?: string;
  utmParams?: Record<string, unknown>;
  promo?: string;
  university_graduation_year?: string;
  university_name?: string;
}

export interface RegisterMutationReturnType {
  go_digital_enabled: boolean;
  id: string;
}

export interface EventData {
  id: number;
  date: string;
  time: string;
  title: string;
  doctor_type: string;
  modality: string;
  speakers: string;
  language: string;
  state: string;
  city: string;
  venue_name: string;
  address: string | null;
  zip_code: string;
  availability: boolean;
  multiday: boolean;
  campaign_id: string;
  country: string;
  kind: string;
}

export interface CouponMutationReturnType {
  price: number;
  tax: number;
  price_with_tax: number;
  valid: boolean;
}

export interface CouponMutationPayload {
  provider_id: string;
  coupon: string;
}

export interface ScormModuleMutationPayload {
  provider_id: string;
  id: string;
}

export interface ScormModuleMutationReturnType {
  completed: boolean;
}

export interface ContactUsMutationPayload {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  professional_category: string;
  professional_subcategory: string;
  country: string;
  postal_code: string;
  state_province: string;
  city: string;
  unsubscribe: string;
  comments: string;
  utmParams?: Record<string, any>;
}
