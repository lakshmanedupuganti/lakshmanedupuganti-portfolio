"use client";

import clientUtil from "@clientlib/utility";

class Tracking {
  private naTrackingData?: Record<string, any>;

  private updateTrackingData = async () => {
    if (typeof this.naTrackingData === "undefined") {
      try {
        this.naTrackingData = await clientUtil.httpGet("/api/getNATrackinData");
      } catch (e) {
        console.log(e);
      }
    }
  };

  private deleteRepeatedKeys(
    testObj: Record<string, string | number>,
    testKeys: string[]
  ) {
    if (!(process.env.GENERAL_ENABLE_GTM_OVERRIDE_KEYS === "true"))
      return testObj;
    testKeys.forEach((tk) => delete testObj[tk]);
    return testObj;
  }

  public gtmTrack(event: string, extra?: Record<string, string>) {
    if (!event) return;
    try {
      let obj = {
        event,
        ...extra,
      };
      console.log('GTM: ' + JSON.stringify(obj));

      if (!window.dataLayer) return;
      window.dataLayer.push(obj);
    } catch (e) {
      console.log(e);
    }
  }

  public async gtmTrackNA(
    event_name: string,
    hashed_email?: string,
    customObject?: Record<string, string | number>
  ) {
    if (!window.dataLayer) {
      return;
    }

    this.updateTrackingData();

    let trackingData = this.naTrackingData
      ? JSON.parse(`${this.naTrackingData}`)
      : {};
    // dmp key formation
    let page_url = window.location.pathname.slice(1)
      ? window.location.pathname.slice(1).replace(/[/]/g, "_")
      : "homepage";

    // TODO - move to configuration
    let key =
      "https://beacon.krxd.net/pixel.gif?confid=shtlwznqv&_kpid=e7812412-e101-4fda-8eba-538bb677c30d&_kcp_s=Align%20Technology&_kcp_d=invisalign.com&_kpa_pagename=" +
      page_url +
      "&_kpa_event_name=" +
      event_name;

    window.dataLayer.push({
      dmp_key: key,
    });
    try {
      if (trackingData.hasOwnProperty(event_name)) {
        let eventCategory = trackingData[event_name].split("|")[0];
        let eventAction = trackingData[event_name].split("|")[1];
        let eventLabel = trackingData[event_name].split("|")[2];

        if (!!hashed_email) {
          customObject = customObject
            ? await this.deleteRepeatedKeys(customObject, [
                "event",
                "ga_category",
                "ga_action",
                "ga_label",
                "user_hashed_email",
              ])
            : {};
          window.dataLayer.push({
            event: event_name,
            ga_category: eventCategory,
            ga_action: eventAction,
            ga_label: eventLabel,
            user_hashed_email: hashed_email,
            ...customObject,
          });

          window.dataLayer.push({ event: "genericEvent" });
        } else {
          customObject = customObject
            ? await this.deleteRepeatedKeys(customObject, [
                "event",
                "ga_category",
                "ga_action",
                "ga_label",
              ])
            : {};
          window.dataLayer.push({
            event: event_name,
            ga_category: eventCategory,
            ga_action: eventAction,
            ga_label: eventLabel,
            ...customObject,
          });

          window.dataLayer.push({ event: "genericEvent" });
        }
      } else {
        customObject = customObject
          ? await this.deleteRepeatedKeys(customObject, ["event"])
          : {};
        window.dataLayer.push({
          event: event_name,
          ...customObject,
        });
      }
    } catch (e) {
      console.log(e);
    }
  }
}

const inst = new Tracking();
export default inst;
