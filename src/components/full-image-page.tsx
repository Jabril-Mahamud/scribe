import { clerkClient } from "@clerk/nextjs/server";
import { deleteImage, getImage } from "../server/queries";
import { Button } from "./ui/button";
import { redirect } from "next/navigation";

export default async function FullPageImageView(props: { id: number }) {
  const image = await getImage(props.id);
  const client = await clerkClient();
  const idAsNumber = Number(props.id);
  if (Number.isNaN(idAsNumber)) throw new Error("Invalid image id");

  const uploaderInfo = await client.users.getUser(image.userId);

  return (
    <div className="flex h-full w-full min-w-0">
      <div className="flex flex-shrink items-center justify-center">
        <img src={image.url} className="flex-shrink object-contain" />
      </div>
      <div className="flex w-48 flex-shrink-0 flex-col border-l">
        <div className="border-l p-2 text-center text-lg">{image.name}</div>

        <div className="flex flex-col p-2">
          <span>Uploaded by:</span>
          <span className="text-lg">{uploaderInfo.fullName}</span>
        </div>

        <div className="flex flex-col p-2">
          <span>Created On:</span>
          <span className="text-lg">
            {new Date(image.createdAt).toLocaleDateString()}
          </span>
        </div>

        <div className="p-2">
          <form
            action={async () => {
              "use server";

              await deleteImage(idAsNumber);
              redirect('/');

            }}
          >
            <Button type="submit" variant="destructive">
              Delete
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
