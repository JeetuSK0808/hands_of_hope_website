import type * as React from "react";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src?: string;
          alt?: string;
          "camera-controls"?: boolean | "";
          "auto-rotate"?: boolean | "";
          "auto-rotate-delay"?: string | number;
          "rotation-per-second"?: string;
          "shadow-intensity"?: string | number;
          "environment-image"?: string;
          exposure?: string | number;
          "interaction-prompt"?: string;
          ar?: boolean | "";
          "touch-action"?: string;
          poster?: string;
          loading?: "auto" | "lazy" | "eager";
          reveal?: "auto" | "manual";
        },
        HTMLElement
      >;
    }
  }
}
