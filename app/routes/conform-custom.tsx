import { unstable_createMemoryUploadHandler } from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import {
  json,
  unstable_parseMultipartFormData,
  type ActionFunctionArgs,
} from "@vercel/remix";
import { z } from "zod";
import { parseWithZod } from "@conform-to/zod";

const schema = z.object({ file: z.custom<File>() });

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await unstable_parseMultipartFormData(
    request,
    unstable_createMemoryUploadHandler()
  );
  const submission = parseWithZod(formData, { schema });

  return json({
    message: `File uploaded ${
      submission.status === "success" ? "successfully" : "unsuccessfully"
    }.`,
    isFile:
      submission.status === "success"
        ? submission.value.file instanceof File
        : false,
    file:
      submission.status === "success"
        ? {
            name: submission.value.file.name,
            size: submission.value.file.size,
            type: submission.value.file.type,
          }
        : null,
    error: submission.status === "error" ? submission.error : null,
  });
};

export default function Index() {
  const actionData = useActionData<typeof action>();

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>conform custom&lt;File&gt;</h1>

      <form method="post" encType="multipart/form-data">
        <input type="file" name="file" />
        <button type="submit">Submit</button>
      </form>

      {actionData ? (
        <pre>{JSON.stringify(actionData, null, 2)}</pre>
      ) : (
        <p>No file uploaded yet.</p>
      )}
    </div>
  );
}
