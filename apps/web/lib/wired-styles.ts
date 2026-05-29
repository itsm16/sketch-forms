declare global {
  namespace React {
    namespace JSX {
      interface IntrinsicElements {
        "wired-card": React.DetailedHTMLProps<
          React.HTMLAttributes<HTMLElement> & {
            elevation?: number;
            fill?: string;
          },
          HTMLElement
        >;

        "wired-button": React.DetailedHTMLProps<
          React.HTMLAttributes<HTMLElement> & {
            elevation?: number;
            disabled?: boolean;
          },
          HTMLElement
        >;

        "wired-input": React.DetailedHTMLProps<
          React.HTMLAttributes<HTMLElement> & {
            placeholder?: string;
            type?: string;
            disabled?: boolean;
            value?: string;
          },
          HTMLElement
        >;

        "wired-divider": React.DetailedHTMLProps<
          React.HTMLAttributes<HTMLElement> & {
            elevation?: number;
          },
          HTMLElement
        >;

        "wired-spinner": React.DetailedHTMLProps<
          React.HTMLAttributes<HTMLElement> & {
            spinning?: boolean;
            duration?: number;
          },
          HTMLElement
        >;

        "wired-link": React.DetailedHTMLProps<
          React.HTMLAttributes<HTMLElement> & {
            elevation?: number;
            href?: string;
            target?: string;
          },
          HTMLElement
        >;

        "wired-checkbox": React.DetailedHTMLProps<
          React.HTMLAttributes<HTMLElement> & {
            checked?: boolean;
            disabled?: boolean;
          },
          HTMLElement
        >;

        "wired-toggle": React.DetailedHTMLProps<
          React.HTMLAttributes<HTMLElement> & {
            checked?: boolean;
            disabled?: boolean;
          },
          HTMLElement
        >;

        "wired-textarea": React.DetailedHTMLProps<
          React.HTMLAttributes<HTMLElement> & {
            placeholder?: string;
            rows?: number;
            disabled?: boolean;
          },
          HTMLElement
        >;

        "wired-icon-button": React.DetailedHTMLProps<
          React.HTMLAttributes<HTMLElement> & {
            disabled?: boolean;
          },
          HTMLElement
        >;

        "wired-fab": React.DetailedHTMLProps<
          React.HTMLAttributes<HTMLElement> & {
            disabled?: boolean;
          },
          HTMLElement
        >;

        "wired-dialog": React.DetailedHTMLProps<
          React.HTMLAttributes<HTMLElement> & {
            open?: boolean;
            elevation?: number;
          },
          HTMLElement
        >;

        "wired-image": React.DetailedHTMLProps<
          React.HTMLAttributes<HTMLElement> & {
            src?: string;
            alt?: string;
          },
          HTMLElement
        >;

        "wired-calendar": React.DetailedHTMLProps<
          React.HTMLAttributes<HTMLElement> & {
            elevation?: number;
            selected?: string;
            firstdate?: string;
            lastdate?: string;
            locale?: string;
            disabled?: boolean;
            initials?: boolean;
          },
          HTMLElement
        >;
      }
    }
  }
}