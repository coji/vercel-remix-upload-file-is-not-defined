import { useActionData } from "@remix-run/react";
import { json, type ActionFunctionArgs } from "@vercel/remix";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const file = formData.get("file") as File;

  return json({
    message: "File uploaded successfully",
    isFile: file instanceof File,
    file: file
      ? {
          name: file.name,
          size: file.size,
          type: file.type,
        }
      : null,
    node_version: process.version,
  });
};

export default function Index() {
  const actionData = useActionData<typeof action>();

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>vanilla</h1>

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
