import { Link } from "react-router-dom";

export default function BrandLogo({
  size = "header",
  to,
}: {
  size?: "header" | "login";
  to?: string;
}) {
  const image = (
    <img
      src="/img/logo-mistikterra.png"
      alt="Mistikterra — Awakening Experiences"
      className={
        size === "login"
          ? "mx-auto h-20 w-auto max-w-[16rem] object-contain sm:h-24"
          : "h-10 w-auto max-w-[11rem] object-contain object-left sm:h-11 sm:max-w-[13rem]"
      }
    />
  );

  if (!to) {
    return image;
  }

  return (
    <Link
      to={to}
      className="flex min-h-12 items-center"
      aria-label="Mistikterra — ir a Inicio"
    >
      {image}
    </Link>
  );
}
