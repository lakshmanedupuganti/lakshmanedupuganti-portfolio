/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  mutation CreateLeadAndRegisterCampaignMember(\n    $input: CreateLeadAndRegisterCampaignMemberInput!\n  ) {\n    createLeadAndRegisterCampaignMember(input: $input) {\n      success\n      message\n      data {\n        leadId\n        leadJourneyId\n        campaignMemberId\n        existingAccount\n        status\n        zoomJoinUrl\n      }\n    }\n  }\n": typeof types.CreateLeadAndRegisterCampaignMemberDocument,
    "\n  mutation CreateLead($input: CreateLeadInput!) {\n    createLead(input: $input) {\n      success\n      message\n      errorDetails {\n        errorCode\n        fieldsWithErrors\n        message\n      }\n      data {\n        leadId\n        leadJourneyId\n        existingAccount\n      }\n    }\n  }\n": typeof types.CreateLeadDocument,
    "\n  query GetGlobalAvailableCampaigns(\n    $country: String!\n    $isIGo: Boolean!\n    $language: String\n    $label: String\n  ) {\n    getGlobalAvailableCampaigns(\n      country: $country\n      isIGo: $isIGo\n      language: $language\n      label: $label\n    ) {\n      Id\n      Title\n      StartTime\n      EndTime\n      Location\n      Country\n      Speaker\n      Language\n      DateLocation\n      Date\n      Name\n      ProgramName\n      CampaignHours\n      HoursDuration\n      Agenda\n      LongDescription\n      Description\n      VenueName\n      VenueCity\n      VenueAddress\n      VenuePostcode\n      VenueLatitude\n      VenueLongitude\n      DoctorType\n      FullyBooked\n      Speakers {\n        Id\n        Description\n        LongDescription\n        EmailPicture\n        Name\n        DID\n        Language\n        BioSections\n      }\n      Day2Date\n      CampaignMemberAllowed\n      EventType\n    }\n  }\n": typeof types.GetGlobalAvailableCampaignsDocument,
};
const documents: Documents = {
    "\n  mutation CreateLeadAndRegisterCampaignMember(\n    $input: CreateLeadAndRegisterCampaignMemberInput!\n  ) {\n    createLeadAndRegisterCampaignMember(input: $input) {\n      success\n      message\n      data {\n        leadId\n        leadJourneyId\n        campaignMemberId\n        existingAccount\n        status\n        zoomJoinUrl\n      }\n    }\n  }\n": types.CreateLeadAndRegisterCampaignMemberDocument,
    "\n  mutation CreateLead($input: CreateLeadInput!) {\n    createLead(input: $input) {\n      success\n      message\n      errorDetails {\n        errorCode\n        fieldsWithErrors\n        message\n      }\n      data {\n        leadId\n        leadJourneyId\n        existingAccount\n      }\n    }\n  }\n": types.CreateLeadDocument,
    "\n  query GetGlobalAvailableCampaigns(\n    $country: String!\n    $isIGo: Boolean!\n    $language: String\n    $label: String\n  ) {\n    getGlobalAvailableCampaigns(\n      country: $country\n      isIGo: $isIGo\n      language: $language\n      label: $label\n    ) {\n      Id\n      Title\n      StartTime\n      EndTime\n      Location\n      Country\n      Speaker\n      Language\n      DateLocation\n      Date\n      Name\n      ProgramName\n      CampaignHours\n      HoursDuration\n      Agenda\n      LongDescription\n      Description\n      VenueName\n      VenueCity\n      VenueAddress\n      VenuePostcode\n      VenueLatitude\n      VenueLongitude\n      DoctorType\n      FullyBooked\n      Speakers {\n        Id\n        Description\n        LongDescription\n        EmailPicture\n        Name\n        DID\n        Language\n        BioSections\n      }\n      Day2Date\n      CampaignMemberAllowed\n      EventType\n    }\n  }\n": types.GetGlobalAvailableCampaignsDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateLeadAndRegisterCampaignMember(\n    $input: CreateLeadAndRegisterCampaignMemberInput!\n  ) {\n    createLeadAndRegisterCampaignMember(input: $input) {\n      success\n      message\n      data {\n        leadId\n        leadJourneyId\n        campaignMemberId\n        existingAccount\n        status\n        zoomJoinUrl\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation CreateLeadAndRegisterCampaignMember(\n    $input: CreateLeadAndRegisterCampaignMemberInput!\n  ) {\n    createLeadAndRegisterCampaignMember(input: $input) {\n      success\n      message\n      data {\n        leadId\n        leadJourneyId\n        campaignMemberId\n        existingAccount\n        status\n        zoomJoinUrl\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateLead($input: CreateLeadInput!) {\n    createLead(input: $input) {\n      success\n      message\n      errorDetails {\n        errorCode\n        fieldsWithErrors\n        message\n      }\n      data {\n        leadId\n        leadJourneyId\n        existingAccount\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation CreateLead($input: CreateLeadInput!) {\n    createLead(input: $input) {\n      success\n      message\n      errorDetails {\n        errorCode\n        fieldsWithErrors\n        message\n      }\n      data {\n        leadId\n        leadJourneyId\n        existingAccount\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetGlobalAvailableCampaigns(\n    $country: String!\n    $isIGo: Boolean!\n    $language: String\n    $label: String\n  ) {\n    getGlobalAvailableCampaigns(\n      country: $country\n      isIGo: $isIGo\n      language: $language\n      label: $label\n    ) {\n      Id\n      Title\n      StartTime\n      EndTime\n      Location\n      Country\n      Speaker\n      Language\n      DateLocation\n      Date\n      Name\n      ProgramName\n      CampaignHours\n      HoursDuration\n      Agenda\n      LongDescription\n      Description\n      VenueName\n      VenueCity\n      VenueAddress\n      VenuePostcode\n      VenueLatitude\n      VenueLongitude\n      DoctorType\n      FullyBooked\n      Speakers {\n        Id\n        Description\n        LongDescription\n        EmailPicture\n        Name\n        DID\n        Language\n        BioSections\n      }\n      Day2Date\n      CampaignMemberAllowed\n      EventType\n    }\n  }\n"): (typeof documents)["\n  query GetGlobalAvailableCampaigns(\n    $country: String!\n    $isIGo: Boolean!\n    $language: String\n    $label: String\n  ) {\n    getGlobalAvailableCampaigns(\n      country: $country\n      isIGo: $isIGo\n      language: $language\n      label: $label\n    ) {\n      Id\n      Title\n      StartTime\n      EndTime\n      Location\n      Country\n      Speaker\n      Language\n      DateLocation\n      Date\n      Name\n      ProgramName\n      CampaignHours\n      HoursDuration\n      Agenda\n      LongDescription\n      Description\n      VenueName\n      VenueCity\n      VenueAddress\n      VenuePostcode\n      VenueLatitude\n      VenueLongitude\n      DoctorType\n      FullyBooked\n      Speakers {\n        Id\n        Description\n        LongDescription\n        EmailPicture\n        Name\n        DID\n        Language\n        BioSections\n      }\n      Day2Date\n      CampaignMemberAllowed\n      EventType\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;