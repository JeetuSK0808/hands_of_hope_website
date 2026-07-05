import { JoinBranchForm } from "./join-branch-form";

export default function JoinBranchPage() {
  return (
    <div>
      <div className="eyebrow">IV · Join a branch</div>
      <h1 className="mt-4 text-3xl font-light">Enter your branch code.</h1>
      <p className="mt-2 text-sm" style={{ color: "var(--hoh-ink-muted)" }}>
        Your Branch Leader will have shared a code. It links your account to your chapter.
      </p>
      <div className="mt-10">
        <JoinBranchForm />
      </div>
    </div>
  );
}
