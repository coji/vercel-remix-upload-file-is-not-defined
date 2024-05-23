import { unstable_createMemoryUploadHandler } from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import {
  json,
  unstable_parseMultipartFormData,
  type ActionFunctionArgs,
  type MetaFunction,
} from "@vercel/remix";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await unstable_parseMultipartFormData(
    request,
    unstable_createMemoryUploadHandler()
  );
  const file = formData.get("file") as File;
  const isFile = file instanceof File;

  return json({
    message: "File uploaded successfuly.",
    isFile,
    file: {
      name: file.name,
      size: file.size,
      type: file.type,
    },
  });
};

export default function Index() {
  const actionData = useActionData<typeof action>();

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>vercel/remix file upload test.</h1>

      <form action="/?index" method="post" encType="multipart/form-data">
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
