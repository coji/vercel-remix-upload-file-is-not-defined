import {
  Links,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import "./styles.css";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <>
      <header>
        <nav>
          <NavLink to="/vanilla">vanilla</NavLink>
          <NavLink to="/zod-instanceof">zod instanceof</NavLink>
          <NavLink to="/zod-custom">zod custom</NavLink>
          <NavLink to="/conform-instanceof">conform instanceof</NavLink>
          <NavLink to="/conform-custom">conform custom</NavLink>
          <NavLink to="/conform-instanceof-simple">
            conform instanceof simple
          </NavLink>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
}
