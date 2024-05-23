import { useActionData } from "@remix-run/react";
import { json, type ActionFunctionArgs } from "@remix-run/node";
import { z } from "zod";
import { parseWithZod } from "@conform-to/zod";

const schema = z.object({ file: z.instanceof(File) });

export const action = async ({ request }: ActionFunctionArgs) => {
  const submission = parseWithZod(await request.formData(), { schema });
  if (submission.status !== "success") {
    return json({ lastResult: submission.reply() });
  }

  return json({
    message: "File uploaded successfully",
    file: {
      name: submission.value.file.name,
      size: submission.value.file.size,
      type: submission.value.file.type,
    },
    lastResult: submission.reply({ resetForm: true }),
  });
};

export default function Index() {
  const actionData = useActionData<typeof action>();

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>conform instanceof File</h1>

      <form method="post" encType="multipart/form-data">
        <input name="file" type="file" />
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
