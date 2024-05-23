import { unstable_createMemoryUploadHandler } from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import {
  json,
  unstable_parseMultipartFormData,
  type ActionFunctionArgs,
} from "@vercel/remix";
import { z } from "zod";

const schema = z.instanceof(File);

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await unstable_parseMultipartFormData(
    request,
    unstable_createMemoryUploadHandler()
  );
  const file = schema.safeParse(formData.get("file"));
  if (!file.success) {
    return json({ errors: file.error, node_version: process.version });
  }

  return json({
    message: "File uploaded successfully",
    isFile: file.data instanceof File,
    file: {
      name: file.data.name,
      size: file.data.size,
      type: file.data.type,
    },
    node_version: process.version,
  });
};

export default function Index() {
  const actionData = useActionData<typeof action>();

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>zod instanceof File</h1>

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
