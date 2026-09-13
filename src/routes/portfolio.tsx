import { createFileRoute } from "@tanstack/react-router";
import { PortfolioPage } from "@/site/site";
import { pageHead } from "@/site/meta";

export const Route = createFileRoute("/portfolio")({
  head: () => pageHead("Портфоліо ремонтів — COMFORT HOME", "Портфоліо COMFORT HOME: реалізовані ремонти квартир, будинків, кухонь і санвузлів з фільтрами за типом обʼєкта.", "/portfolio", "/projects/varshavsky-living-green.jpg"),
  component: PortfolioPage,
});
