export default function ArtistLoading() {
  return (
    <main className="artistLoading" id="main-content" tabIndex={-1} aria-busy="true" aria-label="Loading artist page">
      <section className="artistLoadingHero">
        <div className="artistLoadingCopy">
          <span className="artistLoadingLine isShort" />
          <span className="artistLoadingTitle" />
          <span className="artistLoadingLine" />
          <span className="artistLoadingLine isMedium" />
        </div>
        <span className="artistLoadingImage" />
      </section>
      <div className="artistLoadingFacts">
        {Array.from({ length: 4 }, (_, index) => <span key={index} />)}
      </div>
    </main>
  );
}
