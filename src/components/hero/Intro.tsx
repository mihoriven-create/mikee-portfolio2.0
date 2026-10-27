/** A letterbox that opens once per session. Pure CSS: never blocks content or depends on JS. */
export function Intro() {
  return (
    <div className="intro" aria-hidden>
      <div className="intro__panel intro__panel--top" />
      <div className="intro__panel intro__panel--bot" />
      <div className="intro__line" />
      <p className="intro__mark label">Michael John Buencamino — Systems, connected</p>
    </div>
  );
}
