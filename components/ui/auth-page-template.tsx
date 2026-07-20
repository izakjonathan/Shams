import { ArrowRight, LockKeyhole, Mail, Sparkles } from "lucide-react";

export function AuthPageTemplate() {
  return (
    <section className="template template--auth">
      <div className="auth-story">
        <strong className="auth-brand"><Sparkles size={18}/> Studio</strong>
        <div><span className="template-eyebrow">Client portal</span><h2>Everything your team needs, without the noise.</h2><p>Review projects, approve work and keep every conversation in one secure place.</p></div>
        <blockquote>“Our weekly client admin dropped from hours to minutes.”<footer>— Maya, Operations Director</footer></blockquote>
      </div>
      <form className="auth-panel" onSubmit={(event)=>event.preventDefault()}>
        <header><small>Welcome back</small><h3>Sign in to your account</h3><p>Enter your details to continue.</p></header>
        <label><span>Email address</span><i><Mail size={16}/><input type="email" placeholder="name@company.com"/></i></label>
        <label><span>Password</span><i><LockKeyhole size={16}/><input type="password" placeholder="••••••••"/></i></label>
        <div className="auth-options"><label><input type="checkbox" defaultChecked/> Remember me</label><button type="button">Forgot password?</button></div>
        <button className="auth-submit">Sign in <ArrowRight size={16}/></button>
        <p className="auth-footnote">New to Studio? <button type="button">Create account</button></p>
      </form>
    </section>
  );
}
