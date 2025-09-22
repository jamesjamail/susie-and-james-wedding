"use client"

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { setRsvpCompleted } from "@/components/RSVPBanner/RSVPBanner";
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
      // Dietary restriction required ONLY if attending wedding
      if (guest.attendingWedding === "Attending" && (!guest.dietary || guest.dietary === "")) {
        fieldErrs.dietary = true;
        errors.push("Please select a dietary restriction for each guest attending the wedding.");
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
    const isInvitedToPRDD = selectedInvitee && selectedInvitee.fields.invited_to_prdd;
    const guestPayload = guests.map((guest) => ({
      name: guest.name,
      email: guest.email,
      attending_wedding: guest.attendingWedding === "Attending",
      attending_prdd: isInvitedToPRDD
        ? (guest.attendingPRDD === "Attending")
        : null,
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
        // Show error from server if available
        setSubmitError(result?.message || "Sorry, there was a problem submitting your RSVP. Please try again or contact us for help.");
      } else {
        setSubmitSuccess(true);
        // Mark RSVP completed locally so the banner no longer appears
        setRsvpCompleted();
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
        <h1 className={styles.header}>R S V P</h1>        
          <div className={styles.deadlineNotice}>The RSVP window has closed. Please contact us directly if needed.</div>
          <a href="/get-in-touch" className={styles.getInTouchLink}>
            <button>Get In Touch</button>
          </a>
      </main>
    </div>
  );
}

export default RSVP;
