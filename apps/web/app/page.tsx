import { ShortenerForm } from "./components/shortenerForm";
import { Window } from "@repo/ui/window";
import Image from "next/image";


export default function Page() {
  return (
    <main className="flex flex-col items-center justify-between min-h-screen relative">
      <button className="absolute top-8 right-8 bg-white text-black px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
        Log In
      </button>
      <div className="flex flex-col items-center justify-center mt-24">
        <h1 className="text-6xl font-bold text-center text-white">SHRTNR!</h1>
        <p className="text-lg text-center text-white max-w-xl mt-2">
          Transform your long links into clean, professional shortcuts perfect for social media, emails, and anywhere you need a cleaner web presence.
        </p>

        <div className="flex flex-row w-full mt-6 px-4 sm:px-6 md:px-8 lg:px-4 xl:px-0">
          <Window>
            <ShortenerForm />
          </Window>
        </div>

        <p className="text-center text-white mt-8 mb-4">
          Created by Jesus Mota
        </p>
        <div className="flex flex-row gap-6">
          <a
            href="https://github.com/VunterSlaush"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-80 transition-opacity"
          >
            <Image
              src="/github.svg"
              alt="GitHub"
              width={48}
              height={48}
            />
          </a>
          <a
            href="https://www.linkedin.com/in/jesusmota/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-80 transition-opacity"
          >
            <Image
              src="/linkedin.svg"
              alt="LinkedIn"
              width={48}
              height={48}
            />
          </a>
        </div>
      </div>
    </main>
  );
}
