import Logo from "@/components/icons/Logo";
import Link from "next/link";
import s from "./Navbar.module.css";

export default function Navbar() {
  return (
    <nav className={s.root}>
      <a href="#skip" className="sr-only focus:not-sr-only">
        Skip to content
      </a>
      <div className="mx-auto max-w-6xl px-6">
        <div className="align-center relative flex flex-row justify-between py-4 md:py-6">
          <div className="flex flex-1 items-center">
            <Link href="/" className={s.logo} aria-label="Logo">
              <Logo />
            </Link>
            <nav className="ml-6 hidden space-x-2 lg:block">
              <Link href="/" className={s.link}>
                Pricing
              </Link>
            </nav>
          </div>
          <div className="flex flex-1 justify-end space-x-8">
            <Link href="/" className={s.link}>
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
