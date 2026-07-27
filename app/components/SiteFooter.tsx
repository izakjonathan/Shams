import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="siteFooter">
      <Link className="footerLogo" href="/#top">Shams for<br/>Humanity</Link>
      <div className="footerLinks">
        <div>
          <span>EXPLORE</span>
          <Link href="/#about">About</Link>
          <Link href="/#lineup">Artists</Link>
          <Link href="/#tickets">Tickets</Link>
        </div>
        <div>
          <span>INFORMATION</span>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/accessibility">Accessibility</Link>
          <Link href="/contact">Contact</Link>
        </div>
        <div>
          <span>FOLLOW</span>
          <span className="footerPlaceholder">Instagram</span>
          <span className="footerPlaceholder">Facebook</span>
        </div>
      </div>
      <div className="footerBottom">
        <span>© 2026 SHAMS FOR HUMANITY</span>
        <span>MADE WITH PURPOSE IN COPENHAGEN</span>
        <Link href="/#top">BACK TO TOP ↑</Link>
      </div>
    </footer>
  );
}
