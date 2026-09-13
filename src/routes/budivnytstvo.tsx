import { createFileRoute } from "@tanstack/react-router";
import { ConstructionPage } from "@/site/site";
import { pageHead } from "@/site/meta";

export const Route = createFileRoute("/budivnytstvo")({
  head: () => pageHead("Будівництво будинків і котеджів — COMFORT HOME", "Будівництво приватних будинків і котеджів під ключ: фундамент, коробка, покрівля, фасад, інженерія, внутрішні роботи та комплектація.", "/budivnytstvo", "/projects/dibrova-bedroom.jpg"),
  component: ConstructionPage,
});
