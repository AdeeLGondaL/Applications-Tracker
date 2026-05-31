export function Icon({ name, className = "" }) {
  const icons = {
    dashboard: "M4 4h7v7H4V4Zm9 0h7v7h-7V4ZM4 13h7v7H4v-7Zm9 0h7v7h-7v-7Z",
    university: "M12 3 2 8l10 5 10-5-10-5Zm-6 9v5c3 2 9 2 12 0v-5",
    job: "M4 7h16v12H4V7Zm4 0V5h8v2M4 12h16",
    plus: "M12 5v14M5 12h14",
    search: "M21 21l-4.3-4.3M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z",
    download: "M12 3v12m0 0 5-5m-5 5-5-5M4 17v3h16v-3",
    upload: "M12 21V9m0 0 5 5m-5-5-5 5M4 7V4h16v3",
    edit: "M4 20h4L19 9a3 3 0 0 0-4-4L4 16v4Z",
    copy: "M8 8h12v12H8V8ZM4 4h12v12H4V4Z",
    trash: "M4 7h16M9 7V5h6v2m-8 0 1 13h8l1-13",
    link: "M10 13a5 5 0 0 0 7 0l2-2a5 5 0 0 0-7-7l-1 1M14 11a5 5 0 0 0-7 0l-2 2a5 5 0 0 0 7 7l1-1",
    close: "M6 6l12 12M18 6 6 18",
    reset: "M4 4v6h6M4 10a8 8 0 1 0 2-5",
    filter: "M4 6h16M7 12h10M10 18h4",
    calendar: "M4 5h16v15H4V5Zm4-2v4m8-4v4M4 10h16",
    check: "M20 6 9 17l-5-5",
    eye: "M2 12s3.3-7 10-7 10 7 10 7-3.3 7-10 7-10-7-10-7M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z",
    eyeOff: "M17.9 17.9A10 10 0 0 1 12 20c-7 0-11-8-11-8a18 18 0 0 1 5.1-5.9M9.9 4.2A9 9 0 0 1 12 4c7 0 11 8 11 8a18 18 0 0 1-2.2 3.2m-6.7-1a3 3 1 1 1-4.2-4.2M2 2l20 20",
    mail: "M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm0 0 8 9 8-9",
    share: "M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13",
    messageSquare: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
    shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
    sparkles: "M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .962 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.962 0z",
    sun: "M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z",
    moon: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z",
  };
  return (
    <svg className={`h-4 w-4 ${className}`.trim()} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={icons[name] || icons.dashboard} />
    </svg>
  );
}
