/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: { input: any; output: any; }
};

export type Campaign = {
  __typename?: 'Campaign';
  available_for_region_countries__c?: Maybe<Scalars['String']['output']>;
  campaignSpeakers?: Maybe<Array<Maybe<CampaignSpeaker>>>;
  campaign_customer_facing_name__c?: Maybe<Scalars['String']['output']>;
  campaign_members_allowed__c?: Maybe<Scalars['String']['output']>;
  campaign_type__c?: Maybe<Scalars['String']['output']>;
  comment_about_event__c?: Maybe<Scalars['String']['output']>;
  country__c?: Maybe<Scalars['String']['output']>;
  doctor_type__c?: Maybe<Scalars['String']['output']>;
  end_time__c?: Maybe<Scalars['String']['output']>;
  event_date__c?: Maybe<Scalars['String']['output']>;
  event_format__c?: Maybe<Scalars['String']['output']>;
  event_type_picklist__c?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  isactive?: Maybe<Scalars['Boolean']['output']>;
  language__c?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  parentid?: Maybe<Scalars['ID']['output']>;
  seat_capacity_planned__c?: Maybe<Scalars['Float']['output']>;
  sfid: Scalars['ID']['output'];
  start_time__c?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  venue?: Maybe<Venue>;
  venue__c?: Maybe<Scalars['ID']['output']>;
  webinar_meeting_id__c?: Maybe<Scalars['String']['output']>;
};

export type CampaignOutput = {
  __typename?: 'CampaignOutput';
  Agenda?: Maybe<Scalars['String']['output']>;
  CampaignHours?: Maybe<Scalars['Float']['output']>;
  CampaignMemberAllowed?: Maybe<Scalars['String']['output']>;
  Country?: Maybe<Scalars['String']['output']>;
  Date?: Maybe<Scalars['String']['output']>;
  DateLocation?: Maybe<Scalars['String']['output']>;
  Day2Date?: Maybe<Scalars['String']['output']>;
  Description?: Maybe<Scalars['String']['output']>;
  DoctorType?: Maybe<Scalars['String']['output']>;
  EndTime?: Maybe<Scalars['String']['output']>;
  EventType?: Maybe<Scalars['String']['output']>;
  FullyBooked?: Maybe<Scalars['Boolean']['output']>;
  HoursDuration?: Maybe<Scalars['Float']['output']>;
  Id?: Maybe<Scalars['ID']['output']>;
  Language?: Maybe<Scalars['String']['output']>;
  Location?: Maybe<Scalars['String']['output']>;
  LongDescription?: Maybe<Scalars['String']['output']>;
  Name?: Maybe<Scalars['String']['output']>;
  ProgramName?: Maybe<Scalars['String']['output']>;
  Speaker?: Maybe<Scalars['String']['output']>;
  Speakers?: Maybe<Array<Maybe<SpeakerOutput>>>;
  StartTime?: Maybe<Scalars['String']['output']>;
  Title?: Maybe<Scalars['String']['output']>;
  VenueAddress?: Maybe<Scalars['String']['output']>;
  VenueCity?: Maybe<Scalars['String']['output']>;
  VenueLatitude?: Maybe<Scalars['Float']['output']>;
  VenueLongitude?: Maybe<Scalars['Float']['output']>;
  VenueName?: Maybe<Scalars['String']['output']>;
  VenuePostcode?: Maybe<Scalars['String']['output']>;
};

export type CampaignSpeaker = {
  __typename?: 'CampaignSpeaker';
  contact?: Maybe<Contact>;
  contact__c?: Maybe<Scalars['ID']['output']>;
  id: Scalars['Int']['output'];
  name?: Maybe<Scalars['String']['output']>;
  parent_campaign__c?: Maybe<Scalars['ID']['output']>;
  sfid: Scalars['ID']['output'];
};

export type Contact = {
  __typename?: 'Contact';
  email?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  sfid: Scalars['ID']['output'];
};

export type CreateLeadAndRegisterCampaignMemberData = {
  __typename?: 'CreateLeadAndRegisterCampaignMemberData';
  campaignMemberId: Scalars['String']['output'];
  existingAccount: Scalars['Boolean']['output'];
  leadId: Scalars['String']['output'];
  leadJourneyId: Scalars['String']['output'];
  status: Scalars['String']['output'];
  zoomJoinUrl: Scalars['String']['output'];
};

export type CreateLeadAndRegisterCampaignMemberInput = {
  campaignId?: InputMaybe<Scalars['String']['input']>;
  checkDuplicate: Scalars['Boolean']['input'];
  leadData: LeadInput;
};

export type CreateLeadAndRegisterCampaignMemberResponse = {
  __typename?: 'CreateLeadAndRegisterCampaignMemberResponse';
  data?: Maybe<CreateLeadAndRegisterCampaignMemberData>;
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type CreateLeadData = {
  __typename?: 'CreateLeadData';
  existingAccount: Scalars['Boolean']['output'];
  leadId: Scalars['String']['output'];
  leadJourneyId: Scalars['String']['output'];
};

export type CreateLeadInput = {
  checkDuplicate: Scalars['Boolean']['input'];
  implementationType?: InputMaybe<ImplementationType>;
  leadData: LeadInput;
};

export type CreateLeadResponse = {
  __typename?: 'CreateLeadResponse';
  data?: Maybe<CreateLeadData>;
  errorDetails?: Maybe<ErrorDetails>;
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type ErrorDetails = {
  __typename?: 'ErrorDetails';
  errorCode: Scalars['String']['output'];
  fieldsWithErrors: Array<Maybe<Scalars['String']['output']>>;
  message: Scalars['String']['output'];
};

export enum ImplementationType {
  EuIteroLabEnrolment = 'EU_ITERO_LAB_ENROLMENT',
  EuProvider = 'EU_PROVIDER'
}

export type LeadInput = {
  account2__r__account_number__c?: InputMaybe<Scalars['String']['input']>;
  account3__r__account_number__c?: InputMaybe<Scalars['String']['input']>;
  account__r__account_number__c?: InputMaybe<Scalars['String']['input']>;
  account_type__c?: InputMaybe<Scalars['String']['input']>;
  additional_comments__c?: InputMaybe<Scalars['String']['input']>;
  additional_information__c?: InputMaybe<Scalars['String']['input']>;
  address1_type__c?: InputMaybe<Scalars['String']['input']>;
  address_1__c?: InputMaybe<Scalars['String']['input']>;
  address_2__c?: InputMaybe<Scalars['String']['input']>;
  address_3__c?: InputMaybe<Scalars['String']['input']>;
  address_4__c?: InputMaybe<Scalars['String']['input']>;
  age_range__c?: InputMaybe<Scalars['String']['input']>;
  annual_ortho_cases__c?: InputMaybe<Scalars['String']['input']>;
  aspen__c?: InputMaybe<Scalars['Boolean']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  city_1__c?: InputMaybe<Scalars['String']['input']>;
  comments__c?: InputMaybe<Scalars['String']['input']>;
  company?: InputMaybe<Scalars['String']['input']>;
  consult_date__c?: InputMaybe<Scalars['String']['input']>;
  contact_type__c?: InputMaybe<Scalars['String']['input']>;
  country_1__c?: InputMaybe<Scalars['String']['input']>;
  country__c?: InputMaybe<Scalars['String']['input']>;
  countrycode?: InputMaybe<Scalars['String']['input']>;
  county__c?: InputMaybe<Scalars['String']['input']>;
  date_of_birth__c?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  doctor_license_number__c?: InputMaybe<Scalars['String']['input']>;
  duplicate__c?: InputMaybe<Scalars['Boolean']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  email_opt_in_marketing__c?: InputMaybe<Scalars['Boolean']['input']>;
  et4ae5__hasoptedoutofmobile__c?: InputMaybe<Scalars['Boolean']['input']>;
  external_lead_id__c?: InputMaybe<Scalars['String']['input']>;
  extra_fields?: InputMaybe<LeadServiceExtraFields>;
  fax?: InputMaybe<Scalars['String']['input']>;
  firstname?: InputMaybe<Scalars['String']['input']>;
  gclid__c?: InputMaybe<Scalars['String']['input']>;
  gdc_number__c?: InputMaybe<Scalars['String']['input']>;
  gender__c?: InputMaybe<Scalars['String']['input']>;
  hasoptedoutofemail?: InputMaybe<Scalars['Boolean']['input']>;
  house_name_building__c?: InputMaybe<Scalars['String']['input']>;
  how_did_you_know_the_training_course__c?: InputMaybe<Scalars['String']['input']>;
  interested_inmarketing__c?: InputMaybe<Scalars['String']['input']>;
  invisalign_treatment_start_date__c?: InputMaybe<Scalars['String']['input']>;
  language__c?: InputMaybe<Scalars['String']['input']>;
  lastname?: InputMaybe<Scalars['String']['input']>;
  latitude?: InputMaybe<Scalars['Float']['input']>;
  lead_journey?: InputMaybe<LeadServiceLeadJourney>;
  lead_url_campaign__c?: InputMaybe<Scalars['String']['input']>;
  lead_url_content__c?: InputMaybe<Scalars['String']['input']>;
  lead_url_medium__c?: InputMaybe<Scalars['String']['input']>;
  lead_url_source__c?: InputMaybe<Scalars['String']['input']>;
  lead_url_term__c?: InputMaybe<Scalars['String']['input']>;
  leadsource?: InputMaybe<Scalars['String']['input']>;
  line_of_business__c?: InputMaybe<Scalars['String']['input']>;
  longitude?: InputMaybe<Scalars['Float']['input']>;
  mobilephone?: InputMaybe<Scalars['String']['input']>;
  mode_of_contact__c?: InputMaybe<Scalars['String']['input']>;
  opt_in_date__c?: InputMaybe<Scalars['String']['input']>;
  organization__c?: InputMaybe<Scalars['String']['input']>;
  other_source__c?: InputMaybe<Scalars['String']['input']>;
  ownerid?: InputMaybe<Scalars['String']['input']>;
  parent_email__c?: InputMaybe<Scalars['String']['input']>;
  parent_name__c?: InputMaybe<Scalars['String']['input']>;
  parent_phone__c?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  please_select_your_position__c?: InputMaybe<Scalars['String']['input']>;
  postalcode?: InputMaybe<Scalars['String']['input']>;
  postcode?: InputMaybe<Scalars['String']['input']>;
  practice_name__c?: InputMaybe<Scalars['String']['input']>;
  preferred_appointment_time__c?: InputMaybe<Scalars['String']['input']>;
  preferred_contact_time__c?: InputMaybe<Scalars['String']['input']>;
  preferred_doctor_1__c?: InputMaybe<Scalars['String']['input']>;
  preferred_doctor_2__c?: InputMaybe<Scalars['String']['input']>;
  preferred_doctor_3__c?: InputMaybe<Scalars['String']['input']>;
  professional_category__c?: InputMaybe<Scalars['String']['input']>;
  professional_sub_category__c?: InputMaybe<Scalars['String']['input']>;
  prospect_id_text__c?: InputMaybe<Scalars['String']['input']>;
  recordtypeid?: InputMaybe<Scalars['String']['input']>;
  regional_fiscal_identifier__c?: InputMaybe<Scalars['String']['input']>;
  salutation?: InputMaybe<Scalars['String']['input']>;
  scheduled_date__c?: InputMaybe<Scalars['String']['input']>;
  smileview__c?: InputMaybe<Scalars['Boolean']['input']>;
  source_sub_type__c?: InputMaybe<Scalars['String']['input']>;
  state?: InputMaybe<Scalars['String']['input']>;
  state__c?: InputMaybe<Scalars['String']['input']>;
  statecode?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  street_name__c?: InputMaybe<Scalars['String']['input']>;
  street_number__c?: InputMaybe<Scalars['String']['input']>;
  tax_registration_number__c?: InputMaybe<Scalars['String']['input']>;
  translated_address_street_1__c?: InputMaybe<Scalars['String']['input']>;
  translated_address_street_2__c?: InputMaybe<Scalars['String']['input']>;
  translated_address_street_3__c?: InputMaybe<Scalars['String']['input']>;
  translated_address_street_4__c?: InputMaybe<Scalars['String']['input']>;
  translated_city__c?: InputMaybe<Scalars['String']['input']>;
  translated_country__c?: InputMaybe<Scalars['String']['input']>;
  translated_county__c?: InputMaybe<Scalars['String']['input']>;
  translated_firstname__c?: InputMaybe<Scalars['String']['input']>;
  translated_lastname__c?: InputMaybe<Scalars['String']['input']>;
  translated_mailing_name__c?: InputMaybe<Scalars['String']['input']>;
  translated_name2__c?: InputMaybe<Scalars['String']['input']>;
  translated_name__c?: InputMaybe<Scalars['String']['input']>;
  translated_salutation__c?: InputMaybe<Scalars['String']['input']>;
  translated_state__c?: InputMaybe<Scalars['String']['input']>;
  unsubscribe__c?: InputMaybe<Scalars['Boolean']['input']>;
  vat_reg_no__c?: InputMaybe<Scalars['String']['input']>;
  website?: InputMaybe<Scalars['String']['input']>;
  zip__c?: InputMaybe<Scalars['String']['input']>;
};

export type LeadOutput = {
  __typename?: 'LeadOutput';
  account2__r__account_number__c?: Maybe<Scalars['String']['output']>;
  account3__r__account_number__c?: Maybe<Scalars['String']['output']>;
  account__r__account_number__c?: Maybe<Scalars['String']['output']>;
  account_type__c?: Maybe<Scalars['String']['output']>;
  additional_comments__c?: Maybe<Scalars['String']['output']>;
  additional_information__c?: Maybe<Scalars['String']['output']>;
  address_1__c?: Maybe<Scalars['String']['output']>;
  address_2__c?: Maybe<Scalars['String']['output']>;
  address_3__c?: Maybe<Scalars['String']['output']>;
  address_4__c?: Maybe<Scalars['String']['output']>;
  age_range__c?: Maybe<Scalars['String']['output']>;
  annual_ortho_cases__c?: Maybe<Scalars['String']['output']>;
  city?: Maybe<Scalars['String']['output']>;
  city_1__c?: Maybe<Scalars['String']['output']>;
  comments__c?: Maybe<Scalars['String']['output']>;
  company?: Maybe<Scalars['String']['output']>;
  consult_date__c?: Maybe<Scalars['String']['output']>;
  contact_type__c?: Maybe<Scalars['String']['output']>;
  country_1__c?: Maybe<Scalars['String']['output']>;
  country__c?: Maybe<Scalars['String']['output']>;
  countrycode?: Maybe<Scalars['String']['output']>;
  county__c?: Maybe<Scalars['String']['output']>;
  date_of_birth__c?: Maybe<Scalars['String']['output']>;
  doctor_license_number__c?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  email_opt_in_marketing__c?: Maybe<Scalars['Boolean']['output']>;
  et4ae5__hasoptedoutofmobile__c?: Maybe<Scalars['Boolean']['output']>;
  external_lead_id__c?: Maybe<Scalars['String']['output']>;
  fax?: Maybe<Scalars['String']['output']>;
  firstname?: Maybe<Scalars['String']['output']>;
  gclid__c?: Maybe<Scalars['String']['output']>;
  gdc_number__c?: Maybe<Scalars['String']['output']>;
  gender__c?: Maybe<Scalars['String']['output']>;
  hasoptedoutofemail?: Maybe<Scalars['Boolean']['output']>;
  house_name_building__c?: Maybe<Scalars['String']['output']>;
  how_did_you_know_the_training_course__c?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  invisalign_treatment_start_date__c?: Maybe<Scalars['String']['output']>;
  language__c?: Maybe<Scalars['String']['output']>;
  lastname?: Maybe<Scalars['String']['output']>;
  latitude?: Maybe<Scalars['Float']['output']>;
  lead_url_campaign__c?: Maybe<Scalars['String']['output']>;
  lead_url_content__c?: Maybe<Scalars['String']['output']>;
  lead_url_medium__c?: Maybe<Scalars['String']['output']>;
  lead_url_source__c?: Maybe<Scalars['String']['output']>;
  lead_url_term__c?: Maybe<Scalars['String']['output']>;
  leadsource?: Maybe<Scalars['String']['output']>;
  line_of_business__c?: Maybe<Scalars['String']['output']>;
  longitude?: Maybe<Scalars['Float']['output']>;
  mobilephone?: Maybe<Scalars['String']['output']>;
  mode_of_contact__c?: Maybe<Scalars['String']['output']>;
  opt_in_date__c?: Maybe<Scalars['String']['output']>;
  organization__c?: Maybe<Scalars['String']['output']>;
  other_source__c?: Maybe<Scalars['String']['output']>;
  ownerid?: Maybe<Scalars['String']['output']>;
  parent_email__c?: Maybe<Scalars['String']['output']>;
  parent_name__c?: Maybe<Scalars['String']['output']>;
  parent_phone__c?: Maybe<Scalars['String']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
  please_select_your_position__c?: Maybe<Scalars['String']['output']>;
  postalcode?: Maybe<Scalars['String']['output']>;
  postcode?: Maybe<Scalars['String']['output']>;
  practice_name__c?: Maybe<Scalars['String']['output']>;
  preferred_appointment_time__c?: Maybe<Scalars['String']['output']>;
  preferred_contact_time__c?: Maybe<Scalars['String']['output']>;
  preferred_doctor_1__c?: Maybe<Scalars['String']['output']>;
  preferred_doctor_2__c?: Maybe<Scalars['String']['output']>;
  preferred_doctor_3__c?: Maybe<Scalars['String']['output']>;
  professional_category__c?: Maybe<Scalars['String']['output']>;
  professional_sub_category__c?: Maybe<Scalars['String']['output']>;
  prospect_id_text__c?: Maybe<Scalars['String']['output']>;
  recordtypeid?: Maybe<Scalars['String']['output']>;
  regional_fiscal_identifier__c?: Maybe<Scalars['String']['output']>;
  salutation?: Maybe<Scalars['String']['output']>;
  scheduled_date__c?: Maybe<Scalars['String']['output']>;
  sfid?: Maybe<Scalars['String']['output']>;
  smileview__c?: Maybe<Scalars['Boolean']['output']>;
  source_sub_type__c?: Maybe<Scalars['String']['output']>;
  state?: Maybe<Scalars['String']['output']>;
  state__c?: Maybe<Scalars['String']['output']>;
  statecode?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  street_name__c?: Maybe<Scalars['String']['output']>;
  street_number__c?: Maybe<Scalars['String']['output']>;
  tax_registration_number__c?: Maybe<Scalars['String']['output']>;
  translated_address_street_1__c?: Maybe<Scalars['String']['output']>;
  translated_address_street_2__c?: Maybe<Scalars['String']['output']>;
  translated_address_street_3__c?: Maybe<Scalars['String']['output']>;
  translated_address_street_4__c?: Maybe<Scalars['String']['output']>;
  translated_city__c?: Maybe<Scalars['String']['output']>;
  translated_country__c?: Maybe<Scalars['String']['output']>;
  translated_county__c?: Maybe<Scalars['String']['output']>;
  translated_firstname__c?: Maybe<Scalars['String']['output']>;
  translated_lastname__c?: Maybe<Scalars['String']['output']>;
  translated_mailing_name__c?: Maybe<Scalars['String']['output']>;
  translated_name2__c?: Maybe<Scalars['String']['output']>;
  translated_name__c?: Maybe<Scalars['String']['output']>;
  translated_salutation__c?: Maybe<Scalars['String']['output']>;
  translated_state__c?: Maybe<Scalars['String']['output']>;
  unsubscribe__c?: Maybe<Scalars['Boolean']['output']>;
  vat_reg_no__c?: Maybe<Scalars['String']['output']>;
  website?: Maybe<Scalars['String']['output']>;
  zip__c?: Maybe<Scalars['String']['output']>;
};

export type LeadServiceExtraFields = {
  AccessLead?: InputMaybe<Scalars['Boolean']['input']>;
  AddressLinePrefix?: InputMaybe<Scalars['String']['input']>;
  DependantLocality?: InputMaybe<Scalars['String']['input']>;
  DoubleDependantLocality?: InputMaybe<Scalars['String']['input']>;
  UniqueId?: InputMaybe<Scalars['String']['input']>;
};

export type LeadServiceLeadJourney = {
  account2__r__account_number__c?: InputMaybe<Scalars['String']['input']>;
  account3__r__account_number__c?: InputMaybe<Scalars['String']['input']>;
  account__r__account_number__c?: InputMaybe<Scalars['String']['input']>;
  condition_type__c?: InputMaybe<Scalars['String']['input']>;
  i_am__c?: InputMaybe<Scalars['String']['input']>;
  lead__c?: InputMaybe<Scalars['String']['input']>;
  lead_status__c?: InputMaybe<Scalars['String']['input']>;
  lead_url_campaign__c?: InputMaybe<Scalars['String']['input']>;
  lead_url_content__c?: InputMaybe<Scalars['String']['input']>;
  lead_url_medium__c?: InputMaybe<Scalars['String']['input']>;
  lead_url_source__c?: InputMaybe<Scalars['String']['input']>;
  lead_url_term__c?: InputMaybe<Scalars['String']['input']>;
  leadsource__c?: InputMaybe<Scalars['String']['input']>;
  preferred_doctor_1__c?: InputMaybe<Scalars['String']['input']>;
  preferred_doctor_2__c?: InputMaybe<Scalars['String']['input']>;
  preferred_doctor_3__c?: InputMaybe<Scalars['String']['input']>;
  primary_goal__c?: InputMaybe<Scalars['String']['input']>;
  sa_prospect_status__c?: InputMaybe<Scalars['String']['input']>;
  simulation_file_share_url__c?: InputMaybe<Scalars['String']['input']>;
  sub_lead_source__c?: InputMaybe<Scalars['String']['input']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createLead: CreateLeadResponse;
  createLeadAndRegisterCampaignMember: CreateLeadAndRegisterCampaignMemberResponse;
};


export type MutationCreateLeadArgs = {
  input: CreateLeadInput;
};


export type MutationCreateLeadAndRegisterCampaignMemberArgs = {
  input: CreateLeadAndRegisterCampaignMemberInput;
};

export type Query = {
  __typename?: 'Query';
  getCampaignBySfid?: Maybe<Campaign>;
  getGlobalAvailableCampaigns: Array<Maybe<CampaignOutput>>;
  getGlobalTerritoryOwnerId?: Maybe<Scalars['String']['output']>;
};


export type QueryGetCampaignBySfidArgs = {
  sfid: Scalars['ID']['input'];
};


export type QueryGetGlobalAvailableCampaignsArgs = {
  country: Scalars['String']['input'];
  isIGo: Scalars['Boolean']['input'];
  label?: InputMaybe<Scalars['String']['input']>;
  language?: InputMaybe<Scalars['String']['input']>;
};


export type QueryGetGlobalTerritoryOwnerIdArgs = {
  doctorChannel: Scalars['String']['input'];
  leadCountry: Scalars['String']['input'];
  leadPostcode: Scalars['String']['input'];
};

export type SpeakerOutput = {
  __typename?: 'SpeakerOutput';
  BioSections?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  DID?: Maybe<Scalars['String']['output']>;
  Description?: Maybe<Scalars['String']['output']>;
  EmailPicture?: Maybe<Scalars['String']['output']>;
  Id?: Maybe<Scalars['ID']['output']>;
  Language?: Maybe<Scalars['String']['output']>;
  LongDescription?: Maybe<Scalars['String']['output']>;
  Name?: Maybe<Scalars['String']['output']>;
};

export type Venue = {
  __typename?: 'Venue';
  address__c?: Maybe<Scalars['String']['output']>;
  city__c?: Maybe<Scalars['String']['output']>;
  geo_latitude_longitude__latitude__s?: Maybe<Scalars['Float']['output']>;
  geo_latitude_longitude__longitude__s?: Maybe<Scalars['Float']['output']>;
  id: Scalars['Int']['output'];
  name?: Maybe<Scalars['String']['output']>;
  postal_code__c?: Maybe<Scalars['String']['output']>;
  sfid: Scalars['ID']['output'];
  venue_format__c?: Maybe<Scalars['String']['output']>;
};

export type CreateLeadAndRegisterCampaignMemberMutationVariables = Exact<{
  input: CreateLeadAndRegisterCampaignMemberInput;
}>;


export type CreateLeadAndRegisterCampaignMemberMutation = { __typename?: 'Mutation', createLeadAndRegisterCampaignMember: { __typename?: 'CreateLeadAndRegisterCampaignMemberResponse', success: boolean, message: string, data?: { __typename?: 'CreateLeadAndRegisterCampaignMemberData', leadId: string, leadJourneyId: string, campaignMemberId: string, existingAccount: boolean, status: string, zoomJoinUrl: string } | null } };

export type CreateLeadMutationVariables = Exact<{
  input: CreateLeadInput;
}>;


export type CreateLeadMutation = { __typename?: 'Mutation', createLead: { __typename?: 'CreateLeadResponse', success: boolean, message: string, errorDetails?: { __typename?: 'ErrorDetails', errorCode: string, fieldsWithErrors: Array<string | null>, message: string } | null, data?: { __typename?: 'CreateLeadData', leadId: string, leadJourneyId: string, existingAccount: boolean } | null } };

export type GetGlobalAvailableCampaignsQueryVariables = Exact<{
  country: Scalars['String']['input'];
  isIGo: Scalars['Boolean']['input'];
  language?: InputMaybe<Scalars['String']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetGlobalAvailableCampaignsQuery = { __typename?: 'Query', getGlobalAvailableCampaigns: Array<{ __typename?: 'CampaignOutput', Id?: string | null, Title?: string | null, StartTime?: string | null, EndTime?: string | null, Location?: string | null, Country?: string | null, Speaker?: string | null, Language?: string | null, DateLocation?: string | null, Date?: string | null, Name?: string | null, ProgramName?: string | null, CampaignHours?: number | null, HoursDuration?: number | null, Agenda?: string | null, LongDescription?: string | null, Description?: string | null, VenueName?: string | null, VenueCity?: string | null, VenueAddress?: string | null, VenuePostcode?: string | null, VenueLatitude?: number | null, VenueLongitude?: number | null, DoctorType?: string | null, FullyBooked?: boolean | null, Day2Date?: string | null, CampaignMemberAllowed?: string | null, EventType?: string | null, Speakers?: Array<{ __typename?: 'SpeakerOutput', Id?: string | null, Description?: string | null, LongDescription?: string | null, EmailPicture?: string | null, Name?: string | null, DID?: string | null, Language?: string | null, BioSections?: Array<string | null> | null } | null> | null } | null> };


export const CreateLeadAndRegisterCampaignMemberDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateLeadAndRegisterCampaignMember"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateLeadAndRegisterCampaignMemberInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createLeadAndRegisterCampaignMember"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"leadId"}},{"kind":"Field","name":{"kind":"Name","value":"leadJourneyId"}},{"kind":"Field","name":{"kind":"Name","value":"campaignMemberId"}},{"kind":"Field","name":{"kind":"Name","value":"existingAccount"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"zoomJoinUrl"}}]}}]}}]}}]} as unknown as DocumentNode<CreateLeadAndRegisterCampaignMemberMutation, CreateLeadAndRegisterCampaignMemberMutationVariables>;
export const CreateLeadDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateLead"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateLeadInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createLead"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"errorDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"errorCode"}},{"kind":"Field","name":{"kind":"Name","value":"fieldsWithErrors"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"leadId"}},{"kind":"Field","name":{"kind":"Name","value":"leadJourneyId"}},{"kind":"Field","name":{"kind":"Name","value":"existingAccount"}}]}}]}}]}}]} as unknown as DocumentNode<CreateLeadMutation, CreateLeadMutationVariables>;
export const GetGlobalAvailableCampaignsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetGlobalAvailableCampaigns"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"country"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"isIGo"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"language"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"label"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getGlobalAvailableCampaigns"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"country"},"value":{"kind":"Variable","name":{"kind":"Name","value":"country"}}},{"kind":"Argument","name":{"kind":"Name","value":"isIGo"},"value":{"kind":"Variable","name":{"kind":"Name","value":"isIGo"}}},{"kind":"Argument","name":{"kind":"Name","value":"language"},"value":{"kind":"Variable","name":{"kind":"Name","value":"language"}}},{"kind":"Argument","name":{"kind":"Name","value":"label"},"value":{"kind":"Variable","name":{"kind":"Name","value":"label"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Id"}},{"kind":"Field","name":{"kind":"Name","value":"Title"}},{"kind":"Field","name":{"kind":"Name","value":"StartTime"}},{"kind":"Field","name":{"kind":"Name","value":"EndTime"}},{"kind":"Field","name":{"kind":"Name","value":"Location"}},{"kind":"Field","name":{"kind":"Name","value":"Country"}},{"kind":"Field","name":{"kind":"Name","value":"Speaker"}},{"kind":"Field","name":{"kind":"Name","value":"Language"}},{"kind":"Field","name":{"kind":"Name","value":"DateLocation"}},{"kind":"Field","name":{"kind":"Name","value":"Date"}},{"kind":"Field","name":{"kind":"Name","value":"Name"}},{"kind":"Field","name":{"kind":"Name","value":"ProgramName"}},{"kind":"Field","name":{"kind":"Name","value":"CampaignHours"}},{"kind":"Field","name":{"kind":"Name","value":"HoursDuration"}},{"kind":"Field","name":{"kind":"Name","value":"Agenda"}},{"kind":"Field","name":{"kind":"Name","value":"LongDescription"}},{"kind":"Field","name":{"kind":"Name","value":"Description"}},{"kind":"Field","name":{"kind":"Name","value":"VenueName"}},{"kind":"Field","name":{"kind":"Name","value":"VenueCity"}},{"kind":"Field","name":{"kind":"Name","value":"VenueAddress"}},{"kind":"Field","name":{"kind":"Name","value":"VenuePostcode"}},{"kind":"Field","name":{"kind":"Name","value":"VenueLatitude"}},{"kind":"Field","name":{"kind":"Name","value":"VenueLongitude"}},{"kind":"Field","name":{"kind":"Name","value":"DoctorType"}},{"kind":"Field","name":{"kind":"Name","value":"FullyBooked"}},{"kind":"Field","name":{"kind":"Name","value":"Speakers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Id"}},{"kind":"Field","name":{"kind":"Name","value":"Description"}},{"kind":"Field","name":{"kind":"Name","value":"LongDescription"}},{"kind":"Field","name":{"kind":"Name","value":"EmailPicture"}},{"kind":"Field","name":{"kind":"Name","value":"Name"}},{"kind":"Field","name":{"kind":"Name","value":"DID"}},{"kind":"Field","name":{"kind":"Name","value":"Language"}},{"kind":"Field","name":{"kind":"Name","value":"BioSections"}}]}},{"kind":"Field","name":{"kind":"Name","value":"Day2Date"}},{"kind":"Field","name":{"kind":"Name","value":"CampaignMemberAllowed"}},{"kind":"Field","name":{"kind":"Name","value":"EventType"}}]}}]}}]} as unknown as DocumentNode<GetGlobalAvailableCampaignsQuery, GetGlobalAvailableCampaignsQueryVariables>;