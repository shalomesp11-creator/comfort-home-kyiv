import { createFileRoute } from "@tanstack/react-router";
import { RepairsPage } from "@/site/site";
import { pageHead } from "@/site/meta";

export const Route = createFileRoute("/remonty")({
  head: () => pageHead("Ремонти під ключ для квартир і будинків — COMFORT HOME", "Ремонт квартир і будинків під ключ у Києві: демонтаж, чорнові та чистові роботи, сантехніка, електрика, оздоблення і комплектація.", "/remonty", "/projects/varshavsky-marble-kitchen.jpg"),
  component: RepairsPage,
});
