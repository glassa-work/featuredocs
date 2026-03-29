import { NextRequest, NextResponse } from "next/server";
import { getFeedbackList, updateFeedbackStatus } from "@/lib/feedback-db";
import type { FeedbackItem } from "@/lib/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const product = searchParams.get("product") ?? undefined;
    const status = searchParams.get("status") ?? undefined;
    const type = searchParams.get("type") ?? undefined;

    const feedback = getFeedbackList({ product, status, type });
    return NextResponse.json(feedback);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch feedback" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.id || typeof body.id !== "number") {
      return NextResponse.json(
        { error: "id is required and must be a number" },
        { status: 400 }
      );
    }

    const validStatuses: FeedbackItem["status"][] = [
      "open",
      "acknowledged",
      "fixed",
      "dismissed",
    ];
    if (!body.status || !validStatuses.includes(body.status)) {
      return NextResponse.json(
        {
          error: `status must be one of: ${validStatuses.join(", ")}`,
        },
        { status: 400 }
      );
    }

    const updated = updateFeedbackStatus(body.id, body.status);
    if (!updated) {
      return NextResponse.json(
        { error: "Feedback not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: "Failed to update feedback" },
      { status: 500 }
    );
  }
}
