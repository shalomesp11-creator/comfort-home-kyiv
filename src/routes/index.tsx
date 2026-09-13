import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/site/site";
import { pageHead } from "@/site/meta";

export const Route = createFileRoute("/")({
  head: () => pageHead("COMFORT HOME — Ремонт квартир і будинків під ключ", "COMFORT HOME виконує ремонт квартир і будинків під ключ у Києві та області: від демонтажу до чистового оздоблення, комплектації та здачі.", "/", "/projects/varshavsky-living-hero.jpg"),
  component: HomePage,
});
