import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

interface RequestBody {
  name: string;
  message: string;
  humanityCheck: string; // Add new field
}

interface AirtableRecord {
  fields: {
    Name: string;
    Message: string;
    Timestamp: string;
  };
}

interface AirtablePayload {
  records: AirtableRecord[];
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  if (req.method !== "POST") {
    return NextResponse.json(
      { message: "Method Not Allowed" },
      { status: 405 }
    );
  }

  const { name, message, humanityCheck }: RequestBody = await req.json();

  if (!name || !message || !humanityCheck) {
    return NextResponse.json(
      { message: "All fields are required" },
      { status: 400 }
    );
  }

  // Check humanityCheck length
  if (humanityCheck.trim().length > 20) {
    return NextResponse.json(
      { message: "Humanity check answer is too long" },
      { status: 400 }
    );
  }

  // Check humanityCheck value
  if (!humanityCheck.toLowerCase().includes("austin")) {
    return NextResponse.json(
      { message: "Incorrect answer to humanity check" },
      { status: 400 }
    );
  }

  try {
    const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY as string;
    const BASE_ID = process.env.AIRTABLE_BASE_ID as string;
    const TABLE_NAME = "Messages";

    console.log(`https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`);

    const payload: AirtablePayload = {
      records: [
        {
          fields: {
            Name: name,
            Message: message,
            Timestamp: new Date().toISOString(),
          },
        },
      ],
    };

    await axios.post(
      `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json({ message: "Success" }, { status: 200 });
  } catch (error) {
    console.error("Error saving data to Airtable:", error);
    return NextResponse.json({ message: "Error saving data" }, { status: 500 });
  }
}
