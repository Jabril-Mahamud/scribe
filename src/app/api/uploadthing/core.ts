import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "~/server/db";
import { audio, images } from "~/server/db/schema";

const f = createUploadthing();


// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  imageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 40,
    },
  })
    .middleware(async ({ req }) => {
      const user = await auth();
      if (!user?.userId) throw new Error("Unauthorized");
      return { userId: user.userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      await db.insert(images).values({
        name: file.name,
        url: file.url,
        userId: metadata.userId,
      });
    }),
  audioUploader: f({
    audio: {
      maxFileSize: "1GB",
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req }) => {
      const user = await auth();
      if (!user?.userId) throw new Error("Unauthorized");
      return { userId: user.userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      await db.insert(audio).values({
        text: file.name,
        url: file.url,
        userId: metadata.userId,
      });
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
