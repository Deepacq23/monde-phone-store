import { buildGeneralWhatsAppUrl } from "@/lib/whatsapp";

export function FloatingWhatsApp() {
  const url = buildGeneralWhatsAppUrl(
    "Habari Monde Phone Store, ninahitaji msaada kuhusu bidhaa zenu."
  );

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Ongea nasi kwa WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-background shadow-lg shadow-black/40 transition hover:scale-105 hover:bg-accent-hover active:scale-95 sm:bottom-6 sm:right-6"
    >
      <svg
        viewBox="0 0 32 32"
        aria-hidden="true"
        className="h-7 w-7 fill-current"
      >
        <path d="M16.004 3C9.377 3 4 8.373 4 15c0 2.28.633 4.412 1.732 6.23L4 29l7.94-1.687A11.94 11.94 0 0 0 16.004 27C22.63 27 28 21.627 28 15S22.63 3 16.004 3Zm0 21.75a9.7 9.7 0 0 1-4.95-1.36l-.355-.21-4.71 1.001 1.02-4.59-.232-.372A9.69 9.69 0 0 1 5.25 15c0-5.93 4.824-10.75 10.754-10.75S26.75 9.07 26.75 15 21.934 24.75 16.004 24.75Zm5.86-7.32c-.32-.16-1.9-.938-2.194-1.045-.294-.108-.508-.16-.722.16-.213.32-.827 1.045-1.014 1.26-.187.213-.374.24-.694.08-.32-.16-1.352-.498-2.575-1.588-.952-.85-1.594-1.9-1.782-2.22-.187-.32-.02-.492.14-.652.144-.143.32-.373.48-.56.16-.187.213-.32.32-.534.107-.213.053-.4-.027-.56-.08-.16-.722-1.74-.99-2.383-.26-.626-.526-.54-.722-.55l-.615-.011c-.213 0-.56.08-.854.4-.294.32-1.12 1.093-1.12 2.667 0 1.573 1.147 3.093 1.307 3.307.16.213 2.257 3.446 5.47 4.833.764.33 1.36.527 1.826.674.767.244 1.465.21 2.017.128.615-.092 1.9-.777 2.168-1.526.267-.75.267-1.393.187-1.527-.08-.133-.293-.213-.613-.373Z" />
      </svg>
    </a>
  );
}
