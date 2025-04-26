import { tcg } from "@/lib/services/tcgApi";
import { getLocale } from "next-intl/server";
import { responseStatus } from "./responseStatus";
import { responseSample } from "./responseSample";

const functionList = [
  "createUser",
  "updatePassword",
  "getBalance",
  "userTransfer",
  "checkTransfer",
  "getLaunchGameRng",
  "getLaunchGameLottery",
  "getGameList",
  "getGameRank",
  "getBetDetails",
  "getBetDetailsMember",
  "getLottoTxByMember",
  "getLottoCode",
  "kickOutLottoMember",
  "fundTransferOutAll",
  "getLiveModelInfo",
];

export async function POST(
  request: Request,
  { params }: { params: Promise<{ method: string }> },
) {
  const { method } = await params;
  const locale = await getLocale();

  try {
    if (!functionList.includes(method)) {
      return new Response(
        JSON.stringify({
          status: 400,
          message: "Invalid method",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }

    if (request.headers.get("content-type") !== "application/json") {
      console.error("Invalid content type");
      return new Response(
        JSON.stringify({
          status: 400,
          message: "Invalid content type",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }
    const data = await request.json();

    if (data.testMode) {
      // For testing purposes, return a sample response
      console.log("start testMode");
      const sampleData = responseSample[method] ?? {};
      return new Response(JSON.stringify(sampleData), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
    const result = await tcg[method](data);

    const supportedLanguages = ["en", "zh", "tc"];
    const lang = supportedLanguages.includes(locale) ? locale : "tc";
    const responseStatusMessage =
      responseStatus[result.status]?.[lang] || "Unknown error";

    const response = new Response(
      JSON.stringify({
        ...result,
        message: responseStatusMessage,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    return response;
  } catch (error) {
    console.error("Error in API route:", error);
    return new Response(
      JSON.stringify({
        status: 500,
        message: "Internal server error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }
}
