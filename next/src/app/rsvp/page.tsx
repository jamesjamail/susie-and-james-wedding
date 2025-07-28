"use client"

import React, { useState, useEffect } from "react";
import styles from "./page.module.scss";

const EVENTS_TABLE = "Events";
const RSVPS_TABLE = "RSVPs";

      
async function fetchAllInvitees() {
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
    (inv: any) => inv.fields && inv.fields.guest_1_name
  );
}

function RSVP() {
  const [nameQuery, setNameQuery] = useState("");
  const [allInvitees, setAllInvitees] = useState<any[]>([]);
  const [inviteeOptions, setInviteeOptions] = useState<any[]>([]);
  const [selectedInvitee, setSelectedInvitee] = useState<any>(null);
  // RSVP state per guest
  const [guests, setGuests] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formError, setFormError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<any[]>([]);

  // Fetch all invitees once on mount
  useEffect(() => {
    fetchAllInvitees().then((records) => setAllInvitees(records));
  }, []);

  // Filter invitees client-side for autocomplete
  useEffect(() => {
    if (nameQuery.length < 2) {
      setInviteeOptions([]);
      return;
    }
    const filtered = allInvitees.filter(
      (inv) => {
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
    const guestNames = [selectedInvitee.fields.guest_1_name, selectedInvitee.fields.guest_2_name].filter(Boolean);
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
    setFieldErrors(guestNames.map(() => ({ attendingWedding: false, attendingPRDD: false, email: false })));
  }, [selectedInvitee]);

  const getPartyName = (invitee: any) => {
    if (!invitee) return "";
    return [invitee.fields.guest_1_name, invitee.fields.guest_2_name].filter(Boolean).join(" & ");
  };

  // Handlers for per-guest RSVP fields
  const handleGuestFieldChange = (idx: number, field: string, value: string) => {
    setGuests((prev) => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], [field]: value };
      return updated;
    });
    setFieldErrors((prev) => {
      if (!prev[idx]) return prev;
      const updated = [...prev];
      updated[idx] = { ...updated[idx], [field]: false };
      return updated;
    });
  };

  const [submitError, setSubmitError] = useState("");
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setSubmitError("");
    let hasError = false;
    const newFieldErrors = guests.map((guest, idx) => {
      const errors: any = { attendingWedding: false, attendingPRDD: false, email: false };
      // Wedding RSVP required
      if (!guest.attendingWedding) {
        errors.attendingWedding = true;
        hasError = true;
      }
      // PRDD RSVP required if invited
      if (selectedInvitee.fields.invited_to_prdd && !guest.attendingPRDD) {
        errors.attendingPRDD = true;
        hasError = true;
      }
      // Email required and must be valid
      if (!guest.email || !/^\S+@\S+\.\S+$/.test(guest.email)) {
        errors.email = true;
        hasError = true;
      }
      return errors;
    });
    setFieldErrors(newFieldErrors);
    if (hasError) {
      setFormError("Please complete all required fields for each guest. Make sure to select attending/not attending for each event and enter a valid email address.");
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
        body: JSON.stringify(guestPayload),
      });
      if (!response.ok) {
        setSubmitSuccess(false);
        setSubmitted(false);
        setSubmitError("Sorry, there was a problem submitting your RSVP. Please try again or contact us for help.");
      } else {
        setSubmitSuccess(true);
        setSubmitted(true);
      }
    } catch (err) {
      setSubmitSuccess(false);
      setSubmitted(false);
      setSubmitError("Sorry, there was a problem submitting your RSVP. Please try again or contact us for help.");
    }
    setSubmitting(false);
  };

  return (
    <div className="page">
      <main className="main">
        <h1>R S V P</h1>
        {submitError ? (
          <div className={styles.errorPage}>
            <h2>RSVP Submission Error</h2>
            <p>{submitError}</p>
            <button className={styles.submitBtn} onClick={() => setSubmitError("")}>Try Again</button>
          </div>
        ) : submitSuccess ? (
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
                onChange={(e) => {
                  setNameQuery(e.target.value);
                  setSubmitted(false);
                }}
                autoComplete="off"
                placeholder="Enter your name"
              />
              {inviteeOptions.length > 0 && (
                <ul className={styles.inviteeOptions}>
                  {inviteeOptions.map((inv) => (
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
            </div>
          ) : (
            <form onSubmit={handleSubmit} className={styles.rsvpForm}>
              <h2 className={styles.partyGreeting}>Hello, {getPartyName(selectedInvitee)}!</h2>
              {formError && (
                <div style={{ color: "#c00", marginBottom: "18px", textAlign: "center", fontWeight: 500 }}>
                  {formError}
                </div>
              )}
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
                              Headliner's Club
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
                    <label htmlFor={`email-${idx}`}><strong>Email</strong></label>
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
                    <input
                      id={`dietary-${idx}`}
                      type="text"
                      className={styles.styledInput}
                      value={guest.dietary}
                      onChange={(e) => handleGuestFieldChange(idx, "dietary", e.target.value)}
                      placeholder="Let us know if you have any dietary restrictions"
                      disabled={guest.attendingWedding === "Not Attending"}
                    />
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
              <div className={styles.submitContainer}>
                <button type="button" className={styles.changeNameBtn} onClick={() => setSelectedInvitee(null)}>
                  Not you? Change name
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
