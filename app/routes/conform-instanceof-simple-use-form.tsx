import { useActionData } from "@remix-run/react";
import { json, type ActionFunctionArgs } from "@remix-run/node";
import { z } from "zod";
import { parseWithZod } from "@conform-to/zod";
import { getFormProps, getInputProps, useForm } from "@conform-to/react";

const schema = z.object({ file: z.instanceof(File) });

export const action = async ({ request }: ActionFunctionArgs) => {
  const submission = parseWithZod(await request.formData(), { schema });
  if (submission.status !== "success") {
    return json({
      lastResult: submission.reply(),
      node_version: process.version,
    });
  }

  return json({
    message: "File uploaded successfully",
    file: {
      name: submission.value.file.name,
      size: submission.value.file.size,
      type: submission.value.file.type,
    },
    lastResult: submission.reply({ resetForm: true }),
    node_version: process.version,
  });
};

export default function Index() {
  const actionData = useActionData<typeof action>();
  const [form, { file }] = useForm({
    lastResult: actionData?.lastResult,
    onValidate: ({ formData }) => parseWithZod(formData, { schema }),
  });

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>conform instanceof File</h1>

      <form method="post" encType="multipart/form-data" {...getFormProps(form)}>
        <input {...getInputProps(file, { type: "file" })} />
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
