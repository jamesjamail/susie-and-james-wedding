"use client"

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
type Invitee = {
  id: string;
  fields: {
    guest_1_name: string;
    guest_2_name?: string;
    invited_to_prdd?: boolean;
  };
};

type Guest = {
  name: string;
  attendingWedding: string;
  attendingPRDD: string;
  email: string;
  dietary: string;
  notes: string;
};

type FieldError = {
  attendingWedding: boolean;
  attendingPRDD: boolean;
  email: boolean;
  dietary: boolean;
};
import styles from "./page.module.scss";

async function fetchAllInvitees(): Promise<Invitee[]> {
  const res = await fetch(
    "https://aged-sea-7902.javascriptjames89.workers.dev/get-invitees",
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const data = await res.json();
  // Use invitees key, filter out empty fields or missing guest_1_name
  return (data.invitees || []).filter(
    (inv: Invitee) => inv.fields && inv.fields.guest_1_name
  );
}

function RSVP() {
  const [nameQuery, setNameQuery] = useState<string>("");
  const [allInvitees, setAllInvitees] = useState<Invitee[]>([]);
  const [inviteeOptions, setInviteeOptions] = useState<Invitee[]>([]);
  const [selectedInvitee, setSelectedInvitee] = useState<Invitee | null>(null);
  // RSVP state per guest
  const [guests, setGuests] = useState<Guest[]>([]);
  const [submitting, setSubmitting] = useState(false);
  // const [submitted, setSubmitted] = useState(false); // removed unused variable
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [fieldErrors, setFieldErrors] = useState<FieldError[]>([]);
  // Humanity Check field (for the whole form)
  const [humanityCheck, setHumanityCheck] = useState<string>("");

  // Fetch all invitees once on mount
  useEffect(() => {
    fetchAllInvitees().then((records: Invitee[]) => setAllInvitees(records));
  }, []);

  // Filter invitees client-side for autocomplete
  useEffect(() => {
    if (nameQuery.length < 2) {
      setInviteeOptions([]);
      return;
    }
    const filtered = allInvitees.filter(
      (inv: Invitee) => {
        const party = [inv.fields.guest_1_name, inv.fields.guest_2_name].filter(Boolean).join(" & ");
        return party.toLowerCase().includes(nameQuery.toLowerCase());
      }
    );
    setInviteeOptions(filtered);
  }, [nameQuery, allInvitees]);

  // When invitee selected, initialize guests state
  useEffect(() => {
    if (!selectedInvitee) {
      setGuests([]);
      return;
    }
    const guestNames = [selectedInvitee.fields.guest_1_name, selectedInvitee.fields.guest_2_name].filter((n): n is string => typeof n === "string" && n.length > 0);
    setGuests(
      guestNames.map((name) => ({
        name,
        attendingWedding: "",
        attendingPRDD: "",
        email: "",
        dietary: "",
        notes: "",
      }))
    );
    setFieldErrors(guestNames.map(() => ({ attendingWedding: false, attendingPRDD: false, email: false, dietary: false })));
  }, [selectedInvitee]);

  const getPartyName = (invitee: Invitee | null) => {
    if (!invitee) return "";
    return [invitee.fields.guest_1_name, invitee.fields.guest_2_name].filter(Boolean).join(" & ");
  };

  // Handlers for per-guest RSVP fields
  const handleGuestFieldChange = (idx: number, field: keyof Guest, value: string) => {
    setGuests((prev: Guest[]) => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], [field]: value };
      return updated;
    });
    setFieldErrors((prev: FieldError[]) => {
      if (!prev[idx]) return prev;
      const updated = [...prev];
      updated[idx] = { ...updated[idx], [field]: false };
      return updated;
    });
  };

  const [submitError, setSubmitError] = useState("");
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormErrors([]);
    setSubmitError("");
    const errors: string[] = [];
    let hasError = false;
    // Humanity check: only require that it is populated
    if (!humanityCheck || humanityCheck.trim() === "") {
      errors.push("Please answer the humanity check question.");
      hasError = true;
    }
    const newFieldErrors: FieldError[] = guests.map((guest) => {
      const fieldErrs: FieldError = { attendingWedding: false, attendingPRDD: false, email: false, dietary: false };
      // Wedding RSVP required
      if (!guest.attendingWedding) {
        fieldErrs.attendingWedding = true;
        hasError = true;
      }
      // PRDD RSVP required if invited
      if (selectedInvitee && selectedInvitee.fields.invited_to_prdd && !guest.attendingPRDD) {
        fieldErrs.attendingPRDD = true;
        hasError = true;
      }
      // Email required and must be valid
      if (!guest.email || !/^\S+@\S+\.\S+$/.test(guest.email)) {
        fieldErrs.email = true;
        hasError = true;
      }
      // Dietary restriction required
      if (!guest.dietary || guest.dietary === "") {
        fieldErrs.dietary = true;
        errors.push("Please select a dietary restriction for each guest.");
        hasError = true;
      }
      return fieldErrs;
    });
    setFieldErrors(newFieldErrors);
    // Add a single error for missing/invalid guest fields
    if (guests.length > 0 && newFieldErrors.some(f => f.attendingWedding || f.attendingPRDD || f.email)) {
      errors.push("Please complete all required fields for each guest.\nMake sure to select attending/not attending for each event and enter a valid email address.");
    }
    if (hasError) {
      setFormErrors(errors);
      return;
    }
    setSubmitting(true);
    // Prepare array of guest data
    const guestPayload = guests.map((guest) => ({
      name: guest.name,
      email: guest.email,
      attending_wedding: guest.attendingWedding === "Attending",
      attending_prdd: guest.attendingPRDD === "Attending",
      dietary_restrictions: guest.dietary,
      notes: guest.notes,
    }));
    try {
      const response = await fetch("https://aged-sea-7902.javascriptjames89.workers.dev/record-rsvp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          humanityCheck,
          data: guestPayload,
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        setSubmitSuccess(false);
        // setSubmitted(false); // removed unused variable
        // Show error from server if available
        setSubmitError(result?.message || "Sorry, there was a problem submitting your RSVP. Please try again or contact us for help.");
      } else {
        setSubmitSuccess(true);
        // setSubmitted(true); // removed unused variable
      }
    } catch (error) {
      console.error("Error submitting RSVP:", error);
      setSubmitSuccess(false);
      setSubmitError("Sorry, there was a problem submitting your RSVP. Please try again or contact us for help.");
    }
    setSubmitting(false);
  };

  return (
    <div className="page">
      <main className="main">
        <h1>R S V P</h1>
        {submitSuccess ? (
          <div className={styles.successPage}>
            <h2>Thanks for your RSVP.</h2>
            <p>
              A confirmation has been emailed to you.<br />
              We look forward to celebrating with you soon!
            </p>
          </div>
        ) : (
          !selectedInvitee ? (
            <div className={styles.inviteeSearch}>
              <label htmlFor="invitee-search">Please enter your name:</label>
              <input
                id="invitee-search"
                type="text"
                value={nameQuery}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setNameQuery(e.target.value);
                }}
                autoComplete="off"
                placeholder="Enter your name"
              />
              {inviteeOptions.length > 0 && (
                <ul className={styles.inviteeOptions}>
                  {inviteeOptions.map((inv: Invitee) => (
                    <li
                      key={inv.id}
                      className={styles.inviteeOption}
                      onClick={() => {
                        setSelectedInvitee(inv);
                        setNameQuery(getPartyName(inv));
                      }}
                    >
                      {getPartyName(inv)}
                    </li>
                  ))}
                </ul>
              )}
              <div className={styles.helpMsg}>
                Can't find your name? <a href="/get-in-touch">Get in touch.</a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className={styles.rsvpForm}>
              <h2 className={styles.partyGreeting}>Hello, {getPartyName(selectedInvitee)}!</h2>

              {guests.map((guest, idx) => {
                const isInvitedToPRDD = Boolean(selectedInvitee.fields.invited_to_prdd);
                return (
                  <div key={guest.name} className={styles.eventCard}>
                    <span className={styles.guestName}>{guest.name}</span>
                    {isInvitedToPRDD && (
                      <>
                        <strong>Post Rehearsal Dinner Drinks</strong>
                        <div className={styles.eventDetails}>
                          <div><strong>Date:</strong> 10/24/2025 - 6:00pm</div>
                          <div>
                            <strong>Location:</strong>{" "}
                            <a
                              href="https://maps.app.goo.gl/J9gotuYJtRrsqNRw9"
                              target="_blank"
                              rel="noopener noreferrer"
                              className={styles.eventLocationLink}
                            >
                              Headliner&apos;s Club
                            </a>
                          </div>
                        </div>
                        <div className={styles.rsvpRadios}>
                          <label
                            className={`${styles.rsvpRadioLabel} ${guest.attendingPRDD === "Attending" ? styles.selected : ""}`}
                            style={fieldErrors[idx]?.attendingPRDD ? { border: "2px solid #c00" } : {}}
                          >
                            <input
                              type="radio"
                              name={`attendingPRDD-${idx}`}
                              value="Attending"
                              checked={guest.attendingPRDD === "Attending"}
                              onChange={() => handleGuestFieldChange(idx, "attendingPRDD", "Attending")}
                            />
                            Attending
                          </label>
                          <label
                            className={`${styles.rsvpRadioLabel} ${guest.attendingPRDD === "Not Attending" ? styles.selected : ""}`}
                            style={fieldErrors[idx]?.attendingPRDD ? { border: "2px solid #c00" } : {}}
                          >
                            <input
                              type="radio"
                              name={`attendingPRDD-${idx}`}
                              value="Not Attending"
                              checked={guest.attendingPRDD === "Not Attending"}
                              onChange={() => handleGuestFieldChange(idx, "attendingPRDD", "Not Attending")}
                            />
                            Not Attending
                          </label>
                        </div>
                      </>
                    )}
                    <strong>Wedding Ceremony & Reception</strong>
                    <div className={styles.eventDetails}>
                      <div><strong>Date:</strong> 10/25/2025 - 5:00pm</div>
                      <div>
                        <strong>Location:</strong>{" "}
                        <a
                          href="https://maps.app.goo.gl/ZBreTjNAubNwyw8J7"
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.eventLocationLink}
                        >
                          Pecan Springs Ranch
                        </a>
                      </div>
                    </div>
                    <div className={styles.rsvpRadios}>
                      <label
                        className={`${styles.rsvpRadioLabel} ${guest.attendingWedding === "Attending" ? styles.selected : ""}`}
                        style={fieldErrors[idx]?.attendingWedding ? { border: "2px solid #c00" } : {}}
                      >
                        <input
                          type="radio"
                          name={`attendingWedding-${idx}`}
                          value="Attending"
                          checked={guest.attendingWedding === "Attending"}
                          onChange={() => handleGuestFieldChange(idx, "attendingWedding", "Attending")}
                        />
                        Attending
                      </label>
                      <label
                        className={`${styles.rsvpRadioLabel} ${guest.attendingWedding === "Not Attending" ? styles.selected : ""}`}
                        style={fieldErrors[idx]?.attendingWedding ? { border: "2px solid #c00" } : {}}
                      >
                        <input
                          type="radio"
                          name={`attendingWedding-${idx}`}
                          value="Not Attending"
                          checked={guest.attendingWedding === "Not Attending"}
                          onChange={() => handleGuestFieldChange(idx, "attendingWedding", "Not Attending")}
                        />
                        Not Attending
                      </label>
                    </div>
                    <label htmlFor={`email-${idx}`}><strong>Email*</strong></label>
                    <input
                      id={`email-${idx}`}
                      type="email"
                      className={styles.styledInput}
                      value={guest.email}
                      onChange={(e) => handleGuestFieldChange(idx, "email", e.target.value)}
                      placeholder="Enter your email"
                      style={fieldErrors[idx]?.email ? { border: "2px solid #c00" } : {}}
                    />
                    <label htmlFor={`dietary-${idx}`}><strong>Dietary Restrictions</strong></label>
                    <select
                      id={`dietary-${idx}`}
                      className={`${styles.styledInput} ${fieldErrors[idx]?.dietary ? styles.fieldError : ""}`}
                      value={guest.dietary}
                      onChange={(e) => handleGuestFieldChange(idx, "dietary", e.target.value)}
                      disabled={guest.attendingWedding === "Not Attending"}
                    >
                      <option value="">Select dietary restriction</option>
                      <option value="none">None</option>
                      <option value="vegan">Vegan</option>
                      <option value="vegetarian">Vegetarian</option>
                      <option value="gluten free">Gluten Free</option>
                    </select>
                    <label htmlFor={`notes-${idx}`}><strong>Anything else we should know?</strong></label>
                    <textarea
                      id={`notes-${idx}`}
                      className={styles.styledTextarea}
                      value={guest.notes}
                      onChange={(e) => handleGuestFieldChange(idx, "notes", e.target.value)}
                      placeholder="Share any other info with us!"
                    />
                  </div>
                );
              })}
              {/* Humanity Check field (for the whole form) */}
              <div className={styles.eventCard}>
                <label htmlFor="humanity-check">
                  <strong>Prove your humanity<span>*</span></strong>
                </label>
                <input
                  id="humanity-check"
                  type="text"
                  className={styles.styledInput}
                  value={humanityCheck}
                  onChange={(e) => setHumanityCheck(e.target.value)}
                  placeholder="What city is the wedding taking place in?"
                  style={formErrors.some(e => e.toLowerCase().includes('humanity check')) ? { border: "2px solid #c00" } : {}}
                  autoComplete="off"
                />
              </div>
              {/* Render all form validation errors and submitError, each on a new line with consistent styling */}
              {(formErrors.length > 0 || submitError) && (
                <div className={styles.formErrors}>
                  {formErrors.map((err, i) => (
                    <span key={i} className={styles.formErrorLine}>{err}</span>
                  ))}
                  {submitError && <span className={styles.formErrorLine}>{submitError}</span>}
                </div>
              )}
              {/* Move errorPage here, below RSVP inputs and above submit button */}
              {submitError && (
                <div className={styles.errorPage}>
                  <h2>RSVP Submission Error</h2>
                  <p>{submitError}</p>
                  <button className={styles.submitBtn} onClick={() => setSubmitError("")}>Try Again</button>
                </div>
              )}
              <div className={styles.submitContainer}>
                <button type="button" className={styles.changeNameBtn} onClick={() => setSelectedInvitee(null)}>
                  Go Back
                </button>
                <button type="submit" className={styles.submitBtn} disabled={submitting}>
                  {submitting ? "Submitting..." : "Submit RSVP"}
                </button>
              </div>
            </form>
          )
        )}
      </main>
    </div>
  );
}

export default RSVP;
