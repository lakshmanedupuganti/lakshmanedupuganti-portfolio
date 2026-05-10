"use client";

import { waitForReacptchaLoad } from "@client/layout/ReCaptcha";
import { LeadResult } from "@lib/types";
import axios from "axios";

/**
 * Determines the appropriate API endpoint based on lead service type and form data
 */
const getLeadSubmissionEndpoint = (
  leadService: "GLOBAL" | "EU" | "APAC" | "NPJ",
  valuesToPost: Record<string, any>,
  apiPrefix: string
): string => {
  const hasCampaignId = Boolean(valuesToPost.campaignId);

  if (leadService === "NPJ") {
    const npjEndpoints: Record<string, string> = {
      UniversityForm: "universityForm",
      ContactUs: "contactUs",
      DownloadCertificate: "downloadCertificate",
    };
    return `${apiPrefix}/api/NPJ/${npjEndpoints[valuesToPost.formType || ""] ?? "npjRegisterLead"}`;
  }
  // For non-EU services, use the standard submitLead endpoint
  if (leadService !== "EU") {
    return `${apiPrefix}/api/submitLead`;
  }

  // EU-specific endpoint logic
  const isCanRegisterRequest =
    valuesToPost.formType === "canRegisterForCampaign" && hasCampaignId;

  // Determine EU endpoint based on form type and campaign presence to avoid double submission
  if (isCanRegisterRequest) {
    return `${apiPrefix}/api/canRegisterForCampaign`;
  }

  if (hasCampaignId) {
    return `${apiPrefix}/api/campaignRegistration`;
  }

  return `${apiPrefix}/api/createProviderLead`;
};

export const submitLead = async (
  valuesToPost: Record<string, any>,
  leadService: "GLOBAL" | "EU" | "APAC" | "NPJ",
  apiPrefix: string,
  recaptchaActive: boolean,
  slug: string
): Promise<LeadResult> => {
  // Handle reCAPTCHA validation if enabled
  if (recaptchaActive) {
    valuesToPost.RecaptchaAction = slug.replace(/\W/gi, "_");

    try {
      await waitForReacptchaLoad();
      valuesToPost.Recaptcha = await window.loadRecaptcha(
        valuesToPost.RecaptchaAction
      );
    } catch (error) {
      console.error("reCAPTCHA loading failed:", error);
      // Continue with form submission even if reCAPTCHA fails
      // The server-side can handle the missing reCAPTCHA token appropriately
    }
  }

  // Determine the appropriate API endpoint based on service and form type
  const endpoint = getLeadSubmissionEndpoint(
    leadService,
    valuesToPost,
    apiPrefix
  );

  const result = await axios.post<LeadResult>(endpoint, valuesToPost);
  return result.data;
};
