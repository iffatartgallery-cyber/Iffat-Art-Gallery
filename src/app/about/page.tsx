import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="mx-auto flex-1 max-w-3xl px-4 py-20 md:px-8">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">
          About the Artist
        </h1>
        <div className="mt-12 space-y-8 text-lg text-muted-foreground leading-relaxed">
          <p>
            My name is <strong>Iffat Samina</strong>. I am an artist based in
            Pakistan, specializing in original drawings and traditional mediums.
            My work explores themes of nature, human emotion, and the intricate
            details of the world around us.
          </p>
          <p>
            Each piece in this collection is an original creation, crafted with
            care and passion. I believe that art should be accessible and should
            bring a sense of wonder and beauty into everyday spaces.
          </p>
          <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-secondary">
            <img
              src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=800"
              alt="Artist at work"
              className="h-full w-full object-cover"
            />
          </div>
          <p>
            Currently, I am focusing on traditional drawings on high-quality
            paper. All artworks listed here are originals (unframed) and are
            shipped directly from my studio.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
