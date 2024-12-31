import "server-only";
import { db } from "./db";
import { auth } from "@clerk/nextjs/server";
import { images } from "./db/schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import analyticsServerClient from "./analytics";

export async function getMyImages() {
  const user = await auth();

  if (!user.userId) throw new Error("Unauthorized");

  const images = await db.query.images.findMany({
    where: (model, { eq }) => eq(model.userId, user.userId),
    orderBy: (model, { desc }) => desc(model.id),
  });
  return images;
}

export async function getImage(id: number) {
  const user = await auth();

  const image = await db.query.images.findFirst({
    where: (model, { eq }) => eq(model.id, id),
  });

  if (!image) throw new Error("Image Not found");

  if (!user.userId) throw new Error("Unauthorized");

  if (image.userId !== user.userId) {
    throw new Error("Unauthorized");
  }
  return image;
}

export async function deleteImage(id: number) {
  const user = await auth();

  const image = await db.query.images.findFirst({
    where: (model, { eq }) => eq(model.id, id),
  });

  if (!image) throw new Error("Image Not found");

  if (!user.userId) throw new Error("Unauthorized");

  if (image.userId !== user.userId) {
    throw new Error("Unauthorized");
  }

  await db
    .delete(images)
    .where(and(eq(images.id, id), eq(images.userId, user.userId)));

  analyticsServerClient.capture({
    distinctId: user.userId,
    event: "delete image 🗑️",
    properties: {
      imageId: id,
    },
  });

  // revalidatePath("/")
  redirect("/");
}

export async function getMyAudio() {
  const user = await auth();
  if (!user?.userId) throw new Error("Unauthorized");

  return await db.query.audio.findMany({
    orderBy: (model, { desc }) => desc(model.id),
});
}
