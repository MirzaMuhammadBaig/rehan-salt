import { notFound } from "next/navigation";

// Any unknown URL inside a language (e.g. /es/abc) shows the translated 404 page.
export default function CatchAllPage() {
  notFound();
}
