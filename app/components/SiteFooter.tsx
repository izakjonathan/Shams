import { contentRepository } from "../content";
import { FadeLink } from "./FadeLink";

export function SiteFooter() {
  const primaryNavigation = contentRepository.getPrimaryNavigation();
  const informationNavigation = contentRepository.getInformationNavigation();
  return (
    <footer className="siteFooter" id="site-footer">
      <FadeLink className="footerLogo" href="/#top">Shams for<br/>Humanity</FadeLink>
      <div className="footerLinks">
        <div>
          <span>EXPLORE</span>
          {primaryNavigation.filter((item) => item.id !== "nav-info").map((item) => (
            <FadeLink key={item.id} href={item.href}>{item.label}</FadeLink>
          ))}
        </div>
        <div>
          <span>INFORMATION</span>
          {informationNavigation.map((item) => (
            <FadeLink key={item.id} href={item.href}>{item.label}</FadeLink>
          ))}
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
