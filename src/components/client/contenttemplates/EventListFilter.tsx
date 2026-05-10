"use client";

import type {
  ClientContentItemComponentProps,
  EventListBase,
} from "@src/lib/types";
import { Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { _cx } from "@src/lib/utility/stylings/classes";
import css from "./EventListFilter.dynamic.module.scss";
import ResponsiveImage from "../utility/ResponsiveImage";
import {
  CheckBoxDone,
  CloseCrossIcon,
} from "@src/components/server/utility/IconSVGFile";
import domUtil from "@clientlib/utility/domUtility";
import FilterEventsDesktop from "./events/FilterEventsDesktop";
import FilterEventsMobile from "./events/FilterEventsMobile";
import Link from "next/link";
import buttonCSS from "@src/components/server/contenttemplates/commontemplates/Button.module.scss";
import { useSearchParams } from "next/navigation";
import {
  initializeFormValues,
  parseUrlFilterValues,
  mergeFilterValues,
  initializeTouchedState,
  updateUrl,
} from "@client/contenttemplates/events/EventFilterHelpers";

const btncx = _cx(buttonCSS);

const cx = _cx(css);

export type EventListFilterProps =
  ClientContentItemComponentProps<EventListBase>;

const EventListFilter: React.FC<EventListFilterProps> = (props) => {
  const { item } = props;
  const { clientEvents = [], custom = {} } = item.fields;
  const { clientId } = item.calculated || {};
  const {
    filters = [],
    languageData,
    disableStickyFilters = "None",
    syncFiltersWithUrl = false,
  } = custom || {};
  const [sticky, setSticky] = useState(false);
  const [selectedFiltersSticky, setSelectedFiltersSticky] = useState(false);

  const searchParams = useSearchParams();

  // Parse URL parameters for filter values
  const urlFilterValues = syncFiltersWithUrl
    ? parseUrlFilterValues(searchParams, filters)
    : {};

  // Initialize form values with URL parameters taking precedence
  const defaultValues = initializeFormValues(filters);
  const initialValues = mergeFilterValues(defaultValues, urlFilterValues);
  const initialTouched = initializeTouchedState(filters);

  const res = (s: string) => (languageData ?? {})[s] || s;

  useEffect(() => {
    const isMobileDevice = domUtil.isMobileDevice();
    const shouldDisableSticky = getShouldDisableSticky(
      isMobileDevice,
      disableStickyFilters
    );

    if (shouldDisableSticky) {
      return;
    }

    const handleScroll = () => {
      handleSticky({
        clientId: clientId || "",
        setSticky,
        setSelectedFiltersSticky,
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [clientId]);

  return (
    <Formik
      initialValues={initialValues}
      initialTouched={initialTouched}
      onSubmit={(values) => {
        console.log(values, "values");
      }}
    >
      {({ values, setValues }) => {
        let filteredEventsToShow = clientEvents;
        const selectedValues = Object.entries(values)
          .filter(([key, value]) => {
            // Only include array values and exclude searchBox and sortBy
            return (
              Array.isArray(value) && key !== "searchBox" && key !== "sortBy"
            );
          })
          .flatMap(([key, value]) => value as string[])
          .filter(
            (value) => value !== "asc" && value !== "desc" && value !== ""
          );

        const removeValue = (value: string) => {
          const updatedValues = { ...values };
          const selectedField = Object.keys(updatedValues).find((field) =>
            updatedValues[field].includes(value)
          );

          if (selectedField && Array.isArray(updatedValues[selectedField])) {
            updatedValues[selectedField] = (
              updatedValues[selectedField] as string[]
            ).filter((v: string) => v !== value);
          }
          setValues(updatedValues);
        }; // removes a value from the selected values and updates the formik values

        // Apply search filter
        const searchValue = values["searchBox"] || "";
        if (searchValue) {
          filteredEventsToShow = filteredEventsToShow.filter((event) => {
            const { fields } = event;
            const { title } = fields;
            return title.toLowerCase().includes(searchValue.toLowerCase());
          });
        }

        // Apply sort filter
        const sortByValue = values["sortBy"] || "";
        if (sortByValue) {
          filteredEventsToShow = filteredEventsToShow.sort((a, b) => {
            const dateA = new Date(a.fields.startDate).getTime();
            const dateB = new Date(b.fields.startDate).getTime();

            if (isNaN(dateA) || isNaN(dateB)) {
              return 0; // If either date is invalid, treat them as equal
            }
            // Ascending order
            if (sortByValue === "asc") {
              return dateA - dateB;
            }

            // Descending order
            return dateB - dateA;
          });
        }

        // Apply other filters (except sortBy and searchBox)
        filters.forEach(({ filterType = "" }) => {
          if (filterType === "searchBox" || filterType === "sortBy") {
            return; // Skip searchBox and sortBy in this step
          }

          const selectedValues: string[] = Array.isArray(values[filterType])
            ? values[filterType]
            : [];
          if (selectedValues.length > 0) {
            filteredEventsToShow = filteredEventsToShow.filter((event) => {
              const { fields } = event;

              // Check if the event matches any selected values for the current filterType
              return selectedValues.some((selectedValue) => {
                // Ensure the key exists in fields
                if (filterType in fields) {
                  const fieldValue = fields[filterType as keyof typeof fields];
                  if (Array.isArray(fieldValue)) {
                    return (fieldValue as string[])
                      .map((val) => val.toLowerCase())
                      .includes(selectedValue.toLowerCase());
                  } else {
                    return (
                      typeof fieldValue === "string" &&
                      fieldValue.toLowerCase() === selectedValue.toLowerCase()
                    );
                  }
                }
                return false; // Return false if filterType doesn't exist in fields
              });
            });
          }
        });

        // Update URL when values change
        useEffect(() => {
          if (syncFiltersWithUrl) {
            updateUrl(values, filters);
          }
        }, [values, filters, syncFiltersWithUrl]);

        return (
          <Form>
            <Row>
              <Col
                md={4}
                lg={4}
                xl={4}
                sm={12}
                className={cx("sticky-filter", "filter-sticky-section", {
                  sticky,
                })}
              >
                <div>
                  <FilterEventsDesktop {...props} />
                  <FilterEventsMobile
                    {...props}
                    selectedFilters={selectedValues}
                    onRemoveSelectedFilter={removeValue}
                  />
                </div>
              </Col>
              <Col md={8} lg={8} xl={8} sm={12}>
                <div
                  className={cx(
                    "selected-filters",
                    "selected-filter",
                    "show-on-desktop",
                    {
                      selectedFiltersSticky,
                    }
                  )}
                >
                  {selectedValues.length > 0 && (
                    <SelectedFilter
                      seletedFilters={selectedValues}
                      res={res}
                      onRemove={(value) => {
                        removeValue(value);
                      }}
                    />
                  )}
                </div>

                {filteredEventsToShow.length === 0 && (
                  <div className={cx("noResults")}>{res("noResults")}</div>
                )}

                {filteredEventsToShow.map((event, idx) => {
                  const { fields } = event;
                  const {
                    cardImage,
                    formattedDate,
                    title,
                    eventDetails,
                    eventPageSlug,
                  } = fields;

                  return (
                    <div key={idx} className={cx("eventCard")}>
                      <div className={cx("eventCardImage")}>
                        {cardImage && (
                          <ResponsiveImage
                            image={cardImage}
                            alt="Event Card Image"
                          />
                        )}
                      </div>
                      <div className={cx("eventCardText")}>
                        <div className={cx("eventCardDate", "eyeBrow")}>
                          {formattedDate}
                        </div>
                        {title && (
                          <h2 className={cx("eventCardTitle", "displayTitle5")}>
                            {title}
                          </h2>
                        )}

                        <div className={cx("eventCardDetails", "bodyText")}>
                          {eventDetails &&
                            eventDetails.map(({ label, value, show }) => {
                              return (
                                show && (
                                  <p key={label}>
                                    {res(label)}:{" "}
                                    {Array.isArray(value)
                                      ? value.map((v) => res(v)).join(", ")
                                      : res(value)}
                                  </p>
                                )
                              );
                            })}
                        </div>
                        {eventPageSlug && (
                          <div className={cx("eventCardCTA")}>
                            <Link href={eventPageSlug}>
                              <div
                                role="button"
                                className={btncx(
                                  "btn styledButton buttonText primary"
                                )}
                                style={
                                  {
                                    "--btnHeight": "var(--btnHeight-md)",
                                    "--btnPadding": "var(--btnPadding-md)",
                                    "--btnFontSize": "var(--btnFontSize-md)",
                                    "--btnColor":
                                      "var(--btnColor-heritage-blue)",
                                    "--btnHoverColor":
                                      "var(--btnHoverColor-heritage-blue)",
                                  } as React.CSSProperties
                                }
                              >
                                <span className="buttonText">
                                  {res("discoverMore")}
                                </span>
                              </div>
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </Col>
            </Row>
          </Form>
        );
      }}
    </Formik>
  );
};

export default EventListFilter;

// helper functions

interface HandleStickyProps {
  clientId: string;
  setSticky: (value: boolean) => void;
  setSelectedFiltersSticky: (value: boolean) => void;
}

const handleSticky = ({
  clientId,
  setSticky,
  setSelectedFiltersSticky,
}: HandleStickyProps) => {
  const container = document.getElementById(
    `event-list-${clientId}`
  ) as HTMLElement;
  const filterSection = document.querySelector(
    ".filter-sticky-section"
  ) as HTMLElement;
  const selectedFilters = document.querySelector(
    ".selected-filters"
  ) as HTMLElement;
  const scrollTop = window.scrollY;
  const topNavHeight = domUtil.getTopNavHeight();

  if (!container || !filterSection || !selectedFilters) {
    console.warn("One or more elements are missing. Skipping sticky logic.");
    return;
  }

  const nextElement = domUtil.getNextElementSibling(container);
  const nextElementTop = nextElement?.getBoundingClientRect().top || 200;
  const containerBottom = container?.getBoundingClientRect().bottom || 0;
  const totalHeight = topNavHeight - containerBottom + nextElementTop;

  const sectionBottom = containerBottom + scrollTop - totalHeight;

  const stickyThreshold =
    filterSection.getBoundingClientRect().top + scrollTop - topNavHeight;
  filterSection.style.setProperty("--topNavHeight", `${topNavHeight}`);
  setSticky(scrollTop >= stickyThreshold && scrollTop <= sectionBottom);

  const filterPanelWidth =
    filterSection.children[0]?.getBoundingClientRect().width;
  selectedFilters.style.setProperty(
    "--filterPanelLeft",
    `${filterSection.children[0]?.getBoundingClientRect().right}px`
  );
  selectedFilters.style.setProperty(
    "--filterPanelWidth",
    `${filterPanelWidth}`
  );
  selectedFilters.style.setProperty("--topNavHeight", `${topNavHeight}`);
  const selectedFiltersHeight =
    selectedFilters.children[0]?.getBoundingClientRect().height;
  selectedFilters.style.setProperty(
    "--selectedFiltersHeight",
    `${selectedFiltersHeight}`
  );

  const selectedFiltersStickyThreshold =
    selectedFilters.getBoundingClientRect().top + scrollTop - topNavHeight;
  setSelectedFiltersSticky(
    scrollTop >= selectedFiltersStickyThreshold && scrollTop <= sectionBottom
  );
};

// Custom checkbox component
interface CustomCheckboxProps {
  filterType: string;
  value: string;
  keyVal: string;
  isChecked: boolean;
  onChange: () => void;
}

export const CustomCheckbox = ({
  filterType,
  value,
  isChecked,
  keyVal,
  onChange,
}: CustomCheckboxProps) => {
  return (
    <label className={cx("checkboxLabel")}>
      <Field
        name={filterType}
        type="checkbox"
        className={cx("customCheckboxInput")}
        value={keyVal}
        checked={isChecked}
        onChange={onChange}
      />
      <span className={cx("customCheckbox", { checked: isChecked })}>
        {isChecked && <CheckBoxDone />}
      </span>
      {value}
    </label>
  );
};

// Custom selected filter component
interface SelectedFilterProps {
  seletedFilters: string[];
  onRemove: (e: string) => void;
  res: (s: string) => string;
}

export const SelectedFilter = ({
  seletedFilters,
  onRemove,
  res,
}: SelectedFilterProps) => {
  return (
    <div className={cx("selectedFilters")}>
      {seletedFilters.map((value, index) => {
        return (
          <div key={index} className={cx("selectedFilter")}>
            <div className={cx("selectedFilterButton")}>
              <span className={cx("buttonText")}>{res(value) || value}</span>
              <CloseCrossIcon
                color="#fff"
                onClick={() => {
                  onRemove(value);
                }}
                width={18}
                height={18}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

const getShouldDisableSticky = (
  isMobileDevice: boolean,
  disableStickyFilters: string
) => {
  return (
    (disableStickyFilters === "Mobile" && isMobileDevice) ||
    (disableStickyFilters === "Desktop" && !isMobileDevice) ||
    disableStickyFilters === "Both"
  );
};
