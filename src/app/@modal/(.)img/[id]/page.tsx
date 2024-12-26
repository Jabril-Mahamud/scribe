import { getImage } from "~/server/queries";
import { Modal } from "./modal";
import FullPageImageView from "~/server/full-image-page";

export default function PhotoModal({
  params: { id: photoId },
}: {
  params: { id: string };
}) {
  const idAsNumber = Number(photoId);
  if (Number.isNaN(idAsNumber)) {
    throw new Error("Invalid photo id");
  }

  const image = getImage(idAsNumber);
  return (
    <Modal>
      <FullPageImageView id={idAsNumber} />
    </Modal>
  );
}
