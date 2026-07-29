import { FadeLink } from "./FadeLink";

export function SiteFooter() {
  return (
    <footer className="siteFooter" id="site-footer">
      <FadeLink className="footerLogo" href="/#top">Shams for<br/>Humanity</FadeLink>
      <div className="footerLinks">
        <div>
          <span>EXPLORE</span>
          <FadeLink href="/#about">About</FadeLink>
          <FadeLink href="/#lineup">Artists</FadeLink>
          <FadeLink href="/#tickets">Tickets</FadeLink>
        </div>
        <div>
          <span>INFORMATION</span>
          <FadeLink href="/privacy">Privacy</FadeLink>
          <FadeLink href="/terms">Terms</FadeLink>
          <FadeLink href="/accessibility">Accessibility</FadeLink>
          <FadeLink href="/contact">Contact</FadeLink>
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
        <FadeLink href="/#top">BACK TO TOP ↑</FadeLink>
      </div>
    </footer>
  );
}
