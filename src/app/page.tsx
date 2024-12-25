import Link from "next/link";


const mockUrls = [
  "https://utfs.io/f/BNrDI9LKCv4yhqPKAMuGxv36oPjsFkX18SUrD2B0gqwZndMy",
  "https://utfs.io/f/BNrDI9LKCv4y0WT1TRNaRQtC2W4ynUq8hmf1EvJrdbcIBTS3",
  "https://utfs.io/f/BNrDI9LKCv4yZCvrDARL9CebOYjUPXfKm3pwAoJE4rBRg0d8"
];


const MockImages = mockUrls.map((url, index) => ({
  id: index + 1,
  url,
}));







export default function HomePage() {
  return (
    <main className="">
      <div className="flex flex-wrap gap-4">
          {MockImages.map((image) => (
            <div key={image.id} className="48">
              <img src={image.url} />
            </div>
          ))}
        Hello (Gallery in progess)
        </div>
    </main>
  );
}
